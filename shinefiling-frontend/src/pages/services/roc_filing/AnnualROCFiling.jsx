import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, BookOpen, AlertCircle, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnualROCFilingPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is Annual Filing?", a: "Every company must file annual accounts and annual returns with the ROC every year within 30 days/60 days of the AGM." },
        { q: "What forms are filed?", a: "Form AOC-4 (Financial Statements) and Form MGT-7/7A (Annual Return) are the primary forms." },
        { q: "What is the penalty for delay?", a: "The penalty is ?100 per day per form. This applies to both the company and directors." },
        { q: "Is it mandatory for inactive companies?", a: "Yes, even if there is no business, annual compliances are mandatory unless the company has filed for dormancy." },
        { q: "What is the AGM due date?", a: "The AGM must be held within 6 months from the end of the financial year (i.e., by 30th September)." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/roc-filing/annual-return/register?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const applicableEntities = [
        { name: "Private Limited", icon: Building },
        { name: "OPC (One Person)", icon: Users },
        { name: "Public Limited", icon: Building },
        { name: "Section 8 Company", icon: Scale }
    ];

    const dueDates = [
        { type: "AOC-4", due: "30 Days from AGM" },
        { type: "MGT-7 / 7A", due: "60 Days from AGM" },
        { type: "OPC AOC-4", due: "180 Days from FY End" }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070"
                        alt="Corporate Background"
                        className="w-full h-full object-cover"
                    />
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

                        {/* Hero Content - Left Aligned */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Star size={12} className="fill-bronze" /> Statutory Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Annual ROC <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Company Filing</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    File AOC-4 and MGT-7 on time. Avoid heavy daily penalties and director disqualification. Expert assisted filing for Pvt Ltd & OPC.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Due Date</p>
                                        <p className="font-bold text-sm text-white">30 Days of AGM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Penalty</p>
                                        <p className="font-bold text-sm text-white">?100 / Day</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    File Annual Return
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
                                </button>
                            </motion.div>
                        </div>

                        {/* Pricing Card - Floating Glass Effect */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                {/* Top Gold Line */}
                                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                                <div className="absolute top-3 right-0 bg-[#043E52] text-white text-[10px] font-bold px-4 py-1.5 rounded-l-full uppercase tracking-wider z-10 shadow-md">Best Value</div>

                                <div className="text-center mb-6 mt-4">
                                    <h3 className="text-navy font-bold text-xl mb-2">Standard Plan</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">?6,999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">?12,000</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees</p>
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {[
                                        "Form AOC-4 Filing (Financials)",
                                        "Form MGT-7/7A Filing (Return)",
                                        "Director Report Preparation",
                                        "Auditor Coordination",
                                        "Error-Free Support"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >View Plans <ArrowRight size={18} /></button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
                                    100% Online process • No hidden charges
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* --- PRICING SECTION (3 PLANS) --- */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Peace of Mind</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Compliance Packages</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {applicableEntities.map((ent, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-slate-200 rounded-full shadow-sm">
                                <ent.icon size={12} className="text-bronze" />
                                <span className="text-[10px] font-black uppercase text-navy/70 tracking-widest">{ent.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Basic */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Basic</h3>
                            <p className="text-slate-500 text-sm mb-6">Essential filing.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?3,999</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">+ Govt Fees</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "AOC-4 & MGT-7/7A",
                                    "MCA Manual Upload",
                                    "SRN Receipt Generation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Choose Basic
                            </button>
                        </motion.div>

                        {/* Standard */}
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
                            <p className="text-gray-400 text-sm mb-6">Complete peace of mind.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-white">?6,999</span>
                                <span className="text-gray-500 line-through text-sm">?12,000</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-widest">+ Govt Fees</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Everything in Basic",
                                    "Director's Report Prep",
                                    "Auditor Coordination",
                                    "CS Error-Free Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Empower Standard
                            </button>
                        </motion.div>

                        {/* Premium */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Premium</h3>
                            <p className="text-slate-500 text-sm mb-6">Full year compliance.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?11,999</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">+ Govt Fees</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Everything in Standard",
                                    "AGM Notice & Minutes",
                                    "AGM Compliance Support",
                                    "1-Year Compliance Calendar"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Select Premium
                            </button>
                        </motion.div>
                    </div>

                    {/* DUE DATES TRACKER */}
                    <div className="mt-16 bg-bronze/5 rounded-[45px] p-10 border border-bronze/10">
                        <h3 className="text-lg font-black text-navy uppercase tracking-widest mb-8 flex items-center gap-3 italic">
                            <Clock size={24} className="text-bronze" /> Statutory Timeline Tracker
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {dueDates.map((date, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-bronze/30 transition-all">
                                    <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{date.type}</p>
                                    <p className="text-lg font-black text-navy group-hover:text-bronze transition-colors tracking-tight italic">{date.due}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* DETAILED SEO CONTENT SECTION - COMPREHENSIVE GUIDE */}
                    <section className="mt-10 space-y-12 mb-20">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Annual RoC Filing</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen size={20} className="text-bronze" /> What is Annual Filing?
                                    </h3>
                                    <p className="lead text-lg font-medium">
                                        Filing Annual Returns with ROC (MCA) is mandatory for every registered company. It involves submitting audited financial statements (AOC-4) and the Annual Return (MGT-7).
                                    </p>
                                    <p>
                                        Maintaining compliance is crucial not just to avoid penalties but to maintain the 'Active' status of the company and ensure Directors do not get disqualified.
                                    </p>
                                </div>

                                {/* Understanding Forms */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-navy mb-4">Understanding ROC Forms</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { title: "Form AOC-4", desc: "For Financial Statements. Contains Balance Sheet, P&L Account, and Director's Report. Due: 30 days of AGM.", icon: FileText },
                                            { title: "Form MGT-7", desc: "For Annual Return. Contains details of shareholders, directors, and shareholding pattern. Due: 60 days of AGM.", icon: Users },
                                            { title: "Form ADT-1", desc: "For Auditor Appointment. If a new auditor is appointed in the AGM, this form must be filed within 15 days.", icon: UserCheck },
                                            { title: "Form MGT-14", desc: "For Board Resolutions. Required for approving financial statements and Board Reports effectively.", icon: Scale },
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="mt-1"><benefit.icon size={20} className="text-bronze" /></div>
                                                <div>
                                                    <h4 className="font-bold text-navy text-sm">{benefit.title}</h4>
                                                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Process Timeline */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">Filing Process</h3>
                                    <div className="space-y-6">
                                        {[
                                            { step: "Step 1", title: "Document Collection", days: "Day 1", desc: "We collect audited financial statements and bank records." },
                                            { step: "Step 2", title: "Review & Drafting", days: "Day 2-3", desc: "Our team drafts the Director's Report, MGT-9, and necessary Resolutions." },
                                            { step: "Step 3", title: "Certification", days: "Day 3", desc: "Documents are verified and certified by our CA/CS." },
                                            { step: "Step 4", title: "MCA Filing", days: "Day 4", desc: "Forms AOC-4 & MGT-7 are uploaded to the MCA portal." },
                                            { step: "Step 5", title: "Approval", days: "Day 5", desc: "SRN is generated upon successful payment and approval." }
                                        ].map((item, i) => (
                                            <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                                <div className="flex-shrink-0 w-full md:w-48 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated</span>
                                                    <span className="text-navy font-bold text-lg">{item.days}</span>
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
                                </div>

                                {/* Penalty Warning */}
                                <div className="bg-red-50 border border-red-100 rounded-3xl p-8">
                                    <h3 className="text-2xl font-bold text-navy mb-2 flex items-center gap-2"><AlertCircle className="text-red-500" /> Consequences of Late Filing</h3>
                                    <p className="text-gray-700 leading-relaxed max-w-2xl mb-4">
                                        The Ministry of Corporate Affairs has introduced strict penalties for delay in filing annual returns.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-red-700 font-bold">
                                            <X size={16} /> ?100 Per Day Per Form (No Upper Limit)
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Accumulates separately for AOC-4 and MGT-7
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Director Disqualification (for non-filing 3 years)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MANDATORY DELIVERABLES */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official documents you get after successful filing.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Form AOC-4 Receipt", type: "SRN Challan", due: "Immediate" },
                                    { name: "Form MGT-7 Receipt", type: "SRN Challan", due: "Immediate" },
                                    { name: "Director's Report", type: "Drafted PDF", due: "2-3 Days" },
                                    { name: "Annual Return Set", type: "Effectively Filed", due: "Compliant" },
                                    { name: "Support for Queries", type: "Expert Support", due: "Lifetime" }
                                ].map((row, i) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 transition">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-navy text-lg">{row.name}</h4>
                                        </div>
                                        <div className="md:w-1/3 mt-2 md:mt-0">
                                            <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Format</span>
                                            <p className="text-bronze-dark font-semibold">{row.due}</p>
                                        </div>
                                        <div className="md:w-1/6 mt-2 md:mt-0 text-right">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-navy">
                                                {row.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ SECTION */}
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

                        {/* Checklist Sidebar */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Checklist
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Audited Financial Statements</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Directors' Report</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Audit Report in Form 3CA/3CB</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Notice of AGM</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> MGT-14 (If applicable)</li>
                            </ul>
                            <div className="mt-6 bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                                You can upload these in the client dashboard after payment.
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Our experts are available 24/7 to guide you through the process.</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Call Us</p>
                                    <p className="font-bold">+91 98765 43210</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnnualROCFilingPage;


