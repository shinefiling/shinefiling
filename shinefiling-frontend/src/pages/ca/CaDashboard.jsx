
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, Bell, LogOut, Menu, X, Sun, Moon, Settings, MessageSquare, ChevronRight, Zap
} from 'lucide-react';
import {
    getCaRequests, respondToBoundAmount, getCaEmployees, createEmployee, assignEmployeeToRequest
} from '../../api';

import CaOverview from './views/CaOverview';
import CaWorks from './views/CaWorks';
import CaEmployees from './views/CaEmployees';

import CaProfile from './views/CaProfile';
import CaSupport from './views/CaSupport';
import CaOpportunities from './views/CaOpportunities';

const CaDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Data States
    const [requests, setRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    // Handle URL Query Params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    // Handle Window Resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sidebar Config
    const sidebarConfig = [
        {
            section: 'MAIN MENU',
            items: [
                { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'opportunities', label: 'Marketplace', icon: Zap },
                { id: 'works', label: 'My Works', icon: Briefcase },
                { id: 'notifications', label: 'Notifications', icon: Bell }, // Added Notifications to menu for consistency
            ]
        },
        {
            section: 'ORGANIZATION',
            items: [
                { id: 'employees', label: 'My Team', icon: Users },
            ]
        },
        {
            section: 'ACCOUNT',
            items: [
                { id: 'profile', label: 'Profile Settings', icon: Settings },
                { id: 'support', label: 'Help & Support', icon: MessageSquare },
            ]
        }
    ];

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        if (!user.id) return;
        try {
            const [reqs, emps] = await Promise.all([
                getCaRequests(user.id),
                getCaEmployees(user.id)
            ]);
            setRequests(reqs || []);
            setEmployees(emps || []);
        } catch (e) {
            console.error("Failed to fetch CA data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (req) => {
        if (window.confirm(`Accept this request for ₹${req.boundAmount}?`)) {
            await respondToBoundAmount(req.id, 'ACCEPTED', 'CA Accepted the request');
            fetchData();
        }
    };

    const handleRejectRequest = async (req) => {
        const reason = prompt("Enter reason for rejection:");
        if (reason) {
            await respondToBoundAmount(req.id, 'REJECTED', reason);
            fetchData();
        }
    };

    const handleAssignEmployee = async (reqId, empId) => {
        if (!empId) return;
        try {
            await assignEmployeeToRequest(reqId, empId);
            fetchData();
        } catch (e) {
            alert(e.message);
        }
    };

    const SidebarContent = () => (
        <>
            <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex flex-col items-center gap-2">
                    <img src="/logo.png" alt="ShineFiling" className="h-32 w-auto object-contain dark:brightness-0 dark:invert" />
                    <h1 className="font-bold text-lg leading-none text-[#043E52] dark:text-white mt-1">Partner<span className="text-[#ED6E3F]">Portal</span></h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-[#ED6E3F]"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 hidden-scrollbar">
                {sidebarConfig.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-4">{group.section}</h3>
                        <div className="space-y-1">
                            {group.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${activeTab === item.id
                                        ? 'bg-gradient-to-r from-[#ED6E3F] to-[#A07050] text-white shadow-lg shadow-[#ED6E3F]/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#ED6E3F] dark:hover:text-white'
                                        }`}
                                >
                                    <item.icon size={18} className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#ED6E3F] dark:group-hover:text-white transition-colors'}`} />
                                    <span className="relative z-10">{item.label}</span>
                                    {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-80" />}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>


        </>
    );

    return (
        <div className={`flex h-screen bg-[#FDFBF7] dark:bg-[#0D1C22] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
            {/* Desktop Sidebar (Static) */}
            {!isMobile && (
                <div className="w-[280px] bg-white dark:bg-[#043E52] border-r border-slate-200 dark:border-[#1C3540] flex flex-col z-40 shadow-sm transition-colors duration-300">
                    <SidebarContent />
                </div>
            )}

            {/* Mobile Sidebar (Overlay) */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#043E52] z-50 flex flex-col shadow-2xl transition-colors duration-300"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-[#043E52]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#1C3540] flex items-center justify-between px-6 z-20 sticky top-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C3540] rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-[#043E52] dark:text-white hidden sm:block">
                            {sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1C3540] transition-all bg-slate-50 dark:bg-transparent"
                        >
                            {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                        </button>

                        <div className="relative">
                            <button className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1C3540] transition-all relative">
                                <Bell size={20} />
                                {requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL').length > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#043E52]"></span>
                                )}
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-slate-200 dark:border-slate-700 ml-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-[#043E52] dark:text-white leading-none">{user.fullName || 'Partner'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Authorized CA</p>
                            </div>
                            <div className="relative group">
                                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED6E3F] to-[#8F6B4E] text-white flex items-center justify-center font-bold shadow-lg shadow-[#ED6E3F]/20 transition-transform active:scale-95">
                                    {user.fullName?.charAt(0) || 'C'}
                                </button>
                                {/* Dropdown Menu (Existing) */}
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#043E52] rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                                        <p className="text-sm font-bold text-[#043E52] dark:text-white truncate">{user.email}</p>
                                    </div>
                                    <button onClick={() => setActiveTab('profile')} className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-sm font-medium transition-colors">
                                        <Settings size={16} /> Account Settings
                                    </button>
                                    <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-sm font-bold transition-colors mt-1">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>

                            {/* Direct Logout Icon */}
                            <button onClick={onLogout} className="p-2.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 ml-2" title="Sign Out">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#ED6E3F]/5 to-transparent -z-10 pointer-events-none"></div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-7xl mx-auto"
                        >
                            {activeTab === 'notifications' && (
                                <div className="bg-white dark:bg-[#043E52] rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-bold mb-4">Notifications</h2>
                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        <Bell size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No notifications functionality implemented for CA yet.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <CaOverview
                                    requests={requests}
                                    handleAcceptRequest={handleAcceptRequest}
                                    handleRejectRequest={handleRejectRequest}
                                    setActiveTab={setActiveTab}
                                />
                            )}

                            {activeTab === 'opportunities' && (
                                <CaOpportunities setActiveTab={setActiveTab} />
                            )}

                            {activeTab === 'works' && (
                                <CaWorks
                                    requests={requests}
                                    employees={employees}
                                    handleAssignEmployee={handleAssignEmployee}
                                    respondToBoundAmount={respondToBoundAmount}
                                    fetchData={fetchData}
                                />
                            )}

                            {activeTab === 'employees' && (
                                <CaEmployees
                                    employees={employees}
                                    createEmployee={createEmployee}
                                    user={user}
                                    fetchData={fetchData}
                                />
                            )}

                            {activeTab === 'profile' && <CaProfile user={user} />}
                            {activeTab === 'support' && <CaSupport user={user} />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default CaDashboard;
