import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, FileWarning, Clock } from 'lucide-react';
import { uploadFile, submitTrademarkObjection } from '../../../api'; // ensure in api.js

const ApplyTrademarkObjection = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data form local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        applicationNumber: '',
        objectionType: 'SECTION_11', // SECTION_9, SECTION_11, FORMALITIES

        // Form Data
        examinationReportDate: '',
        applicantResponse: '',
        requestHearing: false,

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/intellectual-property/trademark-objection/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'trademark-objection');
                if (response && response.fileUrl) {
                    setFormData(prev => ({
                        ...prev,
                        uploadedDocuments: [
                            ...prev.uploadedDocuments.filter(d => d.id !== docType),
                            {
                                id: docType,
                                type: docType,
                                filename: response.originalName || file.name,
                                fileUrl: response.fileUrl
                            }
                        ]
                    }));
                } else {
                    alert('Upload failed. Please try again.');
                }
            } catch (error) {
                console.error("File upload error:", error);
                alert('Error uploading file.');
            } finally {
                setUploadingFiles(prev => ({ ...prev, [docType]: false }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                submissionId: `TMO-${Date.now()}`,
                userEmail: formData.userEmail,
                applicationNumber: formData.applicationNumber,
                objectionType: formData.objectionType,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    examinationReportDate: formData.examinationReportDate,
                    applicantResponse: formData.applicantResponse,
                    requestHearing: formData.requestHearing
                },
                documents: formData.uploadedDocuments
            };

            await submitTrademarkObjection(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF4F4] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#2B3446] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><FileWarning size={20} className="text-red-400" /> Objection Reply</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-red-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Objection Details</h2>
                            <p className="text-slate-500 mb-8">Provide details from the Examination Report.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Application Number</label>
                                        <input type="text" name="applicationNumber" value={formData.applicationNumber} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. 1234567" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Objection Type</label>
                                        <select name="objectionType" value={formData.objectionType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="SECTION_9">Section 9 (Absolute Grounds)</option>
                                            <option value="SECTION_11">Section 11 (Relative Grounds/Conflict)</option>
                                            <option value="FORMALITIES">Formalities Check (e.g. POA Missing)</option>
                                            <option value="OTHERS">Others / Clerical Error</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Clock size={16} /> Date of Examination Report</label>
                                    <input type="date" name="examinationReportDate" value={formData.examinationReportDate} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    <p className="text-xs text-red-500 mt-1 font-bold">Important: Reply deadline is 30 days from this date.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Brief Comments / Instructions</label>
                                    <textarea name="applicantResponse" rows="3" value={formData.applicantResponse} className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="Briefly describe why you think the objection is invalid..."></textarea>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Evidence & Docs</h2>
                            <p className="text-slate-500 mb-8">Upload report and proofs.</p>

                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer p-4 border border-red-200 rounded-xl bg-red-50 hover:bg-red-100 transition">
                                    <input type="checkbox" name="requestHearing" checked={formData.requestHearing} onChange={handleChange} className="w-5 h-5 accent-red-600 rounded" />
                                    <div>
                                        <span className="text-slate-800 font-bold block">Request Hearing Immediately?</span>
                                        <span className="text-xs text-slate-500">Check this if you want to skip written arguments and go straight to hearing (Not Recommended).</span>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'EXAMINATION_REPORT', label: 'Examination Report (PDF)' },
                                    { id: 'USAGE_EVIDENCE', label: 'Usage Evidence (Bills/Invoices)' },
                                    { id: 'POWER_OF_ATTORNEY', label: 'Power of Attorney (TM-48)' }
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-red-200 text-red-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-red-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}>
                                                {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                                <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-6 border border-red-200 flex items-center gap-2"><AlertTriangle size={18} /> {error}</div>}

                            <div className="flex gap-4">
                                <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">
                                    Back
                                </button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Submit Reply'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Reply Initiated!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                Our attorneys will review your objection for Application <strong>#{formData.applicationNumber}</strong> and draft the reply.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Total Fees</p>
                                <p className="text-4xl font-black text-[#2B3446]">₹2,999<span className="text-sm font-normal text-slate-400 block">Drafting & Filing</span></p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyTrademarkObjection;
