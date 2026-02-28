import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText, Scale,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, TrendingUp, Users, BookOpen, AlertTriangle, Award,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitStrikeOff } from '../../../api';

const validatePlan = (plan) => {
    return ['standard'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const StrikeOffCompanyRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        standard: { price: 4999, title: 'Strike Off (STK-2)', icon: Building2 }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planParam = searchParams.get('plan');

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || planParam));

    useEffect(() => {
        const targetPlan = validatePlan(planProp || planParam);
        if (targetPlan !== selectedPlan) {
            setSelectedPlan(targetPlan);
        }
    }, [planParam, planProp, selectedPlan]);

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        reasonForClosure: '',
        lastBusinessDate: '',
        liabilitiesCleared: false,
        bankAccountClosed: false,
        pendingLitigation: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.standard;
        const basePrice = plan.price;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);

        return {
            base: basePrice,
            platformFee,
            tax,
            gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
            if (!formData.reasonForClosure) { newErrors.reasonForClosure = "Required"; isValid = false; }
            if (!formData.liabilitiesCleared) { newErrors.liabilitiesCleared = "Must confirm"; isValid = false; }
            if (!formData.bankAccountClosed) { newErrors.bankAccountClosed = "Must confirm"; isValid = false; }
        } else if (step === 2) {
            if (!formData.lastBusinessDate) { newErrors.lastBusinessDate = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'strike_off_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id }
            }));
        } catch (error) {
            alert("Upload failed.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = {
                submissionId: `STK2-APP-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                amountPaid: billDetails.total,
                status: "PAYMENT_SUCCESSFUL"
            };
            await submitStrikeOff(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 font-poppins">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <Building2 size={16} className="text-[#ED6E3F]" /> ELIGIBILITY CONTEXT
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Active CIN</label>
                                    <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} placeholder="U12345MH..." maxLength={21} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-mono uppercase text-sm" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Full Name" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Reason for Closure</label>
                                    <select name="reasonForClosure" value={formData.reasonForClosure} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold">
                                        <option value="">-- SELECT REASON --</option>
                                        <option value="Not carrying business">Not carrying business for &gt; 2 years</option>
                                        <option value="Subscribers not paid">Subscribers not paid subscription money</option>
                                        <option value="Not commenced business">Not commenced business since incorporation</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-3 pt-2">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.liabilitiesCleared ? 'bg-green-50 border-green-200' : errors.liabilitiesCleared ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                                        <input type="checkbox" name="liabilitiesCleared" checked={formData.liabilitiesCleared} onChange={handleInputChange} className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer" />
                                        <div>
                                            <span className="font-bold text-sm text-gray-700">All Liabilities Cleared</span>
                                            <p className="text-xs text-gray-500">I confirm the company has NIL assets and NIL liabilities.</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.bankAccountClosed ? 'bg-green-50 border-green-200' : errors.bankAccountClosed ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                                        <input type="checkbox" name="bankAccountClosed" checked={formData.bankAccountClosed} onChange={handleInputChange} className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer" />
                                        <div>
                                            <span className="font-bold text-sm text-gray-700">Bank Account Closed</span>
                                            <p className="text-xs text-gray-500">I have closed the company bank account.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 font-poppins">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <Calendar size={16} className="text-[#ED6E3F]" /> ACTIVITY TIMELINE
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Date of Last Business Transaction</label>
                                    <input type="date" name="lastBusinessDate" value={formData.lastBusinessDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                </div>

                                <div className="p-4 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100 flex items-start gap-3 mt-4">
                                    <AlertTriangle size={20} className="shrink-0 mt-0.5 text-red-500" />
                                    <div>
                                        <strong className="text-red-700">Litigation Check:</strong> <br />
                                        <span className="text-red-600">Is there any pending litigation or court case against the company?</span>
                                    </div>
                                    <div className="ml-auto">
                                        <label className="flex items-center gap-2 cursor-pointer bg-red-100 px-3 py-1.5 rounded-lg border border-red-200">
                                            <input type="checkbox" name="pendingLitigation" checked={formData.pendingLitigation} onChange={handleInputChange} className="w-4 h-4 rounded text-red-500 border-red-300 cursor-pointer" />
                                            <span className="font-bold text-red-700 text-xs uppercase tracking-wider">Yes</span>
                                        </label>
                                    </div>
                                </div>
                                {formData.pendingLitigation && (
                                    <p className="text-[10px] text-red-600 mt-2 font-bold uppercase tracking-widest px-1">
                                        Warning: Application might be severely delayed or rejected due to pending litigation.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm font-poppins text-navy">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <ClipboardList size={16} className="text-[#ED6E3F]" /> REQUIRED ARTIFACTS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.statement_of_accounts ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><FileText size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Statement of Accounts</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.statement_of_accounts ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.statement_of_accounts ? 'Active' : 'Upload Copy'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'statement_of_accounts')} />
                                    </label>
                                </div>
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.indemnity_bond ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><Scale size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Indemnity Bond (STK-3)</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.indemnity_bond ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.indemnity_bond ? 'Active' : 'Upload Copy'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'indemnity_bond')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 font-poppins">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="w-20 h-20 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-orange-600 shadow-3xl shadow-orange-500/10 rotate-3">
                                <CreditCard size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-navy mb-2 tracking-tight uppercase">Closure Finalization</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-60">Complete Strike Off Fee</p>

                            <div className="bg-slate-50 p-8 rounded-3xl mb-8 space-y-4 text-sm border-2 border-white shadow-inner">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Plan</span>
                                    <span className="px-4 py-1.5 bg-navy text-white rounded-full">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex justify-between text-2xl font-black text-navy">
                                    <span className="text-[10px] self-end mb-1 text-slate-400 font-bold">TOTAL PAYABLE</span>
                                    <span>₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-navy/30 hover:bg-black transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? 'PROCESSING...' : 'AUTHORIZE STRIKE OFF'}
                                {!isSubmitting && <ArrowRight size={20} />}
                            </button>
                        </div>
                    </div>
                );

            default: return null;
        }
    }

    // --- MODAL LAYOUT: SPLIT VIEW (Left Sidebar + Right Content) ---
    return (
        <div className="flex flex-col md:flex-row h-[85vh] overflow-hidden bg-white">
            {/* LEFT SIDEBAR: DARK - Hidden on Mobile */}
            <div className="hidden md:flex w-72 bg-[#043E52] text-white flex-col p-6 shrink-0 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10 mb-8">
                    <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight text-white">
                        <Building2 className="text-[#ED6E3F]" size={20} />
                        Strike Off
                    </h1>
                    <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                        <div className="relative z-10">
                            <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Selected Plan</p>
                            <p className="font-bold text-white text-lg tracking-tight mb-4">{plans[selectedPlan]?.title}</p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                            <div className="flex justify-between items-center text-xs group">
                                <span className="text-gray-300 group-hover:text-white transition-colors">Service Fee</span>
                                <span className="text-white font-medium font-mono">₹{billDetails.base.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs group">
                                <span className="text-gray-300 group-hover:text-white transition-colors">Govt Fee & Taxes</span>
                                <span className="text-white font-medium font-mono">₹{Math.max(0, billDetails.total - billDetails.base).toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-bold text-[#ED6E3F] uppercase tracking-wider">Total Payable</span>
                                <span className="text-xl font-bold text-white leading-none">₹{billDetails.total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ED6E3F] to-transparent opacity-50"></div>
                    </div>
                </div>

                {/* VERTICAL STEPPER */}
                <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {['Eligibility', 'Activity Intel', 'Documents', 'Payment'].map((step, i) => (
                        <div key={i}
                            onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                {currentStep > i + 1 ? <CheckCircle size={12} /> : i + 1}
                            </div>
                            <span className={`text-xs font-medium ${currentStep === i + 1 ? 'text-white font-bold' : ''}`}>{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT CONTENT: FORM */}
            <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                {/* Header Bar */}
                <div className="min-h-[64px] bg-white border-b flex items-center justify-between px-4 md:px-6 py-2 shrink-0 z-20">
                    <div className="flex flex-col justify-center">
                        {/* Mobile: Detailed Service & Price Info */}
                        <div className="md:hidden flex flex-col gap-1 w-full max-w-[calc(100vw-80px)]">
                            <div className="flex items-center gap-2 truncate">
                                <span className="font-bold text-slate-800 text-sm truncate">Strike Off Company</span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                <div className="flex flex-col leading-none">
                                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Service</span>
                                    <span className="text-xs font-bold text-slate-700">₹{(billDetails.base / 1000).toFixed(1)}k</span>
                                </div>
                                <div className="w-px h-5 bg-gray-200"></div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Govt Fee</span>
                                    <span className="text-xs font-bold text-slate-700">₹{((billDetails.total - billDetails.base) / 1000).toFixed(1)}k</span>
                                </div>
                                <div className="w-px h-5 bg-gray-200"></div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Total</span>
                                    <span className="text-xs font-bold text-green-600">₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop: Step Title */}
                        <h2 className="hidden md:block font-bold text-slate-800 text-lg">
                            {currentStep === 1 && "Check Eligibility"}
                            {currentStep === 2 && "Company Activity"}
                            {currentStep === 3 && "Document Evidence"}
                            {currentStep === 4 && "Complete Payment"}
                        </h2>
                    </div>

                    <button onClick={onClose || (() => navigate(-1))} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {isSuccess ? (
                        <div className="text-center py-10">
                            <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                            <p className="text-gray-500 mt-2">Check dashboard for status updates.</p>
                            <button onClick={onClose || (() => navigate(-1))} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Proceed to Dashboard</button>
                        </div>
                    ) : (
                        renderStepContent()
                    )}
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
                        {currentStep < 4 && (
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
};

export default StrikeOffCompanyRegistration;
