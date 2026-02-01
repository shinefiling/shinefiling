import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, FileText, Clock, Search, Shield, CheckCircle, BookOpen, Zap, HelpCircle, ChevronRight, Star, ArrowRight, UserCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const PatentProvisionalFilingPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        const url = `/services/intellectual-property/patent-provisional/apply?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const faqs = [
        { q: "What is a Provisional Patent Application?", a: "It is a preliminary application filed to secure a priority date for your invention. It does not require detailed claims but must describe the invention sufficiently." },
        { q: "What is the benefit of filing it?", a: "It gives you 'Patent Pending' status and secures your date of invention. You get 12 months to test the market or finalize the product before filing the expensive Compete Specification." },
        { q: "Can I sell my invention after filing this?", a: "Yes, once filed, you can disclose your invention to investors or sell it without losing the novelty rights." },
        { q: "What happens after 12 months?", a: "You MUST file a Complete Specification within 12 months. If not, your provisional application will be abandoned and you lose the priority date." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1639322537228-ad71c7137f69?auto=format&fit=crop&q=80&w=2070"
                        alt="Blueprint"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
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
                                    <Clock size={12} className="fill-bronze" /> Secure Priority Date
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Provisional <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Patent Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Got an idea? Don't wait. File a provisional application today to lock your priority date and get "Patent Pending" status for 12 months.
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
                                        <Lock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                        <p className="font-bold text-sm text-white">Patent Pending</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Validity</p>
                                        <p className="font-bold text-sm text-white">12 Months</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                File Provisional Now
                            </button>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full md:w-[360px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl relative"
                        >
                            <div className="bg-white rounded-[20px] p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Low Cost</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Provisional Filing</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹8,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ App</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Professional Drafting</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Drafting Technical Specs", "Filing Form 1 & 2", "Priority Date Locked", "12 Months Protection"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('provisional_std')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Get Started <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* PRICING PLANS */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Our Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Provisional Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Basic */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">Filing Only</h3>
                            <p className="text-slate-500 text-sm mb-6">If you have a draft ready.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹4,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Form 1 Preparation</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Online Filing</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Receipt Generation</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('provisional_basic')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Basic</button>
                        </div>

                        {/* Standard */}
                        <div className="bg-[#043E52] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full">
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>
                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Drafting + Filing</h3>
                            <p className="text-gray-400 text-sm mb-6">We write the technical spec.</p>
                            <div className="text-5xl font-black text-white mb-6">₹8,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Professional Drafting</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Forms 1, 2, 3 Filing</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Govt Fee Extra (approx ₹1600)</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg">File Provisional</button>
                        </div>

                        {/* Premier */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">Search + File</h3>
                            <p className="text-slate-500 text-sm mb-6">Ensure it's unique first.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹13,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Comprehensive Novelty Search</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Drafting + Filing</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Strategic Consultation</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('provisional_premium')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Premium</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Why File Provisional?
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                A Provisional Patent is the fastest and most cost-effective way to secure your invention.
                            </p>
                            <p>
                                It establishes a <span className="font-bold text-navy">Priority Date</span> for your invention. This means any similar invention filed after this date will be considered "secondary" to yours. You get 12 months to develop your product, test the market, or find investors before spending money on the final Complete Specification.
                            </p>
                        </div>
                    </section>

                    <section className="bg-[#043E52] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Documents Required</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Technical</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Title of Invention</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Description of Working</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Basic Drawings / Sketches</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Applicant</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Name & Address</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Nationality</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> ID Proof</li>
                                    </ul>
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
            </div>
        </div>
    );
};

export default PatentProvisionalFilingPage;
