import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, AlertTriangle, Receipt, X
} from 'lucide-react';
import { uploadFile, submitProfessionalTax } from '../../../api';

const ApplyProfessionalTax = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState(planProp || 'standard');

    useEffect(() => {
        if (planProp) setPlanType(planProp);
    }, [planProp]);

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour/professional-tax/apply` } });
        }
    }, [isLoggedIn, navigate, isModal]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) setPlanType(plan);
    }, [searchParams]);

    const [formData, setFormData] = useState({
        businessName: '',
        serviceType: 'BOTH',
        state: 'MAHARASHTRA',
        businessNature: '',
        employeeCount: '',
        salaryStructure: '',
        filingFrequency: 'MONTHLY'
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const getFee = () => {
        return formData.serviceType === 'BOTH' ? 2999 : 1999;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.businessNature) { newErrors.businessNature = "Business Nature required"; isValid = false; }
            if (!formData.employeeCount) { newErrors.employeeCount = "Employee count required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        setApiError(null);
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(3, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'professional-tax');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
            setApiError(null);
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
                fileUrl: v.fileUrl,
                type: k
            }));

            const finalPayload = {
                submissionId: `PT-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                businessName: formData.businessName,
                plan: planType,
                amountPaid: getFee(),
                status: "PAYMENT_SUCCESSFUL",
                formData: { ...formData },
                documents: docsList
            };

            await submitProfessionalTax(finalPayload);
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
                                <Receipt size={20} className="text-orange-500" /> BUSINESS DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-tight">Business Name</label>
                                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'} font-bold`} placeholder="e.g. ABC Technologies" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-tight">State</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 font-bold cursor-pointer">
                                        <option value="MAHARASHTRA">Maharashtra</option>
                                        <option value="KARNATAKA">Karnataka</option>
                                        <option value="TAMIL_NADU">Tamil Nadu</option>
                                        <option value="GUJARAT">Gujarat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-tight">Service Type</label>
                                    <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 font-bold cursor-pointer">
                                        <option value="REGISTRATION">Registration Only</option>
                                        <option value="FILING">Filing Only</option>
                                        <option value="BOTH">Registration + Filing</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-tight">Business Nature</label>
                                    <input type="text" name="businessNature" value={formData.businessNature} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessNature ? 'border-red-500' : 'border-gray-200'} font-bold`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-tight">Employee Count</label>
                                    <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.employeeCount ? 'border-red-500' : 'border-gray-200'} font-bold`} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2 uppercase tracking-tight">
                                <Upload size={20} className="text-orange-500" /> REQUIRED DOCUMENTS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'PAN', label: 'Business PAN' },
                                    { id: 'ADDRESS_PROOF', label: 'Address Proof' },
                                    { id: 'BUSINESS_PROOF', label: 'Registration Proof' },
                                    { id: 'EMPLOYEE_LIST', label: 'Employee List' }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition bg-white">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition shadow-inner">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1 text-xs uppercase">{doc.label}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png" />
                                            {uploadedFiles[doc.id] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold truncate max-w-[100px]">{uploadedFiles[doc.id].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Upload</span>
                                            }
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 shadow-inner">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2 uppercase tracking-tight">Payment Summary</h2>
                        <p className="text-gray-500 mb-8 font-medium">Professional Fee for {formData.state}</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-400 text-xs font-bold uppercase">Service Fee</span>
                                <span className="text-lg font-black text-[#2B3446]">₹{getFee()}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-end">
                                <span className="font-black text-gray-700 text-sm uppercase">Total</span>
                                <span className="text-3xl font-black text-orange-600">₹{getFee()}</span>
                            </div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-black shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2 uppercase tracking-widest">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className={isModal ? "h-full overflow-y-auto bg-[#FFF8F0] relative pb-10 rounded-3xl" : "min-h-screen bg-[#FFF8F0] pb-20 pt-24 px-4 md:px-8"}>
            {isModal && (
                <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center mt-10">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4 uppercase tracking-tighter">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8 font-medium text-lg">
                        We have received your Professional Tax details for <b>{formData.state}</b>.
                    </p>
                    {isModal ? (
                        <button onClick={onClose} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition uppercase tracking-widest">Close Window</button>
                    ) : (
                        <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition uppercase tracking-widest">Go to Dashboard</button>
                    )}
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    {!isModal && (
                        <div className="mb-8">
                            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                            <h1 className="text-3xl font-black text-[#2B3446] uppercase tracking-tighter">Professional Tax</h1>
                            <p className="text-gray-500 font-medium">PT Registration & Filing Service</p>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Details', 'Required Documents', 'Payment'].map((s, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-black text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{s}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-inner">
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Service Fee</p>
                                <div className="text-2xl font-black text-navy uppercase tracking-tighter">₹{getFee()}</div>
                                <p className="text-[10px] text-orange-400 font-bold mt-1 uppercase italic">Plus Govt Charges if any</p>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {apiError && (
                                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    <span className="font-bold text-sm">{apiError}</span>
                                </div>
                            )}

                            {!isSuccess && currentStep < 3 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-black text-gray-400 hover:bg-white hover:text-navy transition uppercase text-xs disabled:opacity-30">Back</button>

                                    <button onClick={handleNext} className="px-8 py-3 bg-navy text-white rounded-xl font-black shadow-lg hover:bg-black transition flex items-center gap-2 uppercase text-xs tracking-widest">
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

export default ApplyProfessionalTax;
