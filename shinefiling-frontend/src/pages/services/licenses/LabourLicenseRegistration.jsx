import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, HardHat, Building, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitLabourLicense } from '../../../api';

const LabourLicenseRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('standard');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/labour-license/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const [formData, setFormData] = useState({
        contractorName: '',
        state: '',
        numberOfLabourers: '',
        principalEmployerName: '',
        principalEmployerAddress: '',
        natureOfWork: '',
        workStartDate: '',
        workEndDate: '',
        isContractAgreementAvailable: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const price = 3999;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.contractorName) { newErrors.contractorName = "Contractor Name required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
            if (!formData.numberOfLabourers) { newErrors.numberOfLabourers = "Number of Labourers required"; isValid = false; }
            else if (parseInt(formData.numberOfLabourers) < 20) { newErrors.numberOfLabourers = "Minimum 20 labourers required"; isValid = false; }
        }
        else if (step === 2) {
            if (!formData.principalEmployerName) { newErrors.principalEmployerName = "Principal Employer required"; isValid = false; }
            if (!formData.natureOfWork) { newErrors.natureOfWork = "Nature of Work required"; isValid = false; }
            if (!formData.workStartDate) { newErrors.workStartDate = "Start Date required"; isValid = false; }
            if (!formData.workEndDate) { newErrors.workEndDate = "End Date required"; isValid = false; }
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
            const response = await uploadFile(file, 'labour_license');
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
                                <HardHat size={20} className="text-orange-600" /> CONTRACTOR DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Contractor Name</label>
                                    <input type="text" name="contractorName" value={formData.contractorName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.contractorName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Full Name" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">State of Work</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-200'}`}>
                                        <option value="">Select State</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Number of Labourers</label>
                                <input type="number" name="numberOfLabourers" value={formData.numberOfLabourers} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.numberOfLabourers ? 'border-red-500' : 'border-gray-200'}`} placeholder="Max count on any day" />
                                <span className="text-xs text-gray-400 mt-1">Must be 20 or more for license applicability.</span>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Building size={20} className="text-orange-600" /> WORK DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Principal Employer Name</label>
                                <input type="text" name="principalEmployerName" value={formData.principalEmployerName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.principalEmployerName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Company issuing contract" />
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Empoyer Address</label>
                                <textarea name="principalEmployerAddress" rows="2" value={formData.principalEmployerAddress} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200"></textarea>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Nature of Work</label>
                                    <input type="text" name="natureOfWork" value={formData.natureOfWork} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.natureOfWork ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Housekeeping" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Agreement Available?</label>
                                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                                        <input type="checkbox" name="isContractAgreementAvailable" checked={formData.isContractAgreementAvailable} onChange={handleInputChange} className="w-5 h-5 text-orange-600 rounded" />
                                        <span className="text-sm font-medium">Yes</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Start Date</label>
                                    <input type="date" name="workStartDate" value={formData.workStartDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.workStartDate ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">End Date</label>
                                    <input type="date" name="workEndDate" value={formData.workEndDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.workEndDate ? 'border-red-500' : 'border-gray-200'}`} />
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
                                {['FORM_V', 'CONTRACT_AGREEMENT'].map((docKey) => (
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
                        <p className="text-gray-500 mb-8">Professional Fee for Labour License</p>

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
                submissionId: `LABOUR-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: "standard",
                amountPaid: price,
                contractorName: formData.contractorName,
                state: formData.state,
                numberOfLabourers: parseInt(formData.numberOfLabourers),
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ...formData,
                    numberOfLabourers: parseInt(formData.numberOfLabourers)
                },
                documents: docsList
            };

            const response = await submitLabourLicense(finalPayload);
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
                        Your Labour License application for <b>{formData.contractorName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Labour License Registration</h1>
                        <p className="text-gray-500">Contract Labour Regulation & Abolition Act</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Contractor Details', 'Work Details', 'Documents', 'Payment'].map((step, i) => (
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
                                <span className="text-lg font-bold">Standard License</span>
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

export default LabourLicenseRegistration;
