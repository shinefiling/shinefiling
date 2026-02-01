import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, User, FileText, AlertCircle, RefreshCw, Smartphone
} from 'lucide-react';
import { uploadFile, submitPanCorrection } from '../../../api';

const PanCorrectionRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [plan, setPlan] = useState('correction');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const planParam = searchParams.get('plan') || 'correction';
            navigate('/login', { state: { from: `/services/corrections/pan-correction/apply?plan=${planParam}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['reprint', 'correction', 'major'].includes(planParam.toLowerCase())) {
            setPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        fullName: '',
        panNumber: '',
        fatherName: '',
        dob: '',
        gender: 'Male',
        mobile: '',
        email: '',
        aadhaarNumber: '',
        correctionRequired: 'Name', // Name, DOB, Father Name, Photo/Signature
        newDetails: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const pricing = {
        reprint: { serviceFee: 199, title: "Reprint Only" },
        correction: { serviceFee: 299, title: "Data Correction" },
        major: { serviceFee: 999, title: "Major Name Change" }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Primary Details
            if (!formData.fullName) { newErrors.fullName = "Full Name required"; isValid = false; }
            if (!formData.panNumber) { newErrors.panNumber = "PAN Number required"; isValid = false; }
            if (!formData.mobile) { newErrors.mobile = "Mobile Number required"; isValid = false; }
            if (!formData.dob) { newErrors.dob = "DOB required"; isValid = false; }
        } else if (step === 2) { // Corrections
            if (plan !== 'reprint' && !formData.newDetails) { newErrors.newDetails = "Please specify correction details"; isValid = false; }
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
            const response = await uploadFile(file, 'pan_correction_docs');
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
                submissionId: `PAN-CORR-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.email,
                plan: plan,
                amountPaid: pricing[plan].serviceFee,
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitPanCorrection(finalPayload);
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
                                <User size={20} className="text-blue-600" /> APPLICANT DETAILS
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name (As per Aadhaar)</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Existing PAN Number</label>
                                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.panNumber ? 'border-red-500' : 'border-gray-200'}`} maxLength={10} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Father's Name</label>
                                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile Number</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Aadhaar Number</label>
                                    <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" maxLength={12} />
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
                                <RefreshCw size={20} className="text-orange-600" /> CORRECTION DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">What needs to be corrected?</label>
                                    <select name="correctionRequired" value={formData.correctionRequired} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Name">Name Correction</option>
                                        <option value="DOB">Date of Birth</option>
                                        <option value="Father Name">Father's Name</option>
                                        <option value="Photo/Signature">Photo & Signature</option>
                                        <option value="Multiple">Multiple Changes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Specify Correction / New Details</label>
                                    <textarea name="newDetails" value={formData.newDetails} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.newDetails ? 'border-red-500' : 'border-gray-200'}`} rows="4" placeholder="Enter the correct details as they should appear on the card..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-6">UPLOAD DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Existing PAN Copy', key: 'pan_copy' },
                                    { label: 'Aadhaar Card (Front & Back)', key: 'aadhaar_doc' },
                                    { label: 'Passport Size Photo', key: 'photo' },
                                    { label: 'Proof of Correction (Marriage Cert/Gazette)', key: 'proof_doc' }
                                ].map((doc, idx) => (
                                    <div key={idx} className="border border-dashed p-4 rounded-xl flex justify-between items-center group hover:border-blue-300 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">{doc.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {uploadedFiles[doc.key] && <CheckCircle size={16} className="text-green-500" />}
                                            <label className="cursor-pointer bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black">
                                                {uploadedFiles[doc.key] ? 'Change' : 'Upload'}
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-2xl font-bold text-navy mb-6">Review Information</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                                <div className="border-b pb-2">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Applicant Name</p>
                                    <p className="font-bold text-navy">{formData.fullName}</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">PAN Number</p>
                                    <p className="font-bold text-navy uppercase">{formData.panNumber}</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Correction Type</p>
                                    <p className="font-bold text-navy">{formData.correctionRequired}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">New/Correct Data</p>
                                    <p className="text-navy font-medium italic">"{formData.newDetails}"</p>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                    <span className="text-gray-500 font-bold">Selected Plan</span>
                                    <span className="text-navy font-bold uppercase">{pricing[plan].title}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Service Fee</h2>
                        <p className="text-gray-500 mb-8">Payable now to initiate correction</p>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500">Total</span>
                                <span className="text-4xl font-bold text-navy">₹{pricing[plan].serviceFee}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-navy text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Correct PAN'}
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
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Correction Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        Your PAN correction request for <b>{formData.fullName}</b> has been received. Our expert will contact you shortly to guide on the physical document submission (if required).
                    </p>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">View Orders</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">PAN Correction Application</h1>
                        <p className="text-gray-500">Fast and accurate PAN data updates</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Personal Info', 'Corrections', 'Documents', 'Review', 'Payment'].map((step, i) => (
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

export default PanCorrectionRegistration;
