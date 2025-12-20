import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, TrendingUp, Users
} from 'lucide-react';
import { uploadFile, submitShareTransfer } from '../../../api'; // Need to add to api.js

const ShareTransferRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('standard');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/roc-filing/share-transfer/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['standard', 'premium', 'basic'].includes(planParam.toLowerCase())) {
            setPlanType(planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        companyName: '',
        transferDate: '',
        numberOfShares: '',
        pricePerShare: '',

        // Transferor
        transferorName: '',
        transferorPan: '',
        transferorFolioNo: '',

        // Transferee
        transfereeName: '',
        transfereePan: '',
        transfereeEmail: '',
        transfereeMobile: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        standard: { price: 2499, title: 'Standard' },
        premium: { price: 4999, title: 'Bulk Transfer' },
        basic: { price: 999, title: 'Consultation' }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Transfer Details
            if (!formData.companyName) { newErrors.companyName = "Company Name required"; isValid = false; }
            if (!formData.numberOfShares) { newErrors.numberOfShares = "No. of Shares required"; isValid = false; }
            if (!formData.pricePerShare) { newErrors.pricePerShare = "Price required"; isValid = false; }
        }
        else if (step === 2) { // Parties Info
            if (!formData.transferorName) { newErrors.transferorName = "Transferor Name required"; isValid = false; }
            if (!formData.transfereeName) { newErrors.transfereeName = "Transferee Name required"; isValid = false; }
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
            const response = await uploadFile(file, 'share_transfer_docs');
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
            case 1: // Transfer Basics
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <TrendingUp size={20} className="text-yellow-600" /> TRANSFER DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Company Name" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">No. of Shares</label>
                                    <input type="number" name="numberOfShares" value={formData.numberOfShares} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.numberOfShares ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Price Per Share (₹)</label>
                                    <input type="number" name="pricePerShare" value={formData.pricePerShare} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.pricePerShare ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Date of Transfer (Deed Date)</label>
                                <input type="date" name="transferDate" value={formData.transferDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100 flex items-center gap-3">
                                <Briefcase size={20} />
                                <span>
                                    <strong>Stamp Duty Estimate:</strong> <br />
                                    Approx ₹{((formData.numberOfShares || 0) * (formData.pricePerShare || 0) * 0.0025).toFixed(2)} (0.25% of Consideration)
                                </span>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Parties Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Users size={20} className="text-yellow-600" /> PARTIES INVOLVED
                            </h3>

                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Transferor (Seller)</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">Name</label>
                                        <input type="text" name="transferorName" value={formData.transferorName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.transferorName ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">PAN</label>
                                        <input type="text" name="transferorPan" value={formData.transferorPan} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" maxLength={10} style={{ textTransform: 'uppercase' }} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-3">Transferee (Buyer)</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">Name</label>
                                        <input type="text" name="transfereeName" value={formData.transfereeName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.transfereeName ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">PAN</label>
                                        <input type="text" name="transfereePan" value={formData.transfereePan} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" maxLength={10} style={{ textTransform: 'uppercase' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-yellow-600" /> DOCUMENTS</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Share Certificate</span>
                                        <span className="text-xs text-gray-400 block mb-4">Original (Scanned Copy)</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'share_certificate')} accept=".pdf,.jpg" />
                                        {uploadedFiles['share_certificate'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['share_certificate'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-yellow-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">SH-4 (If Available)</span>
                                        <span className="text-xs text-gray-400 block mb-4">Draft Deed (Optional)</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'sh4_deed')} accept=".pdf,.jpg" />
                                        {uploadedFiles['sh4_deed'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['sh4_deed'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Pay professional fee for {plans[planType].title}.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{plans[planType].price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs text-gray-400">
                                <span>Stamp Duty</span>
                                <span>Calculated Later</span>
                            </div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & File'}
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

            const consideration = (parseInt(formData.numberOfShares) || 0) * (parseFloat(formData.pricePerShare) || 0);

            const finalPayload = {
                submissionId: `ROCSHARE-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL",
                amountPaid: plans[planType].price,
                considerationAmount: consideration
            };

            const response = await submitShareTransfer(finalPayload);
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
        <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Transfer Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request to transfer <b>{formData.numberOfShares} Shares</b> of <b>{formData.companyName}</b> has been received.
                        <br />We will calculate the exact Stamp Duty and draft the SH-4 Deed.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Share Transfer Filing</h1>
                        <p className="text-gray-500">Form SH-4 Execution</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Transfer Basics', 'Parties Details', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-yellow-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-800">
                                <strong>Selected Plan:</strong> <br />
                                <span className="text-lg font-bold">{plans[planType].title}</span>
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

export default ShareTransferRegistration;
