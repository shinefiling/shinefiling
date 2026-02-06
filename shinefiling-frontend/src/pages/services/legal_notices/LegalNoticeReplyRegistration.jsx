
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
        review: {
            price: 499,
            title: 'Notice Review',
            features: ["Read Received Notice", "Explain Implications", "Suggest Next Steps"],
            color: 'bg-white border-slate-200'
        },
        standard: {
            price: 1999,
            title: 'Standard Reply',
            features: ["Lawyer Drafted Reply", "Regd. Post Dispatch", "Tracking Number"],
            recommended: true,
            color: 'bg-[#043E52] text-white border-gray-700'
        },
        urgent: {
            price: 3499,
            title: 'Urgent Reply',
            features: ["Priority Drafting", "Senior Advocate Review", "Speed Post Dispatch"],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    const billDetails = React.useMemo(() => {
        const planPrice = plans[selectedPlan]?.price || 0;
        const platformFee = Math.round(planPrice * 0.03); // 3% Platform Fee
        const tax = Math.round(planPrice * 0.03); // 3% Tax
        const gst = Math.round(planPrice * 0.09); // 9% GST
        const total = planPrice + platformFee + tax + gst;
        return { base: planPrice, platformFn: platformFee, tax, gst, total };
    }, [selectedPlan]);

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

    if (isModal) {
        return (
            <div className="flex flex-row h-[85vh] overflow-hidden bg-white">
                {/* LEFT SIDEBAR: DARK */}
                <div className="w-72 bg-[#043E52] text-white flex flex-col p-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 mb-8">
                        <h1 className="font-bold text-lg flex items-center gap-2 tracking-tight">
                            <span className="text-[#ED6E3F]">Notice</span>
                            Reply
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Selected Plan</p>
                            <p className="font-bold text-white leading-tight">{plans[selectedPlan]?.title}</p>
                            <p className="text-[#ED6E3F] font-bold mt-1">₹{billDetails.total.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Notice Details', 'Reply Content', 'Documents', 'Review', 'Payment'].map((step, i) => (
                            <div key={i}
                                onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                    {currentStep > i + 1 ? <CheckCircle size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${currentStep === i + 1 ? 'text-white font-bold' : ''}`}>{step}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-blue-200 uppercase">Total Payable</p>
                                <p className="text-xl font-bold text-white">₹{billDetails.total.toLocaleString()}</p>
                            </div>
                            <IndianRupee className="text-white/20" size={24} />
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">{['Notice Details', 'Reply Content', 'Documents', 'Review', 'Payment'][currentStep - 1]}</h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition"><X size={18} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {isSuccess ? (
                            <div className="text-center py-10">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                                <p className="text-gray-500 mt-2">Request received for <span className="font-bold text-navy">{plans[selectedPlan].title}</span>.</p>
                                <button onClick={onClose} className="mt-6 px-6 py-2 bg-navy text-white rounded-lg">Close</button>
                            </div>
                        ) : (
                            renderStepContent()
                        )}
                    </div>

                    {!isSuccess && currentStep < 5 && (
                        <div className="bg-white p-4 border-t flex justify-between items-center shrink-0 z-20">
                            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30">Back</button>
                            <button onClick={handleNext} className="px-6 py-2.5 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm">Next Step <ArrowRight size={16} /></button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

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
                            <div className="flex justify-between pt-2 border-t"><span className="text-lg font-bold">Total Amount</span><span className="text-lg font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Base Price</span><span>₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Platform Fee</span><span>₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Tax</span><span>₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>GST</span><span>₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="border-t pt-2 mt-2 flex justify-between items-end"><span className="text-gray-500 font-bold">Total Payable</span><span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
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
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> Back</button>
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
