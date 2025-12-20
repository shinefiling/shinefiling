import React, { useState } from 'react';
import {
    CheckCircle, XCircle, FileText, ExternalLink, Shield,
    Terminal, Upload, Download, Eye, AlertTriangle
} from 'lucide-react';
import { verifyPrivateLimitedDocs, BASE_URL } from '../../../../api';

const PrivateLimitedWorkflowPanel = ({ order, onUpdateStatus, onClose }) => {
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
            const res = await fetch(`${BASE_URL}/admin/gov-submission/${order.submissionId}?srn=${srnInput}`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (!res.ok) throw new Error("Failed to update status");
            onUpdateStatus('MCA_SUBMITTED');
            alert("Status updated to MCA Submitted");
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptDoc = async (docType) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/accept-doc/${order.submissionId}?docType=${encodeURIComponent(docType)}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error("Failed to accept document");
            alert("Document Accepted");
            // onUpdateStatus(order.status); // Refresh if needed
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
            const res = await fetch(`${BASE_URL}/admin/reject-doc/${order.submissionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ docType, reason })
            });
            if (!res.ok) throw new Error("Failed to reject document");
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
        window.open(`${BASE_URL}/admin/download-docs/${order.submissionId}?type=${encodeURIComponent(formName)}`, '_blank');
    };

    const handleUploadCertificate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${BASE_URL}/admin/upload-certificate/${order.submissionId}`, {
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

    return (
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto sticky top-0 bg-white z-10 rounded-t-xl">
                {steps.map(step => (
                    <button
                        key={step.id}
                        onClick={() => setActiveTab(step.id)}
                        className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === step.id
                            ? 'text-[#B58863] border-b-2 border-[#B58863] bg-[#FDFBF7]'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        {step.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-6">

                {/* 1. Details Tab */}
                {activeTab === 'details' && (
                    <div className="space-y-6">
                        {/* Company Info */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-sm font-bold text-[#10232A] mb-3 flex items-center gap-2">
                                <Shield size={16} className="text-[#B58863]" /> Proposed Company Info
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="text-gray-400 font-bold uppercase">Name Choice 1</p>
                                    <p className="font-bold text-gray-700">{formData.companyName1 || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-bold uppercase">Name Choice 2</p>
                                    <p className="font-bold text-gray-700">{formData.companyName2 || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-bold uppercase">Activity</p>
                                    <p className="font-bold text-gray-700">{formData.activity || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-bold uppercase">Capital</p>
                                    <p className="font-bold text-gray-700">Auth: {formData.authorizedCapital} / Paid: {formData.paidUpCapital}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-400 font-bold uppercase">Registered Address</p>
                                    <p className="font-bold text-gray-700">{formData.registeredAddress || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Directors */}
                        <div>
                            <h4 className="text-sm font-bold text-[#10232A] mb-3">Directors & Shareholders</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {directors.map((d, i) => (
                                    <div key={i} className="p-3 border border-gray-100 rounded-lg shadow-sm flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                                {d.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{d.name}</p>
                                                <p className="text-[10px] text-gray-500">{d.email} • {d.phone}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">PAN: {d.pan}</span>
                                                    {d.aadhaar && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">ADR: {d.aadhaar}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                            {d.designation || 'Director'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Documents & Verification Tab */}
                {activeTab === 'docs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div>
                                <h4 className="text-sm font-bold text-blue-800">Review Required</h4>
                                <p className="text-[10px] text-blue-600">Please verify all client uploaded documents before proceeding.</p>
                            </div>
                            <button
                                onClick={handleVerifyDocs}
                                disabled={loading || order.status === 'DOCUMENTS_VERIFIED' || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'}
                                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition ${order.status === 'DOCUMENTS_VERIFIED' || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent"></div> : <CheckCircle size={14} />}
                                {order.status === 'DOCUMENTS_VERIFIED' || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED' ? 'Verified' : 'Verify All Docs'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(docs).map(([key, url]) => (
                                <div key={key} className="group p-3 border border-gray-100 rounded-xl hover:shadow-md transition bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-700 capitalize">{key.replace(/_/g, ' ')}</p>
                                                <p className="text-[10px] text-gray-400">Uploaded by Client</p>
                                            </div>
                                        </div>
                                        {/* Use handleDownloadForm for generic download or just a direct link if url is valid */}
                                        <button onClick={() => window.open(`${BASE_URL}/admin/download-docs/${order.submissionId}?type=${key}`, '_blank')} className="text-gray-400 hover:text-indigo-600">
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleAcceptDoc(key)}
                                            className="flex-1 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold rounded hover:bg-green-100 transition"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleRejectDoc(key)}
                                            className="flex-1 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold rounded hover:bg-red-100 transition"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {Object.keys(docs).length === 0 && (
                                <div className="col-span-2 text-center py-8 text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No documents uploaded yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Government Filing Tab */}
                {activeTab === 'filing' && (
                    <div className="space-y-6">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                                <Terminal size={16} /> MCA Filing Status
                            </h4>
                            <p className="text-xs text-orange-700 mb-4">
                                Once you have filed the SPICe+ form on the MCA portal, enter the Service Request Number (SRN) here to track status.
                            </p>

                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-orange-800 uppercase block mb-1">Service Request Number (SRN)</label>
                                    <input
                                        type="text"
                                        value={srnInput}
                                        onChange={(e) => setSrnInput(e.target.value)}
                                        placeholder="e.g. SRN12345678"
                                        className="w-full px-3 py-2 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                                        disabled={order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'}
                                    />
                                </div>
                                <button
                                    onClick={handleSubmitToGov}
                                    disabled={loading || order.status === 'MCA_SUBMITTED' || order.status === 'COMPLETED'}
                                    className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition flex items-center gap-2 text-xs h-[38px]"
                                >
                                    {loading ? 'Updating...' : 'Mark Submitted'}
                                </button>
                            </div>
                        </div>

                        {/* Generated Forms (Mock) */}
                        <div>
                            <h4 className="text-sm font-bold text-[#10232A] mb-3">System Generated Forms</h4>
                            <div className="space-y-2">
                                {['SPICe+ Part A', 'SPICe+ Part B', 'eMOA', 'eAOA', 'AGILE PRO'].map((form, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-700">{form}</span>
                                        </div>
                                        <button onClick={() => handleDownloadForm(form)} className="text-[10px] font-bold text-blue-600 hover:underline">Download Draft</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Final Delivery Tab */}
                {activeTab === 'delivery' && (
                    <div className="space-y-6">
                        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-emerald-600">
                                <CheckCircle size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-emerald-800 mb-1">Incorporation Successful?</h4>
                            <p className="text-xs text-emerald-600 mb-6">Upload the Certificate of Incorporation (COI) to complete this order and notify the client.</p>

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
                                    className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent"></div> : <Upload size={18} />}
                                    {order.status === 'COMPLETED' ? 'Certificate Uploaded' : 'Upload COI & Complete'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Post-Incorporation Deliverables ({order.plan || formData.plan || 'Standard'} Plan)</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle size={12} className="text-green-500" /> PAN & TAN Allotment Letter
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle size={12} className="text-green-500" /> Director Identification Number (DIN)
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle size={12} className="text-green-500" /> Digital Signature Certificate (DSC)
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle size={12} className="text-green-500" /> PF & ESIC Registration Codes
                                </div>

                                {['standard', 'premium', 'growth', 'enterprise'].includes((order.plan || formData.plan || '').toLowerCase()) && (
                                    <>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <CheckCircle size={12} className="text-green-500" /> GST Registration Certificate
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <CheckCircle size={12} className="text-green-500" /> Udyam (MSME) Registration
                                        </div>
                                    </>
                                )}

                                {['premium', 'enterprise'].includes((order.plan || formData.plan || '').toLowerCase()) && (
                                    <>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <CheckCircle size={12} className="text-green-500" /> Trademark Filing Receipt
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <CheckCircle size={12} className="text-green-500" /> INC-20A Compliance Support
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
