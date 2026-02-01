import React, { useState } from 'react';
import {
    CheckCircle, XCircle, FileText, ExternalLink, Shield,
    Terminal, Upload, Download, Eye, AlertTriangle, RefreshCcw
} from 'lucide-react';
import { verifyPrivateLimitedDocs, BASE_URL } from '../../../../api';

const PrivateLimitedWorkflowPanel = ({ order, onUpdateStatus, onClose, onRefresh }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [loading, setLoading] = useState(false);
    const [srnInput, setSrnInput] = useState(order.srn || '');

    // Derived Data
    const formData = typeof order.formData === 'string' ? JSON.parse(order.formData) : (order.formData || {});
    const directors = formData.directors || [];
    const docs = order.uploadedDocuments || {};
    const generatedDocs = order.generatedDocuments || {};

    const handleVerifyDocs = async () => {
        setLoading(true);
        try {
            await verifyPrivateLimitedDocs(order.submissionId || order.id);
            // Optimistically update status via parent handler if possible, otherwise reload
            onUpdateStatus('DOCUMENTS_VERIFIED');
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
            const res = await fetch(`${BASE_URL}/service/private-limited-company/${order.submissionId}/gov-submission?srn=${srnInput}`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
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
            const res = await fetch(`${BASE_URL}/service/private-limited-company/${order.submissionId}/accept-doc?docType=${encodeURIComponent(docType)}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error("Failed to accept document");

            // Visual Update
            setLocalDocStatuses(prev => ({ ...prev, [docType]: 'ACCEPTED' }));
            if (onRefresh) onRefresh();
            // alert("Document Accepted"); // Removed alert for smoother flow
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
            const res = await fetch(`${BASE_URL}/service/private-limited-company/${order.submissionId}/reject-doc`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ docType, reason })
            });
            if (!res.ok) throw new Error("Failed to reject document");

            // Visual Update
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

    const handleDownloadForm = (formName) => {
        // Map form display name to backend key if necessary, or just use name
        // Assuming backend handles fuzzy match or precise keys like 'SPICe+ Part A'
        window.open(`${BASE_URL}/service/private-limited-company/${order.submissionId}/download-docs?type=${encodeURIComponent(formName)}`, '_blank');
    };

    const handleUploadCertificate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${BASE_URL}/service/private-limited-company/${order.submissionId}/upload-certificate`, {
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
        { id: 'details', label: 'Company Details' },
        { id: 'docs', label: 'Documents & Verification' },
        { id: 'filing', label: 'Government Filing' },
        { id: 'delivery', label: 'Final Delivery' }
    ];

    const getDocStatus = (key) => localDocStatuses[key] || (order.documentStatuses && order.documentStatuses[key]);

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50">
            {/* ... (Header Tabs remain same) ... */}
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

            {/* Content Area */}
            <div className="p-6 md:p-8">

                {/* 1. Details Tab (hidden for brevity in replacement, assumed unchanged in logic above) */}
                {activeTab === 'details' && (
                    <div className="space-y-6 max-w-5xl">
                        {/* Company Info */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Shield size={16} className="text-blue-600" /> Proposed Company Info
                                </h4>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${(order.planType || formData.plan) === 'enterprise' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        (order.planType || formData.plan) === 'growth' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                            'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                    {(order.planType || formData.plan || 'STARTUP')} PLAN
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Name Choice 1</p>
                                    <p className="font-semibold text-slate-700">{formData.companyNames?.[0] || formData.companyName1 || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Name Choice 2</p>
                                    <p className="font-semibold text-slate-700">{formData.companyNames?.[1] || formData.companyName2 || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Activity</p>
                                    <p className="font-semibold text-slate-700">{formData.businessActivity || formData.activity || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Nature / Employees</p>
                                    <p className="font-semibold text-slate-700">{formData.natureOfBusiness || 'N/A'} / {formData.employeeCount || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Capital (Auth / Paid)</p>
                                    <p className="font-semibold text-slate-700">{formData.authorizedCapital} / {formData.paidUpCapital}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Registered Address</p>
                                    <p className="font-semibold text-slate-700">
                                        {formData.addressLine1 ? `${formData.addressLine1}, ${formData.state}` : formData.registeredAddress || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Plan Specific Details */}
                            {(formData.bankPreference || formData.trademarkName) && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid md:grid-cols-2 gap-4">
                                    {formData.bankPreference && (
                                        <>
                                            <div>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">Bank Pref</p>
                                                <p className="font-bold text-slate-700">{formData.bankPreference}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">Exp. Turnover</p>
                                                <p className="font-bold text-slate-700">{formData.turnoverEstimate}</p>
                                            </div>
                                        </>
                                    )}
                                    {formData.trademarkName && (
                                        <>
                                            <div>
                                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Trademark Name</p>
                                                <p className="font-bold text-slate-700">{formData.trademarkName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Auditor Pref</p>
                                                <p className="font-bold text-slate-700">{formData.auditorPreference}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Directors */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-3 px-1">Directors & Shareholders</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {directors.map((d, i) => (
                                    <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                                                    {d.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{d.name}</p>
                                                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 mt-1 inline-block">
                                                        {d.designation || 'Director'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pl-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-medium">Email:</span> {d.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-medium">Phone:</span> {d.phone}
                                            </div>
                                            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                                                <span className="text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-600 font-mono border border-slate-100">PAN: {d.pan}</span>
                                                {d.aadhaar && <span className="text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-600 font-mono border border-slate-100">ADR: {d.aadhaar}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* 2. Documents & Verification Tab */}
                {activeTab === 'docs' && (
                    <div className="space-y-6 max-w-5xl">
                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div>
                                <h4 className="text-sm font-bold text-blue-800">Review Required</h4>
                                <p className="text-xs text-blue-600 mt-1">Please verify all client uploaded documents before proceeding.</p>
                            </div>
                            <button
                                onClick={handleVerifyDocs}
                                disabled={loading || order.status === 'DOCUMENTS_VERIFIED' || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'}
                                className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition shadow-sm ${order.status === 'DOCUMENTS_VERIFIED' || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent"></div> : <CheckCircle size={14} />}
                                {order.status === 'DOCUMENTS_VERIFIED' || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED' ? 'All Docs Verified' : 'Verify All Docs'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(docs).map(([key, url]) => {
                                const status = getDocStatus(key);
                                return (
                                    <div key={key} className={`group p-4 border rounded-xl hover:shadow-md transition bg-white ${status === 'ACCEPTED' ? 'border-emerald-200 bg-emerald-50/10' :
                                        status === 'REJECTED' ? 'border-red-200 bg-red-50/10' :
                                            'border-slate-200 hover:border-blue-200'
                                        }`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-lg ${status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-600' :
                                                    status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                        'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    {status === 'ACCEPTED' ? <CheckCircle size={18} /> :
                                                        status === 'REJECTED' ? <XCircle size={18} /> :
                                                            <FileText size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700 capitalize">{key.replace(/_/g, ' ')}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                        {status === 'ACCEPTED' ? <span className="text-emerald-600 font-bold">Accepted</span> :
                                                            status === 'REJECTED' ? <span className="text-red-500 font-bold">Rejected</span> :
                                                                'Client Upload'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button onClick={() => window.open(`${BASE_URL}/admin/download-docs/${order.submissionId}?type=${key}`, '_blank')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>

                                        {/* Action Buttons - Only show if not fully processed or if you want to allow changing decision */}
                                        <div className="flex gap-2">
                                            {status === 'ACCEPTED' ? (
                                                <div className="w-full py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex justify-center items-center gap-1">
                                                    <CheckCircle size={14} /> Accepted
                                                </div>
                                            ) : status === 'REJECTED' ? (
                                                <div className="w-full py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 flex justify-center items-center gap-1">
                                                    <XCircle size={14} /> Rejected
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleAcceptDoc(key)}
                                                        className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition border border-emerald-100 flex justify-center items-center gap-1"
                                                    >
                                                        <CheckCircle size={12} /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectDoc(key)}
                                                        className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition border border-red-100 flex justify-center items-center gap-1"
                                                    >
                                                        <XCircle size={12} /> Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}                            {Object.keys(docs).length === 0 && (
                                <div className="col-span-2 text-center py-12 text-slate-400 text-sm italic bg-white rounded-xl border border-dashed border-slate-200">
                                    No documents uploaded yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Government Filing Tab */}
                {activeTab === 'filing' && (
                    <div className="space-y-6 max-w-5xl">
                        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100 shadow-sm">
                            <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                                <Terminal size={16} /> MCA Filing Status
                            </h4>
                            <p className="text-xs text-orange-700/80 mb-6 max-w-2xl">
                                Once you have filed the SPICe+ form on the MCA portal, enter the Service Request Number (SRN) here to track status.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="text-[10px] font-bold text-orange-800 uppercase block mb-1.5 ml-1">Service Request Number (SRN)</label>
                                    <input
                                        type="text"
                                        value={srnInput}
                                        onChange={(e) => setSrnInput(e.target.value)}
                                        placeholder="e.g. SRN12345678"
                                        className="w-full px-4 py-2.5 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white font-mono placeholder:font-sans"
                                        disabled={order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'}
                                    />
                                </div>
                                <button
                                    onClick={handleSubmitToGov}
                                    disabled={loading || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'}
                                    className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition flex items-center gap-2 text-xs shadow-md shadow-orange-200 min-w-fit"
                                >
                                    {loading ? 'Updating...' : 'Mark Submitted'}
                                </button>
                                <button
                                    onClick={async () => {
                                        const query = prompt("Enter the query raised by MCA:");
                                        if (query) {
                                            setLoading(true);
                                            try {
                                                await fetch(`${BASE_URL}/service/private-limited-company/${order.submissionId}/raise-query`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({ query })
                                                });
                                                onUpdateStatus('QUERY_RAISED');
                                                alert("Query Raised & Client Notified");
                                            } catch (e) { alert(e.message); }
                                            finally { setLoading(false); }
                                        }
                                    }}
                                    className="px-4 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition flex items-center gap-2 text-xs min-w-fit"
                                >
                                    <AlertTriangle size={14} /> Raise Query
                                </button>
                            </div>
                        </div>

                        {/* Generated Forms */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                                <h4 className="text-sm font-bold text-slate-800">System Generated Forms (Auto-Drafted)</h4>
                                <button
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const res = await fetch(`${BASE_URL}/service/private-limited-company/${order.submissionId}/generate-docs`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
                                            if (res.ok) {
                                                const data = await res.json();
                                                onUpdateStatus('DOCUMENTS_GENERATED');
                                                alert("Documents Generated Successfully!");
                                                // Ideally refresh order here to show docs
                                            } else {
                                                alert("Generation Failed");
                                            }
                                        } catch (e) { alert(e.message); }
                                        finally { setLoading(false); }
                                    }}
                                    className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition border border-blue-200 flex items-center gap-2"
                                >
                                    <RefreshCcw size={12} /> Generate / Refresh
                                </button>
                            </div>
                            <div className="p-2 space-y-1">
                                {Object.keys(generatedDocs).length > 0 ? (
                                    Object.entries(generatedDocs).map(([docName, url], i) => (
                                        <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{docName}</span>
                                            </div>
                                            <button onClick={() => window.open(`${BASE_URL}/admin/download-docs/${order.submissionId}?type=${docName}`, '_blank')} className="text-xs font-bold text-slate-400 group-hover:text-blue-600 mr-2 flex items-center gap-1.5 transition-colors">
                                                Download <Download size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 grid grid-cols-2 gap-4">
                                        {['SPICe+ Part A', 'SPICe+ Part B', 'eMOA', 'eAOA', 'AGILE PRO'].map((form, i) => (
                                            <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded border border-slate-100 opacity-50">
                                                <FileText size={14} className="text-slate-400" />
                                                <span className="text-xs font-bold text-slate-500">{form}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Final Delivery Tab */}
                {activeTab === 'delivery' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100 text-center shadow-sm">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-600 ring-4 ring-emerald-100">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-emerald-900 mb-2">Incorporation Successful?</h4>
                            <p className="text-sm text-emerald-700 mb-8 max-w-lg mx-auto">Upload the Certificate of Incorporation (COI) to complete this order. This will automatically notify the client and mark the order as completed.</p>

                            <div className="flex justify-center">
                                <input
                                    id="coi-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleUploadCertificate}
                                />
                                <button
                                    onClick={() => document.getElementById('coi-upload').click()}
                                    disabled={loading || order.status === 'COMPLETED'}
                                    className="px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg transition flex items-center gap-2 shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                                >
                                    {loading ? <div className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"></div> : <Upload size={20} />}
                                    {order.status === 'COMPLETED' ? 'Certificate Uploaded' : 'Upload COI & Complete'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wide">Included in {order.plan || formData.plan || 'Standard'} Plan</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <CheckCircle size={14} className="text-emerald-500" /> PAN & TAN Allotment Letter
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <CheckCircle size={14} className="text-emerald-500" /> Director Identification Number (DIN)
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <CheckCircle size={14} className="text-emerald-500" /> Digital Signature Certificate (DSC)
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <CheckCircle size={14} className="text-emerald-500" /> PF & ESIC Registration Codes
                                </div>

                                {['standard', 'premium', 'growth', 'enterprise'].includes((order.plan || formData.plan || '').toLowerCase()) && (
                                    <>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <CheckCircle size={14} className="text-emerald-500" /> GST Registration Certificate
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <CheckCircle size={14} className="text-emerald-500" /> Udyam (MSME) Registration
                                        </div>
                                    </>
                                )}

                                {['premium', 'enterprise'].includes((order.plan || formData.plan || '').toLowerCase()) && (
                                    <>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <CheckCircle size={14} className="text-emerald-500" /> Trademark Filing Receipt
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <CheckCircle size={14} className="text-emerald-500" /> INC-20A Compliance Support
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PrivateLimitedWorkflowPanel;
