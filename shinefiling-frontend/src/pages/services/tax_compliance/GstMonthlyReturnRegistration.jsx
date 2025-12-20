import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, PieChart, Shield
} from 'lucide-react';
import { uploadFile, submitGstMonthlyReturn } from '../../../api'; // Need to add to api.js

const GstMonthlyReturnRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/gst-monthly-return/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        gstin: '',
        tradeName: '',
        filingPeriodMonth: new Date().toLocaleString('default', { month: 'long' }),
        filingPeriodYear: new Date().getFullYear().toString(),
        returnFrequency: 'Monthly',
        isNilReturn: false,
        totalSales: '',
        totalPurchases: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const plans = {
        basic: {
            price: 499,
            title: 'Basic Plan',
            features: ["GSTR-1 & 3B Filing"],
            color: 'bg-white border-gray-200'
        },
        standard: {
            price: 1499,
            title: 'Standard Plan',
            features: ["Everything in Basic", "ITC Reconciliation", "Query Handling"],
            recommended: true,
            color: 'bg-red-50 border-red-200'
        },
        premium: {
            price: 3499,
            title: 'Premium Plan',
            features: ["Everything in Standard", "Compliance Dashboard", "Audit Report"],
            color: 'bg-orange-50 border-orange-200'
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: val });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Info
            if (!formData.gstin) { newErrors.gstin = "GSTIN required"; isValid = false; }
            if (!formData.tradeName) { newErrors.tradeName = "Trade Name required"; isValid = false; }
        }

        if (step === 2) { // Data Upload
            /* Ideally check if sales data is uploaded if not NIL return */
            const salesUploaded = uploadedFiles['sales_data'];
            if (!formData.isNilReturn && !salesUploaded) {
                // Warning rather than error maybe? Let's make it error for clarity
                newErrors.salesData = "Please upload sales invoice data or select NIL Return.";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'gst_return_data');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
            if (key === 'sales_data') setErrors(prev => ({ ...prev, salesData: null }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Business & Period
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {isModal && (
                        <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                    
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-red-600" /> BUSINESS & PERIOD</h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">GSTIN</label>
                                    <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.gstin ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. 29AAAAA0000A1Z5" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Trade Name</label>
                                    <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.tradeName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Filing Month</label>
                                    <select name="filingPeriodMonth" value={formData.filingPeriodMonth} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Year</label>
                                    <select name="filingPeriodYear" value={formData.filingPeriodYear} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Frequency</label>
                                    <select name="returnFrequency" value={formData.returnFrequency} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Data Upload
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-red-600" /> UPLOAD INVOICE DATA</h3>

                            <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                                <input type="checkbox" name="isNilReturn" checked={formData.isNilReturn} onChange={handleInputChange} className="w-5 h-5 text-red-600 rounded" />
                                <label className="text-sm font-bold text-gray-700">File NIL Return (No Sales/Purchase)</label>
                            </div>

                            {!formData.isNilReturn && (
                                <div className="space-y-4">
                                    <div className={`border border-dashed p-6 rounded-xl text-center group hover:border-red-300 transition ${errors.salesData ? 'border-red-500 bg-red-50' : ''}`}>
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">Upload Annual Sales Data</span>
                                            <span className="text-xs text-gray-400 block mb-4">Excel or JSON format supported</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'sales_data')} accept=".xlsx,.xls,.json,.csv" />
                                            {uploadedFiles['sales_data'] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['sales_data'].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                        {errors.salesData && <p className="text-red-500 text-xs mt-2">{errors.salesData}</p>}
                                    </div>

                                    <div className="border border-dashed p-6 rounded-xl text-center group hover:border-red-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-red-500 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">Upload Purchase Data (Optional)</span>
                                            <span className="text-xs text-gray-400 block mb-4">For ITC Reconciliation</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'purchase_data')} accept=".xlsx,.xls,.json,.csv" />
                                            {uploadedFiles['purchase_data'] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['purchase_data'].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4 mt-6 border-t pt-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Summary Sales Value (Optional)</label>
                                    <input type="number" name="totalSales" value={formData.totalSales} onChange={handleInputChange} placeholder="Approx Sales" className="w-full p-3 rounded-lg border border-gray-200" disabled={formData.isNilReturn} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Summary Purchase Value (Optional)</label>
                                    <input type="number" name="totalPurchases" value={formData.totalPurchases} onChange={handleInputChange} placeholder="Approx Purchases" className="w-full p-3 rounded-lg border border-gray-200" disabled={formData.isNilReturn} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-black text-[#2B3446] mb-6">Review Filing Details</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-red-600">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan Amount</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()} / mo</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">GSTIN</span>
                                    <span className="font-bold">{formData.gstin}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Period</span>
                                    <span className="font-bold">{formData.filingPeriodMonth} {formData.filingPeriodYear}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Return Type</span>
                                    <span className="font-bold">{formData.isNilReturn ? 'NIL Return' : 'Regular Return'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Complete payment to initiate filing process.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );

            default: return null;
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
                submissionId: `GSTR-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: {
                    ...formData,
                    salesDataUrl: uploadedFiles['sales_data']?.fileUrl,
                    purchaseDataUrl: uploadedFiles['purchase_data']?.fileUrl
                },
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

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Return Filing Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        We have received your data for <span className="font-bold text-[#2B3446]">{formData.filingPeriodMonth} {formData.filingPeriodYear}</span>.
                        <br />Our experts are verifying your invoices.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">File Monthly Return</h1>
                        <p className="text-gray-500">GSTR-1 & GSTR-3B</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Info', 'Upload Data', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-red-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 4 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>

                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GstMonthlyReturnRegistration;
