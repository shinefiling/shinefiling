import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, Upload, Shield, CreditCard, FileText,
    User, MapPin, Briefcase, Plus, Trash2, ArrowLeft, ArrowRight, X, IndianRupee, Users, Building
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitPartnershipRegistration } from '../../../api';

const PartnershipRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
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
            navigate('/login', { state: { from: `/services/partnership-firm-registration/register?plan=${plan}` } });
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
        firmNameOption1: '',
        firmNameOption2: '',
        businessActivity: '',
        capitalContribution: '',
        registeredAddress: '',
        profitSharingRatio: 'Equal',

        // Standard/Premium
        stateOfRegistration: '',
        placeOfBusiness: '',
        dateOfCommencement: '',

        // Premium fields
        expectedTurnover: '',
        gstState: '',
        bankPreference: '',
        accountingStartDate: '',

        partners: [
            { id: 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' },
            { id: 2, name: '', email: '', mobile: '', pan: '', aadhaar: '' }
        ]
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);

    // Plans Configuration
    const plans = {
        basic: {
            price: 2999,
            title: 'Lite Plan',
            features: ["Custom Deed Drafting", "PAN Card Application", "Legal Consulting", "Affidavit Prep"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 5999,
            title: 'Classic Plan',
            features: ["Everything in Lite", "ROF Filing", "Reg. Certificate", "TAN Allotment", "Priority Support"],
            color: 'bg-[#F0F7FF] border-blue-200'
        },
        premium: {
            price: 8999,
            title: 'Complete Plan',
            features: ["Everything in Classic", "GST Registration", "MSME/Udyam Reg.", "Zero Balance Account"],
            color: 'bg-[#FDF4FF] border-purple-200'
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePartnerChange = (index, e) => {
        const newPartners = [...formData.partners];
        newPartners[index][e.target.name] = e.target.value;
        setFormData({ ...formData, partners: newPartners });
    };

    const addPartner = () => {
        setFormData({
            ...formData,
            partners: [...formData.partners, { id: formData.partners.length + 1, name: '', email: '', mobile: '', pan: '', aadhaar: '' }]
        });
    };

    const removePartner = (index) => {
        if (formData.partners.length <= 2) return;
        const newPartners = formData.partners.filter((_, i) => i !== index);
        setFormData({ ...formData, partners: newPartners });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            let category = 'partnership_docs';
            if (key.includes('partner')) category = 'partner_docs';
            if (key.includes('firm')) category = 'firm_docs';

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
                submissionId: `PF-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.partners[0].email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            // PartnershipFirmController expects Raw JSON
            const response = await submitPartnershipRegistration(finalPayload);

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
            case 1: // Firm Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-blue-600" /> FIRM DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="firmNameOption1" placeholder="Proposed Firm Name Option 1" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.firmNameOption1} />
                                <input name="firmNameOption2" placeholder="Proposed Firm Name Option 2" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.firmNameOption2} />
                                <input name="businessActivity" placeholder="Main Business Activity" className="p-3 rounded-lg border border-gray-200 w-full md:col-span-2" onChange={handleInputChange} value={formData.businessActivity} />
                                <input name="capitalContribution" placeholder="Total Capital (e.g. 50000)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.capitalContribution} />
                                <input name="profitSharingRatio" placeholder="Profit Sharing Ratio (e.g. 50:50)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.profitSharingRatio} />
                                <input name="registeredAddress" placeholder="Registered Office Address" className="p-3 rounded-lg border border-gray-200 w-full md:col-span-2" onChange={handleInputChange} value={formData.registeredAddress} />

                                {selectedPlan !== 'basic' && (
                                    <>
                                        <input name="stateOfRegistration" placeholder="State of Registration" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.stateOfRegistration} />
                                        <input name="placeOfBusiness" placeholder="Place of Business (District)" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.placeOfBusiness} />
                                        <div className="md:col-span-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase ml-1">Date of Commencement</span>
                                            <input type="date" name="dateOfCommencement" className="p-3 mt-1 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.dateOfCommencement} />
                                        </div>
                                    </>
                                )}

                                {selectedPlan === 'premium' && (
                                    <>
                                        <input name="expectedTurnover" placeholder="Expected Turnover" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.expectedTurnover} />
                                        <input name="gstState" placeholder="GST State" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.gstState} />
                                        <input name="bankPreference" placeholder="Bank Preference" className="p-3 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.bankPreference} />
                                        <div className="md:col-span-1">
                                            <span className="text-xs font-bold text-gray-500 uppercase ml-1">Accounting Start Date</span>
                                            <input type="date" name="accountingStartDate" className="p-3 mt-1 rounded-lg border border-gray-200 w-full" onChange={handleInputChange} value={formData.accountingStartDate} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2: // Partners
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-navy flex items-center gap-2"><Users size={20} className="text-bronze" /> PARTNER DETAILS</h3>
                            <button onClick={addPartner} className="text-sm font-bold text-white bg-bronze px-3 py-1.5 rounded-lg hover:bg-bronze-dark flex items-center gap-1"><Plus size={14} /> Add</button>
                        </div>
                        {formData.partners.map((partner, index) => (
                            <div key={partner.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <span className="font-bold text-gray-700">Partner #{index + 1}</span>
                                    {index >= 2 && <button onClick={() => removePartner(index)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="name" placeholder="Full Name" value={partner.name} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="email" placeholder="Email" value={partner.email} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="mobile" placeholder="Mobile" value={partner.mobile} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="pan" placeholder="PAN Number" value={partner.pan} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                    <input name="aadhaar" placeholder="Aadhar Number" value={partner.aadhaar} onChange={(e) => handlePartnerChange(index, e)} className="p-3 rounded-lg border border-gray-200 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-slate" /> UPLOAD DOCUMENTS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {formData.partners.map((partner, i) => (
                                    <div key={i} className="space-y-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Partner {i + 1} ({partner.name || 'Name'})</p>
                                        <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-gray-600">PAN Card</span>
                                            <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `partner_${i}_pan`)} />
                                            {files[`partner_${i}_pan`] && <CheckCircle size={14} className="text-green-500" />}
                                        </div>
                                        <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Aadhaar Card</span>
                                            <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `partner_${i}_aadhaar`)} />
                                            {files[`partner_${i}_aadhaar`] && <CheckCircle size={14} className="text-green-500" />}
                                        </div>
                                    </div>
                                ))}
                                <div className="md:col-span-2 pt-4 border-t">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Office Proof</p>
                                    <div className="border border-dashed p-3 rounded-lg flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Firm Address Proof (Bill/NOC)</span>
                                        <input type="file" className="text-xs w-24" onChange={(e) => handleFileUpload(e, `firm_address_proof`)} />
                                        {files[`firm_address_proof`] && <CheckCircle size={14} className="text-green-500" />}
                                    </div>
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
                            <p><span className="font-bold">Firm Name:</span> {formData.firmNameOption1}</p>
                            <p><span className="font-bold">Partners:</span> {formData.partners.length}</p>
                            <p><span className="font-bold">Capital:</span> {formData.capitalContribution}</p>
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
                            <h1 className="text-3xl font-bold text-navy">Partnership Registration</h1>
                            <p className="text-gray-500">Draft your deed and register your firm.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* SIDEBAR */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Firm Details', 'Partners', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    {!isModal && <button onClick={() => navigate('/services/partnership-firm-registration')} className="text-xs font-bold text-gray-500 hover:text-navy underline">Change Plan</button>}
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

export default PartnershipRegistration;
