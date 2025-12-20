import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, Calendar, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Briefcase, User, Building2, UserPlus, UserMinus
} from 'lucide-react';
import { uploadFile, submitAddRemoveDirector } from '../../../api'; // Need to add to api.js

const AddRemoveDirectorRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [actionType, setActionType] = useState('add');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'add';
            navigate('/login', { state: { from: `/services/roc-filing/add-remove-director/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['add', 'remove'].includes(planParam.toLowerCase())) {
            setActionType(planParam.toLowerCase());
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        effectiveDate: '',

        // ADD
        newDirectorName: '',
        newDirectorDin: '',
        designation: 'Director',

        // REMOVE
        removeDirectorName: '',
        removeDirectorDin: '',
        reason: 'Resignation'
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const planPrice = 1999;

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
        else if (step === 2) { // Director Info
            if (actionType === 'add') {
                if (!formData.newDirectorName) { newErrors.newDirectorName = "Name required"; isValid = false; }
                if (!formData.newDirectorDin) { newErrors.newDirectorDin = "DIN required"; isValid = false; }
            } else {
                if (!formData.removeDirectorName) { newErrors.removeDirectorName = "Name required"; isValid = false; }
            }
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
            const response = await uploadFile(file, 'add_remove_director_docs');
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
                                <label className="text-xs font-bold text-gray-500 block mb-1">Effective Date of Change</label>
                                <input type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.effectiveDate ? 'border-red-500' : 'border-gray-200'}`} />
                                <p className="text-xs text-amber-600 mt-2 font-medium">Must be filed within 30 days of this date to avoid penalty.</p>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Director Details (Dynamic)
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#2B3446] flex items-center gap-2">
                                    {actionType === 'add' ? <UserPlus size={20} className="text-green-500" /> : <UserMinus size={20} className="text-red-500" />}
                                    {actionType === 'add' ? 'NEW DIRECTOR DETAILS' : 'SELECT DIRECTOR TO REMOVE'}
                                </h3>
                                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                                    <button onClick={() => setActionType('add')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${actionType === 'add' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}>Add</button>
                                    <button onClick={() => setActionType('remove')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${actionType === 'remove' ? 'bg-white shadow-sm text-red-700' : 'text-gray-500'}`}>Remove</button>
                                </div>
                            </div>

                            {actionType === 'add' ? (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">New Director Name</label>
                                            <input type="text" name="newDirectorName" value={formData.newDirectorName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.newDirectorName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Full Name as per PAN" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">DIN (Director ID)</label>
                                            <input type="text" name="newDirectorDin" value={formData.newDirectorDin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.newDirectorDin ? 'border-red-500' : 'border-gray-200'}`} placeholder="00012345" maxLength={8} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">Designation</label>
                                        <select name="designation" value={formData.designation} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                            <option value="Director">Director</option>
                                            <option value="Additional Director">Additional Director</option>
                                            <option value="Managing Director">Managing Director</option>
                                            <option value="Nominee Director">Nominee Director</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Director Name</label>
                                            <input type="text" name="removeDirectorName" value={formData.removeDirectorName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.removeDirectorName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Name of Director Resigning" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 block mb-1">Reason</label>
                                            <select name="reason" value={formData.reason} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                                <option value="Resignation">Resignation</option>
                                                <option value="Removal">Removal by EGM</option>
                                                <option value="Deiseased">Death</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100 flex gap-2">
                                        <Briefcase size={16} className="shrink-0 mt-0.5" />
                                        <span>Ensure the company maintains the minimum director count (2 for Pvt Ltd) after this removal.</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );

            case 3: // Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><FileText size={20} className="text-yellow-600" /> SUPPORTING DOCUMENTS</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {actionType === 'add' ? (
                                    <>
                                        <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                            <label className="cursor-pointer block">
                                                <div className="mb-2 mx-auto w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition">
                                                    <FileText size={24} />
                                                </div>
                                                <span className="font-bold text-gray-700 block mb-1">Consent Letter (DIR-2)</span>
                                                <span className="text-xs text-gray-400 block mb-4">Signed by New Director</span>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'dir2_consent')} accept=".pdf,.jpg" />
                                                {uploadedFiles['dir2_consent'] ?
                                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['dir2_consent'].name}</span> :
                                                    <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                                }
                                            </label>
                                        </div>
                                        <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                            <label className="cursor-pointer block">
                                                <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-yellow-500 transition">
                                                    <User size={24} />
                                                </div>
                                                <span className="font-bold text-gray-700 block mb-1">PAN & Aadhaar</span>
                                                <span className="text-xs text-gray-400 block mb-4">Self Attested Copy</span>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'kyc_docs')} accept=".pdf" />
                                                {uploadedFiles['kyc_docs'] ?
                                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['kyc_docs'].name}</span> :
                                                    <span className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold">Choose File</span>
                                                }
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <div className="border border-dashed p-6 rounded-xl text-center group hover:border-yellow-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">Resignation Letter</span>
                                            <span className="text-xs text-gray-400 block mb-4">Signed by Resigning Director</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'resignation_letter')} accept=".pdf,.jpg" />
                                            {uploadedFiles['resignation_letter'] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['resignation_letter'].name}</span> :
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
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Pay service fee for {actionType.toUpperCase()} Director.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{planPrice.toLocaleString()}</span>
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
                submissionId: `ROCDIR-${Date.now()}`,
                actionType: actionType.toUpperCase(),
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL",
                amountPaid: planPrice
            };

            const response = await submitAddRemoveDirector(finalPayload);
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
                        Your request to <b>{actionType.toUpperCase()} Director</b> in <b>{formData.companyName}</b> has been received.
                        <br />We will draft the resolutions within 24 hours.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Add / Remove Director</h1>
                        <p className="text-gray-500">Form DIR-12 Filing</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Company Info', 'Director Details', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-yellow-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
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

export default AddRemoveDirectorRegistration;
