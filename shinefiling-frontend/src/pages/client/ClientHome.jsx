import React, { useEffect, useState } from 'react';
import { Briefcase, AlertCircle, FileText, ChevronRight, Zap, Plus, ArrowUpRight, Download, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserApplications, getUserStats, BASE_URL, getServiceCatalog } from '../../api';
import { getInactiveServices } from '../../utils/serviceManager';
import { SERVICE_DATA } from '../../data/services';

const ClientHome = ({ setActiveTab }) => {
    const [recentOrders, setRecentOrders] = useState([]);
    const [stats, setStats] = useState({ activeServices: 0, pendingActions: 0, totalDocuments: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ firstName: 'User' });
    const [featuredServices, setFeaturedServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    setUser({ firstName: userData.fullName?.split(' ')[0] || 'User' });

                    const [apps, statData, servicesData] = await Promise.all([
                        getUserApplications(userData.email),
                        getUserStats(userData.id),
                        getServiceCatalog()
                    ]);

                    setRecentOrders(apps ? apps.slice(0, 5) : []);
                    if (statData) setStats(statData);

                    // Process Featured Services from Admin Control
                    const inactiveList = getInactiveServices();
                    let rawServices = servicesData && servicesData.length > 0 ? servicesData : [];
                    if (rawServices.length === 0) {
                        Object.values(SERVICE_DATA).forEach(cat => {
                            cat.items.forEach((item, index) => {
                                rawServices.push({
                                    id: `${cat.id}_${index}`,
                                    name: item,
                                    category: cat.label,
                                    categoryId: cat.id,
                                    icon: cat.icon
                                });
                            });
                        });
                    }
                    const activeServices = rawServices.filter(s => {
                        const isInactiveGlobally = s.status === 'INACTIVE';
                        const isInactiveLocally = inactiveList.includes(s.id || s.name);
                        return !isInactiveGlobally && !isInactiveLocally;
                    });

                    // Pick 3 random or first 3
                    setFeaturedServices(activeServices.sort(() => 0.5 - Math.random()).slice(0, 3));
                }
            } catch (err) {
                console.error("Error fetching home data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const statCards = [
        { label: 'Active Services', value: stats.activeServices, icon: Briefcase, color: 'text-[#B58863]', bg: 'bg-[#B58863]/10' },
        { label: 'Pending Actions', value: stats.pendingActions, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Completed', value: stats.totalDocuments, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 pb-12">

            {/* 1. Top Section: Welcome + Stats (Left) | Hero Banner (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Welcome + Stats */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Welcome Text */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#10232A] leading-tight">
                            {getGreeting()},<br />
                            <span className="text-[#B58863]">{user.firstName}</span>.
                        </h1>
                        <p className="text-[#3D4D55] mt-3 text-sm font-medium leading-relaxed">
                            Your business command center is ready.<br />
                            checks and alerts are up to date.
                        </p>
                    </div>

                    {/* Stats Cards - Stacked Vertically */}
                    <div className="space-y-3">
                        {statCards.map((stat, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-[#10232A] mb-1">{stat.value}</div>
                                        <div className="text-xs font-bold text-[#3D4D55] uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-7 bg-gradient-to-br from-[#1C3540] via-[#2A4550] to-[#3D5560] rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-2xl min-h-[320px] flex flex-col justify-center"
                >
                    {/* Background Image Overlay */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] opacity-30 mix-blend-overlay bg-cover bg-center"></div>

                    {/* Gradient Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10232A]/60 to-transparent"></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                            Empower Your Business Today
                        </h2>
                        <p className="text-white/90 text-base mb-8 font-medium leading-relaxed">
                            Launch a new entity or file your taxes with our AI-powered streamlined process.
                        </p>
                        <button
                            onClick={() => setActiveTab('new-filing')}
                            className="bg-[#B58863] hover:bg-[#A57753] text-white px-7 py-3.5 rounded-full font-bold shadow-lg shadow-[#B58863]/40 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2"
                        >
                            Start New Filing <ArrowUpRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* 2. Visual Service Grid */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-[#10232A]">Frequent Services</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Private Limited */}
                    <div onClick={() => setActiveTab('new-filing')} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Briefcase size={80} className="text-[#B58863]" />
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#B58863] to-[#D4B08C] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#B58863]/20">
                            <Briefcase size={26} />
                        </div>
                        <h4 className="text-lg font-bold text-[#10232A] group-hover:text-[#B58863] transition-colors mb-2">Private Limited</h4>
                        <p className="text-sm text-[#3D4D55] mb-4">Start your business journey properly.</p>
                        <span className="text-xs font-bold text-[#B58863] flex items-center gap-1">Learn More <ChevronRight size={14} /></span>
                    </div>

                    {/* Card 2: GST Registration */}
                    <div onClick={() => setActiveTab('new-filing')} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText size={80} className="text-blue-600" />
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                            <FileText size={26} />
                        </div>
                        <h4 className="text-lg font-bold text-[#10232A] group-hover:text-blue-600 transition-colors mb-2">GST Registration</h4>
                        <p className="text-sm text-[#3D4D55] mb-4">Mandatory for businesses crossing limits.</p>
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">View Details <ChevronRight size={14} /></span>
                    </div>

                    {/* Card 3: Trademark */}
                    <div onClick={() => setActiveTab('new-filing')} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle2 size={80} className="text-emerald-600" />
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 size={26} />
                        </div>
                        <h4 className="text-lg font-bold text-[#10232A] group-hover:text-emerald-600 transition-colors mb-2">Trademark Filing</h4>
                        <p className="text-sm text-[#3D4D55] mb-4">Protect your brand identity globally.</p>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">Secure Brand <ChevronRight size={14} /></span>
                    </div>
                </div>
            </div>

            {/* 3. Recent Files (Visual Thumbnails) */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-[#10232A]">Recent Files</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-[#B58863] hover:underline">View All</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {/* Dynamic List from recentOrders */}
                    {recentOrders.length > 0 ? recentOrders.slice(0, 5).map((ord, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="bg-gradient-to-br from-slate-100 to-slate-200 aspect-[3/4] rounded-xl relative overflow-hidden mb-3 border border-slate-200 shadow-sm group-hover:shadow-lg transition-all">
                                {/* Simulated Document Preview */}
                                <div className="absolute inset-3 bg-white shadow-md rounded flex flex-col p-3 items-center justify-center">
                                    <FileText size={32} className="text-slate-300 mb-2" />
                                    <div className="w-full h-1.5 bg-slate-100 mb-1.5 rounded"></div>
                                    <div className="w-full h-1.5 bg-slate-100 mb-1.5 rounded"></div>
                                    <div className="w-3/4 h-1.5 bg-slate-100 rounded"></div>
                                    <div className="text-[9px] text-slate-400 text-center mt-auto font-mono">#{ord.id}</div>
                                </div>
                                <div className="absolute inset-0 bg-[#10232A]/0 group-hover:bg-[#10232A]/90 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button className="bg-white text-[#10232A] rounded-full p-3 hover:scale-110 transition-transform shadow-lg">
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>
                            <h4 className="text-xs font-bold text-[#10232A] truncate mb-0.5">{ord.serviceName}</h4>
                            <p className="text-[10px] text-[#3D4D55] font-medium">{new Date(ord.createdAt).toLocaleDateString()}</p>
                        </div>
                    )) : (
                        // Empty State Placeholder
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-400 text-sm font-bold">No files generated yet.</p>
                            <button onClick={() => setActiveTab('new-filing')} className="mt-3 text-xs font-bold text-[#B58863] hover:underline">Start Your First Filing</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientHome;
