
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, Users, DollarSign, Settings,
    MessageSquare, LogOut, Menu, X, Sun, Moon, Bell, CheckCircle, Upload, Crown, ChevronRight, Briefcase, IndianRupee
} from 'lucide-react';
import { getAgentApplications } from '../../api';

// Import Views
import AgentOverview from './views/AgentOverview';
import AgentApplications from './views/AgentApplications';
import AgentClients from './views/AgentClients';
import AgentEarnings from './views/AgentEarnings';
import AgentSettings from './views/AgentSettings';
import AgentSupport from './views/AgentSupport';
import AgentNewApplication from './views/AgentNewApplication';

const AgentDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ walletBalance: 0, totalEarnings: 0, pending: 0 });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // KYC Modal State
    const [showKycModal, setShowKycModal] = useState(false);
    const [kycData, setKycData] = useState({ panNumber: '', aadhaarNumber: '' });
    const [kycFiles, setKycFiles] = useState({ pan: null, aadhaar: null });
    const [isKycSubmitting, setIsKycSubmitting] = useState(false);

    // Sidebar Configuration Grouped by Section
    const sidebarConfig = [
        {
            section: 'MAIN MENU',
            items: [
                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'create_app', label: 'Create Application', icon: Upload },
                { id: 'applications', label: 'My Applications', icon: FileText },
            ]
        },
        {
            section: 'BUSINESS',
            items: [
                { id: 'clients', label: 'Active Clients', icon: Users },
                { id: 'earnings', label: 'Earnings & Payouts', icon: IndianRupee },
            ]
        },
        {
            section: 'ACCOUNT',
            items: [
                { id: 'settings', label: 'Profile Settings', icon: Settings },
                { id: 'support', label: 'Help & Support', icon: MessageSquare },
            ]
        }
    ];

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAgentApplications(user.id);
                setTasks(data || []);

                // Mock Stats Calculation
                const earnings = (data || []).filter(t => t.status === 'COMPLETED').length * 500;
                setStats({
                    walletBalance: earnings,
                    totalEarnings: earnings,
                    pending: (data || []).filter(t => t.status !== 'COMPLETED').length
                });
            } catch (error) {
                console.error("Failed to fetch agent data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user.id) fetchData();

        if (!user.kycStatus || user.kycStatus === 'PENDING' || user.kycStatus === 'REJECTED') {
            if (user.kycStatus === 'REJECTED') setShowKycModal(true);
        }
    }, [user.id]);

    // Theme Toggle
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const handleKycSubmit = async (e) => {
        e.preventDefault();
        setIsKycSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            const updatedUser = { ...user, kycStatus: 'SUBMITTED' };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsKycSubmitting(false);
            setShowKycModal(false);
            alert("KYC Submitted for Review!");
        }, 1500);
    };

    const SidebarItem = ({ icon: Icon, label, id }) => {
        const isActive = activeTab === id;
        return (
            <div className="mb-0.5 px-4">
                <button
                    onClick={() => { setActiveTab(id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                    className={`
                        w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group text-left relative
                        ${isActive
                            ? 'bg-[#B58863] text-white shadow-lg shadow-[#B58863]/20'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="text-white/80" />}
                </button>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#F3F4F6] dark:bg-[#0D1C22] font-[Roboto,sans-serif] overflow-hidden transition-colors duration-200 text-slate-800 dark:text-slate-200">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#10232A] z-50 flex flex-col shadow-xl md:shadow-md border-r border-slate-100 dark:border-[#1C3540] ${isSidebarOpen ? 'block' : 'hidden md:flex'}`}
                    >
                        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-[#1C3540]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full border-2 border-[#B58863] flex items-center justify-center">
                                    <Crown size={14} className="text-[#B58863] fill-[#B58863]" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Agent<span className="text-[#B58863]">Portal</span></span>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-400"><X size={20} /></button>
                        </div>

                        <div className="flex-1 py-6 overflow-y-auto section-wrapper no-scrollbar">
                            {sidebarConfig.map((group, index) => (
                                <div key={index} className="mb-6">
                                    <div className="px-8 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{group.section}</div>
                                    {group.items.map(item => <SidebarItem key={item.id} {...item} />)}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-[#1C3540]">
                            <div className="bg-slate-50 dark:bg-[#1C3540] rounded-xl p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#B58863]/10 flex items-center justify-center text-[#B58863]">
                                    <Briefcase size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName || 'Partner'}</p>
                                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Status
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white dark:bg-[#10232A] border-b border-slate-200 dark:border-[#1C3540] flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500 dark:text-slate-400"><Menu size={24} /></button>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white hidden md:block capitalize">
                            {sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-full transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1C3540] rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#10232A]"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors text-sm font-bold group">
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth bg-[#F3F4F6] dark:bg-[#0D1C22]">
                    <div className="max-w-7xl mx-auto pb-20 md:pb-0">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'overview' && <AgentOverview stats={stats} tasks={tasks} user={user} setActiveTab={setActiveTab} />}
                                {activeTab === 'create_app' && <AgentNewApplication setActiveTab={setActiveTab} />}
                                {activeTab === 'applications' && <AgentApplications tasks={tasks} loading={isLoading} />}
                                {activeTab === 'clients' && <AgentClients tasks={tasks} />}
                                {activeTab === 'earnings' && <AgentEarnings stats={stats} user={user} />}
                                {activeTab === 'settings' && <AgentSettings user={user} />}
                                {activeTab === 'support' && <AgentSupport user={user} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* KYC Modal */}
            <AnimatePresence>
                {showKycModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#10232A] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-[#1C3540]">
                            <div className="p-6 border-b border-slate-100 dark:border-[#1C3540] flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-[#10232A] dark:text-white flex items-center gap-2"><CheckCircle className="text-[#B58863]" /> Agent Verification</h2>
                                {!['PENDING'].includes(user?.kycStatus) && <button onClick={() => setShowKycModal(false)}><X className="text-slate-400 hover:text-rose-500" /></button>}
                            </div>
                            <form onSubmit={handleKycSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">PAN Number</label><input value={kycData.panNumber} onChange={e => setKycData({ ...kycData, panNumber: e.target.value.toUpperCase() })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1C3540] border-none focus:ring-2 focus:ring-[#B58863] dark:text-white outline-none" required placeholder="ABCDE1234F" /></div>
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aadhaar Number</label><input value={kycData.aadhaarNumber} onChange={e => setKycData({ ...kycData, aadhaarNumber: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1C3540] border-none focus:ring-2 focus:ring-[#B58863] dark:text-white outline-none" required placeholder="1234 5678 9012" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['pan', 'aadhaar'].map(type => (
                                        <div key={type} className="border-2 border-dashed border-slate-200 dark:border-[#1C3540] rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-[#1C3540] transition relative group">
                                            <input type="file" accept="image/*,application/pdf" onChange={e => setKycFiles({ ...kycFiles, [type]: e.target.files[0] })} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                            <Upload className={`mx-auto mb-2 ${kycFiles[type] ? 'text-emerald-500' : 'text-slate-400'}`} size={32} />
                                            <p className="text-xs font-bold text-slate-500 uppercase">{kycFiles[type]?.name || `Upload ${type}`}</p>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" disabled={isKycSubmitting} className="w-full py-3.5 bg-[#10232A] dark:bg-[#B58863] text-white rounded-xl font-bold hover:shadow-lg transition text-sm uppercase tracking-wide">{isKycSubmitting ? 'Submitting...' : 'Submit Verification'}</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentDashboard;
