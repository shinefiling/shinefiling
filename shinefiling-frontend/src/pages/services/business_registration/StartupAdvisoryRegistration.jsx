import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, Rocket, Lightbulb, Target, ArrowLeft, ArrowRight, Shield, AlertCircle, Zap, Users, Plus, Trash2, X
} from 'lucide-react';
import { submitStartupAdvisoryRegistration } from '../../../api';

const StartupAdvisoryRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'bootstrapped';
            navigate('/login', { state: { from: `/services/startup-incorporation-advisory?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['bootstrapped', 'funded', 'unicorn'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'bootstrapped';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(validatePlan(planProp));
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['bootstrapped', 'funded', 'unicorn'].includes(planParam.toLowerCase())) {
                setSelectedPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        startupName: '',
        industry: '',
        founderCount: '',
        fundingStatus: 'Not Funded',
        entityType: 'Private Limited',
        founders: [
            { name: '', email: '', linkedin: '' }
        ],
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        bootstrapped: {
            price: 14999,
            title: 'Bootstrapped',
            features: [
                "LLP Incorporation", "Startup India Recognition", "PAN & TAN", "Partnership Deed", "Bank Account Support"
            ],
            color: 'bg-white border-slate-200'
        },
        funded: {
            price: 24999,
            title: 'Funded',
            features: [
                "Pvt Ltd Incorporation", "Startup India Recognition", "Share Certificates", "Board Resolutions", "Founders Agreement"
            ],
            recommended: true,
            color: 'bg-orange-50 border-orange-200'
        },
        unicorn: {
            price: 49999,
            title: 'Unicorn',
            features: [
                "Pvt Ltd + GST + TM", "Startup India + Tax Exemption", "ESOP Advisory", "Term Sheet Review", "Dedicated CA"
            ],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    const billDetails = useMemo(() => {
        const plan = plans[selectedPlan];
        const basePrice = plan.price;
        const gst = Math.round(basePrice * 0.18);
        const total = basePrice + gst;
        return { basePrice, gst, total };
    }, [selectedPlan]);

    const handleInputChange = (e, index = null) => {
        const { name, value } = e.target;
        if (index !== null) {
            const newFounders = [...formData.founders];
            newFounders[index][name] = value;
            setFormData({ ...formData, founders: newFounders });
            if (errors[`founder_${name}_${index}`]) setErrors(prev => ({ ...prev, [`founder_${name}_${index}`]: null }));
        } else {
            setFormData({ ...formData, [name]: value });
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const addFounder = () => {
        setFormData(prev => ({
            ...prev,
            founders: [...prev.founders, { name: '', email: '', linkedin: '' }]
        }));
    };

    const removeFounder = (index) => {
        if (formData.founders.length > 1) {
            const newFounders = formData.founders.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, founders: newFounders }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.startupName.trim()) { newErrors.startupName = "Startup Name is required"; isValid = false; }
            if (!formData.industry.trim()) { newErrors.industry = "Industry is required"; isValid = false; }
        }
        if (step === 2) {
            formData.founders.forEach((founder, index) => {
                if (!founder.name.trim()) { newErrors[`founder_name_${index}`] = "Name required"; isValid = false; }
                if (!founder.email.trim()) { newErrors[`founder_email_${index}`] = "Email required"; isValid = false; }
            });
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                plan: selectedPlan,
                amount: plans[selectedPlan].price,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.founders[0].email,
                submissionId: `STARTUP-${Date.now()}`,
                status: 'PAYMENT_SUCCESSFUL'
            };

            const response = await submitStartupAdvisoryRegistration(payload);

            if (response) {
                setAutomationPayload(response);
                setIsSuccess(true);
            }
        } catch (error) {
            console.error("Startup Advisory Submission Error", error);
            alert("Submission failed. " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Startup Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Rocket size={20} className="text-orange-600" /> STARTUP DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Proposed Startup Name</label>
                                    <input name="startupName" value={formData.startupName} onChange={handleInputChange} placeholder="e.g. NextGen Tech" className={`w-full p-3 rounded-lg border ${errors.startupName ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                                    {errors.startupName && <p className="text-red-500 text-xs mt-1">{errors.startupName}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Industry / Sector</label>
                                    <input name="industry" value={formData.industry} onChange={handleInputChange} placeholder="e.g. Fintech, Edtech" className={`w-full p-3 rounded-lg border ${errors.industry ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Funding Status</label>
                                    <select name="fundingStatus" value={formData.fundingStatus} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Not Funded">Not Funded (Bootstrapped)</option>
                                        <option value="Angel Funded">Angel Funded</option>
                                        <option value="VC Funded">VC Funded</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Brief about your idea</label>
                                    <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us a bit about what you're building..." className="w-full p-3 rounded-lg border border-gray-200" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Founders
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-navy flex items-center gap-2"><Users size={20} className="text-blue-600" /> FOUNDERS</h2>
                            <button onClick={addFounder} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition">+ Add Founder</button>
                        </div>
                        {formData.founders.map((founder, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h4 className="font-bold text-navy text-sm">Founder #{i + 1}</h4>
                                    {i > 0 && <button onClick={() => removeFounder(i)} className="text-red-500"><Trash2 size={16} /></button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="w-full">
                                        <input name="name" value={founder.name} onChange={(e) => handleInputChange(e, i)} placeholder="Full Name" className={`w-full p-3 rounded-lg border ${errors[`founder_name_${i}`] ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                                        {errors[`founder_name_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`founder_name_${i}`]}</p>}
                                    </div>
                                    <div className="w-full">
                                        <input name="email" value={founder.email} onChange={(e) => handleInputChange(e, i)} placeholder="Email" className={`w-full p-3 rounded-lg border ${errors[`founder_email_${i}`] ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} />
                                        {errors[`founder_email_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`founder_email_${i}`]}</p>}
                                    </div>
                                    <input name="linkedin" value={founder.linkedin} onChange={(e) => handleInputChange(e, i)} placeholder="LinkedIn Profile (Optional)" className="w-full p-3 rounded-lg border border-gray-200 md:col-span-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 3: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Package</h2>
                        <div className="bg-orange-50/50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between mb-2"><span className="text-gray-600">Package</span><span className="font-bold text-navy uppercase">{plans[selectedPlan].title}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Advisory Fee</span><span className="font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span></div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Startup:</strong> {formData.startupName}</p>
                            <p><strong>Founders:</strong> {formData.founders.length}</p>
                            <p><strong>Funding:</strong> {formData.fundingStatus}</p>
                        </div>
                    </div>
                );
            case 4: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <Rocket size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-400">Incl. of GST & Govt Fees</p>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Start'}
                            {!isSubmitting && <ArrowRight size={18} />}
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
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight">
                            <Rocket className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            Registration
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Selected Plan</p>
                            <p className="font-bold text-white leading-tight">{plans[selectedPlan]?.title}</p>
                            <p className="text-[#ED6E3F] font-bold mt-1">₹{plans[selectedPlan]?.price.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* VERTICAL STEPPER */}
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Startup Details', 'Founders', 'Review', 'Payment'].map((step, i) => (
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
                            <Shield className="text-white/20" size={24} />
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT: FORM */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    {/* Header Bar */}
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">
                            {currentStep === 1 && "Start Details"}
                            {currentStep === 2 && "Founder Information"}
                            {currentStep === 3 && "Review Package"}
                            {currentStep === 4 && "Safe Payment"}
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
    }

    return (
        <div className={` min-h-screen pb-20 pt-24 px-4 md:px-8 bg-[#F8F9FA]`}>
            {/* Fallback for non-modal usage (if any) */}
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold mb-4">Startup Incorporation Advisory</h1>
                <p>Please use the detailed modal wizard for registration.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Go Home</button>
            </div>
        </div>
    );
};

export default StartupAdvisoryRegistration;
