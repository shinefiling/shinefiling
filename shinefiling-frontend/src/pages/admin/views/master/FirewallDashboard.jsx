import React, { useState, useEffect } from 'react';
import {
    Shield, AlertTriangle, Activity, Lock as LockIcon, Search, RefreshCcw,
    Globe, Server, Zap, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- COMPONENT: Security Flow Visualization ---
const SecurityFlowDiagram = ({ status }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Activity size={100} />
            </div>

            <h3 className="font-bold text-[#10232A] mb-6 flex items-center gap-2">
                <Zap size={18} className="text-[#B58863]" /> Live Traffic Inspection Flow
            </h3>

            <div className="flex items-center justify-between relative z-10">
                {/* Node 1: Internet */}
                <div className="text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] text-[#B58863] border border-[#B58863]/20 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <Globe size={32} />
                    </div>
                    <p className="text-xs font-bold text-[#3D4D55] uppercase tracking-wider">Public Internet</p>
                    <p className="text-[10px] text-[#3D4D55]/60">Inbound Traffic</p>
                </div>

                {/* Connection Line 1 */}
                <div className="flex-1 h-1 bg-gray-100 mx-4 relative overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-blue-400/20 w-1/2 animate-[shimmer_2s_infinite]"></div>
                </div>

                {/* Node 2: The Firewall (Centerpiece) */}
                <div className="text-center relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10232A] to-[#3D4D55] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#10232A]/20 z-10 relative">
                        <Shield size={40} className="animate-pulse text-[#B58863]" />
                    </div>
                    <div className="absolute -inset-4 bg-[#FDFBF7] rounded-full -z-0 animate-ping opacity-20"></div>
                    <p className="text-sm font-bold text-[#10232A] uppercase tracking-wider">ShineGuard Core</p>
                    <p className="text-[10px] text-[#B58863] font-bold">21-Layer Filtering</p>
                </div>

                {/* Connection Line 2 */}
                <div className="flex-1 h-1 bg-gray-100 mx-4 relative overflow-hidden rounded-full">
                    <div className={`absolute inset-0 w-1/2 animate-[shimmer_2s_infinite] ${status === 'secure' ? 'bg-emerald-400/20' : 'bg-red-400/20'}`}></div>
                </div>

                {/* Node 3: Secure Server */}
                <div className="text-center group">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm transition-colors ${status === 'secure' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                        <Server size={32} />
                    </div>
                    <p className="text-xs font-bold text-[#3D4D55] uppercase tracking-wider">App Server</p>
                    <p className="text-[10px] text-[#3D4D55]/60">Protected Backend</p>
                </div>
            </div>

            <div className="mt-8 bg-[#FDFBF7] rounded-lg p-3 text-center border border-[#B58863]/10">
                <p className="text-xs text-[#3D4D55] font-mono flex justify-center items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    STATUS: TRAFFIC NORMALIZED • LATENCY: 24ms • FILTERING ACTIVE
                </p>
            </div>
        </div>
    );
};

// --- COMPONENT: 21-Layer Architecture Grid ---
const DefenseLayersGrid = () => {
    const categories = [
        {
            name: "Network & Identity",
            color: "emerald",
            layers: ["AI Rate Limiting", "Anti-Bot Protection", "Geo-Fencing", "Traffic Analysis", "Session Monitor"]
        },
        {
            name: "Application Protocol",
            color: "blue",
            layers: ["HTTP Method Validation", "Protocol Anomaly", "HSTS Enforcement", "Referrer Policy", "Header Sanity"]
        },
        {
            name: "Payload & Injection",
            color: "red",
            layers: ["SQL Injection WAF", "XSS Attack WAF", "Command Injection", "Malicious Payload", "MIME-Sniffing"]
        },
        {
            name: "Data & Filesystem",
            color: "amber",
            layers: ["Path Traversal Shield", "Sensitive File Control", "Protected Uploads Guard", "Clickjacking Defense", "Brute Force Protection", "CSP Policy"]
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FDFBF7]/50">
                <h3 className="font-bold text-[#10232A] flex items-center gap-2">
                    <LockIcon size={18} className="text-[#B58863]" /> Defense Matrix
                </h3>
                <span className="bg-[#10232A] text-[#B58863] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-[#B58863]/20">
                    21 Layers Active
                </span>
            </div>

            <div className="p-6 space-y-6">
                {categories.map((cat, idx) => (
                    <div key={idx}>
                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 text-${cat.color}-600 flex items-center gap-2`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-${cat.color}-500`}></span>
                            {cat.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {cat.layers.map((layer, lIdx) => (
                                <div key={lIdx} className="bg-white hover:bg-[#FDFBF7] text-[#3D4D55] border border-gray-200 hover:border-[#B58863]/30 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-all cursor-default flex items-center gap-1.5">
                                    <CheckCircle size={10} className={`text-${cat.color}-500`} />
                                    {layer}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENT: Live Threat Feed ---
const ThreatTimeline = ({ logs }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-0 h-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#FDFBF7]/50">
                <h3 className="font-bold text-[#10232A] flex items-center gap-2">
                    <Activity size={18} className="text-rose-500" />
                    Threat Interception Log
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <Shield size={32} className="mb-2 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-wider">No Threats Detected</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {logs.map((log, i) => (
                            <div key={log.id} className="p-4 hover:bg-red-50/10 transition-colors flex items-start gap-3 group">
                                <div className={`mt-1 p-1.5 rounded-lg shrink-0 ${log.blockReason.includes('SQL') || log.blockReason.includes('CMD') ? 'bg-red-100 text-red-600' :
                                    log.blockReason.includes('UPLOAD') ? 'bg-orange-100 text-orange-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    <AlertTriangle size={14} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs font-bold text-gray-800 truncate">{log.blockReason.replace(/_/g, ' ')}</p>
                                        <span className="text-[10px] text-gray-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
                                        <span className="bg-gray-100 px-1.5 rounded">{log.method}</span>
                                        <span className="font-mono truncate">{log.ipAddress}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 truncate font-mono bg-gray-50 rounded px-2 py-1 border border-gray-100">
                                        {log.requestUrl}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const FirewallDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ rateLimited: 0, wafAttacks: 0, totalBlocked: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const statsRes = await fetch('http://localhost:8080/api/admin/firewall/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            const logsRes = await fetch('http://localhost:8080/api/admin/firewall/logs');
            const logsData = await logsRes.json();
            setLogs(logsData);
        } catch (error) {
            console.error("Failed to fetch firewall data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Derived Status
    const systemStatus = logs.length > 0 && new Date(logs[0].timestamp) > new Date(Date.now() - 60000) ? 'under_attack' : 'secure';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2">
            {/* Header Area */}
            <div className="flex justify-between items-end pb-2 border-b border-gray-200/50">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#10232A] tracking-tight">Security Command</h2>
                    <p className="text-[#3D4D55] text-sm font-medium mt-1">Real-time WAF & Threat Intelligence</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${systemStatus === 'secure' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100 animate-pulse'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${systemStatus === 'secure' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        {systemStatus === 'secure' ? 'SYSTEM SECURE' : 'THREAT DETECTED'}
                    </div>
                    <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Top Row: Flow Diagram & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SecurityFlowDiagram status={systemStatus} />
                </div>
                <div className="lg:col-span-1 grid grid-rows-3 gap-4">
                    {/* Stat Cards */}
                    {[
                        { label: 'Total Threats Neutralized', val: stats.totalBlocked, icon: Shield, color: 'emerald' },
                        { label: 'High Severity Blocks', val: stats.wafAttacks, icon: AlertTriangle, color: 'rose' },
                        { label: 'Traffic Rate Blocks', val: stats.rateLimited, icon: Activity, color: 'amber' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#B58863]/20 transition-all">
                            <div>
                                <p className="text-[10px] font-bold text-[#3D4D55] uppercase tracking-widest">{s.label}</p>
                                <h3 className="text-3xl font-extrabold text-[#10232A] mt-1">{s.val}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 text-${s.color}-500 flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Row: Layer Matrix & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                <div className="lg:col-span-2 h-full">
                    <DefenseLayersGrid />
                </div>
                <div className="lg:col-span-1 h-full">
                    <ThreatTimeline logs={logs} />
                </div>
            </div>
        </div>
    );
};

export default FirewallDashboard;
