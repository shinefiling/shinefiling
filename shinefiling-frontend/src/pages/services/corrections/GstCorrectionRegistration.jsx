import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, Building, FileText, AlertCircle, RefreshCw
} from 'lucide-react';
import { uploadFile, submitGstCorrection } from '../../../api';

const GstCorrectionRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [plan, setPlan] = useState('non-core');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const planParam = searchParams.get('plan') || 'non-core';
            navigate('/login', { state: { from: `/services/corrections/gst-correction/apply?plan=${planParam}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['non_core', 'core', 'complex'].includes(planParam.toLowerCase())) {
            setPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        businessName: '',
        gstin: '',
        amendmentReason: '',
        natureOfChange: 'Core Fields', // Core Fields, Non-Core Fields, Cancellation
        newDetails: '',
        effectiveDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const pricing = {
        'non_core': { serviceFee: 999, title: "Non-Core Amendment" },
        'core': { serviceFee: 1999, title: "Core Field Amendment" },
        'complex': { serviceFee: 3499, title: "Complex Amendment" }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Entity Details
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.gstin) { newErrors.gstin = "GSTIN required"; isValid = false; }
            if (!formData.amendmentReason) { newErrors.amendmentReason = "Reason for amendment is required"; isValid = false; }
        } else if (step === 2) { // Change Details
            if (!formData.newDetails) { newErrors.newDetails = "Please describe the changes"; isValid = false; }
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
            const response = await uploadFile(file, 'gst_correction_docs');
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
                submissionId: `GST-A-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: plan,
                amountPaid: pricing[plan].serviceFee,
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitGstCorrection(finalPayload);
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
                                <Building size={20} className="text-teal-600" /> GST ENTITY DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Legal Trade Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">GSTIN</label>
                                    <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.gstin ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Reason for Amendment</label>
                                    <textarea name="amendmentReason" value={formData.amendmentReason} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.amendmentReason ? 'border-red-500' : 'border-gray-200'}`} rows="2" placeholder="Why are you changing these details?"></textarea>
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
                                <RefreshCw size={20} className="text-blue-600" /> AMENDMENT DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Nature of Change</label>
                                    <select name="natureOfChange" value={formData.natureOfChange} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Core Fields">Core Fields (Email, Phone, Name, Address)</option>
                                        <option value="Non-Core Fields">Non-Core Fields (Authorized Signatory, Stakeholders)</option>
                                        <option value="Cancellation">Registration Cancellation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Enter New Correct Details</label>
                                    <textarea name="newDetails" value={formData.newDetails} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.newDetails ? 'border-red-500' : 'border-gray-200'}`} rows="4" placeholder="Detail the new values for the fields being changed..."></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Effective Date of Change</label>
                                    <input type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-6">SUPPORTING DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Latest GST Certificate', key: 'gst_cert' },
                                    { label: 'Address Proof (if address change)', key: 'address_proof' },
                                    { label: 'Identity Proof of Authorized Signatory', key: 'id_proof' },
                                    { label: 'Board Resolution / Letter of Auth', key: 'auth_doc' }
                                ].map((doc, idx) => (
                                    <div key={idx} className="border border-dashed p-4 rounded-xl flex justify-between items-center group hover:border-teal-300 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-teal-500 transition">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">{doc.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {uploadedFiles[doc.key] && <CheckCircle size={16} className="text-green-500" />}
                                            <label className="cursor-pointer bg-navy text-white px-3 py-1.5 rounded-lg text-xs font-bold">
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
                        <h2 className="text-2xl font-bold text-navy mb-6">Review Amendment</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                                <div className="border-b pb-2">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Business Name</p>
                                    <p className="font-bold text-navy">{formData.businessName}</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">GSTIN</p>
                                    <p className="font-bold text-navy uppercase">{formData.gstin}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                                    <p className="text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">Change Description</p>
                                    <p className="text-navy font-medium italic text-xs leading-relaxed">{formData.newDetails}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Amendment Fee</h2>
                        <p className="text-gray-500 mb-8">Service fee for {pricing[plan].title}</p>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500">Total</span>
                                <span className="text-4xl font-bold text-navy">₹{pricing[plan].serviceFee}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & File Amendment'}
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
                    <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-teal-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Request Filed Successfully!</h1>
                    <p className="text-gray-500 mb-8">
                        Your GST amendment request for <b>{formData.businessName}</b> has been received. Our compliance officer will review the documents and initiate the portal filing within 24-48 hours.
                    </p>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Orders</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">GST Certificate Amendment</h1>
                        <p className="text-gray-500">Correct or update your business details on the GST portal</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['GST Details', 'Changes', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-teal-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-teal-500" />}
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

export default GstCorrectionRegistration;
