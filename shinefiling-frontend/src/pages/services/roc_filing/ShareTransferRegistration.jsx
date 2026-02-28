
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, TrendingUp, Users,
    X, Info, Shield, Zap, Search, ClipboardList, Clock, CreditCard
} from 'lucide-react';
import { uploadFile, submitShareTransfer } from '../../../api';

const validatePlan = (plan) => {
    return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
};

const ShareTransferRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        basic: { price: 999, title: 'Expert Consult', icon: Info },
        standard: { price: 2499, title: 'Single Transfer', icon: Zap },
        premium: { price: 4999, title: 'Bulk Execution', icon: Briefcase }
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
        transferDate: '',
        numberOfShares: '',
        pricePerShare: '',
        transferorName: '',
        transferorPan: '',
        transfereeName: '',
        transfereePan: '',
        transfereeEmail: '',
        transfereeMobile: ''
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
            if (!formData.numberOfShares) { newErrors.numberOfShares = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.transferorName) { newErrors.transferorName = "Required"; isValid = false; }
            if (!formData.transfereeName) { newErrors.transfereeName = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'share_transfer_docs');
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
            const consideration = (parseInt(formData.numberOfShares) || 0) * (parseFloat(formData.pricePerShare) || 0);
            const finalPayload = {
                submissionId: `ROCSHARE-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                amountPaid: billDetails.total,
                considerationAmount: consideration,
                status: "PAYMENT_SUCCESSFUL"
            };
            await submitShareTransfer(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Transfer Details
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 font-poppins">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#ED6E3F]" /> SHARE ALLOTMENT CONTEXT
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Filing Company</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Full Registered Name" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Qty of Shares</label>
                                    <input type="number" name="numberOfShares" value={formData.numberOfShares} onChange={handleInputChange} placeholder="0" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-black" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Price per Share (₹)</label>
                                    <input type="number" name="pricePerShare" value={formData.pricePerShare} onChange={handleInputChange} placeholder="0.00" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-black" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Deed Execution Date</label>
                                    <input type="date" name="transferDate" value={formData.transferDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold" />
                                </div>

                                {formData.numberOfShares && (
                                    <div className="md:col-span-2 p-4 bg-orange-50 rounded-xl border border-orange-100 text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 italic">
                                        <Briefcase size={14} /> Est. Transfer Value: ₹{((formData.numberOfShares || 0) * (formData.pricePerShare || 0)).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 2: // Parties
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 font-poppins">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <Users size={16} className="text-[#ED6E3F]" /> TRANSFECTOR PROFILES
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">The Transferor</h4>
                                    <input type="text" name="transferorName" value={formData.transferorName} onChange={handleInputChange} placeholder="Seller Name" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                                    <input type="text" name="transferorPan" value={formData.transferorPan} onChange={handleInputChange} placeholder="Seller PAN" maxLength={10} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono uppercase" />
                                </div>
                                <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest">The Transferee</h4>
                                    <input type="text" name="transfereeName" value={formData.transfereeName} onChange={handleInputChange} placeholder="Buyer Name" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold" />
                                    <input type="text" name="transfereePan" value={formData.transfereePan} onChange={handleInputChange} placeholder="Buyer PAN" maxLength={10} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono uppercase" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Uploads
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-navy font-poppins">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <ClipboardList size={16} className="text-[#ED6E3F]" /> SH-4 DOCUMENTATION
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.certificate ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><FileText size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">Share Certificate</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.certificate ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.certificate ? 'Change File' : 'Upload Copy'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'certificate')} />
                                    </label>
                                </div>
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.sh4 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><Briefcase size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">Draft SH-4 Deed</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.sh4 ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.sh4 ? 'Change File' : 'Upload Draft'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'sh4')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 font-poppins">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="w-20 h-20 bg-orange-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 text-orange-600 shadow-3xl shadow-orange-500/10 rotate-3">
                                <CreditCard size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-navy mb-2 tracking-tight uppercase italic">Filing Dispatch</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60 italic underline decoration-orange-500 underline-offset-4">SH-4 Execution Service Fee</p>

                            <div className="bg-slate-50 p-8 rounded-3xl mb-8 space-y-4 text-sm border-2 border-white shadow-inner">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Plan Tier</span>
                                    <span className="px-4 py-1.5 bg-navy text-white rounded-full italic">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex justify-between text-2xl font-black text-navy italic underline decoration-[#ED6E3F] decoration-4 underline-offset-8">
                                    <span className="text-[10px] self-end mb-1 text-slate-400 not-italic font-bold">SETTLEMENT</span>
                                    <span>₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-navy/30 hover:bg-black transition-all flex items-center justify-center gap-3 italic"
                            >
                                {isSubmitting ? 'PROCESSING TRANSFER...' : 'AUTHENTICATE DEED FILING'}
                                {!isSubmitting && <ArrowRight size={20} />}
                            </button>
                        </div>
                    </div>
                );

            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-6xl h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                {/* LEFT SIDEBAR */}
                <div className="hidden md:flex w-80 bg-[#043E52] text-white flex-col p-8 shrink-0 relative overflow-hidden font-poppins">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 mb-12">
                        <h1 className="font-black text-xl flex items-center gap-3 tracking-tighter uppercase italic text-white/90">
                            <TrendingUp size={24} className="text-[#ED6E3F]" /> SHARE MOVE
                        </h1>
                        <div className="mt-8 p-6 bg-[#064e66] rounded-3xl border border-white/10 shadow-inner relative overflow-hidden group">
                            <p className="text-[10px] uppercase text-gray-400 tracking-[0.2em] font-black mb-2 opacity-70 italic">Filing Selection</p>
                            <p className="font-black text-white text-xl tracking-tight mb-6 uppercase italic leading-tight">{plans[selectedPlan]?.title}</p>
                            <div className="space-y-3 pt-5 border-t border-white/10 italic">
                                <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
                                    <span>Total Payable</span>
                                    <span className="text-white font-mono font-black">₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 relative z-10 overflow-y-auto custom-scrollbar">
                        {['Transaction Context', 'Parties Details', 'Artifact Upload', 'Final Authorization'].map((step, i) => (
                            <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${currentStep === i + 1 ? 'bg-white/10 text-white shadow-xl' : 'text-blue-200/50 grayscale opacity-60'}`}>
                                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/10'}`}>
                                    {currentStep > i + 1 ? <CheckCircle size={14} /> : i + 1}
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.1em]">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 flex flex-col h-full bg-[#fcfcfc]">
                    <div className="h-20 bg-white border-b flex items-center justify-between px-8 py-2 shrink-0 z-20">
                        <h2 className="hidden md:block font-black text-navy text-xl uppercase tracking-tighter flex items-center gap-3 underline decoration-orange-500 decoration-4 underline-offset-8 italic">
                            {currentStep === 1 && "Transfer Matrix"}
                            {currentStep === 2 && "Profiles Match"}
                            {currentStep === 3 && "Legacy Validation"}
                            {currentStep === 4 && "Queue Placement"}
                        </h2>
                        <button onClick={onClose || (() => navigate(-1))} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-12">
                        {isSuccess ? (
                            <div className="max-w-2xl mx-auto text-center py-20 font-poppins">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-8 shadow-3xl" />
                                <h1 className="text-4xl font-black text-navy mb-4 tracking-tighter uppercase italic">Phase Complete!</h1>
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest opacity-60 mb-12 italic leading-relaxed">SUCCESSFULLY QUEUED TRANSFER FOR {formData.numberOfShares} SHARES IN {formData.companyName}.</p>
                                <button onClick={() => navigate('/dashboard')} className="bg-navy text-white px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-3xl">Go to Vault</button>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto h-full flex flex-col text-navy">
                                <div className="flex-1">{renderStepContent()}</div>
                                <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100 italic">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="text-slate-400 text-[10px] font-black uppercase tracking-widest disabled:opacity-0">Rollback Step</button>
                                    {currentStep < 4 && (
                                        <button onClick={handleNext} className="px-10 py-5 bg-[#ED6E3F] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-3">Save & Advance <ArrowRight size={18} /></button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareTransferRegistration;
