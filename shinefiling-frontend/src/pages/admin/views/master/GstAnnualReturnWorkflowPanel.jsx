import React, { useState } from 'react';
import {
    FileText, CheckCircle, AlertCircle, Calendar,
    Download, RefreshCw, Send, Check, FileCheck, ClipboardCheck
} from 'lucide-react';
import { updateGstAnnualReturnStatus } from '../../../../api';

const GstAnnualReturnWorkflowPanel = ({ order, onRefresh }) => {
    const [status, setStatus] = useState(order.status || 'Data Review Pending');
    const [ackNumber, setAckNumber] = useState(order.ackNumber || '');

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateGstAnnualReturnStatus(order.id, newStatus);
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
                    <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <ClipboardCheck className="text-indigo-600" size={24} /> {order.details || 'GST Annual Return'}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">{order.id}</span>
                        <span>•</span>
                        <span className="uppercase">{order.planType || 'Standard'}</span>
                        <span>•</span>
                        <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                            status === 'Filed on Portal' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                        {status}
                    </span>
                    <button onClick={onRefresh} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><RefreshCw size={18} /></button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: PERIOD & DATA (2 Cols) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-bronze" /> Return Info
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">GSTIN</span>
                                <p className="font-bold text-navy font-mono">{order.formData?.gstin || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Financial Year</span>
                                <p className="font-bold text-navy">{order.formData?.financialYear || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Return Mode</span>
                                <p className="font-bold text-navy">{order.formData?.isNilReturn ? 'NIL (Basic)' : 'Data Driven'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Plan</span>
                                <p className="font-bold text-navy capitalize">{order.planType || 'Basic'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Automation Output */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-6 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" /> Tasks & Compliance
                        </h3>

                        <div className="space-y-4">
                            {/* GSTR-9 Draft */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-bronze"><FileText size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">GSTR-9 Draft</h4>
                                        <p className="text-xs text-gray-500">Annual Return Computation.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {order.generatedDocuments && order.generatedDocuments['GSTR-9 Draft'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> GSTR-9
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Premium 9C */}
                            {order.planType?.toLowerCase() === 'premium' && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-lg border text-indigo-600"><ClipboardCheck size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy">GSTR-9C Audit Report</h4>
                                            <p className="text-xs text-gray-500">Reconciliation Statement.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {order.generatedDocuments && order.generatedDocuments['GSTR-9C Report'] && (
                                            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                                <Download size={16} /> GSTR-9C
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTION (1 Col) */}
                <div className="space-y-6">

                    {/* Status Management */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4">Filing Actions</h3>

                        <div className="space-y-4">

                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <label className="text-xs font-bold text-gray-500 uppercase">Filing ARN / ACK No.</label>
                                <input type="text" className="w-full p-2 mt-1 border rounded text-sm" placeholder="Enter ARN.." value={ackNumber} onChange={(e) => setAckNumber(e.target.value)} />
                            </div>

                            {status === 'Payment Received' || status === 'Data Review Pending' ? (
                                <button onClick={() => handleStatusUpdate('Data Verified')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                                    Mark Data Verified
                                </button>
                            ) : null}

                            {status === 'Data Verified' && (
                                <button onClick={() => handleStatusUpdate('Annual Return Prepared')} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg">
                                    Mark GSTR-9 Prepared
                                </button>
                            )}

                            {order.planType?.toLowerCase() === 'premium' && status === 'Annual Return Prepared' && (
                                <button onClick={() => handleStatusUpdate('CA Certified')} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">
                                    Mark CA Certified (9C)
                                </button>
                            )}

                            {(status === 'Annual Return Prepared' || status === 'CA Certified') && (
                                <button onClick={() => handleStatusUpdate('Filed on Portal')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
                                    {order.planType?.toLowerCase() === 'premium' ? 'Confirm 9 & 9C Filed' : 'Confirm 9 Filed'}
                                </button>
                            )}

                            {(status === 'Filed on Portal' || status === 'Completed') && (
                                <div className="p-4 bg-green-50 rounded-xl text-center text-green-700 font-bold border border-green-200">
                                    <CheckCircle className="inline-block mr-2" size={18} /> Filed Successfully
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GstAnnualReturnWorkflowPanel;
