import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, FileText, Rocket, Briefcase, Users, Shield, Award, HelpCircle, ChevronRight, BookOpen, AlertCircle, RefreshCw, PenTool, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CompanyNameChangePage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Can we change company name anytime?", a: "Yes, a company name can be changed at any time by passing a special resolution and obtaining approval from the ROC." },
        { q: "What is the process?", a: "1. RUN Name Approval -> 2. MGT-14 (EGM Resolution) -> 3. INC-24 (Central Govt Approval)." },
        { q: "Is name availability check required?", a: "Yes, a fresh check is required using the 'RUN' (Reserve Unique Name) facility. The new name must not be similar to existing companies/trademarks." },
        { q: "Time required?", a: "Approx 15-20 days. Name approval takes 2-3 days, EGM Notice period is 7-21 days, and INC-24 approval takes 1-2 weeks." },
        { q: "Do we need to change PAN/Bank?", a: "Yes! After getting the new Certificate of Incorporation, you MUST update PAN, GST, Bank Accounts, and all other licenses." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/roc-filing/company-name-change/register?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070"
                        alt="Creative Branding"
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
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Rocket size={12} className="fill-bronze" /> Rebrand Your Business
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Change Company <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Name</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    A new identity for a new vision. We manage the entire legal process of changing your company name, from availability checks to final certification.
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
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Identity</p>
                                        <p className="font-bold text-sm text-white">New COI</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">2-3 Weeks</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Rebranding
                                </button>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                {/* Top Gold Line */}
                                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                                <div className="absolute top-3 right-0 bg-[#043E52] text-white text-[10px] font-bold px-4 py-1.5 rounded-l-full uppercase tracking-wider z-10 shadow-md">Complete</div>

                                <div className="text-center mb-6 mt-4">
                                    <h3 className="text-navy font-bold text-xl mb-2">Standard Plan</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹5,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">+ Govt Fees</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">End to End Filing</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["RUN Name Search & Approval", "MGT-14 Filing (Resolutions)", "INC-24 Filing (Approvals)", "Fresh COI Issuance", "New MOA & AOA"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('standard')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Change Name <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- PRICING SECTION (3 PLANS) --- */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Plan</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Simple Pricing</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Consultation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Consultation</h3>
                            <div className="text-4xl font-black text-navy mb-2">Free</div>
                            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-wide">Initial Advice</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Name Availability</li>
                                <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Trademark Check</li>
                            </ul>
                            <button onClick={() => window.open('tel:+919999999999', '_self')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Check Name
                            </button>
                        </motion.div>

                        {/* Standard - Most Popular */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-6 z-10 flex flex-col h-full"
                        >
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 mt-4">Standard</h3>
                            <div className="text-4xl font-black text-white mb-2">₹5,999</div>
                            <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-wide">+ Govt Fees</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> RUN Application</li>
                                <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> MGT-14 & INC-24</li>
                                <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> New COI</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Select Standard
                            </button>
                        </motion.div>

                        {/* Premium */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Premium</h3>
                            <div className="text-4xl font-black text-navy mb-2">₹8,999</div>
                            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-wide">+ Govt Fees</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Name Change Service</li>
                                <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> PAN/TAN Update</li>
                                <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> GST Update</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Select Premium
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    {/* DETAILED SEO CONTENT SECTION - COMPREHENSIVE GUIDE */}
                    <section className="mt-10 space-y-12 mb-20">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Name Change</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">

                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen className="text-bronze" /> New Name, New Beginnings
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        Changing a company name is a significant legal process. While the identity changes, the legal entity remains the same—meaning all assets, liabilities, and agreements continue to exist, though they may need updating.
                                    </p>
                                    <p>
                                        The process is governed by Section 13 of the Companies Act, 2013, and requires approval from both shareholders (via Special Resolution) and the Central Government.
                                    </p>
                                </div>

                                {/* Process Steps */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">Step-by-Step Process</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { title: "Phase 1: Name Approval", steps: ["Run a trademark search.", "File 'RUN' application on MCA.", "Get ROC approval letter."], icon: Rocket },
                                            { title: "Phase 2: Internal Approval", steps: ["Call Board Meeting.", "Call EGM (Shareholders).", "Pass Special Resolution."], icon: Users },
                                            { title: "Phase 3: ROC Filing", steps: ["File MGT-14 (Resolutions).", "File INC-24 (Central Govt Application).", "Pay Govt Fees."], icon: FileText },
                                            { title: "Phase 4: Post Approval", steps: ["Receive new Certificate of Incorporation.", "Update PAN, GST, Bank.", "Update Letterheads & Seals."], icon: RefreshCw },
                                        ].map((phase, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center">
                                                        <phase.icon size={20} />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-navy">{phase.title}</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {phase.steps.map((step, j) => (
                                                        <li key={j} className="flex gap-2 text-sm text-gray-600">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5 shrink-0"></div>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Post Change Checklist */}
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <AlertCircle className="text-blue-600" /> Mandatory Updates After Name Change
                                    </h3>
                                    <p className="text-gray-700 mb-6">Once the new Certificate of Incorporation (COI) is issued, you must update the new name in:</p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {["PAN & TAN Cards", "GST Registration", "Bank Accounts", "Shops & Establishment", "EPF & ESI Records", "Vendor Contracts", "Company Seal & Letterheads", "Website & Domain"].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100">
                                                <CheckCircle size={16} className="text-blue-500" />
                                                <span className="text-sm font-bold text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MANDATORY DELIVERABLES */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official documents confirming your new success.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Name Approval Letter", type: "ROC Letter", due: "Day 3" },
                                    { name: "New COI", type: "Certificate", due: "Day 15" },
                                    { name: "Altered MOA/AOA", type: "Legal Doc", due: "Day 10" },
                                    { name: "MGT-14 Receipt", type: "Filing Proof", due: "Day 7" },
                                    { name: "INC-24 Receipt", type: "Govt Receipt", due: "Day 12" }
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

                    {/* WHY CHOOSE SHINEFILING - SEO SECTION */}
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl mb-20">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling for Rebranding?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Rocket size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Smart Name Search</h4>
                                        <p className="text-gray-300 text-sm">We perform deep checks against MCA and User Trademark databases to ensure your name is approved.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Hassle-Free Filing</h4>
                                        <p className="text-gray-300 text-sm">We handle RUN, MGT-14, and INC-24 seamlessly so you don't have to deal with complex forms.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <RefreshCw size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Post-Change Support</h4>
                                        <p className="text-gray-300 text-sm">We guide you on updating PAN, GST, and Bank info after the name change is certified.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">99% Success Rate</h4>
                                        <p className="text-gray-300 text-sm">Our expertise in crafting 'Significance of Name' ensures minimal rejections from ROC.</p>
                                    </div>
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

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Proposed Names</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> 1-2 Unique Name Options</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Significance of New Name</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Business Activity Description</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Finding a unique name is hard. We can help.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CompanyNameChangePage;
