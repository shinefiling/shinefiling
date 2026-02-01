import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, ArrowRight, X, Search, Globe, Award, Layers, Banknote, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GstAuditRegistration from './GstAuditRegistration';

const GstAuditPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('reconciliation');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Is GST Audit by CA mandatory?", a: "No, CA Certification for GSTR-9C is removed. It is now self-certified by the taxpayer." },
        { q: "What is GSTR-9C?", a: "It is a Reconciliation Statement reconciling the values declared in GST Returns with the Audited Financial Statements." },
        { q: "When is GSTR-9C applicable?", a: "If your Aggregate Turnover during the financial year exceeds ?5 Crores." },
        { q: "What is Department Audit?", a: "The GST Department can conduct an audit of your records under Section 65. We provide assistance in replying to such audit queries." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/services/gst-audit/register?plan=${plan}`;
            navigate('/login', { state: { from: targetUrl } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">
            <AnimatePresence>
                {showRegistrationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl relative flex flex-col"
                        >
                            <GstAuditRegistration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegistrationModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HERO */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Audit" />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-bronze/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px]"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm"><Shield size={12} className="text-bronze" /> Reconciliation & Audit Assistance</span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Audit & <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">GSTR-9C Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Detailed <strong className="text-white font-semibold">GSTR-9C Reconciliation</strong> of your books with GST returns. Expert assistance for <strong className="text-white font-semibold">Department Audits</strong> and compliance.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-4"
                            >
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Accuracy</p>
                                        <p className="font-bold text-sm text-white">100% Match</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Audit Guard</p>
                                        <p className="font-bold text-sm text-white">Notice Protection</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File GSTR-9C Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Audit Guide
                                </button>
                            </motion.div>
                        </div>

                        {/* Trust Card - Official Registration (Replaces Pricing Card) - WHITE THEME COMPACT */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative shadow-inner">
                                {/* Top Gold Line (Matching other pages) */}
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                                {/* Header - COMPACT */}
                                <div className="flex flex-col items-center justify-center text-center mb-5 mt-2">
                                    <div className="mb-3 relative">
                                        <div className="w-14 h-14 rounded-full bg-bronze/10 flex items-center justify-center">
                                            <Shield size={28} className="text-bronze fill-bronze/20" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle size={14} className="text-green-500 fill-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-navy font-bold text-2xl leading-tight">
                                        Official <br />Registration
                                    </h3>
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Gst Audit</p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 mb-5"></div>

                                {/* Stats Grid - COMPACT */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Left Stat */}
                                    <div className="text-center relative">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Handshake size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">100%</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Process <br />Online</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                                    </div>

                                    {/* Right Stat */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Shield size={14} className="text-bronze" />
                                            <span className="text-navy text-xl font-black tracking-tighter">Legal</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase leading-tight">Protection <br />Assured</p>
                                    </div>
                                </div>

                                {/* Check List - COMPACT */}
                                <div className="space-y-3 mb-6 pl-2">
                                    {[
                                        "GSTR-2A vs Purchase Register",
                                        "Sales Register vs GSTR-1/3B",
                                        "Input Tax Credit Reconciliation"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="bg-green-100 rounded-full p-1 shrink-0">
                                                <CheckCircle size={12} className="text-green-600" strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-700 font-bold text-xs tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button - COMPACT */}
                                <button
                                    onClick={() => handlePlanSelect('startup')}
                                    className="w-full py-3 bg-navy hover:bg-black text-white font-bold text-base rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Registration <ArrowRight size={16} />
                                </button>

                                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                                    Compare all plans below
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Compliance Plans</h2></div>
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: INTERNAL AUDIT / HEALTH CHECK */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Compliance Health</h3>
                            <p className="text-slate-500 text-sm mb-6">Pre-Audit Simulation.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?2,999</span>
                                <span className="text-slate-400 line-through text-lg">?4,999</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Spot Inconsistency Check",
                                    "ITC Reversal Analysis",
                                    "System Gap Identification",
                                    "Corrective Measures Report"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Book Review
                            </button>
                        </motion.div>

                        {/* PLAN 2: GSTR-9C (RECOMMENDED) */}
                        {/* Trust Card - Official Registration (Replaces Pricing Card) - WHITE THEME COMPACT */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full"
                        >
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Gst Audit</h3>
                            <p className="text-gray-400 text-sm mb-6">Comprehensive Solution</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-white">?5,999</span>
                                <span className="text-gray-500 line-through text-sm">?10k</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {["Books vs GST Recon",
                                    "Turnover reconciliation",
                                    "Self-Certification Prep"].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                            <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> {feat}
                                        </li>
                                    ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Get Started
                            </button>
                        </motion.div>

                        {/* PLAN 3: DEPT AUDIT */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Audit Shield</h3>
                            <p className="text-slate-500 text-sm mb-6">Notice & Dept Support.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?9,999</span>
                                <span className="text-slate-400 line-through text-lg">?15,000</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "ADT-01 Notice Reply",
                                    "Officer Representation",
                                    "Adjudication Support",
                                    "Document Compilation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Get Support
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION INSERTED FOR SEO */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> What is GSTR-9C (Reconciliation)?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>GSTR-9C</strong> is a reconciliation statement that reconciles the turnover and tax declared in GST Annual Return (GSTR-9) with the audited financial statements of the taxpayer.
                            </p>
                            <p>
                                It acts as a safety check to ensure that the tax paid as per the GST portal matches the books of accounts. Any difference must be explained with valid reasons, or the differential tax must be paid.
                            </p>
                            <p>
                                Previously, it required certification by a CA/CMA. Now, it is self-certified, but the responsibility of accuracy still lies with the taxpayer. Filing incorrect GSTR-9C often leads to immediate scrutiny.
                            </p>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why Professional Assistance?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Mismatch Analysis", desc: "We identify mismatches between Books vs GSTR-3B vs GSTR-1 vs GSTR-2A line-by-line.", icon: Shield },
                                { title: "ITC Reversal Draft", desc: "If you have claimed excess ITC, we calculate the exact reversal amount with interest to close the liability.", icon: TrendingUp },
                                { title: "Department Notice", desc: "Our 9C filing acts as a strong defense document if you receive an ASMT-10 or DRC-01 notice later.", icon: Scale },
                                { title: "Turnover Mapping", desc: "We map your multi-state turnover (Branch Transfers) correctly to avoid double taxation.", icon: Clock },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-beige transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2B3446]/5 group-hover:bg-[#2B3446] group-hover:text-bronze flex items-center justify-center text-navy flex-shrink-0 transition-all duration-300">
                                        <benefit.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">{benefit.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* AUDIT WORKFLOW SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Department Audit Process (Sec 65)</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Notice (ADT-01)", desc: "Department issues Form GST ADT-01 intimating the commencement of audit. We help you prepare the initial dataset." },
                                { step: "Step 2", title: "Document Submission", desc: "We compile all required ledgers, invoices, and agreements and submit them to the proper officer for verification." },
                                { step: "Step 3", title: "Verification & Query", desc: "The officer verifies records and may raise discrepancies. We provide point-wise explanations to drop the objections." },
                                { step: "Step 4", title: "Final Report (ADT-02)", desc: "Officer issues the Final Audit Report (ADT-02). If any liability remains admitted, we help close it with minimum penalty." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">Action</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-bronze transition-colors flex items-center gap-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* LIABILITY TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Potential Liabilities</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Violation Type</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Penalty / Interest</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Short Payment (Normal)</td>
                                        <td className="p-4 text-gray-600">10% of Tax or ?10,000 (Higher)</td>
                                        <td className="p-4 text-gray-500 text-sm">Bonafide errors</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Fraud / Suppression</td>
                                        <td className="p-4 text-gray-600">100% of Tax Amount</td>
                                        <td className="p-4 text-gray-500 text-sm">Willful evasion (Sec 74)</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Interest on Delay</td>
                                        <td className="p-4 text-gray-600">18% per annum</td>
                                        <td className="p-4 text-gray-500 text-sm">Applicable on Net Liability</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-orange-50 text-orange-800 text-sm border-t border-orange-100 flex gap-2 items-center">
                                <Shield size={16} /> <strong>Note:</strong> Penalties can be waived if tax + interest is paid before the Show Cause Notice.
                            </div>
                        </div>
                    </section>

                    {/* DETAILED CONTENT SECTION */}
                    <section className="space-y-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Understanding GST Audit & Reconciliation (GSTR-9C)</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">Navigating the World of GST Audits</h3>
                                    <p>
                                        A GST Audit involves the examination of records, returns, and other documents maintained by a registered person. The primary objective is to verify the correctness of turnover declared, taxes paid, refund claimed, and <strong className="text-navy">Input Tax Credit</strong> availed. Under the current regime, while CA certification for GSTR-9C has been relaxed, the responsibility of accurate self-certification lies solely with the taxpayer, making reconciliation more critical than ever.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <Search size={20} className="text-bronze" /> Types of GST Audits
                                        </h3>
                                        <ul className="space-y-3 list-disc pl-5 text-sm">
                                            <li><strong>Mandatory Audit (9C):</strong> Required when aggregate turnover exceeds ?5 Crores in a Financial Year.</li>
                                            <li><strong>Departmental Audit (Sec 65):</strong> Conducted by the Commissioner or an officer authorized by him.</li>
                                            <li><strong>Special Audit (Sec 66):</strong> Directed by an Assistant Commissioner if the case is complex.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <Layers size={20} className="text-bronze" /> Key Reconciliation Areas
                                        </h3>
                                        <ul className="space-y-3 list-disc pl-5 text-sm">
                                            <li><strong>Turnover Reconciliation:</strong> Matching Gross Turnover between P&L and GST returns.</li>
                                            <li><strong>Tax Rate Reconciliation:</strong> Verifying if the correct tax percentage was applied to all goods/services.</li>
                                            <li><strong>ITC Matching:</strong> Reconciling ITC in books with GSTR-2A/2B and GSTR-3B filings.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-navy/5 p-8 rounded-3xl border border-navy/10 mt-12">
                                    <h3 className="text-2xl font-bold text-navy mb-6">Common Audit Triggers</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { t: "ITC Mismatch", d: "Difference in ITC claimed vs GSTR-2B" },
                                            { t: "Revenue Gap", d: "Turnover mismatch in ITR and GST" },
                                            { t: "High Exemptions", d: "Reporting huge non-taxable sales" },
                                            { t: "Refund Claims", d: "Frequent or large GST refund applications" },
                                            { t: "Late Filings", d: "Consistent delays in monthly compliance" },
                                            { t: "E-Way Bill", d: "Mismatches in E-way bill vs Invoice data" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                <span className="block font-bold text-bronze text-xs mb-1">{item.t}</span>
                                                <span className="text-sm font-medium text-navy">{item.d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* COMPARISON TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Dept. Audit vs Statutory Audit</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Department Audit (Sec 65)</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Statutory Audit (Sec 35/44)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Conducted By", r: "GST Officers (Commissioner)", c: "Chartered Accountant (CA)" },
                                        { f: "Trigger", r: "Selection by Risk Analysis", c: "Mandatory if Turnover > Threshold" },
                                        { f: "Objective", r: "Finding Revenue Leakage", c: "Certified Reconciliation" },
                                        { f: "Outcome", r: "Demand Order (DRC-07)", c: "Audit Report (GSTR-9C)" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-bold text-navy border-r border-gray-100">{row.f}</td>
                                            <td className="p-4 text-slate-600 border-r border-gray-100">{row.r}</td>
                                            <td className="p-4 text-slate-600">{row.c}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* WHY CHOOSE SHINEFILING */}
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling for Audit?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><FileText size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Working Papers</h4><p className="text-gray-300 text-sm">We provide detailed Excel working papers linking your Balance Sheet to GSTR-9 figures.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Scale size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Detailed Remarks</h4><p className="text-gray-300 text-sm">We add specific auditor remarks for every un-reconciled item to protect you from heavy fines.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Shield size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Notice Handling</h4><p className="text-gray-300 text-sm">Includes 1 Free Reply to any Department Query received regarding this filing.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Users size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Qualified CAs</h4><p className="text-gray-300 text-sm">Your filed return is reviewed by a practicing Chartered Accountant.</p></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQs */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm open:shadow-md transition text-left">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-gray-50 transition select-none">
                                        <span className="pr-4">{faq.q}</span>
                                        <ChevronRight className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT SIDEBAR (4 Cols) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">

                        {/* Documents Sidebar */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Required Documents
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">FINANCIALS</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Audited Balance Sheet</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Profit & Loss Account</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Tax Audit Report (3CA/3CB)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Audit Support</h4>
                            <p className="text-gray-300 text-sm mb-4">Facing a Department Audit? We can represent you.</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Call Team</p>
                                    <p className="font-bold">+91 98765 43210</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GstAuditPage;


