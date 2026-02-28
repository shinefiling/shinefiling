import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Store, Building, Globe, Zap, AlertTriangle, BookOpen, Clock, Building2, Utensils, ClipboardList, CreditCard, X
} from 'lucide-react';
import { uploadFile, submitFssaiLicense } from '../../../api';

const validatePlan = (plan) => {
    return ['basic', 'state', 'central', 'renewal'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'basic';
};

const FSSAILicenseRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const pricing = {
        basic: { serviceFee: 1499, title: "Basic Registration", icon: Utensils },
        state: { serviceFee: 4999, title: "State License", icon: Store },
        central: { serviceFee: 7499, title: "Central License", icon: Globe },
        renewal: { serviceFee: 999, title: "License Renewal", icon: Clock }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const typeParam = searchParams.get('type') || searchParams.get('plan');

    const [currentStep, setCurrentStep] = useState(1);
    const [licenseType, setLicenseType] = useState(() => validatePlan(planProp || typeParam));

    useEffect(() => {
        const targetPlan = validatePlan(planProp || typeParam);
        if (targetPlan !== licenseType) {
            setLicenseType(targetPlan);
        }
    }, [typeParam, planProp, licenseType]);

    const [formData, setFormData] = useState({
        businessName: '',
        gstNumber: '',
        businessType: '',
        turnover: '',
        validityYears: '1',
        address: '',
        foodCategory: '',
        isImporterExporter: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Auto-calculate license type based on turnover input
    useEffect(() => {
        if (!formData.turnover) return;
        if (licenseType === 'renewal') return;

        if (formData.isImporterExporter) {
            setLicenseType('central');
            return;
        }

        const t = parseFloat(formData.turnover);
        if (isNaN(t)) return;

        if (t > 200000000) {
            if (licenseType !== 'central') setLicenseType('central');
        } else if (t > 1200000) {
            if (licenseType !== 'central' && licenseType !== 'state') setLicenseType('state');
        } else {
            if (licenseType !== 'basic') setLicenseType('basic');
        }
    }, [formData.turnover, formData.isImporterExporter, licenseType]);

    const billDetails = useMemo(() => {
        const plan = pricing[licenseType] || pricing.basic;
        const basePrice = plan.serviceFee;
        const platformFee = Math.round(basePrice * 0.03);
        const tax = Math.round(basePrice * 0.03);
        const gst = Math.round(basePrice * 0.09);

        // Govt fees vary. We add it as a dummy logic or just show service fee breakdown.
        // Assuming govt fee is extra and fixed roughly or we just show base price total.
        const govtFee = typeof plan.govtFee === 'number' ? plan.govtFee : 0; // if we want to add

        return {
            base: basePrice,
            platformFee,
            tax,
            gst,
            govtFee: govtFee,
            total: basePrice + platformFee + tax + gst + govtFee
        };
    }, [licenseType]);


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.businessName) { newErrors.businessName = "Required"; isValid = false; }
            if (!formData.businessType) { newErrors.businessType = "Required"; isValid = false; }
            if (!formData.turnover) { newErrors.turnover = "Required"; isValid = false; }
        } else if (step === 2) {
            if (!formData.address) { newErrors.address = "Required"; isValid = false; }
            if (!formData.foodCategory) { newErrors.foodCategory = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'fssai_docs');
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
        setApiError(null);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = {
                submissionId: `FSSAI-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: licenseType,
                amountPaid: billDetails.total,
                businessName: formData.businessName,
                businessType: formData.businessType,
                businessCategory: formData.foodCategory,
                annualTurnover: parseFloat(formData.turnover),
                validityYears: parseInt(formData.validityYears),
                licenseType: licenseType.toUpperCase(),
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };
            await submitFssaiLicense(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            setApiError(error.message);
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
                                <Store size={16} className="text-[#ED6E3F]" /> BUSINESS CONTEXT
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="As per documents" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Entity Type</label>
                                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-bold">
                                        <option value="">-- SELECT CONSTITUTION --</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership / LLP</option>
                                        <option value="Private Limited">Private Limited Company</option>
                                        <option value="One Person Company">One Person Company</option>
                                    </select>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Turnover</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</span>
                                        <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} placeholder="Expected Annual Turnover" className="w-full p-3 pl-8 bg-slate-50 border border-gray-200 rounded-xl font-bold text-sm" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1 mt-1">This determines your license type.</p>
                                </div>

                                <div className="md:col-span-2 space-y-3 pt-2">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.isImporterExporter ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-slate-50 border-gray-200 hover:border-orange-300'}`}>
                                        <input type="checkbox" name="isImporterExporter" checked={formData.isImporterExporter} onChange={handleInputChange} className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer" />
                                        <div>
                                            <span className="font-bold text-sm text-gray-800">Import / Export Business</span>
                                            <p className="text-xs text-gray-500">Check this if involved in import/export (Triggers Central License).</p>
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
                                <MapPin size={16} className="text-[#ED6E3F]" /> PREMISES & SCOPE
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Registered Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Full address of the food premises..." className="w-full p-4 bg-slate-50 border border-gray-200 rounded-2xl text-[11px] font-bold text-slate-700 leading-relaxed" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Food Categories</label>
                                    <input type="text" name="foodCategory" value={formData.foodCategory} onChange={handleInputChange} placeholder="e.g. Dairy, Read-to-eat, Beverages" className="w-full p-4 bg-slate-50 border border-gray-200 rounded-2xl text-[11px] font-black text-navy uppercase tracking-widest" />
                                </div>
                                <div className="space-y-1 pt-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2 block">Required Validity</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(y => (
                                            <button key={y} type="button" onClick={() => setFormData({ ...formData, validityYears: y })} className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${formData.validityYears == y ? 'bg-[#ED6E3F] text-white border-transparent shadow-md shadow-orange-500/20 scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200'}`}>
                                                {y} Year
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm font-poppins text-navy">
                            <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center gap-2">
                                <ClipboardList size={16} className="text-[#ED6E3F]" /> COMPLIANCE DOCUMENTS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.owner_photo ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><FileText size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2B3446]">Owner Photo</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.owner_photo ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.owner_photo ? 'Active' : 'Upload Copy'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'owner_photo')} accept=".jpg,.png" />
                                    </label>
                                </div>
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 transition-all ${uploadedFiles.premises_proof ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-orange-300'}`}>
                                    <div className="p-4 rounded-xl bg-white shadow-sm text-slate-400"><Building2 size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2B3446]">Premises Proof</p>
                                    <label className="cursor-pointer">
                                        <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${uploadedFiles.premises_proof ? 'bg-green-600 text-white' : 'bg-navy text-white'}`}>
                                            {uploadedFiles.premises_proof ? 'Active' : 'Upload proof'}
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'premises_proof')} accept=".pdf,.jpg" />
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
                            <h2 className="text-2xl font-black text-navy mb-2 tracking-tight uppercase">License Processing</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-60">FSSAI Fee Settlement</p>

                            <div className="bg-slate-50 p-8 rounded-3xl mb-8 space-y-4 text-sm border-2 border-white shadow-inner">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Plan</span>
                                    <span className="px-4 py-1.5 bg-navy text-white rounded-full">{pricing[licenseType].title}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                    <span>Govt Fee</span>
                                    <span className="text-navy font-bold">Based on {formData.validityYears} Yr</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between text-2xl font-black text-navy">
                                    <span className="text-[10px] self-end mb-1 text-slate-400 font-bold">SERVICE TOTAL</span>
                                    <span>₹{billDetails.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-navy/30 hover:bg-black transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? 'PROCESSING...' : 'AUTHORIZE FSSAI FILING'}
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
                        <Utensils className="text-[#ED6E3F]" size={20} />
                        FSSAI License
                    </h1>
                    <div className="mt-6 p-5 bg-[#064e66] rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                        <div className="relative z-10">
                            <p className="text-[10px] uppercase text-gray-300 tracking-widest font-bold mb-1.5 opacity-80">Detected Tier</p>
                            <p className="font-bold text-white text-lg tracking-tight mb-4">{pricing[licenseType]?.title}</p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                            <div className="flex justify-between items-center text-xs group">
                                <span className="text-gray-300 group-hover:text-white transition-colors">Service Fee</span>
                                <span className="text-white font-medium font-mono">₹{billDetails.base.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs group">
                                <span className="text-gray-300 group-hover:text-white transition-colors">Govt Fee Info</span>
                                <span className="text-white font-medium font-mono">Extra</span>
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
                    {['Business Profile', 'Location Setup', 'Artifacts', 'Settlement'].map((step, i) => (
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
                                <span className="font-bold text-slate-800 text-sm truncate">FSSAI License</span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 w-fit">
                                <div className="flex flex-col leading-none">
                                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Service</span>
                                    <span className="text-xs font-bold text-slate-700">₹{(billDetails.base / 1000).toFixed(1)}k</span>
                                </div>
                                <div className="w-px h-5 bg-gray-200"></div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Govt Fee</span>
                                    <span className="text-xs font-bold text-slate-700">Extra</span>
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
                            {currentStep === 1 && "Business Details"}
                            {currentStep === 2 && "Operations Scope"}
                            {currentStep === 3 && "Verified Documents"}
                            {currentStep === 4 && "Application Payment"}
                        </h2>
                    </div>

                    <button onClick={onClose || (() => navigate(-1))} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 ml-4">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {apiError && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                            <AlertTriangle size={20} />
                            <span className="text-sm font-bold">{apiError}</span>
                        </div>
                    )}
                    {isSuccess ? (
                        <div className="text-center py-10 font-poppins">
                            <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-black text-navy uppercase">FSSAI Registration Submitted!</h2>
                            <p className="text-gray-500 mt-2 font-bold mb-6">License Type: {pricing[licenseType].title}</p>
                            <button onClick={onClose || (() => navigate('/dashboard'))} className="mt-6 px-6 py-3 bg-navy text-white rounded-xl font-bold uppercase tracking-widest text-[#FFF]">Proceed to Dashboard</button>
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
                                Continue Application <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FSSAILicenseRegistration;
