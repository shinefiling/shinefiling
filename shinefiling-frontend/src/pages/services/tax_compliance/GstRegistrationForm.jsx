import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Users, Plus, Trash2, X, Briefcase
} from 'lucide-react';
import { uploadFile, submitGstRegistration } from '../../../api';

const GstRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/gst-registration/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

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
        legalName: '',
        tradeName: '',
        businessType: 'Proprietorship',
        natureOfBusiness: '',
        dateOfCommencement: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        bankAccountNumber: '',
        ifscCode: '',
        partners: [
            { name: '', pan: '', aadhaar: '', email: '', phone: '' }
        ]
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        basic: {
            price: 999,
            title: 'Basic Plan',
            features: ["GST Registration", "ARN Generation", "Basic Consultation"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 2499,
            title: 'Standard Plan',
            features: ["GST Registration", "Digital Signature (DSC)", "MSME Registration", "Bank Account Support"],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        },
        premium: {
            price: 4999,
            title: 'Premium Plan',
            features: ["Everything in Standard", "1 Month Return Filing", "Invoicing Software (3 Months)", "Dedicated CA Support"],
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

    const handleInputChange = (e, section = null, index = null) => {
        const { name, value } = e.target;
        if (section === 'partners') {
            const newPartners = [...formData.partners];
            newPartners[index][name] = value;
            setFormData({ ...formData, partners: newPartners });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const addPartner = () => {
        setFormData(prev => ({
            ...prev,
            partners: [...prev.partners, { name: '', pan: '', aadhaar: '', email: '', phone: '' }]
        }));
    };

    const removePartner = (index) => {
        if (formData.partners.length > 1) {
            const newPartners = formData.partners.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, partners: newPartners }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.legalName) { newErrors.legalName = "Legal Name is required"; isValid = false; }
            if (!formData.tradeName) { newErrors.tradeName = "Trade Name is required"; isValid = false; }
            if (!formData.pincode) { newErrors.pincode = "Pincode is required"; isValid = false; }
        }
        if (step === 2) {
            formData.partners.forEach((p, i) => {
                if (!p.name) { newErrors[`partner_${i}_name`] = "Name required"; isValid = false; }
                if (!p.pan) { newErrors[`partner_${i}_pan`] = "PAN required"; isValid = false; }
            });
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
            const response = await uploadFile(file, 'gst_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id }
            }));
        } catch (error) { alert("Upload failed"); }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = {
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };
            const response = await submitGstRegistration(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) { alert("Submission error: " + error.message); } finally { setIsSubmitting(false); }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} /> BUSINESS DETAILS</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Legal Name (As per PAN)</label>
                                    <input type="text" name="legalName" value={formData.legalName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.legalName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Trade Name</label>
                                    <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.tradeName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Constitution</label>
                                        <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                            <option value="Proprietorship">Proprietorship</option>
                                            <option value="Partnership">Partnership</option>
                                            <option value="LLP">LLP</option>
                                            <option value="Private Limited">Private Limited</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Nature of Business</label>
                                        <input type="text" name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleInputChange} placeholder="Service/Retail/Wholesale" className="w-full p-3 rounded-lg border border-gray-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} /> SAVINGS ACCOUNT / CURRENT ACCOUNT</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} placeholder="Account Number" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} placeholder="IFSC Code" className="w-full p-3 rounded-lg border border-gray-200" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} /> PRINCIPAL PLACE OF BUSINESS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className={`w-full p-3 rounded-lg border ${errors.pincode ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {formData.partners.map((partner, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4 bg-blue-50/50 p-2 rounded-lg">
                                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2"><User size={16} /> Partner/Proprietor {i + 1}</h4>
                                    {formData.partners.length > 1 && <button onClick={() => removePartner(i)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" name="name" value={partner.name} onChange={(e) => handleInputChange(e, 'partners', i)} placeholder="Full Name" className={`w-full p-3 border rounded-lg ${errors[`partner_${i}_name`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="text" name="pan" value={partner.pan} onChange={(e) => handleInputChange(e, 'partners', i)} placeholder="PAN Number" className={`w-full p-3 border rounded-lg ${errors[`partner_${i}_pan`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="text" name="aadhaar" value={partner.aadhaar} onChange={(e) => handleInputChange(e, 'partners', i)} placeholder="Aadhaar Number" className="w-full p-3 border rounded-lg" />
                                    <input type="text" name="email" value={partner.email} onChange={(e) => handleInputChange(e, 'partners', i)} placeholder="Email" className="w-full p-3 border rounded-lg" />
                                </div>
                            </div>
                        ))}
                        <button onClick={addPartner} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-bronze hover:text-bronze transition flex items-center justify-center gap-2">
                            <Plus size={20} /> Add Another Partner
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Business Documents</h3>
                            {['Rent Agreement / NOC', 'Electricity Bill / Tax Receipt', 'Bank Proof (Cancelled Cheque)'].map((label, idx) => (
                                <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600">{label}</span>
                                    <div className="flex items-center gap-2">
                                        {uploadedFiles[`biz_doc_${idx}`] && <CheckCircle size={16} className="text-bronze" />}
                                        <input type="file" onChange={(e) => handleFileUpload(e, `biz_doc_${idx}`)} className="text-xs w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {formData.partners.map((p, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-navy mb-4">Documents for {p.name || `Partner ${i + 1}`}</h3>
                                {['PAN Card', 'Aadhaar Card', 'Photo'].map((doc, dIdx) => (
                                    <div key={dIdx} className="border border-dashed p-4 rounded-lg flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-600">{doc}</span>
                                        <div className="flex items-center gap-2">
                                            {uploadedFiles[`partner_${i}_${dIdx}`] && <CheckCircle size={16} className="text-bronze" />}
                                            <input type="file" onChange={(e) => handleFileUpload(e, `partner_${i}_${dIdx}`)} className="text-xs w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between"><span className="text-gray-500">Selected Plan</span><span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Plan Amount</span><span className="font-bold">₹{plans[selectedPlan].price}</span></div>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2"><span className="text-gray-500">Legal Name</span><span className="font-bold">{formData.legalName}</span></div>
                                <div className="flex justify-between mb-2"><span className="text-gray-500">Constitution</span><span className="font-bold">{formData.businessType}</span></div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><Briefcase size={32} className="text-blue-600" /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-400">Incl. of GST & Govt Fees</p>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR - DARK */}
                <div className="w-72 bg-[#043E52] flex flex-col justify-between shrink-0 relative overflow-hidden">
                    {/* Background Deco */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute right-0 top-0 w-48 h-48 bg-white blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute left-0 bottom-0 w-40 h-40 bg-bronze blur-3xl rounded-full translate-y-1/3 -translate-x-1/3"></div>
                    </div>

                    <div className="p-8 relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-3 mb-8 text-white">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Briefcase size={24} className="text-bronze" />
                            </div>
                            <div>
                                <h3 className="font-bold leading-tight">GST<br />Registration</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Advisory</p>
                            </div>
                        </div>

                        {/* Steps Navigation */}
                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/10 z-0"></div>

                            {['Company Details', 'Partners', 'Documents', 'Review', 'Payment'].map((step, i) => {
                                const stepNum = i + 1;
                                const isActive = currentStep === stepNum;
                                const isCompleted = currentStep > stepNum;

                                return (
                                    <div
                                        key={i}
                                        className={`relative z-10 flex items-center gap-4 cursor-pointer group ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                        onClick={() => { if (isCompleted) setCurrentStep(stepNum) }}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                                            ${isActive ? 'bg-bronze border-bronze text-white scale-110 shadow-lg shadow-bronze/30' :
                                                isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-[#043E52] border-white/20 text-white/60'}`}
                                        >
                                            {isCompleted ? <CheckCircle size={14} /> : stepNum}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                            {step}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Bottom Billing Card */}
                    <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/5 relative z-10 shrink-0">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">Total Payable</span>
                            <span className="text-lg font-bold text-bronze">₹{billDetails.total.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{plans[selectedPlan]?.title} Plan</p>
                    </div>
                </div>

                {/* RIGHT CONTENT AREA - LIGHT */}
                <div className="flex-1 flex flex-col bg-[#F2F1EF] h-full overflow-hidden relative">
                    {/* Header */}
                    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">
                            {currentStep === 1 && "Start Registration"}
                            {currentStep === 2 && "Partner Details"}
                            {currentStep === 3 && "Upload Documents"}
                            {currentStep === 4 && "Review Application"}
                            {currentStep === 5 && "Complete Payment"}
                        </h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-500 transition">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-3xl mx-auto pb-12">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center h-full pt-12 text-center">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in spin-in-90 duration-500">
                                        <CheckCircle size={48} className="text-green-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-navy mb-2">Registration Successful!</h2>
                                    <p className="text-gray-500 max-w-md mb-8">
                                        Your GST application (Ref: {automationPayload?.submissionId}) has been received.
                                    </p>
                                    <button onClick={onClose} className="px-8 py-3 bg-navy text-white rounded-xl font-bold hover:bg-black transition">
                                        Return to Dashboard
                                    </button>
                                </div>
                            ) : (
                                renderStepContent()
                            )}
                        </div>
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

    return (
        <div className={` min-h-screen pb-20 pt-24 px-4 md:px-8 bg-[#F8F9FA]`}>
            {/* Fallback for non-modal usage (if any) */}
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold mb-4">GST Registration</h1>
                <p>Please use the detailed modal wizard for registration.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Go Home</button>
            </div>
        </div>
    );
};

export default GstRegistration;
