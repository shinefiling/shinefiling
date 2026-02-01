import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, Briefcase, Activity
} from 'lucide-react';
import { submitVirtualCfo, uploadFile } from '../../../api';

const VirtualCFORegistration = ({ isModal, onClose, initialData = {} }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Determine initial plan
    const queryPlan = searchParams.get('plan') || initialData.plan || 'growth';
    const [selectedPlan, setSelectedPlan] = useState(queryPlan);

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const [formData, setFormData] = useState({
        businessName: '',
        turnoverRange: '1 Cr - 5 Cr',
        accountingSoftware: 'Tally',
        needFundraising: 'No',
        email: '',
        mobile: '',
        ...initialData
    });

    const plans = {
        essential: {
            price: 14999,
            title: 'Essential',
            features: ["Basic Bookkeeping Review", "Compliance Calendar", "Quarterly MIS"],
            color: 'bg-white border-slate-200'
        },
        growth: {
            price: 24999,
            title: 'Growth',
            features: ["Everything in Essential", "Monthly Strategy Call", "Detailed Monthly MIS", "Cash Flow Forecasting"],
            recommended: true,
            color: 'bg-[#043E52] text-white border-gray-700'
        },
        controller: {
            price: 49999,
            title: 'Controller',
            features: ["Everything in Growth", "Weekly Review Meetings", "Fundraising Support", "Board Representation"],
            color: 'bg-indigo-50 border-indigo-200'
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
            const response = await uploadFile(file, 'virtual_cfo_docs');
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
            const submissionId = `CFO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const finalPayload = {
                submissionId,
                plan: selectedPlan,
                userEmail: formData.email,
                amountPaid: plans[selectedPlan].price,
                formData: { ...formData },
                documents: Object.values(uploadedFiles),
                status: 'INITIATED'
            };
            await submitVirtualCfo(finalPayload);
            setSuccess(true);
        } catch (err) {
            alert(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Organization', 'Operations', 'Documents', 'Review & Pay'];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Organization
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {isModal && (
                            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        )}

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Building size={20} className="text-blue-600" /> BUSINESS PROFILE
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Entity Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Private Limited or LLP Name" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Annual Turnover</label>
                                    <select name="turnoverRange" value={formData.turnoverRange} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Under 1 Cr">Under 1 Crore</option>
                                        <option value="1 Cr - 5 Cr">1 Cr - 5 Crore</option>
                                        <option value="5 Cr - 20 Cr">5 Cr - 20 Crore</option>
                                        <option value="Above 20 Cr">Above 20 Crore</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Industry</label>
                                    <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Manufacturing, Tech" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Operations
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-orange-600" /> FINANCIAL OPS
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Accounting Software</label>
                                    <select name="accountingSoftware" value={formData.accountingSoftware} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Tally">Tally</option>
                                        <option value="Zoho Books">Zoho Books</option>
                                        <option value="Quickbooks">Quickbooks</option>
                                        <option value="SAP / ERP">ERP (SAP/Oracle)</option>
                                        <option value="None / Excel">None (Spreadsheets)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Looking for Fundraising?</label>
                                    <select name="needFundraising" value={formData.needFundraising} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="No">No, focus on operations</option>
                                        <option value="Imminent (0-3 Months)">Yes, in next 3 months</option>
                                        <option value="Planned (6-12 Months)">Planned in future</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Primary Financial Goal</label>
                                    <textarea name="goal" value={formData.goal} onChange={handleChange} rows="2" placeholder="e.g. Profit improvement, Cash Flow management, Audit readiness" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
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
                                <FileText size={20} className="text-bronze" /> AUDIT ACCESS
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Internal data for preliminary review.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {['Prev Year Audit Report', 'Current Year Trial Balance', 'GST Returns (Recent)', 'Organization Chart'].map((label, idx) => {
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
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <Briefcase size={32} className="text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Book CFO Retainer</h2>
                        <p className="text-gray-500 mb-8">Onboarding for professional financial leadership.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-bold">{plans[selectedPlan]?.title} Plan</div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Monthly Fees</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan]?.price?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="text-left bg-gray-50 p-4 rounded-xl mb-6 text-sm space-y-2 border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Business:</span>
                                <span className="font-semibold">{formData.businessName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Commitment:</span>
                                <span className="font-semibold">Month-to-Month</span>
                            </div>
                        </div>

                        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-navy text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                            {loading ? 'Processing...' : 'Pay & Start Onboarding'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                            <Lock size={12} /> Priority Support Guaranteed
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
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Onboarding Initiated!</h1>
                    <p className="text-gray-500 mb-8">
                        Your booking for <span className="font-bold text-navy">Virtual CFO Services</span> has been successful.
                        Reference ID: <span className="font-bold text-blue-600">{formData.submissionId}</span>.
                        A senior partner will call you within the next 2 hours to schedule the first strategy deep-dive.
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
                        <h1 className="text-3xl font-bold text-navy">Virtual CFO Services</h1>
                        <p className="text-gray-500">Scale your business with expert financial leadership.</p>
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
                                    <div className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Current Retainer</div>
                                    <div className="text-2xl font-bold mb-2">{plans[selectedPlan]?.title}</div>
                                    <div className="text-3xl font-black mb-4">₹{plans[selectedPlan]?.price?.toLocaleString()}</div>

                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan]?.features?.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium opacity-80">
                                                <CheckCircle size={14} className="shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Briefcase className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 rotate-12" />
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

export default VirtualCFORegistration;
