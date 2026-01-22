import React, { useState, useEffect } from 'react';
import {
    FileText, CheckCircle, AlertCircle,
    TrendingUp, ArrowRight, Download, MoreHorizontal, Activity, Star, Clock, Loader2, Headset
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserApplications } from '../../api';

const ClientHome = ({ setActiveTab }) => {
    const [stats, setStats] = useState([
        { label: 'Total Filings', value: '0', icon: FileText, bg: 'bg-[#10232A]', text: 'text-white', subtext: 'text-slate-400', isPrimary: true },
        { label: 'In Progress', value: '0', icon: Activity, bg: 'bg-white dark:bg-[#10232A]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
        { label: 'Completed', value: '0', icon: CheckCircle, bg: 'bg-white dark:bg-[#10232A]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
        { label: 'Actions Needed', value: '0', icon: AlertCircle, bg: 'bg-white dark:bg-[#10232A]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' }
    ]);
    const [recentServices, setRecentServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState([0, 0, 0, 0, 0, 0, 0]); // Fallback/Visual

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.email) return;

                const applications = await getUserApplications(user.email);

                if (applications) {
                    // Update Stats
                    const total = applications.length;
                    const inProgress = applications.filter(a => !['Completed', 'Action Required', 'Draft'].includes(a.status)).length;
                    const completed = applications.filter(a => a.status === 'Completed').length;
                    const actionNeeded = applications.filter(a => a.status === 'Action Required').length;

                    setStats([
                        { label: 'Total Filings', value: total.toString(), icon: FileText, bg: 'bg-[#10232A]', text: 'text-white', subtext: 'text-slate-400', isPrimary: true },
                        { label: 'In Progress', value: inProgress.toString(), icon: Activity, bg: 'bg-white dark:bg-[#10232A]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
                        { label: 'Completed', value: completed.toString(), icon: CheckCircle, bg: 'bg-white dark:bg-[#10232A]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' },
                        { label: 'Actions Needed', value: actionNeeded.toString(), icon: AlertCircle, bg: 'bg-white dark:bg-[#10232A]', text: 'text-slate-800 dark:text-white', subtext: 'text-slate-500' }
                    ]);

                    // Update Recent Services (Top 5)
                    const sorted = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setRecentServices(sorted.slice(0, 5).map(app => ({
                        id: app.id,
                        name: app.serviceName || 'Service Request',
                        status: app.status || 'Processing',
                        icon: getIconForService(app.serviceName),
                        date: getTimeAgo(app.createdAt)
                    })));

                    // Calculate Weekly Activity (Last 7 weeks)
                    // Group by week relative to current date
                    const weeks = [0, 0, 0, 0, 0, 0, 0];
                    const now = new Date();

                    sorted.forEach(app => {
                        const date = new Date(app.createdAt);
                        const diffTime = Math.abs(now - date);
                        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

                        if (diffWeeks < 7) {
                            // index 6 is this week (0 diff), index 0 is 7 weeks ago
                            const index = 6 - diffWeeks;
                            if (index >= 0 && index < 7) {
                                weeks[index] += 10; // Increment by 10 for visibility (or 20 etc)
                            }
                        }
                    });

                    // Normalize to max 100 for percentage height
                    const maxVal = Math.max(...weeks, 1);
                    const normalizedWeeks = weeks.map(w => w === 0 ? 5 : Math.min(100, (w / maxVal) * 90));
                    setAnalyticsData(normalizedWeeks);

                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to get time ago
    const getTimeAgo = (date) => {
        if (!date) return 'N/A';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    const getIconForService = (name) => {
        if (!name) return '📄';
        const n = name.toLowerCase();
        if (n.includes('gst') || n.includes('tax')) return '📊';
        if (n.includes('trademark') || n.includes('copyright')) return '®️';
        if (n.includes('company') || n.includes('pvt') || n.includes('llp')) return '🏢';
        if (n.includes('license') || n.includes('fssai')) return '📜';
        return '📄';
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's what's happening with your business today.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveTab('new-filing')} className="px-5 py-2.5 bg-[#B58863] hover:bg-[#A57753] text-white font-bold rounded-xl shadow-lg shadow-[#B58863]/20 transition-all flex items-center gap-2">
                        + New Service
                    </button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`${stat.bg} ${stat.isPrimary ? 'shadow-xl shadow-[#10232A]/20' : 'shadow-sm border border-slate-100 dark:border-[#1C3540]'} rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                        {stat.isPrimary && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B58863]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        )}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className={`${stat.isPrimary ? 'text-white' : 'text-slate-800 dark:text-white'} text-4xl font-bold mb-1 tracking-tight`}>{loading ? '...' : stat.value}</h3>
                                <p className={`${stat.isPrimary ? 'text-slate-300' : 'text-slate-500'} text-xs font-bold uppercase tracking-wider`}>{stat.label}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.isPrimary ? 'bg-white/10 text-white backdrop-blur-sm' : 'bg-slate-50 dark:bg-[#1C3540] text-slate-500 dark:text-slate-300'}`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        {stat.isPrimary ? (
                            <div className="relative z-10 mt-2">
                                <span className="text-xs font-medium text-[#B58863] bg-white px-2 py-1 rounded-md inline-block">Track Status</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 mt-2">
                                <TrendingUp size={14} /> Updated recently
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Middle Section: Chart & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Analytics Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#10232A] rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-[#1C3540]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Activity Overview</h3>
                            <p className="text-slate-500 text-xs mt-1">Application submissions over the last 7 weeks</p>
                        </div>
                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-full text-slate-400">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-4 px-2">
                        {analyticsData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                                <div className="w-full bg-[#F3F4F6] dark:bg-[#1C3540] rounded-t-xl h-full relative overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`absolute bottom-0 w-full rounded-t-xl ${i % 2 === 0 ? 'bg-[#10232A] dark:bg-white' : 'bg-[#B58863]'}`}
                                    ></motion.div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#B58863] transition-colors">Week {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Services List */}
                <div className="bg-white dark:bg-[#10232A] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-[#1C3540] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white">Recent Services</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#B58863] hover:underline">View All</button>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar max-h-[300px]">
                        {loading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" size={20} /></div>
                        ) : recentServices.length > 0 ? (
                            recentServices.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-xl transition cursor-pointer group border border-transparent hover:border-slate-100 dark:border-[#2A4550]">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-[#0D1C22] rounded-lg flex items-center justify-center text-lg shadow-sm group-hover:bg-white dark:group-hover:bg-[#10232A] transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className={`text-[10px] font-bold ${item.status === 'Completed' ? 'text-emerald-500' :
                                                item.status === 'Action Required' ? 'text-rose-500' :
                                                    'text-amber-500'
                                                }`}>{item.status}</p>
                                            <p className="text-[9px] text-slate-400 flex items-center gap-1"><Clock size={10} />{item.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-xs">No recent activity</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Promo & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Profile Health (Horizontal Layout) */}
                <div className="bg-white dark:bg-[#10232A] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-[#1C3540] flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 max-w-[60%]">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">Profile Health</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Your profile is 85% complete. Add a secondary contact number to reach 100%.</p>
                        <button onClick={() => setActiveTab('profile')} className="text-xs font-bold text-white bg-[#10232A] dark:bg-[#B58863] px-4 py-2 rounded-lg hover:opacity-90 transition">Complete Now</button>
                    </div>

                    <div className="relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="54" className="stroke-slate-100 dark:stroke-[#1C3540]" strokeWidth="8" fill="transparent" />
                            <motion.circle
                                initial={{ strokeDasharray: "339 339", strokeDashoffset: 339 }}
                                animate={{
                                    strokeDashoffset: 339 - (339 * ((() => {
                                        const u = JSON.parse(localStorage.getItem('user') || '{}');
                                        let score = 0;
                                        if (u.fullName) score += 20;
                                        if (u.email) score += 20;
                                        if (u.mobile) score += 20;
                                        if (u.city || u.address) score += 20;
                                        if (u.profileImage) score += 20;
                                        return score / 100;
                                    })()))
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="64" cy="64" r="54"
                                className="stroke-[#B58863]"
                                strokeWidth="8"
                                fill="transparent"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-[#10232A] dark:text-white">{(() => {
                                const u = JSON.parse(localStorage.getItem('user') || '{}');
                                let score = 0;
                                if (u.fullName) score += 20;
                                if (u.email) score += 20;
                                if (u.mobile) score += 20;
                                if (u.city || u.address) score += 20;
                                if (u.profileImage) score += 20;
                                return score;
                            })()}%</span>
                        </div>
                    </div>
                </div>

                {/* Premium Support / Promo */}
                <div className="bg-[#10232A] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg group cursor-pointer">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#B58863]/30 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star size={16} className="text-[#B58863] fill-[#B58863]" />
                                    <span className="text-[#B58863] text-xs font-bold uppercase tracking-wider">Premium Plan</span>
                                </div>
                                <h3 className="text-2xl font-bold">Priority Support</h3>
                            </div>
                            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md">
                                <Headset size={20} className="text-white" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-white/60 text-xs max-w-[70%]">Get your queries resolved instantly with our dedicated relationship managers.</p>
                            <button className="bg-[#B58863] text-white p-2 rounded-lg hover:bg-[#A57753] transition shadow-lg">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile App Banner - Small */}
            <div className="bg-gradient-to-r from-[#10232A] to-[#2A4550] rounded-2xl p-1 relative overflow-hidden">
                <div className="bg-[#0D1C22] rounded-xl p-4 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#B58863]/20 rounded-xl text-[#B58863]">
                            <Download size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Download Mobile App</h4>
                            <p className="text-xs text-white/50">Manage your business on the go.</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-white bg-[#B58863] px-3 py-1.5 rounded-lg hover:bg-[#A57753] transition">Get App</button>
                </div>
            </div>

        </div>
    );
};



export default ClientHome;
