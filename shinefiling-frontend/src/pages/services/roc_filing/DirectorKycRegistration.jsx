import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Phone, Mail
} from 'lucide-react';
import { uploadFile, submitDirectorKyc } from '../../../api'; // Need to add to api.js

const DirectorKycRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/roc-filing/director-kyc/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState('standard');

    const [formData, setFormData] = useState({
        din: '',
        fullName: '',
        fathersName: '',
        dob: '',
        mobileNumber: '',
        emailId: '',
        isForeignNational: false,
        financialYear: '2024-2025',
        otpVerified: false
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState('');

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const plans = {
        standard: { price: 499, title: 'Web KYC', features: ["No Details Change", "OTP Verification"] },
        premium: { price: 1499, title: 'e-Form KYC', features: ["Details Update", "Professional Cert."], recommended: true }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: val });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Director Info
            if (!formData.din) { newErrors.din = "DIN required"; isValid = false; }
            if (!formData.fullName) { newErrors.fullName = "Name required"; isValid = false; }
            if (!formData.mobileNumber) { newErrors.mobileNumber = "Mobile required"; isValid = false; }
            if (!formData.emailId) { newErrors.emailId = "Email required"; isValid = false; }
            if (!formData.otpVerified) { newErrors.otp = "Verify OTP first"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleSendOtp = () => {
        if (!formData.mobileNumber || !formData.emailId) {
            alert("Enter Mobile and Email first");
            return;
        }
        setOtpSent(true);
        alert(`OTP sent to ${formData.mobileNumber} and ${formData.emailId} (Simulated: 1234)`);
    };

    const handleVerifyOtp = () => {
        if (otpInput === '1234') {
            setFormData({ ...formData, otpVerified: true });
            setErrors(prev => ({ ...prev, otp: null }));
        } else {
            alert("Invalid OTP");
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'director_kyc_docs');
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
            case 1: // Director Details & OTP
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><User size={20} className="text-yellow-600" /> DIRECTOR DETAILS & OTP</h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">DIN (Director ID)</label>
                                    <input type="text" name="din" value={formData.din} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.din ? 'border-red-500' : 'border-gray-200'}`} placeholder="00012345" maxLength={8} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Full Name (As per PAN)</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Father's Name</label>
                                    <input type="text" name="fathersName" value={formData.fathersName} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" placeholder="Robert Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-50 rounded-xl mb-4 border border-yellow-100">
                                <label className="text-xs font-bold text-gray-500 block mb-3">Contact Validation for OTP</label>
                                <div className="grid md:grid-cols-2 gap-4 mb-3">
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Mobile Number" className={`w-full pl-10 p-3 rounded-lg border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} placeholder="Email ID" className={`w-full pl-10 p-3 rounded-lg border ${errors.emailId ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                </div>
                                {formData.otpVerified ? (
                                    <div className="text-green-600 font-bold flex items-center gap-2"><CheckCircle size={20} /> OTP Verified Successfully</div>
                                ) : (
                                    <div className="flex gap-2">
                                        {!otpSent ? (
                                            <button onClick={handleSendOtp} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm">Send OTP</button>
                                        ) : (
                                            <>
                                                <input type="text" placeholder="Enter OTP (1234)" value={otpInput} onChange={e => setOtpInput(e.target.value)} className="w-32 p-2 rounded-lg border border-gray-300" />
                                                <button onClick={handleVerifyOtp} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm">Verify</button>
                                            </>
                                        )}
                                    </div>
                                )}
                                {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp}</p>}
                            </div>
                        </div>
                    </div>
                );

            case 2: // Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-yellow-600" /> IDENTITY PROOF</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">PAN Card</span>
                                        <span className="text-xs text-gray-400 block mb-4">Mandatory</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'pan_card')} accept=".jpg,.png,.pdf" />
                                        {uploadedFiles['pan_card'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['pan_card'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-yellow-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Aadhaar Card</span>
                                        <span className="text-xs text-gray-400 block mb-4">Address Proof</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'aadhaar_card')} accept=".jpg,.png,.pdf" />
                                        {uploadedFiles['aadhaar_card'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['aadhaar_card'].name}</span> :
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
                        <h2 className="text-2xl font-black text-[#2B3446] mb-6">Review KYC Application</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-yellow-600">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service Fee</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">DIN</span>
                                    <span className="font-bold">{formData.din}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Director Name</span>
                                    <span className="font-bold">{formData.fullName}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Mobile</span>
                                    <span className="font-bold">{formData.mobileNumber}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">OTP Status</span>
                                    <span className="font-bold text-green-600">Verified</span>
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
                        <p className="text-gray-500 mb-8">Pay service fee to file DIR-3 KYC.</p>

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
                submissionId: `ROCKYC-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitDirectorKyc(finalPayload);
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
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">KYC Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your Director KYC request for DIN <b>{formData.din}</b> has been received.
                        <br />We will verify your details and file it on the MCA portal.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Director KYC Filing</h1>
                        <p className="text-gray-500">DIR-3 KYC for DIN {formData.din || 'Holders'}</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Director Info', 'Proof Upload', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-yellow-700' : 'text-gray-600'}`}>{step}</span>
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

export default DirectorKycRegistration;
