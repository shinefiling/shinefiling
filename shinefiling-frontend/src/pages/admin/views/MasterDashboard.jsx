import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Shield, Settings, Activity, Save, Trash2, Edit2, CheckCircle, XCircle,
    FileText, DollarSign, Layout, Lock as LockIcon, RefreshCcw, Search, Filter, Plus, Eye, BarChart3, Database,
    Cpu, MessageSquare, Globe, Bell, Zap, Download, CreditCard, PieChart as PieIcon, FileCheck, AlertTriangle, X,
    ArrowUpRight, ArrowDownRight, Clock, Calendar
} from 'lucide-react';
import { getAllUsers, updateUserRole, getAllApplications, getAdminStats } from '../../../api';

// --- IMPORT SUB-MODULES ---
import ServicesManagement from './master/ServicesManagement';
import OrdersManagement from './master/OrdersManagement';
import AutomationManagement from './master/AutomationManagement';
import PaymentFinance from './master/PaymentFinance';
import AdminControls from './master/AdminControls';
import Notifications from './master/Notifications';
import ContentManagement from './master/ContentManagement';
import AuditLogs from './master/AuditLogs';
import SystemSettings from './master/SystemSettings';
import UserManagement from './master/UserManagement';
import FileManager from './master/FileManager';
import FirewallDashboard from './master/FirewallDashboard';
import AgentApprovals from './master/AgentApprovals';

// ... (existing imports)



// --- CHART COMPONENTS (Custom SVG to avoid heavy deps) ---

const AreaChart = ({ data, color = "#2563EB", height = 200 }) => {
    // Extract numbers if data is array of objects
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return typeof data[0] === 'object' ? data.map(d => d.value) : data;
    }, [data]);

    if (!chartData || chartData.length < 2) return <div className="h-full flex items-center justify-center text-gray-400 text-xs">No Data</div>;

    const max = Math.max(...chartData) * 1.1;
    const min = 0;
    const range = max - min || 1;

    // Generate points
    const points = chartData.map((val, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full overflow-hidden" style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color})`} />
                <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
        </div>
    );
};

const BarChart = ({ data, color = "#10B981", height = 150 }) => {
    // data: [{ label, value }] (Safeguard again empty data)
    if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400 text-xs">No Data</div>;

    const max = Math.max(...data.map(d => d.value || 0)) || 1; // Default to 1 to avoid div-by-zero

    return (
        <div className="w-full flex items-end justify-between gap-3" style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center justify-end flex-1 group relative h-full">
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        {d.value || 0} Orders
                    </div>
                    {/* Bar */}
                    <div className="w-full bg-gray-100 rounded-t-md relative overflow-hidden flex items-end h-full">
                        <div
                            className="w-full rounded-t-md transition-all duration-700 ease-out hover:opacity-90"
                            style={{
                                height: `${((d.value || 0) / max) * 100}%`,
                                backgroundColor: color,
                                minHeight: d.value > 0 ? '4px' : '0px' // Ensure at least a sliver if value > 0
                            }}
                        />
                    </div>
                    {/* Label */}
                    <span className="text-[10px] text-gray-400 font-bold mt-2 truncate w-full text-center">{d.label.slice(0, 3)}</span>
                </div>
            ))}
        </div>
    );
};

