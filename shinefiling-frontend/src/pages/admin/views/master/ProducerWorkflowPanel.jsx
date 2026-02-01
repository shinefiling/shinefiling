import React, { useState } from 'react';
import {
    FileText, CheckCircle, AlertCircle, Calendar,
    Download, Upload, RefreshCw, Send, Check, Sprout
} from 'lucide-react';
import { updateProducerStatus } from '../../../../api';

const ProducerWorkflowPanel = ({ order, onRefresh }) => {
    const [status, setStatus] = useState(order.status || 'Payment Received');
    const [filingDate, setFilingDate] = useState('');

    // Parse Directors safely
    const directors = order.formData?.directorsJson
        ? JSON.parse(order.formData.directorsJson)
        : (order.formData?.directors || []);

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateProducerStatus(order.id, newStatus);
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
                        <Sprout className="text-green-600" size={24} /> {order.details || 'Producer Company'}
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
                            status === 'Incorporated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
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
                            <FileText size={20} className="text-bronze" /> FPO Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Prosposed Name</span>
                                <p className="font-bold text-navy">{order.formData?.companyNameOption1 || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-400 uppercase">Activity</span>
                                <p className="font-bold text-navy">{order.formData?.activityType || 'N/A'}</p>
                            </div>
                        </div>

                        <h4 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wider">Directors ({directors.length})</h4>
                        <div className="space-y-3">
                            {directors.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs">{i + 1}</div>
                                        <div>
                                            <p className="font-bold text-navy text-sm">{p.name || `Director ${i + 1}`}</p>
                                            <p className="text-xs text-gray-400">{p.pan || 'No PAN'}</p>
                                        </div>
                                    </div>
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
                            {/* MOA/AOA */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg border text-bronze"><FileText size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-navy">Producer MOA & AOA</h4>
                                        <p className="text-xs text-gray-500">Drafted with FPO objectives.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {order.generatedDocuments && order.generatedDocuments['Draft MOA'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> MOA
                                        </a>
                                    )}
                                    {order.generatedDocuments && order.generatedDocuments['Draft AOA'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> AOA
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Standard+ Board Resolution */}
                            {order.planType?.toLowerCase() !== 'basic' && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-lg border text-purple-600"><FileText size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy">Board Resolution</h4>
                                            <p className="text-xs text-gray-500">For Bank Account & Share Allotment.</p>
                                        </div>
                                    </div>
                                    {order.generatedDocuments && order.generatedDocuments['First Board Resolution'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> View
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Premium Compliance Guide */}
                            {order.planType?.toLowerCase() === 'premium' && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-lg border text-red-600"><AlertCircle size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-navy">FPO Compliance Guide</h4>
                                            <p className="text-xs text-gray-500">Registers, AGM, Subsidy Info.</p>
                                        </div>
                                    </div>
                                    {order.generatedDocuments && order.generatedDocuments['FPO Compliance Guide'] && (
                                        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100">
                                            <Download size={16} /> Guide
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
                        <h3 className="font-bold text-navy mb-4">Filing Status</h3>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Steps: Name &rarr; Incorporation &rarr; PAN/TAN &rarr; Board Resolution.</p>

                            <div className="p-3 bg-slate-50 rounded-lg border">
                                <label className="text-xs font-bold text-gray-500 uppercase">Filing Date</label>
                                <input type="date" className="w-full p-2 mt-1 border rounded text-sm" onChange={(e) => setFilingDate(e.target.value)} />
                            </div>

                            {status === 'Payment Received' && (
                                <button onClick={() => handleStatusUpdate('Name Reserved')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                                    Mark Name Approved
                                </button>
                            )}

                            {status === 'Name Reserved' && (
                                <button onClick={() => handleStatusUpdate('Incorporation Filed')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                                    Mark Incorporation Filed
                                </button>
                            )}

                            {status === 'Incorporation Filed' && (
                                <button onClick={() => handleStatusUpdate('Incorporated')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
                                    Mark Approved (CIN)
                                </button>
                            )}

                            {status === 'Incorporated' && (
                                <button onClick={() => handleStatusUpdate('Completed')} className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-black shadow-lg">
                                    Complete Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProducerWorkflowPanel;
