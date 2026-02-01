import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Globe, FileText, Download, Play, RefreshCw, Smartphone, ShieldCheck, UserCheck } from 'lucide-react';

const MsmeWorkflowPanel = ({ order, onUpdateStatus, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState({
        aadhaar: 'PENDING',
        pan: 'PENDING',
        nic: 'PENDING',
        bank: 'PENDING'
    });

    const [submissionStep, setSubmissionStep] = useState(0); // 0: None, 1: Login, 2: Fill, 3: OTP, 4: Done
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg }]);

    // STEP 5: DATA VERIFICATION
    const handleVerifyParams = async () => {
        setLoading(true);
        addLog("Initiating data verification protocols...");

        // Simulate checking external databases
        setTimeout(() => {
            setVerificationStatus(prev => ({ ...prev, aadhaar: 'VERIFIED' }));
            addLog("Aadhaar database match confirmed.");
        }, 1000);

        setTimeout(() => {
            setVerificationStatus(prev => ({ ...prev, pan: 'VERIFIED' }));
            addLog("PAN Income Tax database match confirmed.");
        }, 2000);

        setTimeout(() => {
            setVerificationStatus(prev => ({ ...prev, nic: 'VERIFIED', bank: 'VERIFIED' }));
            addLog("NIC Codes and Bank details validated.");
            setLoading(false);
            onUpdateStatus('DOCUMENTS_VERIFIED');
        }, 3000);
    };

    // STEP 6: UDYAM PORTAL REGISTRATION (AUTOMATION)
    const handleUdyamSubmission = async () => {
        if (verificationStatus.aadhaar !== 'VERIFIED') {
            alert("Please verify documents first.");
            return;
        }

        setSubmissionStep(1);
        addLog("Connecting to Udyam Registration Portal (Government of India)...");

        // Simulate Login
        setTimeout(() => {
            setSubmissionStep(2);
            addLog("Admin Login Successful. Filling application form...");
        }, 2000);

        // Simulate Filling
        setTimeout(() => {
            setSubmissionStep(3);
            addLog("Form filled. Waiting for Aadhaar OTP validation...");
        }, 4500);

        // Simulate OTP & Submission
        setTimeout(() => {
            setSubmissionStep(4);
            addLog("OTP Verified. Application Submitted Successfully.");
            onUpdateStatus('SUBMITTED_TO_GOVT');
        }, 7000);
    };

    // STEP 7: CERTIFICATE GENERATION
    const handleGenerateCertificate = async () => {
        setLoading(true);
        addLog("Fetching Udyam Registration Certificate from Govt Portal...");

        // Simulate Fetch
        setTimeout(() => {
            addLog("Certificate Retrieved. Udyam-XX-XX-XXXXXXX assigned.");
            onUpdateStatus('COMPLETED');
            setLoading(false);
            alert("Certificate Generated and email sent to client!");
        }, 2000);
    };

    const StatusBadge = ({ status }) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {status}
        </span>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-4 bg-gradient-to-r from-[#043E52] to-[#3D4D55] border-b border-[#043E52]/20 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#ED6E3F]" /> MSME / Udyam Super Admin Console
                </h3>
                <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-white/80">ORD-{order.id}</span>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1">

                {/* 1. DATA VERIFICATION SECTION */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-700 flex items-center gap-2">1. Data Verification <span className="text-gray-400 text-xs font-normal">(System Checks)</span></h4>
                        {Object.values(verificationStatus).some(s => s !== 'VERIFIED') && (
                            <button
                                onClick={handleVerifyParams}
                                disabled={loading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-[#FDFBF7] text-[#ED6E3F] hover:bg-white border border-[#ED6E3F]/20 rounded-lg text-xs font-bold transition shadow-sm"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />} Run Auto-Verify
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg flex justifies-between items-center">
                            <span className="text-xs font-bold text-gray-500">Aadhaar: {order.aadhaarNumber || 'XXXXXXXX1234'}</span>
                            <StatusBadge status={verificationStatus.aadhaar} />
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500">PAN: {order.panNumber || 'ABCDE1234F'}</span>
                            <StatusBadge status={verificationStatus.pan} />
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500">NIC Codes Validity</span>
                            <StatusBadge status={verificationStatus.nic} />
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500">Bank Details Check</span>
                            <StatusBadge status={verificationStatus.bank} />
                        </div>
                    </div>
                </section>

                {/* 2. AUTOMATION TERMINAL */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-700 flex items-center gap-2">2. Portal Submission Automation</h4>
                        {submissionStep < 4 ? (
                            <button
                                onClick={handleUdyamSubmission}
                                disabled={loading || verificationStatus.aadhaar !== 'VERIFIED'}
                                className="flex items-center gap-2 px-4 py-2 bg-[#043E52] hover:bg-[#ED6E3F] text-white rounded-lg text-xs font-bold transition disabled:opacity-50 shadow-lg shadow-[#043E52]/20"
                            >
                                <Globe size={14} /> Sync with Udyam Portal
                            </button>
                        ) : (
                            <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Submitted</span>
                        )}
                    </div>

                    <div className="bg-[#1e1e1e] rounded-xl p-4 font-mono text-xs h-48 overflow-y-auto flex flex-col-reverse shadow-inner">
                        {logs.length === 0 && <span className="text-gray-600 italic">System ready. Waiting for command...</span>}
                        {logs.map((l, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-gray-500">[{l.time}]</span> <span className="text-green-400">root@admin:~$</span> <span className="text-gray-300">{l.msg}</span>
                            </div>
                        ))}
                    </div>

                    {/* Visual Progress of Automation */}
                    {submissionStep > 0 && (
                        <div className="flex items-center justify-between mt-4 px-4 relative">
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-100 -z-10"></div>
                            {[
                                { step: 1, label: "Login" },
                                { step: 2, label: "Fill Form" },
                                { step: 3, label: "OTP Check" },
                                { step: 4, label: "Complete" }
                            ].map((s) => (
                                <div key={s.step} className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${submissionStep >= s.step ? 'bg-green-500 text-white scale-110' : 'bg-gray-200 text-gray-400'}`}>
                                        {submissionStep >= s.step ? <CheckCircle size={14} /> : s.step}
                                    </div>
                                    <span className={`text-[10px] font-bold mt-1 ${submissionStep >= s.step ? 'text-green-600' : 'text-gray-400'}`}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 3. CERTIFICATE GENERATION */}
                <section className={submissionStep < 4 ? 'opacity-50 pointer-events-none' : ''}>
                    <h4 className="font-bold text-gray-700 mb-4">3. Final Delivery</h4>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm mb-4">
                            <FileText size={32} />
                        </div>
                        <h5 className="font-bold text-green-800 text-lg">Ready to Generate</h5>
                        <p className="text-green-600 text-xs mb-6">Application successfully filed. Certificate is available for download.</p>
                        <button
                            onClick={handleGenerateCertificate}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition hover:-translate-y-1"
                        >
                            <Download size={18} /> Generate & Send Certificate
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default MsmeWorkflowPanel;
