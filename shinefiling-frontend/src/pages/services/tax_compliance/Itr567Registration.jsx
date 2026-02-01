import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, CreditCard, FileText, User, Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, PieChart, Calendar, X } from 'lucide-react';
import { uploadFile, submitIncomeTaxReturn } from '../../../api';

const Itr567Registration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        if (!isLoggedIn) {
            const plan = searchParams.get('plan') || 'itr6';
            navigate('/login', { state: { from: `/services/income-tax/itr-5-6-7/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(planProp || 'itr6');
    const [formData, setFormData] = useState({ entityName: '', pan: '', incorporationDate: '', itrType: 'ITR-6', assessmentYear: '2024-25', entityType: 'Private Limited Company', turnover: '', auditApplicable: 'Yes' });
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);

    const plans = {
        itr5: { price: 3499, title: 'ITR-5 (LLP/Firm)', features: ["Partnership Tax"], color: 'bg-white border-slate-200' },
        itr6: { price: 4999, title: 'ITR-6 (Company)', features: ["Corporate Tax"], recommended: true, color: 'bg-indigo-50 border-indigo-200' },
        itr7: { price: 5999, title: 'ITR-7 (Trust/NGO)', features: ["Exemption Filing"], color: 'bg-purple-50 border-purple-200' }
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
            const finalPayload = { plan: selectedPlan, formData: formData, documents: docsList, status: "PAYMENT_SUCCESSFUL" };
            const response = await submitIncomeTaxReturn(finalPayload);
            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4">Entity Details</h3>
                        <input type="text" name="entityName" value={formData.entityName} onChange={handleInputChange} placeholder="Entity Name (Company / Firm Name)" className="w-full p-3 rounded-lg border border-gray-200" />
                        <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} placeholder="Entity PAN" className="w-full p-3 rounded-lg border uppercase border-gray-200" />
                        <div className="grid grid-cols-2 gap-4"><input type="date" name="incorporationDate" value={formData.incorporationDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" /><select name="entityType" value={formData.entityType} onChange={handleInputChange} className="w-full p-3 border rounded-lg"><option value="Private Limited Company">Pvt Ltd Company</option><option value="LLP">LLP</option><option value="Partnership Firm">Partnership Firm</option><option value="Trust/Society">Trust/Society</option><option value="OPC">One Person Company</option></select></div>
                    </div>
                </div>
            );
            case 2: return (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-navy mb-4">Financials</h3>
                        <div><label className="text-sm font-bold block mb-1">Annual Turnover / Gross Receipts</label><input type="number" name="turnover" value={formData.turnover} onChange={handleInputChange} className="w-full p-3 border rounded-lg" /></div>
                        <div><label className="text-sm font-bold block mb-1">Is Audit Applicable?</label><select name="auditApplicable" value={formData.auditApplicable} onChange={handleInputChange} className="w-full p-3 border rounded-lg"><option value="Yes">Yes (Statutory/Tax Audit)</option><option value="No">No</option></select></div>
                    </div>
                </div>
            );
            case 3: return (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-navy mb-4">Upload Docs</h3>
                    {['Financial Statements (BS/PL)', 'Audit Report (if any)', 'Previous ITR Acknowledgement', 'DSC of Director/Partner'].map((d, i) => (
                        <div key={i} className="border border-dashed p-4 rounded-lg bg-gray-50 flex justify-between items-center"><span className="text-sm">{d}</span><div className="flex items-center gap-2">{uploadedFiles[`doc_${i}`] && <CheckCircle size={16} className="text-bronze" />}<input type="file" onChange={(e) => handleFileUpload(e, `doc_${i}`)} className="text-xs w-24" /></div></div>
                    ))}
                </div>
            );
            case 4: return <div className="bg-white p-6 rounded-2xl border text-center"><h2 className="text-2xl font-bold mb-4">Review Filing</h2><p className="mb-2">Entity: {formData.entityName}</p><p className="mb-2">Plan: {plans[selectedPlan].title}</p><p className="font-bold text-xl">₹{plans[selectedPlan].price}</p></div>;
            case 5: return <div className="bg-white p-6 rounded-2xl border text-center"><h2 className="text-2xl font-bold mb-4">Payment</h2><button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-navy text-white rounded-xl font-bold">{isSubmitting ? '...' : 'Pay & Submit'}</button></div>;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pt-24 pb-20 px-6'}`}>
            {isSuccess ? <div className="text-center bg-white p-10 rounded-3xl shadow-lg"><h1 className="text-3xl font-bold mb-4">Success!</h1><p className="mb-6">Order ID: {automationPayload?.submissionId}</p><button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-navy text-white px-8 py-3 rounded-xl font-bold">Dashboard</button></div> :
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80"><div className="bg-white p-4 rounded-2xl space-y-1">{['Entity Info', 'Financials', 'Docs', 'Review', 'Pay'].map((s, i) => <div key={i} className={`p-3 rounded-lg font-bold text-sm ${currentStep === i + 1 ? 'bg-beige/10 text-bronze-dark' : 'text-gray-400'}`}>{s}</div>)}</div></div>
                    <div className="flex-1">
                        {renderStepContent()}
                        {currentStep < 5 && <div className="mt-8 flex justify-between"><button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-100">Back</button><button onClick={() => setCurrentStep(p => Math.min(5, p + 1))} className="px-8 py-3 bg-navy text-white rounded-xl font-bold">Next</button></div>}
                    </div>
                </div>
            }
        </div>
    );
};
export default Itr567Registration;
