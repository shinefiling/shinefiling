import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Shield, CreditCard, FileText,
    User, MapPin, Briefcase, Plus, Trash2, ArrowLeft, ArrowRight, X, IndianRupee, Users, Receipt
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitLlpRegistration, uploadFile } from '../../../api';



const LlpRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const plans = {
        basic: {
            price: 4999,
            title: 'Startup Plan',
            features: ["2 DSC & 2 DPIN", "Name Reservation", "Incorporation Filing", "PAN & TAN", "Basic Support"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 8999,
            title: 'Growth Plan',
            features: ["Everything in Startup", "LLP Agreement (Form 3)", "Stamp Paper Assistance", "Bank Account Support", "Ded. Account Manager"],
            color: 'bg-[#F0F7FF] border-blue-200'
        },
        premium: {
            price: 12999,
            title: 'Elite Plan',
            features: ["Everything in Growth", "GST Registration", "MSME/Udyam Reg.", "Trademark Filing (1 Class)", "Zero Balance Account"],
            color: 'bg-[#FDF4FF] border-purple-200'
        }
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Protect Route (Skip if in Modal)
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/llp-registration/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    // Steps: Plan -> Company -> Partners -> Docs -> Payment
    // Mapped to: 1: Company, 2: Partners, 3: Docs, 4: Review, 5: Payment (Plan selection moved to sidebar/initial state)
    const [currentStep, setCurrentStep] = useState(1);

    // Validate plan
    const validatePlan = (plan) => {
        return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'basic';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(validatePlan(planProp));
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
                setSelectedPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        llpNameOption1: '',
        llpNameOption2: '',
        businessActivity: '',
        contributionAmount: '',
        registeredAddress: '',

        profitSharingRatio: 'Equal',
        turnoverEstimate: '',
        gstState: '',
        bankPreference: '',
        accountingStartDate: '',

        partners: [
            { id: 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' },
            { id: 2, name: '', email: '', mobile: '', pan: '', aadhaar: '' }
        ]
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);

    // Memoize bill details
    const billDetails = useMemo(() => {
        const planKey = plans[selectedPlan] ? selectedPlan : 'basic';
        const plan = plans[planKey];
        const basePrice = plan.price;

        // User Request: Total extra is 15% split into Platform Fee, Tax, and GST
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

    // Plans Configuration


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePartnerChange = (index, e) => {
        const newPartners = [...formData.partners];
        newPartners[index][e.target.name] = e.target.value;
        setFormData({ ...formData, partners: newPartners });
    };

    const addPartner = () => {
        setFormData({
            ...formData,
            partners: [...formData.partners, { id: formData.partners.length + 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' }]
        });
    };

    const removePartner = (index) => {
        if (formData.partners.length <= 2) return; // Min 2
        const newPartners = formData.partners.filter((_, i) => i !== index);
        setFormData({ ...formData, partners: newPartners });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            let category = 'llp_docs';
            if (key.includes('partner')) category = 'partner_docs';
            if (key.includes('office')) category = 'office_docs';

            const response = await uploadFile(file, category);

            setFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    preview: file.type.includes('image') ? URL.createObjectURL(file) : null,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(files).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `LLP-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.partners[0].email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            // Backend LlpController expects Multipart with 'data' field containing JSON string
            const formDataObj = new FormData();
            formDataObj.append('data', JSON.stringify(finalPayload));

            const response = await submitLlpRegistration(formDataObj);

            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit. " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Company Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Briefcase size={20} className="text-blue-600" /> LLP DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="llpNameOption1" placeholder="Proposed LLP Name Option 1" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.llpNameOption1} />
                                <input name="llpNameOption2" placeholder="Proposed LLP Name Option 2" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.llpNameOption2} />
                                <textarea name="businessActivity" placeholder="Main Business Activity (e.g. Software Development)" className="p-3 rounded-lg border border-gray-200 w-full md:col-span-2" rows="2" onChange={handleInputChange} value={formData.businessActivity}></textarea>
                                <input name="contributionAmount" placeholder="Total Contribution Amount (e.g. 100000)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.contributionAmount} />
                                <input name="registeredAddress" placeholder="Registered Office Address" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.registeredAddress} />

                                {selectedPlan !== 'basic' && (
                                    <>
                                        <input name="profitSharingRatio" placeholder="Profit Sharing Ratio (e.g. 50:50)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.profitSharingRatio} />
                                        <input name="gstState" placeholder="GST State Code" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.gstState} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2: // Partners
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-navy flex items-center gap-2"><Users size={20} className="text-bronze" /> PARTNER DETAILS</h3>
                            <button onClick={addPartner} className="text-sm font-bold text-white bg-bronze px-3 py-1.5 rounded-lg hover:bg-bronze-dark flex items-center gap-1"><Plus size={14} /> Add</button>
                        </div>
                        {formData.partners.map((partner, index) => (
                            <div key={partner.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <span className="font-bold text-gray-700">Partner #{index + 1}</span>
                                    {index >= 2 && <button onClick={() => removePartner(index)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="name" placeholder="Full Name" value={partner.name} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="email" placeholder="Email" value={partner.email} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="mobile" placeholder="Mobile" value={partner.mobile} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="pan" placeholder="PAN Number" value={partner.pan} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-slate" /> UPLOAD DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {formData.partners.map((partner, i) => (
                                    <div key={i} className="space-y-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Partner {i + 1} ({partner.name || 'Name'})</p>
                                        <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-gray-600">PAN Card</span>
                                            <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `partner_${i}_pan`)} />
                                            {files[`partner_${i}_pan`] && <CheckCircle size={14} className="text-green-500" />}
                                        </div>
                                        <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-gray-600">ID Proof (Aadhaar/DL)</span>
                                            <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `partner_${i}_id`)} />
                                            {files[`partner_${i}_id`] && <CheckCircle size={14} className="text-green-500" />}
                                        </div>
                                    </div>
                                ))}
                                <div className="md:col-span-2 pt-4 border-t">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Office Proof</p>
                                    <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Electricity Bill / NOC</span>
                                        <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `office_proof`)} />
                                        {files[`office_proof`] && <CheckCircle size={14} className="text-green-500" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Plan</span>
                                <span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-bold">LLP Name:</span> {formData.llpNameOption1}</p>
                            <p><span className="font-bold">Partners:</span> {formData.partners.length}</p>
                            <p><span className="font-bold">Contribution:</span> {formData.contributionAmount}</p>
                        </div>
                    </div>
                );
            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (Later)</p>
                        </div>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    }

    // --- MODAL LAYOUT: SPLIT VIEW (Matches Private Limited) ---
    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight">
                            <Shield className="text-[#ED6E3F]" size={20} fill="#ED6E3F" stroke="none" />
                            LLP Registration
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Selected Plan</p>
                            <p className="font-bold text-white leading-tight">{plans[selectedPlan]?.title}</p>
                            <p className="text-[#ED6E3F] font-bold mt-1">₹{plans[selectedPlan]?.price.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* VERTICAL STEPPER */}
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['LLP Details', 'Partner Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                            {currentStep === 1 && "LLP Information"}
                            {currentStep === 2 && "Partner Details"}
                            {currentStep === 3 && "Upload Documents"}
                            {currentStep === 4 && "Review Application"}
                            {currentStep === 5 && "Complete Payment"}
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
                                    onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
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
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Your Order ID is <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{automationPayload?.submissionId}</span>.
                    </p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">LLP Registration</h1>
                            <p className="text-gray-500">Complete the process to register your Limited Liability Partnership.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* SIDEBAR */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['LLP Details', 'Partners', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-bronze-dark' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
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
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                                                <CheckCircle size={14} className="text-slate shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {!isModal && <button onClick={() => navigate('/services/llp-registration')} className="text-xs font-bold text-gray-500 hover:text-navy underline">Change Plan</button>}
                                </div>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>

                                    <button onClick={() => setCurrentStep(p => Math.min(5, p + 1))} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">
                                        Next Step <ArrowRight size={18} />
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

export default LlpRegistration;
