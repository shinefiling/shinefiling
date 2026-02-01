import React, { useState } from 'react';
import {
    CheckCircle, XCircle, FileText, ExternalLink, Shield,
    Terminal, Upload, Download, Eye, AlertTriangle, RefreshCcw
} from 'lucide-react';
import { BASE_URL } from '../../../../api';

const OnePersonCompanyWorkflowPanel = ({ order, onUpdateStatus, onClose, onRefresh }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [loading, setLoading] = useState(false);
    const [srnInput, setSrnInput] = useState(order.srn || '');

    // Derived Data
    const formData = typeof order.formData === 'string' ? JSON.parse(order.formData) : (order.formData || {});
    // OPC has 'director' (single object) and 'nominee' (single object)
    const director = formData.director || {};
    const nominee = formData.nominee || {};

    const docs = order.uploadedDocuments || {};
    const generatedDocs = order.generatedDocuments || {};

    const handleVerifyDocs = async () => {
        setLoading(true);
        try {
            await fetch(`${BASE_URL}/service/one-person-company/${order.submissionId}/verify-docs`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            onUpdateStatus('DOCUMENTS_VERIFIED');
            alert("Docs Marked Verified");
        } catch (e) {
            alert("Verification Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitToGov = async () => {
        if (!srnInput) return alert("Please enter the SRN/ARN provided by MCA.");
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/service/one-person-company/${order.submissionId}/gov-submission?srn=${srnInput}`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (!res.ok) throw new Error("Failed to update status");
            onUpdateStatus('MCA_SUBMITTED');
            alert("Status updated to MCA Submitted");
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const [localDocStatuses, setLocalDocStatuses] = useState(order.documentStatuses || {});

    const handleAcceptDoc = async (docType) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/service/one-person-company/${order.submissionId}/accept-doc?docType=${encodeURIComponent(docType)}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error("Failed to accept document");

            setLocalDocStatuses(prev => ({ ...prev, [docType]: 'ACCEPTED' }));
            if (onRefresh) onRefresh();
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectDoc = async (docType) => {
        const reason = prompt("Enter rejection reason for client:");
        if (!reason) return;

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/service/one-person-company/${order.submissionId}/reject-doc`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ docType, reason })
            });
            if (!res.ok) throw new Error("Failed to reject document");

            setLocalDocStatuses(prev => ({ ...prev, [docType]: 'REJECTED' }));
            if (onRefresh) onRefresh();
            alert("Document Rejected & Client Notified");
            onUpdateStatus('ACTION_REQUIRED');
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadCertificate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${BASE_URL}/service/one-person-company/${order.submissionId}/upload-certificate`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
            if (!res.ok) throw new Error("Upload failed");
            alert("Certificate Uploaded! Order Marked Completed.");
            onUpdateStatus('COMPLETED');
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 'details', label: 'OPC Details' },
        { id: 'docs', label: 'Documents' },
        { id: 'filing', label: 'Filing & Delivery' }
    ];

    const getDocStatus = (key) => localDocStatuses[key] || (order.documentStatuses && order.documentStatuses[key]);

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50">
            <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 pt-2 flex overflow-x-auto no-scrollbar shadow-sm">
                {steps.map(step => (
                    <button
                        key={step.id}
                        onClick={() => setActiveTab(step.id)}
                        className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === step.id
                            ? 'text-blue-600 border-blue-600 bg-blue-50/50 rounded-t-lg'
                            : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
                            }`}
                    >
                        {step.label}
                    </button>
                ))}
            </div>

            <div className="p-6 md:p-8">
                {activeTab === 'details' && (
                    <div className="space-y-6 max-w-5xl">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Shield size={16} className="text-blue-600" /> OPC Details
                                </h4>
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-blue-50 text-blue-700 border-blue-200">
                                    {(order.planType || formData.plan || 'BASIC')} PLAN
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Company Choice 1</p><p className="font-semibold text-slate-700">{formData.companyNames?.[0] || 'N/A'}</p></div>
                                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Company Choice 2</p><p className="font-semibold text-slate-700">{formData.companyNames?.[1] || 'N/A'}</p></div>
                                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Business Activity</p><p className="font-semibold text-slate-700">{formData.businessActivity || 'N/A'}</p></div>
                                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Capital (Auth/Paid)</p><p className="font-semibold text-slate-700">{formData.authorizedCapital} / {formData.paidUpCapital}</p></div>
                                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Registered Address</p><p className="font-semibold text-slate-700">{formData.addressLine1 ? `${formData.addressLine1}, ${formData.state}` : 'N/A'}</p></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Director Info */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Director Details (Owner)</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-slate-500">Name:</span> <b>{director.name}</b></p>
                                    <p><span className="text-slate-500">Email:</span> {director.email}</p>
                                    <p><span className="text-slate-500">Phone:</span> {director.phone}</p>
                                    <p><span className="text-slate-500">PAN:</span> {director.pan}</p>
                                </div>
                            </div>
                            {/* Nominee Info */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-800 mb-3">Nominee Details</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-slate-500">Name:</span> <b>{nominee.name}</b></p>
                                    <p><span className="text-slate-500">Relation:</span> {nominee.relationship}</p>
                                    <p><span className="text-slate-500">PAN:</span> {nominee.pan || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className="space-y-6 max-w-5xl">
                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div><h4 className="text-sm font-bold text-blue-800">Review Required</h4><p className="text-xs text-blue-600 mt-1">Verify all uploaded documents.</p></div>
                            <button
                                onClick={handleVerifyDocs}
                                disabled={loading || order.status === 'DOCUMENTS_VERIFIED' || order.status === 'MCA_SUBMITTED'}
                                className="px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {loading ? '...' : <CheckCircle size={14} />} Mark Verified
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(docs).map(([key, url]) => {
                                const status = getDocStatus(key);
                                return (
                                    <div key={key} className={`p-4 border rounded-xl bg-white ${status === 'ACCEPTED' ? 'border-emerald-200' : status === 'REJECTED' ? 'border-red-200' : 'border-slate-200'}`}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                            <button onClick={() => window.open(url, '_blank')} className="text-blue-500"><ExternalLink size={14} /></button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAcceptDoc(key)} className="flex-1 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">Accept</button>
                                            <button onClick={() => handleRejectDoc(key)} className="flex-1 py-1 bg-red-50 text-red-600 text-xs font-bold rounded">Reject</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'filing' && (
                    <div className="space-y-6 max-w-5xl">
                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                            <h4 className="text-sm font-bold text-orange-800 mb-4">MCA Filing Status</h4>
                            <div className="flex gap-4">
                                <input type="text" value={srnInput} onChange={(e) => setSrnInput(e.target.value)} placeholder="SRN Number" className="flex-1 p-2 border rounded" />
                                <button onClick={handleSubmitToGov} className="bg-orange-600 text-white px-4 py-2 rounded font-bold text-xs">Mark Submitted</button>
                            </div>
                        </div>

                        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100 text-center shadow-sm">
                            <h4 className="text-xl font-bold text-emerald-900 mb-2">Completion</h4>
                            <p className="text-sm text-emerald-700 mb-4">Upload Certificate of Incorporation (COI)</p>
                            <input id="coi-upload" type="file" className="hidden" onChange={handleUploadCertificate} />
                            <button onClick={() => document.getElementById('coi-upload').click()} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 mx-auto">
                                <Upload size={20} /> Upload COI & Complete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnePersonCompanyWorkflowPanel;
