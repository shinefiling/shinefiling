import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Scale, Coins, AlertCircle, HelpCircle, FileText, BadgeIndianRupee, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const MinimumWages = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is Minimum Wages Act?", a: "It sets the minimum amount of remuneration that must be paid to various categories of skilled and unskilled labours." },
        { q: "Who decides the rate?", a: "Minimum wages are declared by the respective State Governments and vary by zone and industry (scheduled employment)." },
        { q: "How often does it change?", a: "The Variable Dearness Allowance (VDA) component is revised twice a year (usually April & October)." },
        { q: "What are the penalties?", a: "Non-payment can lead to fines up to 10 times the unpaid amount and imprisonment up to 6 months." },
        { q: "Is overtime included?", a: "No, overtime must be paid separately at double the normal wage rate." },
        { q: "Does it apply to contract labor?", a: "Yes, the principal employer is responsible for ensuring contract laborers are paid minimum wages." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/labour-law/minimum-wages/apply?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-[#2B3446] font-sans pb-24">

            {/* HERO SECTION */}
            <div className="bg-[#F2F1EF] text-[#2B3446] pt-36 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[100px]"
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                        {/* Hero Content */}
                        <div className="flex-1 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full mb-4 border border-teal-200">
                                    FAIR PAY
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-[#2B3446]">
                                    Minimum <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">Wages</span>
                                </h1>
                                <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl">
                                    Ensure your organization meets state-mandated wage standards. Avoid litigation and penalties with our audit services.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <div className="flex items-center gap-3 bg-white pr-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                        <Scale size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Compliance</p>
                                        <p className="font-bold text-sm text-[#2B3446]">Mandatory</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white pr-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                        <Coins size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Revisions</p>
                                        <p className="font-bold text-sm text-[#2B3446]">Bi-Annual</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full md:w-[400px] bg-white text-[#2B3446] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                            <div className="p-8 text-center relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold tracking-widest uppercase mb-4">Verification</span>
                                <div className="flex justify-center items-end gap-2 mb-2">
                                    <h3 className="text-5xl font-black text-[#2B3446]">₹1,999</h3>
                                    <span className="text-sm font-bold text-slate-400 mb-2">/ Audit</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">+ Govt Fees</p>
                            </div>

                            <div className="px-8 pb-8 bg-white relative z-10">
                                <ul className="space-y-3 mb-8">
                                    {[
                                        "Detailed Wage Sheet Audit",
                                        "Zone & Category Classification",
                                        "VDA Impact Analysis",
                                        "Overtime Calculation Check",
                                        "Compliance Report",
                                        "Corrective Action Plan"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                            <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePlanSelect('audit')}
                                    className="w-full py-4 bg-[#2B3446] hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-1"
                                >
                                    Start Audit
                                </button>
                                <button
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full mt-3 py-2 text-sm font-bold text-slate-500 hover:text-[#2B3446] hover:underline transition"
                                >
                                    View Other Services
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT CONTENT */}
                <div className="lg:col-span-8 space-y-20">

                    {/* Classification Section */}
                    <section>
                        <h2 className="text-3xl font-black text-[#2B3446] mb-8 flex items-center gap-3">
                            Understanding Rates
                        </h2>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pl-16">
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-teal-500 rounded-l-2xl"></div>
                            <div className="absolute left-4 top-6 bg-teal-100 p-2 rounded-lg text-teal-700 font-bold text-xs uppercase tracking-wider -rotate-90 origin-center w-8">Zones</div>
                            <h3 className="text-xl font-bold text-[#2B3446] mb-2">Location Zones</h3>
                            <p className="text-gray-600 mb-2 text-sm">
                                Wages differ by area: Zone A (Metros), Zone B (Semi-urban), Zone C (Rural).
                            </p>
                        </div>
                        <div className="mt-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pl-16">
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 rounded-l-2xl"></div>
                            <div className="absolute left-4 top-6 bg-emerald-100 p-2 rounded-lg text-emerald-700 font-bold text-xs uppercase tracking-wider -rotate-90 origin-center w-8">Skills</div>
                            <h3 className="text-xl font-bold text-[#2B3446] mb-2">Skill Categories</h3>
                            <p className="text-gray-600 mb-2 text-sm">
                                Unskilled (Peon/Helper), Semi-Skilled (Assistant), Skilled (Clerk/Electrician), Highly Skilled (Supervisor/Manager).
                            </p>
                        </div>

                    </section>

                    {/* Features Grid */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2B3446] mb-8">Registers & Records</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Register of Wages", desc: "Detailed record of gross wages, deductions, and net pay.", icon: FileText },
                                { title: "Overtime Register", desc: "Log of overtime hours worked and wages paid thereof.", icon: Calendar },
                                { title: "Wage Slips", desc: "Mandatory issuance of wage slips to all employees.", icon: BadgeIndianRupee },
                                { title: "Annual Return", desc: "Filing of annual return in Form III to the inspector.", icon: CheckCircle },
                            ].map((b, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2B3446]/5 group-hover:bg-[#2B3446] group-hover:text-teal-500 flex items-center justify-center text-[#2B3446] flex-shrink-0 transition-all duration-300">
                                        <b.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2B3446] mb-2 text-lg">{b.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PRICING PLANS */}
                    <section id="pricing-section" className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[#2B3446]">Service Packages</h2>
                            <p className="text-slate-500 mt-3">Wage Compliance Services</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Monthly Filing */}
                            <div className="bg-[#2B3446] rounded-3xl p-8 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                                <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Audit</div>
                                <h3 className="text-xl font-bold text-white mb-2">Wage Audit</h3>
                                <div className="text-4xl font-black text-white mb-1">₹1,999</div>
                                <p className="text-xs text-gray-400 mb-6">/ Audit</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-teal-500 shrink-0" /> Full Payroll Audit</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-teal-500 shrink-0" /> Gap Analysis</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-teal-500 shrink-0" /> Restructuring Advice</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('audit')} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-teal-500/50 transition">Select Audit</button>
                            </div>

                            {/* Registration */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group">
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Notice Reply</h3>
                                <div className="text-4xl font-black text-[#2B3446] mb-1">₹999</div>
                                <p className="text-xs text-slate-400 mb-6">Per Notice</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Legal Drafting</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Representation</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Calculation Defense</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('notice')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-[#2B3446] font-bold hover:bg-[#2B3446] hover:text-white transition">Get Help</button>
                            </div>

                            {/* Consultancy */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group">
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Subscription</h3>
                                <div className="text-4xl font-black text-[#2B3446] mb-1">₹4,999</div>
                                <p className="text-xs text-slate-400 mb-6">/ Year</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Alerts on Rate Revisions</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Quarterly Audits</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Priority Support</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('subscription')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-[#2B3446] font-bold hover:bg-[#2B3446] hover:text-white transition">Subscribe</button>
                            </div>
                        </div>
                    </section>

                    {/* FAQS */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold text-[#2B3446] mb-8">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                    <h5 className="font-bold text-[#2B3446] mb-3 text-lg flex items-start gap-2">
                                        <HelpCircle size={20} className="text-teal-500 mt-1 flex-shrink-0" />
                                        {faq.q}
                                    </h5>
                                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-[#2B3446] mb-6 flex items-center gap-2">
                                <AlertCircle className="text-teal-500" /> Penalties
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" /> 10x Compensation</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" /> Imprisonment (6 Months)</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" /> Blacklisting</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Check Rates?</h4>
                            <p className="text-gray-300 text-sm mb-4">Get latest notification for your state.</p>
                            <button className="w-full py-2 bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg font-bold text-sm transition">
                                Download Rates
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MinimumWages;
