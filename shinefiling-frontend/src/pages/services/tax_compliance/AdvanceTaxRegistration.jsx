
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, Upload, Calendar, Trash2, Check, FileCheck,
    ArrowLeft, ArrowRight, Zap, Building, Clock,
    Sparkles, AlertCircle, TrendingUp, Calculator,
    ShieldCheck, Download, ReceiptText, PieChart,
    IndianRupee, Briefcase, Wallet
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitAdvanceTax } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const AdvanceTaxRegistration = ({ initialPlan = 'standard', onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(state?.plan || initialPlan);

    const [formData, setFormData] = useState({
        pan: '',
        financialYear: '2024-2025',
        installment: 'June',
        taxpayerType: 'Individual',
        businessIncome: '',
        salaryIncome: '',
        capitalGains: '',
        interestIncome: '',
        deduction80C: '',
        deduction80D: ''
    });

    const [files, setFiles] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const steps = [
        { id: 1, title: 'Scope', icon: Zap },
        { id: 2, title: 'Identity', icon: User },
        { id: 3, title: 'Income', icon: PieChart },
        { id: 4, title: 'Vault', icon: Upload },
        { id: 5, title: 'Finalize', icon: CreditCard }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [docName]: file }));
            setUploadProgress(prev => ({ ...prev, [docName]: 100 }));
        }
    };

    const handleSubmit = async () => {
        const payload = {
            submissionId: `ADV-${Date.now()}`,
            plan: selectedPlan,
            formData: formData,
            status: "PAYMENT_SUCCESSFUL"
        };

        try {
            await submitAdvanceTax(payload);
            setCurrentStep(6);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Transmission break. Please reconnect and retry.");
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
                        <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 rotate-3">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Advance Tax Shield</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Interest Guard v4.1</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors order-last">
                        <Trash2 size={24} />
                    </button>
                </div>

                <div className="flex justify-between relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-amber-500 -translate-y-1/2 z-0"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></motion.div>

                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= s.id ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-slate-200 text-slate-400 shadow-inner'}`}
                            >
                                {currentStep > s.id ? <Check size={18} /> : <s.icon size={18} />}
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-amber-700' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM AREA */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-poppins text-left">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SCOPE */}
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-amber-950 italic tracking-tighter uppercase">Compliance Scope</h3>
                                    <p className="text-amber-700/60 font-medium text-sm tracking-wide">Select your service tier for income estimation.</p>
                                </div>
                                <Zap className="text-amber-500 animate-pulse" size={40} />
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { id: 'free', name: 'Self Pay', price: '0', features: ["DIY Calculator", "Portal Access"], disabled: true },
                                    { id: 'standard', name: 'Expert Assist', price: '499', features: ["Single installment", "CA Review Aid"] },
                                    { id: 'premium', name: 'Yearly Plan', price: '1499', features: ["All 4 Installments", "Tax Saving Plan"] }
                                ].map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => !p.disabled && setSelectedPlan(p.id)}
                                        className={`p-10 rounded-[45px] border-4 transition-all relative overflow-hidden group ${p.disabled ? 'opacity-40 cursor-not-allowed border-slate-100' : selectedPlan === p.id ? 'border-amber-500 bg-amber-50 shadow-2xl scale-105 cursor-pointer' : 'border-slate-100 hover:border-amber-200 cursor-pointer'}`}
                                    >
                                        {selectedPlan === p.id && !p.disabled && <div className="absolute top-0 right-0 bg-amber-500 text-white p-3 rounded-bl-3xl"><CheckCircle size={20} /></div>}
                                        <h4 className={`text-xl font-black mb-1 uppercase italic ${selectedPlan === p.id ? 'text-amber-900' : 'text-slate-400'}`}>{p.name}</h4>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-4xl font-black">₹{p.price}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.id === 'free' ? '' : '+ GST'}</span>
                                        </div>
                                        <div className="space-y-3">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><Check size={14} className="text-amber-500" /> {f}</div>
                                            ))}
                                        </div>
                                        {p.disabled && <div className="mt-6 text-[8px] font-black uppercase text-amber-600 tracking-widest bg-amber-100/50 py-1 rounded-full text-center">Coming Soon</div>}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: IDENTITY */}
                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6">Core Identification</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">PAN Card Number</label>
                                    <div className="relative">
                                        <ReceiptText className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={24} />
                                        <input
                                            name="pan"
                                            value={formData.pan}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="ABCDE1234F"
                                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[30px] font-black focus:border-amber-500 transition-all text-2xl uppercase italic tracking-widest font-mono shadow-inner"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Taxpayer Category</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <select
                                            name="taxpayerType"
                                            value={formData.taxpayerType}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-lg tracking-tight uppercase appearance-none"
                                        >
                                            <option value="Individual">Individual / Proprietor</option>
                                            <option value="Company">Pvt Ltd / Public Ltd</option>
                                            <option value="Firm">Partnership / LLP</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Financial Year</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <select
                                            name="financialYear"
                                            value={formData.financialYear}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-lg tracking-tight uppercase appearance-none"
                                        >
                                            <option value="2024-2025">FY 2024-2025</option>
                                            <option value="2025-2026">FY 2025-2026</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Target Installment</label>
                                    <div className="relative">
                                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <select
                                            name="installment"
                                            value={formData.installment}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-lg tracking-tight appearance-none italic"
                                        >
                                            <option value="June">1st (June - 15%)</option>
                                            <option value="September">2nd (Sept - 45%)</option>
                                            <option value="December">3rd (Dec - 75%)</option>
                                            <option value="March">4th (Mar - 100%)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: YIELD */}
                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6">Yield Projections</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Business / Profession Income</label>
                                        <div className="relative">
                                            <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                            <input
                                                name="businessIncome"
                                                value={formData.businessIncome}
                                                onChange={handleInputChange}
                                                type="number"
                                                placeholder="Yearly Estimate"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-xl italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Salary Income (If any)</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                            <input
                                                name="salaryIncome"
                                                value={formData.salaryIncome}
                                                onChange={handleInputChange}
                                                type="number"
                                                placeholder="Gross Annual"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-xl italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Capital Gains (Equity/Prop)</label>
                                        <div className="relative">
                                            <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                            <input
                                                name="capitalGains"
                                                value={formData.capitalGains}
                                                onChange={handleInputChange}
                                                type="number"
                                                placeholder="Stocks/Real Estate"
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-amber-500 transition-all text-xl italic"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-navy p-6 rounded-[35px] text-white space-y-4">
                                        <h4 className="text-[9px] font-black text-amber-400 uppercase tracking-widest italic flex items-center gap-2">
                                            <ShieldCheck size={14} /> DEDUCTIONS (CHAPTER VI-A)
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input name="deduction80C" value={formData.deduction80C} onChange={handleInputChange} type="number" placeholder="80C Limit" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs font-black focus:border-amber-500 transition-all" />
                                            <input name="deduction80D" value={formData.deduction80D} onChange={handleInputChange} type="number" placeholder="80D Medical" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs font-black focus:border-amber-500 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: VAULT */}
                    {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6">Data Vault</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { label: 'Form 26AS / AIS Tax Credit', key: 'tax_credit' },
                                    { label: 'Bank Interest Statement', key: 'bank_stmt' },
                                    { label: 'Capital Gain Broker Report', key: 'gain_report' },
                                    { label: 'Last Year ITR Receipt', key: 'prev_itr' }
                                ].map((doc, i) => (
                                    <div key={i} className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files[doc.key] ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-300'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{doc.label}</h4>
                                            {files[doc.key] && <CheckCircle className="text-amber-600 animate-bounce" size={20} />}
                                        </div>
                                        <input type="file" id={doc.key} className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                        <label htmlFor={doc.key} className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                            <Upload size={20} className="text-amber-500" />
                                            {files[doc.key] ? files[doc.key].name.substring(0, 20) + '...' : 'Upload Doc'}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: REVIEW */}
                    {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 1 }} className="space-y-10 text-center">
                            <div className="space-y-4 font-poppins text-navy">
                                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[40px] flex items-center justify-center mx-auto -rotate-12 mb-8 shadow-xl border border-amber-200">
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-5xl font-black italic tracking-tighter uppercase font-poppins">Compliance Authorization</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em]">Projection Logic Validated</p>
                            </div>

                            <div className="bg-navy rounded-[60px] p-12 text-white relative overflow-hidden group shadow-6xl text-left">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                    <IndianRupee size={200} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 relative z-10 font-poppins">
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Deductor PAN</p>
                                            <p className="text-4xl font-black italic tracking-tighter uppercase font-mono">{formData.pan || 'XXXXXXXXXX'}</p>
                                        </div>
                                        <div>
                                            <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Target Quarter</p>
                                            <p className="text-2xl font-black italic uppercase tracking-tighter">{formData.installment} | FY {formData.financialYear}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-3xl rounded-[40px] p-10 flex flex-col justify-center border border-white/10">
                                        <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Professional Fee</p>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-7xl font-black italic tracking-tighter">₹{plans[selectedPlan].price}</span>
                                            <span className="text-amber-300 font-bold text-xl">+ GST</span>
                                        </div>
                                        <div className="w-full h-px bg-white/20 mb-6"></div>
                                        <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest italic">Includes expert estimation roadmap.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS */}
                    {currentStep === 6 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10">
                            <div className="w-32 h-32 bg-amber-600 rounded-[50px] flex items-center justify-center mx-auto text-white shadow-3xl shadow-amber-500/40 rotate-12">
                                <Check size={64} strokeWidth={4} />
                            </div>
                            <div className="space-y-4 font-poppins text-center">
                                <h3 className="text-6xl font-black italic tracking-tighter uppercase text-navy">Calculation Sent</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.5em] max-w-md mx-auto">Your income data has been successfully transmitted for expert tax projection.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-amber-600 transition-all shadow-4xl">Enter Dashboard</button>
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
                        className="flex items-center gap-6 px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-amber-600 transition-all shadow-2xl group"
                    >
                        {currentStep === 5 ? 'Authorize & Calculate' : 'Next Stage'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

const plans = {
    free: { price: '0', title: 'Self Pay' },
    standard: { price: '499', title: 'Expert Assist' },
    premium: { price: '1499', title: 'Yearly Plan' }
};

export default AdvanceTaxRegistration;
