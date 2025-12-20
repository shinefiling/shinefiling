import Section8Registration from './Section8Registration';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, ChevronRight, User, Heart, Building, Scale, Globe, ArrowRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Section8Page = ({ isLoggedIn, onLogout }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is a Section 8 Company?", a: "It is a company established for charitable objects like art, science, sports, education, research, social welfare, religion, charity, protection of environment etc. Profits cannot be paid as dividends." },
        { q: "Is it different from a Trust/Society?", a: "Yes. A Section 8 Company is registered under MCA (Central Govt) and has better recognition, transparency, and ease of receiving foreign funds (FCRA) compared to Trusts/Societies." },
        { q: "Does it require minimum capital?", a: "No, there is no minimum paid-up capital requirement for a Section 8 Company." },
        { q: "What is 12A and 80G?", a: "12A registration exempts the NGO's income from income tax. 80G registration allows donors to claim tax deductions on their donations." },
        { q: "Can I pay salaries to directors?", a: "Directors usually provide services honorarily. However, salaries can be paid to employees. Reasonable reimbursement of expenses to directors is allowed." },
        { q: "How long does registration take?", a: "It typically takes 15-20 days, as it involves an additional step of obtaining the Central Govt License (INC-12) before incorporation." },
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
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
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
                                    <Star size={12} className="fill-bronze" /> India's #1 Registration Platform
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Section 8 NGO <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Company Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Dedicated to social welfare. Start your Non-Profit Organization (NPO) with official recognition.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Time</p>
                                        <p className="font-bold text-sm text-white">20-30 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trusted By</p>
                                        <p className="font-bold text-sm text-white">50k+ Founders</p>
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
                                    Get Started Now
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
                                    <h3 className="text-navy font-bold text-xl mb-2">Standard Package</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹14,999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹25,000</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees as applicable</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {/* Default features - can be enhanced if data points exist */}
                                    {[
                                        "DSC & DIN Included",
                                        "Name Approval",
                                        "Govt Registration Filing",
                                        "Certificate of Incorporation",
                                        "PAN & TAN Allocation",
                                        "Bank Account Support"
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
                                    Start Registration <ArrowRight size={18} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
                                    100% Online process • No hidden charges
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                <div className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Heart className="text-rose-600" /> Why Section 8 Company?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Section 8 Company</strong> is the most reliable way to run an NGO in India. Unlike Trusts or Societies, it is regulated by MCA, giving it high credibility with donors and government bodies.
                            </p>
                            <p>
                                It is eligible for all tax exemptions (12A & 80G) and Foreign Contribution Registration (FCRA). It is the preferred structure for Corporate Social Responsibility (CSR) funding.
                            </p>
                        </div>
                    </section>

                    {/* Benefits Grid */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Key Benefits</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Tax Exemptions", desc: "Eligible for 100% tax exemption on surplus income under 12A.", icon: Shield },
                                { title: "Donor Benefits", desc: "Donors get 50% tax deduction on donations under Section 80G.", icon: Gift },
                                { title: "Credibility", desc: "High trust factor among corporate donors and foreign entities due to strict compliance.", icon: Star },
                                { title: "Limited Liability", desc: "Founders/Members have limited liability, protecting personal assets.", icon: Scale },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 transition">
                                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                                        {benefit.icon && <benefit.icon size={28} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy mb-2 text-lg">{benefit.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PRICING PLANS */}
                    <section id="pricing-section" className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-navy">Choose Your Plan</h2>
                            <p className="text-slate-500 mt-3">Comprehensive packages for your social mission.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Basic */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-navy mb-2">Basic</h3>
                                <div className="text-3xl font-bold text-navy mb-1">₹7,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["License Application (INC-12)", "Incorporation Certificate", "MOA & AOA Drafting", "PAN & TAN"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                                            <CheckCircle size={16} className="text-bronze shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-[#2B3446] hover:text-white transition">Select Basic</button>
                            </div>

                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-8 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Recommended</div>
                                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                                <div className="text-3xl font-bold text-white mb-1">₹14,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Basic", "12A & 80G Prep", "Section 8 License", "CSR Guidance", "Bank Support"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                                            <CheckCircle size={16} className="text-rose-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-rose-500/50 transition">Choose Standard</button>
                            </div>

                            {/* Premium */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-navy mb-2">Premium</h3>
                                <div className="text-3xl font-bold text-navy mb-1">₹24,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Standard", "12A & 80G Filing", "NGO Darpan", "CSR-1 Registration", "Compliance (1Y)"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                                            <CheckCircle size={16} className="text-bronze shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-[#2B3446] hover:text-white transition">Select Premium</button>
                            </div>
                        </div>

                    </section>

                    {/* DETAILED PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Comprehensive Registration Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "DSC & Name", days: "Day 1-3", desc: "DSC for directors and Name Approval (must include Foundation, etc.)." },
                                { step: "Step 2", title: "License Application", days: "Day 4-10", desc: "Applying for Central Govt License (INC-12) for Section 8 status." },
                                { step: "Step 3", title: "Incorporation", days: "Day 11-20", desc: "Filing SPICe+ form after license approval." },
                                { step: "Step 4", title: "PAN & TAN", days: "Day 21-25", desc: "Allocation of PAN and TAN." },
                                { step: "Step 5", title: "12A & 80G", days: "Post-Inc", desc: "Applying for tax exemption (separate process)." }
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

                    {/* MANDATORY COMPLIANCES SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Mandatory Annual Compliances</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Keep your business active and penalty-free with these filings.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Auditor Appointment (ADT-1)", due: "Within 30 days of Inc", type: "One Time" },
                                    { name: "Commencement of Business (INC-20A)", due: "Within 180 days of Inc", type: "One Time" },
                                    { name: "Income Tax Return (ITR-6)", due: "30th September", type: "Annual" },
                                    { name: "Financial Statements (AOC-4)", due: "30 days from AGM", type: "Annual" },
                                    { name: "Annual Return (MGT-7)", due: "60 days from AGM", type: "Annual" },
                                    { name: "Director KYC (DIR-3 KYC)", due: "30th September", type: "Annual" }
                                ].map((row, i) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 transition">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-navy text-lg">{row.name}</h4>
                                        </div>
                                        <div className="md:w-1/3 mt-2 md:mt-0">
                                            <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Due Date</span>
                                            <p className="text-bronze-dark font-semibold">{row.due}</p>
                                        </div>
                                        <div className="md:w-1/6 mt-2 md:mt-0 text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${row.type === 'Annual' ? 'bg-blue-50 text-navy' : 'bg-beige/30 text-bronze-dark'}`}>
                                                {row.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQs */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <Shield className="text-rose-600" /> Frequently Asked Questions
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

                {/* SIDEBAR */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-rose-600" /> Documents Required
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Directors</h4>
                                    <ul className="space-y-3">
                                        {["PAN Card", "Aadhaar Card", "Voter ID / Passport", "Photo"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Office & Others</h4>
                                    <ul className="space-y-3">
                                        {["Electricity Bill", "NOC from Owner", "Objective Declaration"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                            <Section8Registration isLoggedIn={isLoggedIn} isModal={true} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Simple Gift Icon component since it was missing from Lucide imports in thought, or just use Heart
const Gift = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.906 4.906 0 0 1 4.5 5 2.5 2.5 0 0 1 0 5"></path></svg>
);

export default Section8Page;

