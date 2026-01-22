import React, { useState, useEffect } from 'react';
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

    const handleInputChange = (e, index = null) => {
        const { name, value } = e.target;
        if (index !== null) {
            const newFounders = [...formData.founders];
            newFounders[index][name] = value;
            setFormData({ ...formData, founders: newFounders });
            // Clear error for this specific field if exists
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

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            // Basic Payload
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
            case 3: // Review (Simplified)
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
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
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

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} className="text-green-600" /></div>
                    <h1 className="text-3xl font-bold text-navy mb-4">You're on your way!</h1>
                    <p className="text-gray-500 mb-8">We have received your details for <span className="font-bold text-navy">{formData.startupName}</span>. Our startup advisor will call you shortly.</p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">Startup Incorporation</h1>
                            <p className="text-gray-500">Launch your startup with the right legal structure.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Startup Details', 'Founders', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-100 shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
                                        <div><span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span><span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{step}</span></div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                            <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} relative overflow-hidden transition-all sticky top-24`}>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</div>
                                    <div className="text-3xl font-bold text-gray-800 mb-2">{plans[selectedPlan].title}</div>
                                    <div className="text-3xl font-bold text-navy mb-4">₹{plans[selectedPlan].price.toLocaleString()}</div>
                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan].features.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600"><CheckCircle size={14} className="text-slate shrink-0 mt-0.5" /><span className="leading-tight">{feat}</span></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 4 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StartupAdvisoryRegistration;
