import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X
} from 'lucide-react';
import { uploadFile, submitGstMonthlyReturn } from '../../../api';

const GSTR1Registration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'monthly';
            navigate('/login', { state: { from: `/services/gst-return/gstr-1/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(planProp || 'monthly');

    const [formData, setFormData] = useState({
        gstin: '',
        tradeName: '',
        returnType: 'GSTR-1', // Fixed
        periodMonth: new Date().getMonth() === 0 ? '12' : String(new Date().getMonth()).padStart(2, '0'),
        periodYear: String(new Date().getFullYear()),
        filingFrequency: 'Monthly',
        turnover: '',
        invoiceCount: '',
        nilReturn: 'No'
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans Configuration
    const plans = {
        monthly: {
            price: 499,
            title: 'Monthly Filing',
            features: [
                "Sales Invoice Upload", "HSN Summary", "B2B & B2C Filing"
            ],
            color: 'bg-white border-slate-200'
        },
        quarterly: {
            price: 1199,
            title: 'Quarterly Filing',
            features: [
                "3 Months Filing", "QRMP Support", "IFF Support"
            ],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        }
    };

    useEffect(() => {
        if (planProp) setSelectedPlan(planProp);
    }, [planProp]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.gstin) { newErrors.gstin = "GSTIN is required"; isValid = false; }
            if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
                newErrors.gstin = "Invalid GSTIN Format"; // Basic Regex
                isValid = false;
            }
            if (!formData.tradeName) { newErrors.tradeName = "Business name requested"; isValid = false; }
            if (!formData.periodMonth) { newErrors.periodMonth = "Select Month"; isValid = false; }
        }

        if (step === 2) {
            if (!formData.turnover) { newErrors.turnover = "Required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'gst_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Try again.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                plan: selectedPlan,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitGstMonthlyReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-navy" /> BUSINESS & PERIOD</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">GSTIN Number</label>
                                    <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} maxLength={15} placeholder="e.g. 29ABCDE1234F1Z5" className={`w-full p-3 rounded-lg border uppercase ${errors.gstin ? 'border-red-500' : 'border-gray-200'}`} />
                                    {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
                                </div>
                                <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} placeholder="Trade / Business Name" className={`w-full p-3 rounded-lg border ${errors.tradeName ? 'border-red-500' : 'border-gray-200'}`} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Month</label>
                                        <select name="periodMonth" value={formData.periodMonth} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                            {Array.from({ length: 12 }, (_, i) => {
                                                const d = new Date(0, i);
                                                return <option key={i} value={String(i + 1).padStart(2, '0')}>{d.toLocaleString('default', { month: 'long' })}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Year</label>
                                        <select name="periodYear" value={formData.periodYear} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Filing Frequency</label>
                                    <select name="filingFrequency" value={formData.filingFrequency} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly (QRMP)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Turnover & Data
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><PieChart size={20} className="text-purple-600" /> TURNOVER DETAILS</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Total Taxable Sales (₹)</label>
                                    <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.turnover ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Total Invoice Count (Approx)</label>
                                    <input type="number" name="invoiceCount" value={formData.invoiceCount} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Is this a Nil Return?</label>
                                    <select name="nilReturn" value={formData.nilReturn} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="No">No, I have sales</option>
                                        <option value="Yes">Yes, Nil Return</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Required Documents</h3>
                            <div className="grid md:grid-cols-1 gap-4">
                                <div className="border border-dashed p-4 rounded-lg flex justify-between items-center bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-gray-400" />
                                        <div>
                                            <span className="text-sm font-medium text-gray-600 block">Sales Register / Invoice Data</span>
                                            <span className="text-xs text-gray-400">Excel or PDF format supported</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {uploadedFiles['sales_data'] && <CheckCircle size={16} className="text-bronze" />}
                                        <input type="file" onChange={(e) => handleFileUpload(e, 'sales_data')} className="text-xs w-24" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Filing</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Return Period</span>
                                <span className="font-bold">{formData.periodMonth} / {formData.periodYear}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">GSTIN</span>
                                <span className="font-bold font-mono">{formData.gstin}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Selected Plan</span>
                                <span className="font-bold text-bronze-dark">{plans[selectedPlan].title}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 text-center">By continuing, you verify that the information provided is correct.</p>
                    </div>
                );

            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                        </button>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6 transition-all' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Filing Request Submitted!</h1>
                    <p className="text-gray-500 mb-8">Order ID: <span className="font-mono font-bold">{automationPayload?.submissionId || 'PENDING'}</span></p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
                            <h1 className="text-3xl font-bold text-navy">GSTR-1 Filing</h1>
                        </div>
                        {isModal && <button onClick={onClose}><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Info', 'Turnover', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'border-transparent opacity-60'}`} onClick={() => currentStep > i + 1 && setCurrentStep(i + 1)}>
                                        <span className="font-bold text-sm text-navy">{step}</span>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 rounded-2xl border shadow-sm bg-white relative">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Plan</div>
                                <div className="text-xl font-bold text-navy">₹{plans[selectedPlan].price}</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-navy text-white rounded-xl font-bold shadow-lg flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GSTR1Registration;
