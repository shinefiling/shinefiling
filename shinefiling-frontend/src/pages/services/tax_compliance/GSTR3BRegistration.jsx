import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X
} from 'lucide-react';
import { uploadFile, submitGstMonthlyReturn } from '../../../api';

const GSTR3BRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'monthly';
            navigate('/login', { state: { from: `/services/gst-return/gstr-3b/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(planProp || 'monthly');

    const [formData, setFormData] = useState({
        gstin: '',
        tradeName: '',
        returnType: 'GSTR-3B',
        periodMonth: new Date().getMonth() === 0 ? '12' : String(new Date().getMonth()).padStart(2, '0'),
        periodYear: String(new Date().getFullYear()),
        filingFrequency: 'Monthly',
        salesTurnover: '',
        purchaseTurnover: '', // For ITC
        nilReturn: 'No'
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        monthly: { price: 499, title: 'Monthly Filing', features: ["ITC Claim", "Tax Payment Challan", "Late Fee Check"], color: 'bg-white border-slate-200' },
        annual: { price: 4999, title: 'Annual Plan (12 Months)', features: ["Yearly Reconciliation", "Dedicated Accountant", "Priority"], recommended: true, color: 'bg-indigo-50 border-indigo-200' }
    };

    useEffect(() => { if (planProp) setSelectedPlan(planProp); }, [planProp]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.gstin) { newErrors.gstin = "GSTIN Required"; isValid = false; }
            if (!formData.tradeName) { newErrors.tradeName = "Business Name Required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.salesTurnover) { newErrors.salesTurnover = "Sales figure required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(prev => Math.min(5, prev + 1)); };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'gst_docs');
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id } }));
        } catch (error) { alert("Upload failed"); }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = { plan: selectedPlan, formData: formData, documents: docsList, status: "PAYMENT_SUCCESSFUL" };
            const response = await submitGstMonthlyReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} /> BUSINESS & PERIOD</h3>
                            <div className="space-y-4">
                                <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} placeholder="GSTIN (e.g. 29ABCDE1234F1Z5)" className={`w-full p-3 rounded-lg border uppercase ${errors.gstin ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} placeholder="Trade Name" className="w-full p-3 rounded-lg border border-gray-200" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select name="periodMonth" value={formData.periodMonth} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">{Array.from({ length: 12 }, (_, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}</select>
                                    <select name="periodYear" value={formData.periodYear} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200"><option value="2023">2023</option><option value="2024">2024</option><option value="2025">2025</option></select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><PieChart size={20} /> DATA SUMMARY</h3>
                            <div className="space-y-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Total Sales (Output Tax Liability)</label><input type="number" name="salesTurnover" value={formData.salesTurnover} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.salesTurnover ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Total Purchases (Input Tax Credit)</label><input type="number" name="purchaseTurnover" value={formData.purchaseTurnover} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Nil Return?</label><select name="nilReturn" value={formData.nilReturn} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200"><option value="No">No</option><option value="Yes">Yes</option></select></div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Upload Data</h3>
                            <div className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center mb-4">
                                <div><span className="block text-sm font-medium">Purchase / ITC Register</span><span className="text-xs text-gray-400">Excel / PDF</span></div>
                                <div className="flex items-center gap-2">{uploadedFiles['purchase_data'] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, 'purchase_data')} className="text-xs w-24" /></div>
                            </div>
                            <div className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                                <div><span className="block text-sm font-medium">Sales Summary</span><span className="text-xs text-gray-400">If different from GSTR-1</span></div>
                                <div className="flex items-center gap-2">{uploadedFiles['sales_summary'] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, 'sales_summary')} className="text-xs w-24" /></div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-4">Confirm Details</h2>
                        <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 mb-6">
                            <p className="flex justify-between text-sm"><span className="text-gray-500">GSTIN</span> <span className="font-bold">{formData.gstin}</span></p>
                            <p className="flex justify-between text-sm"><span className="text-gray-500">Period</span> <span className="font-bold">{formData.periodMonth}/{formData.periodYear}</span></p>
                            <p className="flex justify-between text-sm"><span className="text-gray-500">Plan</span> <span className="font-bold text-bronze-dark">{plans[selectedPlan].title}</span></p>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-4">Pay & File</h2>
                        <p className="text-3xl font-bold text-navy mb-6">₹{plans[selectedPlan].price}</p>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-navy text-white rounded-xl font-bold transition">{isSubmitting ? 'Processing...' : 'Proceed to Payment'}</button>
                    </div>
                );
            default: return null;
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR - DARK */}
                <div className="w-72 bg-[#043E52] flex flex-col justify-between shrink-0 relative overflow-hidden">
                    {/* Background Deco */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute right-0 top-0 w-48 h-48 bg-white blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute left-0 bottom-0 w-40 h-40 bg-bronze blur-3xl rounded-full translate-y-1/3 -translate-x-1/3"></div>
                    </div>

                    <div className="p-8 relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-3 mb-8 text-white">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <FileText size={24} className="text-bronze" />
                            </div>
                            <div>
                                <h3 className="font-bold leading-tight">GSTR-3B<br />Filing</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Compliance</p>
                            </div>
                        </div>

                        {/* Steps Navigation */}
                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/10 z-0"></div>

                            {['Business Info', 'Summary Data', 'Documents', 'Review', 'Payment'].map((step, i) => {
                                const stepNum = i + 1;
                                const isActive = currentStep === stepNum;
                                const isCompleted = currentStep > stepNum;

                                return (
                                    <div
                                        key={i}
                                        className={`relative z-10 flex items-center gap-4 cursor-pointer group ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                        onClick={() => { if (isCompleted) setCurrentStep(stepNum) }}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                                            ${isActive ? 'bg-bronze border-bronze text-white scale-110 shadow-lg shadow-bronze/30' :
                                                isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-[#043E52] border-white/20 text-white/60'}`}
                                        >
                                            {isCompleted ? <CheckCircle size={14} /> : stepNum}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                            {step}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Bottom Billing Card */}
                    <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/5 relative z-10 shrink-0">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">Total Payable</span>
                            <span className="text-lg font-bold text-bronze">₹{plans[selectedPlan]?.price.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{plans[selectedPlan]?.title}</p>
                    </div>
                </div>

                {/* RIGHT CONTENT AREA - LIGHT */}
                <div className="flex-1 flex flex-col bg-[#F2F1EF] h-full overflow-hidden relative">
                    {/* Header */}
                    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">
                            {currentStep === 1 && "Business & Period"}
                            {currentStep === 2 && "Data Summary"}
                            {currentStep === 3 && "Upload Documents"}
                            {currentStep === 4 && "Confirm Details"}
                            {currentStep === 5 && "Pay & File"}
                        </h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-500 transition">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-3xl mx-auto pb-12">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center h-full pt-12 text-center">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in spin-in-90 duration-500">
                                        <CheckCircle size={48} className="text-green-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-navy mb-2">Filing Submitted!</h2>
                                    <p className="text-gray-500 max-w-md mb-8">
                                        Your GSTR-3B request (Ref: {automationPayload?.submissionId}) has been received.
                                    </p>
                                    <button onClick={onClose} className="px-8 py-3 bg-navy text-white rounded-xl font-bold hover:bg-black transition">
                                        Return to Dashboard
                                    </button>
                                </div>
                            ) : (
                                renderStepContent()
                            )}
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    {!isSuccess && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button
                                onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                            >
                                Back
                            </button>
                            {currentStep < 5 && (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2.5 bg-[#ED6E3F] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition flex items-center gap-2 text-sm"
                                >
                                    Save & Continue <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-navy">GSTR-3B Request Submitted!</h1>
                    <p className="text-gray-500 mb-6">Ref: {automationPayload?.submissionId}</p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-navy text-white px-6 py-2 rounded-lg">Done</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                            {['Business Info', 'Summary Data', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                <div key={i} className={`px-4 py-3 rounded-xl border flex justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'border-transparent opacity-60'}`} onClick={() => currentStep > i + 1 && setCurrentStep(i + 1)}>
                                    <span className="font-bold text-sm text-navy">{step}</span>
                                    {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                </div>
                            ))}
                        </div>
                    </div>
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
            )}
        </div>
    );
};

export default GSTR3BRegistration;
