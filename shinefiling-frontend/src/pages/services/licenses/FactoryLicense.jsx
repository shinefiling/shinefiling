import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, Zap, HelpCircle, ChevronRight, TrendingUp, Users, BookOpen, Scale, Globe, Briefcase, Award, ArrowRight, Rocket, X, Factory, Building, Gavel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FactoryLicensePage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        const url = `/services/licenses/factory-license/apply?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const faqs = [
        { q: "What is a Factory License?", a: "A license granted by the Chief Inspector of Factories to use a premise as a factory under the Factories Act, 1948." },
        { q: "Who needs it?", a: "Any premise where 10+ workers are working with power, or 20+ workers without power, manufacturing process is being carried on." },
        { q: "Is Plan Approval needed?", a: "Yes, before building a factory or installing machinery, the factory plan must be approved by the Director of Factories." },
        { q: "Validity?", a: "Generally valid for 1 to 5 years (depending on state rules) and needs renewal." },
        { q: "Is inspection mandatory?", a: "Yes, a factory inspector will visit the premises to check safety, health, and welfare measures." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1565514020176-db792f3b764c?auto=format&fit=crop&q=80&w=2070"
                        alt="Factory Interior"
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
                                    <Factory size={12} className="fill-bronze" /> Factories Act, 1948
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Factory <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Plan & License</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Complete compliance for manufacturing units—from Site Plan Approval to Final Licensing. Ensuring safety and health for your workforce.
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
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">With Power</p>
                                        <p className="font-bold text-sm text-white">10+ Workers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Timeframe</p>
                                        <p className="font-bold text-sm text-white">30-60 Days</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Approval
                                </button>
                                <button className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <BookOpen size={18} /> Learn More
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Complete Package</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Plan + License</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹14,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ 5 Years</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["Plan Approval (Blueprints)", "Stability Certificate", "License Application (Form 2)", "DISH Office Liaison", "Inspection Support"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('comprehensive')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Get Started <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div className="lg:col-span-8 space-y-20">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> What is a Factory License?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                Under the <b>Factories Act, 1948</b>, every factory owner must obtain approval for building plans and a factory license before commencing manufacturing operations.
                            </p>
                            <p>
                                It is granted by the <b>Chief Inspector of Factories</b> (or DISH) and acts as a primary document proving that your unit complies with all statutory health, safety, and welfare norms.
                            </p>
                        </div>
                    </section>

                    {/* Eligibility Section */}
                    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/10 rounded-bl-[100px] -mr-10 -mt-10"></div>
                        <h2 className="text-2xl font-bold text-navy mb-6 relative z-10">Who Must Apply?</h2>
                        <div className="grid md:grid-cols-2 gap-6 relative z-10">
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-navy"><Zap size={20} /></div>
                                    <h3 className="font-bold text-navy">With Power</h3>
                                </div>
                                <p className="text-sm text-gray-800 font-bold">10 or more workers</p>
                                <p className="text-xs text-gray-600 mt-2">If manufacturing process uses power.</p>
                            </div>
                            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-amber-100 rounded-lg text-navy"><Users size={20} /></div>
                                    <h3 className="font-bold text-navy">Without Power</h3>
                                </div>
                                <p className="text-sm text-gray-800 font-bold">20 or more workers</p>
                                <p className="text-xs text-gray-600 mt-2">If manufacturing process does not use power.</p>
                            </div>
                        </div>
                    </section>

                    {/* Three Stage Process */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2B3446] mb-8">The Licensing Process</h2>
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="space-y-8">
                                <div className="relative pl-24">
                                    <div className="absolute left-0 top-0 w-16 h-16 bg-white border-2 border-bronze rounded-2xl flex items-center justify-center font-black text-2xl text-bronze shadow-sm z-10">01</div>
                                    <h3 className="text-lg font-bold text-navy">Plan Approval</h3>
                                    <p className="text-gray-600 mt-1">Submit detailed factory plans (Blueprints) for approval from the Director of Factories before construction.</p>
                                </div>
                                <div className="relative pl-24">
                                    <div className="absolute left-0 top-0 w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center font-black text-2xl text-gray-400 shadow-sm z-10">02</div>
                                    <h3 className="text-lg font-bold text-navy">License Application</h3>
                                    <p className="text-gray-600 mt-1">Once approved and machinery installed, apply for the license (Form 2) usually 15 days before operations.</p>
                                </div>
                                <div className="relative pl-24">
                                    <div className="absolute left-0 top-0 w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center font-black text-2xl text-gray-400 shadow-sm z-10">03</div>
                                    <h3 className="text-lg font-bold text-navy">Inspection & Grant</h3>
                                    <p className="text-gray-600 mt-1">A factory inspector visits to verify safety compliance. If satisfied, the license is granted.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PRICING PLANS SECTION */}
                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                                <h3 className="text-xl font-bold text-white mb-2">Plan + License</h3>
                                <div className="text-4xl font-black text-white mb-1">₹14,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees (Actuals)</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Plan Submission</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Stability Cert Support</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Final License Filing</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('comprehensive')} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Comprehensive</button>
                            </div>

                            {/* Basic License Only */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">License Only</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹7,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <p className="text-xs text-gray-500 mb-4 italic">*If Plan is already approved</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Application Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Document Verification</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Department Liaison</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('license_only')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Basic</button>
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
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Plan Approval</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form No. 1 (Application)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> ID & Address Proof</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Site Plan & Layout</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Final License</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Form No. 2</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Plan Approval Letter</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Stability Certificate</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                            <p className="text-gray-300 text-sm mb-4">We help with factory drawings and stability certificates.</p>
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

export default FactoryLicensePage;
