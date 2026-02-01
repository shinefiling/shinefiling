import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, Users, Briefcase, ChevronRight, FileSpreadsheet
} from 'lucide-react';
import { submitFinancialService, uploadFile } from '../../../api';

const ApplyCmaDataPreparation = ({ isModal, onClose, initialData = {} }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Determine initial plan
    const queryPlan = searchParams.get('plan') || initialData.plan || 'standard';
    const [selectedPlan, setSelectedPlan] = useState(queryPlan);

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const [formData, setFormData] = useState({
        businessName: '',
        constitution: 'Proprietorship',
        natureOfBusiness: '',
        gstApplicable: 'Yes',
        turnover: '',
        loanType: 'Cash Credit (CC)',
        loanAmount: '',
        bankName: '',
        existingLoans: '',
        email: '',
        mobile: '',
        ...initialData
    });

    // Plans Configuration
    const plans = {
        standard: {
            price: 4999,
            title: 'Standard CMA',
            features: [
                "Loans up to ₹1 Cr", "5-Year Projections", "Ratio Analysis", "MPBF Calculation", "3 Days Delivery"
            ],
            color: 'bg-white border-slate-200'
        },
        express: {
            price: 7499,
            title: 'Express CMA',
            features: [
                "Loans up to ₹2 Cr", "24-Hour Delivery", "Priority Support", "Unlimited Revisions", "Bank Format Compliant"
            ],
            recommended: true,
            color: 'bg-[#043E52] text-white border-gray-700'
        },
        premium: {
            price: 9999,
            title: 'Premium CMA',
            features: [
                "Loans > ₹2 Cr", "Detailed Project Report", "Bank Query Handling", "Sensitivity Analysis", "dedicated CA"
            ],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({ ...prev, email: user.email, mobile: user.mobile || '' }));
        }
        if (!isModal) window.scrollTo(0, 0);
    }, [isModal]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'financial_docs');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const finalPayload = {
                service: 'cma-data-preparation',
                plan: selectedPlan,
                ...formData,
                documents: Object.values(uploadedFiles)
            };
            await submitFinancialService('cma-data-preparation', finalPayload);
            setSuccess(true);
        } catch (err) {
            alert(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Business Details', 'Loan Requirements', 'Documents', 'Review & Pay'];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Business Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* Close Button for Modal */}
                        {isModal && (
                            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        )}

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Building size={20} className="text-blue-600" /> BUSINESS INFORMATION
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Business Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter business name" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Constitution</label>
                                    <select name="constitution" value={formData.constitution} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Pvt Ltd">Private Limited</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">GST Applicable</label>
                                    <select name="gstApplicable" value={formData.gstApplicable} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Nature of Business</label>
                                    <input type="text" name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleChange} placeholder="e.g. Manufacturing of Textiles" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Annual Turnover (Approx)</label>
                                    <input type="text" name="turnover" value={formData.turnover} onChange={handleChange} placeholder="e.g. 50 Lakhs" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Loan Requirements
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-green-600" /> LOAN REQUIREMENTS
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Loan Amount Required</label>
                                    <input type="text" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="e.g. 1 Cr" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Loan Type</label>
                                    <select name="loanType" value={formData.loanType} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Cash Credit (CC)">Cash Credit (CC)</option>
                                        <option value="Overdraft (OD)">Overdraft (OD)</option>
                                        <option value="Term Loan (TL)">Term Loan (TL)</option>
                                        <option value="Mudra Loan">Mudra Loan</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Target Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. SBI, HDFC" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Existing Loans (if any)</label>
                                    <input type="text" name="existingLoans" value={formData.existingLoans} onChange={handleChange} placeholder="Details of current loans..." className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <FileSpreadsheet size={20} className="text-bronze" /> FINANCIAL DOCUMENTS
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Please upload available documents. Our CA will review them.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {['Last 2 Years ITR', 'Provisional Financials', 'Sanction Letter (if renewal)', 'Project Report (if new)'].map((label, idx) => {
                                    const key = `doc_${idx}`;
                                    return (
                                        <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors bg-gray-50">
                                            <div className="flex items-center gap-2">
                                                <Upload size={16} className="text-gray-400 group-hover:text-bronze" />
                                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={16} className="text-green-500" />}
                                                <input type="file" onChange={(e) => handleFileUpload(e, key)} className="text-xs w-24 text-slate-400" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Review your details and proceed to payment.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-bold">{plans[selectedPlan]?.title}</div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan]?.price?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="text-left bg-gray-50 p-4 rounded-xl mb-6 text-sm space-y-2 border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Business Name:</span>
                                <span className="font-semibold">{formData.businessName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Loan Amount:</span>
                                <span className="font-semibold">{formData.loanAmount}</span>
                            </div>
                        </div>

                        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {loading ? 'Processing...' : 'Pay Now & Submit'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                            <Lock size={12} /> Secure 256-bit SSL Payment
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {success ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your request for <span className="font-bold text-navy">CMA Data Preparation</span> has been received.
                        Our financial experts will review your documents and contact you shortly.
                    </p>
                    <button onClick={() => isModal && onClose ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">
                        Go to Dashboard
                    </button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        {!isModal && (
                            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition">
                                <ArrowLeft size={14} /> Back
                            </button>
                        )}
                        <h1 className="text-3xl font-bold text-navy">Apply for CMA Data</h1>
                        <p className="text-gray-500">Provide your business financial details to generate a bank-compliant CMA report.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* LEFT SIDEBAR */}
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {steps.map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-blue-800' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan]?.color || 'bg-white'} relative overflow-hidden transition-all sticky top-24`}>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Current Plan</div>
                                    <div className="text-2xl font-bold mb-2">{plans[selectedPlan]?.title}</div>
                                    <div className="text-3xl font-black mb-4">₹{plans[selectedPlan]?.price?.toLocaleString()}</div>

                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan]?.features?.slice(0, 4).map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium opacity-80">
                                                <CheckCircle size={14} className="shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs font-bold opacity-60">* Govt fees extra if applicable</div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT FORM CONTENT */}
                        <div className="flex-1">
                            {renderStepContent()}

                            {currentStep < 4 && (
                                <div className="mt-8 flex justify-between">
                                    <button
                                        onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                                        disabled={currentStep === 1}
                                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={() => setCurrentStep(p => Math.min(4, p + 1))}
                                        className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2"
                                    >
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyCmaDataPreparation;
