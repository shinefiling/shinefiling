import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, IndianRupee, X
} from 'lucide-react';
import { uploadFile, submitSoleProprietorshipRegistration } from '../../../api';
import Loader from '../../../components/Loader';

const ProprietorshipRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/sole-proprietorship/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        tradeName: '',
        natureOfBusiness: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        ownershipStatus: 'rented',

        // Proprietor
        proprietor: {
            name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', address: ''
        }
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const plans = {
        basic: {
            price: 1999,
            title: 'Basic Plan',
            features: [
                "Name Guidance", "PAN Verification", "Compliance Check", "Bank Guidance"
            ],
            color: 'bg-white border-gray-200'
        },
        standard: {
            price: 4999,
            title: 'Standard Plan',
            features: [
                "Everything in Basic", "GST Registration", "Shop Act License", "MSME Registration", "Bank Support"
            ],
            recommended: true,
            color: 'bg-orange-50 border-orange-200'
        },
        premium: {
            price: 7999,
            title: 'Premium Plan',
            features: [
                "Everything in Standard", "Professional Tax", "Current A/c Support", "Invoice Templates", "1-Year Compliance"
            ],
            color: 'bg-beige/10 border-beige'
        }
    };

    const handleInputChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (section === 'proprietor') {
            setFormData({ ...formData, proprietor: { ...formData.proprietor, [name]: val } });
        } else {
            setFormData({ ...formData, [name]: val });
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.tradeName) { newErrors.tradeName = "Trade name is required"; isValid = false; }
            if (!formData.natureOfBusiness) { newErrors.natureOfBusiness = "Nature of business is required"; isValid = false; }
            if (!formData.addressLine1) { newErrors.addressLine1 = "Address is required"; isValid = false; }
            if (!formData.pincode) { newErrors.pincode = "Pincode is required"; isValid = false; }
        }

        if (step === 2) {
            const p = formData.proprietor;
            if (!p.name) { newErrors.owner_name = "Name required"; isValid = false; }
            if (!p.pan) { newErrors.owner_pan = "PAN required"; isValid = false; }
            if (!p.aadhaar) { newErrors.owner_aadhaar = "Aadhaar required"; isValid = false; }
            if (!p.email) { newErrors.owner_email = "Email required"; isValid = false; }
            if (!p.phone) { newErrors.owner_phone = "Phone required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        }
    };

    const handleFileUpload = async (e, key, isProprietorDoc = false) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            let category = isProprietorDoc ? 'proprietor_docs' : 'client_docs';

            const response = await uploadFile(file, category);

            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    preview: file.type.includes('image') ? URL.createObjectURL(file) : null,
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
            case 1: // Firm Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">


                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-orange-600" /> BUSINESS DETAILS</h3>
                            <div className="grid gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Business / Trade Name</label>
                                    <input type="text" name="tradeName" value={formData.tradeName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.tradeName ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Shyam Traders" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-purple-600" /> NATURE OF BUSINESS</h3>
                            <textarea name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleInputChange}
                                placeholder="Describe services or products..." className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${errors.natureOfBusiness ? 'border-red-500' : 'border-gray-200'}`} rows="3"></textarea>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-navy" /> BUSINESS ADDRESS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" className={`w-full p-3 rounded-lg border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className={`w-full p-3 rounded-lg border ${errors.pincode ? 'border-red-500' : 'border-gray-200'}`} />
                                <select name="ownershipStatus" value={formData.ownershipStatus} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                    <option value="rented">Rented</option>
                                    <option value="owned">Owned</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Proprietor Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <User size={16} className="text-orange-500" /> Proprietor Details
                            </h4>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input type="text" name="name" value={formData.proprietor.name} onChange={(e) => handleInputChange(e, 'proprietor')} placeholder="Full Name" className={`w-full p-3 border rounded-lg ${errors.owner_name ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="fatherName" value={formData.proprietor.fatherName} onChange={(e) => handleInputChange(e, 'proprietor')} placeholder="Father's Name" className="p-3 border rounded-lg" />
                                <input type="date" name="dob" value={formData.proprietor.dob} onChange={(e) => handleInputChange(e, 'proprietor')} className="p-3 border rounded-lg" />
                                <input type="text" name="pan" value={formData.proprietor.pan} onChange={(e) => handleInputChange(e, 'proprietor')} placeholder="PAN Number" className={`w-full p-3 border rounded-lg ${errors.owner_pan ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="aadhaar" value={formData.proprietor.aadhaar} onChange={(e) => handleInputChange(e, 'proprietor')} placeholder="Aadhaar Number" className={`w-full p-3 border rounded-lg ${errors.owner_aadhaar ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="email" name="email" value={formData.proprietor.email} onChange={(e) => handleInputChange(e, 'proprietor')} placeholder="Email" className={`w-full p-3 border rounded-lg ${errors.owner_email ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="tel" name="phone" value={formData.proprietor.phone} onChange={(e) => handleInputChange(e, 'proprietor')} placeholder="Mobile" className={`w-full p-3 border rounded-lg ${errors.owner_phone ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="address" value={formData.proprietor.address} onChange={(e) => handleInputChange(e, 'proprietor')} placeholder="Residential Address" className="p-3 border rounded-lg md:col-span-2" />
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        {/* Office Docs */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Business Place Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['Electricity/Gas Bill', 'NOC from Owner', formData.ownershipStatus === 'rented' ? 'Rent Agreement' : 'Sale Deed'].map((label, idx) => {
                                    if (!label) return null;
                                    const key = `office_doc_${idx}`;
                                    return (
                                        <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-orange-300 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Upload size={16} className="text-gray-400 group-hover:text-orange-500" />
                                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={16} className="text-bronze" />}
                                                <input type="file" onChange={(e) => handleFileUpload(e, key)} className="text-xs w-24" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Proprietor Docs */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Proprietor Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['PAN Card', 'Aadhaar Card', 'Passport Photo', 'Residential Address Proof'].map((doc, dIdx) => {
                                    const key = `proprietor_doc_${doc.replace(/[\s/]/g, '').toLowerCase()}`;
                                    return (
                                        <div key={dIdx} className="bg-gray-50 p-3 rounded border flex justify-between items-center">
                                            <span className="text-xs font-medium">{doc}</span>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={14} className="text-bronze" />}
                                                <input type="file" className="w-24 text-[10px]" onChange={(e) => handleFileUpload(e, key, true)} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-orange-600">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan Amount</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Trade Name</span>
                                    <span className="font-bold">{formData.tradeName}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Proprietor</span>
                                    <span className="font-bold">{formData.proprietor.name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Business Activity</span>
                                    <span className="font-bold">{formData.natureOfBusiness}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 bg-beige/10 text-blue-800 rounded-lg text-xs mt-4">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>I hereby declare that I am the sole owner of this business and all information provided is true to my knowledge.</span>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Complete payment to initiate processing.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (Later)</p>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit Application'}
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
                submissionId: `SP-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.proprietor.email,
                formData: {
                    ...formData,
                    proprietor: {
                        ...formData.proprietor,
                        photoUrl: uploadedFiles['proprietor_doc_passportphoto']?.fileUrl,
                        panUrl: uploadedFiles['proprietor_doc_pancard']?.fileUrl,
                        aadhaarUrl: uploadedFiles['proprietor_doc_aadhaarcard']?.fileUrl,
                        addressProofUrl: uploadedFiles['proprietor_doc_residentialaddressproof']?.fileUrl
                    },
                    officeUtilityBillUrl: uploadedFiles['office_doc_0']?.fileUrl,
                    officeNocUrl: uploadedFiles['office_doc_1']?.fileUrl,
                    officeDeedUrl: uploadedFiles['office_doc_2']?.fileUrl
                },
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitSoleProprietorshipRegistration(finalPayload);
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
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {isSubmitting && <Loader fullScreen={true} text="Submitting Application..." />}
            {isModal && (
                <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Order ID: <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{automationPayload?.submissionId}</span>
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navylack transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">Sole Proprietorship Registration</h1>
                        <p className="text-gray-500">Complete the process to register your business.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Details', 'Proprietor Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                    </div>
                                ))}
                            </div>

                            <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} relative overflow-hidden transition-all sticky top-24`}>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</div>
                                    <div className="text-3xl font-bold text-gray-800 mb-2">{plans[selectedPlan].title}</div>
                                    <div className="text-3xl font-bold text-navy mb-4">₹{plans[selectedPlan].price.toLocaleString()}</div>
                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan].features.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                                                <CheckCircle size={14} className="text-slate shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => navigate('/services/sole-proprietorship')} className="text-xs font-bold text-gray-500 hover:text-navylack underline">Change Plan</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 5 && (
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

export default ProprietorshipRegistration;

