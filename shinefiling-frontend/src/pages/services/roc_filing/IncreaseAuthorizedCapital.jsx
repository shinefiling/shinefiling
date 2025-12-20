import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, FileText, TrendingUp, Star, Users, Briefcase, BookOpen, Rocket, HelpCircle, ChevronRight, BarChart, Calculator, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IncreaseAuthorizedCapitalPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const faqs = [
        { q: "Why increase Authorized Capital?", a: "Authorized Capital is the maximum ceiling of share capital. To issue new shares to investors (Paid-up Capital), you must first have enough Authorized Capital headroom." },
        { q: "What is the process?", a: "1. Board Meeting -> 2. EGM (Shareholder Meeting) -> 3. File Form SH-7 within 30 days -> 4. File Form MGT-14." },
        { q: "Are there government fees?", a: "Yes, ROC fees are payable based on the incremental amount. Additionally, Stamp Duty is payable, which varies by state." },
        { q: "Time required?", a: "Once the EGM is held, Form SH-7 is approved by ROC typically within 2-4 working days (Straight Through Process)." },
        { q: "Is MOA alteration needed?", a: "Yes, the Capital Clause (Clause V) of the MOA needs to be altered to reflect the new Authorized Capital." },
    ];

    const handlePlanSelect = (plan) => {
        const url = `/services/roc-filing/increase-authorized-capital/register?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=2070"
                        alt="Financial Growth"
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
                                    <TrendingUp size={12} className="fill-bronze" /> Raise Funds
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    Increase Authorized <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Capital</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Scaling up? Increase your company's capacity to issue shares. We handle MOA alterations, Stamp Duty calculations, and SH-7 filing.
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
                                        <p className="font-bold text-sm text-white">2-4 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <BarChart size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Growth</p>
                                        <p className="font-bold text-sm text-white">Scale Up</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                    Increase Capacity
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Standard</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">SH-7 Filing</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹2,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">+ Govt Fees</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Professional Fee</p>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {["Drafting EGM Notice", "Drafting Resolutions", "Altered MOA Preparation", "Form SH-7 Filing", "Stamp Duty Calculation"].map((item, i) => (
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
                                    Start Process <ArrowRight size={18} />
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
                            <BookOpen className="text-bronze" /> Authorized Capital Explained
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium">
                                Authorized Capital is the "License to Issue Shares". It is the maximum value of shares a company can issue to its shareholders. It is mentioned in the Memorandum of Association (MOA).
                            </p>
                            <p>
                                If you want to bring in new investors exceeding your current limit, you must first increase this Authorized Capital by paying a fee to the Ministry of Corporate Affairs (MCA) and Stamp Duty to the State Government.
                            </p>
                        </div>
                    </section>

                    {/* PROCESS FLOW */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">The Process</h2>
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>
                            <div className="space-y-8">
                                {[
                                    { title: "Board Meeting", desc: "Board approves the proposal to increase capital and calls for an EGM." },
                                    { title: "Shareholders Meeting (EGM)", desc: "Shareholders pass a Resolution approving the increase." },
                                    { title: "File Form SH-7", desc: "File Form SH-7 with ROC within 30 days along with the resolution and altered MOA." },
                                    { title: "File Form MGT-14", desc: "File Form MGT-14 for registration of the resolution (if applicable)." },
                                    { title: "Approval", desc: "ROC approves the form and the Authorized Capital is updated on the MCA portal." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 relative">
                                        <div className="w-16 h-16 rounded-full bg-white border-4 border-bronze text-bronze font-bold text-xl flex items-center justify-center shrink-0 z-10 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 hover:shadow-md transition">
                                            <h4 className="text-lg font-bold text-navy mb-2">{step.title}</h4>
                                            <p className="text-gray-600 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* STAMP DUTY WARNING */}
                    <section>
                        <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-8">
                            <h3 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-600" /> Government Fee Structure
                            </h3>
                            <p className="text-gray-700 mb-6">
                                The cost involves two components: <strong>ROC Fee</strong> (Central Govt) and <strong>Stamp Duty</strong> (State Govt). This depends entirely on the amount of capital increase.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-yellow-100/50">
                                        <tr>
                                            <th className="px-6 py-3 rounded-l-lg">Component</th>
                                            <th className="px-6 py-3 rounded-r-lg">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-yellow-100">
                                        <tr className="bg-white">
                                            <td className="px-6 py-4 font-bold text-navy">ROC Fee</td>
                                            <td className="px-6 py-4 text-gray-600">Calculated on incremental capital. Approx ₹4,000 for every ₹1 Lakh increase (slabs apply).</td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="px-6 py-4 font-bold text-navy">Stamp Duty</td>
                                            <td className="px-6 py-4 text-gray-600">Varies by state (e.g., Maharashtra: 0.5%, Delhi: 0.15%, Karnataka: 0.5%). Max caps apply in some states.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-center">
                                <button className="text-sm font-bold text-navy underline hover:text-bronze transition">Contact us for exact calculation</button>
                            </div>
                        </div>
                    </section>

                    <section id="pricing-plans">
                        <h2 className="text-3xl font-bold text-navy mb-8">Packages</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Standard */}
                            <div className="bg-[#2B3446] rounded-3xl p-6 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col">
                                <div className="absolute top-0 right-0 bg-bronze text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Fastest</div>
                                <h3 className="text-xl font-bold text-white mb-2">SH-7 Filing</h3>
                                <div className="text-4xl font-black text-white mb-1">₹2,999</div>
                                <p className="text-xs text-gray-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> SH-7 Filing</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> MOA Alteration</li>
                                    <li className="flex gap-3 text-sm text-gray-300"><CheckCircle size={16} className="text-bronze shrink-0" /> Resolutions</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('standard')} className="w-full py-3 rounded-xl bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold shadow-lg hover:shadow-yellow-500/20 transition">Select Standard</button>
                            </div>

                            {/* Premium */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group flex flex-col">
                                <h3 className="text-xl font-bold text-navy mb-2">Fund Raising Kit</h3>
                                <div className="text-4xl font-black text-navy mb-1">₹5,999</div>
                                <p className="text-xs text-slate-400 mb-6">+ Govt Fees</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Capital Increase (SH-7)</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Share Allotment (PAS-3)</li>
                                    <li className="flex gap-3 text-sm text-gray-600"><CheckCircle size={16} className="text-bronze shrink-0" /> Share Certification</li>
                                </ul>
                                <button onClick={() => handlePlanSelect('premium')} className="w-full py-3 rounded-xl border-2 border-[#2B3446] text-navy font-bold hover:bg-navy hover:text-white transition">Select Premium</button>
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
                                <Calculator className="text-bronze" /> Fee Estimation
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Enter details to estimated Govt Fees.</p>
                                <div className="space-y-2">
                                    <input type="text" placeholder="Current Capital (₹)" className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-bronze" />
                                    <input type="text" placeholder="Proposed Increase (₹)" className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-bronze" />
                                    <select className="w-full px-4 py-2 border rounded-lg text-sm bg-white text-gray-600 focus:outline-none focus:border-bronze">
                                        <option>Select State</option>
                                        <option>Maharashtra</option>
                                        <option>Delhi</option>
                                        <option>Karnataka</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <button className="w-full py-2 bg-navy text-white font-bold rounded-lg hover:bg-black transition text-sm">Calculate Fee</button>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#2B3446] text-white p-6 rounded-3xl shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Need Guidance?</h4>
                            <p className="text-gray-300 text-sm mb-4">Unsure about Stamp Duty logic?</p>
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

export default IncreaseAuthorizedCapitalPage;
