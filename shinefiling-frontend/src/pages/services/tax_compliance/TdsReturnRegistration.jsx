
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, Upload, Calendar, Trash2, Check, FileCheck,
    ArrowLeft, ArrowRight, Zap, Building, Clock,
    Sparkles, AlertCircle, FileBarChart, HardDrive,
    ShieldCheck, Download, ReceiptText, ClipboardList
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitTdsReturn } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const TdsReturnRegistration = ({ initialPlan = 'non_salary', onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(state?.plan || initialPlan);

    const [formData, setFormData] = useState({
        deductorName: user?.name || '',
        tanNumber: '',
        financialYear: '2024-25',
        quarter: 'Q1',
        deductorType: 'Company'
    });

    const [files, setFiles] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const steps = [
        { id: 1, title: 'Form', icon: Zap },
        { id: 2, title: 'Deductor', icon: Building },
        { id: 3, title: 'Timeline', icon: Calendar },
        { id: 4, title: 'Payload', icon: Upload },
        { id: 5, title: 'Finalize', icon: CreditCard }
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
        const requestData = {
            plan: selectedPlan,
            ...formData
        };

        payload.append('data', JSON.stringify(requestData));

        Object.keys(files).forEach(key => {
            payload.append('documents', files[key]);
        });

        try {
            await submitTdsReturn(payload);
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
                        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 rotate-3">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Quarterly TDS filing</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Compliance Protocol v3.2</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors order-last">
                        <Trash2 size={24} />
                    </button>
                </div>

                <div className="flex justify-between relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                    <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-purple-500 -translate-y-1/2 z-0"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></motion.div>

                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= s.id ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-400 shadow-inner'}`}
                            >
                                {currentStep > s.id ? <Check size={18} /> : <s.icon size={18} />}
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-purple-700' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM AREA */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-poppins">
                <AnimatePresence mode="wait">
                    {/* STEP 1: FORM TYPE */}
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <div className="bg-purple-50 border border-purple-100 p-8 rounded-[40px] flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-purple-950 italic tracking-tighter uppercase">Statutory Matrix</h3>
                                    <p className="text-purple-700/60 font-medium text-sm tracking-wide">Select the TDS form applicable to this quarter.</p>
                                </div>
                                <Zap className="text-purple-500 animate-pulse" size={40} />
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 text-left">
                                {[
                                    { id: 'salary', name: 'Salary (24Q)', price: '999', features: ["Employer deduction", "Employee data audit"] },
                                    { id: 'non_salary', name: 'Non-Salary (26Q)', price: '1499', features: ["Vendor payments", "Rent/Profs."] },
                                    { id: 'nri', name: 'NRI (27Q)', price: '2499', features: ["Foreign Remittance", "DTAA Rate Audit"] }
                                ].map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPlan(p.id)}
                                        className={`p-10 rounded-[45px] border-4 transition-all cursor-pointer relative overflow-hidden group ${selectedPlan === p.id ? 'border-purple-500 bg-purple-50 shadow-2xl scale-105' : 'border-slate-100 hover:border-purple-200'}`}
                                    >
                                        {selectedPlan === p.id && <div className="absolute top-0 right-0 bg-purple-500 text-white p-3 rounded-bl-3xl"><CheckCircle size={20} /></div>}
                                        <h4 className={`text-xl font-black mb-1 uppercase italic ${selectedPlan === p.id ? 'text-purple-900' : 'text-slate-400'}`}>{p.name}</h4>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-4xl font-black">₹{p.price}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/ QUARTER</span>
                                        </div>
                                        <div className="space-y-3">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><Check size={14} className="text-purple-500" /> {f}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DEDUCTOR */}
                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-purple-500 pl-6">Deductor Profile</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Legal Deductor Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500" size={24} />
                                        <input
                                            name="deductorName"
                                            value={formData.deductorName}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="Company or Individual Name"
                                            className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] font-black focus:border-purple-500 transition-all text-2xl tracking-widest uppercase italic shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">TAN Number (10 Digits)</label>
                                    <div className="relative">
                                        <ReceiptText className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-500" size={20} />
                                        <input
                                            name="tanNumber"
                                            value={formData.tanNumber}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="ABCD12345E"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-purple-500 transition-all text-xl italic uppercase tracking-widest font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Entity Type</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-500" size={20} />
                                        <select
                                            name="deductorType"
                                            value={formData.deductorType}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-purple-500 transition-all text-lg tracking-tight uppercase appearance-none"
                                        >
                                            <option value="Company">Pvt Ltd / Ltd Company</option>
                                            <option value="Firm">Partnership / LLP</option>
                                            <option value="Individual">Individual / Proprietor</option>
                                            <option value="Trust">Trust / NGO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: TIMELINE */}
                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-purple-500 pl-6">Statutory Timeline</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Financial Year</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-500" size={20} />
                                        <select
                                            name="financialYear"
                                            value={formData.financialYear}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-purple-500 transition-all text-lg tracking-tight appearance-none italic"
                                        >
                                            <option value="2024-25">2024-2025</option>
                                            <option value="2023-24">2023-2024</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Filing Quarter</label>
                                    <div className="relative">
                                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-500" size={20} />
                                        <select
                                            name="quarter"
                                            value={formData.quarter}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black focus:border-purple-500 transition-all text-lg tracking-tight uppercase appearance-none italic"
                                        >
                                            <option value="Q1">Q1 (Apr-Jun)</option>
                                            <option value="Q2">Q2 (Jul-Sep)</option>
                                            <option value="Q3">Q3 (Oct-Dec)</option>
                                            <option value="Q4">Q4 (Jan-Mar)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: PAYLOAD */}
                    {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-purple-500 pl-6 text-left">Filing Payload</h3>

                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                {[
                                    { label: 'Payment / Deductee List (XLS)', key: 'deductee_data' },
                                    { label: 'Paid Challan Copies (Zip/PDF)', key: 'challan_proof' },
                                    { label: 'Previous Ack. (Optional)', key: 'prev_ack' },
                                    { label: 'Auth Signatory Identity', key: 'auth_id' }
                                ].map((doc, i) => (
                                    <div key={i} className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative ${files[doc.key] ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{doc.label}</h4>
                                            {files[doc.key] && <CheckCircle className="text-purple-600 animate-bounce" size={20} />}
                                        </div>
                                        <input type="file" id={doc.key} className="hidden" onChange={(e) => handleFileUpload(e, doc.key)} />
                                        <label htmlFor={doc.key} className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                            <Upload size={20} className="text-purple-500" />
                                            {files[doc.key] ? files[doc.key].name.substring(0, 20) + '...' : 'Upload Data/File'}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: FINALIZE */}
                    {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 1 }} className="space-y-10 text-center">
                            <div className="space-y-4 font-poppins text-navy">
                                <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-[40px] flex items-center justify-center mx-auto -rotate-12 mb-8 shadow-xl border border-purple-200">
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-5xl font-black italic tracking-tighter uppercase">TDS Authorization</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em]">Validation sequence ready</p>
                            </div>

                            <div className="bg-navy rounded-[60px] p-12 text-white relative overflow-hidden group shadow-6xl text-left">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                    <ClipboardList size={200} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 relative z-10 font-poppins">
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Deductor TAN</p>
                                            <p className="text-4xl font-black italic tracking-tighter uppercase font-mono">{formData.tanNumber || 'XXXXXXXXXX'}</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Filing Target</p>
                                            <p className="text-2xl font-black italic uppercase tracking-tighter">{formData.quarter} | FY {formData.financialYear}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-3xl rounded-[40px] p-10 flex flex-col justify-center border border-white/10">
                                        <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">Service Fee (Quarterly)</p>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-7xl font-black italic tracking-tighter">₹{selectedPlan === 'salary' ? '999' : selectedPlan === 'non_salary' ? '1,499' : '2,499'}</span>
                                            <span className="text-purple-300 font-bold text-xl">+ GST</span>
                                        </div>
                                        <div className="w-full h-px bg-white/20 mb-6"></div>
                                        <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest italic">Includes portal submission & receipt.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS */}
                    {currentStep === 6 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10">
                            <div className="w-32 h-32 bg-purple-600 rounded-[50px] flex items-center justify-center mx-auto text-white shadow-3xl shadow-purple-500/40 rotate-12">
                                <Check size={64} strokeWidth={4} />
                            </div>
                            <div className="space-y-4 font-poppins">
                                <h3 className="text-6xl font-black italic tracking-tighter uppercase text-navy">Transmission Sent</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.5em] max-w-md mx-auto">Your TDS return data has been successfully transmitted for portal synchronization.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-purple-600 transition-all shadow-4xl">Enter Dashboard</button>
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
                        className="flex items-center gap-6 px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-purple-600 transition-all shadow-2xl group"
                    >
                        {currentStep === 5 ? 'Authorize & Transmit' : 'Next Stage'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TdsReturnRegistration;
