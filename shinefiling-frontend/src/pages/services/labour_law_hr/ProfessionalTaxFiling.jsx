import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, AlertTriangle, CheckCircle, Clock, BookOpen, Calculator, DollarSign, HelpCircle, ChevronRight, UserCheck, BarChart, ArrowRight, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfessionalTaxFilingPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        const url = `/services/labour/professional-tax-filing/apply?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const faqs = [
        { q: "What is the due date for PTRC filing?", a: "For monthly filers (tax liability > ₹50,000/year), the due date is usually the last date of the month. For annual filers, it is 31st March." },
        { q: "Can I file returns online?", a: "Yes, most states like Maharashtra (Mahagst), Karnataka (e-Prerana), and West Bengal provide online portals for filing PT returns." },
        { q: "What is the penalty for late filing?", a: "Penalties vary by state. In Maharashtra, it is ₹1,000 per return if filed late, plus 1.25% interest per month on tax due." },
        { q: "What if I have no employees?", a: "If you have a PTRC number but no employees for a period, you must file a NIL return to avoid non-compliance notices." },
        { q: "Do I need to pay PTEC separately?", a: "Yes, PTEC is the director/partner's own tax liability and is usually paid annually (before 30th June in Maharashtra) separately from the employee tax (PTRC)." },
        { q: "Is Digital Signature required?", a: "It depends on the state. Some states require DSC for authentication, whilst others allow OTP-based verification." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2026"
                        alt="Tax Filing"
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
                                    <Map size={12} className="fill-bronze" /> State Compliance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Professional Tax <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Filing</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Timely filing of PTRC (Employee Tax) and PTEC (Director Tax) returns. Avoid heavy state penalties and interest.
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
                                        <Calendar size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Due Date</p>
                                        <p className="font-bold text-sm text-white">Monthly / Annual</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">State Penalty</p>
                                        <p className="font-bold text-sm text-white">Up to ₹1000</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                File Return
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Monthly</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">PT Return Filing</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹499</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Month</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">For up to 20 Employees</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Monthly Tax Calculation", "Challan Generation", "Online Return Submission", "Payment Proof", "Annual Assessment Support"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePlanSelect('standard')}
                                    className="w-full py-4 bg-navy hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Start Filing <ArrowRight size={18} />
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Filing Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Basic */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">NIL Filing</h3>
                            <p className="text-slate-500 text-sm mb-6">For inactive entities.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹299</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> NIL Return Filing</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Compliance Record</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Avoid Notices</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('nil')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select NIL</button>
                        </div>

                        {/* Standard */}
                        <div className="bg-[#10232A] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full">
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>
                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Annual PTEC</h3>
                            <p className="text-gray-400 text-sm mb-6">For Directors/Partners.</p>
                            <div className="text-5xl font-black text-white mb-6">₹999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Annual PTEC Payment</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Challan Generation</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> One-time activity per year</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Reminder Service</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('annual_ptec')} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg">File PTEC</button>
                        </div>

                        {/* Premier */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">Monthly PTRC</h3>
                            <p className="text-slate-500 text-sm mb-6">For Employers.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹499</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Monthly Tax Calculation</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Return Filing</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Employee Data Management</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Annual Return Included</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('monthly_ptrc')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select PTRC</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> Filing Process
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                Professional Tax filing requirements vary depending on whether the tax liability is for the business entity/owner (PTEC) or for the employees (PTRC).
                            </p>

                            <h3 className="text-xl font-bold text-navy mt-6 mb-3">1. PTRC Filing (For Employees)</h3>
                            <p className="mb-4">
                                Employers must deduct PT from employees' salaries and pay it to the government.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Monthly:</strong> If tax liability is &gt; ₹50,000 (may vary by state), return must be filed monthly.</li>
                                <li><strong>Annual/Quarterly:</strong> For smaller liabilities, returns can be filed annually or quarterly.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-navy mt-6 mb-3">2. PTEC Filing (For Directors/Partners)</h3>
                            <p className="mb-4">
                                This is usually a fixed annual amount (e.g., ₹2,500 in Maharashtra).
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Annual:</strong> Usually due on or before 30th June of the financial year.</li>
                            </ul>
                        </div>
                    </section>

                    {/* How we help section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Step-by-Step Compliance</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Computation", desc: "We calculate the correct tax liability for all employees based on state-specific slabs." },
                                { title: "Challan Creation", desc: "We generate the payment challan on the respective state government portal (e.g., MahaGST)." },
                                { title: "Payment Confirmation", desc: "Once you make the payment via Net Banking, we confirm the receipt." },
                                { title: "Return Submission", desc: "We file the return form (e.g., Form IIIB) linking it with the payment challan." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                                    <div>
                                        <h4 className="font-bold text-navy text-lg">{step.title}</h4>
                                        <p className="text-sm text-slate-600">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Slab Rates */}
                    <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-inner">
                        <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                            <BarChart className="text-bronze" /> Representative Slab Rates (Maharashtra)
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Note: Other states have similar but distinct slab structures.</p>
                        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#10232A] text-white">
                                    <tr>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">Gross Salary (Monthly)</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">PT Amount (Men)</th>
                                        <th className="py-4 px-6 font-bold uppercase text-xs tracking-wider">PT Amount (Women)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-600">
                                    {[
                                        { s: "Up to ₹7,500", m: "NIL", w: "NIL" },
                                        { s: "₹7,501 to ₹10,000", m: "₹175", w: "NIL" },
                                        { s: "Above ₹10,000", m: "₹200 (₹300 in Feb)", w: "₹200 (₹300 in Feb)" }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
                                            <td className="py-4 px-6 font-bold text-navy">{row.s}</td>
                                            <td className="py-4 px-6">{row.m}</td>
                                            <td className="py-4 px-6">{row.w}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Checklist */}
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
                        <h2 className="text-2xl font-bold text-navy mb-6">Monthly Checklist</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Verify Gross Salary of all employees.",
                                "Deduct PT (₹200) from salary of eligible staff.",
                                "Exclude staff with salary < limit (e.g. ₹7,500).",
                                "Check for 'February' deduction (₹300 in some states).",
                                "Pay Challan before due date (Last day of month).",
                                "File Return linking the Challan EIN."
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-navy">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-navy to-[#10232A] rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BookOpen size={120} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 relative z-10">
                            <UserCheck className="text-bronze" /> Expert Tips
                        </h2>
                        <ul className="space-y-4 relative z-10 text-gray-300">
                            <li className="flex gap-3">
                                <ChevronRight className="text-bronze shrink-0" />
                                <span>Always select the correct period in the challan. Selecting the wrong period requires a rectification application which is a tedious process.</span>
                            </li>
                            <li className="flex gap-3">
                                <ChevronRight className="text-bronze shrink-0" />
                                <span>Ensure separate payments for PTRC and PTEC. They have different Tax Identification Numbers (TIN).</span>
                            </li>
                            <li className="flex gap-3">
                                <ChevronRight className="text-bronze shrink-0" />
                                <span>Even if the tax liability is NIL for a specific period, you must file a NIL return to keep your compliance record clean.</span>
                            </li>
                        </ul>
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

                {/* Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl text-navy mb-6 flex items-center gap-2">
                                <Clock className="text-bronze" /> Due Dates (Maharashtra)
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Monthly Return</span>
                                    <p className="font-bold text-navy text-lg">Last Day of Month</p>
                                    <span className="text-xs text-slate-400">For liability &gt; ₹50k</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Annual Return</span>
                                    <p className="font-bold text-navy text-lg">31st March</p>
                                    <span className="text-xs text-slate-400">For liability &lt; ₹50k</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#10232A] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-red-400" /> Penalties
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                • ₹1,000 for late return filing.<br />
                                • 1.25% interest pm on late payment.
                            </p>
                            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition">
                                Clear Dues Now
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfessionalTaxFilingPage;
