import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Check, Play, Building, Shield, Zap,
    Users, Clock, Globe, Briefcase, FileText, Layout,
    ChevronDown, Star, Award, Mail, Lock, Phone,
    TrendingUp, FileCheck, Headphones, User, Lightbulb, PenTool
} from 'lucide-react';
import { getApprovedTestimonials } from '../api';
import heroBg from '../assets/hero-bg.png';
import servicesBg from '../assets/services-bg.png';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
};

// Testimonials Section Component
const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getApprovedTestimonials();
                if (data && Array.isArray(data)) {
                    setTestimonials(data.slice(0, 6)); // Show max 6 testimonials
                }
            } catch (error) {
                console.error('Failed to fetch testimonials:', error);
                // Fallback to default testimonials
                setTestimonials([
                    { customerName: "Suresh Raina", serviceName: "Private Limited Registration", feedback: "Compliance was a headache until I found ShineFiling. Professional & super fast.", rating: 5 },
                    { customerName: "Priti Desai", serviceName: "GST Registration", feedback: "Highly recommended! The team is knowledgeable and the dashboard is very easy to use.", rating: 5 },
                    { customerName: "Amit Verma", serviceName: "Trademark Filing", feedback: "Got my company registered in just 7 days. Excellent service and support.", rating: 5 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-[#B58863] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
        >
            {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-shadow text-left">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B58863] to-[#D4B08C] flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {t.customerName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h4 className="font-bold text-[#10232A] text-sm">{t.customerName || 'Anonymous'}</h4>
                            <p className="text-[10px] text-[#3D4D55] uppercase tracking-wider">{t.serviceName || 'Customer'}</p>
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm italic leading-relaxed mb-6">"{t.feedback}"</p>
                    <div className="flex text-[#B58863]">
                        {[...Array(t.rating || 5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

const LandingPage = () => {
    const [activeFaq, setActiveFaq] = useState(0);

    // --- Data: Matched to User's "Services Grid" Image ---
    const premiumServices = [
        { title: 'Private Limited Company', icon: Building, desc: 'Registration & Incorporation' },
        { title: 'LLP Registration', icon: Users, desc: 'Limited Liability Partnership' },
        { title: 'One Person Company', icon: User, desc: 'Single Owner Registration' },
        { title: 'Partnership Firm', icon: Briefcase, desc: 'Register your Partnership' },

        { title: 'GST Registration', icon: FileText, desc: 'Get your GSTIN Number' },
        { title: 'Income Tax Filing', icon: Layout, desc: 'Expert ITR Filing Services' },
        { title: 'GST Filing', icon: FileCheck, desc: 'Monthly/Quarterly Returns' },
        { title: 'TDS Compliance', icon: Zap, desc: 'TDS Return Filing' },

        { title: 'Trademark Filing', icon: Shield, desc: 'Protect your Brand Name' },
        { title: 'Copyright Registration', icon: FileCheck, desc: 'Protect your Creative Work' },
        { title: 'Patent Filing', icon: Lightbulb, desc: 'Protect your Inventions' },
        { title: 'Design Registration', icon: PenTool, desc: 'Protect Industrial Designs' },
    ];

    const faqs = [
        { q: 'How long does company registration take?', a: 'Typically 7-10 working days, depending on government processing times. Our team ensures the fastest turnaround possible.' },
        { q: 'Do I need to visit your office physically?', a: 'No. The entire process is 100% digital. You can upload documents securely via our dashboard.' },
        { q: 'What documents are required for Pvt Ltd?', a: 'You need PAN, Aadhaar, Bank Statement, and a registered office address proof (Electricity Bill/NOC).' },
        { q: 'Is my data secure with ShineFiling?', a: 'Absolutely. We use bank-grade encryption and strict data privacy protocols to ensure your information is safe.' }
    ];

    return (
        <div className="font-sans text-navy bg-white selection:bg-bronze/30 selection:text-navy overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroBg}
                        alt="Corporate Legal Tower Night"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-[#10232A]/70"></div>
                </div>

                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full text-center mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-xl">
                            Start Your Business Without the Hassle
                        </h1>

                        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light tracking-wide">
                            Expert Legal & Compliance Solutions for Your Growth.
                        </p>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex justify-center">
                            <Link to="/signup" className="px-10 py-3.5 bg-[#B58863] hover:bg-[#a37853] text-white font-bold text-sm tracking-widest uppercase rounded shadow-lg transition-all flex items-center gap-2">
                                GET STARTED NOW <ArrowRight size={14} strokeWidth={3} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- TRUSTED BY BANNER --- */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="bg-[#EBE5DE] py-8 border-b border-white/20"
            >
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-navy/60 uppercase mb-6">Trusted By Leading Enterprises</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" alt="Company" className="h-6 object-contain" />
                        <span className="text-xl font-black text-navy tracking-tight">TATA</span>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border-2 border-navy"></div>
                            <span className="font-bold text-navy">Reliance</span>
                        </div>
                        <div className="flex items-center gap-1 font-serif italic font-bold text-xl text-navy">
                            <span>HDFC</span>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" alt="Google" className="h-6 object-contain" />
                    </div>
                </div>
            </motion.div>

            {/* --- SECTION 1: SERVICES GRID (Matched to Image) --- */}
            <section className="py-24 px-6 lg:px-12 relative overflow-hidden bg-slate-50">
                <div className="absolute inset-0 z-0">
                    <img src={servicesBg} alt="Services Background" className="w-full h-full object-cover opacity-30" />
                </div>
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold text-navy">Services Grid</h2>
                        <div className="h-1 w-20 bg-bronze mt-2"></div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {premiumServices.map((svc, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <Link
                                    to={`/services/${svc.title.toLowerCase().replace(/ /g, '-')}`}
                                    className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(181,136,99,0.15)] transition-all duration-300 flex flex-col items-center text-center h-full hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#FAF6F3] text-bronze flex items-center justify-center mb-4 group-hover:bg-bronze group-hover:text-white transition-colors duration-300">
                                        <svc.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-base font-bold text-navy mb-2 leading-tight group-hover:text-bronze transition-colors">{svc.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{svc.desc}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 2: SIMPLIFYING COMPLIANCE (Beige Split Section) --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 min-h-[500px]">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-[#DBCFB0] p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1"
                    >
                        <span className="text-navy font-bold uppercase tracking-widest text-xs mb-4">WHO WE ARE</span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6 leading-tight">
                            Simplifying Compliance for Every Business
                        </h2>
                        <p className="text-[#4A4A4A] text-lg leading-relaxed mb-8">
                            At ShineFiling, we serve as your all-in-one compliance partner. From starting your business to protecting your brand and ensuring tax compliance, we provide legal and secretarial solutions at one click.
                        </p>
                        <Link to="/about-us" className="inline-flex items-center gap-2 text-navy font-bold hover:text-white transition-colors uppercase tracking-widest text-sm self-start border-b-2 border-navy hover:border-white pb-1">
                            READ MORE <ArrowRight size={16} />
                        </Link>
                    </motion.div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative order-1 lg:order-2 h-[300px] lg:h-auto"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600"
                            alt="Indian Boardroom Meeting"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 3: WHY CHOOSE US --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-navy">Why Choose Us</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                        {[
                            { icon: Clock, title: "SPEED", desc: "Fast & Efficient Filing" },
                            { icon: Shield, title: "SECURITY", desc: "Secure Data & Compliance" },
                            { icon: Award, title: "EXPERT SUPPORT", desc: "Dedicated Professional Team" },
                            { icon: Globe, title: "DIGITAL FIRST", desc: "Seamless Online Platform" }
                        ].map((item, i) => (
                            <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center group">
                                <div className="w-20 h-20 mb-6 relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-bronze/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    <item.icon size={48} strokeWidth={1} className="text-[#B58863] relative z-10" />
                                </div>
                                <h4 className="text-lg font-bold text-navy mb-2 uppercase tracking-wide">{item.title}</h4>
                                <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 3: PROCESS TIMELINE (Matched to Image) --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-navy">Process Timeline</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="hidden lg:block absolute top-[50px] left-[15%] right-[15%] h-px bg-bronze/30 z-0 origin-left"
                        ></motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
                        >
                            {[
                                { title: 'Consultation', desc: 'Details and document analysis with our experts.', icon: Users, step: 'STEP 1' },
                                { title: 'Document Submission', desc: 'Securely document upload on dashboard.', icon: FileText, step: 'STEP 2' },
                                { title: 'Verification & Filing', desc: 'Our experts verify & file your application.', icon: Shield, step: 'STEP 3' },
                                { title: 'Completion & Handover', desc: 'Receive your license & start business.', icon: Check, step: 'STEP 4' }
                            ].map((step, i) => (
                                <motion.div key={i} variants={scaleIn} className="flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 rounded-full bg-[#B58863] border-4 border-white shadow-xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-all duration-300 relative z-10">
                                        <step.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-xs font-bold text-navy uppercase tracking-widest mb-1">{step.step}</span>
                                    <h3 className="text-lg font-bold text-navy mb-2">{step.title}</h3>
                                    <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: STATS BAR (Dark Band) --- */}
            <section className="py-16 px-6 lg:px-12 bg-[#10232A] text-white">
                <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                    {[
                        { val: "50+", label: "Legal Services" },
                        { val: "100%", label: "Digital Process" },
                        { val: "24/7", label: "Expert Support" },
                        { val: "Zero", label: "Hidden Charges" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="px-4"
                        >
                            <h4 className="text-4xl lg:text-5xl font-bold text-[#B58863] mb-2 font-display">{stat.val}</h4>
                            <p className="text-sm text-slate-400 uppercase tracking-widest font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- SECTION 5: TESTIMONIALS (Clean Cards) --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-navy">Testimonials</h2>
                    </motion.div>

                    <TestimonialsSection />
                </div>
            </section>

            {/* --- SECTION 6: FAQ (Simple List) --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1000px] mx-auto text-center">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <h2 className="text-3xl font-bold text-navy">FAQ</h2>
                        <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest">Frequently Asked Questions</p>
                    </motion.div>

                    <div className="space-y-2 text-left">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-slate-100"
                            >
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex justify-between items-center py-5 focus:outline-none group"
                                >
                                    <span className={`text-base font-bold transition-colors ${activeFaq === i ? 'text-[#B58863]' : 'text-navy group-hover:text-[#B58863]'}`}>{faq.q}</span>
                                    <ChevronDown size={18} className={`transform transition-transform text-slate-400 ${activeFaq === i ? 'rotate-180 text-[#B58863]' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                            <p className="text-slate-500 pb-5 text-sm leading-relaxed max-w-3xl">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 7: FEATURED ARTICLES & INSIGHTS --- */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-[1400px] mx-auto">

                    {/* Featured Article 1 (Text Left, Image Right) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid lg:grid-cols-2 gap-12 items-center mb-24"
                    >
                        <div>
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">BLOG NEWS</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">Understanding the Junior Governance Business</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                A brief blog news post displayed personally served as writing assessment. However, we're dedicated to customer success.
                            </p>
                            <Link to="/blog/1" className="px-8 py-3 bg-[#B58863] text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-[#a37853] transition-colors inline-block">
                                READ FULL
                            </Link>
                        </div>
                        <div className="rounded-2xl overflow-hidden h-[300px] lg:h-[350px]">
                            <img src="https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&q=80&w=1600" alt="Business Handshake" className="w-full h-full object-cover" />
                        </div>
                    </motion.div>

                    {/* Featured Article 2 (Image Left, Text Right) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid lg:grid-cols-2 gap-12 items-center mb-24"
                    >
                        <div className="rounded-2xl overflow-hidden h-[300px] lg:h-[350px] order-2 lg:order-1">
                            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600" alt="Business Discussion" className="w-full h-full object-cover" />
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-bronze font-bold tracking-widest uppercase text-xs mb-2 block">LATEST INSIGHTS</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">Understanding Floor Area: The Invoice for Business</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                A brief blog news post displayed personally served as writing assessment. However, we're dedicated to customer success.
                            </p>
                            <Link to="/blog/2" className="px-8 py-3 bg-[#B58863] text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-[#a37853] transition-colors inline-block">
                                READ FULL
                            </Link>
                        </div>
                    </motion.div>

                    {/* Latest Insights 3-Column Grid */}
                    <div className="mb-12">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-8">
                            <h2 className="text-3xl font-bold text-navy">Latest Insights</h2>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {[
                                { date: "12 Oct", title: "Understanding Section 80C Filing & Tax", img: "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=600" },
                                { date: "15 Oct", title: "Understanding the New GST Returns 2.0", img: "https://images.unsplash.com/photo-1554224155-9ffd4cf44310?auto=format&fit=crop&q=80&w=600" },
                                { date: "18 Oct", title: "Understanding Section 144 IPC Rules Law", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600" }
                            ].map((post, i) => (
                                <motion.div key={i} variants={fadeInUp} className="group cursor-pointer">
                                    <div className="rounded-xl overflow-hidden h-60 mb-6">
                                        <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2 font-medium">{post.date}</p>
                                    <h3 className="text-xl font-bold text-navy leading-tight mb-4 group-hover:text-bronze transition-colors pr-4">{post.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                        Understanding tax laws can be complex, but essential for your business health. Read more to ensure compliance.
                                    </p>
                                    <button className="text-bronze font-bold text-sm uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read More <ArrowRight size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 px-6 lg:px-12 bg-navy relative overflow-hidden" >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Launch Your Business?</h2>
                    <p className="text-xl text-slate-300 mb-10 font-light">Join thousands of Indian entrepreneurs who trust ShineFiling.</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/signup" className="px-12 py-5 bg-bronze text-white font-bold rounded-full text-lg shadow-2xl hover:bg-bronze-dark transition-all hover:-translate-y-1">
                            Get Started Now
                        </Link>
                        <Link to="/contact" className="px-12 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/10 transition-all">
                            Talk to an Expert
                        </Link>
                    </div>
                </motion.div>
            </section >

        </div >
    );
};

export default LandingPage;