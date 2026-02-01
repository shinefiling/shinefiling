
import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (planProp) setSelectedPlan(validatePlan(planProp));
    }, [planProp]);

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
                                <div className="flex justify-between items-center mb-4 bg-beige/10 p-2 rounded-lg">
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
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition">
                            {isSubmitting ? 'Processing...' : 'Pay Now & Submit'}
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
                    <CheckCircle size={48} className="text-slate mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">Ref: {automationPayload?.submissionId}</p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                            {['Business Details', 'Partners/Proprietor', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'opacity-60 cursor-pointer'}`} onClick={() => currentStep > i + 1 && setCurrentStep(i + 1)}>
                                    <span className="font-bold text-sm text-navy">{step}</span>
                                    {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                </div>
                            ))}
                        </div>
                        <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} sticky top-24`}>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</div>
                            <div className="text-3xl font-bold text-gray-800 mb-2">{plans[selectedPlan].title}</div>
                            <div className="text-3xl font-bold text-navy mb-4">₹{plans[selectedPlan].price}</div>
                            <div className="space-y-3 mb-6">{plans[selectedPlan].features.map((feat, i) => <div key={i} className="flex gap-2 text-xs font-medium text-gray-600"><CheckCircle size={14} className="text-slate" /> {feat}</div>)}</div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {!isSuccess && currentStep < 5 && (
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GstRegistration;
