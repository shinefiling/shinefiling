import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, Building, Scale, Globe, Briefcase, Award, ArrowRight, X, Banknote, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GSTR1Registration from './GSTR1Registration';

const GSTR1Page = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is GSTR-1?", a: "GSTR-1 is a monthly or quarterly return that should be filed by every registered GST taxpayer. It contains details of all outward supplies (sales)." },
        { q: "Who needs to file GSTR-1?", a: "Every registered person including casual taxable persons needs to file GSTR-1." },
        { q: "What happens if I don't file?", a: "Late fees will apply, and you won't be able to file GSTR-3B, leading to penalty interest on tax payments." },
        { q: "Can I revise a filed GSTR-1?", a: "No, GSTR-1 once filed cannot be revised. Any mistakes can only be corrected in the amendment section of the next month's return." },
        { q: "What details are required?", a: "Invoice-wise details of B2B sales, consolidated B2C sales, Debit/Credit notes, and HSN summary." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegistrationModal(true);
        } else {
            const targetUrl = `/services/gst-return/gstr-1/register?plan=${plan}`;
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
                            <GSTR1Registration
                                isLoggedIn={isLoggedIn}
                                isModal={true}
                                planProp={selectedPlan}
                                onClose={() => setShowRegistrationModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070"
                        alt="Finance Background"
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
                                    <Star size={12} className="fill-bronze" /> GST Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GSTR-1 <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Monthly Return Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Report your <strong className="text-white font-semibold">Sales & Outward Supplies</strong> accurately. Ensure your customers get their <strong className="text-white font-semibold">Input Tax Credit</strong> on time, every month.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fast Turnaround</p>
                                        <p className="font-bold text-sm text-white">24-48 Hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trusted By</p>
                                        <p className="font-bold text-sm text-white">10k+ Businesses</p>
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
                                    File GSTR-1 Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Filing Guide
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">G S T R1</p>
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
                                        "Sales Invoice Upload",
                                        "HSN Code Summary",
                                        "Credit/Debit Notes"
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

            {/* --- PRICING SECTION --- */}
            <section id="pricing-section" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Our Plans</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Simple Pricing</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: MONTHLY */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Monthly</h3>
                            <p className="text-slate-500 text-sm mb-6">Pay as you go per month.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?499</span>
                                <span className="text-slate-400 line-through text-sm">?999</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Invoice Data Validation",
                                    "HSN Summary Preparation",
                                    "Document Verification",
                                    "Filing Confirmation"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Choose Monthly
                            </button>
                        </motion.div>

                        {/* PLAN 2: QUARTERLY */}
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

                            <h3 className="text-xl font-bold text-white mb-2 mt-2">G S T R1</h3>
                            <p className="text-gray-400 text-sm mb-6">Comprehensive Solution</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-white">?999</span>
                                <span className="text-gray-500 line-through text-sm">?2k</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {["3 Months Filing",
                                    "IFF Support (QRMP)",
                                    "Invoice Corrections"].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                            <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> {feat}
                                        </li>
                                    ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Get Started
                            </button>
                        </motion.div>

                        {/* PLAN 3: ANNUAL */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Annual</h3>
                            <p className="text-slate-500 text-sm mb-6">Complete yearly peace of mind.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?4,499</span>
                                <span className="text-slate-400 line-through text-sm">?11,988</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "12 Months Filing",
                                    "GSTR-9 Annual Return",
                                    "Reconciliation Support",
                                    "Dedicated CA Support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Choose Annual
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DETAILS SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <FileText className="text-bronze" /> What is GSTR-1?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>GSTR-1</strong> is the statement of outward supplies of goods and services. It acts as the backbone of the GST system because the details you file here (B2B Invoices) trigger the <strong>Input Tax Credit (ITC)</strong> for your buyers in their GSTR-2B.
                            </p>
                            <p>
                                Filing GSTR-1 on time is critical. Delaying it not only blocks you from filing GSTR-3B but also damages your business relationship with clients who will deny payment if they don't see your invoices in their portal.
                            </p>
                            <p>
                                It includes details of B2B invoices, B2C (Large & Small) invoices, Exports, Credit/Debit Notes, and HSN-wise summary of items sold.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Why File GSTR-1 on Time?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Pass Input Credit", desc: "If you don't file, your customers won't get Input Tax Credit.", icon: CheckCircle },
                                { title: "Avoid Late Fees", desc: "Late filing attracts penalties per day of delay.", icon: Shield },
                                { title: "File GSTR-3B", desc: "System may block GSTR-3B filing if GSTR-1 is pending.", icon: FileText }
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

                    {/* FILING PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">How We File Your GSTR-1</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Data Ingestion", desc: "Upload your sales data in any format (Excel, JSON, Tally Backup). Our system automatically maps it to GSTN fields." },
                                { step: "Step 2", title: "Smart Validation", desc: "We run 50+ checks: Invalid GSTINs, duplicate invoice numbers, mismatch in HSN rates, and date format errors." },
                                { step: "Step 3", title: "Preview & Approve", desc: "You get a simplified summary of Total Sales and Tax Liability. Once you approve, we proceed." },
                                { step: "Step 4", title: "Secure Filing", desc: "We file the return using High-Encryption APIs. You receive the ARN and Acknowledgement instantly." },
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
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to GSTR-1 Filing</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">What is GSTR-1 and Why is it Critical?</h3>
                                    <p>
                                        GSTR-1 is a monthly or quarterly statement of outward supplies to be filed by all registered taxpayers. It is the most important document for your customers because the data you file in GSTR-1 reflects in their GSTR-2A/2B, allowing them to claim <strong className="text-navy">Input Tax Credit (ITC)</strong>. If you miss filing or make errors, your buyers will not get their tax credit, which can damage your business relationships.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <Building size={20} className="text-bronze" /> B2B vs B2C Reporting
                                        </h3>
                                        <p className="text-sm mb-4 text-gray-600 font-medium italic">Accuracy is mandatory for tax flow.</p>
                                        <ul className="space-y-3 list-disc pl-5 text-sm">
                                            <li><strong>B2B Invoices:</strong> Mandatory invoice-wise reporting including Receiver's GSTIN.</li>
                                            <li><strong>B2C Large:</strong> Inter-state sales &gt; ?2.5 Lakhs must be reported invoice-wise.</li>
                                            <li><strong>B2C Others:</strong> Consolidated reporting of sales below the threshold.</li>
                                            <li><strong>Debit/Credit Notes:</strong> Adjustment of sales records for returns or price changes.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                            <Clock size={20} className="text-bronze" /> Filing Frequencies
                                        </h3>
                                        <p className="text-sm mb-4 text-gray-600 font-medium italic">Monthly or QRMP Scheme.</p>
                                        <ul className="space-y-3 list-disc pl-5 text-sm">
                                            <li><strong>Monthly:</strong> For businesses with turnover &gt; ?5 Crores. Due on 11th of next month.</li>
                                            <li><strong>Quarterly (QRMP):</strong> For businesses with turnover &lt; ?5 Crores. Due on 13th of the month following the quarter.</li>
                                            <li><strong>IFF (Invoice Furnishing Facility):</strong> Allows QRMP taxpayers to upload B2B invoices monthly.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-navy/5 p-8 rounded-3xl border border-navy/10 mt-12">
                                    <h3 className="text-2xl font-bold text-navy mb-6">Key Tables in GSTR-1</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { t: "Table 4", d: "B2B Taxable Invoices" },
                                            { t: "Table 7", d: "B2C (Small) Supplies" },
                                            { t: "Table 9", d: "Amendments to Invoices" },
                                            { t: "Table 11", d: "Advances Received" },
                                            { t: "Table 12", d: "HSN-wise Summary" },
                                            { t: "Table 13", d: "Documents Issued" }
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

                    {/* LATE FEE TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Late Fees & Penalties</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#043E52] text-white">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Scenario</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Late Fee (Per Day)</th>
                                        <th className="p-4 font-semibold text-sm uppercase tracking-wider">Maximum Cap</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Nil Return (No Sales)</td>
                                        <td className="p-4 text-gray-600">?20 (?10 CGST + ?10 SGST)</td>
                                        <td className="p-4 text-gray-600">?500</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-navy font-medium">Regular Return (With Sales)</td>
                                        <td className="p-4 text-gray-600">?50 (?25 CGST + ?25 SGST)</td>
                                        <td className="p-4 text-gray-600">Subject to Turnover</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-100 flex gap-2 items-center">
                                <Shield size={16} /> <strong>Note:</strong> You cannot file GSTR-3B until GSTR-1 is submitted.
                            </div>
                        </div>
                    </section>

                    {/* COMPARISON TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">GSTR-1 vs GSTR-3B</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">GSTR-1</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">GSTR-3B</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { f: "Purpose", r: "Details of Sales (Outward Supplies)", c: "Summary of Sales & Payments" },
                                        { f: "Tax Payment", r: "No Tax Payment here", c: "Actual Tax Paid here" },
                                        { f: "ITC Impact", r: "Passes ITC to Receiver (GSTR-2B)", c: "Claims ITC for Self" },
                                        { f: "Detail Level", r: "Invoice-wise Reporting", c: "Consolidated Summary" },
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
                    <section className="bg-gradient-to-br from-[#043E52] to-navy p-8 rounded-3xl text-white relative overflow-hidden shadow-xl mb-16">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full blur-3xl"></div>
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Why Choose ShineFiling for GSTR-1?</h2>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><FileText size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Bulk Upload</h4><p className="text-gray-300 text-sm">Upload thousands of invoices via Excel/JSON in seconds. Our system auto-validates HSN codes and Tax rates.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Shield size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Data Validation</h4><p className="text-gray-300 text-sm">We flag duplicate invoices, missing GSTINs, and mismatch in tax values before filing to the portal.</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><CheckCircle size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Amendment Support</h4><p className="text-gray-300 text-sm">Made a mistake last month? We assist in filing amendments in Table 9 to correct B2B invoice details.</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shrink-0"><Clock size={24} /></div>
                                    <div><h4 className="font-bold text-lg">Deadline Alerts</h4><p className="text-gray-300 text-sm">Automated SMS/WhatsApp reminders ensure you never miss the 11th/13th due date.</p></div>
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
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> GSTIN Number</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Sales Invoices (Excel)</li>
                                <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Credit/Debit Notes</li>
                            </ul>
                        </div>
                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Our experts are available 24/7 to guide you.</p>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Users size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Call Us</p>
                                    <p className="font-bold">+91 98765 43210</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default GSTR1Page;


