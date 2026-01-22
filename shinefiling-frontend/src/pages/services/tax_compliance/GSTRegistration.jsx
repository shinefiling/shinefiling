import GstRegistration from '../tax_registration/GstRegistration';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GSTRegistrationPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('basic');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Who needs GST Registration?", a: "Businesses with turnover > ₹20 Lakhs (Services) or ₹40 Lakhs (Goods), or those selling online (E-commerce) or making inter-state sales." },
        { q: "Is a physical office required?", a: "Yes, you need a proof of address (Electricity Bill/NOC). However, it can be a residential address too if you operate from home." },
        { q: "What is the penalty for not registering?", a: "Penalty can be 100% of the tax due or ₹10,000, whichever is higher, along with potential confiscation of goods." },
        { q: "Can I register voluntarily?", a: "Yes, voluntary registration is allowed and beneficial for claiming Input Tax Credit (ITC)." },
        { q: "Difference between Regular and Composition?", a: "Regular scheme allows ITC claim but requires monthly returns. Composition scheme has lower tax rates but no ITC and cannot make inter-state sales." },
        { q: "Do I need to file returns if I have no sales?", a: "Yes, filing Nil Returns is mandatory to avoid late fees and penalties." },
        { q: "How long is the GST registration valid?", a: "GST registration does not expire unless surrendered by you or cancelled by the authority." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegisterModal(true);
        } else {
            const url = window.location.pathname;
            navigate('/login', { state: { from: url } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070"
                        alt="GST Registration"
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
                                    <Star size={12} className="fill-bronze" /> Mandatory for Business Growth
                                </span>
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
                                    GST <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white italic uppercase">Registration Online</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Get your GSTIN number online. Unlock <strong className="text-white font-semibold">Input Tax Credit</strong>, <strong className="text-white font-semibold">Legal Recognition</strong>, and the power to sell on E-commerce platforms like <strong className="text-white font-semibold">Amazon & Flipkart</strong>.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">3-7 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Clients</p>
                                        <p className="font-bold text-sm text-white">10k+ Filed</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Register Now
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
                                    <h3 className="text-navy font-bold text-xl mb-2">Standard Plan</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,499</h3>
                                        <span className="text-lg text-slate-400 line-through mb-1 font-medium">₹3k</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees may apply</p>
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {[
                                        "GST Application Filing",
                                        "Document Verification",
                                        "ARN Generation",
                                        "Digital Certificate",
                                        "Expert Support",
                                        "Harness Input Tax Credits"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })}
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

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div className="lg:col-span-8 space-y-20">

                    {/* Introduction - Expanded for SEO */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> What is GST Registration?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>Goods and Services Tax (GST)</strong> is a unified indirect tax system in India that acts as a comprehensive, destination-based tax on the manufacture, sale, and consumption of goods and services.
                            </p>
                            <p>
                                GST Registration is mandatory for businesses whose aggregate turnover exceeds <strong>₹40 Lakhs (for Goods)</strong> or <strong>₹20 Lakhs (for Services)</strong>. However, for certain categories like <strong>Inter-state Sellers</strong>, <strong>E-commerce Operators</strong> (like Amazon/Flipkart sellers), and <strong>Casual Taxable Persons</strong>, registration is compulsory regardless of turnover.
                            </p>
                            <p>
                                Obtaining a GSTIN (GST Identification Number) not only legalizes your business but also allows you to collect tax from customers and claim <strong>Input Tax Credit (ITC)</strong> on your business purchases, maintaining a healthy cash flow.
                            </p>
                        </div>
                    </section>

                    {/* BENEFITS GRID */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why You Must Register for GST</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Legal Recognition", desc: "Your business becomes a legally recognized supplier. This status enhances your business's market standing.", icon: Shield },
                                { title: "Input Tax Credit (ITC)", desc: "You can claim credit for taxes paid on your purchases, significantly reducing your overall tax liability.", icon: TrendingUp },
                                { title: "Inter-State Sales", desc: "Required to sell goods to customers in other states without restrictions. Expands your market reach.", icon: Truck },
                                { title: "E-Commerce Ready", desc: "Mandatory to sell on platforms like Amazon, Flipkart, Myntra, etc. A must for online sellers.", icon: Globe },
                                { title: "Better Credibility", desc: "Registered businesses are trusted more by other companies and banks, making loan approvals easier.", icon: Star },
                                { title: "Avoid Penalties", desc: "Avoid heavy penalties and seizure of goods that come with non-compliance. Stay safe.", icon: Scale },
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

                    {/* COMPARISON: REGULAR vs COMPOSITION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Choose Your GST Scheme</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Regular Scheme</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Composition Scheme</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Turnover Limit", r: "No limit (Mandatory > ₹40L)", c: "Up to ₹1.5 Crores only" },
                                        { f: "Input Tax Credit", r: "Available (Can claim ITC)", c: "Not Available (Cannot claim ITC)" },
                                        { f: "Inter-state Sales", r: "Allowed", c: "Not Allowed (Intra-state only)" },
                                        { f: "Tax Rate", r: "Standard Rates (5%, 12%, 18%, 28%)", c: "Lower Rates (1% Traders, 5% Restaurants, 6% Service)" },
                                        { f: "Return Filing", r: "Monthly (GSTR-1, GSTR-3B) + Annual", c: "Quarterly (CMP-08) + Annual" },
                                        { f: "E-Commerce", r: "Can sell online", c: "Cannot sell via E-commerce operators" }
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

                    {/* WHO SHOULD REGISTER SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Who Should Register?</h2>
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="mb-6 text-gray-600">Mandatory for the following entities:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                {[
                                    "Turnover > ₹40L (Goods)", "Turnover > ₹20L (Services)",
                                    "Inter-state Suppliers", "Casual Taxable Persons",
                                    "E-commerce Sellers", "Non-Resident Taxable Persons",
                                    "TDS/TCS Deductors", "Input Service Distributors"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle size={18} className="text-bronze flex-shrink-0" />
                                        <span className="font-medium text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Timeline & Process</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Documents Upload", days: "Day 1", desc: "You provide PAN, Aadhaar, and Address Proof. We verify all documents for validity." },
                                { step: "Step 2", title: "Application Filing", days: "Day 2", desc: " We prepare and file your application on the GST Portal along with the required documents." },
                                { step: "Step 3", title: "ARN Generation", days: "Day 3", desc: "An Application Reference Number (ARN) is generated. The application moves to the tax officer for review." },
                                { step: "Step 4", title: "Certificate Issue", days: "Day 4-7", desc: "Upon approval, the GST Registration Certificate (Form GST REG-06) is issued digitally." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">{item.days}</span>
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

                    {/* PRICING PLANS SECTION */}
                    <section id="pricing-plans" className="bg-white relative overflow-hidden rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="text-center mb-16">
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Path</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Pricing Plans</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
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
                                <p className="text-slate-500 text-sm mb-6">Essential for small businesses.</p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black text-navy">₹999</span>
                                    <span className="text-slate-400 line-through text-sm">₹2000</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500 shrink-0" /> GST Registration</li>
                                    <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500 shrink-0" /> Application Filing</li>
                                    <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} className="shrink-0" /> Return Filing</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                    Select Basic
                                </button>
                            </motion.div>

                            {/* Standard */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#10232A] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full"
                            >
                                {/* Top Gold Line */}
                                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                                <div className="absolute top-6 right-6 bg-gradient-to-r from-[#B58863] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 mt-2">Standard</h3>
                                <p className="text-gray-400 text-sm mb-6">Complete expert assisted registration.</p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-5xl font-black text-white">₹1,499</span>
                                    <span className="text-gray-500 line-through text-sm">₹3,000</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {[
                                        "Everything in Basic",
                                        "Document Verification",
                                        "ARN Generation",
                                        "Certificate Download",
                                        "Expert Support"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                            <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                    Choose Standard
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
                                <p className="text-slate-500 text-sm mb-6">Registration + 3 Months Compliance.</p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black text-navy">₹2,999</span>
                                    <span className="text-slate-400 line-through text-sm">₹5,000</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {[
                                        "Everything in Standard",
                                        "3 Months Return Filing",
                                        "Invoicing Software",
                                        "Dedicated CA Support"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                            <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                    Select Premium
                                </button>
                            </motion.div>
                        </div>
                    </section>

                    {/* MANDATORY DELIVERABLES */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official documents you get after successful registration.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "GST Registration Certificate", type: "Form REG-06", due: "Immediate" },
                                    { name: "GSTIN Number", type: "15 Digit ID", due: "Immediate" },
                                    { name: "Login Credentials", type: "For GST Portal", due: "Immediate" },
                                    { name: "HSN/SAC Codes List", type: "For Invoicing", due: "PDF" },
                                    { name: "Invoicing Guidelines", type: "Expert Support", due: "Consultation" }
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


                    {/* WHY CHOOSE SHINEFILING - NEW SEO SECTION */}
                    <section className="bg-gradient-to-br from-[#10232A] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl mb-16">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Award size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Guaranteed ARN</h4><p className="text-gray-300 text-sm">We ensure your application is error-free, leading to instant ARN generation without rejections.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Zap size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Fast-Track Filing</h4><p className="text-gray-300 text-sm">Our priority channel ensures your application is filed within 24 hours of document submission.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Shield size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Clarification Support</h4><p className="text-gray-300 text-sm">If the Tax Officer raises a query, our CA experts draft the legal reply at no extra cost.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Users size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Compliance Guide</h4><p className="text-gray-300 text-sm">We don't just register you; we guide you on how to raise invoices and file returns correctly.</p></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* DETAILED SEO CONTENT SECTION */}
                    <section className="mt-20 space-y-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Online GST Registration in India</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">What is GST (Goods and Services Tax)?</h3>
                                    <p>
                                        GST is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. It has simplified the indirect tax structure in India by replacing various taxes like Excise Duty, Service Tax, VAT, and others. Registration for GST is mandatory for businesses that meet certain turnover thresholds or engage in specific types of trade.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <Building size={20} className="text-bronze" /> Who Must Register?
                                        </h3>
                                        <ul className="space-y-3 list-disc pl-5">
                                            <li><strong>Threshold Limit:</strong> Service providers with turnover &gt; ₹20 Lakhs and Goods suppliers with turnover &gt; ₹40 Lakhs.</li>
                                            <li><strong>Inter-state Trade:</strong> Businesses making sales across different states.</li>
                                            <li><strong>E-commerce Sellers:</strong> Anyone selling via platforms like Amazon, Flipkart, or Myntra.</li>
                                            <li><strong>Casual Taxable Persons:</strong> Those who conduct business occasionally in a territory where they have no fixed place.</li>
                                            <li><strong>TDS/TCS Deductors:</strong> Entities required to deduct or collect tax at source.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <Zap size={20} className="text-bronze" /> Major Benefits of GST
                                        </h3>
                                        <ul className="space-y-3 list-disc pl-5">
                                            <li><strong>ITC (Input Tax Credit):</strong> Claim credit for taxes paid on inputs and reduce your overall tax liability.</li>
                                            <li><strong>Legal Recognition:</strong> Operate your business as a legally recognized supplier under Indian laws.</li>
                                            <li><strong>Nationwide Sale:</strong> Ability to sell goods or services across state borders without multiple tax barriers.</li>
                                            <li><strong>Lower Compliance:</strong> Single tax system reduces the complexity of multiple tax returns.</li>
                                            <li><strong>Ease of Business:</strong> Enhanced credibility when dealing with major corporations and government tenders.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">Types of GST Registrations</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                                            <h4 className="font-bold text-bronze mb-2">Regular Taxpayer</h4>
                                            <p className="text-sm">Standard registration for most businesses. Allows full ITC claims and periodic return filing.</p>
                                        </div>
                                        <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                                            <h4 className="font-bold text-bronze mb-2">Composition Scheme</h4>
                                            <p className="text-sm">For small businesses with turnover up to ₹1.5 Cr. Lower tax rates but no ITC benefits.</p>
                                        </div>
                                        <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition">
                                            <h4 className="font-bold text-bronze mb-2">Non-Resident Taxable</h4>
                                            <p className="text-sm">For foreign businesses occasionally making supplies in India without a fixed base.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-navy/5 p-8 rounded-3xl border border-navy/10 mt-12">
                                    <h3 className="text-2xl font-bold text-navy mb-6">Why Choose ShineFiling for GST Registration?</h3>
                                    <p className="mb-6">
                                        ShineFiling simplifies the complex GST registration process, ensuring 100% accuracy and fast approval. Our team of expert CAs and tax professionals handles everything from documentation to follow-ups with GST officers.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            "Expert Documentation Review",
                                            "End-to-end Application Tracking",
                                            "Post-Registration Support",
                                            "Notice Resolution & Compliance",
                                            "Dedicated Account Manager",
                                            "Lowest Professional Fees"
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-navy/80 font-medium">
                                                <CheckCircle size={18} className="text-green-600" /> {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="mt-20 mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-navy flex items-center justify-center gap-3">
                                <HelpCircle className="text-bronze" /> Frequently Asked Questions
                            </h2>
                            <p className="text-gray-500 mt-2 font-medium">Clear your doubts about GST registration</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {faqs.map((faq, index) => (
                                <details key={index} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-gray-50 transition select-none">
                                        <span className="pr-4">{faq.q}</span>
                                        <ChevronRight className="text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-gray-600 text-[13px] leading-relaxed border-t border-gray-50">
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
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">1. For Proprietorship</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN Card of Owner</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Aadhaar Card of Owner</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Passport Size Photo</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">2. For Partnership/LLP/Company</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN of the Entity</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> COI / Partnership Deed</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Authorization Letter</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">3. Address Proof (Any One)</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Electricity Bill (Mandatory)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement (If Rented)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> NOC from Owner</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">4. Bank Details</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Cancelled Cheque / Bank Statement</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 bg-beige/10 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-800 font-medium leading-relaxed flex gap-2">
                                    <span className="text-lg">💡</span>
                                    <span><strong>Pro Tip:</strong> The Electricity Bill must be recent (less than 2 months old) and clearly show the owner's name.</span>
                                </p>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Our GST experts are available 24/7 to guide you through the process.</p>
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

                <AnimatePresence>
                    {showRegisterModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                            <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                                <GstRegistration isLoggedIn={isLoggedIn} isModal={true} initialPlan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GSTRegistrationPage;


