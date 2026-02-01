
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Shield, Users, Star, Globe, FileCheck, Check, X, Calendar, Zap, Clock, ShieldCheck, ChevronDown, Search, CreditCard, Layers, RefreshCw, Edit3, MapPin, FileText, HelpCircle, Banknote, Handshake
} from 'lucide-react';
import GstAmendmentRegistration from './GstAmendmentRegistration';

const GstAmendmentPage = ({ isLoggedIn }) => {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('core');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is Core Field Amendment?", a: "Core fields include Legal Name of Business, Address of Principal Place of Business, and Addition/Deletion of Partners/Directors. These require officer approval." },
        { q: "What is Non-Core Field Amendment?", a: "Non-Core fields include Email, Mobile Number, Bank Details, etc. These get auto-approved instantly upon filing." },
        { q: "How long does it take for address change?", a: "Address change is a Core amendment. Once filed, the tax officer will verify the documents and approve it within 15 working days." },
        { q: "Can I change my PAN in GST?", a: "No, GSTIN is PAN-based. If your PAN changes (e.g., Proprietorship to Pvt Ltd), you need to apply for a NEW GST Registration, not an amendment." },
        { q: "Is physical verification done for address change?", a: "In some cases, if the officer deems it necessary, they may trigger a physical verification before approving a new address." }
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            setSelectedPlan(plan);
            setShowRegistrationModal(true);
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
                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070"
                        alt="Legal Documents"
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

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-left">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                        {/* Hero Content - Left Aligned */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <Star size={12} className="fill-bronze" /> Compliance Management
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST Amendment <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">& Correction</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Update your business details on the GST portal without hassles. Our experts handle <strong className="text-white font-semibold">Address</strong>, <strong className="text-white font-semibold">Business Name</strong>, and <strong className="text-white font-semibold">Core/Non-Core Amendments</strong> for you.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Turnaround</p>
                                        <p className="font-bold text-sm text-white">48 Hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expert Aid</p>
                                        <p className="font-bold text-sm text-white">24/7 Support</p>
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
                                    Modify GST Now
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Amendment Guide
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Gst Amendment</p>
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
                                        "Core Fields Modification",
                                        "Non-Core Amendments",
                                        "Documentation Support"
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

            {/* MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        {/* SEO CONTENT SECTION */}
                        <section className="space-y-12">
                            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                                <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to GST Registration Amendment</h2>

                                <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                    <div>
                                        <h3 className="text-xl font-bold text-navy mb-4">Why is GST Amendment Necessary?</h3>
                                        <p>
                                            In a dynamic business environment, changes like relocating your office, scaling your team (adding directors), or rebranding your business (name change) are common. However, your GST certificate must always reflect the current reality of your business. Failing to update these details can lead to valid input tax credits being blocked, notices for non-compliance, and even suspension of your GSTIN.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                                <Layers size={20} className="text-bronze" /> Core Field Amendments
                                            </h3>
                                            <p className="text-sm mb-4 italic text-gray-500">Requires Tax Officer's Approval (15 Days)</p>
                                            <ul className="space-y-3 list-disc pl-5 text-sm">
                                                <li><strong>Legal Name Change:</strong> Changing the trade or legal name of the entity.</li>
                                                <li><strong>Address Change:</strong> Moving the Principal Place of Business or adding additional locations.</li>
                                                <li><strong>Stakeholder Updates:</strong> Addition, deletion, or modification of details of Partners, Directors, or Managing Committees.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                                <Zap size={20} className="text-bronze" /> Non-Core Field Amendments
                                            </h3>
                                            <p className="text-sm mb-4 italic text-gray-500">Auto-Approved Instantly</p>
                                            <ul className="space-y-3 list-disc pl-5 text-sm">
                                                <li><strong>Contact Details:</strong> Updating Registered Mobile numbers or Email addresses.</li>
                                                <li><strong>Bank Account:</strong> Adding or changing bank accounts linked to your GSTIN.</li>
                                                <li><strong>Business Category:</strong> Updating the nature of business activity or HSN/SAC codes.</li>
                                                <li><strong>Authorized Signatory:</strong> Changing the details of the person authorized to sign GST returns.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-bronze/5 p-8 rounded-3xl border border-bronze/10 mt-12">
                                        <h3 className="text-2xl font-bold text-navy mb-6">Crucial Points to Remember</h3>
                                        <p className="mb-6">
                                            Timing is everything in GST compliance. Most amendments must be filed within 15 days of the change.
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {[
                                                "Address change requires new electricity bill",
                                                "PAN change requires NEW Registration",
                                                "NOC from owner is mandatory for rented sites",
                                                "Bank accounts must be validated via OTP",
                                                "Directors must have valid DIN for Core updates",
                                                "Updated Certificate issued after approval"
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-navy/80 font-medium text-sm">
                                                    <CheckCircle size={16} className="text-green-600" /> {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="pricing-section" className="mt-20">
                            <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                                <CreditCard className="text-bronze" /> Correction Plans
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                {/* NON-CORE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                                >
                                    <h3 className="text-xl font-bold text-navy mb-2">Non-Core</h3>
                                    <p className="text-slate-500 text-sm mb-6">Simple Updates</p>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-4xl font-black text-navy">?499</span>
                                        <span className="text-slate-400 line-through text-lg">?1k</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                        {["Email ID Change", "Mobile No. Change", "Bank Account Update", "Instant Approval"].map((f, i) => (
                                            <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                        ))}
                                    </ul>
                                    <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Start Changes</button>
                                </motion.div>

                                {/* CORE */}
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

                                    <h3 className="text-xl font-bold text-white mb-2 mt-2">Gst Amendment</h3>
                                    <p className="text-gray-400 text-sm mb-6">Comprehensive Solution</p>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-5xl font-black text-white">?999</span>
                                        <span className="text-gray-500 line-through text-sm">?2k</span>
                                    </div>

                                    <ul className="space-y-4 mb-8 flex-1">
                                        {["Principal Address Change",
                                            "Trade Name Change",
                                            "Branch Addition"].map((feat, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                                    <div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> {feat}
                                                </li>
                                            ))}
                                    </ul>
                                    <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                        Get Started
                                    </button>
                                </motion.div>

                                {/* COMPLEX */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                                >
                                    <h3 className="text-xl font-bold text-navy mb-2">Director Change</h3>
                                    <p className="text-slate-500 text-sm mb-6">Management Update</p>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-4xl font-black text-navy">?1,499</span>
                                        <span className="text-slate-400 line-through text-lg">?3k</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                        {["Add/Remove Directors", "Change in Partners", "Authorized Signatory", "Board Resolution Draft"].map((f, i) => (
                                            <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-green-500" /> {f}</li>
                                        ))}
                                    </ul>
                                    <button onClick={() => handlePlanSelect('startup')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Plan</button>
                                </motion.div>
                            </div>
                        </section>

                        {/* COMPARISON SECTION */}
                        <section className="mt-20">
                            <h2 className="text-3xl font-bold text-navy mb-8">Amendment vs. New Registration</h2>
                            <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-lg">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-navy text-white">
                                            <th className="p-4 text-sm font-bold uppercase tracking-wider">Feature</th>
                                            <th className="p-4 text-sm font-bold uppercase tracking-wider">Amendment</th>
                                            <th className="p-4 text-sm font-bold uppercase tracking-wider">New Registration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {[
                                            { f: "GSTIN Number", r: "Remains Same", c: "New Number Generated" },
                                            { f: "Input Tax Credit", r: "Retained in Electronic Ledger", c: "Must be transferred via ITC-02" },
                                            { f: "Use Case", r: "Change in Address/Name within State", c: "Change of State / Constitution Change (e.g. Prop to Pvt Ltd)" },
                                            { f: "Processing Time", r: "0 - 15 Days", c: "7 Days (Standard)" },
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

                        {/* FAQ SECTION */}
                        <section className="mt-20">
                            <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                                <HelpCircle className="text-bronze" /> Frequently Asked Questions
                            </h2>
                            <div className="grid md:grid-cols-1 gap-4">
                                {faqs.map((faq, index) => (
                                    <details key={index} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-gray-50 transition select-none">
                                            <span className="pr-4">{faq.q}</span>
                                            <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                                        </summary>
                                        <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                    <FileText className="text-bronze" /> Required Documents
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">1. Address Change</h4>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement / NOC</li>
                                            <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Electricity Bill (Latest)</li>
                                            <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Property Tax Receipt</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">2. Non-Core Updates</h4>
                                        <ul className="space-y-3">
                                            <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Cancelled Cheque (For Bank)</li>
                                            <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Director DIN (For Directors)</li>
                                            <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Resolution Letter</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Support Card */}
                            <div className="bg-[#043E52] text-white p-6 rounded-3xl shadow-lg">
                                <h4 className="font-bold text-lg mb-2">Need Expert Help?</h4>
                                <p className="text-gray-300 text-sm mb-4">Chat with our compliance team for specialized drafting of board resolutions.</p>
                                <button className="w-full py-3 bg-bronze text-white rounded-xl font-bold text-sm hover:bg-white hover:text-navy transition-all">View Plans <ArrowRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showRegistrationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                            <div className="absolute top-4 right-4 z-50">
                                <button onClick={() => setShowRegistrationModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[95vh]">
                                <GstAmendmentRegistration isLoggedIn={isLoggedIn} planProp={selectedPlan} isModal={true} onClose={() => setShowRegistrationModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GstAmendmentPage;


