import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, FileText, CheckCircle, CreditCard, Settings, LogOut,
    Search, Bell, ChevronDown, Filter, Eye, DollarSign, AlertTriangle, TrendingUp, Menu, X,
    FileCheck, ChevronRight, BarChart3, Calendar, Download, PieChart, Cpu, MessageSquare, Globe, Shield, Database, HardDrive, Lock as LockIcon, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getAllApplications } from '../api';
import { hasPermission } from '../utils/permissions';
import MasterDashboard from './admin/views/MasterDashboard';
import SubAdminDashboard from './admin/views/SubAdminDashboard';
import AgentDashboard from './admin/views/AgentDashboard';
import CRMSystem from './admin/views/CRMSystem';

const AdminDashboardPage = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [permVersion, setPermVersion] = useState(0); // Force re-render on perm change

    // Use passed user prop, fallback to partial object if null (though App.jsx prevents this)
    const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');

    // Safety Force: Ensure main admin email always gets MASTER_ADMIN privileges 
    // (Fixes issue where old DB records might still have 'ADMIN' role)
    const role = (currentUser.email === 'admin@shinefiling.com') ? 'MASTER_ADMIN' : currentUser.role;

    // Listen for permission updates
    useEffect(() => {
        const handlePermUpdate = () => setPermVersion(v => v + 1);
        window.addEventListener('permissionsUpdated', handlePermUpdate);
        return () => window.removeEventListener('permissionsUpdated', handlePermUpdate);
    }, []);

    // Role-Based Sidebar Configuration
    const sidebarConfig = {
        'MASTER_ADMIN': [
            { icon: LayoutDashboard, label: 'Overview', id: 'dashboard' },           // A
            { icon: Users, label: 'User Mgmt', id: 'user_mgmt' },              // B
            { icon: Shield, label: 'Agent Approvals', id: 'agent_approvals' },   // New
            { icon: DollarSign, label: 'Pricing & Services', id: 'service_mgmt' },          // Updated icon and label
            { icon: FileText, label: 'Orders Mgmt', id: 'order_mgmt' },              // D
            { icon: Cpu, label: 'Automation Mgmt', id: 'ai_mgmt' },                    // E
            { icon: DollarSign, label: 'Payment & Finance', id: 'finance' },         // F
            { icon: Shield, label: 'Admin Controls', id: 'admin_controls' },         // G
            { icon: LockIcon, label: 'Firewall & Security', id: 'firewall' },            // New
            { icon: Briefcase, label: 'Careers & Hiring', id: 'careers_control' },       // New
            { icon: MessageSquare, label: 'Notifications', id: 'notifications' },    // H
            { icon: Globe, label: 'Content Mgmt', id: 'cms' },                       // I
            { icon: HardDrive, label: 'File Manager', id: 'file_manager' },          // K
            { icon: FileCheck, label: 'Audit & Logs', id: 'audit' },                 // J
        ],
        'SUB_ADMIN': [
            { icon: LayoutDashboard, label: 'Sub-Admin Dash', id: 'dashboard' },
            { icon: Users, label: 'User Mgmt', id: 'user_mgmt' },
            { icon: DollarSign, label: 'Pricing & Services', id: 'service_mgmt' },
            { icon: FileText, label: 'Orders Mgmt', id: 'order_mgmt' },
            { icon: Cpu, label: 'Automation Mgmt', id: 'ai_mgmt' },
            { icon: DollarSign, label: 'Payment & Finance', id: 'financials' },
            { icon: Shield, label: 'Admin Controls', id: 'admin_controls' },
            { icon: MessageSquare, label: 'Notifications', id: 'notifications' },
            { icon: Globe, label: 'Content Mgmt', id: 'cms' },
            { icon: FileCheck, label: 'Audit & Logs', id: 'logs' },
            { icon: Users, label: 'Agent Admin Mgmt', id: 'agent_admin_mgmt' },
            { icon: BarChart3, label: 'Regional Reports', id: 'reports' },
            { icon: CheckCircle, label: 'Content Moderation', id: 'content_mod' },
        ],
        'AGENT_ADMIN': [
            { icon: LayoutDashboard, label: 'Agent Dashboard', id: 'dashboard' },
            { icon: Users, label: 'Agent Onboarding', id: 'agent_onboarding' },
            { icon: TrendingUp, label: 'Performance', id: 'performance' },
            { icon: CheckCircle, label: 'Lead Assignment', id: 'lead_assignment' },
            { icon: FileText, label: 'Agent Support', id: 'agent_support' },
            { icon: DollarSign, label: 'Financials', id: 'financials' },
        ]
    };

    // Filter items based on dynamic permissions
    const rawItems = sidebarConfig[role] || sidebarConfig['MASTER_ADMIN'];
    const currentSidebarItems = rawItems.filter(item => hasPermission(role, item.id));

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const apps = await getAllApplications();
                setApplications(apps.map((app, index) => ({
                    id: `APP-00${app.id}`,
                    client: app.user ? app.user.fullName || app.user.email : 'Unknown User',
                    service: app.serviceName,
                    date: new Date(app.createdAt).toLocaleDateString(),
                    status: app.status
                })));
            } catch (err) {
                console.error("Failed to fetch admin apps", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [unreadSystemNotif, setUnreadSystemNotif] = useState(0);

    // Fetch unread counts
    useEffect(() => {
        const fetchCounts = async () => {
            if ('Notification' in window && Notification.permission !== 'granted') {
                Notification.requestPermission();
            }

            try {
                setUnreadSystemNotif(0);
            } catch (e) {
                console.error(e);
            }
        };

        fetchCounts();
        // Optional: Poll every minute
        const interval = setInterval(fetchCounts, 60000);
        return () => clearInterval(interval);
    }, []);

    const totalUnread = unreadSystemNotif; // + unreadChatCount if available

    // Sidebar Item Component
    const SidebarItem = ({ icon: Icon, label, id, onClick }) => {
        const isActive = activeTab === id;
        return (
            <button
                key={id}
                onClick={() => {
                    setActiveTab(id);
                    if (onClick) onClick();
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group mb-1 text-left justify-start ${isActive
                    ? 'bg-[#B58863] text-white shadow-lg shadow-[#B58863]/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                <Icon size={20} className={isActive ? 'text-white' : 'text-[#3D4D55] group-hover:text-white'} />
                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </button>
        );
    };

    return (
        <div className="flex h-screen bg-[#FDFBF7] font-sans overflow-hidden">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Sidebar (Navy Blue) */}
            <AnimatePresence>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`fixed inset-y-0 left-0 w-64 bg-[#10232A] text-white z-50 flex flex-col shadow-2xl md:shadow-none border-r border-[#10232A]/5 ${isSidebarOpen ? 'block' : 'hidden md:flex'}`}
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#B58863] flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
                            <span className="text-lg font-bold tracking-tight text-white">Shine<span className="text-[#B58863]">Admin</span></span>
                            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-[#3D4D55]"><X size={20} /></button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 no-scrollbar">
                            <div className="px-2 py-3 text-[11px] font-bold text-[#3D4D55] uppercase tracking-wider">Management</div>
                            {currentSidebarItems.map((item) => (
                                <SidebarItem key={item.id} icon={item.icon} label={item.label} id={item.id} />
                            ))}

                            <div className="px-2 py-3 mt-4 text-[11px] font-bold text-[#3D4D55] uppercase tracking-wider">System</div>
                            <SidebarItem icon={Settings} label="Settings" id="settings" />
                        </div>

                        {/* Profile Footer */}
                        <div className="p-4 bg-black/20 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                {currentUser.profileImage ? (
                                    <img src={currentUser.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-[#B58863]" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#B58863] text-white flex items-center justify-center font-bold text-sm shadow-md">
                                        {currentUser.fullName ? currentUser.fullName.charAt(0) : 'A'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{currentUser.fullName || 'System Admin'}</p>
                                    <p className="text-[10px] text-[#3D4D55] truncate uppercase tracking-wider font-bold">{role.replace('_', ' ')}</p>
                                </div>
                                <button onClick={onLogout} className="text-[#3D4D55] hover:text-red-400 transition"><LogOut size={18} /></button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="w-full md:w-96 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B58863] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Global Search (Orders, Clients, Services)..."
                            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-[#B58863]/10 focus:border-[#B58863] transition-all outline-none"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#10232A]">{currentUser.fullName || 'Admin'}</p>
                                <p className="text-xs text-gray-400 font-bold">{role.replace('_', ' ')}</p>
                            </div>
                            {currentUser.profileImage ? (
                                <img src={currentUser.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                            ) : (
                                <div className="w-10 h-10 bg-[#B58863]/10 text-[#B58863] rounded-full flex items-center justify-center font-bold text-sm border border-[#B58863]/20">
                                    {currentUser.fullName ? currentUser.fullName.charAt(0) : 'A'}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`relative p-2 rounded-full transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            <Bell size={20} />
                            {totalUnread > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                            )}
                        </button>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-600">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FDFBF7] relative">
                    <div className="relative z-10 max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            {role === 'MASTER_ADMIN' && <MasterDashboard activeTab={activeTab} />}
                            {role === 'SUB_ADMIN' && <SubAdminDashboard activeTab={activeTab} />}
                            {role === 'AGENT_ADMIN' && <AgentDashboard activeTab={activeTab} />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
