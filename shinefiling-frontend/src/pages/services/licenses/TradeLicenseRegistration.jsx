import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Building, AlertTriangle, Store
} from 'lucide-react';
import { uploadFile, submitTradeLicense } from '../../../api';

const TradeLicenseRegistration = ({ isLoggedIn }) => {
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
            navigate('/login', { state: { from: `/services/licenses/trade-license/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) setPlanType(plan);
    }, [searchParams]);

    const [formData, setFormData] = useState({
        businessName: '',
        entityType: '',
        natureOfTrade: '',
        commencementDate: '',
        address: '',
        city: '',
        state: '',
        wardNumber: '',
        areaSquareFeet: '',
        isRented: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        standard: { price: 2999, title: "New Trade License" },
        renewal: { price: 1999, title: "License Renewal" }
    };

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
            if (!formData.natureOfTrade) { newErrors.natureOfTrade = "Nature of Trade required"; isValid = false; }
            if (!formData.entityType) { newErrors.entityType = "Entity Type required"; isValid = false; }
            if (!formData.city) { newErrors.city = "City required"; isValid = false; }
        }
        else if (step === 2) { // Address & Area
            if (!formData.address) { newErrors.address = "Address required"; isValid = false; }
            if (!formData.areaSquareFeet) { newErrors.areaSquareFeet = "Area required"; isValid = false; }
            if (!formData.commencementDate) { newErrors.commencementDate = "Date required"; isValid = false; }
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
            const response = await uploadFile(file, 'trade_docs');
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
                                <Store size={20} className="text-blue-600" /> BUSINESS DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Trade Name" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Entity Type</label>
                                    <select name="entityType" value={formData.entityType} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.entityType ? 'border-red-500' : 'border-gray-200'}`}>
                                        <option value="">Select Type</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Private Limited">Private Limited</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Nature of Trade</label>
                                    <input type="text" name="natureOfTrade" value={formData.natureOfTrade} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.natureOfTrade ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Grocery, Salon, IT" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">City / Municipality</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-200'}`} placeholder="City Name" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Address & Area
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-blue-600" /> LOCATION & AREA
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Business Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'}`} rows="3" placeholder="Full address..."></textarea>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Ward No (Optional)</label>
                                    <input type="text" name="wardNumber" value={formData.wardNumber} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Area (Sq. Ft)</label>
                                    <input type="number" name="areaSquareFeet" value={formData.areaSquareFeet} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.areaSquareFeet ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Start Date</label>
                                    <input type="date" name="commencementDate" value={formData.commencementDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.commencementDate ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                                <input type="checkbox" name="isRented" checked={formData.isRented} onChange={handleInputChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                <span className="font-bold text-sm text-gray-700">Property is Rented</span>
                            </label>
                        </div>
                    </div>
                );

            case 3: // Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-blue-600" /> DOCUMENTS</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-blue-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Property Tax Receipt</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'property_tax')} accept=".pdf,.jpg" />
                                        {uploadedFiles['property_tax'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['property_tax'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                {formData.isRented && (
                                    <div className="border border-dashed p-6 rounded-xl text-center group hover:border-blue-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">Rent Agmt / NOC</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'rent_agreement')} accept=".pdf,.jpg" />
                                            {uploadedFiles['rent_agreement'] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['rent_agreement'].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
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
                        <p className="text-gray-500 mb-8">Professional Fee for {plans[planType]?.title || 'Trade License'}</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{(plans[planType]?.price || 2999).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs text-gray-400">
                                <span>Govt Fee</span>
                                <span>Actuals Extra</span>
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
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `TRADE-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: planType,
                amountPaid: plans[planType]?.price || 2999,
                businessName: formData.businessName,
                city: formData.city,
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            const response = await submitTradeLicense(finalPayload);
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
                        Your Trade License request for <b>{formData.businessName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Trade License Registration</h1>
                        <p className="text-gray-500">Apply for Trade License / Renewal</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Details', 'Location & Area', 'Documents', 'Payment'].map((step, i) => (
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
                                <div className="mt-2 text-xl font-black text-blue-900">₹{(plans[planType]?.price || 2999).toLocaleString()}</div>
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

export default TradeLicenseRegistration;
