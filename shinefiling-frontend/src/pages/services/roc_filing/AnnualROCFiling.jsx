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
        { q: "What is the penalty for delay?", a: "The penalty is ₹100 per day per form. This applies to both the company and directors." },
        { q: "Is it mandatory for inactive companies?", a: "Yes, even if there is no business, annual compliances are mandatory unless the company has filed for dormancy." },
        { q: "What is the AGM due date?", a: "The AGM must be held within 6 months from the end of the financial year (i.e., by 30th September)." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/roc-filing/annual-return/register?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

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
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
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
                                        <p className="font-bold text-sm text-white">₹100 / Day</p>
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
                                <button className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Best Value</div>

                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Standard Plan</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹6,999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹12,000</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees</p>
                                </div>

                                <div className="space-y-4 mb-8">
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
                                    onClick={() => handlePlanSelect('standard')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Filing <ArrowRight size={18} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
                                    100% Online process • No hidden charges
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div className="lg:col-span-8 space-y-20">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> What is Annual Filing?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Filing Annual Returns with ROC (MCA) is mandatory for every registered company. It involves submitting audited financial statements (AOC-4) and the Annual Return (MGT-7).
                            </p>
                            <p>
                                Maintaining compliance is crucial not just to avoid penalties but to maintain the 'Active' status of the company and ensure Directors do not get disqualified.
                            </p>
                        </div>
                    </section>

                    {/* KEY BENEFITS / FORMS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Understanding ROC Forms</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Form AOC-4", desc: "For Financial Statements. Contains Balance Sheet, P&L Account, and Director's Report. Due: 30 days of AGM.", icon: FileText },
                                { title: "Form MGT-7", desc: "For Annual Return. Contains details of shareholders, directors, and shareholding pattern. Due: 60 days of AGM.", icon: Users },
                                { title: "Form ADT-1", desc: "For Auditor Appointment. If a new auditor is appointed in the AGM, this form must be filed within 15 days.", icon: UserCheck },
                                { title: "Form MGT-14", desc: "For Board Resolutions. Required for approving financial statements and Board Reports effectively.", icon: Scale },
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

                    {/* PROCESS TIMELINE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Filing Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Document Collection", days: "Day 1-2", desc: "We collect your financial statements, bank statements, and other required documents." },
                                { step: "Step 2", title: "Preparation of Forms", days: "Day 3-4", desc: "Our team prepares Form AOC-4, MGT-7, and Director's Report in the prescribed format." },
                                { step: "Step 3", title: "Director's Approval", days: "Day 5", desc: "We send the drafted forms for your review and obtain approval/signatures." },
                                { step: "Step 4", title: "Certification", days: "Day 6", desc: "A CA/CS certifies the forms after thorough verification." },
                                { step: "Step 5", title: "Filing with ROC", days: "Day 7", desc: "We upload the forms to the MCA portal and generate the SRN receipt." }
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
                    </section>

                    {/* PENALTY WARNING (Like Compliance Section) */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Consequences of Late Filing</h2>
                        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                <AlertCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-navy mb-2">Don't Delay!</h3>
                                <p className="text-gray-700 leading-relaxed max-w-2xl">
                                    The Ministry of Corporate Affairs has introduced strict penalties for delay in filing annual returns.
                                </p>
                                <ul className="mt-4 space-y-2">
                                    <li className="flex items-center gap-2 text-red-700 font-bold">
                                        <X size={16} /> ₹100 Per Day Per Form (No Upper Limit)
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
                    </section>

                    {/* PRICING PLANS SECTION (ID to scroll to) */}
                    <section id="pricing-section">
                        <h2 className="text-3xl font-bold text-navy mb-8">Choose Your Plan</h2>
                        {/* We reuse the card style or just a simple grid for alternative plans if needed. 
                            Since Pvt Ltd page focused on one main price card in hero, we can list options here cleanly.
                        */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Basic */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Basic</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹3,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {["AOC-4 Filing", "MGT-7/7A Filing", "MCA Upload", "SRN Receipt"].map((f, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" />{f}</li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Basic</button>
                            </div>

                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                                <div className="text-4xl font-black text-white mb-1">₹6,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {["Everything in Basic", "Director Report Prep", "Auditor Coordination", "Error-Free Support"].map((f, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" />{f}</li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Standard</button>
                            </div>

                            {/* Premium */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Premium</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹11,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {["Everything in Standard", "AGM Compliance Support", "Notice Handling", "Compliance Calendar"].map((f, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" />{f}</li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Premium</button>
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
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Request Callback
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnnualROCFilingPage;
