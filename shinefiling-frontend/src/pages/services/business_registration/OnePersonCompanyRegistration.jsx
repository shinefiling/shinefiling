
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, Users, Plus, Trash2
} from 'lucide-react';
import { uploadFile, submitOnePersonCompanyRegistration } from '../../../api'; // Need to add this API manually later or now

const OnePersonCompanyRegistration = ({ isLoggedIn, isModal = false, onClose, planProp }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/one-person-company/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

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
        companyNames: ['', ''], // 2 options for OPC
        businessActivity: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        ownershipStatus: 'rented',
        authorizedCapital: '100000',
        paidUpCapital: '100000',

        // Single Director (Member)
        director: { name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', address: '' },

        // Nominee
        nominee: { name: '', relationship: '', dob: '', pan: '', aadhaar: '', email: '', phone: '' },

        // Extra Fields
        bankPreference: '',
        turnoverEstimate: '',
        accountingStartDate: '',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans Configuration
    const plans = {
        basic: {
            price: 4999,
            title: 'Basic Plan',
            features: [
                "1 DSC & 1 DIN", "Name Approval", "Certificate of Incorporation", "MOA & AOA Drafting", "PAN & TAN", "GST Support"
            ],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 8999,
            title: 'Standard Plan',
            features: [
                "Everything in Basic", "Nominee Consent Filing", "Share Certificate", "PAN & TAN Allocation", "GST & Bank Account"
            ],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        },
        premium: {
            price: 12999,
            title: 'Premium Plan',
            features: [
                "Everything in Standard", "GST Registration", "MSME (Udyam) Registration", "Bank Account (Full Support)", "First Board Resolution"
            ],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target;

        if (section === 'companyNames') {
            const index = parseInt(name); // 0 or 1 passed as name
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

        if (step === 1) { // Director & Company
            if (!formData.director.name) { newErrors.directorName = "Director Name Required"; isValid = false; }
            if (!formData.director.email) { newErrors.directorEmail = "Email Required"; isValid = false; }
            if (!formData.director.phone) { newErrors.directorPhone = "Phone Required"; isValid = false; }
            if (!formData.director.pan) { newErrors.directorPan = "PAN Required"; isValid = false; }

            if (!formData.companyNames[0]) { newErrors.companyName1 = "At least 1 name required"; isValid = false; }
            if (!formData.businessActivity) { newErrors.businessActivity = "Activity required"; isValid = false; }
            if (!formData.addressLine1) { newErrors.addressLine1 = "Address required"; isValid = false; }
        }

        if (step === 2) { // Nominee & Extras
            // Nominee Name required for all OPCs usually, but specifically for Standard/Premium forms
            if (!formData.nominee.name) { newErrors.nomineeName = "Nominee Name required"; isValid = false; }

            if (selectedPlan !== 'basic') {
                if (!formData.nominee.pan) { newErrors.nomineePan = "Nominee PAN required"; isValid = false; }
            }
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
            let category = 'opc_docs';
            const response = await uploadFile(file, category);

            setUploadedFiles(prev => ({
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
            alert("File upload failed.");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `OPC-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.director.email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            // Call API
            const response = await submitOnePersonCompanyRegistration(finalPayload);

            setAutomationPayload(response);
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
            case 1: // Director & Company
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><User size={20} className="text-blue-600" /> DIRECTOR / OWNER DETAILS (Only 1)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" name="name" value={formData.director.name} onChange={(e) => handleInputChange(e, 'director')} placeholder="Full Name" className={`w-full p-3 rounded-lg border ${errors.directorName ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="email" name="email" value={formData.director.email} onChange={(e) => handleInputChange(e, 'director')} placeholder="Email" className={`w-full p-3 rounded-lg border ${errors.directorEmail ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="tel" name="phone" value={formData.director.phone} onChange={(e) => handleInputChange(e, 'director')} placeholder="Mobile Number" className={`w-full p-3 rounded-lg border ${errors.directorPhone ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="pan" value={formData.director.pan} onChange={(e) => handleInputChange(e, 'director')} placeholder="PAN Number" className={`w-full p-3 rounded-lg border ${errors.directorPan ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="aadhaar" value={formData.director.aadhaar} onChange={(e) => handleInputChange(e, 'director')} placeholder="Aadhaar Number" className="w-full p-3 rounded-lg border border-gray-200" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-navy" /> COMPANY DETAILS</h3>
                            <div className="grid gap-4">
                                <input name="0" type="text" value={formData.companyNames[0]} onChange={(e) => handleInputChange(e, 'companyNames')} placeholder="Proposed OPC Name 1" className={`w-full p-3 rounded-lg border ${errors.companyName1 ? 'border-red-500' : 'border-gray-200'}`} />
                                <input name="1" type="text" value={formData.companyNames[1]} onChange={(e) => handleInputChange(e, 'companyNames')} placeholder="Proposed OPC Name 2 (Optional)" className="w-full p-3 rounded-lg border border-gray-200" />

                                <textarea name="businessActivity" value={formData.businessActivity} onChange={handleInputChange} placeholder="Main Business Activity" className="w-full p-3 rounded-lg border border-gray-200" rows="2"></textarea>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" name="authorizedCapital" value={formData.authorizedCapital} onChange={handleInputChange} placeholder="Authorized Capital" className="w-full p-3 rounded-lg border border-gray-200" />
                                    <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Registered Address Line 1" className={`w-full p-3 rounded-lg border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full p-3 rounded-lg border border-gray-200" />
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Nominee & Extras
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Users size={20} className="text-purple-600" /> NOMINEE DETAILS (Mandatory)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" name="name" value={formData.nominee.name} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Nominee Full Name" className={`w-full p-3 rounded-lg border ${errors.nomineeName ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="relationship" value={formData.nominee.relationship} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Relationship (e.g. Spouse/Brother)" className="w-full p-3 rounded-lg border border-gray-200" />

                                {selectedPlan !== 'basic' && (
                                    <>
                                        <input type="text" name="pan" value={formData.nominee.pan} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Nominee PAN" className={`w-full p-3 rounded-lg border ${errors.nomineePan ? 'border-red-500' : 'border-gray-200'}`} />
                                        <input type="text" name="aadhaar" value={formData.nominee.aadhaar} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Nominee Aadhaar" className="w-full p-3 rounded-lg border border-gray-200" />
                                    </>
                                )}
                            </div>
                            {selectedPlan === 'basic' && <p className="text-xs text-gray-500 mt-2">*Full nominee filing not included in Basic plan.</p>}
                        </div>

                        {/* Premium Fields */}
                        {selectedPlan === 'premium' && (
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
                                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2"><Shield size={20} className="text-purple-600" /> PREMIUM EXTRAS</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" name="bankPreference" value={formData.bankPreference} onChange={handleInputChange} placeholder="Preferred Bank" className="w-full p-3 rounded-lg border border-purple-200 bg-white" />
                                    <input type="text" name="turnoverEstimate" value={formData.turnoverEstimate} onChange={handleInputChange} placeholder="Est. Turnover" className="w-full p-3 rounded-lg border border-purple-200 bg-white" />
                                    <input type="date" name="accountingStartDate" value={formData.accountingStartDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-purple-200 bg-white" />
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Upload Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['Director PAN', 'Director Aadhaar', 'Director Photo', 'Director Address Proof', 'Office Address Proof'].map((label, idx) => {
                                    const key = label.toLowerCase().replace(/ /g, '_');
                                    return (
                                        <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Upload size={16} className="text-gray-400 group-hover:text-bronze" />
                                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={16} className="text-bronze" />}
                                                <input type="file" onChange={(e) => handleFileUpload(e, key)} className="text-xs w-24" />
                                            </div>
                                        </div>
                                    );
                                })}

                                {selectedPlan !== 'basic' && (
                                    <div className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Upload size={16} className="text-gray-400 group-hover:text-bronze" />
                                            <span className="text-sm font-medium text-gray-600">Nominee Consent Form (Signed)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {uploadedFiles['nominee_consent'] && <CheckCircle size={16} className="text-bronze" />}
                                            <input type="file" onChange={(e) => handleFileUpload(e, 'nominee_consent')} className="text-xs w-24" />
                                        </div>
                                    </div>
                                )}
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
                            <p><span className="font-bold">Director:</span> {formData.director.name}</p>
                            <p><span className="font-bold">Nominee:</span> {formData.nominee.name}</p>
                            <p><span className="font-bold">Company:</span> {formData.companyNames[0]}</p>
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
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
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
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Your Order ID is <span className="font-mono bg-gray-100 px-2 rounded">{automationPayload?.id || "N/A"}</span>
                    </p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">One Person Company Registration</h1>
                            <p className="text-gray-500">Register your OPC with just one director and nominee.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Director & Company', 'Nominee & Extras', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}>
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
                                    {!isModal && <button onClick={() => navigate('/services/one-person-company')} className="text-xs font-bold text-gray-500 hover:text-navy underline">Change Plan</button>}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
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

export default OnePersonCompanyRegistration;
