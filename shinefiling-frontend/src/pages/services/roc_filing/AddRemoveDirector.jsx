import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, CheckCircle, FileText, Shield, HelpCircle, ChevronRight, BookOpen, Users, UserPlus, UserMinus, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddRemoveDirectorPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "How to add a director?", a: "To add a director, the person must obtain a DSC and DIN. Then Form DIR-12 is filed with the ROC along with the consent letter (DIR-2)." },
        { q: "How to remove a director?", a: "A director can resign by filing DIR-11 (by director) and DIR-12 (by company). Removal by company requires a special resolution and opportunity of being heard." },
        { q: "What is the minimum directors required?", a: "Private Limited: 2, Public Limited: 3, OPC: 1 Director." },
        { q: "Can a foreign national be a director?", a: "Yes, provided they have a valid DIN and at least one director on the Board is an Indian Resident." },
        { q: "Time taken for the process?", a: "The filing process typically takes 3-5 working days after obtaining DSC and standardizing documents." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/roc-filing/add-remove-director/register?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2070"
                        alt="Corporate Meeting"
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
                                    <Users size={12} className="fill-bronze" /> Board Reconstruction
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Add / Remove <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Director</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Appointment of new visionaries or resignation of existing members. We manage end-to-end ROC compliance (Form DIR-12) for smooth management transitions.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-sm text-white">3-4 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Filings</p>
                                        <p className="font-bold text-sm text-white">DIR-12</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Start Process
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Common Choice</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Per Change</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Director</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["Drafting Board Resolutions", "Resignation/Appt. Letter", "Form DIR-12 Filing", "Govt Fee Payment", "Master Data Update"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('add')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Add Director <ArrowRight size={18} />
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
                            <BookOpen className="text-bronze" /> Managing The Board
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Companies evolve, and so does their management. Adding new expertise or removing inactive members is a routine corporate action that requires formal notification to the ROC via Form DIR-12.
                            </p>
                            <p>
                                Whether you are bringing in a new partner (Additional Director) or accepting a resignation, compliance within 30 days is mandatory to avoid late fees.
                            </p>
                        </div>
                    </section>

                    {/* PROCESS SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">The Process</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Digital Signature (DSC)", desc: "The new director must have a valid DSC. If not, we will apply for it first." },
                                { title: "Director Identification Number (DIN)", desc: "We apply for DIN for the new director. Existing directors already have this." },
                                { title: "Board Resolution", desc: "A meeting is held to approve the appointment or accept the resignation." },
                                { title: "Consent & Letters", desc: "For appointment, Form DIR-2 (Consent) is signed. For resignation, a resignation letter is collected." },
                                { title: "Filing DIR-12", desc: "We file the e-form DIR-12 with the ROC along with the attachments." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-col items-center hidden md:flex">
                                        <div className="w-8 h-8 rounded-full bg-bronze/10 text-bronze font-bold flex items-center justify-center border border-bronze/20">
                                            {i + 1}
                                        </div>
                                        {i !== 4 && <div className="w-px h-full bg-gray-200 my-2"></div>}
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 hover:shadow-md transition">
                                        <h4 className="text-lg font-bold text-navy mb-2">{step.title}</h4>
                                        <p className="text-gray-600 text-sm">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* COMPARISON/TYPES SECTION */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Types of Changes</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                    <UserPlus size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-navy mb-2">Appointment</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div> Additional Director</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div> Alternate Director</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div> Nominee Director</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                                    <UserMinus size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-navy mb-2">Cessation</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div> Resignation</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div> Death of Director</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div> Removal by Shareholders</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Growth</div>
                                <h3 className="text-xl font-bold text-white mb-2">ADD Director</h3>
                                <div className="text-4xl font-black text-white mb-1">₹1,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-green-500 shrink-0" /> Appointment Letter</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-green-500 shrink-0" /> Consent (DIR-2)</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-green-500 shrink-0" /> DIR-12 Filing</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('add')} className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:shadow-green-500/20 transition">Select Add Package</button>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">REMOVE Director</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹1,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-red-500 shrink-0" /> Resignation Letter</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-red-500 shrink-0" /> Board Resolution</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-red-500 shrink-0" /> DIR-12 Filing</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('remove')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Remove Package</button>
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
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Appointment</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Consent Letter (DIR-2)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Digital Signature (DSC)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> PAN & Aadhaar</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">For Resignation</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Resignation Letter</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Board Resolution</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
                            <p className="text-gray-300 text-sm mb-4">Questions about Director KYC or Disqualification?</p>
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

export default AddRemoveDirectorPage;
