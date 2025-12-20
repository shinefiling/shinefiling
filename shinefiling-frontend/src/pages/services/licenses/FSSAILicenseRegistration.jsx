import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Store, Building, Globe, Zap, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitFssaiLicense } from '../../../api'; // Adding to api.js next

const FSSAILicenseRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [licenseType, setLicenseType] = useState('basic');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const type = searchParams.get('type') || 'basic';
            navigate('/login', { state: { from: `/services/licenses/fssai-license/register?type=${type}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam && ['basic', 'state', 'central'].includes(typeParam.toLowerCase())) {
            setLicenseType(typeParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        businessName: '',
        gstNumber: '',
        businessType: '', // Proprietorship, etc.
        turnover: '',
        validityYears: '1',
        address: '',
        foodCategory: '',
        isImporterExporter: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Dynamic Pricing (Govt fees vary, this is Service Fee)
    const pricing = {
        basic: { serviceFee: 1499, title: "Basic Registration" },
        state: { serviceFee: 4999, title: "State License" },
        central: { serviceFee: 7499, title: "Central License" }
    };

    // Auto-calculate license type based on turnover input
    useEffect(() => {
        if (!formData.turnover) return;

        // If Importer, force Central
        if (formData.isImporterExporter) {
            setLicenseType('central');
            return;
        }

        const t = parseFloat(formData.turnover);
        if (isNaN(t)) return;

        // Turnover logic
        if (t > 200000000) { // > 20 Cr
            if (licenseType !== 'central') setLicenseType('central');
        } else if (t > 1200000) { // > 12 L
            if (licenseType !== 'central' && licenseType !== 'state') setLicenseType('state');
        } else {
            // Basic
            if (licenseType !== 'basic') setLicenseType('basic');
        }
    }, [formData.turnover, formData.isImporterExporter]);


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Details
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.businessType) { newErrors.businessType = "Entity Type required"; isValid = false; }
            if (!formData.turnover) { newErrors.turnover = "Turnover required"; isValid = false; }
        }
        else if (step === 2) { // Address & Category
            if (!formData.address) { newErrors.address = "Address required"; isValid = false; }
            if (!formData.foodCategory) { newErrors.foodCategory = "Food Category required"; isValid = false; }
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
            const response = await uploadFile(file, 'fssai_docs');
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
            case 1: // Business Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Store size={20} className="text-orange-600" /> BUSINESS DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Tasty Foods" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Entity Type</label>
                                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessType ? 'border-red-500' : 'border-gray-200'}`}>
                                        <option value="">Select Type</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership / LLP</option>
                                        <option value="Private Limited">Private Limited Company</option>
                                        <option value="One Person Company">One Person Company</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Annual Turnover (Expected/Actual)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-gray-400">₹</span>
                                    <input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} className={`w-full p-3 pl-8 rounded-lg border ${errors.turnover ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. 1500000" />
                                </div>
                                <p className="text-xs text-orange-500 mt-1">This determines your license type (Basic/State/Central).</p>
                            </div>

                            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                                <input type="checkbox" name="isImporterExporter" checked={formData.isImporterExporter} onChange={handleInputChange} className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />
                                <div>
                                    <span className="font-bold text-sm text-gray-700">Import / Export Business</span>
                                    <p className="text-xs text-gray-500">Select this if you import/export food products (Mandatory Central License).</p>
                                </div>
                            </label>
                        </div>
                    </div>
                );

            case 2: // Address & Category
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-orange-600" /> PREMISES DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Address of Food Premises</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'}`} rows="3" placeholder="Full address of the kitchen/shop/unit..."></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Food Categories</label>
                                <input type="text" name="foodCategory" value={formData.foodCategory} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.foodCategory ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Dairy, Bakery, Read-to-eat, Beverages" />
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Validity Required</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(y => (
                                        <button key={y} onClick={() => setFormData({ ...formData, validityYears: y })} className={`flex-1 py-2 rounded-lg border font-bold text-sm transition ${formData.validityYears == y ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'}`}>
                                            {y} Yr
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Uploads
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
                                        <span className="font-bold text-gray-700 block mb-1">Photo of Owner</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'owner_photo')} accept=".jpg,.png" />
                                        {uploadedFiles['owner_photo'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['owner_photo'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Premises Proof</span>
                                        <span className="text-xs text-gray-400 block mb-4">Rental Agreement / Electricity Bill</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'premises_proof')} accept=".pdf,.jpg" />
                                        {uploadedFiles['premises_proof'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['premises_proof'].name}</span> :
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
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Professional Fee for {pricing[licenseType].title}</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{pricing[licenseType].serviceFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs text-gray-400">
                                <span>Govt Fee</span>
                                <span>Based on {formData.validityYears} Yr Validity</span>
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
                submissionId: `FSSAI-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                businessName: formData.businessName,
                businessType: formData.businessType,
                businessCategory: formData.foodCategory, // Sending as category
                annualTurnover: parseFloat(formData.turnover),
                validityYears: parseInt(formData.validityYears),
                licenseType: licenseType.toUpperCase(),
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            const response = await submitFssaiLicense(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">FSSAI Application Filed!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <b>{formData.businessName}</b> has been received.
                        <br />License Type: <b>{pricing[licenseType].title}</b>
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">FSSAI License Registration</h1>
                        <p className="text-gray-500">Apply for Food License / Registration</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Details', 'Address & Validity', 'Documents', 'Payment'].map((step, i) => (
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
                                <strong>Detected License Type:</strong> <br />
                                <span className="text-lg font-bold">{pricing[licenseType].title}</span>
                                <p className="mt-1 opacity-70">Based on Turnover: ₹{formData.turnover || 0}</p>
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

export default FSSAILicenseRegistration;
