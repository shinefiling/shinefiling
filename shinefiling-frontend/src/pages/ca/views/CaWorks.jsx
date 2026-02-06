
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, User, CheckCircle, RefreshCw, FileText, X, Download, Upload, Eye } from 'lucide-react';
import { uploadFile, updatePrivateLimitedStatus, updateOnePersonCompanyStatus } from '../../../api'; // Ensure these imports match your API structure

const ManageServiceModal = ({ request, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [finalFiles, setFinalFiles] = useState({});
    const [uploading, setUploading] = useState(false);
    const [comments, setComments] = useState('');

    // Safe parsing of client docs
    const clientDocs = React.useMemo(() => {
        try {
            return request.documentUrl ? JSON.parse(request.documentUrl) : [];
        } catch { return []; }
    }, [request]);

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            // Upload to 'final_deliverables' category
            const response = await uploadFile(file, 'final_deliverables');
            setFinalFiles(prev => ({
                ...prev,
                [key]: { name: response.originalName, url: response.fileUrl }
            }));
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitCompletion = async () => {
        if (Object.keys(finalFiles).length === 0) {
            if (!window.confirm("No final documents uploaded. Are you sure you want to complete this without files?")) return;
        }

        try {
            setUploading(true);
            // 1. Construct the final payload with uploaded docs
            // Note: In a real app, you might have a specific API endpoint for 'CA_COMPLETE' that accepts docs.
            // Here we are mocking the logic by updating status and potentially appending docs to a comment or separate field.

            // For now, we assume standard status update logic
            // You might need a specific endpoint like `submitFinalDeliverables(req.id, files)`

            // Simulating API call to update status
            // const apiFunc = request.serviceName.includes('Private') ? updatePrivateLimitedStatus : updateOnePersonCompanyStatus;
            // await apiFunc(request.id, 'COMPLETED_REVIEW_PENDING'); 

            // Using the prop passed from parent (respondToBoundAmount) acts as the status updater in this dashboard context
            // check CaWorks parent pass 'respondToBoundAmount'

            // We'll call the onUpdate prop which wraps the API call
            await onUpdate(request.id, 'COMPLETED_FINAL', `Work Completed. Files: ${Object.keys(finalFiles).join(', ')}`, finalFiles);

            onClose();
        } catch (error) {
            alert("Failed to submit: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#043E52] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#032d3c]">
                    <div>
                        <h2 className="text-xl font-bold text-[#043E52] dark:text-white flex items-center gap-2">
                            <Briefcase size={20} className="text-[#ED6E3F]" />
                            Running Project: {request.serviceName}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Order ID: #{request.id.slice(-8)} • Client: {request.user?.fullName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-slate-500 dark:text-slate-300" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-white/10 px-6 bg-white dark:bg-[#043E52]">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-[#ED6E3F] text-[#ED6E3F]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                        Client Details & Docs
                    </button>
                    <button
                        onClick={() => setActiveTab('submission')}
                        className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'submission' ? 'border-[#ED6E3F] text-[#ED6E3F]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                        Submission & Complete
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA] dark:bg-[#0D1C22]">
                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            {/* Client Data Card */}
                            <div className="bg-white dark:bg-[#1C3540] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Client Information</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Full Name</span>
                                        <span className="font-bold text-[#043E52] dark:text-white">{request.user?.fullName}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Email Address</span>
                                        <span className="font-bold text-[#043E52] dark:text-white">{request.user?.email}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Phone</span>
                                        <span className="font-bold text-[#043E52] dark:text-white">{request.user?.mobile || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 dark:text-slate-400">Plan Selected</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-fit">
                                            {request.plan || 'Standard'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Grid */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Uploaded Documents</h3>
                                {clientDocs.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {clientDocs.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-[#1C3540] rounded-xl border border-slate-100 dark:border-white/5 hover:border-[#ED6E3F]/30 transition-colors">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm text-[#043E52] dark:text-white truncate">{doc.filename || doc.name || `Document ${idx + 1}`}</p>
                                                        <p className="text-xs text-slate-400">Client Upload</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={doc.fileUrl || doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 transition-colors"
                                                    title="View Document"
                                                >
                                                    <Download size={18} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-xl text-center text-slate-400 italic">
                                        No documents found for this request.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-700/50 flex gap-3 text-sm text-amber-800 dark:text-amber-200">
                                <CheckCircle size={20} className="shrink-0" />
                                <div>
                                    <p className="font-bold">Required Deliverables</p>
                                    <p className="text-amber-700 dark:text-amber-300 opacity-80 mt-1">Please ensure you upload the <strong>Certificate of Incorporation</strong>, <strong>PAN</strong>, and <strong>TAN</strong> letters before marking as complete.</p>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Upload Final Files</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {['Certificate of Incorporation', 'PAN Card', 'TAN Letter', 'MOA & AOA'].map((label) => {
                                        const key = label.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and');
                                        const hasFile = !!finalFiles[key];
                                        return (
                                            <div key={key} className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-between transition-colors ${hasFile ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-[#ED6E3F]'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {hasFile ? <CheckCircle size={20} /> : <Upload size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-[#043E52] dark:text-white">{label}</p>
                                                        {hasFile && <p className="text-xs text-emerald-600 font-medium truncate max-w-[150px]">{finalFiles[key].name}</p>}
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    id={`upload-${key}`}
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(e, key)}
                                                />
                                                <label
                                                    htmlFor={`upload-${key}`}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${hasFile ? 'bg-emerald-200 text-emerald-800 hover:bg-emerald-300' : 'bg-[#043E52] text-white hover:bg-[#032d3c]'}`}
                                                >
                                                    {hasFile ? 'Replace' : 'Upload'}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <hr className="border-slate-200 dark:border-white/10" />

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitCompletion}
                                    disabled={uploading}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all ${uploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/20'}`}
                                >
                                    {uploading ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                    Complete Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const CaWorks = ({ requests, employees, handleAssignEmployee, respondToBoundAmount, fetchData }) => {
    // Filter active works
    const myWorks = requests.filter(r => r.caApprovalStatus === 'ACCEPTED' || r.caApprovalStatus === 'COMPLETED_FINAL');

    // Request Management State
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleUpdateTask = async (reqId, status, comments, files) => {
        // Here we would properly call the API to update request with files
        // For this demo, we use the respondToBoundAmount as a proxy or assume it handles the logic
        // In a real implementation: `await updateServiceRequestDocs(reqId, files)`
        await respondToBoundAmount(reqId, status, comments, files);
        fetchData();
    };

    const statusColors = {
        'COMPLETED_FINAL': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'ACCEPTED': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'PENDING': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#043E52] dark:text-white">Assigned Services</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track progress of your ongoing projects.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-[#1C3540] text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">Service Details</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Assigned To</th>
                                    <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-[#1C3540]">
                                {myWorks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Briefcase size={48} className="mb-4 opacity-20" />
                                                <p className="font-bold text-lg">No Active Works</p>
                                                <p className="text-xs">Accept new requests from the Marketplace tab.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : myWorks.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-[#1C3540]/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#043E52] dark:text-white mb-0.5">{r.serviceName}</div>
                                            <div className="text-xs text-slate-400 font-mono">#{r.id.slice(-8)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                                    {(r.user?.fullName || 'C').charAt(0)}
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">{r.user?.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusColors[r.caApprovalStatus] || 'bg-slate-100 text-slate-600'}`}>
                                                {r.caApprovalStatus?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group/select">
                                                <select
                                                    className="w-full bg-slate-50 dark:bg-[#043E52] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-[#ED6E3F] appearance-none cursor-pointer font-medium"
                                                    value={r.assignedEmployee?.id || ''}
                                                    onChange={(e) => handleAssignEmployee(r.id, e.target.value)}
                                                >
                                                    <option value="">-- Myself --</option>
                                                    {employees.map(e => (
                                                        <option key={e.id} value={e.id}>{e.fullName}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <User size={12} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {r.caApprovalStatus === 'ACCEPTED' ? (
                                                <button
                                                    onClick={() => setSelectedRequest(r)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#043E52] hover:bg-[#032d3c] text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-[#043E52]/20"
                                                >
                                                    Manage Work <Briefcase size={14} />
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                                                    <CheckCircle size={14} /> Completed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Modal Injection */}
            <AnimatePresence>
                {selectedRequest && (
                    <ManageServiceModal
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        onUpdate={handleUpdateTask}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default CaWorks;
