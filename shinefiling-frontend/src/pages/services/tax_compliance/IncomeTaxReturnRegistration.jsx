
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, Upload, Calendar, Trash2, Check, FileCheck,
    ArrowLeft, ArrowRight, Zap, Building, Clock,
    Sparkles, AlertCircle, TrendingUp, Calculator,
    ShieldCheck, Download, ReceiptText, Briefcase,
    Wallet, PieChart
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitIncomeTaxReturn } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const IncomeTaxReturnRegistration = ({ planProp = 'business', isModal, onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(state?.plan || planProp);

    const [formData, setFormData] = useState({
        applicantName: user?.name || '',
        panNumber: '',
        assessmentYear: '2025-26',
        employerName: '',
        annualSalary: '',
        businessName: '',
        turnover: '',
        capitalGainType: 'Equity',
        entityType: 'Firm',
        wantsRefundOptimization: true
    });

    const [files, setFiles] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const steps = [
        { id: 1, title: 'Scope', icon: Zap },
        { id: 2, title: 'Identity', icon: User },
        { id: 3, title: 'Yield', icon: PieChart },
        { id: 4, title: 'Vault', icon: Upload },
        { id: 5, title: 'Review', icon: CreditCard }
    ];

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileUpload = (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [docName]: file }));
            setUploadProgress(prev => ({ ...prev, [docName]: 100 }));
        }
    };

    const handleSubmit = async () => {
        const payload = new FormData();
        const incomeDetails = {
            employerName: formData.employerName,
            annualSalary: formData.annualSalary,
            businessName: formData.businessName,
            turnover: formData.turnover,

            capitalGainType: formData.capitalGainType,
            entityType: formData.entityType
        };

        const requestData = {
            plan: selectedPlan,
            assessmentYear: formData.assessmentYear,
            panNumber: formData.panNumber,
            applicantName: formData.applicantName,
            incomeDetails: incomeDetails,
            wantsRefundOptimization: formData.wantsRefundOptimization
        };

        payload.append('data', JSON.stringify(requestData));

        Object.keys(files).forEach(key => {
            payload.append('documents', files[key]);
        });

        try {
            await submitIncomeTaxReturn(payload);
            setCurrentStep(6);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Transmission failed. Please check your data packets.");
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col h-full bg-white font-sans text-navy">
            {/* PROGRESS BAR */}
            <div className="px-12 pt-10 pb-6 bg-slate-50/50 border-b border-slate-100 font-poppins">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 -rotate-3">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">ITR Filing expert</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tax Optimization Engine v5.0</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors order-last">
                        <Trash2 size={24} />
                    </button>
                </div>

                <div className="flex justify-between relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-teal-500 -translate-y-1/2 z-0"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></motion.div>

                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= s.id ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-400 shadow-inner'}`}
                            >
                                {currentStep > s.id ? <Check size={18} /> : <s.icon size={18} />}
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-teal-700' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM AREA */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-poppins">
                <AnimatePresence mode="wait">
                    {/* STEP 1: PLAN */}
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <div className="bg-teal-50 border border-teal-100 p-8 rounded-[40px] flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-teal-900 italic tracking-tighter uppercase">Direct Tax Tiers</h3>
                                    <p className="text-teal-700/60 font-medium text-sm tracking-wide">Select the return type matched to your income profile.</p>
                                </div>
                                <Zap className="text-teal-500 animate-pulse" size={40} />
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { id: 'salaried', name: 'Salaried', price: '999', features: ["ITR-1/2 Filing", "Form-16 Import", "Tax Refund Assist"] },
                                    { id: 'business', name: 'Business', price: '1999', features: ["ITR-3/4 Filing", "P&L/Balance Sheet", "Presumptive Audit"] },
                                    { id: 'capital_gains', name: 'Investor', price: '2999', features: ["Shares/MF Gain Audit", "Property Tax Prep", "Loss Carry Forward"] },
                                    { id: 'corporate', name: 'Entity / Firm', price: '4999', features: ["ITR-5/6/7 Filing", "Pvt Ltd / LLP / Firm", "Tax Audit Support"] }
                                ].map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPlan(p.id)}
                                        className={`p-6 rounded-[45px] border-4 transition-all cursor-pointer relative overflow-hidden group ${selectedPlan === p.id ? 'border-teal-500 bg-teal-50 shadow-2xl scale-105' : 'border-slate-100 hover:border-teal-200'}`}
                                    >
                                        {selectedPlan === p.id && <div className="absolute top-0 right-0 bg-teal-500 text-white p-3 rounded-bl-3xl"><CheckCircle size={20} /></div>}
                                        <h4 className={`text-xl font-black mb-1 uppercase italic ${selectedPlan === p.id ? 'text-teal-900' : 'text-slate-400'}`}>{p.name}</h4>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-4xl font-black">₹{p.price}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ONE TIME</span>
                                        </div>
                                        <div className="space-y-3">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><Check size={14} className="text-teal-500" /> {f}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: IDENTITY */}
                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-teal-500 pl-6">Primary Identification</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Applicant Legal Name</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-500" size={24} />
                                        <input
                                            name="applicantName"
                                            value={formData.applicantName}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="As per PAN Card"
                                            className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] font-black focus:border-teal-500 transition-all text-2xl uppercase italic shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PAN Card Number</label>
                                    <div className="relative">
                                        <ReceiptText className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                        <input
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="ABCDE1234F"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-teal-500 transition-all text-xl italic uppercase tracking-widest"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Year</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                        <select
                                            name="assessmentYear"
                                            value={formData.assessmentYear}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg tracking-tight uppercase appearance-none"
                                        >
                                            <option value="2025-26">2025-26 (Latest)</option>
                                            <option value="2024-25">2024-25</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: YIELD (DYANMIC) */}
                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-teal-500 pl-6">Yield Metrics</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                {selectedPlan === 'salaried' && (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Employer</label>
                                            <div className="relative">
                                                <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                                <input
                                                    name="employerName"
                                                    value={formData.employerName}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Company Name"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg italic"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual CTC (Approx)</label>
                                            <div className="relative">
                                                <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                                <input
                                                    name="annualSalary"
                                                    value={formData.annualSalary}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="e.g. 12,00,000"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg italic"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedPlan === 'business' && (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trade/Profession Name</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                                <input
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Operational Entity"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg italic"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Turnover</label>
                                            <div className="relative">
                                                <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                                <input
                                                    name="turnover"
                                                    value={formData.turnover}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Gross Receipts"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg italic"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedPlan === 'capital_gains' && (
                                    <div className="space-y-3 md:col-span-2 text-left">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yield Vector</label>
                                        <div className="relative">
                                            <PieChart className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                            <select
                                                name="capitalGainType"
                                                value={formData.capitalGainType}
                                                onChange={handleInputChange}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg tracking-tight uppercase appearance-none"
                                            >
                                                <option value="Equity">Listed Shares / Mutual Funds</option>
                                                <option value="Property">Real Estate / Property Sale</option>
                                                <option value="Crypto">VDA / Crypto-Currency Yields</option>
                                                <option value="Foreign">Foreign Assets / Income</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {selectedPlan === 'corporate' && (
                                    <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                                            <div className="relative">
                                                <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                                <input
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Company / Firm Name"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg italic"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Type</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                                <select
                                                    name="entityType"
                                                    value={formData.entityType}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg tracking-tight uppercase appearance-none"
                                                >
                                                    <option value="Firm">Partnership Firm</option>
                                                    <option value="LLP">LLP</option>
                                                    <option value="Company">Private Ltd / Ltd</option>
                                                    <option value="Trust">Trust / NGO</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual Turnover</label>
                                            <div className="relative">
                                                <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                                                <input
                                                    name="turnover"
                                                    value={formData.turnover}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    placeholder="Gross Receipts / Turnover"
                                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-teal-500 transition-all text-lg italic"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-10 rounded-[40px] border-4 border-slate-100 flex items-center justify-between mt-12 bg-teal-50/10">
                                <div>
                                    <h4 className="font-black italic text-lg uppercase tracking-tighter">Refund Optimization</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Our Experts scan all 80C/80D/Chapter VI-A options.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="wantsRefundOptimization"
                                    checked={formData.wantsRefundOptimization}
                                    onChange={handleInputChange}
                                    className="w-8 h-8 rounded-xl text-teal-600 focus:ring-teal-500 border-2"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: VAULT */}
                    {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-teal-500 pl-6">Document Vault</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                {selectedPlan === 'salaried' && (
                                    <div className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files.form16 ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Form-16 (PDF)</h4>
                                            {files.form16 && <CheckCircle className="text-teal-600 animate-bounce" size={20} />}
                                        </div>
                                        <input type="file" id="form16" className="hidden" onChange={(e) => handleFileUpload(e, 'form16')} />
                                        <label htmlFor="form16" className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                            <Upload size={20} className="text-teal-500" />
                                            {files.form16 ? files.form16.name.substring(0, 15) : 'Select Form-16'}
                                        </label>
                                    </div>
                                )}

                                <div className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files.bank_stmt ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Bank Stmt (Full FY)</h4>
                                        {files.bank_stmt && <CheckCircle className="text-teal-600 animate-bounce" size={20} />}
                                    </div>
                                    <input type="file" id="bank_stmt" className="hidden" onChange={(e) => handleFileUpload(e, 'bank_stmt')} />
                                    <label htmlFor="bank_stmt" className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                        <Upload size={20} className="text-teal-500" />
                                        {files.bank_stmt ? files.bank_stmt.name.substring(0, 15) : 'Select Statements'}
                                    </label>
                                </div>

                                <div className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files.investments ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Investment Proofs</h4>
                                        {files.investments && <CheckCircle className="text-teal-600 animate-bounce" size={20} />}
                                    </div>
                                    <input type="file" id="investments" className="hidden" onChange={(e) => handleFileUpload(e, 'investments')} />
                                    <label htmlFor="investments" className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                        <Upload size={20} className="text-teal-500" />
                                        {files.investments ? files.investments.name.substring(0, 15) : 'Select Proofs'}
                                    </label>
                                </div>

                                {selectedPlan === 'capital_gains' && (
                                    <div className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files.gain_stmt ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Capital Gain Summary</h4>
                                            {files.gain_stmt && <CheckCircle className="text-teal-600 animate-bounce" size={20} />}
                                        </div>
                                        <input type="file" id="gain_stmt" className="hidden" onChange={(e) => handleFileUpload(e, 'gain_stmt')} />
                                        <label htmlFor="gain_stmt" className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                            <Upload size={20} className="text-teal-500" />
                                            {files.gain_stmt ? files.gain_stmt.name.substring(0, 15) : 'Select Statement'}
                                        </label>
                                    </div>
                                )}
                                {selectedPlan === 'corporate' && (
                                    <>
                                        <div className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files.financials ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Financial Stmts</h4>
                                                {files.financials && <CheckCircle className="text-teal-600 animate-bounce" size={20} />}
                                            </div>
                                            <input type="file" id="financials" className="hidden" onChange={(e) => handleFileUpload(e, 'financials')} />
                                            <label htmlFor="financials" className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                                <Upload size={20} className="text-teal-500" />
                                                {files.financials ? files.financials.name.substring(0, 15) : 'BS / PL / Trial Bal'}
                                            </label>
                                        </div>
                                        <div className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files.audit ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Audit Report (Opt)</h4>
                                                {files.audit && <CheckCircle className="text-teal-600 animate-bounce" size={20} />}
                                            </div>
                                            <input type="file" id="audit" className="hidden" onChange={(e) => handleFileUpload(e, 'audit')} />
                                            <label htmlFor="audit" className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                                <Upload size={20} className="text-teal-500" />
                                                {files.audit ? files.audit.name.substring(0, 15) : 'Tax Audit Report'}
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: REVIEW */}
                    {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 1 }} className="space-y-10">
                            <div className="text-center space-y-4 font-poppins text-navy">
                                <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-[40px] flex items-center justify-center mx-auto -rotate-12 mb-8 shadow-xl border border-teal-200">
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-5xl font-black italic tracking-tighter uppercase">ITR Finalize</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em]">Validation sequence complete</p>
                            </div>

                            <div className="bg-navy rounded-[60px] p-12 text-white relative overflow-hidden group shadow-6xl">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                    <ReceiptText size={200} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 relative z-10 font-poppins">
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-teal-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Taxpayer Profile</p>
                                            <p className="text-2xl font-black italic tracking-tighter uppercase">{formData.applicantName || 'Applicant Name'}</p>
                                            <p className="text-xl font-black tracking-widest text-white/60 font-mono mt-1 uppercase">{formData.panNumber || 'XXXXXXXXXX'}</p>
                                        </div>
                                        <div>
                                            <p className="text-teal-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Assessment Cycle</p>
                                            <p className="text-2xl font-black italic uppercase tracking-tighter">{formData.assessmentYear}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-3xl rounded-[40px] p-10 flex flex-col justify-center border border-white/10">
                                        <p className="text-teal-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Professional Fee</p>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-7xl font-black italic tracking-tighter">₹{selectedPlan === 'salaried' ? '999' : selectedPlan === 'business' ? '1,999' : selectedPlan === 'corporate' ? '4,999' : '2,999'}</span>
                                            <span className="text-teal-300 font-bold text-xl">+ GST</span>
                                        </div>
                                        <div className="w-full h-px bg-white/20 mb-6"></div>
                                        <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest">Estimated processing: 48-72 Hours.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS */}
                    {currentStep === 6 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10">
                            <div className="w-32 h-32 bg-teal-600 rounded-[50px] flex items-center justify-center mx-auto text-white shadow-3xl shadow-teal-500/40 rotate-12">
                                <Check size={64} strokeWidth={4} />
                            </div>
                            <div className="space-y-4 font-poppins">
                                <h3 className="text-6xl font-black italic tracking-tighter uppercase text-navy">Application Delivered</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.5em] max-w-md mx-auto">Your ITR data has been transmitted to our expert tax auditors for final audit.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-teal-600 transition-all shadow-4xl">Enter Dashboard</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ACTION FOOTER */}
            {currentStep < 6 && (
                <div className="px-12 py-10 bg-slate-50 flex justify-between items-center border-t border-slate-100 font-poppins">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-0' : 'hover:translate-x-[-5px] text-slate-400 hover:text-navy'}`}
                    >
                        <ArrowLeft size={18} /> Prev Stage
                    </button>

                    <button
                        onClick={currentStep === 5 ? handleSubmit : nextStep}
                        className="flex items-center gap-6 px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-teal-600 transition-all shadow-2xl group"
                    >
                        {currentStep === 5 ? 'Authorize & Pay' : 'Next Stage'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default IncomeTaxReturnRegistration;
