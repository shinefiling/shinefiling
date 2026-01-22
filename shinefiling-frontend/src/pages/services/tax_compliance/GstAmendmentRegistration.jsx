
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle, CreditCard, FileText,
    User, Upload, Calendar, Trash2, Check, FileCheck,
    ArrowLeft, ArrowRight, Zap, Building, Clock,
    Sparkles, AlertCircle, Edit3, RefreshCw, Layers
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { submitGstAmendment, uploadFile } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const GstAmendmentRegistration = ({ planProp = 'non-core', isModal, onClose }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(state?.plan || planProp);

    const [formData, setFormData] = useState({
        gstin: '',
        businessName: '',
        amendmentType: 'Address Change',
        details: '',
        reason: 'Business Relocation'
    });

    const [files, setFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { id: 1, title: 'Scope', icon: Zap },
        { id: 2, title: 'Business', icon: Building },
        { id: 3, title: 'Changes', icon: Edit3 },
        { id: 4, title: 'Proof', icon: Upload },
        { id: 5, title: 'Submit', icon: CreditCard }
    ];

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileUpload = async (e, docName) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const response = await uploadFile(file, 'gst_docs');
                setFiles(prev => ({
                    ...prev, [docName]: {
                        originalFile: file,
                        name: response.originalName || file.name,
                        fileUrl: response.fileUrl,
                        fileId: response.id
                    }
                }));
            } catch (error) {
                console.error("Upload failed", error);
                alert("File upload failed. Please try again.");
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(files).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const payload = {
                plan: selectedPlan,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            await submitGstAmendment(payload);
            setCurrentStep(6);
        } catch (error) {
            console.error("Submission error", error);
            alert("Submission failed: " + error.message);
        } finally {
            setIsSubmitting(false);
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
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">GST Amendment</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Data Correction Module</p>
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
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-poppins">
                <AnimatePresence mode="wait">
                    {/* STEP 1: PLAN */}
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-amber-900 italic tracking-tighter uppercase">Modification Scope</h3>
                                    <p className="text-amber-700/60 font-medium text-sm tracking-wide">Select the type of change required.</p>
                                </div>
                                <Sparkles className="text-amber-500 animate-pulse" size={40} />
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { id: 'non-core', name: 'Non-Core Field', price: '499', features: ["Email/Mobile Change", "Bank Detail Update"] },
                                    { id: 'core', name: 'Core Field', price: '999', features: ["Address Change", "Business Name Change"] },
                                    { id: 'complex', name: 'Director Change', price: '1499', features: ["Add/Remove Partner", "Constitution Change"] }
                                ].map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPlan(p.id)}
                                        className={`p-10 rounded-[45px] border-4 transition-all cursor-pointer relative overflow-hidden group ${selectedPlan === p.id ? 'border-amber-500 bg-amber-50 shadow-2xl scale-105' : 'border-slate-100 hover:border-amber-200'}`}
                                    >
                                        {selectedPlan === p.id && <div className="absolute top-0 right-0 bg-amber-500 text-white p-3 rounded-bl-3xl"><CheckCircle size={20} /></div>}
                                        <h4 className={`text-xl font-black mb-1 uppercase italic ${selectedPlan === p.id ? 'text-amber-900' : 'text-slate-400'}`}>{p.name}</h4>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-4xl font-black">₹{p.price}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+ Govt Fees</span>
                                        </div>
                                        <div className="space-y-3 font-poppins">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest"><Check size={14} className="text-amber-500" /> {f}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BUSINESS */}
                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6">Entity Identification</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GSTIN</label>
                                    <div className="relative">
                                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={24} />
                                        <input
                                            name="gstin"
                                            value={formData.gstin}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="22AAAAA0000A1Z5"
                                            className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] font-black focus:border-amber-500 transition-all text-2xl tracking-widest uppercase font-mono italic shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Trade Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <input
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="Existing Trade Name"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-amber-500 transition-all text-lg tracking-tight uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: CHANGES */}
                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6">Amendment Details</h3>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Change Type</label>
                                    <div className="relative">
                                        <Edit3 className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                                        <select
                                            name="amendmentType"
                                            value={formData.amendmentType}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-amber-500 transition-all text-lg tracking-tight uppercase appearance-none"
                                        >
                                            <option value="Address Change">Principal Place of Business (Address)</option>
                                            <option value="Trade Name">Trade Name Correction</option>
                                            <option value="Directors">Services / Partners / Directors</option>
                                            <option value="Contact">Mobile / Email (Authorized Signatory)</option>
                                            <option value="Other">Other Non-Core Fields</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Details / Description</label>
                                    <textarea
                                        name="details"
                                        value={formData.details}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Describe the change (e.g., New Address: Flat 101, ...)"
                                        className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] font-bold focus:border-amber-500 transition-all text-lg"
                                    ></textarea>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: PROOF */}
                    {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase border-l-8 border-amber-500 pl-6">Supporting Evidence</h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className={`p-8 rounded-[40px] border-2 border-dashed transition-all relative md:col-span-2 ${files.supporting_doc ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-300'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Main Proof (Rent Deed/Resolution/etc)</h4>
                                        {files.supporting_doc && <CheckCircle className="text-amber-600 animate-bounce" size={20} />}
                                    </div>
                                    <input type="file" id="supporting_doc" className="hidden" onChange={(e) => handleFileUpload(e, 'supporting_doc')} />
                                    <label htmlFor="supporting_doc" className="flex items-center gap-4 cursor-pointer text-navy font-black text-sm uppercase italic">
                                        <Upload size={24} className="text-amber-500" />
                                        {files.supporting_doc ? files.supporting_doc.name : 'Upload Document for Amendment'}
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: SUBMIT */}
                    {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 1 }} className="space-y-10">
                            <div className="text-center space-y-4">
                                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[40px] flex items-center justify-center mx-auto rotate-12 mb-8 shadow-xl">
                                    <RefreshCw size={48} />
                                </div>
                                <h3 className="text-5xl font-black italic tracking-tighter uppercase">Initiate Change</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.3em]">Ready to update GST Portal</p>
                            </div>

                            <div className="bg-navy rounded-[60px] p-12 text-white relative overflow-hidden group shadow-6xl">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                    <Edit3 size={200} />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 relative z-10 font-poppins">
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Amendment Type</p>
                                            <p className="text-3xl font-black italic tracking-tighter uppercase">{formData.amendmentType}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-3xl rounded-[40px] p-10 flex flex-col justify-center border border-white/10">
                                        <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Professional Fee</p>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-7xl font-black italic tracking-tighter">₹{selectedPlan === 'non-core' ? '499' : selectedPlan === 'core' ? '999' : '1,499'}</span>
                                            <span className="text-amber-300 font-bold text-xl">+ GST</span>
                                        </div>
                                        <div className="w-full h-px bg-white/20 mb-6"></div>
                                        <p className="text-[10px] font-medium text-white/60">Effecting within 7-15 days subject to approval.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SUCCESS */}
                    {currentStep === 6 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-10">
                            <div className="w-32 h-32 bg-amber-600 rounded-[50px] flex items-center justify-center mx-auto text-white shadow-3xl shadow-amber-500/40 -rotate-12">
                                <Check size={64} strokeWidth={4} />
                            </div>
                            <div className="space-y-4 font-poppins">
                                <h3 className="text-6xl font-black italic tracking-tighter uppercase text-navy">Update Queued</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.5em] max-w-md mx-auto">Your amendment request has been logged.</p>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-amber-600 transition-all shadow-4xl">Finish</button>
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
                        <ArrowLeft size={18} /> Prev
                    </button>

                    <button
                        onClick={currentStep === 5 ? handleSubmit : nextStep}
                        disabled={isSubmitting}
                        className="flex items-center gap-6 px-12 py-6 bg-navy text-white font-black text-xs uppercase tracking-[0.5em] rounded-[2rem] hover:bg-amber-600 transition-all shadow-2xl group"
                    >
                        {currentStep === 5 ? (isSubmitting ? 'Processing...' : 'Pay & Submit') : 'Next'} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GstAmendmentRegistration;
