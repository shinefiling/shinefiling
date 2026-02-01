import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Lightbulb, AlertTriangle, Users
} from 'lucide-react';
import { uploadFile, submitESIRegistration } from '../../../api';

const ApplyESIRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('standard');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour/esi-registration/apply` } });
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) setPlanType(plan);
    }, [searchParams]);

    const [formData, setFormData] = useState({
        establishmentName: '',
        establishmentType: 'Company',
        employerName: '',
        contactNumber: '',
        email: '',
        address: '',
        employeeCount: '',
        businessNature: 'SERVICE', // Added based on DTO
        commencementDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans
    const plans = {
        standard: { title: "ESI Registration", serviceFee: 2499 },
    };

    const getTotalPrice = () => {
        return (plans[planType]?.serviceFee || 2499);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Details
            if (!formData.establishmentName) { newErrors.establishmentName = "Establishment Name required"; isValid = false; }
            if (!formData.employeeCount) { newErrors.employeeCount = "Employee count required"; isValid = false; }
            if (!formData.employerName) { newErrors.employerName = "Employer Name required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(3, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'esi-registration');
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
            case 1: // Business Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Users size={20} className="text-blue-500" /> ESTABLISHMENT DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Establishment Name</label>
                                <input type="text" name="establishmentName" value={formData.establishmentName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.establishmentName ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. ABC Technologies Pvt Ltd" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Entity Type</label>
                                    <select name="establishmentType" value={formData.establishmentType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Company">Private Limited</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Trust">Trust / NGO</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Nature of Business</label>
                                    <select name="businessNature" value={formData.businessNature} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="SERVICE">Service</option>
                                        <option value="MANUFACTURING">Manufacturing</option>
                                        <option value="SHOP">Shop / Retail</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Employer / Director Name</label>
                                    <input type="text" name="employerName" value={formData.employerName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.employerName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Total Employees</label>
                                    <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.employeeCount ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. 15" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Commencement Date</label>
                                    <input type="date" name="commencementDate" value={formData.commencementDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Contact Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Registered Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200 h-24 resize-none" placeholder="Full address with Pincode"></textarea>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-blue-500" /> REQUIRED DOCUMENTS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'businessProof', label: 'Business Proof (COI / Partnership Deed)' },
                                    { id: 'panCard', label: 'Establishment PAN' },
                                    { id: 'addressProof', label: 'Address Proof (Rent Agreement)' },
                                    { id: 'employeeList', label: 'Employee List (Excel)' }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-6 rounded-xl text-center group hover:border-blue-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">{doc.label}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png,.xlsx" />
                                            {uploadedFiles[doc.id] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles[doc.id].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Professional Fee for ESI Registration</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-lg font-bold text-[#2B3446]">₹2,499</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-end">
                                <span className="font-black text-gray-700">Total</span>
                                <span className="text-3xl font-black text-blue-600">₹2,499</span>
                            </div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Register'}
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
                fileUrl: v.fileUrl,
                type: k
            }));

            const finalPayload = {
                submissionId: `ESI-REG-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                businessName: formData.establishmentName,
                plan: planType,
                amountPaid: getTotalPrice(),
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    businessNature: formData.businessNature,
                    employeeCount: formData.employeeCount,
                    commencementDate: formData.commencementDate,
                    state: "TN", // Defaulting for now, could add field
                    ...formData // spread rest
                },
                documents: docsList
            };

            await submitESIRegistration(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4FF] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Registration Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        We have received your details for <b>{formData.establishmentName}</b>. Our team will file the application with ESIC.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">ESI Registration</h1>
                        <p className="text-gray-500">Employer Registration with ESIC</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Establishment Details', 'Required Documents', 'Payment'].map((step, i) => (
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
                                <strong>Service Fee:</strong> <br />
                                <span className="text-lg font-bold">Standard Plan</span>
                                <div className="mt-2 text-xl font-black text-blue-900">₹2,499</div>
                                <div className="text-[10px] text-blue-600 mt-1 opacity-75">Professional Fees</div>
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

                            {!isSuccess && currentStep < 3 && (
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

export default ApplyESIRegistration;
