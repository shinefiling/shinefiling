import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Shield, FileText, Download, ExternalLink, X, Eye, Trash2, AlertTriangle, Send } from 'lucide-react';
import { getAllUsers, approveAgentKyc, rejectAgentKyc, deleteUser } from '../../../../api';

const AgentApprovals = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocAgent, setSelectedDocAgent] = useState(null);

    // Reject State
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectTargetId, setRejectTargetId] = useState(null);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const users = await getAllUsers();
            // Filter only Agents
            const agentList = users.filter(u => u.role === 'AGENT');
            setAgents(agentList);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleApprove = async (id) => {
        if (window.confirm('Are you sure you want to approve this agent and activate their account?')) {
            try {
                await approveAgentKyc(id);
                fetchAgents();
                if (selectedDocAgent) closeDocs();
                alert('Agent Approved Successfully!');
            } catch (error) {
                alert('Failed to approve: ' + error.message);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to PERMANENTLY DELETE this agent? This action cannot be undone.')) {
            try {
                await deleteUser(id);
                fetchAgents();
                alert('Agent Deleted Successfully.');
            } catch (error) {
                alert('Failed to delete: ' + error.message);
            }
        }
    };

    const openRejectModal = (id) => {
        setRejectTargetId(id);
        setRejectReason("");
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) return alert("Please enter a reason for rejection.");
        try {
            await rejectAgentKyc(rejectTargetId, rejectReason);
            fetchAgents();
            setShowRejectModal(false);
            if (selectedDocAgent) closeDocs();
            alert('Agent Application Rejected.');
        } catch (error) {
            alert('Failed to reject: ' + error.message);
        }
    };

    const openDocs = (agent) => {
        setSelectedDocAgent(agent);
    };

    const closeDocs = () => {
        setSelectedDocAgent(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A]">Agent Approvals</h2>
                    <p className="text-gray-500 text-sm">Review KYC documents and approve Partner accounts.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Agent Name</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">KYC Status</th>
                            <th className="px-6 py-4">Documents</th>
                            <th className="px-6 py-4">IDs</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center">Loading agents...</td></tr>
                        ) : agents.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-400">No agents found.</td></tr>
                        ) : (
                            agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                                {agent.fullName?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#10232A]">{agent.fullName}</div>
                                                <div className="text-xs text-gray-400">ID: #{agent.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600">{agent.email}</div>
                                        <div className="text-xs text-gray-400">{agent.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${agent.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                                agent.kycStatus === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                                                    agent.kycStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {agent.kycStatus || 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {agent.kycDocuments ? (
                                            <button
                                                onClick={() => openDocs(agent)}
                                                className="flex items-center gap-1 text-blue-600 hover:underline text-xs font-bold bg-blue-50 px-2 py-1 rounded"
                                            >
                                                <Eye size={14} /> Review Docs
                                            </button>
                                        ) : <span className="text-gray-400 text-xs text-center block">-</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs">
                                            <span className="text-gray-400">PAN:</span> <span className="font-mono font-bold">{agent.panNumber || '-'}</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-gray-400">AADHAAR:</span> <span className="font-mono font-bold">{agent.aadhaarNumber || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {agent.kycStatus === 'SUBMITTED' && (
                                                <>
                                                    <button
                                                        onClick={() => openRejectModal(agent.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg hover:text-red-600"
                                                        title="Reject Application"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(agent.id)}
                                                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-md shadow-emerald-200"
                                                    >
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                </>
                                            )}
                                            {/* Always allow delete to clean up data */}
                                            <button
                                                onClick={() => handleDelete(agent.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Agent"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Document Review Modal with High Z-Index via Portal */}
            {selectedDocAgent && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeDocs}>
                    <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg text-[#10232A]">KYC Documents Review</h3>
                                <p className="text-xs text-gray-500">Applicant: <span className="font-bold">{selectedDocAgent.fullName}</span></p>
                            </div>
                            <button onClick={closeDocs} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Parse Documents */}
                                {(() => {
                                    let docs = {};
                                    try {
                                        docs = JSON.parse(selectedDocAgent.kycDocuments || '{}');
                                    } catch (e) {
                                        docs = {};
                                    }
                                    return (
                                        <>
                                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                                <h4 className="font-bold text-sm text-gray-500 mb-3 flex items-center justify-between">
                                                    PAN Card
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{selectedDocAgent.panNumber}</span>
                                                </h4>
                                                <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                                                    {docs.pan ? (
                                                        <img src={docs.pan} alt="PAN Card" className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Broken+Image+Link'} />
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2"><FileText size={20} /></div>
                                                            <span className="text-gray-400 text-xs">No Document Uploaded</span>
                                                        </div>
                                                    )}
                                                    {docs.pan && (
                                                        <a href={docs.pan} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="bg-white text-black px-3 py-1.5 bg-opacity-70 rounded-full text-xs font-bold flex items-center gap-1">
                                                                <ExternalLink size={12} /> Open Full
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                                <h4 className="font-bold text-sm text-gray-500 mb-3 flex items-center justify-between">
                                                    Aadhaar Card
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{selectedDocAgent.aadhaarNumber}</span>
                                                </h4>
                                                <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                                                    {docs.aadhaar ? (
                                                        <img src={docs.aadhaar} alt="Aadhaar Card" className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Broken+Image+Link'} />
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2"><FileText size={20} /></div>
                                                            <span className="text-gray-400 text-xs">No Document Uploaded</span>
                                                        </div>
                                                    )}
                                                    {docs.aadhaar && (
                                                        <a href={docs.aadhaar} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="bg-white text-black px-3 py-1.5 bg-opacity-70 rounded-full text-xs font-bold flex items-center gap-1">
                                                                <ExternalLink size={12} /> Open Full
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button onClick={closeDocs} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-bold text-sm">Close</button>
                            {selectedDocAgent.kycStatus === 'SUBMITTED' && (
                                <>
                                    <button
                                        onClick={() => openRejectModal(selectedDocAgent.id)}
                                        className="px-6 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold text-sm flex items-center gap-2"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleApprove(selectedDocAgent.id);
                                            closeDocs();
                                        }}
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} /> Approve Application
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Rejection Modal with even higher Z-Index via Portal */}
            {showRejectModal && createPortal(
                <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in scale-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <div className="bg-red-100 p-2 rounded-full"><AlertTriangle size={24} /></div>
                            <h3 className="font-bold text-lg text-gray-800">Reject Application</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Please provide a reason for rejecting this application. This message will be sent to the agent via email.
                        </p>
                        <textarea
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-sm"
                            rows="4"
                            placeholder="e.g. Blurred documents, Invalid PAN number..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-bold text-sm">Cancel</button>
                            <button
                                onClick={handleRejectSubmit}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 flex items-center gap-2"
                            >
                                <Send size={14} /> Send Rejection
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AgentApprovals;
