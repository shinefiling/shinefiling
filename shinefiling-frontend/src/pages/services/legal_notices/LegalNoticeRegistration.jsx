
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, MapPin, Plus, Trash2, X
} from 'lucide-react';
import { uploadFile } from '../../../utils/uploadFile';
import { submitLegalNotice } from '../../../api';

const LegalNoticeRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/legal-notices/legal-notice-drafting/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['basic', 'standard', 'urgent'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        noticeType: 'General',
        senderName: '',
        senderAddress: '',
        receiverName: '',
        receiverAddress: '',
        matterDescription: '',
        claimAmount: '',
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        basic: {
            price: 999,
            title: 'Draft Only',
            features: ["Professional Drafting", "Word / PDF Format", "Delivered via Email"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 1499,
            title: 'Standard Notice',
            features: ["Lawyer Letterhead", "Regd. Post Dispatch", "Tracking Number", "5-Day Delivery"],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        },
        urgent: {
            price: 2499,
            title: 'Urgent Notice',
            features: ["Priority Drafting (2 hrs)", "Speed Post Dispatch", "WhatsApp Copy", "Consultation Included"],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(validatePlan(planProp));
        } else {
            const planParam = searchParams.get('plan');
            if (planParam) setSelectedPlan(validatePlan(planParam));
        }
    }, [searchParams, planProp]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.senderName) { newErrors.senderName = "Sender Name is required"; isValid = false; }
            if (!formData.receiverName) { newErrors.receiverName = "Receiver Name is required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.matterDescription) { newErrors.matterDescription = "Matter description is required"; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const uploadedDocs = [];
            for (const file of selectedFiles) {
                const url = await uploadFile(file);
                uploadedDocs.push({
                    type: "SUPPORTING_DOC",
                    filename: file.name,
                    fileUrl: url
                });
            }

            const finalPayload = {
                submissionId: `LN-${Date.now()}`,
                plan: selectedPlan,
                userEmail: formData.userEmail,
                formData: formData,
                documents: uploadedDocs,
                amountPaid: plans[selectedPlan].price,
                status: "INITIATED"
            };

            const response = await submitLegalNotice(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Submission error: " + error.message);
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><User size={20} className="text-navy" /> PARTIES INVOLVED</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Sender Name (Client)</label>
                                    <input type="text" name="senderName" value={formData.senderName} onChange={handleInputChange} placeholder="Your Full Name" className={`w-full p-3 rounded-lg border focus:ring-2 ${errors.senderName ? 'border-red-500' : 'border-gray-200'}`} />
                                    {errors.senderName && <p className="text-red-500 text-[10px] mt-1">{errors.senderName}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Receiver Name (Opposite Party)</label>
                                    <input type="text" name="receiverName" value={formData.receiverName} onChange={handleInputChange} placeholder="Opposite Party Name" className={`w-full p-3 rounded-lg border focus:ring-2 ${errors.receiverName ? 'border-red-500' : 'border-gray-200'}`} />
                                    {errors.receiverName && <p className="text-red-500 text-[10px] mt-1">{errors.receiverName}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><MapPin size={20} className="text-orange-600" /> ADDRESS DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <textarea name="senderAddress" value={formData.senderAddress} onChange={handleInputChange} placeholder="Sender's Complete Address" className="w-full p-3 rounded-lg border border-gray-200" rows="2"></textarea>
                                <textarea name="receiverAddress" value={formData.receiverAddress} onChange={handleInputChange} placeholder="Receiver's Complete Address" className="w-full p-3 rounded-lg border border-gray-200" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">NOTICE CONTENT</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Type of Dispute</label>
                                    <select name="noticeType" value={formData.noticeType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="General">General Dispute</option>
                                        <option value="Debt Recovery">Debt Recovery</option>
                                        <option value="Property">Property Dispute</option>
                                        <option value="Breach of Contract">Breach of Contract</option>
                                        <option value="Consumer Complaint">Consumer Complaint</option>
                                        <option value="Employment">Employment / Salary Due</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Matter Description / Facts of Case</label>
                                    <textarea name="matterDescription" value={formData.matterDescription} onChange={handleInputChange} placeholder="Describe the incident, dates, and names in detail..." className={`w-full p-3 rounded-lg border focus:ring-2 ${errors.matterDescription ? 'border-red-500' : 'border-gray-200'}`} rows="4"></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Claim Amount (if any)</label>
                                    <input type="text" name="claimAmount" value={formData.claimAmount} onChange={handleInputChange} placeholder="e.g. ₹50,000" className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Upload size={20} className="text-bronze" /> SUPPORTING PROOFS</h3>
                        <p className="text-sm text-gray-500 mb-6">Upload Invoices, Agreements, Emails, or photos related to the case.</p>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-bronze transition">
                            <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload size={40} className="mx-auto text-gray-300 mb-4" />
                                <p className="font-bold text-gray-600">Click to upload files</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5 files)</p>
                            </label>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="mt-6 space-y-2">
                                {selectedFiles.map((file, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-xs font-medium text-gray-600 flex items-center gap-2"><FileText size={14} /> {file.name}</span>
                                        <CheckCircle size={14} className="text-green-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Notice Details</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between"><span className="text-gray-500">Sender</span><span className="font-bold text-navy">{formData.senderName}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Receiver</span><span className="font-bold text-navy">{formData.receiverName}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Dispute Type</span><span className="font-bold">{formData.noticeType}</span></div>
                                <div className="flex justify-between pt-2 border-t"><span className="text-gray-500">Selected Plan</span><span className="font-bold uppercase text-navy">{plans[selectedPlan].title}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Plan Amount</span><span className="font-bold text-navy text-lg">₹{plans[selectedPlan].price.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Final step to initiate your legal notice drafting.</p>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2"><span className="text-gray-500">Total Payable</span><span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span></div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay Now & Submit Application'}
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
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} className="text-slate" /></div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">We have received your request for <span className="font-bold text-navy">{plans[selectedPlan].title}</span>.</p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard?tab=orders')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">Legal Notice Drafting Application</h1>
                        <p className="text-gray-500">Provide case details for your legal notice.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Parties Info', 'Notice Content', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className="font-bold text-sm">{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                    </div>
                                ))}
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

export default LegalNoticeRegistration;
