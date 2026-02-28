import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, TrendingUp, Users, BookOpen,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitMoaAoaAmendment } from '../../../api';

const validatePlan = (plan) => {
    return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const AOAAmendmentRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        basic: { price: 999, title: 'Consultation', icon: Info },
        standard: { price: 2999, title: 'Clause Amendment (AOA)', icon: BookOpen },
        premium: { price: 3999, title: 'AOA Adoption (New Table F)', icon: Briefcase }
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
        amendmentType: 'AOA',
        reasonForAmendment: '',
        existingClause: '',
        proposedClause: '',
        meetingDate: ''
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
            if (!formData.reasonForAmendment) { newErrors.reasonForAmendment = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.existingClause) { newErrors.existingClause = "Required"; isValid = false; }
            if (!formData.proposedClause) { newErrors.proposedClause = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'aoa_amendment_docs');
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
                submissionId: `ROC-AOA-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                amountPaid: billDetails.total,
                status: "PAYMENT_SUCCESSFUL"
            };
            await submitMoaAoaAmendment(finalPayload);
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
                                <Building2 size={16} className="text-[#ED6E3F]" /> COMPLIANCE SETUP
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Company CIN</label>
                                    <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} placeholder="U12345MH..." maxLength={21} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-mono uppercase text-sm" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Filing Company</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Full Registered Name" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Reason for Amendment</label>
                                    <select name="reasonForAmendment" value={formData.reasonForAmendment} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold">
                                        <option value="">-- SELECT REASON --</option>
                                        <option value="Change Share Transfer Rules">Change Share Transfer Rules</option>
                                        <option value="Change Board Meeting Rules">Change Board Meeting Rules</option>
                                        <option value="Adopt New AOA (Table F)">Adopt New AOA (Table F)</option>
                                        <option value="Remove Private Company Restrictions">Remove Private Company Restrictions</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 font-poppins">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <BookOpen size={16} className="text-[#ED6E3F]" /> CLAUSE SPECIFICS
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Existing Clause (Reference)</label>
                                    <textarea name="existingClause" value={formData.existingClause} onChange={handleInputChange} rows={3} placeholder="Copy paste the existing clause from AOA..." className="w-full p-4 bg-slate-50 border border-gray-200 rounded-2xl text-[11px] font-medium leading-relaxed" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Proposed New Clause</label>
                                    <textarea name="proposedClause" value={formData.proposedClause} onChange={handleInputChange} rows={4} placeholder="Draft the new clause..." className="w-full p-4 bg-navy/5 border border-navy/10 rounded-2xl text-[11px] font-black text-navy leading-relaxed" />
                                </div>
                                <div className="p-4 bg-blue-50 text-blue-800 text-xs rounded-xl border border-blue-100 font-medium">
                                    <strong>Note:</strong> Any clause restricting share transfer must clearly specify the conditions. AOA cannot completely ban share transfers in a Private Limited Company.
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm font-poppins">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <ClipboardList size={16} className="text-[#ED6E3F]" /> UPLOAD DOCUMENTS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.special_resolution ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><FileText size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Special Resolution</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.special_resolution ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.special_resolution ? 'Swap File' : 'Upload Copy'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'special_resolution')} />
                                    </label>
                                </div>
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.existing_aoa ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><Briefcase size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Existing AOA</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.existing_aoa ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.existing_aoa ? 'Swap File' : 'Upload Copy'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'existing_aoa')} />
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
                            <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-orange-600 shadow-3xl shadow-orange-500/10 rotate-3">
                                <CreditCard size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-navy mb-2 tracking-tight uppercase italic">Finalize Amendment</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60 italic underline decoration-orange-500 underline-offset-4">Legal Draft & Filing Setup</p>

                            <div className="bg-slate-50 p-8 rounded-3xl mb-8 space-y-4 text-sm border-2 border-white shadow-inner">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Plan</span>
                                    <span className="px-4 py-1.5 bg-navy text-white rounded-full italic">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex justify-between text-2xl font-black text-navy italic underline decoration-[#ED6E3F] decoration-4 underline-offset-8">
                                    <span className="text-[10px] self-end mb-1 text-slate-400 not-italic font-bold">TOTAL</span>
                                    <span>₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-navy/30 hover:bg-black transition-all flex items-center justify-center gap-3 italic"
                            >
                                {isSubmitting ? 'PROCESSING...' : 'AUTHORIZE AOA CHANGE'}
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
                        <BookOpen className="text-[#ED6E3F]" size={20} />
                        AOA Amendment
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
                    {['Entity Sync', 'Clause Specifics', 'Upload Docs', 'Payment'].map((step, i) => (
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
                                <span className="font-bold text-slate-800 text-sm truncate">AOA Amendment</span>
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
                            {currentStep === 1 && "Amendment Details"}
                            {currentStep === 2 && "Textual Revision"}
                            {currentStep === 3 && "Document Uploads"}
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

export default AOAAmendmentRegistration;
