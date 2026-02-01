import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Activity, Settings, Zap, CheckCircle,
    AlertTriangle, Terminal, Cpu, Database, Save, Play, RefreshCw,
    BarChart3, Layers, ToggleLeft, ToggleRight, X, ChevronRight, Sliders, Lock, Trash2, Plus, Code, FileCode,
    Clock, List, Monitor, Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAutomationWorkflows, getAutomationSystemLogs } from '../../../../api';

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-[10px] font-bold text-[#3D4D55] uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-extrabold text-[#043E52] mt-1">{value}</h3>
            {subtext && <p className={`text-[10px] font-bold mt-1 ${color?.text || 'text-[#3D4D55]'}`}>{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color?.bg} ${color?.text} group-hover:scale-110 transition-transform`}>
            <Icon size={22} />
        </div>
    </div>
);

const AutomationManagement = () => {
    const [activeTab, setActiveTab] = useState('workflows');
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [logs, setLogs] = useState([]);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const data = await getAutomationWorkflows();
                if (data && data.length > 0) setWorkflows(data);
            } catch (e) {
                console.error("Failed to load workflows", e);
            }
        };
        fetchWorkflows();
    }, []);

    // --- LOGS ENGINE ---
    useEffect(() => {
        const fetchLogs = async () => {
            const serverLogs = await getAutomationSystemLogs();
            if (serverLogs && serverLogs.length > 0) {
                setLogs(serverLogs);
            } else {
                // Fallback Live Tail Mock Effect
                const actions = ['TRIGGER_EVENT', 'EXEC_STEP', 'API_REQUEST', 'DB_COMMIT'];
                const types = ['INFO', 'SUCCESS', 'WARNING'];
                const newLog = {
                    id: Math.random().toString(36).substr(2, 9),
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 999),
                    level: types[Math.floor(Math.random() * types.length)],
                    message: `[Worker-${Math.floor(Math.random() * 4)}] ${actions[Math.floor(Math.random() * actions.length)]}: Processed batch #${Math.floor(Math.random() * 9000)}`
                };
                setLogs(prev => [newLog, ...prev].slice(0, 30));
            }
        };

        const interval = setInterval(fetchLogs, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleEditWorkflow = (wf) => {
        setSelectedWorkflow(wf);
        setIsConfigOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#ED6E3F] to-[#D4B08C] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#ED6E3F]/30">
                        <Cpu size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#043E52]">Automation Management</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase border border-green-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                System Operational
                            </span>
                            <span className="text-[#3D4D55] text-xs">| v2.4.0 Engine</span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                    {[
                        { id: 'workflows', label: 'Workflows', icon: Layers },
                        { id: 'logs', label: 'Live Console', icon: Terminal },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-[#043E52] text-white shadow-md'
                                : 'text-[#3D4D55] hover:bg-gray-50 hover:text-[#043E52]'
                                }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'workflows' && (
                <div className="space-y-6">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Active Flows"
                            value={workflows.length}
                            subtext="All systems operational"
                            icon={Zap}
                            color={{ bg: 'bg-yellow-50', text: 'text-yellow-600' }}
                        />
                        <StatCard
                            label="24h Executions"
                            value="1,248"
                            subtext="+14% vs yesterday"
                            icon={Activity}
                            color={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
                        />
                        <StatCard
                            label="Success Rate"
                            value="98.2%"
                            subtext="7 failures captured"
                            icon={CheckCircle}
                            color={{ bg: 'bg-green-50', text: 'text-green-600' }}
                        />
                        <StatCard
                            label="Avg Runtime"
                            value="3m 12s"
                            subtext="-45s optimization"
                            icon={Clock}
                            color={{ bg: 'bg-[#FDFBF7]', text: 'text-[#ED6E3F]' }}
                        />
                    </div>

                    {/* Workflow Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {workflows.map(wf => (
                            <div key={wf.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Cpu size={120} />
                                </div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: wf.color }}>
                                            <Cpu size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#043E52] text-lg">{wf.name}</h3>
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${wf.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${wf.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                {wf.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleEditWorkflow(wf)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition">
                                        <Settings size={18} />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 mb-6 leading-relaxed relative z-10">{wf.description}</p>

                                {/* Pipeline Visual */}
                                <div className="mt-auto relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pipeline Steps</span>
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </div>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {wf.steps.map((step, i) => (
                                            <div key={i} className="flex items-center shrink-0">
                                                <div
                                                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 whitespace-nowrap flex items-center gap-1.5 group-hover:border-orange-200 transition-colors"
                                                    title={`${step.type} Step`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${step.status === 'Active' ? 'bg-green-400' : 'bg-gray-300'}`} />
                                                    {step.name}
                                                </div>
                                                {i < wf.steps.length - 1 && <ChevronRight size={12} className="text-gray-300 mx-1" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                                        <div className="flex gap-4 text-[10px] font-medium text-gray-400">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {wf.lastRun}</span>
                                            <span className="flex items-center gap-1"><BarChart3 size={12} /> {wf.successRate}% Success</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-[#3D4D55] text-xs font-bold hover:bg-gray-200 transition">Logs</button>
                                            <button className="px-3 py-1.5 rounded-lg bg-[#FDFBF7] text-[#ED6E3F] border border-[#ED6E3F]/20 text-xs font-bold hover:bg-white transition flex items-center gap-1 shadow-sm">
                                                <Play size={12} /> Run Test
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* New Workflow Card */}
                        <button onClick={() => { }} className="bg-white/50 rounded-2xl border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center gap-3 text-[#3D4D55] hover:text-[#ED6E3F] hover:border-[#ED6E3F] hover:bg-white transition-all min-h-[300px] group">
                            <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform text-[#ED6E3F]">
                                <Plus size={32} />
                            </div>
                            <span className="font-bold text-sm">Create New Workflow</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Logs Console Tab */}
            {activeTab === 'logs' && (
                <div className="bg-[#1E1E1E] rounded-2xl shadow-xl border border-gray-800 overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 bg-[#252526] border-b border-black/20 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Terminal size={18} className="text-[#ED6E3F]" />
                            <h3 className="text-gray-200 font-mono text-sm font-bold">system_output.log</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded text-[10px] font-mono text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                LIVE TAIL
                            </div>
                            <button className="text-gray-500 hover:text-white transition"><X size={16} /></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 custom-scrollbar">
                        {logs.map((log, i) => (
                            <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded px-2 transition-colors">
                                <span className="text-gray-500 opacity-50 select-none w-8 text-right">{i + 1}</span>
                                <span className="text-gray-500 shrink-0 select-none">{log.time}</span>
                                <span className={`w-16 shrink-0 font-bold ${log.level === 'INFO' ? 'text-blue-400' :
                                    log.level === 'SUCCESS' ? 'text-green-400' :
                                        'text-yellow-400'
                                    }`}>
                                    {log.level}
                                </span>
                                <span className="text-gray-300">{log.message}</span>
                            </div>
                        ))}
                        <div className="h-4 w-2 bg-gray-400 animate-pulse mt-2"></div>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-[#FDFBF7] text-[#ED6E3F] rounded-xl border border-[#ED6E3F]/20">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#043E52]">Engine Configuration</h3>
                            <p className="text-sm text-[#3D4D55]">Global settings for all automation workers.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-xl border border-[#ED6E3F]/10">
                            <div>
                                <h4 className="font-bold text-[#043E52] text-sm">Master Switch</h4>
                                <p className="text-xs text-[#3D4D55] mt-1">Kill switch for all running automations.</p>
                            </div>
                            <button className="w-12 h-6 bg-green-500 rounded-full p-1 relative">
                                <span className="absolute right-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-xl border border-[#ED6E3F]/10">
                            <div>
                                <h4 className="font-bold text-[#043E52] text-sm">Debug Mode</h4>
                                <p className="text-xs text-[#3D4D55] mt-1">Log detailed stack traces for errors.</p>
                            </div>
                            <button className="w-12 h-6 bg-gray-300 rounded-full p-1 relative">
                                <span className="absolute left-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            {createPortal(
                <AnimatePresence>
                    {isConfigOpen && selectedWorkflow && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsConfigOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#FDFBF7] text-[#ED6E3F] rounded-lg border border-[#ED6E3F]/20"><Sliders size={20} /></div>
                                        <div>
                                            <h3 className="font-bold text-[#043E52] text-lg">Configure Pipeline</h3>
                                            <p className="text-xs text-[#3D4D55]">{selectedWorkflow.name}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsConfigOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} className="text-[#3D4D55]" /></button>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Trigger Event</label>
                                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#ED6E3F] text-sm font-medium">
                                                <option>{selectedWorkflow.trigger}</option>
                                                <option>Manual Trigger Only</option>
                                                <option>Scheduled (Cron Job)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Retry Policy</label>
                                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#ED6E3F] text-sm font-medium">
                                                <option>3 Retries (Exponential Backoff)</option>
                                                <option>No Retry</option>
                                                <option>Immediate Retry (1x)</option>
                                            </select>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
                                            <AlertTriangle className="text-orange-600 shrink-0" size={20} />
                                            <div>
                                                <h4 className="font-bold text-orange-800 text-sm">Advanced Configuration</h4>
                                                <p className="text-xs text-orange-700 mt-1">Modifying execution parameters may affect running jobs. Be careful.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                    <button onClick={() => setIsConfigOpen(false)} className="px-5 py-2.5 text-[#3D4D55] font-bold hover:bg-gray-100 rounded-xl transition text-sm">Cancel</button>
                                    <button className="px-6 py-2.5 bg-[#043E52] text-white font-bold rounded-xl hover:bg-[#ED6E3F] shadow-lg transition text-sm flex items-center gap-2">
                                        <Save size={16} /> Save Changes
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default AutomationManagement;
