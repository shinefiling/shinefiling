
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Briefcase, X
} from 'lucide-react';
import { uploadFile } from '../../../utils/uploadFile';
import { submitRocNoticeReply } from '../../../api';

const RocNoticeReplyRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;
        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/legal-notices/roc-notice-reply/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const validatePlan = (plan) => ['standard', 'urgent'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        companyName: '',
        cin: '',
        noticeType: 'Strike Off',
        noticeDate: '',
        referenceNumber: '',
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const plans = {
        basic: { price: 1499, title: 'Basic Reply', features: ["Reply to Routine Query", "Correction of Forms", "Resubmission Support"], color: 'bg-white border-slate-200' },
        standard: { price: 2499, title: 'Adjudication', features: ["SCN Detailed Reply", "STK-1 Reply", "Hearing Assistance"], recommended: true, color: 'bg-[#043E52] text-white border-gray-700' },
        compounding: { price: 9999, title: 'Compounding', features: ["NCLT Application", "Physical Appearance", "Complete Settlement"], color: 'bg-purple-50 border-purple-200' }
    };

    const billDetails = React.useMemo(() => {
        const planPrice = plans[selectedPlan]?.price || 0;
        const platformFee = Math.round(planPrice * 0.03); // 3% Platform Fee
        const tax = Math.round(planPrice * 0.03); // 3% Tax
        const gst = Math.round(planPrice * 0.09); // 9% GST
        const total = planPrice + platformFee + tax + gst;
        return { base: planPrice, platformFn: platformFee, tax, gst, total };
    }, [selectedPlan]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => e.target.files && setSelectedFiles(Array.from(e.target.files));

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const uploadedDocs = [];
            for (const file of selectedFiles) {
                const url = await uploadFile(file);
                uploadedDocs.push({ type: "ROC_NOTICE", filename: file.name, fileUrl: url });
            }
            const finalPayload = {
                submissionId: `ROC-${Date.now()}`,
                plan: selectedPlan,
                userEmail: formData.userEmail,
                formData: formData,
                documents: uploadedDocs,
                amountPaid: plans[selectedPlan].price,
                status: "INITIATED"
            };
            await submitRocNoticeReply(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            alert(error.message);
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
                            <span className="text-[#ED6E3F]">ROC</span>
                            Reply
                        </h1>
                        <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] uppercase text-blue-200 tracking-wider mb-1">Selected Plan</p>
                            <p className="font-bold text-white leading-tight">{plans[selectedPlan]?.title}</p>
                            <p className="text-[#ED6E3F] font-bold mt-1">₹{billDetails.total.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {['Entity Info', 'Notice Details', 'Upload Notice', 'Review', 'Payment'].map((step, i) => (
                            <div key={i} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }} className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${currentStep === i + 1 ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === i + 1 ? 'bg-[#ED6E3F] text-white' : currentStep > i + 1 ? 'bg-green-500 text-white' : 'bg-white/20 text-blue-200'}`}>
                                    {currentStep > i + 1 ? <CheckCircle size={12} /> : i + 1}
                                </div>
                                <span className={`text-xs font-medium ${currentStep === i + 1 ? 'text-white font-bold' : ''}`}>{step}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
                        <div className="flex justify-between items-end">
                            <div><p className="text-[10px] text-blue-200 uppercase">Total Payable</p><p className="text-xl font-bold text-white">₹{billDetails.total.toLocaleString()}</p></div>
                            <IndianRupee className="text-white/20" size={24} />
                        </div>
                    </div>
                </div>
                {/* RIGHT CONTENT */}
                <div className="flex-1 flex flex-col h-full relative bg-[#F8F9FA]">
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
                        <h2 className="font-bold text-navy text-lg">{['Company Info', 'Notice Details', 'Upload', 'Review', 'Pay'][currentStep - 1]}</h2>
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
                            <button onClick={() => setCurrentStep(p => p + 1)} className="px-6 py-2.5 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2 text-sm">Next Step <ArrowRight size={16} /></button>
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2 uppercase tracking-widest text-xs"><Briefcase size={18} /> COMPANY INFO</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Company / LLP Name</label>
                                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">CIN / LLPIN</label>
                                    <input name="cin" value={formData.cin} onChange={handleInputChange} placeholder="21 Digit No." className="w-full p-3 border border-gray-200 rounded-lg" /></div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                        <h3 className="font-bold text-navy mb-4 uppercase tracking-widest text-xs">NOTICE DETAILS</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Type</label>
                                <select name="noticeType" value={formData.noticeType} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white">
                                    <option value="Strike Off">Strike Off Notice (STK-1/5)</option>
                                    <option value="Director Disqualification">Director Disqualification</option>
                                    <option value="Penalty Notice">Penalty / Adjudication</option>
                                    <option value="Non-Compliance">General Non-Compliance</option>
                                </select></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Date</label>
                                <input type="date" name="noticeDate" value={formData.noticeDate} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg" /></div>
                            <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 mb-1 block">Reference ID / SN</label>
                                <input name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-lg" /></div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center animate-in fade-in slide-in-from-right-4">
                        <Upload size={40} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">NOTICE COPY UPLOAD</h3>
                        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-bronze transition cursor-pointer">
                            <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <p className="text-sm text-gray-500">Click or Drag & Drop to upload</p>
                        </div>
                        {selectedFiles.length > 0 && <div className="mt-4 text-left space-y-2">{selectedFiles.map((f, i) => <div key={i} className="text-xs p-2 bg-gray-50 rounded flex justify-between"><span>{f.name}</span><CheckCircle size={14} className="text-green-500" /></div>)}</div>}
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-navy">Review</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                            <div className="flex justify-between"><span>Company</span><span className="font-bold">{formData.companyName}</span></div>
                            <div className="flex justify-between"><span>Type</span><span className="font-bold italic">{formData.noticeType}</span></div>
                            <div className="flex justify-between pt-2 border-t text-lg"><span>Total</span><span className="font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <h2 className="text-2xl font-bold mb-8 text-navy uppercase tracking-widest">Payment</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Base Price</span><span>₹{billDetails.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Platform Fee</span><span>₹{billDetails.platformFn.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>Tax</span><span>₹{billDetails.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2 text-gray-600"><span>GST</span><span>₹{billDetails.gst.toLocaleString()}</span></div>
                            <div className="border-t pt-2 mt-2 flex justify-between items-end"><span className="text-gray-500 font-bold">Total Payable</span><span className="text-3xl font-bold text-navy">₹{billDetails.total.toLocaleString()}</span></div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:shadow-xl transition">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-24 px-4 overflow-hidden">
            {isSuccess ? (
                <div className="max-w-md mx-auto bg-white p-12 shadow-2xl rounded-3xl text-center">
                    <CheckCircle size={60} className="text-bronze mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-8 text-navy uppercase tracking-widest">Application Filed!</h1>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-[#2B3446] text-white px-10 py-4 rounded-xl font-bold hover:bg-black transition">Orders Dashboard</button>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-black text-navy mb-12 uppercase tracking-[0.2em] text-center italic">ROC Notice Reply</h1>
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="w-full md:w-56 space-y-3">
                            {['Entity', 'Notice', 'Upload', 'Review', 'Pay'].map((s, i) => (
                                <div key={i} className={`p-4 rounded-xl border-l-4 transition-all duration-500 ${currentStep === i + 1 ? 'border-bronze bg-white shadow-xl translate-x-2' : 'border-transparent opacity-30 shadow-none'}`}>
                                    <span className="font-bold text-[10px] tracking-widest uppercase text-gray-400 block mb-1">Step 0{i + 1}</span>
                                    <span className="font-bold text-sm text-navy uppercase">{s}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1">{renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-12 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="font-black text-gray-400 hover:text-navy uppercase tracking-widest text-xs transition">Back</button>
                                    <button onClick={() => setCurrentStep(p => p + 1)} className="px-12 py-4 bg-navy text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition shadow-lg">Next Part</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RocNoticeReplyRegistration;
