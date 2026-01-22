import React, { useState } from 'react';
import {
    FileText, CheckCircle, AlertCircle, Calendar,
    Download, RefreshCw, Send, Check, FileCheck, TrendingUp
} from 'lucide-react';
import { updateIncomeTaxReturnStatus } from '../../../../api';

const IncomeTaxReturnWorkflowPanel = ({ order, onRefresh }) => {
    const [status, setStatus] = useState(order.status || 'Data Verification Pending');
    const [ackNumber, setAckNumber] = useState(order.ackNumber || '');

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateIncomeTaxReturnStatus(order.id, newStatus);
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
                        <TrendingUp className="text-green-600" size={24} /> {order.details || 'Income Tax Return'}
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
                            <FileText size={20} className="text-bronze" /> Taxpayer Info
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Applicant Name</span>
                                <p className="font-bold text-navy">{order.formData?.applicantName || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">PAN Number</span>
                                <p className="font-bold text-navy font-mono">{order.formData?.pan || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Assessment Year</span>
                                <p className="font-bold text-navy">{order.formData?.ay || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Plan Type</span>
                                <p className="font-bold text-navy capitalize">{order.planType || 'Salaried'}</p>
                            </div>

                            {/* Dynamic Details Parsing */}
                            {order.formData?.detailsJson && (() => {
                                try {
                                    const details = JSON.parse(order.formData.detailsJson);
                                    return (
                                        <>
                                            {details.employerName && (
                                                <div className="p-3 bg-slate-50 rounded-lg">
                                                    <span className="text-xs text-slate-400 uppercase">Employer</span>
                                                    <p className="font-bold text-navy">{details.employerName}</p>
                                                </div>
                                            )}
                                            {details.businessName && (
                                                <div className="p-3 bg-slate-50 rounded-lg">
                                                    <span className="text-xs text-slate-400 uppercase">Business</span>
                                                    <p className="font-bold text-navy">{details.businessName}</p>
                                                </div>
                                            )}
                                        </>
                                    );
                                } catch (e) { return null; }
                            })()}
                        </div>
                    </div>

                    {/* Automation Output */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-navy mb-6 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600" /> Tax Computation
                        </h3>

                        <div className="space-y-4">
                            {/* Tax Computation */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-bronze"><FileText size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">Draft Computation</h4>
                                        <p className="text-xs text-gray-500">Tax Payable / Refund Calculation.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {order.generatedDocuments && order.generatedDocuments['Tax Computation'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> View
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* ITR Draft */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-green-600"><FileCheck size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">ITR Form Draft</h4>
                                        <p className="text-xs text-gray-500">Review before filing.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {order.generatedDocuments && order.generatedDocuments['ITR Draft'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> Draft
                                        </a>
                                    )}
                                </div>
                            </div>
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
                                <label className="text-xs font-bold text-gray-500 uppercase">ITR-V Acknowledgement No.</label>
                                <input type="text" className="w-full p-2 mt-1 border rounded text-sm" placeholder="Enter Ack No.." value={ackNumber} onChange={(e) => setAckNumber(e.target.value)} />
                            </div>

                            {status === 'Payment Received' || status === 'Data Verification Pending' ? (
                                <button onClick={() => handleStatusUpdate('Data Verified')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                                    Confirm Data Correct
                                </button>
                            ) : null}

                            {status === 'Data Verified' && (
                                <button onClick={() => handleStatusUpdate('ITR Prepared')} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg">
                                    Mark ITR Prepared
                                </button>
                            )}

                            {status === 'ITR Prepared' && (
                                <button onClick={() => handleStatusUpdate('Filed on Portal')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
                                    Mark Filed on Portal
                                </button>
                            )}

                            {status === 'Filed on Portal' && (
                                <button onClick={() => handleStatusUpdate('E-Verified')} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg">
                                    Confirm E-Verification
                                </button>
                            )}

                            {(status === 'E-Verified' || status === 'Completed') && (
                                <div className="p-4 bg-green-50 rounded-xl text-center text-green-700 font-bold border border-green-200">
                                    <CheckCircle className="inline-block mr-2" size={18} /> ITR Filing Complete
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeTaxReturnWorkflowPanel;
