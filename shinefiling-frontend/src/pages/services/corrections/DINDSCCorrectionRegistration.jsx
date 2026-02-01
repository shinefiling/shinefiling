import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, User, FileText, Shield, Key
} from 'lucide-react';
import { uploadFile, submitDinDscCorrection } from '../../../api';

const DINDSCCorrectionRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [plan, setPlan] = useState('both');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const planParam = searchParams.get('plan') || 'both';
            navigate('/login', { state: { from: `/services/corrections/din-dsc-correction/apply?plan=${planParam}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['kyc', 'dsc', 'combo'].includes(planParam.toLowerCase())) {
            setPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        fullName: '',
        dinNumber: '',
        dscType: 'Class 3',
        correctionRequired: 'Both', // DIN Info, DSC Info, Both
        email: '',
        mobile: '',
        reason: '',
        panNumber: '',
        aadhaarNumber: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const pricing = {
        'kyc': { serviceFee: 999, title: "DIR-3 KYC Filing" },
        'dsc': { serviceFee: 1499, title: "DSC Re-issuance" },
        'combo': { serviceFee: 2299, title: "KYC + DSC Combo" }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // User Details
            if (!formData.fullName) { newErrors.fullName = "Full Name required"; isValid = false; }
            if (!formData.email) { newErrors.email = "Email required"; isValid = false; }
            if (!formData.mobile) { newErrors.mobile = "Mobile required"; isValid = false; }
        } else if (step === 2) { // Info Details
            if (plan !== 'dsc' && !formData.dinNumber) { newErrors.dinNumber = "DIN Number required"; isValid = false; }
            if (!formData.panNumber) { newErrors.panNumber = "PAN Number required"; isValid = false; }
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
            const response = await uploadFile(file, 'din_dsc_correction_docs');
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

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `DIN-DSC-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.email,
                plan: plan,
                amountPaid: pricing[plan].serviceFee,
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitDinDscCorrection(finalPayload);
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
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <User size={20} className="text-orange-600" /> PERSONAL CONTACT INFO
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name (As per PAN)</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Email ID</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile Number</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Shield size={20} className="text-blue-600" /> IDENTIFICATION INFO
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">PAN Number</label>
                                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.panNumber ? 'border-red-500' : 'border-gray-200'}`} maxLength={10} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Aadhaar Number</label>
                                    <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" maxLength={12} />
                                </div>
                                {plan !== 'dsc' && (
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">DIN (Director Identification Number)</label>
                                        <input type="text" name="dinNumber" value={formData.dinNumber} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.dinNumber ? 'border-red-500' : 'border-gray-200'}`} maxLength={8} />
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Reason for Correction</label>
                                    <textarea name="reason" value={formData.reason} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" rows="2" placeholder="e.g. Spelling mistake in MCA portal, Date of birth mismatch..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-6 text-center underline decoration-orange-300">CORE DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { label: 'PAN Card Copy', key: 'pan_doc' },
                                    { label: 'Aadhaar (Front & Back)', key: 'aadhaar_doc' },
                                    { label: 'Digital Photo', key: 'photo' },
                                    { label: 'Self-Signed Declaration', key: 'declaration' }
                                ].map((doc, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center group border border-transparent hover:border-orange-200 transition">
                                        <div>
                                            <p className="font-bold text-navy text-sm mb-1">{doc.label}</p>
                                            {uploadedFiles[doc.key] && <p className="text-[10px] text-green-600 font-bold">Uploaded ✓</p>}
                                        </div>
                                        <label className="cursor-pointer bg-navy text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black">
                                            {uploadedFiles[doc.key] ? 'Change' : 'Choose'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-bold text-navy mb-6">Review Details</h2>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-gray-400 font-bold text-[10px] uppercase mb-1">Director Name</p>
                                <p className="text-navy font-bold">{formData.fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 font-bold text-[10px] uppercase mb-1">PAN Number</p>
                                <p className="text-navy font-bold uppercase">{formData.panNumber}</p>
                            </div>
                            {plan !== 'dsc' && (
                                <div>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase mb-1">DIN</p>
                                    <p className="text-navy font-bold">{formData.dinNumber}</p>
                                </div>
                            )}
                            <div className="p-4 bg-orange-50 rounded-2xl md:col-span-2 border border-orange-100">
                                <p className="text-orange-800 font-bold text-[10px] uppercase mb-1">Correction Summary</p>
                                <p className="text-navy italic text-xs leading-relaxed">{formData.reason || "General Correction Request"}</p>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <Key size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Service Fee</h2>
                        <p className="text-gray-500 mb-8">Professional fee for {pricing[plan].title}</p>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-4xl font-bold text-navy">₹{pricing[plan].serviceFee}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-navy text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Submitting Request...' : 'Proceed & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Request Received!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request for DIN/DSC correction has been filed. Our identity verification expert will initiate the DIR-6 filing or DSC re-issuance as per the requirement.
                    </p>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">DIN / DSC Detail Correction</h1>
                        <p className="text-gray-500">Update your director identity and signature details</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Personal Info', 'ID Info', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-navy text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center gap-2">
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

export default DINDSCCorrectionRegistration;
