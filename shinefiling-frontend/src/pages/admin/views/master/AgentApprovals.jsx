import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Users, Shield, FileText, CheckCircle, XCircle, Search, Filter, Plus, Eye,
    Trash2, AlertTriangle, Send, Phone, Mail, Award, Briefcase, DollarSign,
    MoreVertical, Edit2, Ban, UserCheck, Calendar, MapPin
} from 'lucide-react';
import { getAllUsers, approveAgentKyc, rejectAgentKyc, deleteUser } from '../../../../api';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-Component: Agent List Item ---
const AgentListItem = ({ agent, onSelect, onAction }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => onSelect(agent)}>
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${agent.kycStatus === 'VERIFIED' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                    agent.kycStatus === 'REJECTED' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}>
                    {agent.fullName?.charAt(0) || 'A'}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-[#F97316] transition-colors">{agent.fullName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">ID: AG-{agent.id}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${agent.kycStatus === 'VERIFIED' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                    agent.kycStatus === 'SUBMITTED' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
                        agent.kycStatus === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                            'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                    }`}>
                    {agent.kycStatus || 'PENDING'}
                </span>
                <span className="text-[10px] text-slate-400">Joined: {new Date(agent.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mb-3">
            <div className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> <span className="truncate">{agent.email}</span></div>
            <div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {agent.mobile || 'N/A'}</div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-300">Level 1</span>
                <span className="text-[10px] text-slate-400">0 Clients</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onAction(agent, 'view_docs'); }} className="text-xs font-bold text-blue-500 hover:underline">
                View Profile
            </button>
        </div>
    </div>
);

