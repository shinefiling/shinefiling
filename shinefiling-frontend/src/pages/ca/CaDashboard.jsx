
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, Bell, LogOut, Menu, X, Sun, Moon, Settings, MessageSquare, ChevronRight, Zap, Shield
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
import CaKyc from './views/CaKyc';

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
            section: 'KYC & COMPLIANCE',
            items: [
                { id: 'kyc', label: 'KYC Verification', icon: Shield },
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
            <div className="p-8 pb-4 flex flex-col items-center relative">
                <img src="/logo.png" alt="ShineFiling" className="h-20 w-auto object-contain dark:brightness-200 mb-2" />
                <div className="h-px w-12 bg-orange-500/20 rounded-full"></div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute right-4 top-8 p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6 no-scrollbar">
                {sidebarConfig.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="px-6 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{group.section}</h3>
                        <div className="space-y-0.5">
                            {group.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                    className={`
                                        w-full flex items-center gap-3 px-6 py-2.5 transition-all duration-200 group text-left relative
                                        ${activeTab === item.id
                                            ? 'text-slate-800 dark:text-white font-bold'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}
                                    `}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeTab === item.id ? 'bg-[#F97316] scale-125' : 'bg-transparent'}`}></div>
                                    <item.icon size={18} className={activeTab === item.id ? 'text-[#F97316]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                                    <span className="text-sm relative z-10">{item.label}</span>
                                    {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-0" />}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 font-roboto text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .font-roboto { font-family: 'Roboto', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}</style>
            {/* Desktop Sidebar (Static) */}
            {!isMobile && (
                <div className="w-64 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200 z-50 flex flex-col shadow-md border-r border-slate-100 transition-colors duration-300">
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
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 z-50 flex flex-col shadow-2xl transition-colors duration-300"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Actions */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4 min-w-[200px]">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">
                            {sidebarConfig.flatMap(g => g.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    {/* Centered Title - Improved to avoid overlap */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-4 pointer-events-none">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#F97316] opacity-50"></div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 px-6 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase mb-0.5">ShineFiling</span>
                                <div className="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>
                                <span className="text-sm font-black text-[#F97316] tracking-[0.15em] uppercase italic">CA Partner</span>
                            </div>
                        </div>
                        <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#F97316] opacity-50"></div>
                    </div>



                    <div className="flex items-center gap-2 ml-auto pr-2">
                        <button className="relative p-2 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <Bell size={20} />
                            {requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL').length > 0 && (
                                <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 ml-2">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.fullName || 'Partner'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-widest">CA Partner</p>
                            </div>
                            <div className="relative group">
                                <button className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-all ring-2 ring-transparent hover:ring-orange-500 ring-offset-2 dark:ring-offset-slate-800">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
                                </button>
                                <div className="absolute right-0 top-full mt-3 w-56 premium-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl border border-slate-100 dark:border-slate-700 z-50">
                                    <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700 mb-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <button onClick={() => setActiveTab('profile')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all">
                                            <Settings size={14} className="text-orange-500" /> Profile Settings
                                        </button>
                                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-xs font-bold transition-all">
                                            <LogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 overflow-y-auto p-6 bg-[#F3F4F6] dark:bg-slate-900 relative scroll-smooth transition-colors duration-200">
                    <div className="max-w-[1600px] mx-auto">
                        {/* KYC Warning Banner */}
                        {user.kycStatus !== 'VERIFIED' && activeTab !== 'kyc' && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                        <Shield size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-tight">Complete Your KYC Verification</p>
                                        <p className="text-white/80 text-xs">Verify your personal and professional documents to start accepting requests from clients.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('kyc')}
                                    className="px-6 py-2.5 bg-white text-orange-600 rounded-xl font-bold text-sm shadow-sm hover:scale-105 transition-transform"
                                >
                                    Verify Now
                                </button>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'notifications' && (
                                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
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
                                {activeTab === 'kyc' && <CaKyc user={user} onComplete={() => { fetchData(); setActiveTab('overview'); }} />}
                                {activeTab === 'support' && <CaSupport user={user} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CaDashboard;
