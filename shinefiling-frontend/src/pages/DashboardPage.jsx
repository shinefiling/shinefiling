import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Bell, Plus,
    CreditCard, HelpCircle, Menu, X, User, Package, LogOut, Zap,
    Sun, Moon, Settings, Search, ChevronDown, Folder, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications, getServiceCatalog } from '../api';
import { getInactiveServices } from '../utils/serviceManager';
import { SERVICE_DATA } from '../data/services';

import ClientHome from './client/ClientHome';
import NewFiling from './client/NewFiling';
import MyOrders from './client/MyOrders';
import ClientPayments from './client/ClientPayments';
import ClientProfile from './client/ClientProfile';
import ClientSupport from './client/ClientSupport';
import ClientNotifications from './client/ClientNotifications';
import ClientDocuments from './client/ClientDocuments';
import ClientCompliance from './client/ClientCompliance';
import ComingSoon from '../components/ComingSoon';

const DashboardPage = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // Initialize user from localStorage
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { fullName: 'Guest', email: '' };
    });
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const location = useLocation();

    // Theme Effect
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

    useEffect(() => {
        let interval;
        const fetchNotes = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                if (JSON.stringify(userData) !== JSON.stringify(user)) {
                    setUser(userData);
                }

                try {
                    const data = await getNotifications(userData.email);
                    if (Array.isArray(data)) {
                        setNotifications(data);
                        setUnreadCount(data.filter(n => !(n.isRead || n.read)).length);
                    }
                } catch (e) {
                    console.error("Failed to fetch notifications", e);
                }
            }
        };

        fetchNotes();
        interval = setInterval(fetchNotes, 10000);

        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }

        return () => clearInterval(interval);
    }, [location]);

    // Fetch Services for Sidebar (Dynamic Logic Preserved)
    useEffect(() => {
        const loadServices = async () => {
            try {
                const apiData = await getServiceCatalog();
                const inactiveList = getInactiveServices();

                let rawServices = apiData && apiData.length > 0 ? apiData : [];
                if (rawServices.length === 0) {
                    Object.values(SERVICE_DATA).forEach(cat => {
                        cat.items.forEach(item => {
                            rawServices.push({ name: item, category: cat.label, categoryId: cat.id });
                        });
                    });
                }

                const activeServices = rawServices.filter(s => {
                    const isInactiveGlobally = s.status === 'INACTIVE';
                    const isInactiveLocally = inactiveList.includes(s.id || s.name);
                    return !isInactiveGlobally && !isInactiveLocally;
                });

                const cats = [];
                const seenCats = new Set();
                activeServices.forEach(s => {
                    const id = s.categoryId || 'others';
                    if (!seenCats.has(id)) {
                        seenCats.add(id);
                        cats.push({ id, label: s.category || 'Other', icon: SERVICE_DATA[id]?.icon || Zap });
                    }
                });
                setServiceCategories(cats);
            } catch (e) { console.error(e); }
        };
        loadServices();
        window.addEventListener('serviceStatusChanged', loadServices);
        return () => window.removeEventListener('serviceStatusChanged', loadServices);
    }, []);

    // Listen for User Updates
    useEffect(() => {
        const handleUserUpdate = () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        };
        window.addEventListener('userUpdated', handleUserUpdate);
        return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }, []);


    const isEmployee = user?.role?.toUpperCase() === 'EMPLOYEE';

    const renderContent = () => {
        if (isEmployee) {
            return <ComingSoon />;
        }

        switch (activeTab) {
            case 'overview': return <ClientHome setActiveTab={setActiveTab} />;
            case 'new-filing': return <NewFiling setActiveTab={setActiveTab} initialCategory={selectedCategory} />;
            case 'orders': return <MyOrders />;
            case 'documents': return <ClientDocuments />;
            case 'compliance': return <ClientCompliance />;
            case 'payments': return <ClientPayments />;
            case 'profile': return <ClientProfile />;
            case 'support': return <ClientSupport />;
            case 'notifications': return <ClientNotifications />;
            default: return <ClientHome setActiveTab={setActiveTab} />;
        }
    };

    // Refined Sidebar Item to match Admin Dashboard Style
    const SidebarItem = ({ icon: Icon, label, id, hot }) => {
        const isActive = activeTab === id;
        return (
            <div className="mb-0.5">
                <button
                    onClick={() => { setActiveTab(id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                    className={`
                        w-full flex items-center justify-between px-6 py-2.5 transition-all duration-200 group text-left relative
                        ${isActive
                            ? 'text-white font-bold bg-[#B58863]/10 border-r-4 border-[#B58863]'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-[#B58863] scale-125' : 'bg-transparent'}`}></div>
                        <Icon size={18} className={isActive ? 'text-[#B58863]' : 'text-slate-400 group-hover:text-white'} />
                        <span className="text-sm">{label}</span>
                    </div>
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
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`fixed inset-y-0 left-0 w-64 bg-[#10232A] text-white z-50 flex flex-col shadow-xl md:shadow-md border-r border-white/5 ${isSidebarOpen ? 'block' : 'hidden md:flex'}`}
                    >
                        <div className="h-16 flex items-center px-6 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full border-2 border-[#B58863] flex items-center justify-center">
                                    <div className="w-4 h-4 bg-[#B58863] rounded-full"></div>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">Shine<span className="text-[#B58863]">Filing</span></span>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-400"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 space-y-6 no-scrollbar">
                            {/* CTA Button */}
                            {!isEmployee && (
                                <div className="px-6 mb-2">
                                    <button
                                        onClick={() => { setActiveTab('new-filing'); setIsSidebarOpen(false); }}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#B58863]/20 group ${activeTab === 'new-filing'
                                            ? 'bg-[#B58863] text-white'
                                            : 'bg-gradient-to-r from-[#B58863] to-[#C19A78] text-white hover:brightness-110'
                                            }`}
                                    >
                                        <Plus size={18} /> New Filing
                                    </button>
                                </div>
                            )}

                            <div>
                                <div className="px-6 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Main Menu</div>
                                <SidebarItem icon={LayoutDashboard} label="Dashboard" id="overview" />
                                {!isEmployee && (
                                    <>
                                        <SidebarItem icon={Package} label="My Applications" id="orders" />
                                        <SidebarItem icon={Folder} label="My Documents" id="documents" />
                                        <SidebarItem icon={Calendar} label="Compliance Calendar" id="compliance" />
                                        <SidebarItem icon={CreditCard} label="Billing & Invoices" id="payments" />
                                    </>
                                )}
                            </div>

                            {!isEmployee && (
                                <div>
                                    <div className="px-6 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account</div>
                                    <SidebarItem icon={User} label="Profile & KYC" id="profile" />
                                    <SidebarItem icon={HelpCircle} label="Help & Support" id="support" />
                                </div>
                            )}


                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white dark:bg-[#10232A] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 z-30 sticky top-0 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500"><Menu size={24} /></button>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight hidden md:block">
                            {activeTab === 'overview' ? 'Overview' :
                                activeTab === 'new-filing' ? 'New Service' :
                                    activeTab === 'orders' ? 'My Applications' :
                                        activeTab === 'documents' ? 'Document Vault' :
                                            activeTab === 'compliance' ? 'Compliance Calendar' :
                                                activeTab === 'payments' ? 'Billing' :
                                                    activeTab === 'profile' ? 'Profile' :
                                                        activeTab === 'notifications' ? 'Notifications' : 'Support'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>

                        <button onClick={() => setActiveTab('notifications')} className="relative p-2 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>}
                        </button>

                        <button onClick={onLogout} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors" title="Sign Out">
                            <LogOut size={20} />
                        </button>

                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 ml-2">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.fullName || 'User'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">{isEmployee ? 'Employee' : 'Client'}</p>
                            </div>
                            <button className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent hover:ring-[#B58863] transition-all relative group">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#B58863] to-[#A67C52] flex items-center justify-center text-white font-bold text-sm">
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Render */}
                <main className="flex-1 p-6 bg-[#F3F4F6] dark:bg-[#0D1C22] overflow-y-auto relative scroll-smooth transition-colors duration-200">
                    <div className="max-w-7xl mx-auto pb-20 md:pb-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav for quick access (Optional, keeping consistent with old design but updating style) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#10232A] border-t border-slate-200 dark:border-white/10 h-[70px] z-[100] flex justify-between items-center px-6 shadow-lg pb-safe-bottom">
                <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-[#B58863]' : 'text-slate-400'}`}>
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-[#B58863]' : 'text-slate-400'}`}>
                    <Package size={20} />
                    <span className="text-[10px] font-bold">Apps</span>
                </button>
                <div className="relative -top-6">
                    <button onClick={() => setActiveTab('new-filing')} className="w-14 h-14 rounded-full bg-[#10232A] dark:bg-[#B58863] text-white flex items-center justify-center shadow-lg ring-4 ring-[#F3F4F6] dark:ring-[#0D1C22]">
                        <Plus size={28} />
                    </button>
                </div>
                <button onClick={() => setActiveTab('notifications')} className={`flex flex-col items-center gap-1 ${activeTab === 'notifications' ? 'text-[#B58863]' : 'text-slate-400'}`}>
                    <Bell size={20} />
                    <span className="text-[10px] font-bold">Alerts</span>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-[#B58863]' : 'text-slate-400'}`}>
                    <User size={20} />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </div>

        </div>
    );
};

export default DashboardPage;
