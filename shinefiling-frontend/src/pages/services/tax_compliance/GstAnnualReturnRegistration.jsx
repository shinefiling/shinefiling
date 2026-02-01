
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X
} from 'lucide-react';
import { uploadFile, submitGstAnnualReturn } from '../../../api';

const GstAnnualReturnRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/gst-annual-return/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['basic', 'standard', 'premium'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'basic';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    const [formData, setFormData] = useState({
        gstin: '',
        financialYear: '2023-24',
        annualTurnover: '',
        businessName: '',
        pan: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        basic: { price: 2999, title: 'Basic Filings', features: ["GSTR-9 Filing", "upto 2Cr Turnover"], color: 'bg-white border-slate-200' },
        standard: { price: 5999, title: 'Standard Filings', features: ["GSTR-9 & 9C", "upto 5Cr Turnover", "CA Certified"], recommended: true, color: 'bg-indigo-50 border-indigo-200' },
        premium: { price: 9999, title: 'Premium Filings', features: ["GSTR-9 & 9C", "> 5Cr Turnover", "Complete Reconciliation"], color: 'bg-purple-50 border-purple-200' }
    };

    useEffect(() => {
        if (planProp) setSelectedPlan(validatePlan(planProp));
    }, [planProp]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.gstin) { newErrors.gstin = "GSTIN is required"; isValid = false; }
            if (!formData.businessName) { newErrors.businessName = "Business Name is required"; isValid = false; }
            if (!formData.annualTurnover) { newErrors.annualTurnover = "Turnover is required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(4, prev + 1));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'gst_annual_docs');
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id } }));
        } catch (error) { alert("Upload failed"); }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = { plan: selectedPlan, formData: formData, documents: docsList, status: "PAYMENT_SUCCESSFUL" };
            const response = await submitGstAnnualReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} /> BUSINESS DETAILS</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">GSTIN</label><input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className={`w-full p-3 rounded-lg border uppercase ${errors.gstin ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">Financial Year</label><select name="financialYear" value={formData.financialYear} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200"><option>2023-24</option><option>2022-23</option></select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">Business Name</label><input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">Annual Turnover</label><input type="number" name="annualTurnover" value={formData.annualTurnover} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.annualTurnover ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Required Documents</h3>
                            {['Financial Statements (BS/PL)', 'GSTR-3B Summary', 'GSTR-1 Summary'].map((doc, i) => (
                                <div key={i} className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">{doc}</span>
                                    <div className="flex items-center gap-2">{uploadedFiles[`doc_${i}`] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, `doc_${i}`)} className="text-xs w-24" /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-4">Review Filing</h2>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">GSTIN</span><span className="font-bold uppercase">{formData.gstin}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Turnover</span><span className="font-bold">₹{formData.annualTurnover}</span></div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold transition">{isSubmitting ? 'Processing...' : 'Pay Now'}</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? <div className="text-center bg-white p-12 rounded-3xl shadow-xl"><CheckCircle size={48} className="text-slate mx-auto mb-4" /><h1 className="text-3xl font-bold text-navy mb-4">Filing Submitted!</h1><p className="mb-8">Order ID: {automationPayload?.submissionId}</p><button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold">Dashboard</button></div> :
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                            {['Business Details', 'Data Upload', 'Review', 'Payment'].map((step, i) => (
                                <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'opacity-60 cursor-pointer'}`} onClick={() => currentStep > i + 1 && setCurrentStep(i + 1)}>
                                    <span className="font-bold text-sm text-navy">{step}</span>
                                    {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                </div>
                            ))}
                        </div>
                        <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} sticky top-24`}>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Plan</div>
                            <div className="text-3xl font-bold text-gray-800 mb-2">{plans[selectedPlan].title}</div>
                            <div className="text-3xl font-bold text-navy mb-4">₹{plans[selectedPlan].price}</div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {!isSuccess && currentStep < 4 && (
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default GstAnnualReturnRegistration;
