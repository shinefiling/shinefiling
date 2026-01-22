import React, { useState } from 'react';
import {
    FileText, CheckCircle, AlertCircle, Calendar,
    Download, Upload, RefreshCw, Send, Check, FileCheck, Landmark
} from 'lucide-react';
import { updateGstStatus } from '../../../../api';

const GstWorkflowPanel = ({ order, onRefresh }) => {
    const [status, setStatus] = useState(order.status || 'Payment Received');
    const [arnNumber, setArnNumber] = useState(order.arnNumber || '');
    const [gstin, setGstin] = useState(order.gstinNumber || '');

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateGstStatus(order.id, newStatus);
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
                        <FileCheck className="text-green-600" size={24} /> {order.details || 'GST Registration'}
                    </h2>
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
                            status === 'ARN Generated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
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

                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-bronze" /> Business Info
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Trade Name</span>
                                <p className="font-bold text-navy">{order.formData?.tradeName || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Business Type</span>
                                <p className="font-bold text-navy">{order.formData?.businessType || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">PAN</span>
                                <p className="font-bold text-navy">{order.formData?.pan || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Plan</span>
                                <p className="font-bold text-navy">{order.planType || 'Basic'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Automation & Action */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-6 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" /> Tasks & Automation
                        </h3>

                        <div className="space-y-4">
                            {/* App Summary */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-bronze"><FileText size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">Application Checklist</h4>
                                        <p className="text-xs text-gray-500">Basic details verified.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {order.generatedDocuments && order.generatedDocuments['App Summary'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> Summary
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Standard+ ARN */}
                            {order.planType?.toLowerCase() !== 'basic' && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-lg border text-blue-600"><CheckCircle size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy">ARN Tracking</h4>
                                            <p className="text-xs text-gray-500">Track application status live.</p>
                                        </div>
                                    </div>
                                    {order.generatedDocuments && order.generatedDocuments['ARN Draft'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> ARN Ack
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Premium */}
                            {order.planType?.toLowerCase() === 'premium' && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-lg border text-purple-600"><Landmark size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy">Invoicing & Returns</h4>
                                            <p className="text-xs text-gray-500">Invoice format & CA support.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {order.generatedDocuments && order.generatedDocuments['Invoice Format'] && (
                                            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                                <Download size={16} /> Invoice
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTIONS (1 Col) */}
                <div className="space-y-6">

                    {/* Status Management */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-4">Filing Status</h3>

                        <div className="space-y-4">

                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <label className="text-xs font-bold text-gray-500 uppercase">ARN Number</label>
                                <input type="text" className="w-full p-2 mt-1 border rounded text-sm" placeholder="Enter ARN.." value={arnNumber} onChange={(e) => setArnNumber(e.target.value)} />
                            </div>

                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <label className="text-xs font-bold text-gray-500 uppercase">GSTIN Number</label>
                                <input type="text" className="w-full p-2 mt-1 border rounded text-sm" placeholder="Enter Approved GSTIN.." value={gstin} onChange={(e) => setGstin(e.target.value)} />
                            </div>

                            {status === 'Payment Received' && (
                                <button onClick={() => handleStatusUpdate('Documents Verified')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                                    Mark Docs Verified
                                </button>
                            )}

                            {status === 'Documents Verified' && (
                                <button onClick={() => handleStatusUpdate('Filed on Portal')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                                    Mark Filed (REG-01)
                                </button>
                            )}

                            {status === 'Filed on Portal' && (
                                <button onClick={() => handleStatusUpdate('ARN Generated')} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg">
                                    Update ARN
                                </button>
                            )}

                            {status === 'ARN Generated' && (
                                <button onClick={() => handleStatusUpdate('Completed')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
                                    GSTIN Approved
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GstWorkflowPanel;
