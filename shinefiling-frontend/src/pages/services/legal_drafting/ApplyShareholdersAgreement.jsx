import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, ChevronRight, ArrowRight,
    Save, Shield, CreditCard, Lock, Info, Award, User, X, Briefcase, PieChart, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitShareholdersAgreement } from '../../../api';
import { uploadFile } from '../../../utils/uploadFile';

// Pricing Configuration
const pricing = {
    review: { serviceFee: 2499, title: "Review", subtitle: "Review Existing Draft" },
    standard: { serviceFee: 4999, title: "Standard", subtitle: "Comprehensive Draft" },
    premium: { serviceFee: 9999, title: "Premium", subtitle: "Complex / Investor Support" }
};

const ApplyShareholdersAgreement = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPlan = planProp || queryParams.get('plan') || 'standard';

    const [step, setStep] = useState(1);
    const [plan, setPlan] = useState(initialPlan);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        companyName: '',
        shareholderNames: '',
        shareCapitalDetails: '',
        otherRequirements: '',
        email: '',
        mobile: ''
    });

    const [documents, setDocuments] = useState({
        moaAoa: null,
        capTable: null,
        termSheet: null
    });

    // Load User Data
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    email: user.email || '',
                    mobile: user.mobile || ''
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!isModal) window.scrollTo(0, 0);
    }, [step, isModal]);

    // Bill Details
    const billDetails = useMemo(() => {
        const selectedPricing = pricing[plan] || pricing.standard;
        const basePrice = selectedPricing.serviceFee;

        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.18);         // 18% GST
        const total = basePrice + platformFee + tax;

        return {
            base: basePrice,
            platformFn: platformFee,
            tax: tax,
            total: total,
            planName: selectedPricing.title,
            planSubtitle: selectedPricing.subtitle
        };
    }, [plan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, docType) => {
        if (e.target.files && e.target.files[0]) {
            setDocuments(prev => ({ ...prev, [docType]: e.target.files[0] }));
        }
    };

    const validateStep = (currentStep) => {
        setError(null);
        switch (currentStep) {
            case 1: // Plan Selection
                return null;
            case 2: // Details
                if (!formData.companyName) return "Company Name is required.";
                if (!formData.shareholderNames) return "Shareholder Names are required.";
                if (!formData.shareCapitalDetails) return "Share Capital Details are required.";
                if (!formData.mobile || formData.mobile.length !== 10) return "Valid Mobile Number is required.";
                return null;
            case 3: // Documents (Optional)
                return null;
            default:
                return null;
        }
    };

    const handleNext = () => {
        const validationError = validateStep(step);
        if (validationError) {
            setError(validationError);
            return;
        }
        setStep(prev => Math.min(5, prev + 1));
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const uploadedDocsList = [];

            // Upload Documents
            const uploadPromises = Object.entries(documents).map(async ([key, file]) => {
                if (file) {
                    try {
                        const uploadRes = await uploadFile(file, 'shareholders-agreement');
                        return {
                            id: key,
                            filename: uploadRes.originalName || file.name,
                            fileUrl: uploadRes.fileUrl,
                            type: key
                        };
                    } catch (e) {
                        console.error(`Failed to upload ${key}`, e);
                        return null;
                    }
                }
                return null;
            });

            const uploadedResults = await Promise.all(uploadPromises);
            uploadedResults.forEach(doc => {
                if (doc) uploadedDocsList.push(doc);
            });

            // Prepare Payload
            const finalPayload = {
                submissionId: `SHAREHOLDER-${Date.now()}`,
                userEmail: formData.email,
                plan: plan,
                amountPaid: billDetails.total,
                status: "INITIATED",
                formData: {
                    ...formData,
                    selectedPlan: billDetails.planName
                },
                documents: uploadedDocsList,
                automationQueue: []
            };

            // API Call
            await submitShareholdersAgreement(finalPayload);

            // Redirect
            if (isModal) {
                onClose();
                navigate('/dashboard?tab=orders');
            } else {
                navigate('/dashboard?tab=orders');
            }

        } catch (err) {
            console.error("Submission Error", err);
            setError(err.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Select Plan', 'Company Details', 'Documents', 'Review', 'Payment'];

    const renderStepContent = () => {
        switch (step) {
            case 1: // Service Selection
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <PieChart size={20} className="text-blue-600" /> SELECT PLAN
                            </h3>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3 mb-6">
                                <Info className="text-blue-600 mt-0.5 shrink-0" size={18} />
                                <p className="text-sm text-blue-800">
                                    <strong>Review</strong> for checking existing drafts. <strong>Standard</strong> for drafting from scratch. <strong>Premium</strong> for complex negotiations & investor meetings.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {Object.entries(pricing).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setPlan(key)}
                                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${plan === key
                                            ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                                    >
                                        <div>
                                            <div className={`font-bold text-base ${plan === key ? 'text-navy' : 'text-slate-700'}`}>{val.title}</div>
                                            <div className="text-xs text-slate-500 font-medium">{val.subtitle}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-blue-600 font-bold">₹{val.serviceFee}</div>
                                            {plan === key && <CheckCircle size={16} className="text-blue-600 ml-auto mt-1" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 2: // Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-bronze" /> COMPANY DETAILS
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white" placeholder="Name of your Company" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Shareholders Names</label>
                                    <textarea name="shareholderNames" value={formData.shareholderNames} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white resize-none" rows="3" placeholder="List all Full Names, Check for Spelling" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Share Capital Structure</label>
                                    <textarea name="shareCapitalDetails" value={formData.shareCapitalDetails} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white resize-none" rows="3" placeholder="Auth. Capital, Paid-up Capital, Face Value" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Specific Requirements</label>
                                    <textarea name="otherRequirements" value={formData.otherRequirements} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white resize-none" rows="2" placeholder="Start-up India, ROFR details, etc." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Mobile Number</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-slate-400 font-bold">+91</span>
                                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={10} className="w-full pl-12 p-3 rounded-lg border border-gray-200 bg-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-orange-500" /> UPLOAD DOCUMENTS
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Optional: Upload MOA/AOA, Cap Table, or Term Sheet.</p>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'moaAoa', label: 'MOA & AOA', icon: FileText },
                                    { id: 'capTable', label: 'Cap Table (Equity)', icon: PieChart },
                                    { id: 'termSheet', label: 'Term Sheet (If Any)', icon: FileText }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <doc.icon size={20} className="text-gray-400 group-hover:text-blue-500" />
                                            <div>
                                                <p className="text-sm font-bold text-navy">{doc.label}</p>
                                                {documents[doc.id] ? (
                                                    <p className="text-xs text-green-600 font-medium mt-0.5">{documents[doc.id].name.substring(0, 30)}...</p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 mt-0.5">Upload File</p>
                                                )}
                                            </div>
                                        </div>
                                        <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition shadow-sm">
                                            {documents[doc.id] ? 'Change' : 'Select'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, doc.id)} accept="image/*,application/pdf" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Review Details</h2>
                        <p className="text-gray-500 mb-8">Verify your information before payment.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200 text-left">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Plan</span><span className="font-bold">{billDetails.planName}</span></div>
                                <div className="flex justify-between"><span>Company</span><span className="font-bold">{formData.companyName}</span></div>
                                <div className="flex justify-between"><span>Mobile</span><span className="font-bold">{formData.mobile}</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={handleBack} className="py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50">Edit</button>
                            <button onClick={() => setStep(5)} className="py-3 bg-navy text-white rounded-xl font-bold hover:bg-black transition">Proceed to Pay</button>
                        </div>
                    </div>
                );

            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Award size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Checkout</h2>
                        <p className="text-gray-500 mb-8">Complete payment to start drafting.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Drafting Fee</span><span>₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Tax (18%)</span><span>₹{billDetails.tax}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Platform Fee</span><span>₹{billDetails.platformFn}</span></div>
                            <div className="border-t pt-2 mt-2 flex justify-between items-end"><span className="text-gray-500 font-bold">Total</span><span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>

                        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                            {loading ? 'Processing...' : `Pay ₹${billDetails.total} & Submit`}
                            {!loading && <Lock size={18} />}
                        </button>
                    </div>
                );

            default: return null;
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight">
                            <span className="text-[#ED6E3F]">Shareholders</span> Agrmt
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Plan</p>
                            <p className="font-bold text-white leading-tight">{billDetails.planName}</p>
                            <p className="text-[#ED6E3F] font-bold mt-1">₹{billDetails.total.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {steps.map((s, i) => (
                            <div key={i} onClick={() => { if (step > i + 1) setStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${step === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === i + 1 ? 'bg-[#ED6E3F] text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                    {step > i + 1 ? <CheckCircle size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${step === i + 1 ? 'text-white font-bold' : ''}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                        <div className="flex justify-between items-end">
                            <div><p className="text-[10px] text-blue-200 uppercase">Total Payable</p><p className="text-xl font-bold text-white">₹{billDetails.total.toLocaleString()}</p></div>
                        </div>
                    </div>
                </div>
                {/* RIGHT CONTENT */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">{steps[step - 1]}</h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition"><X size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {renderStepContent()}
                    </div>
                    {step < 4 && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button onClick={() => setStep(p => Math.max(1, p - 1))} disabled={step === 1} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30">Back</button>
                            <button onClick={handleNext} className="px-6 py-2.5 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm">Next Step <ArrowRight size={16} /></button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 pl-1">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition">
                        <ArrowLeft size={14} /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-navy">Shareholders Agreement</h1>
                    <p className="text-gray-500">Legal drafting services for companies.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT SIDEBAR */}
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                            {steps.map((s, i) => (
                                <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${step === i + 1 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                        <span className={`font-bold text-sm ${step === i + 1 ? 'text-blue-800' : 'text-gray-600'}`}>{s}</span>
                                    </div>
                                    {step > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-2xl border shadow-sm bg-[#043E52] text-white relative overflow-hidden transition-all sticky top-24">
                            <div className="relative z-10">
                                <div className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Selected Plan</div>
                                <div className="text-xl font-bold mb-2">{billDetails.planName}</div>
                                <div className="text-3xl font-black mb-4">₹{billDetails.total?.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex-1">
                        {renderStepContent()}

                        {step < 4 && (
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setStep(p => Math.max(1, p - 1))} disabled={step === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyShareholdersAgreement;
