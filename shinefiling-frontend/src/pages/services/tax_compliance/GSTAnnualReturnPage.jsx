
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Star, Shield, Users, Landmark, Globe, FileCheck, Check, X, Calendar, Zap, Clock, Award, ShieldCheck, Sparkles, ChevronDown, Search, Briefcase, CreditCard, Layers, ClipboardCheck, History, HelpCircle, FileBarChart, HardDrive, FileText, Banknote, Handshake
} from 'lucide-react';
import GSTAnnualReturnRegistration from './GSTAnnualReturnRegistration';

const GSTAnnualReturnPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is GSTR-9?", a: "GSTR-9 is an annual return to be filed by all registered taxpayers. It consists of details regarding outward and inward supplies made/received during the financial year." },
        { q: "What is GSTR-9C?", a: "GSTR-9C is a reconciliation statement between the audited annual financial statements and the GSTR-9, mandatory for taxpayers with turnover above ₹5 Crore." },
        { q: "What is the turnover limit for GSTR-9?", a: "Filing GSTR-9 is optional for taxpayers with turnover up to ₹2 Crore, but it is highly recommended for record accuracy and preventing future notices." },
        { q: "Are there penalties for missing it?", a: "Yes, a late fee of ₹200 per day (₹100 for CGST + ₹100 for SGST) is applicable, subject to a maximum of 0.5% of turnover." },
        { q: "What data is needed for filing?", a: "You need GSTR-1 & 3B summaries, purchase registers, audited balance sheets, and details of ITC claimed vs utilized." },
        { q: "Can GSTR-9 be revised?", a: "No, GSTR-9 cannot be revised once filed. This makes professional assistant critical to ensure 100% accuracy before submission." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegisterModal(true);
        } else {
            navigate('/login', { state: { from: window.location.pathname } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Audit & Finance"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>

                    {/* Animated Blob */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-20 -right-20 w-96 h-96 bg-bronze/20 rounded-full blur-3xl mix-blend-overlay"
                    />
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

                        {/* Hero Content - Left Aligned */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <ClipboardCheck size={12} className="fill-bronze" /> Fiscal Consolidation
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Annual <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Return Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Strategic <strong className="text-white font-semibold">GSTR-9 & 9C</strong> reconciliation. Safeguard your business from department audits with <strong className="text-white font-semibold">100% Data Integrity</strong>.
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
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Timeline</p>
                                        <p className="font-bold text-sm text-white">Annual Cycle</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                        <p className="font-bold text-sm text-white">100% Secured</p>
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
                                    Start Annual Filing
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Filing Guide
                                </button>
                            </motion.div>
                        </div>

                        {/* Hero Floating Card */}
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">G S T Annual Return</p>
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
                                        "GSTR-9 Annual Filing",
                                        "Sale & Purchase Reconciliation",
                                        "ITC Mismatch Analysis"
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
            <section id="pricing-section" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Path</span>
                        <h2 className="text-4xl font-bold text-navy mb-4">Transparent Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* BASIC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Basic</h3>
                            <p className="text-slate-500 text-sm mb-6">Turnover &lt; 2CR</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-black text-navy">₹1,499</span>
                                <span className="text-slate-300 line-through text-lg">₹3k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["GSTR-9 Filing (Optional)", "Sales Consolidation", "Input Tax Credit Check", "Filing Acknowledgement"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                ))}
                                <li className="flex gap-3 text-slate-300"><X size={18} /> GSTR-9C Reconciliation</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Basic</button>
                        </motion.div>

                        {/* STANDARD */}
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

                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Turnover &gt; 2CR</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-white">₹2,499</span>
                                <span className="text-gray-500 line-through text-sm">₹5k</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {["Everything in Basic", "Mandatory GSTR-9 Filing", "Detailed Reconciliation", "Tax Liability Re-calc", "Department Review Ready"].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Choose Growth
                            </button>
                        </motion.div>

                        {/* PREMIUM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Corporate</h3>
                            <p className="text-slate-500 text-sm mb-6">Turnover &gt; 5CR</p>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-black text-navy">₹4,999</span>
                                <span className="text-slate-300 line-through text-lg">₹10k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["GSTR-9 + GSTR-9C", "CA Certification (Audit)", "Financial Statement Sync", "Discrepancy Resolution", "Priority Handling"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('enterprise')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Corporate</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 leading-relaxed">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-bronze" /> Why File Annual Returns?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-lg font-medium">
                                Filing your <strong>GSTR-9 Annual Return</strong> is the final opportunity to declare any missed sales or claim unclaimed ITC for the financial year. It serves as a <span className="text-navy font-bold underline decoration-bronze decoration-2">True Compliance Picture</span> of your business.
                            </p>
                            <div className="mt-12 grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Correct Mistakes", desc: "Rectify errors made in monthly GSTR-1/3B filings.", icon: Shield },
                                    { title: "Claim ITC", desc: "Last chance to claim any missed Input Tax Credit for the year.", icon: CreditCard },
                                    { title: "Avoid Litigation", desc: "Match your books with filed returns to prevent department notices.", icon: Zap },
                                    { title: "Refund Processing", desc: "Essential for processing any pending GST refunds.", icon: Layers },
                                ].map((box, i) => (
                                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-bronze/30 transition-all group">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-bronze transition-colors">
                                            <box.icon size={24} />
                                        </div>
                                        <h4 className="font-bold text-lg text-navy mb-2">{box.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{box.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FILING PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Annual Filing Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Data Consolidation", desc: "We aggregate all your GSTR-1 and GSTR-3B filings for the financial year and match them with your books of accounts." },
                                { step: "Step 2", title: "Reconciliation Check", desc: "Our system identifies mismatches in ITC (2A/2B vs Books) and Turnover declared vs Audit financials." },
                                { step: "Step 3", title: "Liability Discharge", desc: "Any short payment of tax found during reconciliation is paid via DRC-03 to avoid future demand notices." },
                                { step: "Step 4", title: "Final Submission", desc: "We draft the GSTR-9 (and 9C if applicable), get your approval, and file it with digital signature." },
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

                    {/* DETAILED CONTENT SECTION */}
                    <section className="space-y-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Understanding GST Annual Compliance (GSTR-9 & 9C)</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">The Importance of Annual Return Filing</h3>
                                    <p>
                                        GSTR-9 is not just another return; it is the <strong>final opportunity</strong> for a taxpayer to rectify any omissions or errors made during the financial year. It consolidates all monthly data and acts as the official record for the department's audit trail. For businesses with turnover &gt; ₹5 Crores, GSTR-9C (Reconciliation Statement) becomes mandatory to bridge the gap between financial books and GST filings.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <FileText size={20} className="text-bronze" /> Critical Reconciliation Points
                                        </h3>
                                        <p className="text-sm mb-4 text-gray-600 font-medium italic">Avoid department notices by matching data.</p>
                                        <ul className="space-y-3 list-disc pl-5 text-sm">
                                            <li><strong>GSTR-1 vs GSTR-3B:</strong> Ensuring all sales reported match the tax paid.</li>
                                            <li><strong>GSTR-3B vs GSTR-2B:</strong> Verifying ITC claimed doesn't exceed available credit.</li>
                                            <li><strong>Books vs GST:</strong> Matching revenue as per Profit & Loss with GST sales.</li>
                                            <li><strong>RCM Liability:</strong> Reporting any missed Reverse Charge Mechanism payments.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <Shield size={20} className="text-bronze" /> Compliance Benefits
                                        </h3>
                                        <p className="text-sm mb-4 text-gray-600 font-medium italic">Why you shouldn't skip the optional GSTR-9.</p>
                                        <ul className="space-y-3 list-disc pl-5 text-sm">
                                            <li><strong>Closure of Books:</strong> Officially closes the financial year for GST.</li>
                                            <li><strong>Correction Window:</strong> Adjust tax liabilities before department scrutiny.</li>
                                            <li><strong>Future-Proofing:</strong> Simplifies data for regular GST audits later on.</li>
                                            <li><strong>Peace of Mind:</strong> Ensures all ITC claimed is legally sustainable.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-bronze/5 p-8 rounded-3xl border border-bronze/10 mt-12">
                                    <h3 className="text-2xl font-bold text-navy mb-6">Key Tables in GSTR-9</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { t: "Table 4", d: "Details of Outward Supplies" },
                                            { t: "Table 6", d: "ITC Availed during the year" },
                                            { t: "Table 8", d: "ITC Reconciliation (GSTR-2A)" },
                                            { t: "Table 10", d: "Previous Year Adjustments" },
                                            { t: "Table 14", d: "Differential Tax Paid" },
                                            { t: "Table 17", d: "HSN Summary of Outward" }
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
                        <h2 className="text-3xl font-bold text-navy mb-8">GSTR-9 vs GSTR-9C</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">GSTR-9 (Annual Return)</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">GSTR-9C (Reconciliation)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Nature", r: "Consolidated Return of Outward/Inward supplies", c: "Reconciliation Statement between GSTR-9 & Audit" },
                                        { f: "Mandatory For", r: "Turnover > ₹2 Crore", c: "Turnover > ₹5 Crore" },
                                        { f: "Certification", r: "Self-Certified", c: "Self-Certified (Previously CA certified)" },
                                        { f: "Focus", r: "Reporting actual data", c: "Explaining differences (if any)" },
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
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl mb-12">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><FileBarChart size={24} /></div>
                                    <div><h4 className="font-bold text-lg">99.9% Accuracy</h4><p className="text-gray-300 text-sm">We use automated tools to match your books with GSTR-2A/2B to ensure zero manual errors.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><ShieldCheck size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Audit Defense</h4><p className="text-gray-300 text-sm">Our 9C certification is backed by detailed working papers, ready to be presented during any departmental audit.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><HardDrive size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Data Retrieval</h4><p className="text-gray-300 text-sm">Lost your monthly data? We fetch entire year's GSTR-1 & 3B data from the portal in one click.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Award size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Expert CA Review</h4><p className="text-gray-300 text-sm">Every Annual Return is reviewed by a Chartered Accountant before final submission.</p></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                        <div className="bg-navy p-8 flex items-center justify-between text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-3"><Clock className="text-bronze" /> Deadlines & Thresholds</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#2B3446]/5 text-slate-500 border-b border-gray-200 uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-8 py-4">Turnover</th>
                                        <th className="px-8 py-4">Forms Required</th>
                                        <th className="px-8 py-4">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Up to ₹2 Crore</td><td className="px-8 py-4 text-navy font-bold">GSTR-9 (Optional)</td><td className="px-8 py-4">31st Dec</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">₹2 Cr - ₹5 Cr</td><td className="px-8 py-4 text-navy font-bold">GSTR-9 (Mandatory)</td><td className="px-8 py-4">31st Dec</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Above ₹5 Crore</td><td className="px-8 py-4 text-navy font-bold">GSTR-9 + 9C (Audit)</td><td className="px-8 py-4">31st Dec</td></tr>
                                    <tr className="bg-orange-50/50"><td className="px-8 py-4 font-bold text-orange-800">Late Fee</td><td className="px-8 py-4 font-bold text-orange-800">Per Day</td><td className="px-8 py-4 font-bold text-orange-800">₹200 / Day</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Expert Insights
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all open:shadow-md">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-navy hover:bg-gray-50 transition-colors list-none select-none">
                                        <span>{faq.q}</span>
                                        <ChevronDown className="group-open:rotate-180 transition-transform text-slate-400" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-gray-100">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Data Checklist
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">FINANCIALS</p>
                                    <ul className="space-y-3">
                                        {["Audited Balance Sheet", "Profit & Loss Account", "Director's Report"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">TAX RECORDS</p>
                                    <ul className="space-y-3">
                                        {["GSTR-1 Yearly Summary", "GSTR-3B Yearly Summary", "ITC Register (2A/2BVSBooks)"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-navy font-bold rounded-xl text-sm transition-colors border border-slate-200">
                                Download Audit Template
                            </button>
                        </div>

                        <div className="bg-navy text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">

                            <h4 className="font-bold text-xl mb-4">Filing Concierge</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Dedicated managers for Annual Return filing and GSTR-9C Certification.</p>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shadow-inner">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Direct Help</p>
                                    <p className="font-bold text-xl text-white">080-FILE-SHINE</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-bronze text-white rounded-xl font-bold text-sm hover:bg-white hover:text-navy transition-all shadow-lg shadow-bronze/20">
                                Consult Filing CA
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                            <div className="absolute top-4 right-4 z-50">
                                <button onClick={() => setShowRegisterModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[95vh]">
                                <GSTAnnualReturnRegistration isLoggedIn={isLoggedIn} planProp={selectedPlan} isModal={true} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GSTAnnualReturnPage;
