import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, PieChart, Shield,
    MapPin, Users, Building
} from 'lucide-react';
import { uploadFile, submitProfessionalTax } from '../../../api'; // Need to add to api.js

const ProfessionalTaxRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/professional-tax/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        businessName: '',
        state: 'Maharashtra',
        entityType: 'Employer',
        employeeCount: '',
        registrationType: 'Both', // RC + EC
        pan: '',
        email: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Auto-fill user email
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email) setFormData(p => ({ ...p, email: user.email }));
    }, []);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const plans = {
        basic: { price: 999, title: 'Basic Plan', features: ["PT Registration", "Certificate"] },
        standard: { price: 2499, title: 'Standard Plan', features: ["Monthly Filing", "Calculation"], recommended: true },
        premium: { price: 4999, title: 'Premium Plan', features: ["Notice Handling", "Compliance Calendar"] }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Info
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
        }
        if (step === 2 && formData.entityType === 'Employer') {
            if (!formData.employeeCount) { newErrors.employeeCount = "Employee Count required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'pt_documents');
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // State & Business
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {isModal && (
                        <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                    
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><MapPin size={20} className="text-violet-600" /> LOCATION & IDENTITY</h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">State of Registration</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        {["Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Gujarat", "Andhra Pradesh", "Telangana", "Other"].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Your Company Name" />
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl">
                                <label className="text-xs font-bold text-gray-500 block mb-3">Who are you registering for?</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center gap-2 transition ${formData.entityType === 'Employer' ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-gray-200'}`}
                                        onClick={() => setFormData({ ...formData, entityType: 'Employer' })}
                                    >
                                        <Users size={24} />
                                        <span className="font-bold text-sm">Employer</span>
                                        <span className="text-[10px] text-center text-gray-500">Deducting tax for employees</span>
                                    </div>
                                    <div
                                        className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center gap-2 transition ${formData.entityType === 'Professional' ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-gray-200'}`}
                                        onClick={() => setFormData({ ...formData, entityType: 'Professional' })}
                                    >
                                        <Building size={24} />
                                        <span className="font-bold text-sm">Self-Employed / Professional</span>
                                        <span className="text-[10px] text-center text-gray-500">Paying for self</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Details & Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-violet-600" /> DETAILS & DOCUMENTS</h3>

                            {formData.entityType === 'Employer' && (
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Number of Employees</label>
                                    <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} placeholder="e.g. 15" className={`w-full p-3 rounded-lg border ${errors.employeeCount ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">PAN Number</label>
                                <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} placeholder="ABCDE1234F" className="w-full p-3 rounded-lg border border-gray-200 mb-6" maxLength={10} style={{ textTransform: 'uppercase' }} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-violet-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center text-violet-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Business Address Proof</span>
                                        <span className="text-xs text-gray-400 block mb-4">Electricity Bill / Rent Agreement</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'address_proof')} accept=".pdf,.jpg,.png" />
                                        {uploadedFiles['address_proof'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['address_proof'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-violet-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-violet-500 transition">
                                            <Users size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Employee List (Optional)</span>
                                        <span className="text-xs text-gray-400 block mb-4">Excel with Salaries (for Employers)</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'employee_list')} accept=".xlsx,.xls,.csv" />
                                        {uploadedFiles['employee_list'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['employee_list'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-black text-[#2B3446] mb-6">Review Application</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-violet-600">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan Amount</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">State</span>
                                    <span className="font-bold">{formData.state}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-bold">{formData.entityType}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Business</span>
                                    <span className="font-bold">{formData.businessName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6 text-violet-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Complete payment to initiate PT registration.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
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

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `PT-${Date.now()}`,
                plan: selectedPlan,
                userEmail: formData.email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitProfessionalTax(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Registration Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        We have received your Professional Tax request for <b>{formData.businessName}</b> in <b>{formData.state}</b>.
                        We will verify your eligibility and process your EC/RC application.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Professional Tax Registration</h1>
                        <p className="text-gray-500">Compliance for {formData.state}</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Location & Identity', 'Details & Docs', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-violet-50 border-violet-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-violet-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 4 && (
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

export default ProfessionalTaxRegistration;