// --- Sub-Component: Agent Details View (Right Panel) ---
const AgentDetailsPanel = ({ agent, onClose, onAction, stats = { earnings: '₹0.00', referrals: 0, pending: 0 } }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header Cover */}
        <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 relative">
            <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full backdrop-blur-sm transition">
                <X size={18} />
            </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 relative flex-1 overflow-y-auto">
            <div className="flex justify-between items-end -mt-10 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 shadow-md flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {agent.fullName?.charAt(0)}
                </div>
                <div className="flex gap-2 mb-1">
                    {agent.kycStatus === 'SUBMITTED' && (
                        <>
                            <button onClick={() => onAction(agent, 'approve')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 shadow-sm flex items-center gap-1">
                                <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => onAction(agent, 'reject')} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center gap-1">
                                <XCircle size={14} /> Reject
                            </button>
                        </>
                    )}
                    <button className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"><MoreVertical size={16} /></button>
                </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{agent.fullName}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                <MapPin size={14} /> Chennai, India • Member since {new Date(agent.createdAt).getFullYear()}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Earnings</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{stats.earnings}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Referrals</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{stats.referrals}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Pending</p>
                    <p className="text-sm font-bold text-orange-500 mt-1">{stats.pending}</p>
                </div>
            </div>

            {/* Document Section */}
            <div className="space-y-4 mb-6">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText size={16} className="text-[#F97316]" /> KYC Documents
                </h3>
                {(() => {
                    let docs = {};
                    try { docs = JSON.parse(agent.kycDocuments || '{}'); } catch (e) { }

                    return (
                        <div className="grid grid-cols-2 gap-3">
                            {['pan', 'aadhaar'].map(type => (
                                <div key={type} className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-[#F97316]/30 transition-colors group relative">
                                    <div className="aspect-[4/3] bg-white dark:bg-slate-800 rounded mb-2 flex items-center justify-center overflow-hidden">
                                        {docs[type] ? (
                                            <img src={docs[type]} alt={type} className="w-full h-full object-cover" />
                                        ) : (
                                            <FileText className="text-slate-300" />
                                        )}
                                    </div>
                                    <p className="text-xs font-bold capitalize text-slate-700 dark:text-slate-300">{type} Card</p>
                                    <p className="text-[10px] text-slate-400 font-mono truncate">{type === 'pan' ? agent.panNumber : agent.aadhaarNumber || 'Not provided'}</p>

                                    {docs[type] && (
                                        <a href={docs[type]} target="_blank" rel="noreferrer" className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Eye size={12} className="text-slate-600" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>

            {/* Contact Info Detailed */}
            <div className="space-y-3 mb-6">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Contact Details</h3>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Mail size={16} /></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">Email Address</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{agent.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Phone size={16} /></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">Mobile Number</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{agent.mobile || 'N/A'}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
const AgentCRM = ({ defaultFilter = 'ALL', viewMode = 'overview', targetRole = 'AGENT', users = [] }) => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [filterStatus, setFilterStatus] = useState(defaultFilter); // ALL, PENDING, VERIFIED

    useEffect(() => {
        if (defaultFilter) setFilterStatus(defaultFilter);
    }, [defaultFilter]);

    // Update local agents list when users prop changes
    useEffect(() => {
        if (users) {
            const agentList = users.filter(u => u.role === targetRole);
            setAgents(agentList);
        }
    }, [users, targetRole]);

    // Modal States
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [activeAgentId, setActiveAgentId] = useState(null);

    // Handlers
    const handleApprove = async (id) => {
        if (window.confirm('Verify and activate this agent?')) {
            try {
                await approveAgentKyc(id);
                // Optimistic Update
                setAgents(prev => prev.map(a => a.id === id ? { ...a, kycStatus: 'VERIFIED' } : a));
                setSelectedAgent(null);
            } catch (e) { alert(e.message); }
        }
    };

    const handleRejectInit = (agent) => {
        setActiveAgentId(agent.id);
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason) return alert("Reason required");
        try {
            await rejectAgentKyc(activeAgentId, rejectReason);
            // Optimistic Update
            setAgents(prev => prev.map(a => a.id === activeAgentId ? { ...a, kycStatus: 'REJECTED' } : a));
            setShowRejectModal(false);
            setRejectReason("");
            setSelectedAgent(null);
        } catch (e) { alert(e.message); }
    };

    // Filtering
    const filteredAgents = agents.filter(a => {
        const matchSearch = a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || a.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'ALL' ||
            (filterStatus === 'PENDING' && (a.kycStatus === 'SUBMITTED' || !a.kycStatus)) ||
            (filterStatus === 'VERIFIED' && a.kycStatus === 'VERIFIED');

        return matchSearch && matchStatus;
    });

    return (
        <div className="h-full flex flex-col font-[Roboto,sans-serif] animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Briefcase className="text-[#F97316]" size={28} /> {targetRole === 'CA' ? 'CA CRM' : 'Agent CRM'} <span className="text-slate-300 dark:text-slate-600">/</span> {filterStatus === 'ALL' ? 'Directory' : filterStatus === 'PENDING' ? 'Pending Approvals' : 'Active Partners'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Manage partners, track performance, and handle KYC verifications.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                        <Award size={18} /> Top Performers
                    </button>
                    <button className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
                        <Plus size={18} /> Add New Partner
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            {/* Quick Stats Row - Only in Overview */}
            {viewMode === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Agents', val: agents.length, icon: Users, color: 'blue' },
                        { label: 'Pending KYC', val: agents.filter(a => a.kycStatus === 'SUBMITTED').length, icon: AlertTriangle, color: 'orange' },
                        { label: 'Active Partners', val: agents.filter(a => a.kycStatus === 'VERIFIED').length, icon: CheckCircle, color: 'green' },
                        { label: 'Total Commission', val: '₹1.2L', icon: DollarSign, color: 'purple' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{s.val}</h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-${s.color}-50 text-${s.color}-500 shadow-sm`}>
                                <s.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Content Split: List & Details */}
            <div className="flex-1 flex gap-6 overflow-hidden min-h-[500px]">

                {/* Left: Search & List */}
                <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden ${selectedAgent ? 'hidden lg:flex lg:w-2/3' : 'w-full'}`}>

                    {/* Controls */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                            />
                        </div>

                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/10">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Loading Agent Directory...</div>
                        ) : filteredAgents.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center opacity-50">
                                <Users size={40} className="mb-3 text-slate-300" />
                                <p className="text-slate-500 font-bold">No agents found</p>
                            </div>
                        ) : (
                            filteredAgents.map(agent => (
                                <AgentListItem
                                    key={agent.id}
                                    agent={agent}
                                    onSelect={setSelectedAgent}
                                    onAction={(a, action) => {
                                        if (action === 'view_docs') setSelectedAgent(a);
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Details Panel (Conditional) */}
                <AnimatePresence>
                    {selectedAgent && (
                        <div className="w-full lg:w-[400px] flex-shrink-0 absolute lg:relative inset-0 z-20">
                            <AgentDetailsPanel
                                agent={selectedAgent}
                                onClose={() => setSelectedAgent(null)}
                                onAction={(agent, type) => {
                                    if (type === 'approve') handleApprove(agent.id);
                                    if (type === 'reject') handleRejectInit(agent);
                                }}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Rejection Modal portal */}
            {showRejectModal && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in scale-95 duration-200">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Reject Agent Application</h3>
                        <p className="text-sm text-slate-500 mb-4">Please provide a reason to notify the agent.</p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none text-sm"
                            placeholder="Reason for rejection..."
                        ></textarea>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancel</button>
                            <button onClick={handleRejectSubmit} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700">Submit Rejection</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AgentCRM;
