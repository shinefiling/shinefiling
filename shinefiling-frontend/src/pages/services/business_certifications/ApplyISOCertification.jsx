import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, ChevronRight, Save } from 'lucide-react';
import { submitISOCertification } from '../../../api';

const ApplyISOCertification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPlan = queryParams.get('plan');

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        organizationName: '',
        contactPerson: '',
        mobile: '',
        email: '',
        address: '',
        standard: initialPlan || 'iso9001', // iso9001, iso14001, ims
        businessActivity: ''
    });
    const [documents, setDocuments] = useState({
        registrationCert: null,
        letterhead: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                mobile: user.mobile || '',
                contactPerson: user.fullName || ''
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, docType) => {
        if (e.target.files && e.target.files[0]) {
            setDocuments({ ...documents, [docType]: e.target.files[0] });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const processedDocs = {};
            for (const [key, file] of Object.entries(documents)) {
                if (file) {
                    processedDocs[key] = `File: ${file.name}`;
                }
            }

            const payload = {
                businessName: formData.organizationName,
                businessType: "Unknown", // Field not in form
                isoStandard: formData.standard,
                scopeOfBusiness: formData.businessActivity,
                currentCertification: "No", // Field not in form
                mobile: formData.mobile,
                email: formData.email,
                address: formData.address,
                // Extra fields for generic handling if needed
                status: "PENDING",
                notes: JSON.stringify(processedDocs)
            };

            await submitISOCertification(payload);
            navigate('/dashboard?tab=orders');
        } catch (err) {
            setError(err.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-slate-800">ISO Certification Application</h1>
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Step {step} of 2
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FileText size={20} className="text-blue-600" /> Organization Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Organization Name</label>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={formData.organizationName}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Contact Person</label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">ISO Standard</label>
                                    <select
                                        name="standard"
                                        value={formData.standard}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-800"
                                    >
                                        <option value="iso9001">ISO 9001:2015 (Quality)</option>
                                        <option value="iso14001">ISO 14001:2015 (Environment)</option>
                                        <option value="ims">Combo (IMS)</option>
                                        <option value="iso27001">ISO 27001 (InfoSec)</option>
                                        <option value="iso45001">ISO 45001 (Health & Safety)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Business Activity</label>
                                    <input
                                        type="text"
                                        name="businessActivity"
                                        placeholder="e.g. Manufacturing of Textiles"
                                        value={formData.businessActivity}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-800 h-24 resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.organizationName || !formData.businessActivity}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Upload size={20} className="text-blue-600" /> Document Upload
                            </h2>
                            <p className="text-sm text-slate-500">Please upload clear copies (PDF/JPG).</p>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'registrationCert', label: 'Business Registration Proof (GST/MSME/Inc. Cert)' },
                                    { id: 'letterhead', label: 'Sample Letterhead / Invoice' }
                                ].map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                                                {documents[doc.id] ? <CheckCircle size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{doc.label}</p>
                                                {documents[doc.id] && <p className="text-xs text-green-600 font-medium mt-0.5">{documents[doc.id].name}</p>}
                                            </div>
                                        </div>
                                        <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition shadow-sm">
                                            {documents[doc.id] ? 'Change' : 'Upload'}
                                            <input type="file" className="hidden" onChange={(e) => handleFileChange(e, doc.id)} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition"
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition disabled:opacity-50 shadow-lg shadow-green-600/20"
                            >
                                {loading ? 'Submitting...' : 'Submit Application'} {!loading && <Save size={18} />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyISOCertification;
