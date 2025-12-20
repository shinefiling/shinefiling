import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, MapPin
} from 'lucide-react';
import { uploadFile, submitChangeRegisteredOffice } from '../../../api'; // Need to add to api.js

const ChangeRegisteredOfficeRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('same_city');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'same_city';
            navigate('/login', { state: { from: `/services/roc-filing/change-registered-office/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['same_city', 'same_roc', 'different_state'].includes(planParam.toLowerCase())) {
            setPlanType(planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        existingAddress: '',
        newAddress: '',
        city: '',
        state: '',
        pincode: '',
        effectiveDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        same_city: { price: 1999, title: 'Local Shift' },
        same_roc: { price: 4999, title: 'State Shift' },
        different_state: { price: 19999, title: 'Inter-State Shift' }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Company Info
            if (!formData.companyName) { newErrors.companyName = "Company required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "CIN required"; isValid = false; }
            if (!formData.effectiveDate) { newErrors.effectiveDate = "Date required"; isValid = false; }
        }
        else if (step === 2) { // New Address
            if (!formData.newAddress) { newErrors.newAddress = "Address required"; isValid = false; }
            if (!formData.city) { newErrors.city = "City required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
            if (!formData.pincode) { newErrors.pincode = "Pincode required"; isValid = false; }
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
            const response = await uploadFile(file, 'office_change_docs');
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
            case 1: // Company Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-yellow-600" /> COMPANY DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. ABC Pvt Ltd" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">CIN</label>
                                    <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.cin ? 'border-red-500' : 'border-gray-200'}`} placeholder="U12345DL2024PTC123456" maxLength={21} style={{ textTransform: 'uppercase' }} />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Existing Registered Address</label>
                                <textarea name="existingAddress" value={formData.existingAddress} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 h-24" placeholder="Current address as per MCA records"></textarea>
                            </div>

                            <div className="mt-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Effective Date of Shifting</label>
                                <input type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.effectiveDate ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                        </div>
                    </div>
                );

            case 2: // New Address
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-yellow-600" /> NEW ADDRESS DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Full Address</label>
                                <textarea name="newAddress" value={formData.newAddress} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.newAddress ? 'border-red-500' : 'border-gray-200'} h-24`} placeholder="Shop No, Building, Street, Area"></textarea>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">State</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Pincode</label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.pincode ? 'border-red-500' : 'border-gray-200'}`} maxLength={6} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-yellow-600" /> PROOF OF NEW ADDRESS</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Utility Bill</span>
                                        <span className="text-xs text-gray-400 block mb-4">Electricity/Gas/Phone (Max 2 Months Old)</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'utility_bill')} accept=".pdf,.jpg" />
                                        {uploadedFiles['utility_bill'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['utility_bill'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-yellow-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">NOC from Owner</span>
                                        <span className="text-xs text-gray-400 block mb-4">Or Rent Agreement</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'noc_doc')} accept=".pdf,.jpg" />
                                        {uploadedFiles['noc_doc'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['noc_doc'].name}</span> :
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
                        <p className="text-gray-500 mb-8">Pay service fee for {plans[planType].title}.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{plans[planType].price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs text-gray-400">
                                <span>Govt Fee</span>
                                <span>Actuals Extra</span>
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

            const finalPayload = {
                submissionId: `ROCOFFICE-${Date.now()}`,
                changeType: planType.toUpperCase(),
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL",
                amountPaid: plans[planType].price
            };

            const response = await submitChangeRegisteredOffice(finalPayload);
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
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Filing Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request to change registered office for <b>{formData.companyName}</b> has been received.
                        <br />We will verify the documents and draft resolutions.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Change Registered Office</h1>
                        <p className="text-gray-500">Form INC-22 Filing</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Company Info', 'New Address', 'Documents', 'Payment'].map((step, i) => (
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

export default ChangeRegisteredOfficeRegistration;
