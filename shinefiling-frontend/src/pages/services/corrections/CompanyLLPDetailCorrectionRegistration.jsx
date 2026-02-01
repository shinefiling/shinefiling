import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, ArrowLeft, ArrowRight, IndianRupee, Building, FileText, AlertCircle, Shield
} from 'lucide-react';
import { uploadFile, submitCompanyLlpCorrection } from '../../../api';

const CompanyLLPDetailCorrectionRegistration = ({ isLoggedIn }) => {
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
            navigate('/login', { state: { from: `/services/corrections/company-llp-correction/apply?plan=${planParam}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['capital', 'standard', 'name'].includes(planParam.toLowerCase())) {
            setPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        companyType: 'Private Limited',
        correctionType: 'Address Change', // Address, Capital, Objectives, Directors, Others
        detailsToCorrect: '',
        newInformation: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const pricing = {
        'capital': { serviceFee: 2499, title: "Capital Increase" },
        'standard': { serviceFee: 3999, title: "Office Shift / Standard" },
        'name': { serviceFee: 7999, title: "Name Change" }
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
            if (!formData.companyName) { newErrors.companyName = "Company Name required"; isValid = false; }
            if (!formData.cin) { newErrors.cin = "CIN required"; isValid = false; }
        } else if (step === 2) { // Change Details
            if (!formData.detailsToCorrect) { newErrors.detailsToCorrect = "Please specify what needs to be changed"; isValid = false; }
            if (!formData.newInformation) { newErrors.newInformation = "Please enter the new correct information"; isValid = false; }
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
            const response = await uploadFile(file, 'roc_correction_docs');
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
                submissionId: `ROC-C-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: plan,
                amountPaid: pricing[plan].serviceFee,
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitCompanyLlpCorrection(finalPayload);
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
                                <Building size={20} className="text-indigo-600" /> ENTITY DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Full Company / LLP Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">CIN / LLPIN</label>
                                        <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.cin ? 'border-red-500' : 'border-gray-200'}`} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Entity Type</label>
                                        <select name="companyType" value={formData.companyType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                            <option value="Private Limited">Private Limited</option>
                                            <option value="LLP">LLP</option>
                                            <option value="One Person Company">One Person Company</option>
                                            <option value="Public Limited">Public Limited</option>
                                        </select>
                                    </div>
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
                                <FileText size={20} className="text-red-600" /> CORRECTION DETAILS
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Nature of Correction</label>
                                    <select name="correctionType" value={formData.correctionType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Address Change">Address Change (Office)</option>
                                        <option value="Capital Increase">Authorized / Paid-up Capital</option>
                                        <option value="MOA/AOA Change">MOA / AOA Amendment</option>
                                        <option value="Director Change">Director / Partner Details</option>
                                        <option value="Others">Others (Master Data Mistake)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Details to Correct</label>
                                    <textarea name="detailsToCorrect" value={formData.detailsToCorrect} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.detailsToCorrect ? 'border-red-500' : 'border-gray-200'}`} rows="2" placeholder="Specify which field in MCA records is incorrect..."></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">New Correct Information</label>
                                    <textarea name="newInformation" value={formData.newInformation} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.newInformation ? 'border-red-500' : 'border-gray-200'}`} rows="4" placeholder="Enter the new details as per supporting documents..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-6">UPLOAD SUPPORTING DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Certificate of Incorporation', key: 'coi' },
                                    { label: 'Authorized Signatory PAN/Aadhaar', key: 'signatory_id' },
                                    { label: 'Passport Size Photo of Directors', key: 'director_photo' },
                                    { label: 'Proof of Proposed Correction', key: 'change_proof' }
                                ].map((doc, idx) => (
                                    <div key={idx} className="border border-dashed p-4 rounded-xl flex justify-between items-center group hover:border-indigo-300 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition">
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
                        <h2 className="text-2xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="space-y-6 text-sm">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Company Name</p>
                                    <p className="font-bold text-navy">{formData.companyName}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">CIN / LLPIN</p>
                                    <p className="font-bold text-navy">{formData.cin}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <p className="text-indigo-800 text-xs font-bold uppercase mb-2">Requested Correction</p>
                                <p className="text-navy font-semibold mb-2">{formData.correctionType}</p>
                                <div className="p-3 bg-white rounded-lg text-xs text-gray-600 leading-relaxed font-mono">
                                    {formData.newInformation}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Professional Fee</h2>
                        <p className="text-gray-500 mb-8">Service fee for {pricing[plan].title}</p>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500">Total</span>
                                <span className="text-4xl font-bold text-navy">₹{pricing[plan].serviceFee}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right mt-1">+ MCA Govt Fees (as per actuals)</p>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & File Correction'}
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
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request for master data correction of <b>{formData.companyName}</b> has been received. Our CS team will verify the documents and draft the necessary board resolutions.
                    </p>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">Company / LLP Detail Correction</h1>
                        <p className="text-gray-500">Update your corporate master data on the MCA portal</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Entity Info', 'Corrections', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-indigo-700' : 'text-gray-600'}`}>{step}</span>
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

export default CompanyLLPDetailCorrectionRegistration;
