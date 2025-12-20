import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Palette, Image } from 'lucide-react';
import { uploadFile, submitDesignRegistration } from '../../../api'; // ensure in api.js

const ApplyDesignRegistration = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data form local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        articleName: '',

        // Form Data
        applicantName: '',
        applicantNature: 'STARTUP', // STARTUP, MSME, OTHER
        designDescription: '',
        isNovel: 'TRUE',

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/intellectual-property/design-registration/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? (checked ? 'TRUE' : 'FALSE') : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'design-registration');
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

        if (formData.isNovel === 'FALSE') {
            setError('Design must be novel to be registered.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                submissionId: `DES-${Date.now()}`,
                userEmail: formData.userEmail,
                articleName: formData.articleName,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    applicantName: formData.applicantName,
                    applicantNature: formData.applicantNature,
                    designDescription: formData.designDescription,
                    isNovel: formData.isNovel
                },
                documents: formData.uploadedDocuments
            };

            await submitDesignRegistration(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F9FF] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#0369A1] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sky-200 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Palette size={20} className="text-sky-400" /> Design Application</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-sky-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Design Details</h2>
                            <p className="text-slate-500 mb-8">Tell us about your product design.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Article Name (Product)</label>
                                        <input type="text" name="articleName" value={formData.articleName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. Water Bottle, Chair" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Applicant Nature</label>
                                        <select name="applicantNature" value={formData.applicantNature} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="STARTUP">Startup (Fee Benefit)</option>
                                            <option value="MSME">MSME (Small Enterprise)</option>
                                            <option value="OTHER">Other (Company / Individual)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Applicant Name</label>
                                    <input type="text" name="applicantName" value={formData.applicantName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Brief Description</label>
                                    <textarea name="designDescription" value={formData.designDescription} required className="w-full p-3 border border-slate-300 rounded-lg h-24" onChange={handleChange} placeholder="Describe the novelty (e.g., unique handle shape, specific pattern)..." />
                                </div>

                                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex items-start gap-3">
                                    <input type="checkbox" name="isNovel" checked={formData.isNovel === 'TRUE'} onChange={handleChange} className="w-5 h-5 text-sky-600 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-sky-900 text-sm">Declaration of Novelty</p>
                                        <p className="text-xs text-sky-700">I confirm that this design is new, original, and has NOT been published or sold anywhere in the world before this date.</p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Upload Views</h2>
                            <p className="text-slate-500 mb-8">Upload clear images of the article.</p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'FRONT_VIEW', label: 'Front View' },
                                    { id: 'BACK_VIEW', label: 'Back View' },
                                    { id: 'SIDE_VIEW', label: 'Side View' },
                                    { id: 'TOP_VIEW', label: 'Top View' },
                                    { id: 'POA', label: 'Power of Authority (Optional)' }
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-sky-200 text-sky-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <Image size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-sky-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-sky-600 bg-sky-50 hover:bg-sky-100'}`}>
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
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-sky-700 transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Register Design'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Design Initiated!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We've received your Design Request for <strong>{formData.articleName}</strong>. We will identify the Locarno Class and review your images.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Total Fees</p>
                                <p className="text-4xl font-black text-[#2B3446]">₹4,999<span className="text-sm font-normal text-slate-400 block">+ Govt Fee</span></p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-sky-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyDesignRegistration;
