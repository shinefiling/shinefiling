import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Factory, Droplets, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitPollutionControl } from '../../../api';

const PollutionControlRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('CTE'); // CTE, CTO

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/pollution-control/apply` } });
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) setPlanType(plan.toUpperCase());
    }, [searchParams]);

    const [formData, setFormData] = useState({
        industryName: '',
        state: '',
        businessCategory: '', // RED, ORANGE, GREEN, WHITE
        certificateType: 'CTE',
        industryActivity: '',
        address: '',
        investmentAmount: '',
        dailyWaterConsumption: '',
        dailyEffluentDischarge: '',
        hasEtpStp: false,
        hasAirPollutionControl: false,
        generatesHazardousWaste: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const getPrice = () => {
        if (formData.businessCategory === 'RED') return 24999;
        if (formData.businessCategory === 'WHITE') return 4999;
        return 14999; // Orange/Green
    };
    const price = getPrice();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    // Auto-categorize
    const handleActivityChange = (e) => {
        const val = e.target.value;
        let cat = 'GREEN';
        if (val.toLowerCase().includes('chemical') || val.toLowerCase().includes('pharma') || val.toLowerCase().includes('dye')) cat = 'RED';
        else if (val.toLowerCase().includes('food') || val.toLowerCase().includes('hotel')) cat = 'ORANGE';
        else if (val.toLowerCase().includes('solar') || val.toLowerCase().includes('assembly')) cat = 'WHITE';

        setFormData(prev => ({ ...prev, industryActivity: val, businessCategory: cat }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.industryName) { newErrors.industryName = "Industry Name required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
            if (!formData.industryActivity) { newErrors.industryActivity = "Activity required"; isValid = false; }
            if (!formData.investmentAmount) { newErrors.investmentAmount = "Investment required"; isValid = false; }
        }
        else if (step === 2) {
            if (!formData.address) { newErrors.address = "Address required"; isValid = false; }
            if (!formData.dailyWaterConsumption) { newErrors.dailyWaterConsumption = "Water Req required"; isValid = false; }
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
            const response = await uploadFile(file, 'pollution_control');
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
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Factory size={20} className="text-orange-600" /> INDUSTRY DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Industry Name</label>
                                    <input type="text" name="industryName" value={formData.industryName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.industryName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">State</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-200'}`}>
                                        <option value="">Select State</option>
                                        <option value="Maharashtra">Maharashtra (MPCB)</option>
                                        <option value="Karnataka">Karnataka (KSPCB)</option>
                                        <option value="Delhi">Delhi (DPCC)</option>
                                        <option value="Gujarat">Gujarat (GPCB)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Primary Activity</label>
                                    <input type="text" name="industryActivity" value={formData.industryActivity} onChange={handleActivityChange} className={`w-full p-3 rounded-lg border ${errors.industryActivity ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Chemical Mfg" />
                                    {formData.businessCategory && (
                                        <span className={`text-xs font-bold mt-1 block uppercase ${formData.businessCategory === 'RED' ? 'text-red-500' :
                                            formData.businessCategory === 'ORANGE' ? 'text-orange-500' :
                                                'text-green-500'
                                            }`}>Category: {formData.businessCategory}</span>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Certificate Type</label>
                                    <select name="certificateType" value={formData.certificateType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="CTE">CTE (Establish)</option>
                                        <option value="CTO">CTO (Operate)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Investment (Crores)</label>
                                <input type="number" step="0.01" name="investmentAmount" value={formData.investmentAmount} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.investmentAmount ? 'border-red-500' : 'border-gray-200'}`} placeholder="Cr" />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Droplets size={20} className="text-orange-600" /> ENVIRONMENTAL & SITE
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Site Address</label>
                                <textarea name="address" rows="2" value={formData.address} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'}`}></textarea>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Water Req (KLD)</label>
                                    <input type="number" step="0.1" name="dailyWaterConsumption" value={formData.dailyWaterConsumption} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.dailyWaterConsumption ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Effluent (KLD)</label>
                                    <input type="number" step="0.1" name="dailyEffluentDischarge" value={formData.dailyEffluentDischarge} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <div className="space-y-2">
                                    {[
                                        { key: 'hasEtpStp', label: 'ETP / STP Installed?' },
                                        { key: 'hasAirPollutionControl', label: 'Air Pollution Control Installed?' },
                                        { key: 'generatesHazardousWaste', label: 'Generates Hazardous Waste?' }
                                    ].map(item => (
                                        <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name={item.key} checked={formData[item.key]} onChange={handleInputChange} className="w-4 h-4 text-green-600 rounded" />
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
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
                                {['SITE_PLAN', 'PROCESS_FLOW', 'CA_CERT'].map((docKey) => (
                                    <div key={docKey} className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1 capitalize">{docKey.replace('_', ' ').toLowerCase()}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, docKey)} accept=".pdf,.jpg" />
                                            {uploadedFiles[docKey] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles[docKey].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                ))}
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
                        <p className="text-gray-500 mb-8">Professional Fee for Pollution Control Board (PCB) Consent</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{price.toLocaleString()}</span>
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
                submissionId: `PCB-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: planType,
                amountPaid: price,
                industryName: formData.industryName,
                state: formData.state,
                businessCategory: formData.businessCategory,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ...formData,
                    investmentAmount: parseFloat(formData.investmentAmount) || 0,
                    dailyWaterConsumption: parseFloat(formData.dailyWaterConsumption) || 0,
                    dailyEffluentDischarge: parseFloat(formData.dailyEffluentDischarge) || 0
                },
                documents: docsList
            };

            const response = await submitPollutionControl(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your Pollution Control consent application for <b>{formData.industryName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Pollution Control Board Registration</h1>
                        <p className="text-gray-500">CTE (Establish) & CTO (Operate) Consents</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Industry Details', 'Environmental', 'Documents', 'Payment'].map((step, i) => (
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
                                <strong>Selected Category:</strong> <br />
                                <span className="text-lg font-bold">{formData.businessCategory || 'Pending...'}</span>
                                <div className="mt-2 text-xl font-black text-orange-900">₹{price.toLocaleString()}</div>
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

export default PollutionControlRegistration;
