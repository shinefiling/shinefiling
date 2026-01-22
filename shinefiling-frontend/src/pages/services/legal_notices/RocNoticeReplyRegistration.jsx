
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
        standard: { price: 3999, title: 'Standard Service', features: ["Portal Analysis", "Reply Drafting", "GNL-2 Filing Support"], color: 'bg-white border-slate-200' },
        urgent: { price: 5999, title: 'Urgent Filing', features: ["Same Day Analysis", "Expert Consultation", "Priority Filing"], color: 'bg-indigo-50 border-indigo-200' }
    };

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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2 uppercase tracking-widest text-xs"><Briefcase size={18} /> COMPANY INFO</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Company / LLP Name</label>
                                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">CIN / LLPIN</label>
                                    <input name="cin" value={formData.cin} onChange={handleInputChange} placeholder="21 Digit No." className="w-full p-3 border rounded-lg" /></div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4 uppercase tracking-widest text-xs">NOTICE DETAILS</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Type</label>
                                <select name="noticeType" value={formData.noticeType} onChange={handleInputChange} className="w-full p-3 border rounded-lg text-sm">
                                    <option value="Strike Off">Strike Off Notice (STK-1/5)</option>
                                    <option value="Director Disqualification">Director Disqualification</option>
                                    <option value="Penalty Notice">Penalty / Adjudication</option>
                                    <option value="Non-Compliance">General Non-Compliance</option>
                                </select></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Date</label>
                                <input type="date" name="noticeDate" value={formData.noticeDate} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                            <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 mb-1 block">Reference ID / SN</label>
                                <input name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                        <Upload size={40} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">NOTICE COPY UPLOAD</h3>
                        <input type="file" multiple onChange={handleFileChange} className="w-full border-2 border-dashed p-10 rounded-xl" />
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border">
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-widest">Review</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                            <div className="flex justify-between"><span>Company</span><span className="font-bold">{formData.companyName}</span></div>
                            <div className="flex justify-between"><span>Type</span><span className="font-bold italic">{formData.noticeType}</span></div>
                            <div className="flex justify-between pt-2 border-t text-lg"><span>Payable</span><span className="font-bold text-navy">₹{plans[selectedPlan].price}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border text-center">
                        <h2 className="text-2xl font-bold mb-8 text-navy uppercase tracking-widest">Payment</h2>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:shadow-xl transition">
                            {isSubmitting ? 'Processing...' : `Pay ₹${plans[selectedPlan].price}`}
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
                                    <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="font-black text-gray-400 hover:text-navy uppercase tracking-widest text-xs">Back</button>
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
