import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Bell, Plus,
    CreditCard, HelpCircle, Menu, X, User, Package, LogOut, Zap
} from 'lucide-react';
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
import ComingSoon from '../components/ComingSoon';

const DashboardPage = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Initialize user from localStorage to prevent flash of guest content
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { fullName: 'Guest', email: '' };
    });
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const location = useLocation();

    useEffect(() => {
        let interval;
        const fetchNotes = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                // Only set user if it's different to avoid loops/re-renders if strict mode
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
        interval = setInterval(fetchNotes, 10000); // Poll every 10s

        // Parse tab from URL
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }

        return () => clearInterval(interval);
    }, [location]);

    // Fetch Services for Sidebar (Dynamic Control)
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

    const SidebarItem = ({ icon: Icon, label, id }) => (
        <button
            onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-200 ${activeTab === id
                ? 'bg-[#B58863]/10 text-[#B58863] shadow-sm ring-1 ring-[#B58863]/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={18} className={`transition-colors ${activeTab === id ? 'text-[#B58863]' : 'text-slate-500 group-hover:text-white'}`} />
            {label}
        </button>
    );

    const isEmployee = user?.role?.toUpperCase() === 'EMPLOYEE';

    const renderContent = () => {
        if (isEmployee) {
            return <ComingSoon />;
        }

        switch (activeTab) {
            case 'overview': return <ClientHome setActiveTab={setActiveTab} />;
            case 'new-filing': return <NewFiling setActiveTab={setActiveTab} initialCategory={selectedCategory} />;
            case 'orders': return <MyOrders />;
            case 'payments': return <ClientPayments />;
            case 'profile': return <ClientProfile />;
            case 'support': return <ClientSupport />;
            case 'notifications': return <ClientNotifications />;
            default: return <ClientHome setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans flex text-slate-800 selection:bg-[#B58863]/20">

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-[#10232A] text-white sticky top-0 z-50 w-full shadow-md">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <span className="text-white">Shine<span className="text-[#B58863]">Filing</span></span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition text-white"><Menu size={24} /></button>
            </div>

            {/* Sidebar (Deep Navy Theme) */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-[#10232A] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col shadow-2xl md:shadow-none border-r border-white/5`}>
                <div className="p-8 flex justify-between items-center">
                    <div className="flex items-center gap-0 font-bold text-2xl tracking-tighter">
                        {/* Simple Text Logo for Clean Look */}
                        <span className="text-white">Shine<span className="text-[#B58863]">Filing</span></span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition p-1"><X size={20} /></button>
                </div>

                <div className="px-4 py-2 space-y-2 flex-1 overflow-y-auto hidden-scrollbar">
                    {isEmployee ? (
                        <>
                            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">Menu</div>
                            <SidebarItem icon={LayoutDashboard} label="Dashboard" id="overview" />
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Start Here</div>
                            <button
                                onClick={() => { setActiveTab('new-filing'); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all mb-6 mt-1 shadow-lg shadow-[#B58863]/20 group ${activeTab === 'new-filing'
                                    ? 'bg-[#B58863] text-white'
                                    : 'bg-gradient-to-r from-[#B58863] to-[#C19A78] text-white hover:brightness-110'
                                    }`}
                            >
                                <Plus size={18} className="stroke-[3px]" /> New Filing
                            </button>

                            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</div>
                            <SidebarItem icon={LayoutDashboard} label="Dashboard" id="overview" />
                            <SidebarItem icon={Package} label="My Applications" id="orders" />
                            <SidebarItem icon={CreditCard} label="Billing & Invoices" id="payments" />

                            <div className="px-4 py-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account</div>
                            <SidebarItem icon={User} label="Profile & KYC" id="profile" />
                            <SidebarItem icon={HelpCircle} label="Help & Support" id="support" />
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-[#0D1C22]">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all group">
                        <LogOut size={18} className="text-slate-500 group-hover:text-white transition-colors" /> Sign Out
                    </button>
                    <div className="mt-4 text-[10px] text-slate-600 text-center font-bold tracking-wide uppercase">
                        ShineFiling © 2024
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-[#10232A]/80 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />}

            {/* Main Content Area */}
            <div className="flex-1 md:ml-72 flex flex-col min-h-screen transition-all duration-300">

                {/* Header with Logo */}
                <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="flex items-center gap-0 font-bold text-xl tracking-tighter">
                            <span className="text-[#10232A]">Shine<span className="text-[#B58863]">Filing</span></span>
                        </div>
                        <h1 className="text-xl font-bold text-[#10232A] tracking-tight hidden md:block">
                            {activeTab === 'overview' ? 'Overview' :
                                activeTab === 'new-filing' ? 'New Service' :
                                    activeTab === 'orders' ? 'My Applications' :
                                        activeTab === 'payments' ? 'Billing' :
                                            activeTab === 'profile' ? 'Profile' : 'Support'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className="relative text-[#3D4D55] hover:text-[#B58863] transition-colors"
                        >
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FDFBF7]"></span>
                            )}
                        </button>

                        <div className="flex items-center gap-4 cursor-pointer group">
                            {/* User Avatar - Circle with Image or Initials */}
                            <div className="w-10 h-10 rounded-full bg-[#10232A] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white border border-[#3D4D55]/20 overflow-hidden">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                                )}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-[#10232A] leading-none mb-1 group-hover:text-[#B58863] transition-colors">{user.fullName || 'User'}</p>
                                <p className="text-[10px] text-[#3D4D55] font-bold uppercase tracking-wide">
                                    {isEmployee ? 'Employee' : 'Business Owner'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto hidden-scrollbar max-w-[1400px] w-full mx-auto">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {renderContent()}
                    </div>
                </main>

            </div>
        </div>
    );
};

export default DashboardPage;
