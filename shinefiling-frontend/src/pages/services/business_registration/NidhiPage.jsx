import NidhiRegistration from './NidhiRegistration';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, ChevronRight, User, Component, Building, Scale, Landmark, Globe, ArrowRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NidhiPage = ({ isLoggedIn, onLogout }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is a Nidhi Company?", a: "A Nidhi Company is a type of NBFC (Non-Banking Financial Company) that deals only with its members. It promotes the habit of thrift and savings." },
        { q: "Is RBI approval required?", a: "No, Nidhi Companies are exempted from core RBI provisions. They are regulated by the MCA under Nidhi Rules, 2014." },
        { q: "What is the minimum capital required?", a: "The minimum paid-up equity capital to start is ₹10 Lakhs. However, within one year, it must have Net Owned Funds of ₹10 Lakhs." },
        { q: "Who can be members?", a: "Only individuals can be members. No body corporate or trust can be a member. You need at least 200 members within one year." },
        { q: "Can a Nidhi Company issue loans?", a: "Yes, it can lend money to its members against securities like Gold, Silver, Immovable Property, FD receipts, etc." },
        { q: "What are the restrictions?", a: "It cannot advertise for deposits, cannot open current accounts, cannot engage in chit funds, hire purchase, insurance, or acquire securities." },
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
                                    Nidhi Company <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Start your own lending business. A Nidhi company cultivates the habit of thrift and savings.
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
                                        <p className="font-bold text-sm text-white">30-45 Days</p>
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
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹24,999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹40,000</span>
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
                            <Landmark className="text-teal-600" /> Start Your Mini-Bank
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Nidhi Company</strong> is the easiest way to start a finance business in India. It accepts deposits from and lends money to its members.
                            </p>
                            <p>
                                It is widely used for creating local finance ecosystems, mutual benefit funds, and savings groups. The core principal is mutual benefit of members.
                            </p>
                        </div>
                    </section>

                    {/* Benefits Grid */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Key Benefits</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "No RBI License", desc: "Exempted from strict RBI licensing requirements applicable to other NBFCs.", icon: Shield },
                                { title: "Secure Lending", desc: "Can lend against Gold, Property, and FDs, making loans highly secure.", icon: Scale },
                                { title: "Low Capital", desc: "Start with as low as ₹10 Lakhs capital (to be raised to ₹10L within 1 year).", icon: Star },
                                { title: "Ease of Operations", desc: "Serve your local community or specified group easily.", icon: Component },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition">
                                    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
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
                            <p className="text-slate-500 mt-3">All-inclusive packages for your finance company.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Basic */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-navy mb-2">Basic</h3>
                                <div className="text-3xl font-bold text-navy mb-1">₹12,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Company Incorporation", "Nidhi MOA & AOA", "PAN & TAN", "Name Approval"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                                            <CheckCircle size={16} className="text-bronze shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-[#2B3446] hover:text-white transition">Select Basic</button>
                            </div>

                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-8 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                                <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Recommended</div>
                                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                                <div className="text-3xl font-bold text-white mb-1">₹19,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Basic", "NDH-4 Preparation", "Loan Policy Drafts", "Member Registers", "Bank Support"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                                            <CheckCircle size={16} className="text-teal-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-teal-500/50 transition">Choose Standard</button>
                            </div>

                            {/* Premium */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-navy mb-2">Premium</h3>
                                <div className="text-3xl font-bold text-navy mb-1">₹29,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Standard", "NDH-1 (90-Day Compliance)", "First Board Resolution", "Statutory Registers", "1-Year Compliance"].map((feat, i) => (
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
                                { step: "Step 1", title: "DSC & Name", days: "Day 1-3", desc: "Digital Signatures and Name Approval (must end with Nidhi Limited)." },
                                { step: "Step 2", title: "Incorporation Filing", days: "Day 4-10", desc: "Filing SPICe+ form with 7 members and 3 directors." },
                                { step: "Step 3", title: "NDH-4 Filing", days: "Post-Inc", desc: "Declaration of Nidhi status to the Government." },
                                { step: "Step 4", title: "Membership", days: "1 Year", desc: "Must reach 200 members within one year." },
                                { step: "Step 5", title: "Net Owned Funds", days: "1 Year", desc: "Maintain NOF of 10 Lakhs." }
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
                            <Shield className="text-teal-600" /> Frequently Asked Questions
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
                                <FileText className="text-teal-600" /> Documents Required
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Directors (Min 3)</h4>
                                    <ul className="space-y-3">
                                        {["PAN Card", "Aadhaar Card", "Voter ID / Passport", "Photo"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Office & Others</h4>
                                    <ul className="space-y-3">
                                        {["Electricity Bill", "NOC from Owner", "Rent Agreement (if rented)"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
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
                            <NidhiRegistration isLoggedIn={isLoggedIn} isModal={true} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NidhiPage;

