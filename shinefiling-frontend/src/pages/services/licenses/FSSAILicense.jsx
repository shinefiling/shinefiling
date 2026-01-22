import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, FileText, Rocket, Utensils, Award, Shield, MapPin, Truck, ChevronRight, HelpCircle, Users, BookOpen, Scale, Globe, Briefcase, Zap, Star, ArrowRight, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FSSAILicensePage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Is FSSAI mandatory for home kitchens?", a: "Yes, even small home bakers or cloud kitchens selling food need at least a Basic Registration." },
        { q: "What is the validity of the license?", a: "You can choose between 1 to 5 years. Longer validity saves renewal hassle and fees." },
        { q: "Difference between Registration & License?", a: "Registration (Form A) is for turnover < ₹12 Lakhs. License (Form B) is for turnover > ₹12 Lakhs." },
        { q: "Do I need a license for each branch?", a: "Yes, every premise where food is handled needs a separate license. A Central License is needed for Head Office if you have branches in multiple states." },
        { q: "Is physical inspection required?", a: "For State and Central licenses, a Food Safety Officer usually inspects the premises before granting the license." },
    ];

    const handlePlanSelect = (turnoverType) => {
        const url = `/services/licenses/fssai-license/register?type=${turnoverType}`;
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
                        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=2070"
                        alt="Food Safety"
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
                                    <Utensils size={12} className="fill-bronze" /> Food Safety Authority
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    FSSAI Food <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">License</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Mandatory for every food business, from home bakers to large manufacturers. Ensure quality, build trust, and operate legally with a valid 14-digit FSSAI number.
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
                                        <Award size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Compliance</p>
                                        <p className="font-bold text-sm text-white">Mandatory</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">7-10 Days</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Apply Now
                                </button>
                                <button className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Globe size={18} /> Learn More
                                </button>
                            </div>
                        </div>

                        {/* Pricing Card - Floating Glass Effect */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Popular</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Basic Registration</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,499</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Year</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Turnover < ₹12 Lakhs", "FSSAI Registration (Form A)", "Petty Food Retailers", "Home Bakers / Stalls", "Application Filing"].map((item, i) => (
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
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div className="lg:col-span-8 space-y-20">

                    {/* DETAILED SEO CONTENT SECTION - COMPREHENSIVE GUIDE */}
                    <section className="mt-10 space-y-12 mb-20">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to FSSAI Licensing</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen className="text-bronze" /> What is FSSAI License?
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        The Food Safety and Standards Authority of India (FSSAI) is the governing body that regulates the food business in India. An FSSAI license (14-digit number) is mandatory for any business involved in food manufacturing, processing, storage, distribution, or sale.
                                    </p>
                                    <p>
                                        It ensures that the food products undergo certain quality checks, thereby reducing instances of food adulteration and substandard products. It essentially acts as a seal of approval and safety for customers.
                                    </p>
                                </div>

                                {/* License Types Guide */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-navy mb-4">Types of FSSAI Registrations</h3>
                                    <div className="grid md:grid-cols-1 gap-6">
                                        {[
                                            { title: "Basic Registration (Form A)", criteria: "Turnover < ₹12 Lakhs / Year", desc: "For petty food business operators, hawkers, home bakers, and small stalls.", icon: Utensils },
                                            { title: "State License (Form B)", criteria: "Turnover ₹12 Lakhs - ₹20 Crore / Year", desc: "For mid-sized manufacturers, distributors, hotels, and restaurants operating in a single state.", icon: Building },
                                            { title: "Central License (Form B)", criteria: "Turnover > ₹20 Crore / Year", desc: "For large manufacturers, importers, exporters, and businesses supplying to government offices or operating in multiple states.", icon: Globe },
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 border rounded-xl bg-white">
                                                <div className="mt-1"><item.icon size={24} className="text-bronze" /></div>
                                                <div>
                                                    <h4 className="font-bold text-navy text-lg">{item.title} <span className="text-sm font-normal text-gray-500 ml-2">({item.criteria})</span></h4>
                                                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comparison Table */}
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[#2B3446] text-white">
                                            <tr>
                                                <th className="px-6 py-4">Feature</th>
                                                <th className="px-6 py-4 bg-white/10">Basic</th>
                                                <th className="px-6 py-4">State</th>
                                                <th className="px-6 py-4">Central</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Annual Turnover</td><td className="px-6 py-4 text-gray-600">Up to ₹12 Lakhs</td><td className="px-6 py-4 text-gray-600">₹12 Lakhs - ₹20 Cr</td><td className="px-6 py-4 text-gray-600">Above ₹20 Cr</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Form Type</td><td className="px-6 py-4 text-gray-600">Form A</td><td className="px-6 py-4 text-gray-600">Form B</td><td className="px-6 py-4 text-gray-600">Form B</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Govt Fee (Approx)</td><td className="px-6 py-4 text-gray-600">₹100 / Year</td><td className="px-6 py-4 text-gray-600">₹2000 - ₹5000 / Year</td><td className="px-6 py-4 text-gray-600">₹7500 / Year</td></tr>
                                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-navy">Inspection</td><td className="px-6 py-4 text-gray-600">Rare</td><td className="px-6 py-4 text-gray-600">Likely</td><td className="px-6 py-4 text-gray-600">Mandatory</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Renewal & Penalties */}
                                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
                                    <h3 className="text-2xl font-bold text-navy mb-2 flex items-center gap-2"><Shield size={24} className="text-orange-500" /> Compliance & Renewal</h3>
                                    <p className="text-gray-700 leading-relaxed max-w-2xl mb-4">
                                        FSSAI license is issued for a specific period (1 to 5 years). It must be renewed <strong>30 days before expiry</strong>.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-orange-800 font-bold">
                                            <ChevronRight size={16} /> Late Renewal Penalty: ₹100 per day
                                        </li>
                                        <li className="flex items-center gap-2 text-orange-800 font-bold">
                                            <ChevronRight size={16} /> Operating without License: Fine up to ₹5 Lakhs & Imprisonment (Section 63)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MANDATORY DELIVERABLES */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-navy mb-8">What You Will Receive</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-navy text-white">
                                <p className="text-sm opacity-80">Official documents you get after approval.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "FSSAI Registration Certificate", type: "Digital Copy", due: "Approval" },
                                    { name: "14-Digit License Number", type: "Unique ID", due: "Immediate" },
                                    { name: "QR Code Food Safety Display Board", type: "Compliance", due: "Mandatory" },
                                    { name: "Application Receipt", type: "Proof", due: "Day 1" },
                                    { name: "Guidance on Annual Returns", type: "Support", due: "Lifetime" }
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

                    {/* PRICING PLANS SECTION */}
                    <section id="pricing-plans" className="bg-white relative overflow-hidden rounded-3xl p-8 border border-gray-100 shadow-sm mb-20">
                        <div className="text-center mb-16">
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Plan</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Simple Pricing</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Basic */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Basic Registration</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹1,499</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Turnover {'<'} ₹12L</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form A Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> 1 Year Validity</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Basic</button>
                            </div>

                            {/* State - Highlighted */}
                            <div className="bg-[#10232A] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-6 flex flex-col">
                                {/* Top Gold Line */}
                                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C]"></div>

                                <div className="absolute top-6 right-6 bg-gradient-to-r from-[#B58863] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                    Most Common
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 mt-4">State License</h3>
                                <div className="text-4xl font-black text-white mb-1">₹4,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> Turnover ₹12L - ₹20Cr</li>
                                    <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> Form B Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> Manufacture / Hotel / Retail</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">Select State</button>
                            </div>

                            {/* Central */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Central License</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹7,499</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Turnover {'>'} ₹20Cr</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form B (Central)</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Import / Export / Railway</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Central</button>
                            </div>
                        </div>
                    </section>

                    {/* EXISTING LICENSE SERVICES (Renewal & Correction) */}
                    <section className="bg-white relative overflow-hidden rounded-3xl p-8 border border-gray-100 shadow-sm mb-20">
                        <div className="text-center mb-10">
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Maintain Your License</span>
                            <h2 className="text-3xl font-bold text-navy mb-4">Renewal & Corrections</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">Already have an FSSAI license? We handle renewals and modifications to keep you compliant.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Renewal */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Time Critical</div>
                                <h3 className="text-xl font-bold text-navy mb-2">License Renewal</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees (As per years)</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> File 30 days before expiry</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Avoid ₹100/day Penalty</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Validity Extension (1-5 Yrs)</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Apply for Renewal</button>
                            </div>

                            {/* Modification */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Modification / Correction</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹1,499</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Change Address / Partners</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Add/Remove Food Products</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Update Business Name</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Apply for Modification</button>
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

                        {/* Checklist Sidebar */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Common Documents</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> ID Proof/Photo of Owner</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Proof of Possession of Premise</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">State/Central Only</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> List of Food Products</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form IX (Nomination)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Blueprint/Layout Plan</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">Confused about State vs Central License category?</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FSSAILicensePage;


