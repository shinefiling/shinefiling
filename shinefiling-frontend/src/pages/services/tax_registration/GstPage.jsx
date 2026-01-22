import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, ArrowRight, Star, Shield, Users, Landmark, Globe, FileText, Check, X, FileCheck, Zap, Clock, Award, ShieldCheck, Sparkles, ChevronDown, Search, Briefcase, CreditCard, Layers, Building, HelpCircle, Banknote, Handshake
} from 'lucide-react';
import GstRegistration from './GstRegistration';

const GstPage = ({ isLoggedIn }) => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Who needs to register for GST?", a: "Businesses with turnover exceeding ₹40 Lakhs (₹20 Lakhs for services, and ₹10 Lakhs for North Eastern states) must register. E-commerce sellers and interstate traders need it regardless of turnover." },
        { q: "What is the processing time?", a: "Typically, it takes 3-7 working days to get a GSTIN after successful submission and document verification." },
        { q: "Is a physical office required?", a: "Yes, you need a registered office address. However, it can be a residential property or a co-working space as well." },
        { q: "What happens if I don't register?", a: "Non-registration when mandatory can lead to heavy penalties (up to 100% of tax evaded) and you cannot claim Input Tax Credit (ITC)." },
        { q: "Can I cancel GST registration later?", a: "Yes, if you close your business or your turnover falls below the threshold, you can file for GST cancellation." },
        { q: "What is the difference between CGST, SGST, and IGST?", a: "CGST and SGST are for intrastate sales (within same state), and IGST is for interstate sales (between different states)." }
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
                        src="https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=2070"
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
                                    <Star size={12} className="fill-bronze" /> Digital Tax Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    GST <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Get your <strong className="text-white font-semibold">15-Digit GSTIN</strong> within 3-5 days. Claim Input Tax Credit and grow your business with <strong className="text-white font-semibold">100% Accuracy</strong>.
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
                                        <p className="font-bold text-sm text-white">3-7 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Approval Rate</p>
                                        <p className="font-bold text-sm text-white">99.9% Reliable</p>
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
                                    <p className="text-slate-500 font-medium text-[10px] mt-1 tracking-wide uppercase">Gst</p>
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
                                        "GST Portal Application",
                                        "Documentation Support",
                                        "Query Management"
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
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
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

            {/* PRICING */}
            <section id="pricing-section" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Layers className="text-bronze mx-auto mb-4" size={40} />
                        <h2 className="text-4xl font-bold text-navy mb-4">Compliance Tiers</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Transparent Costs. Professional Accuracy.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {/* BASIC */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-bronze/30 hover:shadow-xl transition-all flex flex-col group">
                            <h3 className="text-xl font-bold text-navy mb-2">Economy</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Essential Filing Only</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl font-black text-navy">₹999</span>
                                <span className="text-slate-300 line-through text-lg">₹1.5k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["GST Application Prep", "ARN Generation", "Identity Verification", "Basic Call Support"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-bronze" /> {f}</li>
                                ))}
                                <li className="flex gap-3 text-slate-300"><X size={18} /> Clarification Reply</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-50 text-navy font-bold rounded-xl hover:bg-navy hover:text-white transition-colors border border-slate-200">Choose Economy</button>
                        </div>

                        {/* STANDARD */}
                        <div className="bg-[#10232A] text-white rounded-3xl p-10 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col">
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-bronze via-yellow-400 to-bronze rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-bronze to-yellow-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">Most Popular</div>

                            <h3 className="text-2xl font-bold mb-2 text-white mt-4">Professional</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Full Query Resolution</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-5xl font-black text-white">₹1,499</span>
                                <span className="text-white/20 line-through text-xl">₹2.5k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-300">
                                {["Everything in Economy", "Detailed Document Review", "Department Query Handling", "Certificate Retrieval", "Priority Support"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-bronze" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-bronze/20 transition-all hover:scale-105">Launch Professional</button>
                        </div>

                        {/* PREMIUM */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-bronze/30 hover:shadow-xl transition-all flex flex-col group">
                            <h3 className="text-xl font-bold text-navy mb-2">Elite</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Full Compliance</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl font-black text-navy">₹2,999</span>
                                <span className="text-slate-300 line-through text-lg">₹5k</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-600">
                                {["Everything in Professional", "GST Nil Return (3 Months)", "Lut/Registration (Export)", "Free Billing Software", "Dedicated CA Advisor"].map((f, i) => (
                                    <li key={i} className="flex gap-3"><CheckCircle size={18} className="text-bronze" /> {f}</li>
                                ))}
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-50 text-navy font-bold rounded-xl hover:bg-navy hover:text-white transition-colors border border-slate-200">Choose Elite</button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 text-slate-600 leading-relaxed">
                <div className="lg:col-span-8 space-y-20">
                    {/* GST REGISTRATION WORKFLOW */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">GST Registration Workflow</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Business Profiling", desc: "Share your business details (Nature of supply, HSN/SAC codes) and documents with our experts." },
                                { step: "Step 2", title: "TRN Generation", desc: "We file Part A of the application to generate a Temporary Reference Number (TRN) after mobile/email OTP verification." },
                                { step: "Step 3", title: "Portal Submission", desc: "Detailed info about promoters, place of business, and bank records is uploaded. Part B is filed via DSC or EVC." },
                                { step: "Step 4", title: "ARN & Grant", desc: "An Application Reference Number (ARN) is generated. After department verification (3-7 days), the Registration Certificate (REG-06) is granted." },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">Phase</span>
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

                    {/* COMPULSORY REGISTRATION TABLE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">When is GST Mandatory? (Sec 24)</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Business Category</th>
                                        <th className="p-4 text-sm font-bold uppercase tracking-wider">Registration Trigger</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {[
                                        { c: "Inter-State Suppliers", t: "Selling goods from one state to another (No threshold)" },
                                        { c: "E-Commerce Operators", t: "Platforms like Amazon, Flipkart, or own store" },
                                        { c: "Casual Taxable Persons", t: "Temporary business in a state (e.g., in an exhibition)" },
                                        { c: "Input Service Distributors", t: "Transferring ITC among branches" },
                                        { c: "TDS/TCS Deductors", t: "Government agencies and e-com aggregators" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-bold text-navy border-r border-gray-100">{row.c}</td>
                                            <td className="p-4 text-slate-600 font-medium">{row.t}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <Award className="text-bronze" /> The GST Edge
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-lg font-medium">
                                <strong>GST Registration</strong> is the gateway to organized business in India. It enables you to collect tax from your customers and <span className="text-navy font-bold underline decoration-bronze decoration-2">Settle Credits</span> across your supply chain.
                            </p>
                            <div className="mt-12 grid md:grid-cols-2 gap-6">
                                {[
                                    { title: "Input Tax Credit", desc: "Claim back the GST paid on your purchases and operational costs.", icon: CreditCard },
                                    { title: "Legal Recognition", desc: "Gain institutional trust as a legally recognized supplier of goods/services.", icon: ShieldCheck },
                                    { title: "Market Expansion", desc: "Sell inter-state and on global e-commerce platforms like Amazon/Flipkart.", icon: Globe },
                                    { title: "Financial Legitimacy", desc: "Required for business loans, invitations to tenders, and large corporate contracts.", icon: Building },
                                ].map((box, i) => (
                                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-bronze/30 transition-all group">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-bronze transition-colors">
                                            <box.icon size={24} />
                                        </div>
                                        <h4 className="font-bold text-lg text-navy mb-2">{box.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{box.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                        <div className="bg-navy p-8 flex items-center justify-between text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-3"><Search className="text-bronze" /> GST Applicability</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#2B3446]/5 text-slate-500 border-b border-gray-200 uppercase tracking-wider font-bold">
                                    <tr>
                                        <th className="px-8 py-4">Business Type</th>
                                        <th className="px-8 py-4">Threshold (Turnover)</th>
                                        <th className="px-8 py-4">Nature</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Goods Supplier</td><td className="px-8 py-4 text-navy font-bold">₹40 Lakhs</td><td className="px-8 py-4">Normal States</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Service Provider</td><td className="px-8 py-4 text-navy font-bold">₹20 Lakhs</td><td className="px-8 py-4">PAN-India Average</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4">Special Category</td><td className="px-8 py-4 text-bronze font-bold">₹10 Lakhs</td><td className="px-8 py-4">Northeast/Hills</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-8 py-4 text-red-500">E-Commerce</td><td className="px-8 py-4 text-red-500 font-bold">Zero Threshold</td><td className="px-8 py-4 text-red-500">Mandatory</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                            <HelpCircle className="text-bronze" /> Compliance IQ
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all open:shadow-md">
                                    <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-bold text-navy hover:bg-gray-50 transition-colors list-none select-none">
                                        <span>{faq.q}</span>
                                        <ChevronDown className="group-open:rotate-180 transition-transform text-slate-400" />
                                    </summary>
                                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-gray-100">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Document Kit
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">ENTITY PROOF</p>
                                    <ul className="space-y-3">
                                        {["PAN & Aadhar of Promoters", "Passport Size Photos", "Company Incorp Cert"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">ADDRESS PROOF</p>
                                    <ul className="space-y-3">
                                        {["Electricity Bill", "Rent Agreement / NOC", "Property Tax Receipt"].map((doc, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-bronze shrink-0 mt-0.5" /> {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-navy font-bold rounded-xl text-sm transition-colors border border-slate-200">View Plans <ArrowRight size={18} /></button>
                        </div>

                        <div className="bg-navy text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">

                            <h4 className="font-bold text-xl mb-4">GST Concierge</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Dedicated tax advisors for LUT filing, ITC reconciliation and GST audit support.</p>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-bronze shadow-inner">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tax Hotline</p>
                                    <p className="font-bold text-xl text-white">080-GST-SHINE</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-bronze text-white rounded-xl font-bold text-sm hover:bg-white hover:text-navy transition-all shadow-lg shadow-bronze/20">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 bg-white ring-1 ring-white/20">
                            <div className="absolute top-4 right-4 z-50">
                                <button onClick={() => setShowRegisterModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[95vh]">
                                <GstRegistration isLoggedIn={isLoggedIn} planProp={selectedPlan} isModal={true} onClose={() => setShowRegisterModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GstPage;


