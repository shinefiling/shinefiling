import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Palette, Image, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitDesignRegistration } from '../../../api';

const ApplyDesignRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('standard');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/intellectual-property/design-registration/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const [formData, setFormData] = useState({
        articleName: '',
        applicantName: '',
        applicantNature: 'STARTUP', // STARTUP, MSME, OTHER
        designDescription: '',
        isNovel: 'TRUE',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans
    const plans = {
        standard: { title: "Design Registration", serviceFee: 4999 },
    };

    const getGovtFee = () => {
        if (formData.applicantNature === 'STARTUP' || formData.applicantNature === 'MSME') {
            return 1000;
        } else {
            return 4000;
        }
    };

    const getTotalPrice = () => {
        return (plans[planType]?.serviceFee || 4999) + getGovtFee();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? (checked ? 'TRUE' : 'FALSE') : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Design Details
            if (!formData.articleName) { newErrors.articleName = "Article Name required"; isValid = false; }
            if (!formData.applicantName) { newErrors.applicantName = "Applicant Name required"; isValid = false; }
            if (!formData.designDescription) { newErrors.designDescription = "Description required"; isValid = false; }
            if (formData.isNovel === 'FALSE') { newErrors.isNovel = "Novelty declaration required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(3, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'design-registration');
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
            case 1: // Design Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Palette size={20} className="text-sky-600" /> DESIGN DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Article Name</label>
                                    <input type="text" name="articleName" value={formData.articleName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.articleName ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Chair" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Applicant Nature</label>
                                    <select name="applicantNature" value={formData.applicantNature} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="STARTUP">Startup (Low Govt Fee)</option>
                                        <option value="MSME">MSME (Low Govt Fee)</option>
                                        <option value="OTHER">Other Company / Individual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Applicant Name</label>
                                <input type="text" name="applicantName" value={formData.applicantName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.applicantName ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Brief Description</label>
                                <textarea name="designDescription" value={formData.designDescription} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.designDescription ? 'border-red-500' : 'border-gray-200'} h-24`} placeholder="Describe the novelty (shape, pattern, etc.)..." />
                            </div>

                            <div className={`p-4 rounded-xl border flex items-start gap-3 ${errors.isNovel ? 'bg-red-50 border-red-200' : 'bg-sky-50 border-sky-100'}`}>
                                <input type="checkbox" name="isNovel" checked={formData.isNovel === 'TRUE'} onChange={handleInputChange} className="w-5 h-5 text-sky-600 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sky-900 text-sm">Declaration of Novelty</p>
                                    <p className="text-xs text-sky-700">I confirm that this design is new, original, and has NOT been published anywhere before.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Upload Views
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Image size={20} className="text-sky-600" /> UPLOAD VIEWS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'FRONT_VIEW', label: 'Front View' },
                                    { id: 'BACK_VIEW', label: 'Back View' },
                                    { id: 'SIDE_VIEW', label: 'Side View' },
                                    { id: 'TOP_VIEW', label: 'Top View' },
                                    { id: 'POA', label: 'Power of Authority' }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-6 rounded-xl text-center group hover:border-sky-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">{doc.label}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".jpg,.png,.pdf" />
                                            {uploadedFiles[doc.id] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles[doc.id].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 text-sky-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Professional + Govt Fee</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-lg font-bold text-[#2B3446]">₹4,999</span>
                            </div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Govt Fee ({formData.applicantNature})</span>
                                <span className="text-lg font-bold text-[#2B3446]">₹{getGovtFee().toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-end">
                                <span className="font-black text-gray-700">Total</span>
                                <span className="text-3xl font-black text-sky-600">₹{getTotalPrice().toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Register'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );

            default: return null;
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl,
                type: k
            }));

            const finalPayload = {
                submissionId: `DES-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                articleName: formData.articleName,
                plan: planType,
                amountPaid: getTotalPrice(),
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitDesignRegistration(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F9FF] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Registration Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        Your design application for <b>{formData.articleName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Design Registration</h1>
                        <p className="text-gray-500">Protect the Aesthetics of your Product</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Design Details', 'Upload Views', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-sky-50 border-sky-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-sky-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-xs text-sky-800">
                                <strong>Estimated Fees:</strong> <br />
                                <span className="text-lg font-bold">Registration + Govt Fee</span>
                                <div className="mt-2 text-xl font-black text-sky-900">₹{getTotalPrice().toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {apiError && (
                                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {!isSuccess && currentStep < 3 && (
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

export default ApplyDesignRegistration;
