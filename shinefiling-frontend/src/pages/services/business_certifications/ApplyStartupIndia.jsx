import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, ChevronRight, Save } from 'lucide-react';
import { submitStartupIndia } from '../../../api';

const ApplyStartupIndia = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        startupName: '',
        cinLlpNumber: '',
        dateOfIncorporation: '',
        industry: '',
        sector: '',
        website: '',
        mobile: '',
        email: ''
    });
    const [documents, setDocuments] = useState({
        coi: null,
        pitchDeck: null,
        directorsList: null
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
                mobile: user.mobile || ''
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
                startupName: formData.startupName,
                entityType: "Private Limited", // Default as form doesn't request it
                dateOfIncorporation: formData.dateOfIncorporation,
                incorporationNumber: formData.cinLlpNumber,
                industry: formData.industry,
                sector: formData.sector,
                mobile: formData.mobile,
                email: formData.email,
                // Extra fields
                status: "PENDING",
                website: formData.website, // Handled if backend supports, else ignored
                notes: JSON.stringify(processedDocs)
            };

            await submitStartupIndia(payload);
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
                        <h1 className="text-lg font-bold text-slate-800">Startup India Application</h1>
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
                                <FileText size={20} className="text-red-600" /> Startup Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Startup Name</label>
                                    <input
                                        type="text"
                                        name="startupName"
                                        value={formData.startupName}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">CIN / LLPIN</label>
                                    <input
                                        type="text"
                                        name="cinLlpNumber"
                                        value={formData.cinLlpNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date of Incorporation</label>
                                    <input
                                        type="date"
                                        name="dateOfIncorporation"
                                        value={formData.dateOfIncorporation}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Website URL</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Industry</label>
                                    <input
                                        type="text"
                                        name="industry"
                                        placeholder="e.g. IT Services"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Sector</label>
                                    <input
                                        type="text"
                                        name="sector"
                                        placeholder="e.g. Software Development"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.startupName || !formData.cinLlpNumber}
                                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                                <Upload size={20} className="text-red-600" /> Document Upload
                            </h2>
                            <p className="text-sm text-slate-500">Please upload clear copies (PDF/JPG).</p>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'coi', label: 'Certificate of Incorporation (COI)' },
                                    { id: 'pitchDeck', label: 'Pitch Deck / Brief Note on Innovation' },
                                    { id: 'directorsList', label: 'List of Directors / Partners' }
                                ].map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition">
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

export default ApplyStartupIndia;
