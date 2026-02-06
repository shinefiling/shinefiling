
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, Users, Plus, Trash2, Receipt
} from 'lucide-react';
import { uploadFile, submitOnePersonCompanyRegistration } from '../../../api';

// --- CONSTANTS MOVED OUTSIDE COMPONENT ---
const plans = {
    startup: {
        price: 4999,
        title: 'Startup Plan',
        features: ["1 DSC & 1 DIN", "Name Approval", "Certificate of Incorporation", "MOA & AOA Drafting", "PAN & TAN"],
        color: 'bg-white border-slate-200'
    },
    growth: { // Using 'growth' key to align with standard tiers, maps to 'OPC Standard'
        price: 6999,
        title: 'OPC Standard',
        features: ["Everything in Startup", "Nominee Consent Filing", "Share Certificate", "PAN & TAN Allocation", "GST & Bank Account"],
        recommended: true,
        color: 'bg-indigo-50 border-indigo-200'
    },
    enterprise: {
        price: 12999,
        title: 'Elite Plan',
        features: ["Everything in Standard", "GST Registration", "MSME (Udyam) Registration", "Bank Account (Full Support)", "First Board Resolution"],
        color: 'bg-purple-50 border-purple-200'
    }
};

const validatePlan = (plan) => {
    return ['startup', 'growth', 'enterprise'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'startup';
};

const PLATFORM_FEE = 499;
const GST_RATE = 0.18;

const OnePersonCompanyRegistration = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planParam = searchParams.get('plan');

    // Protect Route
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = planParam || 'startup';
            navigate('/login', { state: { from: `/services/one-person-company/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, planParam, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    // Initialize state with validation run once
    const [selectedPlan, setSelectedPlan] = useState(() => validatePlan(planProp || planParam));

    // Optimised Plan Sync: STRICT CHECK to prevent loops
    useEffect(() => {
        const targetPlan = validatePlan(planProp || planParam);
        if (targetPlan !== selectedPlan) {
            setSelectedPlan(targetPlan);
        }
    }, [planParam, planProp, selectedPlan]);

    const [formData, setFormData] = useState({
        companyNames: ['', ''],
        businessActivity: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        ownershipStatus: 'rented',
        authorizedCapital: '100000',
        paidUpCapital: '100000',
        director: { name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', address: '' },
        nominee: { name: '', relationship: '', dob: '', pan: '', aadhaar: '', email: '', phone: '' },
        bankPreference: '',
        turnoverEstimate: '',
        accountingStartDate: '',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Memoize bill details
    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan] || plans.startup;
        const basePrice = plan.price;

        // Split 15% Markup: Platform Fee (3%), Tax (3%), GST (9%)
        const platformFee = Math.round(basePrice * 0.03); // 3%
        const tax = Math.round(basePrice * 0.03);         // 3%
        const gst = Math.round(basePrice * 0.09);         // 9%

        return {
            base: basePrice,
            platformFn: platformFee,
            tax: tax,
            gst: gst,
            total: basePrice + platformFee + tax + gst
        };
    }, [selectedPlan]);

    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section === 'companyNames') {
            const index = parseInt(name);
            const newNames = [...formData.companyNames];
            newNames[index] = value;
            setFormData({ ...formData, companyNames: newNames });
        } else if (section === 'director') {
            setFormData({ ...formData, director: { ...formData.director, [name]: value } });
        } else if (section === 'nominee') {
            setFormData({ ...formData, nominee: { ...formData.nominee, [name]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.director.name) { newErrors.directorName = "Required"; isValid = false; }
            if (!formData.director.email) { newErrors.directorEmail = "Required"; isValid = false; }
            if (!formData.director.phone) { newErrors.directorPhone = "Required"; isValid = false; }
            if (!formData.director.pan) { newErrors.directorPan = "Required"; isValid = false; }
            if (!formData.companyNames[0]) { newErrors.companyName1 = "Required"; isValid = false; }
            if (!formData.businessActivity) { newErrors.businessActivity = "Required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.nominee.name) { newErrors.nomineeName = "Nominee Name Required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(5, prev + 1));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            let category = 'opc_docs';
            const response = await uploadFile(file, category);
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName, fileUrl: response.fileUrl, fileId: response.id } }));
        } catch (error) {
            alert("Upload failed.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = {
                submissionId: `OPC-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.director.email,
                formData: formData,
                documents: docsList,
                paymentDetails: billDetails,
                status: "PAYMENT_SUCCESSFUL"
            };
            const response = await submitOnePersonCompanyRegistration(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><User size={16} /> DIRECTOR (OWNER) DETAILS</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input name="name" value={formData.director.name} onChange={(e) => handleInputChange(e, 'director')} placeholder="Full Name" className={`p-2 text-sm border rounded-lg ${errors.directorName ? 'border-red-500' : ''}`} />
                            <input name="email" value={formData.director.email} onChange={(e) => handleInputChange(e, 'director')} placeholder="Email" className={`p-2 text-sm border rounded-lg ${errors.directorEmail ? 'border-red-500' : ''}`} />
                            <input name="phone" value={formData.director.phone} onChange={(e) => handleInputChange(e, 'director')} placeholder="Mobile" className={`p-2 text-sm border rounded-lg ${errors.directorPhone ? 'border-red-500' : ''}`} />
                            <input name="pan" value={formData.director.pan} onChange={(e) => handleInputChange(e, 'director')} placeholder="PAN Number" className={`p-2 text-sm border rounded-lg ${errors.directorPan ? 'border-red-500' : ''}`} />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><Building size={16} /> COMPANY DETAILS</h3>
                        <div className="grid gap-3">
                            <input name="0" value={formData.companyNames[0]} onChange={(e) => handleInputChange(e, 'companyNames')} placeholder="Proposed OPC Name 1" className={`w-full p-2 text-sm border rounded-lg ${errors.companyName1 ? 'border-red-500' : ''}`} />
                            <input name="1" value={formData.companyNames[1]} onChange={(e) => handleInputChange(e, 'companyNames')} placeholder="Proposed OPC Name 2 (Optional)" className="w-full p-2 text-sm border rounded-lg" />
                            <textarea name="businessActivity" value={formData.businessActivity} onChange={handleInputChange} placeholder="Main Business Activity..." className={`w-full p-2 text-sm border rounded-lg ${errors.businessActivity ? 'border-red-500' : ''}`} rows="2"></textarea>
                            <input name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Registered Address" className="w-full p-2 text-sm border rounded-lg" />
                        </div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm flex items-center gap-2"><Users size={16} /> NOMINEE DETAILS</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input name="name" value={formData.nominee.name} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Nominee Name" className={`w-full p-2 text-sm border rounded-lg ${errors.nomineeName ? 'border-red-500' : ''}`} />
                            <input name="relationship" value={formData.nominee.relationship} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Relationship" className="w-full p-2 text-sm border rounded-lg" />
                            <input name="pan" value={formData.nominee.pan} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Nominee PAN" className="w-full p-2 text-sm border rounded-lg" />
                        </div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-3 text-sm">UPLOAD DOCUMENTS</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {['Director PAN', 'Director Aadhaar', 'Director Photo', 'Address Proof'].map((doc, i) => {
                                const key = doc.toLowerCase().replace(/ /g, '_');
                                return (
                                    <div key={i} className="border border-dashed p-3 rounded-lg flex justify-between items-center text-sm">
                                        <span>{doc}</span>
                                        <div className="flex items-center gap-2">
                                            {uploadedFiles[key] && <CheckCircle size={14} className="text-bronze" />}
                                            <input type="file" onChange={(e) => handleFileUpload(e, key)} className="text-[10px] w-20" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            );
            case 4: return (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-navy mb-4">Confirm Details</h2>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between"><span>Plan</span><span className="font-bold text-navy">{plans[selectedPlan]?.title}</span></div>
                        <div className="flex justify-between"><span>Director</span><span className="font-bold">{formData.director.name}</span></div>
                        <div className="flex justify-between"><span>Nominee</span><span className="font-bold">{formData.nominee.name}</span></div>
                    </div>
                </div>
            );
            case 5: return (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                    <Receipt size={32} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-xl font-bold text-navy mb-4">Payment Summary</h2>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2">
                        <div className="flex justify-between text-sm"><span>Base</span><span className="font-bold">₹{billDetails.base.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee (3%)</span><span className="font-bold">₹{billDetails.platformFn}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax (3%)</span><span className="font-bold">₹{billDetails.tax.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>GST (9%)</span><span className="font-bold">₹{billDetails.gst.toLocaleString()}</span></div>
                        <div className="flex justify-between text-lg font-black text-navy border-t pt-2 mt-2"><span>Total</span><span>₹{billDetails.total.toLocaleString()}</span></div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-500 mb-6 justify-center"><input type="checkbox" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} /> I Accept Terms & Conditions</label>
                    <button onClick={submitApplication} disabled={!isTermsAccepted || isSubmitting} className="w-full py-3 bg-[#043E52] text-white font-bold rounded-xl disabled:opacity-50">Pay & Submit</button>
                </div>
            );
        }
    }

    // --- MODAL LAYOUT: SPLIT VIEW (Matches Private Limited) ---
    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            OPC Registration
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Selected Plan</p>
                            <p className="font-bold text-white leading-tight">{plans[selectedPlan]?.title}</p>
                            <p className="text-[#ED6E3F] font-bold mt-1">₹{plans[selectedPlan]?.price.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* VERTICAL STEPPER */}
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Director Details', 'Nominee Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
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

                    {/* BOTTOM TOTAL */}
                    <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-blue-200 uppercase">Total Payable</p>
                                <p className="text-xl font-bold text-white">₹{billDetails.total.toLocaleString()}</p>
                            </div>
                            <Receipt className="text-white/20" size={24} />
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT: FORM */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    {/* Header Bar */}
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">
                            Step {currentStep}: {['Director Info', 'Nominee Info', 'Documents', 'Review', 'Payment'][currentStep - 1]}
                        </h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Order ID: {automationPayload?.submissionId}</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
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

    // --- FALLBACK FULL PAGE LAYOUT ---
    return (
        <div className="min-h-screen pb-20 pt-24 px-4 bg-[#F8F9FA]">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
                <div className="bg-white p-8 rounded-3xl shadow-xl">
                    <h1 className="text-2xl font-bold text-navy mb-6">One Person Company Registration</h1>
                    {renderStepContent()}
                    <div className="mt-8 flex justify-between">
                        <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-lg bg-gray-100 font-bold text-gray-600">Back</button>
                        {currentStep < 5 && <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-navy text-white font-bold">Next</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnePersonCompanyRegistration;
