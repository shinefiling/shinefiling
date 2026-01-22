
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Landmark, X
} from 'lucide-react';
import { uploadFile } from '../../../utils/uploadFile';
import { submitTaxNoticeReply } from '../../../api';

const TaxNoticeReplyRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;
        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'standard';
            navigate('/login', { state: { from: `/services/legal-notices/tax-notice-reply/apply?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const validatePlan = (plan) => ['standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'standard';
    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        noticeType: 'GST',
        noticeSection: '',
        noticeDate: '',
        referenceNumber: '',
        assessmentYear: '',
        businessName: '',
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const plans = {
        standard: { price: 4999, title: 'Standard Service', features: ["Notice Analysis", "Technical Draft", "Online Submission"], color: 'bg-white border-slate-200' },
        premium: { price: 9999, title: 'Expert Representation', features: ["Senior CA Review", "Strategic Consultation", "Portal Follow-up"], color: 'bg-indigo-50 border-indigo-200' }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => e.target.files && setSelectedFiles(Array.from(e.target.files));

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const uploadedDocs = [];
            for (const file of selectedFiles) {
                const url = await uploadFile(file);
                uploadedDocs.push({ type: "TAX_NOTICE", filename: file.name, fileUrl: url });
            }
            const finalPayload = {
                submissionId: `TAX-${Date.now()}`,
                plan: selectedPlan,
                userEmail: formData.userEmail,
                formData: formData,
                documents: uploadedDocs,
                amountPaid: plans[selectedPlan].price,
                status: "INITIATED"
            };
            await submitTaxNoticeReply(finalPayload);
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2 font-mono tracking-wider text-xs"><Landmark size={18} /> NOTICE INFORMATION</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Type</label>
                                    <select name="noticeType" value={formData.noticeType} onChange={handleInputChange} className="w-full p-3 border rounded-lg">
                                        <option value="GST">GST Notice</option>
                                        <option value="Income Tax">Income Tax Notice</option>
                                        <option value="TDS">TDS Notice</option>
                                        <option value="Service Tax">Service Tax (Legacy)</option>
                                    </select></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Section (e.g. 143(1), ASMT-10)</label>
                                    <input name="noticeSection" value={formData.noticeSection} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Notice Date</label>
                                    <input type="date" name="noticeDate" value={formData.noticeDate} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">DIN / Reference Number</label>
                                    <input name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4">ENTITY DETAILS</h3>
                        <div className="grid gap-4">
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Business Name / Taxpayer Name</label>
                                <input name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Assessment Year (AY)</label>
                                <input name="assessmentYear" value={formData.assessmentYear} onChange={handleInputChange} placeholder="e.g. 2024-25" className="w-full p-3 border rounded-lg" /></div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                        <Upload size={40} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold mb-4">UPLOAD NOTICE COPY</h3>
                        <input type="file" multiple onChange={handleFileChange} className="w-full border-2 border-dashed p-10 rounded-xl" />
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border">
                        <h2 className="text-xl font-bold mb-4">Review</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm uppercase">
                            <div className="flex justify-between"><span>Type</span><span className="font-bold">{formData.noticeType}</span></div>
                            <div className="flex justify-between"><span>Section</span><span className="font-bold">{formData.noticeSection}</span></div>
                            <div className="flex justify-between pt-2 border-t"><span>Total</span><span className="font-bold text-navy">₹{plans[selectedPlan].price}</span></div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border text-center">
                        <h2 className="text-2xl font-bold mb-8 text-navy uppercase tracking-widest">Payment</h2>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold">
                            {isSubmitting ? 'Processing...' : `Pay ₹${plans[selectedPlan].price}`}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-24 px-4">
            {isSuccess ? (
                <div className="max-w-md mx-auto bg-white p-12 shadow-xl rounded-3xl text-center">
                    <CheckCircle size={48} className="text-bronze mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-8">Notice Reply Initiated!</h1>
                    <button onClick={() => navigate('/dashboard?tab=orders')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold">Dashboard</button>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-navy mb-8 uppercase tracking-widest text-center">Tax Notice Reply Application</h1>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 space-y-2">
                            {['Notice Info', 'Taxpayer Info', 'Uploads', 'Review', 'Pay'].map((s, i) => (
                                <div key={i} className={`p-4 rounded-xl border-2 ${currentStep === i + 1 ? 'border-bronze bg-beige/10' : 'border-transparent opacity-40'}`}>
                                    <span className="font-bold text-xs uppercase tracking-widest">{s}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1">{renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1} className="font-bold">Back</button>
                                    <button onClick={() => setCurrentStep(p => p + 1)} className="px-8 py-3 bg-navy text-white rounded-xl font-bold">Next</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxNoticeReplyRegistration;
