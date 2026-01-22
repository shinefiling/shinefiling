import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, FileText, Globe, Briefcase, BookOpen, HelpCircle, ChevronRight, Award, Scale, MapPin, Building, Truck, ArrowRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChangeRegisteredOfficePage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Within same city/town?", a: "Yes, it's the simplest process. Just a Board Resolution and filing Form INC-22 is required. Verification of the new office is mandatory." },
        { q: "From one state to another?", a: "This is a complex 4-6 month process. It involves Central Govt (Regional Director) approval, newspaper advertisements, and changing the registered office clause in the MOA." },
        { q: "Within same state but different ROC?", a: "Requires Regional Director (RD) approval via Form INC-23. (e.g., Shifting from Mumbai to Pune in Maharashtra)." },
        { q: "Can we shift to a residential address?", a: "Yes, a residential address can be used as a registered office provided you have the NOC from the owner and a utility bill." },
        { q: "What documents serve as address proof?", a: "Electricity Bill, Gas Bill, Mobile Bill, or Telephone Bill (not older than 2 months)." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/roc-filing/change-registered-office/register?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070"
                        alt="Modern Office"
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
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze/20 text-bronze border border-bronze/30 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    <MapPin size={12} className="fill-bronze" /> Compliance Update
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Change of <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registered Office</span>
                                </h1>
                                <p className="text-gray-300 text-xl max-w-xl font-light leading-relaxed">
                                    Moving your business? Ensure your company's official address is updated with the ROC. We handle everything from local shifts to complex inter-state transfers.
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
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Process</p>
                                        <p className="font-bold text-sm text-white">End-to-End</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Globe size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Scope</p>
                                        <p className="font-bold text-sm text-white">Pan India</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Update Address
                                </button>
                            </div>
                        </div>

                        {/* Pricing Card */}
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
                                    <h3 className="text-navy font-bold text-xl mb-2">Same City</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">+ Govt Fees</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Simplest Process</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Board Resolution Drafting", "Rent Agreement Verification", "Form INC-22 Filing", "NOC Template", "Liaison with ROC"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('same_city')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Change Address <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- PRICING SECTION (3 PLANS) --- */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Choose Your Process</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Transparent Pricing</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* SAME CITY - Featured */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#10232A] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full"
                        >
                            {/* Top Gold Line */}
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>

                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#B58863] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Fastest
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 mt-4">Local Shift</h3>
                            <div className="text-5xl font-black text-white mb-2">₹1,999</div>
                            <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-wide">+ Govt Fees</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> Same City/Town</li>
                                <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> Form INC-22 Filing</li>
                                <li className="flex gap-3 text-sm text-gray-200"><div className="bg-bronze/20 p-1 rounded-full"><CheckCircle size={14} className="text-bronze" /></div> Verification</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('same_city')} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg shadow-bronze/20 transition-all hover:scale-105">
                                Select Local
                            </button>
                        </motion.div>

                        {/* SAME ROC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">State Shift</h3>
                            <div className="text-4xl font-black text-navy mb-2">₹4,999</div>
                            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">+ Govt Fees</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Different City</li>
                                <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Special Resolution</li>
                                <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form MGT-14 + INC-22</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('same_roc')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Select State
                            </button>
                        </motion.div>

                        {/* DIFFERENT STATE */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-bronze/30 transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Inter-State</h3>
                            <div className="text-4xl font-black text-navy mb-2">₹19,999</div>
                            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">+ Govt Fees & Ads</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> RD Approval</li>
                                <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form INC-23</li>
                                <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Newspaper Ads</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('different_state')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Select Inter-State
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-20">
                    {/* DETAILED SEO CONTENT SECTION - COMPREHENSIVE GUIDE */}
                    <section className="mt-10 space-y-12 mb-20">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Comprehensive Guide to Shifting Office</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">

                                {/* Introduction */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <BookOpen className="text-bronze" /> Shifting Office?
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        A company must always have a registered office capable of receiving communications. Any change in this address must be reported to the ROC within 30 days to avoid huge penalties (INC-22).
                                    </p>
                                    <p>
                                        The complexity of the process depends on whether you are shifting within the same city, to a different city in the same state, or to a completely different state.
                                    </p>
                                </div>

                                {/* Scenarios */}
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4">Which Process Applies to You?</h3>
                                    <div className="grid gap-6">
                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                                            <div className="shrink-0"><Building size={32} className="text-blue-600" /></div>
                                            <div>
                                                <h4 className="font-bold text-navy text-lg">Scenario 1: Within Same City/Town</h4>
                                                <p className="text-sm text-gray-600">e.g., Andheri to Bandra (Mumbai). Only verification (INC-22) needed.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                                            <div className="shrink-0"><MapPin size={32} className="text-purple-600" /></div>
                                            <div>
                                                <h4 className="font-bold text-navy text-lg">Scenario 2: Different City (Same State)</h4>
                                                <p className="text-sm text-gray-600">e.g., Mumbai to Pune. Needs RD Approval (Form INC-23).</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                                            <div className="shrink-0"><Truck size={32} className="text-orange-600" /></div>
                                            <div>
                                                <h4 className="font-bold text-navy text-lg">Scenario 3: Inter-State Transfer</h4>
                                                <p className="text-sm text-gray-600">e.g., Karnataka to Tamil Nadu. Complex process involving Central Govt approval.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inter-State Process */}
                                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                                    <h3 className="text-xl font-bold text-navy mb-4">Process for Inter-State Shifting</h3>
                                    <ul className="space-y-4">
                                        {[
                                            "Pass Board Resolution and Special Resolution in EGM.",
                                            "File MGT-14 with ROC within 30 days.",
                                            "File INC-23 with the Regional Director (RD) seeking approval.",
                                            "Publish notice in one English and one Vernacular newspaper.",
                                            "Obtain RD order, file INC-28, and finally INC-22."
                                        ].map((step, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                                                <div className="font-bold text-bronze">{i + 1}.</div> {step}
                                            </li>
                                        ))}
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
                                <p className="text-sm opacity-80">Legal proof of your new address.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Filing Receipt", type: "INC-22 / INC-23", due: "Immediate" },
                                    { name: "Rent Agreement Draft", type: "Word/PDF", due: "Day 1" },
                                    { name: "NOC from Owner", type: "Legal Draft", due: "Day 1" },
                                    { name: "Board Resolution", type: "Draft", due: "Day 1" },
                                    { name: "New COI", type: "Certificate", due: "State Change Only" }
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
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">New Office Proof</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Utility Bill (Latest)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Rent Agreement (if rented)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> NOC from Owner</li>
                                    </ul>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800">
                                    <strong>Note:</strong> Notarized Rent Agreement is mandatory for ROC filing.
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
                            <p className="text-gray-300 text-sm mb-4">Unsure if your move needs RD approval?</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChangeRegisteredOfficePage;
