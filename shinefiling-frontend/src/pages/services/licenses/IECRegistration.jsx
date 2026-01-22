import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Building, Globe, Zap, Landmark, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitIEC } from '../../../api';

const IECRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/import-export-code/register` } });
        }
    }, [isLoggedIn, navigate]);

    const [formData, setFormData] = useState({
        firmName: '',
        firmPan: '',
        entityType: 'PROPRIETORSHIP',
        natureOfConcern: '',
        address: '',
        mobile: '',
        bankAccountNo: '',
        bankIfsc: '',
        bankName: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const price = 1999;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'firmPan') {
            setFormData({ ...formData, [name]: value.toUpperCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Business Details
            if (!formData.firmName) { newErrors.firmName = "Firm Name required"; isValid = false; }
            if (!formData.firmPan || formData.firmPan.length !== 10) { newErrors.firmPan = "Valid PAN required"; isValid = false; }
            if (!formData.mobile) { newErrors.mobile = "Mobile required"; isValid = false; }
            if (!formData.natureOfConcern) { newErrors.natureOfConcern = "Nature required"; isValid = false; }
        }
        else if (step === 2) { // Address & Bank
            if (!formData.address) { newErrors.address = "Address required"; isValid = false; }
            if (!formData.bankAccountNo) { newErrors.bankAccountNo = "Account No required"; isValid = false; }
            if (!formData.bankIfsc) { newErrors.bankIfsc = "IFSC required"; isValid = false; }
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
            const response = await uploadFile(file, 'iec_docs');
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
                                <Globe size={20} className="text-purple-600" /> BUSINESS DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Firm Name</label>
                                    <input type="text" name="firmName" value={formData.firmName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.firmName ? 'border-red-500' : 'border-gray-200'}`} placeholder="As per PAN" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Firm PAN</label>
                                    <input type="text" name="firmPan" value={formData.firmPan} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.firmPan ? 'border-red-500' : 'border-gray-200'}`} placeholder="ABCDE1234F" maxLength={10} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Entity Type</label>
                                    <select name="entityType" value={formData.entityType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="PROPRIETORSHIP">Proprietorship</option>
                                        <option value="PARTNERSHIP">Partnership</option>
                                        <option value="LLP">LLP</option>
                                        <option value="PRIVATE_LTD">Private Limited</option>
                                        <option value="PUBLIC_LTD">Public Limited</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Mobile No</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Nature of Concern</label>
                                <select name="natureOfConcern" value={formData.natureOfConcern} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.natureOfConcern ? 'border-red-500' : 'border-gray-200'}`}>
                                    <option value="">Select Activity</option>
                                    <option value="MERCHANT_EXPORTER">Merchant Exporter</option>
                                    <option value="MANUFACTURER_EXPORTER">Manufacturer Exporter</option>
                                    <option value="SERVICE_PROVIDER">Service Provider</option>
                                    <option value="MERCHANT_CUM_MANUFACTURER">Merchant cum Manufacturer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Address & Bank
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Landmark size={20} className="text-purple-600" /> ADDRESS & BANK
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Registered Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'}`} rows="3" placeholder="Full address with Pincode..."></textarea>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Bank Account No</label>
                                    <input type="text" name="bankAccountNo" value={formData.bankAccountNo} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.bankAccountNo ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">IFSC Code</label>
                                    <input type="text" name="bankIfsc" value={formData.bankIfsc} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.bankIfsc ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Uploads
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-purple-600" /> DOCUMENTS</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-purple-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 group-hover:scale-110 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Cancelled Cheque</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'cancelled_cheque')} accept=".pdf,.jpg" />
                                        {uploadedFiles['cancelled_cheque'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['cancelled_cheque'].name}</span> :
                                            <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                        }
                                    </label>
                                </div>

                                <div className="border border-dashed p-6 rounded-xl text-center group hover:border-purple-300 transition">
                                    <label className="cursor-pointer block">
                                        <div className="mb-2 mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-purple-500 transition">
                                            <FileText size={24} />
                                        </div>
                                        <span className="font-bold text-gray-700 block mb-1">Address Proof</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'address_proof')} accept=".pdf,.jpg" />
                                        {uploadedFiles['address_proof'] ?
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles['address_proof'].name}</span> :
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
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Professional Fee for IEC Registration</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs text-gray-400">
                                <span>Govt Fee</span>
                                <span>~ ₹500</span>
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
                submissionId: `IEC-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: "standard",
                amountPaid: price,
                firmName: formData.firmName,
                firmPan: formData.firmPan,
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            const response = await submitIEC(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8FA] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your IEC application for <b>{formData.firmName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">IEC Registration</h1>
                        <p className="text-gray-500">Import Export Code Application</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Details', 'Address & Bank', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-purple-50 border-purple-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-purple-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-xs text-purple-800">
                                <strong>Selected Plan:</strong> <br />
                                <span className="text-lg font-bold">Standard Registration</span>
                                <div className="mt-2 text-xl font-black text-purple-900">₹{price.toLocaleString()}</div>
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

export default IECRegistration;
