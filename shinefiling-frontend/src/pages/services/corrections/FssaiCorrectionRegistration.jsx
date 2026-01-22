import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, MapPin, Store, AlertTriangle, FileText
} from 'lucide-react';
import { uploadFile, submitFssaiLicense } from '../../../api';

const FssaiCorrectionRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [plan, setPlan] = useState('standard');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const planParam = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/corrections/fssai-correction/apply?plan=${planParam}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'complex', 'professional'].includes(planParam.toLowerCase())) {
            setPlan(planParam.toLowerCase() === 'professional' ? 'standard' : planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        businessName: '',
        existingLicenseNumber: '',
        modificationDetails: '',
        address: '',
        foodCategory: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const pricing = {
        basic: { serviceFee: 999, title: "Basic Update" },
        standard: { serviceFee: 1499, title: "Full Modification" },
        complex: { serviceFee: 2499, title: "Category Change" }
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
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.existingLicenseNumber) { newErrors.existingLicenseNumber = "License Number required"; isValid = false; }
            if (!formData.modificationDetails) { newErrors.modificationDetails = "Please describe required changes"; isValid = false; }
        }
        else if (step === 2) { // Address & Category
            // Optional depending on what they want to change, but good to collect
            if (!formData.address) { newErrors.address = "Current Address required"; isValid = false; }
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
            const response = await uploadFile(file, 'fssai_correction_docs');
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
        setApiError(null);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `FSSAI-MOD-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: plan,
                amountPaid: pricing[plan].serviceFee,
                businessName: formData.businessName,
                licenseType: "MODIFICATION", // Explicitly set
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ...formData,
                    // Map modification details to something useful or keep as is if backend supports generic formData map
                    description: formData.modificationDetails
                },
                documents: docsList
            };

            // Reusing submitFssaiLicense as the controller is generic enough or we can add a new one if needed
            // The controller accepts FssaiRequest which has a generic 'formData' inner class. 
            // We might need to ensure backend FssaiFormData has fields we need or use a map.
            // FssaiRequest.FssaiFormData has specific fields. 
            // Ideally we should add 'modificationDetails' to backend FssaiFormData, but for now we can pass it in 'addressLine2' or similar if strict.
            // Or rely on the fact that we are sending JSON and if backend uses ObjectMapper to map to class, extra fields might be ignored? 
            // Wait, if ignored, then we lose data.
            // I should check FssaiFormData in backend. It has 'addressLine1', 'addressLine2'.
            // I will map 'modificationDetails' to 'addressLine2' or 'kindOfBusiness' as a hack, or better, update backend DTO.
            // Since DTO update is quick and safer: I'll update FssaiFormData in backend to include 'modificationDetails' and 'existingLicenseNumber'.

            await submitFssaiLicense(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
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
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Store size={20} className="text-orange-600" /> LICENSE DETAILS
                            </h3>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Business Name</label>
                                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Existing License/Registration No.</label>
                                <input type="text" name="existingLicenseNumber" value={formData.existingLicenseNumber} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.existingLicenseNumber ? 'border-red-500' : 'border-gray-200'}`} placeholder="14-digit number" />
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">What needs to be changed?</label>
                                <textarea name="modificationDetails" value={formData.modificationDetails} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.modificationDetails ? 'border-red-500' : 'border-gray-200'}`} rows="3" placeholder="Describe the changes (e.g., Change address to ..., Add new product category...)"></textarea>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-orange-600" /> NEW / CURRENT DETAILS
                            </h3>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Current/New Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'}`} rows="3" placeholder="Full address..."></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Food Category (If adding products)</label>
                                <input type="text" name="foodCategory" value={formData.foodCategory} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" placeholder="Optional" />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-orange-600" /> DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">License Copy</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'license_copy')} accept=".pdf,.jpg" />
                                        {uploadedFiles['license_copy'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['license_copy'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Proof of Change</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'proof_of_change')} accept=".pdf,.jpg" />
                                        {uploadedFiles['proof_of_change'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['proof_of_change'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Service Fee for {pricing[plan].title}</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{pricing[plan].serviceFee.toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & File Application'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Modification Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request to modify <b>{formData.businessName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">FSSAI License Modification</h1>
                        <p className="text-gray-500">Update details of your existing license</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['License Details', 'New Details', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-xs text-orange-800">
                                <strong>Selected Plan:</strong> <br />
                                <span className="text-lg font-bold">{pricing[plan].title}</span>
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

export default FssaiCorrectionRegistration;
