import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Scale, AlertTriangle, FileText, Send, HelpCircle, Shield,
    BookOpen, Clock, Zap, ChevronRight, Star, ArrowRight, X, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LegalNoticeDrafting = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        const url = `/services/legal-notices/legal-notice-drafting/apply?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const faqs = [
        { q: "What is a Legal Notice?", a: "A formal written communication sent by an aggrieved party to an opponent intimating the intention to take legal action." },
        { q: "Is it mandatory?", a: "In many cases like cheque bounce (Sec 138) or debt recovery, sending a legal notice is a mandatory step before filing a case." },
        { q: "Can I send it myself?", a: "While possible, a notice sent by a lawyer on firm letterhead carries significantly more weight and legal validity." },
        { q: "What happens after sending?", a: "The opposite party is given a specific time (usually 15-30 days) to respond or settle the claim." },
        { q: "What if they ignore it?", a: "If the notice is ignored, you can proceed to file a formal court case against them." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2072"
                        alt="Legal Justice"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-red-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[100px]"
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
                                    <Scale size={12} className="fill-bronze" /> Legal Action
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Legal Notice <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Drafting</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Send a powerful, legally binding message. Essential for <strong>Debt Recovery</strong>, <strong>Property Disputes</strong>, and <strong>Breach of Contract</strong>.
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
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Formal</p>
                                        <p className="font-bold text-sm text-white">Warning</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Legal</p>
                                        <p className="font-bold text-sm text-white">Protection</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Send Notice
                                </button>
                                <button onClick={() => document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Advocate Drafted</div>
                                <div className="text-center mb-6 mt-4">
                                    <h3 className="text-navy font-bold text-xl mb-2">Standard Notice</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">?1,499</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Notice</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Sent via Regd. Post</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Drafting by Lawyer", "Sent on Letterhead", "Registered Post Tracking", "Digital Copy via Email", "1 Round of Edits"].map((item, i) => (
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

            {/* --- PRICING SECTION --- */}
            <section id="pricing-plans" className="py-20 px-6 lg:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Action Packages</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Choose Your Plan</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* PLAN 1: BASIC */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Draft Only</h3>
                            <p className="text-slate-500 text-sm mb-6">You send it yourself.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?999</span>
                                <span className="text-slate-400 line-through text-sm">?1,500</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Professional Drafting</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Word / PDF Format</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Delivered via Email</li>
                                <li className="flex items-center gap-3 text-sm text-slate-400"><X size={16} /> Not on Letterhead</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Basic</button>
                        </motion.div>

                        {/* PLAN 2: STANDARD - POPULAR */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#043E52] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full"
                        >
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>
                            <div className="absolute top-6 right-6 bg-gradient-to-r from-[#ED6E3F] to-[#D4AF37] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>

                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Advocate Letterhead.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black text-white">?1,499</span>
                                <span className="text-gray-500 line-through text-sm">?2,500</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Lawyer Letterhead</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Regd. Post Dispatch</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> Tracking Number</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={16} className="text-bronze" /> 5-Day Delivery</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105">Select Standard</button>
                        </motion.div>

                        {/* PLAN 3: URGENT */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative group"
                        >
                            <h3 className="text-xl font-bold text-navy mb-2">Urgent / Priority</h3>
                            <p className="text-slate-500 text-sm mb-6">Same Day Dispatch.</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-navy">?2,499</span>
                                <span className="text-slate-400 line-through text-sm">?4,000</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Priority Drafting (2 hrs)</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Speed Post Dispatch</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> WhatsApp Copy</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Consultation Included</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Priority</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXTENSIVE CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT COLUMN (8 Cols) */}
                <div id="details-section" className="lg:col-span-8 space-y-20">

                    {/* Intro Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Scale className="text-bronze" /> The Power of a Legal Notice
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                A <strong>Legal Notice</strong> is more than just a letter; it is a serious warning and a necessary legal step before initiating a lawsuit. It gives the opponent a final chance to settle the matter without going to court.
                            </p>
                            <p>
                                Sending a notice on an Advocate's letterhead conveys the seriousness of your intent. It is often mandatory in cases like Cheque Bounces (Section 138), recovery of money, and property disputes.
                            </p>
                        </div>
                    </section>

                    {/* Use Cases Table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Common Use Cases</h2>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-2 bg-navy text-white text-center p-4 font-bold text-sm tracking-wider uppercase">
                                <div>Situation</div>
                                <div>Legal Remedy</div>
                            </div>
                            <div className="divide-y divide-gray-100 bg-white">
                                <div className="grid grid-cols-2 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm px-4">Cheque Bounce</div>
                                    <div className="text-sm text-slate-600 text-center">Section 138 NI Act</div>
                                </div>
                                <div className="grid grid-cols-2 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm px-4">Unpaid Salary / Dues</div>
                                    <div className="text-sm text-slate-600 text-center">Civil Recovery Suit</div>
                                </div>
                                <div className="grid grid-cols-2 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm px-4">Tenant Eviction</div>
                                    <div className="text-sm text-slate-600 text-center">Rent Control Act</div>
                                </div>
                                <div className="grid grid-cols-2 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm px-4">Breach of Contract</div>
                                    <div className="text-sm text-slate-600 text-center">Specific Performance</div>
                                </div>
                                <div className="grid grid-cols-2 p-4 hover:bg-gray-50 transition items-center">
                                    <div className="font-bold text-navy text-sm px-4">Defamation</div>
                                    <div className="text-sm text-slate-600 text-center">Section 499 IPC</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <Shield className="text-bronze" /> Why Send a Notice?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Clear Communication", desc: "Clearly states your grievance and demands." },
                                { title: "Evidentiary Value", desc: "Serves as crucial proof of communication in court." },
                                { title: "Opportunity to Settle", desc: "Often resolves disputes without expensive litigation." },
                                { title: "Legal Requirement", desc: "Mandatory for filing certain types of cases." },
                                { title: "Saves Time & Money", desc: "Faster and cheaper than fighting a court case." },
                                { title: "Psychological Impact", desc: "Shows you are serious about taking legal action." },
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg group">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle size={24} className="text-green-500 shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg font-bold text-navy mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Process Steps</h2>
                        <div className="space-y-6">
                            {[
                                { step: "Step 1", title: "Share Facts", days: "Day 1", desc: "Provide details of the dispute and evidence (invoices, emails)." },
                                { step: "Step 2", title: "Drafting", days: "Day 2", desc: "Our experienced lawyers draft the notice with specific legal sections." },
                                { step: "Step 3", title: "Review", days: "Day 3", desc: "You review the draft and approve it for dispatch." },
                                { step: "Step 4", title: "Dispatch", days: "Day 4", desc: "Notice is sent via Registered Post AD and tracking ID is shared." }
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-bronze/30 hover:shadow-lg transition-all duration-300">
                                    <div className="flex-shrink-0 w-full md:w-32 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-bronze/5 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-bronze font-bold flex items-center justify-center mb-2 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-navy font-bold text-sm">{item.days}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-bronze transition-colors">
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
                                <FileText className="text-bronze" /> Information Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Sender & Receiver Details</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Detailed Incident History</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Supporting Proofs</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Relief Claimed (Amount)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Reply to Notice?</h4>
                            <p className="text-gray-300 text-sm mb-4">Received a notice? We can help you draft a strong legal reply.</p>
                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">
                                Reply to Notice
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default LegalNoticeDrafting;


