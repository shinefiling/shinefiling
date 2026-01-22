import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, TrendingUp, BarChart
} from 'lucide-react';
import { submitProjectReport, uploadFile } from '../../../api';

const ProjectReportRegistration = ({ isModal, onClose, initialData = {} }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Determine initial plan
    const queryPlan = searchParams.get('plan') || initialData.plan || 'market';
    const [selectedPlan, setSelectedPlan] = useState(queryPlan);

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState({});

    const [formData, setFormData] = useState({
        businessName: '',
        industryType: 'Manufacturing',
        loanAmountRequired: '',
        purposeOfLoan: 'Term Loan for Machinery',
        existingLoanDetails: 'None',
        email: '',
        mobile: '',
        ...initialData
    });

    const plans = {
        basic: {
            price: 3499,
            title: 'Basic Report',
            features: ["Loans upto 20 Lakhs", "Basic Financials (5 Yrs)", "Brief Business Summary"],
            color: 'bg-white border-slate-200'
        },
        market: {
            price: 5999,
            title: 'DPR Standard',
            features: ["Loans 20L - 2Cr", "DSCR & BEP Analysis", "Market & SWOT Analysis", "Promoter Profile"],
            recommended: true,
            color: 'bg-[#10232A] text-white border-gray-700'
        },
        comprehensive: {
            price: 14999,
            title: 'Industrial DPR',
            features: ["Loans above 2 Cr", "Detailed Tech Feasibility", "Multi-Product Analysis", "Process Flow Charts"],
            color: 'bg-blue-50 border-blue-200'
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
            const response = await uploadFile(file, 'project_report_docs');
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
            const submissionId = `DPR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const finalPayload = {
                submissionId,
                plan: selectedPlan,
                userEmail: formData.email,
                amountPaid: plans[selectedPlan].price,
                formData: { ...formData },
                documents: Object.values(uploadedFiles),
                status: 'INITIATED'
            };
            await submitProjectReport(finalPayload);
            setSuccess(true);
        } catch (err) {
            alert(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Business Details', 'Loan Info', 'Documents', 'Review & Pay'];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Business Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {isModal && (
                            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        )}

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <Building size={20} className="text-blue-600" /> PROJECT OVERVIEW
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Full Business/Project Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Proposed or Existing Name" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Industry Sector</label>
                                    <select name="industryType" value={formData.industryType} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Trading">Trading</option>
                                        <option value="Service">Service</option>
                                        <option value="Agriculture / Allied">Agriculture / Allied</option>
                                        <option value="Real Estate / Construction">Real Estate / Construction</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Location / City</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Project Site Location" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Loan Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                                <TrendingUp size={20} className="text-green-600" /> FUNDING REQUIREMENTS
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Loan Amount Required (in ₹ Lakhs)</label>
                                    <input type="number" name="loanAmountRequired" value={formData.loanAmountRequired} onChange={handleChange} placeholder="e.g. 50" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Loan Type</label>
                                    <select name="purposeOfLoan" value={formData.purposeOfLoan} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                                        <option value="Term Loan for Machinery">Term Loan (Machinery/Equipment)</option>
                                        <option value="Term Loan for Construction">Term Loan (Civil/Building)</option>
                                        <option value="Composite Loan (Mudra/PMEGP)">Composite Loan (Mudra/PMEGP)</option>
                                        <option value="Working Capital Limit">Working Capital / CC Limit</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Promoter's Contribution (Equity)</label>
                                    <input type="text" name="promoterEquity" value={formData.promoterEquity} onChange={handleChange} placeholder="How much capital will you invest personally?" className="w-full p-3 rounded-lg border border-gray-200 bg-white" />
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
                                <FileText size={20} className="text-bronze" /> BASE DATA
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Upload these to help us build a more accurate report.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {['Machinery Quotations', 'Land/Building Documents', 'Promoter KYC & Profile', '3 Year Audit/ITR (if existing)'].map((label, idx) => {
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
                        <h2 className="text-3xl font-bold text-navy mb-2">Order Summary</h2>
                        <p className="text-gray-500 mb-8">Ready to create your professional project report.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-bold">{plans[selectedPlan]?.title}</div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan]?.price?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="text-left bg-gray-50 p-4 rounded-xl mb-6 text-sm space-y-2 border border-gray-200">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Project:</span>
                                <span className="font-semibold">{formData.businessName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Loan Amount:</span>
                                <span className="font-semibold">₹{formData.loanAmountRequired} Lakhs</span>
                            </div>
                        </div>

                        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {loading ? 'Generating Invoice...' : 'Pay & Start Preparation'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                            <Lock size={12} /> Secure Checkout
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
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Request Received!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">Detailed Project Report (DPR)</span> has been logged.
                        Reference ID: <span className="font-bold text-blue-600">{formData.submissionId}</span>.
                        Our financial analysts will contact you within 4 hours to begin data collection.
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
                        <h1 className="text-3xl font-bold text-navy">Project Report Preparation</h1>
                        <p className="text-gray-500">Professional DPR for Bank Loans & Subsidies.</p>
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
                                        {plans[selectedPlan]?.features?.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium opacity-80">
                                                <CheckCircle size={14} className="shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <BarChart className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 rotate-12" />
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

export default ProjectReportRegistration;
