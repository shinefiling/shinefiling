import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Trash2, Plus, IndianRupee, Landmark
} from 'lucide-react';
import { uploadFile, submitGstRegistration } from '../../../api'; // Need to add submitGstRegistration to api.js

const GstRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/gst-registration/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        legalName: '',
        tradeName: '',
        businessType: 'Proprietorship',
        natureOfBusiness: 'Service',
        dateOfCommencement: '',
        estimatedTurnover: '',

        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',

        bankAccountNumber: '',
        ifscCode: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const plans = {
        basic: {
            price: 999,
            title: 'Basic Plan',
            features: ["GST Filing", "ARN Generation"],
            color: 'bg-white border-gray-200'
        },
        standard: {
            price: 2499,
            title: 'Standard Plan',
            features: ["Everything in Basic", "HSN/SAC", "Query Handling"],
            recommended: true,
            color: 'bg-orange-50 border-orange-200'
        },
        premium: {
            price: 4999,
            title: 'Premium Plan',
            features: ["Everything in Standard", "GST Login", "Return Guidance"],
            color: 'bg-red-50 border-red-200'
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Details
            if (!formData.legalName) { newErrors.legalName = "Legal Name required"; isValid = false; }
            if (!formData.tradeName) { newErrors.tradeName = "Trade Name required"; isValid = false; }
            if (!formData.estimatedTurnover) { newErrors.estimatedTurnover = "Turnover required"; isValid = false; }
        }

        if (step === 2) { // Address
            if (!formData.addressLine1) { newErrors.addressLine1 = "Address required"; isValid = false; }
            if (!formData.pincode) { newErrors.pincode = "Pincode required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
        }

        // Step 3 (Bank) is optional for basic/standard usually, but let's make it optional generally or mandatory if Premium
        if (step === 3 && selectedPlan === 'premium') {
            if (!formData.bankAccountNumber) { newErrors.bankAccountNumber = "Account Number required for Premium"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(6, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'gst_docs');
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
            alert("File upload failed. Please try again.");
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Business Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {isModal && (
                        <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                    
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Briefcase size={20} className="text-orange-600" /> BUSINESS DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Legal Name (As per PAN)</label>
                                    <input type="text" name="legalName" value={formData.legalName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.legalName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Trade Name</label>
                                    <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.tradeName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Business Type</label>
                                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Private Limited">Private Limited</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Nature of Business</label>
                                    <select name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Service">Service Provider</option>
                                        <option value="Trading">Trader / Retailer</option>
                                        <option value="Manufacturing">Manufacturer</option>
                                        <option value="Works Contract">Works Contract</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Date of Commencement</label>
                                    <input type="date" name="dateOfCommencement" value={formData.dateOfCommencement} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Estimated Turnover</label>
                                    <input type="number" name="estimatedTurnover" value={formData.estimatedTurnover} onChange={handleInputChange} placeholder="e.g. 2500000" className={`w-full p-3 rounded-lg border ${errors.estimatedTurnover ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Address Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Building size={20} className="text-orange-600" /> PRINCIPAL PLACE OF BUSINESS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" className={`w-full p-3 rounded-lg border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className={`w-full p-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className={`w-full p-3 rounded-lg border ${errors.pincode ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                        </div>
                    </div>
                );

            case 3: // Bank Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Landmark size={20} className="text-green-600" /> BANK DETAILS</h3>
                            <p className="text-xs text-gray-500 mb-4">Optional for Basic Plan, but recommended for avoiding delays.</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Account Number</label>
                                    <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.bankAccountNumber ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">IFSC Code</label>
                                    <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4">Upload Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['PAN Card', 'Aadhaar Card', 'Applicant Photo', 'Address Proof (Bill/Rent)', 'Bank Proof (Cheque)'].map((label, idx) => {
                                    const key = label.replace(/[\s/().]/g, '').toLowerCase();
                                    return (
                                        <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-orange-300 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Upload size={16} className="text-gray-400 group-hover:text-orange-500" />
                                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={16} className="text-green-500" />}
                                                <input type="file" onChange={(e) => handleFileUpload(e, key)} className="text-xs w-24" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 5: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-black text-[#2B3446] mb-6">Review Application</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-orange-600">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan Amount</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Legal Name</span>
                                    <span className="font-bold">{formData.legalName}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Trade Name</span>
                                    <span className="font-bold">{formData.tradeName}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Turnover</span>
                                    <span className="font-bold">₹{formData.estimatedTurnover}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Complete payment to submit GST Application.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (if any)</p>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit Application'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );

            default: return null;
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
                submissionId: `GST-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: {
                    ...formData,
                    panUrl: uploadedFiles['pancard']?.fileUrl,
                    aadhaarUrl: uploadedFiles['aadhaarcard']?.fileUrl,
                    photoUrl: uploadedFiles['applicantphoto']?.fileUrl,
                    addressProofUrl: uploadedFiles['addressproofbillrent']?.fileUrl,
                    bankProofUrl: uploadedFiles['bankproofcheque']?.fileUrl
                },
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitGstRegistration(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Need Icon import for briefcase if missing
    const Briefcase = Building; // Fallback

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your GST Application for <span className="font-bold text-[#2B3446]">{formData.legalName}</span> has been received.
                        <br />ARN will be generated after document verification.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">GST Registration</h1>
                        <p className="text-gray-500">Fast, Online & Secure GST Filing.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Details', 'Address', 'Bank Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} relative overflow-hidden transition-all sticky top-24`}>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</div>
                                    <div className="text-2xl font-black text-gray-800 mb-2">{plans[selectedPlan].title}</div>
                                    <div className="text-3xl font-black text-[#2B3446] mb-4">₹{plans[selectedPlan].price.toLocaleString()}</div>
                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan].features.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                                                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => navigate('/services/gst-registration')} className="text-xs font-bold text-gray-500 hover:text-black underline">Change Plan</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 6 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>

                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">
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

export default GstRegistration;
