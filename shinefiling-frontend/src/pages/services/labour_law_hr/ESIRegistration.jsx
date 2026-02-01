import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Heart, Stethoscope, Baby, Shield, CheckCircle, BookOpen, UserPlus, HelpCircle, ChevronRight, AlertCircle, ArrowRight, Activity, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ESIRegistrationPage = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handlePlanSelect = (plan) => {
        const url = `/services/labour/esi-registration/apply?plan=${plan}`;
        if (isLoggedIn) navigate(url);
        else navigate('/login', { state: { from: url } });
    };

    const faqs = [
        { q: "What is ESI Registration?", a: "Employee State Insurance (ESI) registration is mandatory for firms employing 10 or more persons to provide medical, cash, and maternity benefits." },
        { q: "Who is eligible for ESI coverage?", a: "Employees drawing a gross monthly salary of up to ₹21,000 are covered under the ESI Act." },
        { q: "What is the contribution rate?", a: "Currently, the employee contributes 0.75% of wages and the employer contributes 3.25% of wages." },
        { q: "Is it mandatory for all states?", a: "It is applicable in most states for establishments with 10+ employees. In some states (like Maharashtra/Chandigarh), the limit is 20 employees." },
        { q: "What benefits do employees get?", a: "Full medical care for self and family, sickness benefit (cash), maternity benefit, disablement benefit, and dependent benefit." },
        { q: "What documents are required?", a: "Registration Certificate (Shop Act/GST), PAN Card, Bank Details, and Address Proof of the establishment." }
    ];

    return (
        <div className="min-h-screen bg-[#F2F1EF] text-navy font-sans pb-24">

            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=2070"
                        alt="Healthcare"
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
                                    <Heart size={12} className="fill-bronze" /> Employee Health Insurance
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white tracking-tight">
                                    ESI <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-white">Registration</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                                    Provide comprehensive medical and social security benefits to your workforce. Mandatory for establishments with 10+ employees.
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Applicability</p>
                                        <p className="font-bold text-sm text-white">10+ Staff</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md pr-6 pl-4 py-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-bronze/20 flex items-center justify-center text-bronze">
                                        <Activity size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Salary Limit</p>
                                        <p className="font-bold text-sm text-white">₹21,000 / Mo</p>
                                    </div>
                                </div>
                            </motion.div>

                            <button onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg shadow-bronze/30 hover:shadow-bronze/50 transform hover:-translate-y-1 transition-all">
                                Register Now
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
                                <div className="absolute top-0 right-0 bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">Essential</div>
                                <div className="text-center mb-6">
                                    <h3 className="text-navy font-bold text-xl mb-2">ESI Registration</h3>
                                    <div className="flex justify-center items-end gap-2 mb-2">
                                        <h3 className="text-5xl font-black text-navy tracking-tight">₹1,999</h3>
                                        <span className="text-lg text-slate-400 font-medium">/ Firm</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Excl. Govt Fees</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["Profile Creation on ESIC", "Code Number Generation", "Employer Portal Setup", "Initial Compliance Guide", "Employee Data Upload Support"].map((item, i) => (
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
                                    Get ESI Code <ArrowRight size={18} />
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
                        <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Registration Plans</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* Basic */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">PF + ESI</h3>
                            <p className="text-slate-500 text-sm mb-6">Complete Labour Reg.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹3,499</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> PF Registration</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> ESI Registration</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Combined Setup</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('combo_reg')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Combo</button>
                        </div>

                        {/* Standard */}
                        <div className="bg-[#043E52] rounded-3xl p-8 border border-gray-700 shadow-2xl relative transform md:-translate-y-6 z-10 flex flex-col h-full">
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#8B5E3C] via-[#D4AF37] to-[#8B5E3C] rounded-t-3xl"></div>
                            <h3 className="text-xl font-bold text-white mb-2 mt-2">Standard</h3>
                            <p className="text-gray-400 text-sm mb-6">Registration Only.</p>
                            <div className="text-5xl font-black text-white mb-6">₹1,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> ESIC Portal Registration</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Code Generation (C-11)</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Pehchan Card Setup</li>
                                <li className="flex items-center gap-3 text-sm text-gray-200"><CheckCircle size={14} className="text-bronze" /> Branch Office Mapping</li>
                            </ul>
                            <button onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-bronze to-yellow-700 text-white font-bold rounded-xl shadow-lg">Get Registered</button>
                        </div>

                        {/* Premier */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative group">
                            <h3 className="text-xl font-bold text-navy mb-2">Registration + Return</h3>
                            <p className="text-slate-500 text-sm mb-6">Start with compliance ready.</p>
                            <div className="text-4xl font-black text-navy mb-6">₹3,999</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> ESI Registration</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> First Month Filing</li>
                                <li className="flex items-center gap-3 text-sm text-slate-700"><CheckCircle size={16} className="text-green-500" /> Employee TIC Generation</li>
                            </ul>
                            <button onClick={() => handlePlanSelect('combo_filing')} className="w-full py-3 bg-slate-100 text-navy font-bold rounded-xl hover:bg-slate-200 transition-colors">Select Combo</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* INFO SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div id="details-section" className="lg:col-span-8 space-y-20">
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
                            <BookOpen className="text-bronze" /> About ESI Registration
                        </h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="lead text-xl text-gray-800 font-medium mb-4">
                                The Employees' State Insurance (ESI) Act, 1948, is a self-financing social security and health insurance scheme for Indian workers.
                            </p>
                            <p className="mb-4">
                                It is mandatory for all factories and specified establishments employing <span className="font-bold text-navy">10 or more persons</span> (20 in some states) to register under the Act. The scheme provides full medical care to the employee and their family from day one of insurable employment.
                            </p>
                            <p>
                                Unlike private insurance, ESI offers unlimited medical coverage without any cap on individual expenditure, making it one of the most beneficial schemes for low-wage earners.
                            </p>
                        </div>
                    </section>

                    {/* Eligibility Table */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-6">Who Should Register?</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 font-bold text-navy">Criteria</th>
                                        <th className="p-4 font-bold text-navy">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-slate-700">Establishment Size</td>
                                        <td className="p-4 text-sm text-slate-600">10 or more employees (in most states). 20+ in Maharashtra/Chandigarh.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-slate-700">Salary Limit</td>
                                        <td className="p-4 text-sm text-slate-600">Employees earning Gross Monthly Salary up to ₹21,000 (₹25,000 for Persons with Disability).</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-sm font-semibold text-slate-700">Included Entities</td>
                                        <td className="p-4 text-sm text-slate-600">Factories, Shops, Hotels, Restaurants, Cinemas, Road Transport, Private Educational & Medical Institutions.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Employee Benefits</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Medical Benefit", desc: "Full medical care for self and family members from day one.", icon: Stethoscope },
                                { title: "Sickness Benefit", desc: "70% of wages payable during certified sickness periods (up to 91 days).", icon: Activity },
                                { title: "Maternity Benefit", desc: "26 weeks of paid leave for confinement (pregnancy).", icon: Baby },
                                { title: "Disablement Benefit", desc: "90% of wages for temporary/permanent disablement due to injury.", icon: AlertCircle },
                                { title: "Dependent Benefit", desc: "Monthly pension to dependents in case of death due to employment injury.", icon: Users },
                                { title: "Funeral Expenses", desc: "One-time payment of ₹15,000 for funeral expenses.", icon: Heart }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                    <h4 className="font-bold text-navy mb-2 flex items-center gap-2">
                                        <item.icon size={18} className="text-bronze" /> {item.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#043E52] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Documents Required</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Entity Documents</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Registration Certificate (Shop Act/GST)</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> PAN Card of Company</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Cancelled Cheque</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Utility Bill / Rent Agreement</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-bronze font-bold uppercase tracking-wider text-sm">Employee List</h4>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> List of employees with Date of Join</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Salary breakup details</li>
                                        <li className="flex gap-2 text-gray-300 text-sm"><ChevronRight size={16} /> Nomination details</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Registration Process */}
                    <section>
                        <h2 className="text-3xl font-bold text-navy mb-8">Registration Process</h2>
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { s: "1", t: "Sign Up", d: "Create Employer Account on ESIC Portal" },
                                { s: "2", t: "Form-01", d: "Fill Employer Registration Form details" },
                                { s: "3", t: "Code Gen", d: "Receive 17-digit Code Number instantly" },
                                { s: "4", t: "Emp Install", d: "Register Employees & Get Insurance Numbers" }
                            ].map((step, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg text-center relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bronze to-yellow-600"></div>
                                    <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">{step.s}</div>
                                    <h4 className="font-bold text-navy mb-2">{step.t}</h4>
                                    <p className="text-xs text-slate-500">{step.d}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pehchan Card */}
                    <section className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 text-white relative shadow-2xl">
                        <div className="md:w-2/3 relative z-10">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Shield className="text-yellow-400" /> The "Pehchan" Card
                            </h2>
                            <p className="text-teal-100 mb-6 leading-relaxed">
                                Upon registration, every insured person receives two e-Pehchan cards (one for self, one for family).
                                This card is the gateway to free medical treatment at any ESIC Dispensary/Hospital across India.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex gap-2 text-sm"><CheckCircle size={16} className="text-yellow-400" /> Portable across India</li>
                                <li className="flex gap-2 text-sm"><CheckCircle size={16} className="text-yellow-400" /> Biometric Enabled</li>
                                <li className="flex gap-2 text-sm"><CheckCircle size={16} className="text-yellow-400" /> Instant verification</li>
                            </ul>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                            <Heart size={200} />
                        </div>
                    </section>

                    {/* Salary Nuances */}
                    <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                        <h2 className="text-xl font-bold text-navy mb-4">Coverage Limits Explained</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-navy mb-1 text-sm">Standard Limit</h4>
                                <p className="text-2xl font-black text-bronze">₹21,000</p>
                                <p className="text-xs text-slate-500 mt-2">Gross wages per month (Basic + DA + Allowances)</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-navy mb-1 text-sm">Disability Limit</h4>
                                <p className="text-2xl font-black text-bronze">₹25,000</p>
                                <p className="text-xs text-slate-500 mt-2">For Persons with Disability (PWD)</p>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 italic">
                            * Note: If an employee's salary exceeds the limit after registration (e.g., due to increment), they continue to be covered until the end of that contribution period (Apr-Sep or Oct-Mar).
                        </p>
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
                                <Shield className="text-bronze" /> Quick Contribution %
                            </h3>
                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                    <span>Employee Share</span>
                                    <span className="font-bold">0.75%</span>
                                </div>
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                    <span>Employer Share</span>
                                    <span className="font-bold">3.25%</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-bronze font-bold">Total</span>
                                    <span className="font-bold text-navy">4.00%</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 italic">
                                * Calculated on Gross Wages (up to 21k).
                            </p>
                        </div>

                        <div className="bg-[#043E52] p-8 rounded-3xl shadow-lg text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <UserPlus className="text-bronze" /> Get Started
                            </h3>
                            <p className="text-gray-300 text-sm mb-6">
                                New to ESI? We handle everything from registration to card generation.
                            </p>
                            <button className="w-full py-3 bg-bronze/20 text-bronze border border-bronze/50 hover:bg-bronze/30 font-bold rounded-xl transition">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ESIRegistrationPage;
