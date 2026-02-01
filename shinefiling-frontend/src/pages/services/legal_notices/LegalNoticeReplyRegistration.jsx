
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, MapPin, Calendar, Clock, X
} from 'lucide-react';
import { uploadFile } from '../../../utils/uploadFile';
import { submitLegalNoticeReply } from '../../../api';

const LegalNoticeReplyRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/legal-notices/reply-to-legal-notice/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['standard', 'urgent'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        noticeRecievedDate: '',
        senderDetails: '',
        caseReferenceNumber: '',
        factsOfCase: '',
        defensePoints: '',
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        standard: {
            price: 2499,
            title: 'Standard Reply',
            features: ["Lawyer Analysis", "Drafting on Letterhead", "Regd. Post Dispatch", "7-Day Delivery"],
            recommended: true,
            color: 'bg-white border-slate-200'
        },
        urgent: {
            price: 3999,
            title: 'Urgent Reply',
            features: ["Priority Drafting (12 hrs)", "Senior Advocate Review", "Speed Post Dispatch", "Consultation Included"],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    useEffect(() => {
        if (planProp) setSelectedPlan(validatePlan(planProp));
        else {
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
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1 && !formData.noticeRecievedDate) { newErrors.noticeRecievedDate = "Received date required"; isValid = false; }
        if (step === 2 && !formData.factsOfCase) { newErrors.factsOfCase = "Facts are required"; isValid = false; }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(5, prev + 1));
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const uploadedDocs = [];
            for (const file of selectedFiles) {
                const url = await uploadFile(file);
                uploadedDocs.push({ type: "NOTICE_COPY", filename: file.name, fileUrl: url });
            }
            const finalPayload = {
                submissionId: `LNR-${Date.now()}`,
                plan: selectedPlan,
                userEmail: formData.userEmail,
                formData: formData,
                documents: uploadedDocs,
                amountPaid: plans[selectedPlan].price,
                status: "INITIATED"
            };
            const response = await submitLegalNoticeReply(finalPayload);
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Calendar size={20} className="text-navy" /> NOTICE DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Notice Received Date</label>
                                    <input type="date" name="noticeRecievedDate" value={formData.noticeRecievedDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.noticeRecievedDate ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Reference Number (if any)</label>
                                    <input type="text" name="caseReferenceNumber" value={formData.caseReferenceNumber} onChange={handleInputChange} placeholder="Case / Notice Ref No." className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><User size={20} className="text-orange-600" /> SENDER DETAILS</h3>
                            <textarea name="senderDetails" value={formData.senderDetails} onChange={handleInputChange} placeholder="Who sent this notice? (Name & Address of the sender or their lawyer)" className="w-full p-3 rounded-lg border border-gray-200" rows="3"></textarea>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">REPLY CONTENT</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Facts of the Case (Your Version)</label>
                                    <textarea name="factsOfCase" value={formData.factsOfCase} onChange={handleInputChange} placeholder="Explain what actually happened from your side..." className={`w-full p-3 rounded-lg border ${errors.factsOfCase ? 'border-red-500' : 'border-gray-200'}`} rows="4"></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Key Defense Points</label>
                                    <textarea name="defensePoints" value={formData.defensePoints} onChange={handleInputChange} placeholder="Any specific points you want to highlight in defense?" className="w-full p-3 rounded-lg border border-gray-200" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Upload size={20} className="text-bronze" /> RECEIVED NOTICE COPY</h3>
                        <p className="text-sm text-gray-500 mb-6">Please upload a clear copy of the notice you received.</p>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-bronze transition">
                            <input type="file" multiple onChange={handleFileChange} className="hidden" id="notice-upload" />
                            <label htmlFor="notice-upload" className="cursor-pointer">
                                <Upload size={40} className="mx-auto text-gray-300 mb-4" />
                                <p className="font-bold text-gray-600">Click to upload notice copy</p>
                            </label>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="mt-6 space-y-2">
                                {selectedFiles.map((file, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-xs font-medium text-gray-600">{file.name}</span>
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
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Reply Details</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Notice Date</span><span className="font-bold">{formData.noticeRecievedDate}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-bold uppercase">{plans[selectedPlan].title}</span></div>
                            <div className="flex justify-between pt-2 border-t"><span className="text-lg font-bold">Total Amount</span><span className="text-lg font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
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
                    <CheckCircle size={48} className="text-bronze mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-navy mb-4">Reply Process Initiated!</h1>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard?tab=orders')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="text-gray-500 mb-4 font-bold text-xs uppercase"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">Notice Reply Application</h1>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Notice Details', 'Reply Content', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <span className="text-[10px] font-bold text-gray-400 block uppercase">STEP {i + 1}</span>
                                        <span className="font-bold text-sm">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 font-bold text-gray-500">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold">Next Step</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LegalNoticeReplyRegistration;
