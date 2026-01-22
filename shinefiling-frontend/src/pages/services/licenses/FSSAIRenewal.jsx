import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Clock, CheckCircle, FileText, Building, Award, Shield, ChevronRight, HelpCircle, ArrowRight, AlertTriangle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const FSSAIRenewalPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        const url = `/services/licenses/fssai-license/register?type=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const faqs = [
        { q: "When should I renew my FSSAI License?", a: "You must file for renewal at least 30 days before the expiry date of your current license/registration." },
        { q: "What happens if I miss the specific date?", a: "If you file late, a penalty of ₹100 per day is charged until the license expires. If it expires, you must apply for a fresh license." },
        { q: "Can I renew an expired license?", a: "No. Once a license is expired, it cannot be renewed. You have to stop business activities and apply for a new license immediately." },
        { q: "Can I modify details during renewal of license?", a: "No, renewal is strictly for extending validity. For changing details, you need to file a Modification Application separately." },
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION - PREMIUM DARK THEME */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1974"
                        alt="Fresh Food Ingredients"
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
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-green-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-bronze/10 rounded-full blur-[100px]"
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
                                    <RefreshCw size={12} className="fill-bronze" /> Compliance Maintenance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    FSSAI <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">License Renewal</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Don't let your food license expire. Renew it 30 days before expiry to avoid penalties (₹100/day) and business disruption.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deadline</p>
                                        <p className="font-bold text-sm text-white">Before 30 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Late Fee</p>
                                        <p className="font-bold text-sm text-white">₹100 / Day</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Apply for Renewal
                                </button>
                                <button className="flex items-center gap-2 px-6 py-4 text-white font-semibold hover:text-bronze transition-colors">
                                    <Shield size={18} /> Learn Rules
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Time Sensitive</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">Renewal Service</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹999</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Onwards</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">+ Govt Fees</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["Validity Extension (1-5 Years)", "No Re-Inspection usually", "Avoid Late Fees", "Digital Process", "Fast Approval"].map((item, i) => (
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

                    {/* DETAILED SEO CONTENT SECTION */}
                    <section className="mt-10 space-y-12 mb-20">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
                            <h2 className="text-3xl font-bold text-navy mb-8 border-b pb-4">Understanding FSSAI Renewal</h2>

                            <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">
                                <div>
                                    <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                                        <Clock className="text-bronze" /> Why is timely renewal critical?
                                    </h3>
                                    <p className="lead text-xl text-gray-800 font-medium">
                                        An FSSAI license is issued for a specific validity period (mostly 1 to 5 years). Under Food Safety guidelines, you must apply for renewal <strong>30 days before</strong> the current license expires.
                                    </p>
                                    <p>
                                        Failing to do so attracts a penalty of ₹100 per day. If not renewed before the expiry date, the license becomes invalid, and you have to apply for a fresh one, losing your old license number and history.
                                    </p>
                                </div>

                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                    <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2"><AlertTriangle /> Consequences of Non-Renewal</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2 text-sm text-red-800 font-bold">
                                            <ChevronRight size={16} /> Business Stoppage: Strictly illegal to operate with expired license.
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-red-800 font-bold">
                                            <ChevronRight size={16} /> Heavy Fines: Up to ₹5 Lakhs for operating without valid license.
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-red-800 font-bold">
                                            <ChevronRight size={16} /> Loss of Brand Reputation: Old license number is removed from databases.
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
                                <p className="text-sm opacity-80">Valid for next 1-5 years.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { name: "Renewed License Certificate", type: "Digital Copy", due: "Approval" },
                                    { name: "Same License Number", type: "Retained", due: "Immediate" },
                                    { name: "Valid Receipt", type: "Proof", due: "Day 1" },
                                    { name: "Next Renewal Reminder", type: "Support", due: "Lifetime" }
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
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">Extend Validity</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Renewal Pricing</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                        </div>

                        <div className="max-w-md mx-auto">
                            {/* Renewal - Highlighted */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl relative overflow-hidden flex flex-col group hover:shadow-2xl transition-all">
                                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-navy via-slate-600 to-navy"></div>
                                <h3 className="text-xl font-bold text-navy mb-2 mt-4">Professional Renewal</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees (Depends on years chosen)</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={14} className="text-bronze" /> Document Review</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={14} className="text-bronze" /> Form C Filing</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={14} className="text-bronze" /> Follow-up with Officer</li>
                                </ul>
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-navy text-white font-bold rounded-xl shadow-lg shadow-navy/20 transition-all hover:bg-black">Proceed to Renew</button>
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
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <FileText className="text-bronze" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Mandatory</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Previous License Copy</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Declaration Form</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-bronze flex-shrink-0 mt-0.5" /> Audit Report (if applicable)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Expired Already?</h4>
                            <p className="text-gray-300 text-sm mb-4">If your license expired yesterday, you cannot renew it today. You need a new license.</p>
                            <button className="w-full py-2 bg-bronze/20 text-yellow-400 hover:bg-bronze/30 border border-yellow-500/50 rounded-lg font-bold text-sm transition">View Plans <ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FSSAIRenewalPage;


