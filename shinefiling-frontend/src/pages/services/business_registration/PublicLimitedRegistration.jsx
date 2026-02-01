import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, MapPin, Plus, Trash2, ArrowLeft, ArrowRight, X, Building, Users, Briefcase, Landmark
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitPublicLimitedRegistration, uploadFile } from '../../../api';

const PublicLimitedRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Protect Route (Skip if in Modal)
    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/public-limited-registration?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'basic';
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
        companyNameOption1: '',
        companyNameOption2: '',
        businessActivity: 'IT Services',
        registeredAddress: '',
        authorizedCapital: '10 Lakhs',
        numberOfShareholders: '7',
        bankPreference: '',
        directors: [
            { id: 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' },
            { id: 2, name: '', email: '', mobile: '', pan: '', aadhaar: '' },
            { id: 3, name: '', email: '', mobile: '', pan: '', aadhaar: '' }
        ]
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);

    // Plans
    const plans = {
        basic: {
            price: 19999,
            title: 'Public Basic',
            features: ["3 DSC & 3 DIN", "Name Approval", "MOA & AOA", "Incorporation Cert."],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 34999,
            title: 'Public Standard',
            features: ["Everything in Basic", "PAN & TAN", "GST Registration", "Bank Account Support"],
            color: 'bg-blue-50 border-blue-200'
        },
        premium: {
            price: 59999,
            title: 'Public Premium',
            features: ["Everything in Standard", "Trademark Filing", "Compliance (1 Yr)", "Legal Advisory"],
            color: 'bg-indigo-50 border-indigo-200'
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDirectorChange = (index, e) => {
        const newDirectors = [...formData.directors];
        newDirectors[index][e.target.name] = e.target.value;
        setFormData({ ...formData, directors: newDirectors });
    };

    const addDirector = () => {
        if (formData.directors.length < 15) {
            setFormData({
                ...formData,
                directors: [...formData.directors, { id: formData.directors.length + 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' }]
            });
        }
    };

    const removeDirector = (index) => {
        if (formData.directors.length <= 3) {
            alert("Minimum 3 directors required for Public Limited Company.");
            return;
        }
        const newDirectors = formData.directors.filter((_, i) => i !== index);
        setFormData({ ...formData, directors: newDirectors });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            let category = 'public_ltd_docs';
            if (key.includes('director')) category = 'director_docs';

            const response = await uploadFile(file, category);

            setFiles(prev => ({
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
            alert("File upload failed.");
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(files).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `PUB-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.directors[0].email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const formDataObj = new FormData();
            formDataObj.append('data', JSON.stringify(finalPayload));

            const response = await submitPublicLimitedRegistration(formDataObj);

            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit. " + error.message);
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-blue-600" /> COMPANY DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="companyNameOption1" placeholder="Proposed Name 1" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.companyNameOption1} />
                                <input name="companyNameOption2" placeholder="Proposed Name 2" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.companyNameOption2} />

                                <select name="businessActivity" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.businessActivity}>
                                    <option value="IT Services">IT Services</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Trading">Trading</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Consultancy">Consultancy</option>
                                </select>
                                <input name="numberOfShareholders" type="number" placeholder="No. of Shareholders (Min 7)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} defaultValue="7" value={formData.numberOfShareholders} />

                                <input name="authorizedCapital" placeholder="Authorized Capital (e.g. 10 Lakhs)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.authorizedCapital} />
                                <input name="registeredAddress" placeholder="Registered Office Address" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.registeredAddress} />

                                {selectedPlan !== 'basic' && (
                                    <input name="bankPreference" placeholder="Bank Preference" className="p-3 rounded-lg border border-gray-200 w-full md:col-span-2" onChange={handleInputChange} value={formData.bankPreference} />
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2: // Directors
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-navy flex items-center gap-2"><Users size={20} className="text-blue-600" /> DIRECTOR DETAILS</h2>
                            {formData.directors.length < 15 && (
                                <button onClick={addDirector} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition">+ Add Director</button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {formData.directors.map((director, index) => (
                                <div key={index} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative">
                                    <div className="flex justify-between items-center mb-4 bg-blue-50/50 p-2 rounded-lg">
                                        <h3 className="font-bold text-sm text-navy">Director #{index + 1}</h3>
                                        {formData.directors.length > 3 && <button onClick={() => removeDirector(index)} className="text-red-500 hover:bg-red-50 p-1 rounded transition"><Trash2 size={16} /></button>}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input name="name" placeholder="Full Name" value={director.name} onChange={(e) => handleDirectorChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                        <input name="email" placeholder="Email" value={director.email} onChange={(e) => handleDirectorChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                        <input name="mobile" placeholder="Mobile" value={director.mobile} onChange={(e) => handleDirectorChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                        <input name="pan" placeholder="PAN Number" value={director.pan} onChange={(e) => handleDirectorChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-slate" /> UPLOAD DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {formData.directors.map((director, i) => (
                                    <div key={i} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-xs text-gray-500 uppercase">{director.name || `Director ${i + 1}`}</h4>
                                        <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                            <span className="text-xs">PAN Card</span>
                                            <div className="flex items-center gap-2">
                                                <input type="file" className="text-[10px] w-20" onChange={(e) => handleFileUpload(e, `director_${i + 1}_pan`)} />
                                                {files[`director_${i + 1}_pan`] && <CheckCircle size={12} className="text-green-500" />}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                            <span className="text-xs">Aadhaar Card</span>
                                            <div className="flex items-center gap-2">
                                                <input type="file" className="text-[10px] w-20" onChange={(e) => handleFileUpload(e, `director_${i + 1}_aadhaar`)} />
                                                {files[`director_${i + 1}_aadhaar`] && <CheckCircle size={12} className="text-green-500" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-4 border border-dashed rounded-xl flex flex-col justify-center items-center text-center">
                                    <span className="text-sm text-gray-600 mb-2 font-bold">Office Address Proof (Bill/NoC)</span>
                                    <input type="file" className="text-xs" onChange={(e) => handleFileUpload(e, `office_address_proof`)} />
                                    {files['office_address_proof'] && <CheckCircle size={16} className="text-green-500 mt-2" />}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="p-4 bg-blue-50/50 rounded-xl space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Plan</span>
                                <span className="font-bold font-mono uppercase text-blue-600">{plans[selectedPlan].title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-bold">Proposed Name:</span> {formData.companyNameOption1}</p>
                            <p><span className="font-bold">Activity:</span> {formData.businessActivity}</p>
                            <p><span className="font-bold">Directors Count:</span> {formData.directors.length}</p>
                            <p><span className="font-bold">Start Capital:</span> {formData.authorizedCapital}</p>
                        </div>
                    </div>
                );
            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <Building size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (Later)</p>
                        </div>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your Public Limited application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Your Order ID is <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{automationPayload?.submissionId}</span>.
                    </p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">Public Limited Registration</h1>
                            <p className="text-gray-500">Go public and raise capital with confidence.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* SIDEBAR */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Company Details', 'Directors', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-blue-50 border-blue-100 shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-blue-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
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
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                                                <CheckCircle size={14} className="text-slate shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {!isModal && <button onClick={() => navigate('/services/public-limited-registration')} className="text-xs font-bold text-gray-500 hover:text-navy underline">Change Plan</button>}
                                </div>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>

                                    <button onClick={() => setCurrentStep(p => Math.min(5, p + 1))} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">
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

export default PublicLimitedRegistration;
