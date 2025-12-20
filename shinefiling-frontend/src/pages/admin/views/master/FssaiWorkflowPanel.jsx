import React, { useState } from 'react';
import axios from 'axios';
import {
    FileText, CheckCircle, XCircle, Play, Download, Upload,
    Shield, Loader2
} from 'lucide-react';
import { BASE_URL } from '../../../../api';

const API_URL = `${BASE_URL}/fssai`;

const FssaiWorkflowPanel = ({ orderId, submissionId, docs = [], genDocs = [], onRefresh }) => {
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingDocId, setRejectingDocId] = useState(null);
    const [govDetails, setGovDetails] = useState({ arn: '', date: '' });

    const handleVerify = async (docId, approved, reason = null) => {
        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/${submissionId}/verify-doc/${docId}`, { approved, reason });
            if (onRefresh) onRefresh();
            setRejectingDocId(null);
        } catch (err) {
            alert("Action failed: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartAutomation = async () => {
        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/${submissionId}/start-automation`);
            if (onRefresh) onRefresh();
            alert("Automation Started & Documents Generated!");
        } catch (err) {
            alert("Automation failed: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitGovt = async () => {
        if (!govDetails.arn || !govDetails.date) return alert("Please enter ARN and Date");
        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/${submissionId}/submit-govt`, govDetails);
            if (onRefresh) onRefresh();
        } catch (err) {
            alert("Submission failed: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUploadCert = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setActionLoading(true);
        try {
            await axios.post(`${API_URL}/${submissionId}/upload-certificate`, formData);
            if (onRefresh) onRefresh();
            alert("Certificate Uploaded! Order Completed.");
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const downloadFile = (path) => {
        window.open(`${BASE_URL}/fssai/download?path=${encodeURIComponent(path)}`, '_blank');
    };

    const allVerified = docs.length > 0 && docs.every(d => d.status === 'VERIFIED');
    const hasGenDocs = genDocs.length > 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">

            {/* STEP 1: DOC VERIFICATION */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#10232A] text-sm mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-[#FDFBF7] text-[#B58863] rounded-lg border border-[#B58863]/20"><FileText size={14} /></div>
                    Document Verification
                </h3>
                <div className="space-y-3">
                    {docs.length === 0 && <p className="text-gray-400 text-xs italic">No documents uploaded yet.</p>}
                    {docs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <FileText size={16} className="text-gray-400" />
                                <div>
                                    <p className="font-bold text-xs text-gray-700">{doc.type}</p>
                                    <button onClick={() => downloadFile(doc.url)} className="text-[10px] text-blue-500 hover:underline font-bold flex items-center gap-1">
                                        View <Download size={8} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {doc.status === 'VERIFIED' ? (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[10px] rounded flex items-center gap-1"><CheckCircle size={10} /> Verified</span>
                                ) : doc.status === 'REJECTED' ? (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded flex items-center gap-1"><XCircle size={10} /> Rejected</span>
                                ) : (
                                    rejectingDocId === doc.id ? (
                                        <div className="flex items-center gap-1">
                                            <input autoFocus className="w-20 px-1 py-0.5 text-xs border rounded" placeholder="Reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                                            <button onClick={() => handleVerify(doc.id, false, rejectReason)} className="p-1 bg-red-500 text-white rounded"><CheckCircle size={12} /></button>
                                            <button onClick={() => setRejectingDocId(null)} className="p-1 bg-gray-200 rounded"><XCircle size={12} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <button onClick={() => handleVerify(doc.id, true)} disabled={actionLoading} className="px-2 py-1 bg-[#10232A] hover:bg-[#B58863] text-white rounded text-[10px] font-bold">Approve</button>
                                            <button onClick={() => setRejectingDocId(doc.id)} disabled={actionLoading} className="px-2 py-1 bg-red-50 text-red-500 border border-red-100 rounded text-[10px] font-bold">Reject</button>
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* STEP 2: AUTOMATION */}
            {allVerified && (
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-[#10232A] text-sm flex items-center gap-2">
                            <div className="p-1.5 bg-[#FDFBF7] text-[#B58863] rounded-lg border border-[#B58863]/20"><Play size={14} /></div>
                            Automation & Generation
                        </h3>
                        {!hasGenDocs && (
                            <button
                                onClick={handleStartAutomation}
                                disabled={actionLoading}
                                className="px-3 py-1.5 bg-[#10232A] text-white text-xs font-bold rounded-lg shadow hover:bg-[#B58863] transition flex items-center gap-1"
                            >
                                {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />} Run Auto-Gen
                            </button>
                        )}
                    </div>
                    {hasGenDocs && (
                        <div className="grid grid-cols-2 gap-2">
                            {genDocs.map(doc => (
                                <div key={doc.id} onClick={() => downloadFile(doc.filePath)} className="p-2 bg-purple-50 border border-purple-100 rounded-lg cursor-pointer hover:bg-purple-100">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-purple-500" />
                                        <p className="text-xs font-bold text-purple-900 truncate">{doc.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: GOVT */}
            {hasGenDocs && (
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#10232A] text-sm mb-4 flex items-center gap-2">
                        <div className="p-1.5 bg-[#FDFBF7] text-[#B58863] rounded-lg border border-[#B58863]/20"><Shield size={14} /></div>
                        Govt Portal Update
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs" placeholder="ARN Number" value={govDetails.arn} onChange={e => setGovDetails({ ...govDetails, arn: e.target.value })} />
                        <input type="date" className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs" value={govDetails.date} onChange={e => setGovDetails({ ...govDetails, date: e.target.value })} />
                    </div>
                    <button onClick={handleSubmitGovt} disabled={actionLoading} className="w-full py-1.5 bg-[#10232A] text-white text-xs font-bold rounded hover:bg-[#B58863] transition">Mark Submitted</button>
                </div>
            )}

            {/* STEP 4: CERTIFICATE */}
            {hasGenDocs && (
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#10232A] text-sm mb-4 flex items-center gap-2">
                        <div className="p-1.5 bg-[#FDFBF7] text-[#B58863] rounded-lg border border-[#B58863]/20"><CheckCircle size={14} /></div>
                        Final Certificate
                    </h3>
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1 font-bold">Upload Certificate PDF</span>
                        <input type="file" className="hidden" onChange={handleUploadCert} />
                    </label>
                </div>
            )}
        </div>
    );
};

export default FssaiWorkflowPanel;
