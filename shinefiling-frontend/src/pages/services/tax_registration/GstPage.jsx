import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, FileText, Shield, ChevronRight, User, Component, TrendingUp, Building2, Landmark, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

const GstPage = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is GST Registration?", a: "Goods and Services Tax (GST) is a unified tax system in India. Registration is mandatory for businesses with turnover exceeding ₹20 lakhs (₹10 lakhs for special states) or those involved in interstate trade." },
        { q: "Who needs compulsory registration?", a: "Businesses making interstate supplies, e-commerce sellers, and those employing TDS deduction must register regardless of turnover." },
        { q: "What documents are required?", a: "PAN, Aadhaar, Photo, Business Address Proof (Electricity bill/Rent agreement), and Bank details are primary requirements." },
        { q: "What is HSN/SAC Code?", a: "HSN (Harmonized System of Nomenclature) is for goods, and SAC (Service Accounting Code) is for services. These codes classify your goods/services for tax rates." },
        { q: "How long does it take?", a: "Usually, GST registration takes 3-7 working days after submission, subject to government processing and query clearance." },
        { q: "Is Digital Signature (DSC) needed?", a: "DSC is mandatory for Companies and LLPs. For Proprietorships, Aadhaar e-Sign is sufficient." },
    ];

    const handlePlanSelect = (plan) => {
        if (isLoggedIn) {
            navigate(`/services/gst-registration/register?plan=${plan}`);
        } else {
            navigate('/login', { state: { from: `/services/gst-registration/register?plan=${plan}` } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] text-[#2B3446] font-sans pb-24">

            {/* HERO SECTION */}
            <div className="bg-[#F4F7FE] text-[#2B3446] pt-36 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[100px]"
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-[#2B3446] mb-8 uppercase text-xs font-bold tracking-wider transition-colors group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Services
                    </button>

                    <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-4 border border-orange-200">
                                    MANDATORY COMPLIANCE
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-[#2B3446]">
                                    GST Registration <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Apply Online</span>
                                </h1>
                                <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl">
                                    Get your GSTIN within 3-7 days. 100% Online process. Mandatory for businesses with turnover &gt; ₹20 Lakhs.
                                </p>
                            </motion.div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 bg-white pr-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Time</p>
                                        <p className="font-bold text-sm text-[#2B3446]">3-7 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white pr-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Receipt size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Process</p>
                                        <p className="font-bold text-sm text-[#2B3446]">Fully Online</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Card - Standard Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full md:w-[400px] bg-white text-[#2B3446] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                            <div className="p-8 text-center relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-4">Recommended</span>
                                <div className="flex justify-center items-end gap-2 mb-2">
                                    <h3 className="text-5xl font-black text-[#2B3446]">₹2,499</h3>
                                    <span className="text-xl text-slate-400 line-through mb-1">₹3,999</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">+ Govt Fees (if any)</p>
                            </div>

                            <div className="px-8 pb-8 bg-white relative z-10">
                                <ul className="space-y-3 mb-8">
                                    {[
                                        "GST Filing & ARN Generation",
                                        "GST Certificate Download",
                                        "HSN/SAC Classification",
                                        "Officer Query Handling (1 Round)",
                                        "Expert Support"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                            <div className="mt-0.5 p-1 rounded-full bg-orange-100 text-orange-600">
                                                <CheckCircle size={10} />
                                            </div>
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePlanSelect('standard')}
                                    className="w-full py-4 bg-[#2B3446] hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-1"
                                >
                                    Get Started
                                </button>
                                <button
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full mt-3 py-2 text-sm font-bold text-slate-500 hover:text-[#2B3446] hover:underline transition"
                                >
                                    Explore All Plans
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                <div className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-black text-[#2B3446] mb-6 flex items-center gap-3">
                            <Landmark className="text-orange-600" /> One Nation, One Tax
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                <strong>GST Registration</strong> is the first step towards recognizing your business as a legal supplier of goods or services.
                            </p>
                            <p>
                                It not only legalizes your business but also opens up opportunities to sell across India (Interstate) and on e-commerce platforms like Amazon, Flipkart, etc. It allows you to claim Input Tax Credit (ITC), reducing your cost of business.
                            </p>
                        </div>
                    </section>

                    {/* Benefits Grid */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2B3446] mb-8">Why Register for GST?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Legally Recognized", desc: "Your business becomes a legally recognized entity.", icon: Shield },
                                { title: "Interstate Sales", desc: "Sell your goods across state borders without restrictions.", icon: TrendingUp },
                                { title: "E-Commerce Ready", desc: "Mandatory for selling online on marketplaces.", icon: Globe }, // Used Globe instead of ShoppingCart for imports
                                { title: "Input Tax Credit", desc: "Claim credit for taxes paid on purchases.", icon: Component },
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                                        {benefit.icon && <benefit.icon size={28} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2B3446] mb-2 text-lg">{benefit.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PRICING PLANS */}
                    <section id="pricing-section" className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[#2B3446]">Choose Your GST Plan</h2>
                            <p className="text-slate-500 mt-3">Simple pricing for hassle-free registration.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Basic */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Basic</h3>
                                <div className="text-4xl font-black text-[#2B3446] mb-1">₹999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["GST Registration Filing", "ARN Generation", "GST Certificate"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                                            <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('basic')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-[#2B3446] font-bold hover:bg-[#2B3446] hover:text-white transition">Select Basic</button>
                            </div>

                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-8 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Recommended</div>
                                <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
                                <div className="text-4xl font-black text-white mb-1">₹2,499</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Basic", "HSN/SAC Selection", "Officer Query Handling (1 Round)", "Business Classification"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                                            <CheckCircle size={16} className="text-orange-400 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg hover:shadow-orange-500/50 transition">Choose Standard</button>
                            </div>

                            {/* Premium */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Premium</h3>
                                <div className="text-4xl font-black text-[#2B3446] mb-1">₹4,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    {["Everything in Standard", "GST Login Setup", "Bank Account Linking", "3 Months Return Guidance"].map((feat, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                                            <CheckCircle size={16} className="text-green-500 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-[#2B3446] font-bold hover:bg-[#2B3446] hover:text-white transition">Select Premium</button>
                            </div>
                        </div>

                    </section>

                    {/* FAQs */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2B3446] mb-8 flex items-center gap-3">
                            <Shield className="text-orange-600" /> Frequently Asked Questions
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
                            <h3 className="font-bold text-xl text-[#2B3446] mb-6 flex items-center gap-2">
                                <FileText className="text-orange-600" /> Documents Required
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Business/Proprietor</h4>
                                    <ul className="space-y-3">
                                        {["PAN Card", "Aadhaar Card", "Photo"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Proof of Address</h4>
                                    <ul className="space-y-3">
                                        {["Electricity Bill", "Rent Agreement (if rented)", "NOC from Owner"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Bank Proof</h4>
                                    <ul className="space-y-3">
                                        {["Cancelled Cheque / Passbook"].map((d, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
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

        </div>
    );
};

export default GstPage;
