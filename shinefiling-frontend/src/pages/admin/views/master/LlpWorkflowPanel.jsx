import React, { useState } from 'react';
import {
    FileText, CheckCircle, AlertCircle, Calendar,
    Download, Upload, RefreshCw, Send, Check
} from 'lucide-react';
import { updateLlpStatus } from '../../../../api';

const LlpWorkflowPanel = ({ order, onRefresh }) => {
    const [status, setStatus] = useState(order.status || 'Payment Received');
    const [uploading, setUploading] = useState(false);
    const [srn, setSrn] = useState(order.srn || '');

    // Parse Partner Data safely
    const partners = order.formData?.partnersJson
        ? JSON.parse(order.formData.partnersJson)
        : order.formData?.partners?.list || [];

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateLlpStatus(order.id, newStatus);
            setStatus(newStatus);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const handleSrnSubmit = async () => {
        // Here we would call an API to save SRN
        alert(`SRN ${srn} Saved!`);
        handleStatusUpdate('Filed');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Status Bar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">{order.details || 'LLP Application'}</h2>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">{order.id}</span>
                        <span>•</span>
                        <span>{order.planType || 'Standard'} Plan</span>
                        <span>•</span>
                        <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                            status === 'Filed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                        {status}
                    </span>
                    <button onClick={onRefresh} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><RefreshCw size={18} /></button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: APPLICATION DETAILS (2 Cols) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Partners & LLP Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-bronze" /> LLP Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">LLP Name 1</span>
                                <p className="font-bold text-navy">{order.formData?.llpNameOption1 || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Contribution</span>
                                <p className="font-bold text-navy">₹{order.formData?.contributionAmount || 'N/A'}</p>
                            </div>
                        </div>

                        <h4 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wider">Partners ({partners.length})</h4>
                        <div className="space-y-3">
                            {partners.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-bronze/10 text-bronze rounded-full flex items-center justify-center font-bold text-xs">{i + 1}</div>
                                        <div>
                                            <p className="font-bold text-navy text-sm">{p.name || `Partner ${i + 1}`}</p>
                                            <p className="text-xs text-gray-400">{p.pan || 'No PAN'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono bg-white border px-2 py-1 rounded">Pending KYC</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Automation & Action */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-6 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" /> Tasks & Automation
                        </h3>

                        <div className="space-y-4">
                            {/* Gen Docs */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-bronze"><FileText size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">Generate Legal Docs</h4>
                                        <p className="text-xs text-gray-500">LLP Agreement, Consent Forms</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-black transition">
                                    Auto-Generate
                                </button>
                            </div>

                            {/* Download Stubs */}
                            {order.generatedDocuments && Object.keys(order.generatedDocuments).length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {Object.entries(order.generatedDocuments).map(([name, path]) => (
                                        <a key={name} href="#" className="flex items-center gap-2 p-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:underline">
                                            <Download size={16} /> {name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT: ACTIONS (1 Col) */}
                <div className="space-y-6">

                    {/* Govt Filing */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4">Govt Portal Filing</h3>
                        <p className="text-sm text-gray-500 mb-4">Log in to MCA portal and upload the FiLLiP forms.</p>

                        <div className="mb-4">
                            <label className="text-xs font-bold text-gray-500 uppercase">Enter SRN</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    value={srn}
                                    onChange={(e) => setSrn(e.target.value)}
                                    placeholder="Enter SRN here"
                                    className="flex-1 p-2 border rounded-lg text-sm"
                                />
                                <button onClick={handleSrnSubmit} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>

                        {status === 'Filed' && (
                            <button onClick={() => handleStatusUpdate('Approved')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition">
                                Mark Approved
                            </button>
                        )}
                        {status === 'Approved' && (
                            <button onClick={() => handleStatusUpdate('Completed')} className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-black shadow-lg transition">
                                Complete Order
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LlpWorkflowPanel;