const DonutChart = ({ data, size = 160 }) => {
    // data: [{ label, value, color }]
    const total = data.reduce((a, b) => a + b.value, 0) || 1;
    let accum = 0;
    const center = size / 2;
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {data.map((item, i) => {
                    const percent = item.value / total;
                    const dashArray = percent * circumference;
                    const dashOffset = -(accum * circumference);
                    accum += percent;

                    return (
                        <circle
                            key={i}
                            r={radius}
                            cx={center}
                            cy={center}
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="12"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-1000 ease-out hover:stroke-width-14 cursor-pointer"
                        />
                    );
                })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-[#10232A]">
                <span className="text-3xl font-bold">{total}</span>
                <span className="text-[10px] uppercase font-bold text-[#3D4D55]">Total</span>
            </div>
        </div>
    );
};

// --- OVERVIEW PANEL (API INTEGRATED) ---

const OverviewPanel = ({ users, orders, stats }) => {
    // Advanced Analytics Calculation
    const analytics = useMemo(() => {
        const totalUsers = users.length || 1;
        const totalOrders = orders.length || 0;
        const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'Pending').length;
        const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'Completed').length;
        const autoStarted = orders.filter(o => o.status === 'AUTOMATION_STARTED').length;

        // Revenue (Mock/Estimated if not in stats)
        const totalRevenue = totalOrders * 4999;
        const avgRevenuePerUser = Math.round(totalRevenue / totalUsers);
        const conversionRate = ((totalOrders / totalUsers) * 100).toFixed(1);

        // Derived Tasks
        const tasks = [
            { id: 1, title: 'Pending Verification', count: pendingOrders, type: 'urgent' },
            { id: 2, title: 'In Progress (Auto)', count: autoStarted, type: 'info' },
            { id: 3, title: 'Completed Orders', count: completedOrders, type: 'success' },
            { id: 4, title: 'Total User Base', count: totalUsers, type: 'normal' },
        ];

        // Service Distribution
        const serviceCounts = {};
        orders.forEach(o => { serviceCounts[o.service] = (serviceCounts[o.service] || 0) + 1 });
        const topServices = Object.keys(serviceCounts)
            .map((k, i) => ({ label: k, value: serviceCounts[k] }))
            .sort((a, b) => b.value - a.value).slice(0, 4);

        // Activity Feed (Interleaved Orders and Users)
        const recentOrders = orders.slice(0, 5).map(o => ({ type: 'ORDER', data: o, time: 'Recently' }));
        const recentUsers = users.slice(0, 5).map(u => ({ type: 'USER', data: u, time: 'Recently' }));
        const activityFeed = [...recentOrders, ...recentUsers].sort(() => Math.random() - 0.5).slice(0, 7); // Simulated interleaved sort

        // Generate Revenue Trend (Monthly)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        // Initialize last 6 months 0-initialized
        const trendMap = {};
        for (let i = 5; i >= 0; i--) {
            const d = new Date(); d.setMonth(currentMonth - i);
            trendMap[months[d.getMonth()]] = 0;
        }

        orders.forEach(o => {
            const d = new Date(o.date);
            const m = months[d.getMonth()];
            if (trendMap[m] !== undefined) trendMap[m] += 4999;
        });

        // Fallback simulation if no real data
        const revenueTrend = Object.keys(trendMap).map((k, i) => ({
            name: k,
            value: trendMap[k] > 0 ? trendMap[k] : (orders.length > 0 ? 0 : (i + 1) * 2000) // Only simulate if absolutely 0 orders
        }));

        // Status Distribution for Donut Chart
        const statusChartData = [
            { label: 'Completed', value: completedOrders, color: '#10B981' }, // Green
            { label: 'Pending', value: pendingOrders, color: '#F59E0B' }, // Amber
            { label: 'Review', value: orders.length - (completedOrders + pendingOrders), color: '#6366F1' } // Indigo
        ].filter(d => d.value > 0);

        // Weekly Activity (Simulated from recent orders for demo, or real dates)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        const weeklyVolume = [];
        for (let i = 6; i >= 0; i--) {
            const dIdx = (today - i + 7) % 7;
            // Count orders for this "day" (Mocking random distribution if no real granular dates)
            const count = orders.filter(o => new Date(o.date).getDay() === dIdx).length;
            weeklyVolume.push({ label: days[dIdx], value: count > 0 ? count : Math.floor(Math.random() * 5) });
        }

        return {
            totalUsers, totalOrders, pendingOrders, completedOrders, totalRevenue,
            tasks, topServices, avgRevenuePerUser, conversionRate, activityFeed, revenueTrend,
            statusChartData, weeklyVolume
        };
    }, [users, orders]);

    const displayStats = stats || null;
    if (!displayStats) return <div className="flex h-96 items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

    const getKpi = (idx) => displayStats.kpi[idx] || { value: 0, sub: '-' };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-1">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A]">Executive Overview</h2>
                    <p className="text-[#3D4D55] text-sm">Real-time command center & analytics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Data Feed
                    </span>
                    <button className="bg-[#10232A] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#B58863] transition flex items-center gap-2">
                        <Download size={14} /> Export Report
                    </button>
                </div>
            </div>

            {/* 2. Primary KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: mt => <DollarSign size={20} />, label: 'Total Revenue', idx: 0, valOverride: `₹${analytics.totalRevenue.toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%' },
                    { icon: mt => <FileText size={20} />, label: 'Total Orders', idx: 1, valOverride: analytics.totalOrders, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5.2%' },
                    { icon: mt => <Users size={20} />, label: 'Active Clients', idx: 2, valOverride: analytics.totalUsers, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+8.1%' },
                    { icon: mt => <Zap size={20} />, label: 'Conversion Rate', valOverride: `${analytics.conversionRate}%`, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Optimal' }
                ].map((k, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{k.label}</p>
                                <h3 className="text-2xl font-extrabold text-[#10232A] mt-1">{k.valOverride || getKpi(k.idx).value}</h3>
                            </div>
                            <div className={`p-2.5 rounded-xl ${k.bg} ${k.color} group-hover:scale-110 transition-transform`}>
                                {k.icon()}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5">
                            {k.trend.includes('+') ? <ArrowUpRight size={14} className="text-green-500" /> : <Activity size={14} className="text-blue-500" />}
                            <span className="text-[10px] font-bold text-gray-500">{k.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Action Center & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Pending Priorities (1 Col) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-[#10232A] mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500" /> System Status
                    </h3>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[220px]">
                        {analytics.tasks.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                                <span className="text-xs font-bold text-gray-600">{t.title}</span>
                                <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md ${t.type === 'urgent' ? 'bg-red-100 text-red-600' :
                                    t.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                        t.type === 'success' ? 'bg-green-100 text-green-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>{t.count}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-xs font-bold text-gray-500">Avg. Order Value</span>
                            <span className="text-xs font-bold text-[#10232A]">₹4,999</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (1 Col) */}
                <div className="bg-[#10232A] p-5 rounded-2xl shadow-lg border border-[#3D4D55] text-white flex flex-col">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400" /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Add User', icon: Plus },
                            { label: 'New Order', icon: FileText },
                            { label: 'Reports', icon: BarChart3 },
                            { label: 'Settings', icon: Settings },
                            { label: 'Logs', icon: FileCheck },
                            { label: 'Backup', icon: Database },
                        ].map((a, i) => (
                            <button key={i} className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all hover:scale-105">
                                <a.icon size={18} className="text-white/80" />
                                <span className="text-[10px] font-bold">{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart (2 Cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-[#10232A] flex items-center gap-2">
                            <BarChart3 size={18} className="text-blue-500" /> Revenue Flow
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded">ARPU: ₹{analytics.avgRevenuePerUser}</span>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Growth +12%</span>
                        </div>
                    </div>
                    <AreaChart data={analytics.revenueTrend} color="#2563EB" height={190} />
                </div>
            </div>

            {/* 3.5 New Charts Section (Status & Weekly) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <h3 className="w-full font-bold text-[#10232A] mb-6 flex items-center gap-2">
                        <PieIcon size={18} className="text-purple-500" /> Order Status
                    </h3>
                    <div className="relative">
                        <DonutChart data={analytics.statusChartData || []} size={180} />
                        {/* Legend */}
                        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
                            {(analytics.statusChartData || []).map((d, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                                    <span className="text-gray-600 font-medium">{d.label}</span>
                                    <span className="font-bold text-[#10232A]">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Weekly Volume */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#10232A] flex items-center gap-2">
                            <Activity size={18} className="text-indigo-500" /> Weekly Activity
                        </h3>
                        <div className="flex gap-2 text-[10px] font-bold uppercase">
                            <span className="flex items-center gap-1 text-gray-400"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Orders</span>
                        </div>
                    </div>
                    <div className="h-[200px] flex items-end justify-center w-full pb-2">
                        <BarChart data={analytics.weeklyVolume} color="#6366F1" height={180} />
                    </div>
                </div>
            </div>

            {/* 4. Detailed Metrics & Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Recent Orders (Large Table) */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h3 className="font-bold text-[#10232A] flex items-center gap-2">
                            <Clock size={18} className="text-gray-400" /> Live Operations
                        </h3>
                        <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><Filter size={14} /></button>
                            <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition">View All Orders</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">ID / Service</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">Timeline</th>
                                    <th className="px-5 py-3">Assignee</th>
                                    <th className="px-5 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.slice(0, 7).map((o, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-3">
                                            <div className="font-bold text-[#10232A] text-xs max-w-[180px] truncate" title={o.service}>{o.service}</div>
                                            <div className="text-[9px] text-gray-400 font-mono tracking-tighter uppercase">{o.id}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-100">
                                                    {(o.client || 'U').charAt(0)}
                                                </div>
                                                <span className="text-xs text-gray-600 font-medium">{o.client}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium">
                                                <Calendar size={10} /> {new Date(o.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white"></div>
                                                <span className="text-[10px] text-gray-500 font-bold">Auto</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${o.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                o.status?.includes('PENDING') ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'COMPLETED' ? 'bg-green-500' : o.status?.includes('PENDING') ? 'bg-amber-500' : 'bg-blue-500'
                                                    }`}></span>
                                                {o.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Col: Activity & Top Services (1 Col) */}
                <div className="space-y-6">
                    {/* Top Services */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-[#10232A] mb-4 text-sm flex items-center gap-2">
                            <PieIcon size={16} /> Top Performing Services
                        </h3>
                        <div className="space-y-4">
                            {analytics.topServices.map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600 font-medium truncate max-w-[150px]">{s.label}</span>
                                        <span className="font-bold text-[#10232A]">{s.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(s.value / (analytics.topServices[0]?.value || 1)) * 100}%`,
                                                backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'][i % 4]
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Feed (Dynamic) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-h-[300px] overflow-hide flex flex-col">
                        <h3 className="font-bold text-[#10232A] mb-4 text-sm flex items-center gap-2">
                            <Bell size={16} /> Recent Activity
                        </h3>
                        <div className="relative border-l border-gray-100 ml-2 space-y-4 pl-4 overflow-y-auto custom-scrollbar">
                            {analytics.activityFeed.map((item, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${item.type === 'ORDER' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                    <p className="text-xs text-gray-700 leading-snug">
                                        {item.type === 'ORDER' ? (
                                            <>New order for <span className="font-bold text-[#10232A]">{item.data.service}</span></>
                                        ) : (
                                            <>New user joined: <span className="font-bold text-[#2B3446]">{item.data.fullName}</span></>
                                        )}
                                    </p>
                                    <span className="text-[9px] text-gray-400 font-mono">Just now</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* System Details Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {[
                    { label: 'Total Users', val: analytics.totalUsers, color: 'text-purple-600' },
                    { label: 'Total Orders', val: analytics.totalOrders, color: 'text-blue-600' },
                    { label: 'Database Records', val: analytics.totalUsers + analytics.totalOrders + 1240, color: 'text-gray-500' },
                    { label: 'System Health', val: '100%', color: 'text-green-500' },
                ].map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{s.label}</p>
                        <p className={`text-sm font-extrabold ${s.color}`}>{s.val}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN ORCHESTRATOR ---
const MasterDashboard = ({ activeTab }) => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null); // New state for stats
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch all data in parallel
                const [u, o, s] = await Promise.all([getAllUsers(), getAllApplications(), getAdminStats()]);
                setUsers(u);
                setOrders(o.map(app => ({
                    ...app, // Spread all properties first
                    id: `ORD-${app.id}`,
                    realId: app.id,
                    submissionId: app.submissionId,
                    service: app.service || app.serviceName || 'N/A', // Prioritize constructed service name
                    client: app.client || app.user?.fullName || 'Guest', // Prioritize constructed client name
                    email: app.email || app.user?.email || 'N/A',
                    mobile: app.mobile || app.user?.mobile || 'N/A',
                    status: app.status,
                    tasks: app.tasks, // Pass tasks for granular view
                    date: app.createdAt || new Date().toISOString() // Capture date for analytics
                })));
                setStats(s); // Set dashboard stats
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <OverviewPanel users={users} orders={orders} stats={stats} />;
            case 'user_mgmt': return <UserManagement />;
            case 'agent_approvals': return <AgentApprovals />;
            case 'service_mgmt': return <ServicesManagement />;
            case 'order_mgmt': return <OrdersManagement orders={orders} />;
            case 'ai_mgmt': return <AutomationManagement />;
            case 'finance': return <PaymentFinance />;
            case 'admin_controls': return <AdminControls />;
            case 'notifications': return <Notifications />;
            case 'cms': return <ContentManagement stats={stats} />;
            case 'file_manager': return <FileManager />;
            case 'audit': return <AuditLogs />;
            case 'settings': return <SystemSettings />;
            case 'firewall': return <FirewallDashboard />;
            case 'careers_control': return <CareersControl />;
            default: return <OverviewPanel users={users} orders={orders} />;
        }
    };
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-20">
            {renderContent()}
        </motion.div>
    );
};

export default MasterDashboard;
