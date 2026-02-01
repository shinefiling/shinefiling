import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, Building2, Layers,
    X, Info, Shield, Zap, Search, ClipboardList, Clock
} from 'lucide-react';
import { uploadFile, submitAnnualRocFiling } from '../../../api';

const AnnualROCRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/roc-filing/annual-return/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'standard');

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        financialYear: '2023-2024',
        agmDate: '',
        companyType: 'Private Limited',
        paidUpCapital: '',
        turnover: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const plans = {
        basic: { price: 3999, title: 'Basic Plan', features: ["AOC-4 & MGT-7/7A", "MCA Upload", "SRN Receipt"] },
        standard: { price: 6999, title: 'Standard Plan', features: ["Director's Report Prep", "Auditor Coordination", "Everything in Basic"], recommended: true },
        premium: { price: 11999, title: 'Premium Plan', features: ["AGM Compliance Support", "AGM Notice Handling", "Everything in Standard"] }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 2) { // Company Details
            if (!formData.companyName) { newErrors.companyName = "Required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "Required"; isValid = false; }
            if (formData.cin && formData.cin.length !== 21) { newErrors.cin = "Must be 21 chars"; isValid = false; }
            if (!formData.paidUpCapital) { newErrors.paidUpCapital = "Required"; isValid = false; }
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
            const response = await uploadFile(file, 'annual_roc_docs');
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
            alert("File upload failed. Please try again.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                type: k.toUpperCase(),
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `ROC-ANNUAL-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || '',
                amountPaid: plans[selectedPlan].price,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            await submitAnnualRocFiling(finalPayload);
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
            case 1: // Plan Selection
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            <h3 className="font-black text-2xl text-navy mb-8 flex items-center gap-3">
                                <Zap size={28} className="text-amber-500" /> SELECT COMPLIANCE TIER
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                {Object.entries(plans).map(([key, plan]) => (
                                    <motion.div
                                        key={key}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedPlan(key)}
                                        className={`relative p-6 rounded-[35px] border-2 cursor-pointer transition-all ${selectedPlan === key ? 'border-amber-500 bg-amber-50/50 shadow-xl shadow-amber-500/10' : 'border-gray-100 bg-white hover:border-amber-200'}`}
                                    >
                                        {plan.recommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">Most Popular</div>}
                                        <div className="mb-6">
                                            <h4 className="font-black text-navy text-xl tracking-tight">{plan.title}</h4>
                                        </div>
                                        <div className="mb-8">
                                            <span className="text-4xl font-black text-navy tracking-tighter italic">₹{plan.price.toLocaleString()}</span>
                                            <span className="text-[10px] text-gray-500 font-bold ml-2">+ Govt Fees</span>
                                        </div>
                                        <ul className="space-y-4 mb-2">
                                            {plan.features.map(f => (
                                                <li key={f} className="flex items-start gap-2 text-[10px] font-black text-gray-600 leading-relaxed uppercase tracking-wide">
                                                    <CheckCircle size={14} className="text-amber-500 shrink-0 mt-0.5" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 2: // Company Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-10 rounded-[45px] border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            <h3 className="font-black text-2xl text-navy mb-10 flex items-center gap-3">
                                <Building2 size={32} className="text-amber-500" /> CORPORATE IDENTITY
                            </h3>

                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
                                <div className="space-y-6">
                                    <div className="space-y-2 font-poppins">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">COMPANY CIN (21 DIGITS)</label>
                                        <div className="relative">
                                            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} placeholder="U12345DL2024PTC123456" maxLength={21} className={`w-full p-6 pl-14 bg-gray-50 rounded-[25px] border-2 font-mono tracking-widest uppercase text-lg font-black text-navy transition-all ${errors.cin ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-amber-500 focus:bg-white'}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">REGISTERED COMPANY NAME</label>
                                        <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="As per MCA records" className={`w-full p-6 bg-gray-50 rounded-[25px] border-2 font-black text-navy transition-all ${errors.companyName ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-amber-500 focus:bg-white'}`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">ENTITY STRUCTURE</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Private Limited', 'OPC', 'Public Limited', 'Section 8'].map(type => (
                                                <button key={type} onClick={() => setFormData({ ...formData, companyType: type })} className={`py-4 rounded-[20px] border-2 font-black text-[10px] transition-all uppercase tracking-widest ${formData.companyType === type ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'border-gray-50 bg-gray-50 text-gray-400 hover:bg-white'}`}>
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">FINANCIAL YEAR</label>
                                        <select name="financialYear" value={formData.financialYear} onChange={handleInputChange} className="w-full p-6 bg-gray-50 rounded-[25px] border-2 border-transparent focus:border-amber-500 focus:bg-white font-black text-navy outline-none appearance-none cursor-pointer">
                                            <option value="2023-2024">FY 2023-2024</option>
                                            <option value="2022-2023">FY 2022-2023</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">PAID-UP CAPITAL (₹)</label>
                                            <input type="number" name="paidUpCapital" value={formData.paidUpCapital} onChange={handleInputChange} placeholder="0" className={`w-full p-6 bg-gray-50 rounded-[25px] border-2 font-black text-navy transition-all ${errors.paidUpCapital ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-amber-500 focus:bg-white'}`} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">TURNOVER (₹)</label>
                                            <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} placeholder="0" className={`w-full p-6 bg-gray-50 rounded-[25px] border-2 font-black text-navy transition-all ${errors.turnover ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-amber-500 focus:bg-white'}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">AGM CONDUCT DATE (IF ANY)</label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="date" name="agmDate" value={formData.agmDate} onChange={handleInputChange} className="w-full p-6 pl-14 bg-gray-50 rounded-[25px] border-2 border-transparent focus:border-amber-500 focus:bg-white font-black text-navy outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Upload Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 font-poppins text-navy">
                        <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm">
                            <h3 className="font-black text-2xl mb-10 flex items-center gap-3">
                                <ClipboardList size={32} className="text-amber-500" /> COMPLIANCE REPOSITORY
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { id: 'pl_bs', label: 'P&L Statement & BS', icon: Layers, mandatory: true },
                                    { id: 'audit_report', label: 'Auditor Report', icon: Shield, mandatory: true },
                                    { id: 'notes_accounts', label: 'Notes to Accounts', icon: FileText, mandatory: true },
                                    { id: 'cash_flow', label: 'Cash Flow Statement', icon: Layers, mandatory: false },
                                    { id: 'director_report', label: "Director's Report", icon: ClipboardList, mandatory: false },
                                    { id: 'agm_minutes', label: 'AGM Notice & Minutes', icon: Clock, mandatory: false },
                                ].map((doc) => (
                                    <div key={doc.id} className="group relative">
                                        <label className="cursor-pointer block h-full">
                                            <div className={`p-8 bg-gray-50 rounded-[35px] border-2 border-dashed transition-all text-center h-full ${uploadedFiles[doc.id] ? 'border-green-500 bg-green-50' : 'border-gray-200 group-hover:border-amber-400 group-hover:bg-white'}`}>
                                                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all ${uploadedFiles[doc.id] ? 'bg-green-500 text-white' : 'bg-white text-gray-400 group-hover:text-amber-500 group-hover:scale-110'}`}>
                                                    <doc.icon size={28} />
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest block mb-1">{doc.label}</span>
                                                    {doc.mandatory && <span className="text-[7px] font-black text-amber-600 uppercase tracking-widest mb-4">MANDATORY</span>}
                                                </div>
                                                <div className="flex justify-center mt-auto">
                                                    {uploadedFiles[doc.id] ?
                                                        <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20">Saved ✓</span> :
                                                        <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select File</span>
                                                    }
                                                </div>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 p-6 bg-slate-50 text-slate-500 rounded-[30px] border border-slate-100 flex items-start gap-4">
                                <Info size={24} className="shrink-0 mt-1" />
                                <div className="text-[10px] font-black leading-relaxed uppercase tracking-widest">
                                    <p className="opacity-70">MCA portal filing is handled manually by our CS desk after ensuring all documents are signed via DSC.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="space-y-6 animate-in zoom-in-95 font-poppins text-navy">
                        <div className="bg-white p-12 rounded-[60px] border border-gray-100 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10">
                                <span className="px-5 py-2.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-[0.3em] italic">FILING SUMMARY</span>
                            </div>

                            <h2 className="text-4xl font-black mb-12 tracking-tight underline decoration-amber-500 decoration-8 underline-offset-8">Final Review</h2>

                            <div className="grid md:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 border-l-4 border-amber-500 ml-1">Entity Profile</label>
                                        <div className="bg-slate-50 p-8 rounded-[40px] space-y-5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Name</span>
                                                <span className="font-black text-lg uppercase truncate max-w-[200px]">{formData.companyName}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">CIN</span>
                                                <span className="font-black font-mono tracking-widest uppercase">{formData.cin}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200">
                                                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Filing FY</span>
                                                <span className="font-black text-amber-600 uppercase tracking-widest">{formData.financialYear}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 border-l-4 border-amber-500 ml-1">Package ROI</label>
                                        <div className="bg-navy p-8 rounded-[40px] text-white shadow-2xl shadow-navy/20">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-black text-xl text-amber-500 uppercase italic tracking-tighter">{plans[selectedPlan].title}</h4>
                                                <div className="text-right">
                                                    <span className="text-3xl font-black italic tracking-tighter">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[8px] font-black opacity-60 uppercase tracking-widest">
                                                <Shield size={12} className="text-amber-500" /> MCA Portal Submission by Experts
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 border-l-4 border-amber-500 ml-1">Statutory Statistics</label>
                                    <div className="p-10 border-4 border-slate-50 rounded-[50px] space-y-8 h-full bg-slate-50/20">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid-up Capital</p>
                                            <p className="font-black text-2xl italic tracking-tighter">₹{Number(formData.paidUpCapital || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Turnover</p>
                                            <p className="font-black text-2xl italic tracking-tighter text-amber-600">₹{Number(formData.turnover || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-2 pt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Files Dispatched</p>
                                                <p className="font-black text-lg">{Object.keys(uploadedFiles).length} Operational Files</p>
                                            </div>
                                            <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-amber-500">
                                                <Layers size={28} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Payment
                return (
                    <div className="flex items-center justify-center animate-in zoom-in-95 font-poppins text-navy">
                        <div className="max-w-xl w-full bg-white p-12 rounded-[60px] shadow-3xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500"></div>

                            <div className="w-28 h-28 bg-amber-50 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-amber-500 shadow-xl shadow-amber-500/5 -rotate-6">
                                <IndianRupee size={56} className="font-black" />
                            </div>

                            <h2 className="text-4xl font-black mb-4 tracking-tighter">Filing Authorization</h2>
                            <p className="text-slate-500 text-sm font-bold mb-12 uppercase tracking-widest opacity-60 italic">Compliance Fee + Professional Assistance</p>

                            <div className="bg-slate-50 p-10 rounded-[45px] mb-12 border-2 border-white shadow-inner">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">TOTAL AUDIT & FILING COST</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-7xl font-black italic tracking-tighter">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                    <span className="text-sm font-black text-slate-400 self-end mb-4 tracking-tighter uppercase opacity-50">+ Govt Fees</span>
                                </div>
                            </div>

                            <button
                                onClick={submitApplication}
                                disabled={isSubmitting}
                                className="group w-full py-7 bg-amber-500 text-white rounded-[35px] font-black text-xl shadow-3xl shadow-amber-500/30 hover:bg-black transition-all flex items-center justify-center gap-6 relative overflow-hidden"
                            >
                                <span className="relative z-10 tracking-widest uppercase text-sm">{isSubmitting ? 'PROCESSING COMPLIANCE...' : 'DISPATCH FILING TO CS DESK'}</span>
                                {!isSubmitting && <ArrowRight size={28} className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" />}
                            </button>

                            <div className="mt-10 flex items-center justify-center gap-6 opacity-30 grayscale underline decoration-amber-500 transition-all">
                                <Shield size={20} />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] font-mono">ENCRYPTED CORPORATE FILING HUB</span>
                            </div>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-0 md:p-6" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {isSuccess ? (
                <div className="max-w-5xl mx-auto bg-white p-16 md:p-24 rounded-[70px] shadow-3xl text-center relative overflow-hidden font-poppins text-navy">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>

                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-40 h-40 bg-amber-500 rounded-[50px] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-amber-500/30"
                    >
                        <CheckCircle size={80} className="text-white" />
                    </motion.div>

                    <h1 className="text-5xl font-black mb-8 tracking-tighter uppercase italic">Filing In Queue!</h1>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-16 font-black leading-relaxed opacity-60 uppercase tracking-widest italic">
                        Company <span className="text-amber-600 underline decoration-4 underline-offset-4">{formData.companyName}</span> successfully queued for FY {formData.financialYear} ROC Compliance.
                        A Company Secretary will confirm DSC readiness shortly.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-4 bg-navy text-white px-12 py-6 rounded-[30px] font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-navy/20">
                            Dashboard <ArrowRight size={20} />
                        </button>
                        <button onClick={onClose || (() => navigate('/'))} className="bg-white border-4 border-slate-100 text-slate-400 px-12 py-6 rounded-[30px] font-black text-sm uppercase tracking-[0.2em] hover:border-amber-500 hover:text-amber-500 transition-all">
                            Exit Interface
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto font-poppins text-navy">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-slate-400 mb-6 font-black text-[10px] uppercase tracking-[0.4em] hover:text-amber-600 transition-all group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> CANCEL OPERATION
                            </button>
                            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Annual <span className="text-amber-500">ROC Filing</span></h1>
                            <p className="text-slate-400 font-black text-[10px] mt-2 uppercase tracking-[0.5em] block border-l-4 border-amber-500 pl-4">AOC-4 & MGT-7 STATUTORY INTERFACE</p>
                        </div>

                        {isModal && (
                            <button onClick={onClose} className="w-14 h-14 bg-white rounded-[20px] shadow-2xl flex items-center justify-center text-slate-400 hover:text-amber-500 hover:rotate-90 transition-all duration-500 border border-slate-100">
                                <X size={24} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-5">
                                {[
                                    { label: 'Select Tier', icon: Zap },
                                    { label: 'Corporate ID', icon: Building2 },
                                    { label: 'Statutory Docs', icon: Layers },
                                    { label: 'Verify Audit', icon: Shield },
                                    { label: 'CS Submission', icon: Briefcase }
                                ].map((step, i) => (
                                    <div key={i} className={`px-6 py-5 rounded-[25px] border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-navy border-navy shadow-3xl shadow-navy/20 text-white' : 'bg-transparent border-transparent opacity-30 scale-95'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${currentStep === i + 1 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40' : 'bg-slate-100 text-slate-400'}`}>
                                                <step.icon size={20} />
                                            </div>
                                            <div>
                                                <span className={`text-[8px] font-black block uppercase tracking-widest ${currentStep === i + 1 ? 'text-white/40' : 'text-slate-300'}`}>PHASE 0{i + 1}</span>
                                                <span className={`font-black text-[11px] uppercase tracking-wider ${currentStep === i + 1 ? 'text-white' : 'text-navy'}`}>{step.label}</span>
                                            </div>
                                        </div>
                                        {currentStep > i + 1 ? <CheckCircle size={18} className="text-green-500" /> : currentStep === i + 1 ? <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div> : null}
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-amber-500 rounded-[45px] text-white shadow-2xl shadow-amber-500/30 italic">
                                <Clock size={32} className="mb-6 opacity-40" />
                                <h4 className="font-black text-lg mb-4 uppercase tracking-tighter">FILING DUE DATES</h4>
                                <ul className="text-[8px] font-black opacity-80 leading-relaxed uppercase tracking-widest space-y-2">
                                    <li>• AOC-4: 30 days from AGM</li>
                                    <li>• MGT-7: 60 days from AGM</li>
                                    <li>• LATE FEE: ₹100 / DAY PER FORM</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>

                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-16 flex justify-between items-center pt-10 border-t-4 border-slate-50">
                                    <button
                                        onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                        className={`flex items-center gap-3 px-10 py-5 rounded-[25px] font-black text-[10px] uppercase tracking-[0.3em] transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                                    >
                                        <ArrowLeft size={18} /> Previous Phase
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        className="group flex items-center gap-6 px-16 py-6 bg-navy text-white rounded-[30px] font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/20 hover:bg-black transition-all"
                                    >
                                        Proceed Stage <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
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

export default AnnualROCRegistration;
