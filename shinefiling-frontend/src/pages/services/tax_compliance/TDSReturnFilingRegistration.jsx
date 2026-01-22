import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, CreditCard, FileText, User, Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X } from 'lucide-react';
import { uploadFile, submitTdsReturn } from '../../../api';

const TDSReturnFilingRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        if (!isLoggedIn) {
            const plan = searchParams.get('plan') || 'quarterly';
            navigate('/login', { state: { from: `/services/tds-return/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(planProp || 'quarterly');
    const [formData, setFormData] = useState({ tan: '', deductorName: '', formType: '24Q (Salary)', quarter: 'Q1 (Apr-Jun)', financialYear: '2023-24' });
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);

    const plans = {
        quarterly: { price: 1499, title: 'Quarterly Return', features: ["Single Form Filing"], color: 'bg-white border-slate-200' },
        annual: { price: 4999, title: 'Annual Package', features: ["All Quarters"], recommended: true, color: 'bg-indigo-50 border-indigo-200' },
        correction: { price: 2499, title: 'TDS Correction', features: ["Revise Previous Return"], color: 'bg-white border-slate-200' }
    };

    useEffect(() => { if (planProp) setSelectedPlan(planProp); }, [planProp]);
    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
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
            const finalPayload = { plan: selectedPlan, formData: formData, documents: docsList, status: "PAYMENT_SUCCESSFUL", serviceType: "TDS_RETURN" };
            const response = await submitTdsReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4">Deductor Details</h3>
                        <input type="text" name="tan" value={formData.tan} onChange={handleInputChange} placeholder="TAN Number" className="w-full p-3 rounded-lg border uppercase border-gray-200" />
                        <input type="text" name="deductorName" value={formData.deductorName} onChange={handleInputChange} placeholder="Deductor Name (Company/Firm)" className="w-full p-3 rounded-lg border border-gray-200" />
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4">Return Specifics</h3>
                        <div><label className="text-sm font-bold block mb-1">Form Type</label><select name="formType" value={formData.formType} onChange={handleInputChange} className="w-full p-3 border rounded-lg"><option value="24Q (Salary)">24Q (Salary)</option><option value="26Q (Non-Salary)">26Q (Non-Salary)</option><option value="27Q (NRI Payment)">27Q (NRI Payment)</option></select></div>
                        <div><label className="text-sm font-bold block mb-1">Quarter</label><select name="quarter" value={formData.quarter} onChange={handleInputChange} className="w-full p-3 border rounded-lg"><option value="Q1 (Apr-Jun)">Q1 (Apr-Jun)</option><option value="Q2 (Jul-Sep)">Q2 (Jul-Sep)</option><option value="Q3 (Oct-Dec)">Q3 (Oct-Dec)</option><option value="Q4 (Jan-Mar)">Q4 (Jan-Mar)</option></select></div>
                        <div><label className="text-sm font-bold block mb-1">Financial Year</label><select name="financialYear" value={formData.financialYear} onChange={handleInputChange} className="w-full p-3 border rounded-lg"><option value="2023-24">2023-24</option><option value="2022-23">2022-23</option></select></div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-navy mb-4">Upload Data</h3>
                    {['Deduction Details (Excel)', 'Challan Receipt (Payment Proof)', 'PAN of Deductees'].map((d, i) => (
                        <div key={i} className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center"><span className="text-sm">{d}</span><div className="flex items-center gap-2">{uploadedFiles[`doc_${i}`] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, `doc_${i}`)} className="text-xs w-24" /></div></div>
                    ))}
                </div>
            );
            case 4: return <div className="bg-white p-6 rounded-2xl border text-center"><h2 className="text-2xl font-bold mb-4">Review Details</h2><p className="mb-2">Plan: {plans[selectedPlan].title}</p><p className="font-bold text-xl">₹{plans[selectedPlan].price}</p></div>;
            case 5: return <div className="bg-white p-6 rounded-2xl border text-center"><h2 className="text-2xl font-bold mb-4">Payment</h2><button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-navy text-white rounded-xl font-bold">{isSubmitting ? '...' : 'Pay & Submit'}</button></div>;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pt-24 pb-20 px-6'}`}>
            {isSuccess ? <div className="text-center bg-white p-10 rounded-3xl shadow-lg"><h1 className="text-3xl font-bold mb-4">Success!</h1><p className="mb-6">Order ID: {automationPayload?.submissionId}</p><button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold">Dashboard</button></div> :
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80"><div className="bg-white p-4 rounded-2xl space-y-1">{['Deductor', 'Return', 'Docs', 'Review', 'Pay'].map((s, i) => <div key={i} className={`p-3 rounded-lg font-bold text-sm ${currentStep === i + 1 ? 'bg-beige/10 text-bronze-dark' : 'text-gray-400'}`}>{s}</div>)}</div></div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {currentStep < 5 && <div className="mt-8 flex justify-between"><button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-100">Back</button><button onClick={() => setCurrentStep(p => Math.min(5, p + 1))} className="px-8 py-3 bg-navy text-white rounded-xl font-bold">Next</button></div>}
                    </div>
                </div>
            }
        </div>
    );
};
export default TDSReturnFilingRegistration;
