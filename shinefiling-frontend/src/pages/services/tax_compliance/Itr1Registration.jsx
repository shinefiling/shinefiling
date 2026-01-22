import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X
} from 'lucide-react';
import { uploadFile, submitIncomeTaxReturn } from '../../../api';

const Itr1Registration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/income-tax/itr-1/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(planProp || 'basic');

    const [formData, setFormData] = useState({
        fullName: '',
        pan: '',
        dob: '',
        fatherName: '',
        mobile: '',
        itrType: 'ITR-1',
        assessmentYear: '2024-25',
        salaryIncome: '',
        otherIncome: '',
        deductions80C: '',
        bankIfsc: '',
        bankAccountNo: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    const plans = {
        basic: { price: 499, title: 'Standard Plan', features: ["Form 16 Upload", "Basic Filing"], color: 'bg-white border-slate-200' },
        assisted: { price: 999, title: 'Assisted Plan', features: ["CA Support", "Detailed Review"], recommended: true, color: 'bg-indigo-50 border-indigo-200' },
        premium: { price: 1499, title: 'Premium Plan', features: ["Tax Planning", "Expert Support"], color: 'bg-white border-slate-200' }
    };

    useEffect(() => { if (planProp) setSelectedPlan(planProp); }, [planProp]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.pan) { newErrors.pan = "PAN Required"; isValid = false; }
            if (!formData.fullName) { newErrors.fullName = "Name Required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.salaryIncome) { newErrors.salaryIncome = "Salary Income Required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(prev => Math.min(5, prev + 1)); };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'tax_docs');
            setUploadedFiles(prev => ({ ...prev, [key]: { originalFile: file, name: response.originalName || file.name, fileUrl: response.fileUrl, fileId: response.id } }));
        } catch (error) { alert("Upload failed"); }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({ id: k, filename: v.name, fileUrl: v.fileUrl }));
            const finalPayload = { plan: selectedPlan, formData: formData, documents: docsList, status: "PAYMENT_SUCCESSFUL" };
            const response = await submitIncomeTaxReturn(finalPayload);
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><User size={20} /> PERSONAL DETAILS</h3>
                            <div className="space-y-4">
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name (As per PAN)" className={`w-full p-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} placeholder="PAN Number" className={`w-full p-3 rounded-lg border uppercase ${errors.pan ? 'border-red-500' : 'border-gray-200'}`} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                    <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Linked to Aadhaar" className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="Father's Name" className="w-full p-3 rounded-lg border border-gray-200" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><PieChart size={20} /> INCOME & DEDUCTIONS</h3>
                            <div className="space-y-4">
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Annual Salary income</label><input type="number" name="salaryIncome" value={formData.salaryIncome} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.salaryIncome ? 'border-red-500' : 'border-gray-200'}`} /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Income from Other Sources</label><input type="number" name="otherIncome" value={formData.otherIncome} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" /></div>
                                <div><label className="text-xs font-bold text-gray-500 mb-1 block">Deductions (80C/80D etc)</label><input type="number" name="deductions80C" value={formData.deductions80C} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" /></div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Required Documents</h3>
                            {['Form 16', 'Bank Statement', 'Aadhaar Card'].map((doc, i) => (
                                <div key={i} className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">{doc}</span>
                                    <div className="flex items-center gap-2">{uploadedFiles[`doc_${i}`] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, `doc_${i}`)} className="text-xs w-24" /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-4">Confirm Filing</h2>
                        <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 mb-6">
                            <p className="flex justify-between text-sm"><span className="text-gray-500">Name</span> <span className="font-bold">{formData.fullName}</span></p>
                            <p className="flex justify-between text-sm"><span className="text-gray-500">Form</span> <span className="font-bold">ITR-1 (Sahaj)</span></p>
                            <p className="flex justify-between text-sm"><span className="text-gray-500">Plan</span> <span className="font-bold text-bronze-dark">{plans[selectedPlan].title}</span></p>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6"><IndianRupee size={32} /></div>
                        <h2 className="text-3xl font-bold text-navy mb-4">Pay & Submit</h2>
                        <p className="text-3xl font-bold text-navy mb-6">₹{plans[selectedPlan].price}</p>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-navy text-white rounded-xl font-bold transition">{isSubmitting ? 'Processing...' : 'Pay Now'}</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-navy">ITR-1 Filing Request Submitted!</h1>
                    <p className="text-gray-500 mb-6">Ref: {automationPayload?.submissionId}</p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-navy text-white px-6 py-2 rounded-lg">Done</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                            {['Personal Info', 'Income Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                <div key={i} className={`px-4 py-3 rounded-xl border flex justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige' : 'border-transparent opacity-60'}`} onClick={() => currentStep > i + 1 && setCurrentStep(i + 1)}>
                                    <span className="font-bold text-sm text-navy">{step}</span>
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
                                <button onClick={handleNext} className="px-8 py-3 bg-navy text-white rounded-xl font-bold shadow-lg flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Itr1Registration;
