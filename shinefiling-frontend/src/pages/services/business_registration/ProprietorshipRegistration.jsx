import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, MapPin, Plus, Trash2, ArrowLeft, ArrowRight, X, IndianRupee, Briefcase, Building
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitProprietorshipRegistration } from '../../../api';

const ProprietorshipRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
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
            navigate('/login', { state: { from: `/services/sole-proprietorship/register?plan=${plan}` } });
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
        businessNameOption1: '',
        businessNameOption2: '',
        businessType: 'Trading', // Trading, Service, Online, Shop
        businessAddress: '',

        proprietorName: '',
        email: '',
        mobile: '',
        panNumber: '',
        aadhaarNumber: '',

        // Standard/Premium
        gstState: '',
        shopActState: '',

        // Premium fields
        professionalTaxState: '',
        bankPreference: ''
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);

    // Plans Configuration
    const plans = {
        basic: {
            price: 1999,
            title: 'Starter Plan',
            features: ["MSME Registration", "Current Account Support", "Business Pan Support", "Basic Advisory"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 4999,
            title: 'Pro Plan',
            features: ["Everything in Starter", "GST Registration", "Shop & Establishment", "Accounting (3 Months)"],
            color: 'bg-sky-50 border-sky-200'
        },
        premium: {
            price: 7999,
            title: 'Advanced Plan',
            features: ["Everything in Pro", "Professional Tax Reg.", "Trademark Filing (1 Class)", "Priority Processing"],
            color: 'bg-indigo-50 border-indigo-200'
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'proprietorship_docs');

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
                submissionId: `SOLE-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            // SoleProprietorshipController expects Raw JSON body
            const response = await submitProprietorshipRegistration(finalPayload);

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
            case 1: // Business Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-blue-600" /> BUSINESS DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="businessNameOption1" placeholder="Proposed Business Name Option 1" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.businessNameOption1} />
                                <input name="businessNameOption2" placeholder="Proposed Business Name Option 2" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.businessNameOption2} />

                                <select name="businessType" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.businessType}>
                                    <option value="Trading">Trading</option>
                                    <option value="Service">Service</option>
                                    <option value="Online">Online Business</option>
                                    <option value="Shop">Retail Shop</option>
                                </select>
                                <input name="businessAddress" placeholder="Registered Office Address" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.businessAddress} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><User size={20} className="text-navy" /> PROPRIETOR INFO</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="proprietorName" placeholder="Full Name" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.proprietorName} />
                                <input name="email" placeholder="Email" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.email} />
                                <input name="mobile" placeholder="Mobile" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.mobile} />
                                <input name="panNumber" placeholder="PAN Number" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.panNumber} />
                                <input name="aadhaarNumber" placeholder="Aadhaar Number" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.aadhaarNumber} />
                            </div>
                        </div>
                    </div>
                );
            case 2: // Additional Details (Plan based)
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {selectedPlan === 'basic' ? (
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                                <h3 className="text-xl font-bold text-gray-400">No Additional Details Required</h3>
                                <p className="text-gray-500">For the Starter Plan, we have all we need. Proceed to Documents.</p>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Briefcase size={20} className="text-bronze" /> REGISTRATION DETAILS</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="gstState" placeholder="GST State" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.gstState} />
                                    <input name="shopActState" placeholder="Shop Act State" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.shopActState} />

                                    {selectedPlan === 'premium' && (
                                        <>
                                            <input name="professionalTaxState" placeholder="Professional Tax State" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.professionalTaxState} />
                                            <input name="bankPreference" placeholder="Bank Preference" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.bankPreference} />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-slate" /> UPLOAD DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-3 border border-dashed rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Proprietor Photo</span>
                                    <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, 'photo')} />
                                    {files['photo'] && <CheckCircle size={14} className="text-green-500" />}
                                </div>
                                <div className="p-3 border border-dashed rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-gray-600">PAN Card</span>
                                    <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, 'pan_card')} />
                                    {files['pan_card'] && <CheckCircle size={14} className="text-green-500" />}
                                </div>
                                <div className="p-3 border border-dashed rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Aadhaar Card</span>
                                    <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, 'aadhaar')} />
                                    {files['aadhaar'] && <CheckCircle size={14} className="text-green-500" />}
                                </div>
                                <div className="p-3 border border-dashed rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Address Proof (Bill/Rent)</span>
                                    <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, 'address_proof')} />
                                    {files['address_proof'] && <CheckCircle size={14} className="text-green-500" />}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Plan</span>
                                <span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-bold">Business Name:</span> {formData.businessNameOption1}</p>
                            <p><span className="font-bold">Type:</span> {formData.businessType}</p>
                            <p><span className="font-bold">Proprietor:</span> {formData.proprietorName}</p>
                            <p><span className="font-bold">Business Address:</span> {formData.businessAddress}</p>
                        </div>
                    </div>
                );
            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (Later)</p>
                        </div>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
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
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Your Order ID is <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{automationPayload?.submissionId}</span>.
                    </p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">Sole Proprietorship Registration</h1>
                            <p className="text-gray-500">Fastest way to start your business.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* SIDEBAR */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Business Details', 'Additional Info', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-bronze-dark' : 'text-gray-600'}`}>{step}</span>
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
                                    {!isModal && <button onClick={() => navigate('/services/sole-proprietorship')} className="text-xs font-bold text-gray-500 hover:text-navy underline">Change Plan</button>}
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

export default ProprietorshipRegistration;
