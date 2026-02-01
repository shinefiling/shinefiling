import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Shield, CheckCircle, BookOpen, Zap, HelpCircle, ChevronRight, Star, ArrowRight, UserCheck, Scale, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const PatentCompleteFilingPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        const url = `/services/intellectual-property/patent-complete/apply?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const faqs = [
        { q: "What is a Complete Specification?", a: "It is the final, detailed patent application that fully describes the invention, including claims, drawings, and best method of working. It is mandatory for the grant of a patent." },
        { q: "When should I file it?", a: "It can be filed directly (if invention is ready) or within 12 months of filing a Provisional application." },
        { q: "What is patent examination?", a: "After filing and publication, the patent office examines your application. They issue a First Examination Report (FER) listing objections (if any) which must be replied to." },
        { q: "How long is the patent valid?", a: "Once granted, the patent is valid for 20 years from the date of filing (provisional or direct complete)." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1507208773393-40d9fc9f600e?auto=format&fit=crop&q=80&w=2070"
                        alt="Final Patent"
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
                                    <Shield size={12} className="fill-bronze" /> 20 Year Protection
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Complete <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Patent Specification</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Secure the exclusive monopoly. We draft comprehensive claims and specifications to ensure your invention is granted a full patent.
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
                                        <Scale size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Legal</p>
                                        <p className="font-bold text-sm text-white">Full Rights</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Globe size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protection</p>
                                        <p className="font-bold text-sm text-white">20 Years</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                File Complete Spec
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Recommended</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Non-Provisional</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹24,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Filing</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Expert Drafting</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Detailed Claims Drafting", "Formal Drawings", "Filing Forms 1, 2, 5, 26", "Publication Request", "Examination Strategy"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('complete_std')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Proceed to File <ArrowRight size={18} />
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Filing Options</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Basic */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">After Provisional</h3>
                            <p className="text-slate-500 text-sm mb-6">Converting Provisional to Complete.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹19,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Claims Finalization</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Filing Complete Spec</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Timeline Management</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('complete_basic')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Conversion</button>
                        </div>

                        {/* Standard */}
                        <div className="bg-[#043E52] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full">
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>
                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Direct Complete</h3>
                            <p className="text-gray-400 text-sm mb-6">Full non-provisional filing.</p>
                            <div className="text-5xl font-black text-white mb-6">₹24,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Full Specification Drafting</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Extensive Claims</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Formal Drawings</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Govt Fees Extra</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg">File Complete</button>
                        </div>

                        {/* Premier */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">Expedited</h3>
                            <p className="text-slate-500 text-sm mb-6">Fast track examination.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹34,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Everything in Standard</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Expedited Request (Form 18A)</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Early Publication</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('complete_premium')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Expedited</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Importance of Complete Spec
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                The Complete Specification is the most critical document in the patent process. It defines the <span className="font-bold text-navy">scope of your legal rights</span>.
                            </p>
                            <p>
                                If the claims are too narrow, competitors can easily bypass your patent. If too broad, the patent office may reject it. Our experts ensure your claims are perfectly balanced to provide maximum protection.
                            </p>
                        </div>
                    </section>

                    <section className="bg-[#043E52] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Requirements</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Detailed Disclosure</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Fully detailed description</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Best method of performing</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Technical Drawings</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Legal Claims</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Preamble & Body</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Independent & Dependent Claims</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Abstract</li>
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

export default PatentCompleteFilingPage;
