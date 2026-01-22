import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Copyright, Globe, Briefcase, User, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitTrademarkRegistration } from '../../../api';

const ApplyTrademarkRegistration = ({ isLoggedIn }) => {
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
            navigate('/login', { state: { from: `/services/intellectual-property/trademark-registration/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) setPlanType(plan);
    }, [searchParams]);

    const [formData, setFormData] = useState({
        brandName: '',
        trademarkType: 'WORDMARK', // WORDMARK, LOGO
        classNumber: '',
        goodsDescription: '',
        applicantType: 'INDIVIDUAL',
        ownerName: '',
        ownerAddress: '',
        isUseDateClean: true, // True = Proposed to be used
        useDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans
    const plans = {
        basic: { title: "Basic Registration", serviceFee: 999 },
        standard: { title: "Standard Registration", serviceFee: 1499 },
        corporate: { title: "Corporate Registration", serviceFee: 2999 },
    };

    // Govt Fees based on applicant type
    const getGovtFee = () => {
        if (['INDIVIDUAL', 'STARTUP', 'SMALL_ENTERPRISE'].includes(formData.applicantType)) return 4500;
        return 9000;
    };

    const getTotalPrice = () => {
        return (plans[planType]?.serviceFee || 1499) + getGovtFee();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Mark Details
            if (!formData.brandName) { newErrors.brandName = "Brand Name required"; isValid = false; }
            if (!formData.classNumber) { newErrors.classNumber = "Class Number required"; isValid = false; }
            if (!formData.goodsDescription) { newErrors.goodsDescription = "Description required"; isValid = false; }
        }
        else if (step === 2) { // Applicant
            if (!formData.ownerName) { newErrors.ownerName = "Owner Name required"; isValid = false; }
            if (!formData.ownerAddress) { newErrors.ownerAddress = "Address required"; isValid = false; }
            if (!formData.isUseDateClean && !formData.useDate) { newErrors.useDate = "Usage Date required"; isValid = false; }
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
            const response = await uploadFile(file, 'trademark');
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
            case 1: // Mark Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Copyright size={20} className="text-blue-600" /> TRADEMARK DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Brand / Logo Name</label>
                                    <input type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.brandName ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. NIKE" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Mark Type</label>
                                    <select name="trademarkType" value={formData.trademarkType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="WORDMARK">Wordmark (Text)</option>
                                        <option value="LOGO">Device (Logo)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Goods/Services Description</label>
                                <textarea name="goodsDescription" rows="2" value={formData.goodsDescription} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.goodsDescription ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Clothing, footwear, headgear"></textarea>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Class Number (1-45)</label>
                                <input type="number" name="classNumber" value={formData.classNumber} min="1" max="45" onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.classNumber ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. 25" />
                                <a href="https://tmrsearch.ipindia.gov.in/tmrpublicsearch/" target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold mt-1 inline-block">Search Class on IP India</a>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Applicant & Usage
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <User size={20} className="text-blue-600" /> APPLICANT DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Applicant Type</label>
                                <select name="applicantType" value={formData.applicantType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                    <option value="INDIVIDUAL">Individual / Proprietor (₹4500 Govt Fee)</option>
                                    <option value="STARTUP">Startup (DPIIT Rec.) (₹4500 Govt Fee)</option>
                                    <option value="SMALL_ENTERPRISE">Small Enterprise (MSME) (₹4500 Govt Fee)</option>
                                    <option value="OTHERS">Company / LLP / Others (₹9000 Govt Fee)</option>
                                </select>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Owner Name</label>
                                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.ownerName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Address</label>
                                    <input type="text" name="ownerAddress" value={formData.ownerAddress} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.ownerAddress ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <label className="flex items-center gap-3 cursor-pointer mb-2">
                                    <input type="checkbox" name="isUseDateClean" checked={formData.isUseDateClean} onChange={handleInputChange} className="w-5 h-5 text-blue-600 rounded" />
                                    <span className="font-bold text-gray-700">Proposed to be used? (New Brand)</span>
                                </label>
                                {!formData.isUseDateClean && (
                                    <div className="mt-2 animate-in fade-in">
                                        <label className="text-xs font-bold text-gray-500 block mb-1">Date of First Use</label>
                                        <input type="date" name="useDate" value={formData.useDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.useDate ? 'border-red-500' : 'border-blue-200'}`} />
                                        <p className="text-xs text-blue-800 mt-1">Usage Affidavit will be required.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-blue-600" /> DOCUMENTS</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'PAN_CARD', label: 'Identity Proof' },
                                    { id: 'AADHAAR_CARD', label: 'Address Proof' }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-6 rounded-xl text-center group hover:border-blue-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">{doc.label}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png" />
                                            {uploadedFiles[doc.id] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles[doc.id].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                ))}

                                {formData.trademarkType === 'LOGO' && (
                                    <div className="border border-dashed p-6 rounded-xl text-center group hover:border-blue-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">Logo Image</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'LOGO_IMAGE')} accept=".jpg,.png" />
                                            {uploadedFiles['LOGO_IMAGE'] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['LOGO_IMAGE'].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                )}
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
                        <p className="text-gray-500 mb-8">Professional Fee + Govt Fee for Trademark</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-lg font-bold text-[#2B3446]">₹{(plans[planType]?.serviceFee || 1499).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Govt Fee</span>
                                <span className="text-lg font-bold text-[#2B3446]">₹{getGovtFee().toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-end">
                                <span className="font-black text-gray-700">Total</span>
                                <span className="text-3xl font-black text-blue-600">₹{getTotalPrice().toLocaleString()}</span>
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
        setApiError(null);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl,
                type: k
            }));

            const finalPayload = {
                submissionId: `TM-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                brandName: formData.brandName,
                applicantType: formData.applicantType,
                plan: planType,
                amountPaid: getTotalPrice(),
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitTrademarkRegistration(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your Trademark application for <b>{formData.brandName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Trademark Registration</h1>
                        <p className="text-gray-500">Protect your Brand & Logo</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Mark Details', 'Owner Details', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-blue-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800">
                                <strong>Selected Plan:</strong> <br />
                                <span className="text-lg font-bold">{plans[planType]?.title || 'Standard'}</span>
                                <div className="mt-2 text-xl font-black text-blue-900">₹{getTotalPrice().toLocaleString()}</div>
                                <div className="text-[10px] text-blue-600 mt-1 opacity-75">Incl. Govt Fees</div>
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

export default ApplyTrademarkRegistration;
