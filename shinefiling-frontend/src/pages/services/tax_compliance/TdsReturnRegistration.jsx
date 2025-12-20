import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, PieChart, Shield,
    User, Briefcase, Building2
} from 'lucide-react';
import { uploadFile, submitTdsReturn } from '../../../api'; // Need to add to api.js

const TdsReturnRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/tds-return/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        tan: '',
        financialYear: '2024-2025',
        quarter: 'Q1',
        tdsFormType: '24Q',
        deductorName: '',
        numberOfDeductees: '',
        totalTaxDeposited: ''
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
            price: 1499,
            title: 'Basic Plan',
            features: ["TDS Return Filing", "Challan Mapping"],
            color: 'bg-white border-gray-200'
        },
        standard: {
            price: 3499,
            title: 'Standard Plan',
            features: ["PAN Validation", "Form 16/16A", "Error Correction"],
            recommended: true,
            color: 'bg-blue-50 border-blue-200'
        },
        premium: {
            price: 6999,
            title: 'Premium Plan',
            features: ["Compliance Dashboard", "Late Fee Optimization", "Notice Handling"],
            color: 'bg-cyan-50 border-cyan-200'
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

        if (step === 1) { // Basic Details
            if (!formData.tan) { newErrors.tan = "TAN required"; isValid = false; }
            if (!formData.deductorName) { newErrors.deductorName = "Deductor Name required"; isValid = false; }
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
            const response = await uploadFile(file, 'tds_documents');
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
            case 1: // Form & Period Selection
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {isModal && (
                        <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                    
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-blue-600" /> FILING DETAILS</h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">TAN Number</label>
                                    <input type="text" name="tan" value={formData.tan} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.tan ? 'border-red-500' : 'border-gray-200'}`} placeholder="BLRZ12345F" style={{ textTransform: 'uppercase' }} maxLength={10} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Deductor Name</label>
                                    <input type="text" name="deductorName" value={formData.deductorName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.deductorName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Company or Entity Name" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Financial Year</label>
                                    <select name="financialYear" value={formData.financialYear} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="2024-2025">2024-2025</option>
                                        <option value="2023-2024">2023-2024</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Quarter</label>
                                    <select name="quarter" value={formData.quarter} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Q1">Q1 (Apr-Jun)</option>
                                        <option value="Q2">Q2 (Jul-Sep)</option>
                                        <option value="Q3">Q3 (Oct-Dec)</option>
                                        <option value="Q4">Q4 (Jan-Mar)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Form Type</label>
                                    <select name="tdsFormType" value={formData.tdsFormType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="24Q">24Q (Salary)</option>
                                        <option value="26Q">26Q (Non-Salary)</option>
                                        <option value="27Q">27Q (Non-Resident)</option>
                                        <option value="27EQ">27EQ (TCS)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-blue-600" /> DATA UPLOAD</h3>
                            <p className="text-sm text-gray-500 mb-6">Upload deductee details and challan receipts for processing.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-blue-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Deductee Details (Excel)</span>
                                        <span className="text-xs text-gray-400 block mb-4">List of PANs & Deduction Amount</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'deductee_details')} accept=".xlsx,.xls,.csv" />
                                        {uploadedFiles['deductee_details'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['deductee_details'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-blue-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Challan Receipts</span>
                                        <span className="text-xs text-gray-400 block mb-4">PDF or ZIP of Challans</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'challan_receipts')} accept=".pdf,.zip,.jpg" />
                                        {uploadedFiles['challan_receipts'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['challan_receipts'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-6 border-t pt-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Total Deductees (Approx)</label>
                                    <input type="number" name="numberOfDeductees" value={formData.numberOfDeductees} onChange={handleInputChange} placeholder="e.g. 50" className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Total Tax Deposited (Approx)</label>
                                    <input type="number" name="totalTaxDeposited" value={formData.totalTaxDeposited} onChange={handleInputChange} placeholder="e.g. 25000" className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-black text-[#2B3446] mb-6">Review Filing</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-blue-600">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan Amount</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">TAN</span>
                                    <span className="font-bold">{formData.tan.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Form Type</span>
                                    <span className="font-bold">{formData.tdsFormType}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Period</span>
                                    <span className="font-bold">{formData.quarter} ({formData.financialYear})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Complete payment to initiate TDS return filing.</p>

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
                submissionId: `TDS-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitTdsReturn(finalPayload);
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
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Return Filing Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        We have received your request for <b>Form {formData.tdsFormType} ({formData.quarter})</b>.
                        We will now validate your PANs and prepare the FVU file.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">File TDS Return</h1>
                        <p className="text-gray-500">{formData.quarter} | FY {formData.financialYear}</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Form Selection', 'Data Upload', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-blue-700' : 'text-gray-600'}`}>{step}</span>
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

export default TdsReturnRegistration;
