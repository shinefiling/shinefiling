
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivateLimitedRegistration from './PrivateLimitedRegistration';

const PrivateLimitedPage = ({ isLoggedIn, onLogout }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "How many directors are required?", a: "Minimum 2 directors are mandatory for a Private Limited Company." },
        { q: "Can a single person open a Pvt Ltd company?", a: "No — but you can open an OPC (One Person Company) if you are the only owner." },
        { q: "Can I register my home as an office?", a: "Yes, totally allowed. You can use your residential address as the registered office by providing an electricity bill and NOC." },
        { q: "Is physical presence required?", a: "No, the entire process is 100% online. You do not need to visit any government office." },
        { q: "What is the minimum capital required?", a: "There is no minimum capital requirement. You can start with as little as ₹1 (but practically typically ₹10,000 to ₹1 Lakh authorized capital)." },
        { q: "Can salaried employees be directors?", a: "Yes, provided their employment agreement allows it. It is best to check with your employer." },
        { q: "How long is the registration valid?", a: "The company has perpetual existence. It continues until you formally close it." }
    ];

    // --- LOGIC: LOGIN CHECK ON PLAN SELECTION ---
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
                                    Private Limited <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Company Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Launch your startup with the most trusted business structure. Get <strong className="text-white font-semibold">Limited Liability</strong>, <strong className="text-white font-semibold">Easy Funding</strong>, and <strong className="text-white font-semibold">Global Recognition</strong> today.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast Track</p>
                                        <p className="font-bold text-sm text-white">5-7 Days</p>
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
                                {/* Top Gold Line */}
                                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                                <div className="absolute top-3 right-0 bg-[#10232A] text-white text-[10px] font-bold px-4 py-1.5 rounded-l-full uppercase tracking-wider z-10 shadow-md">Best Value</div>

                                <div className="text-center mb-6 mt-4">
                                    <h3 className="text-navy font-bold text-xl mb-2">Growth</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹14,999</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹25,000</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees as applicable</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {[
                                        "Everything in Startup",
                                        "GST Registration",
                                        "Udyam (MSME) Registration",
                                        "Business Bank Account Support",
                                        "Accounting Software (1 Year)",
                                        "Dedicated Account Manager"
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
                                >
                                    View Plans <ArrowRight size={18} />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
                                    Compare all plans & features below
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
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Path</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Pricing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: BASIC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Startup</h3>
                            <p className="text-slate-500 text-sm mb-6">Essential registration for new founders.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">₹6,999</span>
                                <span className="text-slate-400 line-through text-sm">₹12,000</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "2 DSC & 2 DIN",
                                    "Name Approval",
                                    "MOA & AOA Drafting",
                                    "Certificate of Incorporation",
                                    "PAN & TAN Allotment",
                                    "PF & ESIC Registration"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={16} className="shrink-0" /> GST Registration
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <X size={16} className="shrink-0" /> 1st Year Compliance
                                </li>
                            </ul>
                            <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Choose Basic
                            </button>
                        </motion.div>

                        {/* PLAN 2: STANDARD (POPULAR) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#10232A] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-4 z-10"
                        >
                            {/* Top Gold Line - Thicker and Rounded to match card */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#B58863] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Growth</h3>
                            <p className="text-gray-400 text-sm mb-6">Complete setup to start business operations.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-white">₹14,999</span>
                                <span className="text-gray-500 line-through text-sm">₹25,000</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Everything in Startup",
                                    "GST Registration",
                                    "Udyam (MSME) Registration",
                                    "Business Bank Account Support",
                                    "Accounting Software (1 Year)",
                                    "Dedicated Account Manager"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                        <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('standard')} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Select Growth Plan
                            </button>
                        </motion.div>

                        {/* PLAN 3: PREMIUM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Enterprise</h3>
                            <p className="text-slate-500 text-sm mb-6">Full legal protection and compliance.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">₹24,999</span>
                                <span className="text-slate-400 line-through text-sm">₹40,000</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Everything in Growth",
                                    "Trademark Filing (1 Class)",
                                    "1st Year ROC Compliance",
                                    "Auditor Appointment (ADT-1)",
                                    "Commencement of Business (INC-20A)",
                                    "Zero Balance Current A/c"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Choose Enterprise
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div className="lg:col-span-8 space-y-20">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Building className="text-bronze" /> What is a Private Limited Company?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Private Limited Company (Pvt Ltd)</strong> is the most popular corporate legal entity in India. It is preferred by startups and growing businesses because it offers limited liability protection to its shareholders.
                            </p>
                            <p>
                                It is a separate legal entity from its owners, meaning the company is responsible for its own debts. It is the best structure if you plan to raise external funding from VCs or Angel Investors.
                            </p>
                        </div>
                    </section>

                    {/* 6 KEY BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Key Benefits of Private Limited Company</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Limited Liability Protection", desc: "Protect your personal assets. If the business takes a loan and fails, the bank cannot take your personal house or car. Only the company assets are liable.", icon: Shield },
                                { title: "Separate Legal Identity", desc: "The company can own property, cars, and assets in its own name. It has its own PAN card and legal standing.", icon: Briefcase },
                                { title: "Easy to Raise Funding", desc: "Investors prefer Pvt Ltd companies. You can easily issue shares to VCs and Angel Investors in return for capital.", icon: TrendingUp },
                                { title: "Perpetual Existence", desc: "The company continues to exist even if the directors or shareholders change or pass away.", icon: Clock },
                                { title: "Brand Protection", desc: "Your company name is protected by the ROC. No one else can register a company with the same name.", icon: Award },
                                { title: "Better Credibility & Trust", desc: "Customers, vendors, and employees trust a Pvt Ltd company more than a proprietorship. It signals stability.", icon: Star },
                                { title: "ESOP Options", desc: "Attract top talent by offering Employee Stock Ownership Plans (ESOPs) to your employees.", icon: Users },
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

                    {/* WHO SHOULD REGISTER SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Who Should Register a Pvt Ltd Company?</h2>
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="mb-6 text-gray-600">Perfect for:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                {[
                                    "Startups", "Tech Businesses", "Service Providers",
                                    "E-commerce Companies", "Manufacturing Units", "Consultants & Freelancers",
                                    "IT Agencies", "Marketing Agencies", "Finance Professionals"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle size={18} className="text-bronze flex-shrink-0" />
                                        <span className="font-medium text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* DETAILED COMPARISON TABLE */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#2B3446] p-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Scale size={20} className="text-bronze" /> Structure Comparison
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#2B3446]/5 text-navy">
                                    <tr>
                                        <th className="px-6 py-4">Feature</th>
                                        <th className="px-6 py-4 bg-beige/10 border-b-2 border-yellow-500">Private Limited</th>
                                        <th className="px-6 py-4">LLP</th>
                                        <th className="px-6 py-4">Proprietorship</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Separate Legal Entity</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">Yes</td><td className="px-6 py-4 text-slate font-bold">Yes</td><td className="px-6 py-4 text-red-500 font-bold">No</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Liability Protection</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">Limited (Safe)</td><td className="px-6 py-4 text-slate font-bold">Limited (Safe)</td><td className="px-6 py-4 text-red-500 font-bold">Unlimited (Risky)</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Fundraising (VC/Angel)</td><td className="px-6 py-4 text-slate font-bold bg-beige/10">High (Preferred)</td><td className="px-6 py-4 text-bronze-dark font-bold">Low (Difficult)</td><td className="px-6 py-4 text-red-500 font-bold">Impossible</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Annual Compliance</td><td className="px-6 py-4 text-gray-600 bg-beige/10">High</td><td className="px-6 py-4 text-gray-600">Moderate</td><td className="px-6 py-4 text-gray-600">Low</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">Tax Rate</td><td className="px-6 py-4 text-gray-600 bg-beige/10">25% (Base)</td><td className="px-6 py-4 text-gray-600">30% (Flat)</td><td className="px-6 py-4 text-gray-600">Slab Rates</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* DETAILED PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Comprehensive Registration Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Digital Signature & Name Approval", days: "Day 1-2", desc: "We apply for Digital Signature Certificates (DSC) for all directors. Simultaneously, we define the company name and check for availability on MCA." },
                                { step: "Step 2", title: "Document Preparation", days: "Day 2-3", desc: "Our team drafts the Memorandum of Association (MOA) and Articles of Association (AOA). We also prepare DIN (Director Identification Number) applications." },
                                { step: "Step 3", title: "Filing SPICe+ Form", days: "Day 3-5", desc: "We file the SPICe+ (Simplified Proforma for Incorporating Company Electronically) form with the Registrar of Companies (ROC)." },
                                { step: "Step 4", title: "Certificate of Incorporation", days: "Day 5-7", desc: "The ROC verifies documents and issues the Certificate of Incorporation (COI), along with PAN and TAN." },
                                { step: "Step 5", title: "Bank Account & Post-Setup", days: "Post-Reg", desc: "We guide you in opening a current bank account and depositing the share capital." }
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

                    {/* MANDATORY ANNUAL COMPLIANCES */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Mandatory Annual Compliances</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Keep your company active and penalty-free with these filings.</p>
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
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">1. Identity Proof (Any One)</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN Card (Mandatory)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Passport (Foreigners)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">2. Address Proof (Any One)</h4>
                                    <ul className="space-y-3">
                                        {["Aadhaar Card", "Passport", "Voter ID", "Driving License"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" />
                                                {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">3. Residential Proof (Any One)</h4>
                                    <ul className="space-y-3">
                                        {["Bank Statement (Last 2 months)", "Electricity Bill", "Mobile/Postpaid Bill"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" />
                                                {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">4. For Office Address</h4>
                                    <ul className="space-y-3">
                                        {["Electricity Bill / Gas Bill", "Rent Agreement (If Rented)", "NOC from Owner"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" />
                                                {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 bg-beige/10 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-800 font-medium leading-relaxed flex gap-2">
                                    <span className="text-lg">💡</span>
                                    <span><strong>Pro Tip:</strong> Ensure that the address on your Electricity Bill matches exactly with the address you want to register.</span>
                                </p>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">
                                Download Checklist PDF
                            </button>
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


                <AnimatePresence>
                    {showRegisterModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                            <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20 overflow-y-auto">
                                <PrivateLimitedRegistration isLoggedIn={isLoggedIn} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default PrivateLimitedPage;

