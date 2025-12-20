import LlpRegistration from './LlpRegistration';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Building, CheckCircle, ChevronRight, Clock, FileText, Globe, Key, Scale, Shield, Star, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LlpPage = ({ isLoggedIn, onLogout }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is an LLP?", a: "A Limited Liability Partnership (LLP) is a hybrid business structure that combines the flexibility of a partnership with the limited liability benefits of a company." },
        { q: "Minimum requirements for LLP?", a: "You need at least 2 Partners. At least one must be a Resident of India. There is no minimum capital requirement." },
        { q: "LLP vs Private Limited?", a: "LLP has lower compliance costs (no mandatory audit if turnover < 40L). Pvt Ltd is better for raising VC funding. LLP is best for service providers and small businesses." },
        { q: "Is Audit mandatory?", a: "No, audit is not mandatory unless your turnover exceeds ₹40 Lakhs or capital contribution exceeds ₹25 Lakhs." },
        { q: "Can I convert Partnership to LLP?", a: "Yes, you can convert an existing traditional partnership firm into an LLP to get limited liability protection." },
        { q: "What are Designated Partners?", a: "Designated Partners are like Directors in a company. They are responsible for legal compliance. An LLP must have at least 2 Designated Partners." },
        { q: "Taxation for LLP?", a: "LLPs are taxed at a flat rate of 30% (plus surcharge/cess). Partners' salary and interest on capital can be claimed as deductions." }
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
                                    Limited Liability Partnership <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">(LLP) Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    The perfect balance. Protect your personal assets while enjoying the flexibility of a partnership.
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
                                        <p className="font-bold text-sm text-white">12-18 Days</p>
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
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹8,999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹15,000</span>
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
                            <Building className="text-navy" /> Why Choose LLP?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Limited Liability Partnership (LLP)</strong> offers the best of both worlds. You get the protection of a company and the simplicity of a partnership.
                            </p>
                            <p>
                                Unlike a traditional partnership where your personal assets are at risk if the business fails, in an LLP, your liability is limited only to your contribution. This means your house, car, and personal savings are safe.
                            </p>
                        </div>
                    </section>

                    {/* Benefits Grid */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Key Benefits</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Limited Liability", desc: "Partners are not personally liable for the debts of the LLP. Your risk is limited.", icon: Shield },
                                { title: "Separate Legal Entity", desc: "The LLP can own property, sue, and be sued in its own name, distinct from partners.", icon: Building },
                                { title: "No Minimum Capital", desc: "You can start an LLP with any amount of capital. There is no minimum requirement.", icon: Scale },
                                { title: "Lower Compliance Cost", desc: "Cheaper to maintain than a Private Limited Company. No mandatory audit for small LLPs.", icon: Zap },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-beige transition">
                                    <div className="w-14 h-14 rounded-2xl bg-beige/10 text-navy flex items-center justify-center flex-shrink-0">
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

                    {/* PRICING PLANS */}
                    <section id="pricing-section" className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-navy">Choose Your Plan</h2>
                            <p className="text-slate-500 mt-3">Transparent pricing. No hidden costs.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Basic */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-navy mb-2">Basic</h3>
                                <div className="text-3xl font-bold text-navy mb-1">₹4,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["2 DSC & 2 DPIN", "Name Reservation", "LLP Agreement Drafting", "Cert. of Incorporation", "PAN & TAN", "Bank Guidance"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                                            <CheckCircle size={16} className="text-bronze shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-[#2B3446] hover:text-white transition">Select Basic</button>
                            </div>

                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-8 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Recommended</div>
                                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                                <div className="text-3xl font-bold text-white mb-1">₹8,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Basic", "LLP Agreement Filing", "Capital Records", "Partner Records", "PAN & TAN Allocation"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                                            <CheckCircle size={16} className="text-bronze shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-bronze-dark text-white font-bold shadow-lg hover:shadow-bronze/50 transition">Choose Standard</button>
                            </div>

                            {/* Premium */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-navy mb-2">Premium</h3>
                                <div className="text-3xl font-bold text-navy mb-1">₹12,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Standard", "GST Registration", "MSME Registration", "Bank A/c Support", "First Resolution", "1-Year Compliance"].map((feat, i) => (
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
                                { step: "Step 1", title: "DSC & DPIN", days: "Day 1-2", desc: "Obtaining Digital Signatures and DPIN for all designated partners." },
                                { step: "Step 2", title: "Name Reservation", days: "Day 3-5", desc: "Filing RUN-LLP form for name approval." },
                                { step: "Step 3", title: "Incorporation Filing", days: "Day 6-12", desc: "Filing FiLLiP form with the Registrar." },
                                { step: "Step 4", title: "LLP Agreement", days: "Post-Inc", desc: "Drafting and filing LLP Agreement (Form 3) within 30 days." },
                                { step: "Step 5", title: "PAN & TAN", days: "Day 15-18", desc: "Issuance of PAN and TAN for the LLP." }
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
                                    { name: "LLP Agreement (Form 3)", due: "Within 30 days", type: "One Time" },
                                    { name: "Annual Return (Form 11)", due: "30th May", type: "Annual" },
                                    { name: "Statement of Accounts (Form 8)", due: "30th October", type: "Annual" },
                                    { name: "Income Tax Return", due: "31st July / 30th Sept", type: "Annual" },
                                    { name: "DIR-3 KYC", due: "30th September", type: "Annual" }
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
                            <Shield className="text-navy" /> Frequently Asked Questions
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
                                <FileText className="text-navy" /> Documents Required
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Partners</h4>
                                    <ul className="space-y-3">
                                        {["PAN Card", "Aadhaar Card", "Photo", "Address Proof"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Registered Office</h4>
                                    <ul className="space-y-3">
                                        {["Electricity Bill", "NOC from Owner", "Rent Agreement (if rented)"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" />
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
                            <LlpRegistration isLoggedIn={isLoggedIn} isModal={true} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LlpPage;

