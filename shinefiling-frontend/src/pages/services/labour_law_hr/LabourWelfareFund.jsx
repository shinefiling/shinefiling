import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Heart, Users, HelpCircle, Umbrella, ShieldCheck, BadgeIndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const LabourWelfareFund = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "What is Labour Welfare Fund?", a: "To ensure social security and improved working conditions for labours, state governments have enacted the Labour Welfare Fund Act." },
        { q: "Is it mandatory?", a: "Yes, it is mandatory for certain establishments in notified states (like Haryana, Maharashtra, Karnataka, etc.)" },
        { q: "Who contributes?", a: "Both Employer and Employee contribute a small amount (e.g., ₹25, ₹12, ₹3) bi-annually or annually." },
        { q: "What are the benefits?", a: "Funds are used for scholarships, medical aid, excursions, and other welfare activities for workers and their families." },
        { q: "When to file?", a: "Typically filed half-yearly (June & Dec) or annually (Dec/Jan), depending on the state rules." },
        { q: "Does it apply to all employees?", a: "It applies to all employees (including contract labor) except those in managerial or supervisory capacities drawing wages above a certain limit (varies by state)." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/labour-law/labour-welfare-fund/apply?plan=${plan}`;
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
                        className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[100px]"
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
                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-4 border border-orange-200">
                                    SOCIAL SECURITY
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-[#2B3446]">
                                    Labour Welfare <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Fund</span>
                                </h1>
                                <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl">
                                    Contribute to the well-being of your workforce. Mandatory compliance for establishments to provide social aid to laborers.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <div className="flex items-center gap-3 bg-white pr-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Beneficiaries</p>
                                        <p className="font-bold text-sm text-[#2B3446]">Workers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white pr-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Umbrella size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Purpose</p>
                                        <p className="font-bold text-sm text-[#2B3446]">Welfare Aid</p>
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
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                            <div className="p-8 text-center relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-4">Filing</span>
                                <div className="flex justify-center items-end gap-2 mb-2">
                                    <h3 className="text-5xl font-black text-[#2B3446]">₹999</h3>
                                    <span className="text-sm font-bold text-slate-400 mb-2">/ Return</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">+ Govt Fees (Contribution)</p>
                            </div>

                            <div className="px-8 pb-8 bg-white relative z-10">
                                <ul className="space-y-3 mb-8">
                                    {[
                                        "Employee Data Compilation",
                                        "Contribution Calculation",
                                        "Challan Generation",
                                        "Online Payment Assistance",
                                        "Return Filing (Form A-1 etc)",
                                        "Compliance Record"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                            <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePlanSelect('return')}
                                    className="w-full py-4 bg-[#2B3446] hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-1"
                                >
                                    File Return
                                </button>
                                <button
                                    onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full mt-3 py-2 text-sm font-bold text-slate-500 hover:text-[#2B3446] hover:underline transition"
                                >
                                    View Registration Plans
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

                    {/* Process Section */}
                    <section>
                        <h2 className="text-3xl font-black text-[#2B3446] mb-8 flex items-center gap-3">
                            Filing Process
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pl-16">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500 rounded-l-2xl"></div>
                                <div className="absolute left-4 top-6 bg-orange-100 p-2 rounded-lg text-orange-700 font-bold text-xs uppercase tracking-wider -rotate-90 origin-center w-8">Step 1</div>
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Identify Liability</h3>
                                <p className="text-gray-600 mb-2 text-sm">
                                    Calculate total employees on roll during the contribution period (e.g., as on 30th June / 31st Dec).
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pl-16">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-500 rounded-l-2xl"></div>
                                <div className="absolute left-4 top-6 bg-amber-100 p-2 rounded-lg text-amber-700 font-bold text-xs uppercase tracking-wider -rotate-90 origin-center w-8">Step 2</div>
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Deduct & Contribute</h3>
                                <p className="text-gray-600 mb-2 text-sm">
                                    Deduct employee share (₹3 to ₹25) and add employer share (twice or thrice the employee share).
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pl-16">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 rounded-l-2xl"></div>
                                <div className="absolute left-4 top-6 bg-yellow-100 p-2 rounded-lg text-yellow-700 font-bold text-xs uppercase tracking-wider -rotate-90 origin-center w-8">Step 3</div>
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Submit</h3>
                                <p className="text-gray-600 mb-2 text-sm">
                                    Pay online on the state board portal and generate the receipt.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2B3446] mb-8">Role of LWF</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Medical Assistance", desc: "Provides funds for prolonged illness treatment.", icon: Heart },
                                { title: "Education Grants", desc: "Scholarships for children of workers for higher education.", icon: Umbrella },
                                { title: "Recreation", desc: "Funding for holiday homes and excursions.", icon: Users },
                                { title: "Low Cost", desc: "Very nominal contribution but high social impact.", icon: BadgeIndianRupee },
                            ].map((b, i) => (
                                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2B3446]/5 group-hover:bg-[#2B3446] group-hover:text-orange-500 flex items-center justify-center text-[#2B3446] flex-shrink-0 transition-all duration-300">
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
                            <h2 className="text-3xl font-bold text-[#2B3446]">Compliance Packages</h2>
                            <p className="text-slate-500 mt-3">Hassle-free LWF Management</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Return Filing */}
                            <div className="bg-[#2B3446] rounded-3xl p-8 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Recurring</div>
                                <h3 className="text-xl font-bold text-white mb-2">LWF Return</h3>
                                <div className="text-4xl font-black text-white mb-1">₹999</div>
                                <p className="text-xs text-gray-400 mb-6">/ Period</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-orange-500 shrink-0" /> Employee List Prep</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-orange-500 shrink-0" /> Online Payment</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-orange-500 shrink-0" /> Challan Submission</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('return')} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-lg hover:shadow-orange-500/50 transition">Select Plan</button>
                            </div>

                            {/* Registration */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group">
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">New Reg</h3>
                                <div className="text-4xl font-black text-[#2B3446] mb-1">₹1,999</div>
                                <p className="text-xs text-slate-400 mb-6">One Time</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Establishment Registration</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> LWF Code Allotment</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Portal Setup</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('registration')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-[#2B3446] font-bold hover:bg-[#2B3446] hover:text-white transition">Get Registered</button>
                            </div>

                            {/* Unpaid Accumulations */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group">
                                <h3 className="text-xl font-bold text-[#2B3446] mb-2">Unpaid Dues</h3>
                                <div className="text-4xl font-black text-[#2B3446] mb-1">₹1,499</div>
                                <p className="text-xs text-slate-400 mb-6">Filing</p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Unpaid Salary Deposit</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Unpaid Bonus Deposit</li>
                                    <li className="flex gap-3 text-sm text-slate-600"><CheckCircle size={16} className="text-green-500 shrink-0" /> Legal Compliance</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('unpaid')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-[#2B3446] font-bold hover:bg-[#2B3446] hover:text-white transition">File Unpaid</button>
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
                                        <HelpCircle size={20} className="text-orange-500 mt-1 flex-shrink-0" />
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
                                <FileText className="text-orange-500" /> Documents Needed
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" /> List of Employees</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" /> Total Salary Bill</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" /> Establishment Details</li>
                                        <li className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" /> Previous Receipts (if any)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">State Applicability?</h4>
                            <p className="text-gray-300 text-sm mb-4">Check if LWF is applicable to your unit.</p>
                            <button className="w-full py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg font-bold text-sm transition">
                                Check Eligibility
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LabourWelfareFund;
