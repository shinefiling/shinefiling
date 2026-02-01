
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Banknote, Calendar, X
} from 'lucide-react';
import { uploadFile } from '../../../utils/uploadFile';
import { submitChequeBounceNotice } from '../../../api';

const ChequeBounceNoticeRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;
        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/legal-notices/cheque-bounce-notice/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const validatePlan = (plan) => ['standard', 'urgent'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        userType: 'Complainant',
        chequeNumber: '',
        chequeDate: '',
        bankName: '',
        chequeAmount: '',
        bounceDate: '',
        bounceReason: 'Insufficient Funds',
        otherPartyName: '',
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const plans = {
        standard: { price: 1499, title: 'Standard Notice', features: ["Drafting u/s 138", "Regd. Post Dispatch", "1 Round of Edit"], color: 'bg-white border-slate-200' },
        urgent: { price: 1999, title: 'Urgent Dispatch', features: ["Priority Drafting", "Speed Post Dispatch", "Consultation"], color: 'bg-indigo-50 border-indigo-200' }
    };

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
        if (step === 1) {
            if (!formData.chequeNumber) { newErrors.chequeNumber = "Required"; isValid = false; }
            if (!formData.chequeAmount) { newErrors.chequeAmount = "Required"; isValid = false; }
            if (!formData.otherPartyName) { newErrors.otherPartyName = "Required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const uploadedDocs = [];
            for (const file of selectedFiles) {
                const url = await uploadFile(file);
                uploadedDocs.push({ type: "CHEQUE_DOC", filename: file.name, fileUrl: url });
            }
            const finalPayload = {
                submissionId: `CB-${Date.now()}`,
                plan: selectedPlan,
                userEmail: formData.userEmail,
                formData: formData,
                documents: uploadedDocs,
                amountPaid: plans[selectedPlan].price,
                status: "INITIATED"
            };
            await submitChequeBounceNotice(finalPayload);
            setIsSuccess(true);
        } catch (error) {
            alert("Error: " + error.message);
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Banknote size={20} className="text-navy" /> CHEQUE DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Cheque Number</label>
                                    <input type="text" name="chequeNumber" value={formData.chequeNumber} onChange={handleInputChange} placeholder="6 Digit No." className={`w-full p-3 rounded-lg border ${errors.chequeNumber ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Cheque Amount</label>
                                    <input type="number" name="chequeAmount" value={formData.chequeAmount} onChange={handleInputChange} placeholder="₹ 0.00" className={`w-full p-3 rounded-lg border ${errors.chequeAmount ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Cheque Date</label>
                                    <input type="date" name="chequeDate" value={formData.chequeDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="e.g. SBI, HDFC" className="w-full p-3 rounded-lg border border-gray-200" /></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><User size={20} className="text-orange-600" /> PARTIES</h3>
                            <div className="grid gap-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Other Party Name (Drawer)</label>
                                    <input type="text" name="otherPartyName" value={formData.otherPartyName} onChange={handleInputChange} placeholder="Who signed the cheque?" className={`w-full p-3 rounded-lg border ${errors.otherPartyName ? 'border-red-500' : 'border-gray-200'}`} /></div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Calendar size={20} className="text-red-500" /> BOUNCE DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Check Bounce Date</label>
                                    <input type="date" name="bounceDate" value={formData.bounceDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Reason for Bounce</label>
                                    <select name="bounceReason" value={formData.bounceReason} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="Insufficient Funds">Insufficient Funds</option>
                                        <option value="Account Closed">Account Closed</option>
                                        <option value="Signature Mismatch">Signature Mismatch</option>
                                        <option value="Stop Payment">Stop Payment</option>
                                    </select></div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center animate-in fade-in slide-in-from-right-4">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2 justify-center"><Upload size={20} className="text-bronze" /> UPLOAD DOCUMENTS</h3>
                        <p className="text-xs text-gray-500 mb-6">Upload Cheque Copy and Bank Return Memo.</p>
                        <input type="file" multiple onChange={handleFileChange} className="p-4 border-2 border-dashed border-gray-200 w-full rounded-xl cursor-pointer" />
                        {selectedFiles.length > 0 && <div className="mt-4 text-left space-y-2">{selectedFiles.map((f, i) => <div key={i} className="text-xs p-2 bg-gray-50 rounded flex justify-between"><span>{f.name}</span><CheckCircle size={14} className="text-green-500" /></div>)}</div>}
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-sm">
                        <h2 className="text-xl font-bold text-navy mb-4 uppercase tracking-wider">Review</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                            <div className="flex justify-between"><span>Cheque No.</span><span className="font-bold">{formData.chequeNumber}</span></div>
                            <div className="flex justify-between"><span>Amount</span><span className="font-bold">₹{formData.chequeAmount}</span></div>
                            <div className="flex justify-between"><span>Party</span><span className="font-bold">{formData.otherPartyName}</span></div>
                            <div className="flex justify-between pt-2 border-t text-lg font-bold"><span>Total</span><span className="text-navy">₹{plans[selectedPlan].price}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-4 text-navy"><CreditCard size={24} /></div>
                        <h2 className="text-2xl font-bold text-navy mb-8">Ready to Pay?</h2>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold">
                            {isSubmitting ? 'Processing...' : `Pay ₹${plans[selectedPlan].price}`}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <CheckCircle size={48} className="text-bronze mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-navy mb-8">Notice Sent for Drafting!</h1>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold">Orders</button>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-navy mb-8">Cheque Bounce Notice Application</h1>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-64 space-y-2">
                            {['Cheque', 'Bounce', 'Docs', 'Review', 'Pay'].map((s, i) => (
                                <div key={i} className={`p-3 rounded-lg border ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'opacity-50'}`}>
                                    <span className="font-bold text-xs uppercase text-gray-400 block">Step {i + 1}</span>
                                    <span className="font-bold text-sm text-navy">{s}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="font-bold text-gray-500">Back</button>
                                    <button onClick={() => validateStep(currentStep) && setCurrentStep(p => p + 1)} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold">Next</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChequeBounceNoticeRegistration;
