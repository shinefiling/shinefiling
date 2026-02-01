import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Users, Plus, Trash2, X, Globe
} from 'lucide-react';
import { uploadFile, submitIndianSubsidiaryRegistration } from '../../../api';

const IndianSubsidiaryRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/indian-subsidiary-registration?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(validatePlan(planProp));
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
                setSelectedPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        companyNames: ['', '', ''],
        businessActivity: '',
        holdingCompanyName: '', // Specific to Subsidiary
        holdingCompanyCountry: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        authorizedCapital: '100000',
        paidUpCapital: '100000',
        directors: [
            { name: '', country: 'India', passportNumber: '', email: '', phone: '' },
            { name: '', country: 'India', passportNumber: '', email: '', phone: '' }
        ]
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans Configuration for Subsidiary
    const plans = {
        basic: {
            price: 19999,
            title: 'Entry Plan',
            features: [
                "2 DSC & 2 DIN", "Name Approval", "Incorporation Certificate", "PAN & TAN", "MOA & AOA Drafting"
            ],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 29999,
            title: 'Business Plan',
            features: [
                "Everything in Entry", "FEMA Compliance Filing", "GST Registration", "Bank Account Support", "Foreign Director DSC"
            ],
            recommended: true,
            color: 'bg-blue-50 border-blue-200'
        },
        premium: {
            price: 49999,
            title: 'Global Plan',
            features: [
                "Everything in Business", "RBI Reporting (FC-GPR)", "Trademark Filing", "1 Year Compliance", "Resident Director Service"
            ],
            color: 'bg-indigo-50 border-indigo-200'
        }
    };

    const handleInputChange = (e, section = null, index = null) => {
        const { name, value } = e.target;
        if (section === 'companyNames') {
            const newNames = [...formData.companyNames];
            newNames[index] = value;
            setFormData({ ...formData, companyNames: newNames });
        } else if (section === 'directors') {
            const newDirectors = [...formData.directors];
            newDirectors[index][name] = value;
            setFormData({ ...formData, directors: newDirectors });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const addDirector = () => {
        if (formData.directors.length < 5) {
            setFormData(prev => ({
                ...prev,
                directors: [...prev.directors, { name: '', country: '', passportNumber: '', email: '', phone: '' }]
            }));
        }
    };

    const removeDirector = (index) => {
        if (formData.directors.length > 2) {
            const newDirectors = formData.directors.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, directors: newDirectors }));
        } else {
            alert("Minimum 2 directors required.");
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.companyNames[0]) { newErrors.companyNames = "Company name required"; isValid = false; }
            if (!formData.holdingCompanyName) { newErrors.holdingCompanyName = "Holding company name required"; isValid = false; }
            if (!formData.holdingCompanyCountry) { newErrors.holdingCompanyCountry = "Country required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(5, prev + 1));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'subsidiary_docs');
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

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const payload = {
                ...formData,
                plan: selectedPlan,
                amount: plans[selectedPlan].price,
                documents: docsList,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.directors[0].email,
                submissionId: `SUB-${Date.now()}`
            };

            const response = await submitIndianSubsidiaryRegistration(payload);

            if (response) {
                setAutomationPayload(response);
                setIsSuccess(true);
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert("Submission failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Company Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-navy" /> SUBSIDIARY DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Proposed Indian Company Name</label>
                                    <input type="text" value={formData.companyNames[0]} onChange={(e) => handleInputChange(e, 'companyNames', 0)} placeholder="e.g. Google India Pvt Ltd" className={`w-full p-3 rounded-lg border ${errors.companyNames ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Foreign Holding Company</label>
                                    <input name="holdingCompanyName" value={formData.holdingCompanyName} onChange={handleInputChange} placeholder="Parent Company Name" className={`w-full p-3 rounded-lg border ${errors.holdingCompanyName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Country of Origin</label>
                                    <input name="holdingCompanyCountry" value={formData.holdingCompanyCountry} onChange={handleInputChange} placeholder="e.g. USA, UK" className={`w-full p-3 rounded-lg border ${errors.holdingCompanyCountry ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Proposed Business Activity in India</label>
                                    <textarea name="businessActivity" value={formData.businessActivity} onChange={handleInputChange} placeholder="Brief description..." className="w-full p-3 rounded-lg border border-gray-200" rows="2"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Registered Office (India)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full p-3 rounded-lg border border-gray-200" />
                            </div>
                        </div>
                    </div>
                );
            case 2: // Directors
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-navy flex items-center gap-2"><Users size={20} className="text-blue-600" /> DIRECTORS (Min 2)</h2>
                            <button onClick={addDirector} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition">+ Add Director</button>
                        </div>
                        {formData.directors.map((director, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h4 className="font-bold text-navy text-sm">Director #{i + 1} {i === 0 && '(Resident Director recommended)'}</h4>
                                    {i > 1 && <button onClick={() => removeDirector(i)} className="text-red-500"><Trash2 size={16} /></button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="name" value={director.name} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Full Name" className="w-full p-3 rounded-lg border border-gray-200" />
                                    <input name="country" value={director.country} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Nationality" className="w-full p-3 rounded-lg border border-gray-200" />
                                    <input name="passportNumber" value={director.passportNumber} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder={director.country === 'India' ? 'PAN Number' : 'Passport Number'} className="w-full p-3 rounded-lg border border-gray-200" />
                                    <input name="email" value={director.email} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Email" className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Required Documents</h3>
                            <div className="space-y-4">
                                <div className="border border-dashed p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium">Holding Company Incorporation Certificate</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'holding_co_inc')} className="text-xs" />
                                </div>
                                <div className="border border-dashed p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium">Board Resolution from Foreign Company</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'board_resolution')} className="text-xs" />
                                </div>
                                {formData.directors.map((d, i) => (
                                    <div key={i} className="border border-dashed p-4 rounded-lg flex justify-between items-center">
                                        <span className="text-sm font-medium">ID Proof for {d.name || `Director ${i + 1}`} ({d.country === 'India' ? 'PAN' : 'Passport'})</span>
                                        <input type="file" onChange={(e) => handleFileUpload(e, `director_${i}_id`)} className="text-xs" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review & Submit</h2>
                        <div className="bg-blue-50/50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between mb-2"><span className="text-gray-600">Plan</span><span className="font-bold text-navy uppercase">{selectedPlan}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Fee</span><span className="font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span></div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Company:</strong> {formData.companyNames[0]}</p>
                            <p><strong>Parent Entity:</strong> {formData.holdingCompanyName} ({formData.holdingCompanyCountry})</p>
                            <p><strong>Directors:</strong> {formData.directors.length}</p>
                        </div>
                    </div>
                );
            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <Globe size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Register'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} className="text-green-600" /></div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">We will initiate the incorporation process for <span className="font-bold text-navy">{formData.companyNames[0]}</span>.</p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">Indian Subsidiary Registration</h1>
                            <p className="text-gray-500">Establish your foreign company's presence in India.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Company Details', 'Directors', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-blue-50 border-blue-100 shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
                                        <div><span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span><span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-blue-700' : 'text-gray-600'}`}>{step}</span></div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
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
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600"><CheckCircle size={14} className="text-slate shrink-0 mt-0.5" /><span className="leading-tight">{feat}</span></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndianSubsidiaryRegistration;
