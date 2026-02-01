import React, { useState } from 'react';
import {
    FileText, CheckCircle, AlertCircle, Calendar,
    Download, Upload, RefreshCw, Send, Check
} from 'lucide-react';
import { updateProprietorshipStatus } from '../../../../api';

const ProprietorshipWorkflowPanel = ({ order, onRefresh }) => {
    const [status, setStatus] = useState(order.status || 'Payment Received');
    const [filingDate, setFilingDate] = useState('');

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateProprietorshipStatus(order.id, newStatus);
            setStatus(newStatus);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Status Bar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-navy">{order.details || 'Proprietorship Firm'}</h2>
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

                    {/* Business Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-sky-500" /> Business Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Business Name</span>
                                <p className="font-bold text-navy">{order.formData?.businessNameOption1 || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Type</span>
                                <p className="font-bold text-navy">{order.formData?.businessType || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg ">
                                <span className="text-xs text-slate-400 uppercase">Proprietor</span>
                                <p className="font-bold text-navy">{order.formData?.proprietorName || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg ">
                                <span className="text-xs text-slate-400 uppercase">Mobile</span>
                                <p className="font-bold text-navy">{order.formData?.mobile || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Automation & Action */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-6 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" /> Tasks & Automation
                        </h3>

                        <div className="space-y-4">
                            {/* Compliance Report */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-sky-500"><FileText size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">Compliance Report</h4>
                                        <p className="text-xs text-gray-500">Name clearance & check generated.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {order.generatedDocuments && order.generatedDocuments['Compliance Report'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> Download Report
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Bank Guidance */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-green-500"><CheckCircle size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">Bank Guidance</h4>
                                        <p className="text-xs text-gray-500">Checklist & bank recommendations.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {order.generatedDocuments && order.generatedDocuments['Bank Guidance'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> Download
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Basic Plan Warning */}
                            {order.planType?.toLowerCase() === 'basic' && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3 text-sm text-yellow-800">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p><b>Basic Plan:</b> Guidance only. No filing. Share Compliance Report with client.</p>
                                </div>
                            )}

                            {/* GST Draft (Standard+) */}
                            {order.planType?.toLowerCase() !== 'basic' && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-lg border text-green-600"><CheckCircle size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy">GST Registration Draft</h4>
                                            <p className="text-xs text-gray-500">Application data ready for filing.</p>
                                        </div>
                                    </div>
                                    {order.generatedDocuments && order.generatedDocuments['GST Application Draft'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> View Draft
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTIONS (1 Col) */}
                <div className="space-y-6">

                    {/* Status Management */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4">Application Status</h3>

                        {order.planType?.toLowerCase() === 'basic' ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 mb-2">Provide guidance report to client.</p>
                                <button onClick={() => handleStatusUpdate('Completed')} className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-black shadow-lg">
                                    Close Order (Guidance Done)
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Manual filing required for GST/Shop Act/MSME.</p>

                                <div className="p-3 bg-slate-50 rounded-lg border">
                                    <label className="text-xs font-bold text-gray-500 uppercase">GST Filing Date</label>
                                    <input type="date" className="w-full p-2 mt-1 border rounded text-sm" onChange={(e) => setFilingDate(e.target.value)} />
                                </div>

                                {status !== 'Filed' && status !== 'Approved' && status !== 'Completed' && (
                                    <button onClick={() => handleStatusUpdate('Filed')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                                        Mark as Filed
                                    </button>
                                )}

                                {status === 'Filed' && (
                                    <button onClick={() => handleStatusUpdate('Approved')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
                                        Mark Approved
                                    </button>
                                )}

                                {status === 'Approved' && (
                                    <button onClick={() => handleStatusUpdate('Completed')} className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-black shadow-lg">
                                        Complete Order
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProprietorshipWorkflowPanel;
