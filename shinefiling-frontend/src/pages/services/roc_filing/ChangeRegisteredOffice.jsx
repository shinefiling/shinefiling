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
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Local Shift</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Same City</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">+ Govt Fees</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Simplest Process</p>
                                </div>
                                <div className="space-y-4 mb-8">
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

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Shifting Office?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A company must always have a registered office capable of receiving communications. Any change in this address must be reported to the ROC within 30 days to avoid huge penalties (INC-22).
                            </p>
                            <p>
                                The complexity of the process depends on whether you are shifting within the same city, to a different city in the same state, or to a completely different state.
                            </p>
                        </div>
                    </section>

                    {/* SCENARIO GUIDE */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Which Process Applies to You?</h2>
                        <div className="grid gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Building size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-2">Scenario 1: Within Same City/Town</h3>
                                    <p className="text-gray-600 mb-3 text-sm">Example: Moving from Andheri to Bandra (Mumbai).</p>
                                    <div className="inline-flex gap-2">
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-100">Simple</span>
                                        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-200">Form INC-22</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                    <MapPin size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-2">Scenario 2: Different City (Same State)</h3>
                                    <p className="text-gray-600 mb-3 text-sm">Example: Moving from Mumbai to Pune (Same State but different ROC jurisdiction).</p>
                                    <div className="inline-flex gap-2">
                                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded border border-yellow-100">Moderate</span>
                                        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-200">INC-23 + RD Approval</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                    <Truck size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-2">Scenario 3: Inter-State Transfer</h3>
                                    <p className="text-gray-600 mb-3 text-sm">Example: Moving from Bangalore (Karnataka) to Chennai (Tamil Nadu).</p>
                                    <div className="inline-flex gap-2">
                                        <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded border border-red-100">Complex</span>
                                        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded border border-gray-200">Central Govt Approval + Ads</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* INTER STATE PROCESS */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Process for Inter-State Shifting</h2>
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                            <ul className="space-y-6">
                                {[
                                    { title: "Board & General Meeting", desc: "Pass Board Resolution and Special Resolution in EGM." },
                                    { title: "MGT-14 Filing", desc: "File Special Resolution with ROC within 30 days." },
                                    { title: "Application to Federal Govt", desc: "File INC-23 with the Regional Director (RD) seeking approval." },
                                    { title: "Newspaper Advertisement", desc: "Publish notice in one English and one Vernacular newspaper." },
                                    { title: "Final Approval & Filing", desc: "Obtain RD order, file INC-28, and finally INC-22." },
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-navy">{step.title}</h4>
                                            <p className="text-sm text-gray-600">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* SAME CITY */}
                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Fastest</div>
                                <h3 className="text-xl font-bold text-white mb-2">Local Shift</h3>
                                <div className="text-4xl font-black text-white mb-1">₹1,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Same City/Town</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Form INC-22 Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Verification</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('same_city')} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Local</button>
                            </div>

                            {/* SAME ROC */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">State Shift</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹4,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Different City</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Special Resolution</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form MGT-14 + INC-22</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('same_roc')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select State</button>
                            </div>

                            {/* DIFFERENT STATE */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Inter-State</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹19,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees & Ads</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> RD Approval</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Form INC-23</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Newspaper Ads</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('different_state')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Inter-State</button>
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
