import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Copyright, Globe } from 'lucide-react';
import { uploadFile, submitTrademarkRegistration } from '../../../api'; // ensure in api.js

const ApplyTrademarkRegistration = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    // User data form local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        brandName: '',
        applicantType: 'INDIVIDUAL', // INDIVIDUAL, STARTUP, SMALL_ENTERPRISE, OTHERS

        // Form Data
        trademarkType: 'WORDMARK', // WORDMARK, LOGO
        classNumber: '',
        goodsDescription: '',
        ownerName: '',
        ownerAddress: '',
        isUseDateClean: true, // True = Proposed to be used

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/intellectual-property/trademark-registration/apply` } });
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
                const response = await uploadFile(file, 'trademark');
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
                submissionId: `TM-${Date.now()}`,
                userEmail: formData.userEmail,
                brandName: formData.brandName,
                applicantType: formData.applicantType,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    trademarkType: formData.trademarkType,
                    classNumber: formData.classNumber,
                    goodsDescription: formData.goodsDescription,
                    ownerName: formData.ownerName,
                    ownerAddress: formData.ownerAddress,
                    isUseDateClean: formData.isUseDateClean
                },
                documents: formData.uploadedDocuments
            };

            await submitTrademarkRegistration(payload);
            setCurrentStep(3); // Success
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getGovtFee = () => {
        if (['INDIVIDUAL', 'STARTUP', 'SMALL_ENTERPRISE'].includes(formData.applicantType)) return '₹4,500';
        return '₹9,000';
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#2B3446] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Copyright size={20} className="text-blue-400" /> Trademark Application</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-[#2B3446] text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Mark Details</h2>
                            <p className="text-slate-500 mb-8">Identify your brand and class.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Brand Name</label>
                                        <input type="text" name="brandName" value={formData.brandName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. NIKE" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Type of Mark</label>
                                        <select name="trademarkType" value={formData.trademarkType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="WORDMARK">Wordmark (Text only)</option>
                                            <option value="LOGO">Device / Logo</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Applicant Category (Fee Decider)</label>
                                    <select name="applicantType" value={formData.applicantType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg font-medium text-slate-800">
                                        <option value="INDIVIDUAL">Individual / Proprietor (₹4500 Fee)</option>
                                        <option value="STARTUP">Startup (Reg. with DPIIT) (₹4500 Fee)</option>
                                        <option value="SMALL_ENTERPRISE">Small Enterprise (MSME) (₹4500 Fee)</option>
                                        <option value="OTHERS">Company / LLP / Others (₹9000 Fee)</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Class (1-45)</label>
                                        <input type="number" name="classNumber" value={formData.classNumber} min="1" max="45" placeholder="e.g. 25" required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div className="flex items-center">
                                        <a href="https://tmrsearch.ipindia.gov.in/tmrpublicsearch/" target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm font-bold">Search Class Here</a>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description of Goods/Services</label>
                                    <textarea name="goodsDescription" rows="2" value={formData.goodsDescription} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. Clothing, footwear, headgear"></textarea>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Owner & Docs</h2>
                            <p className="text-slate-500 mb-8">Proof of ownership and identity.</p>

                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer p-4 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition">
                                    <input type="checkbox" name="isUseDateClean" checked={formData.isUseDateClean} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                                    <div>
                                        <span className="text-slate-800 font-bold block">Proposed to be used? (New Brand)</span>
                                        <span className="text-xs text-slate-500">Uncheck if you have been using this brand for years (Requires Affidavit).</span>
                                    </div>
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Owner Name</label>
                                    <input type="text" name="ownerName" value={formData.ownerName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Address</label>
                                    <input type="text" name="ownerAddress" value={formData.ownerAddress} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'PAN_CARD', label: 'Identity Proof (PAN Card)' },
                                    { id: 'AADHAAR_CARD', label: 'Address Proof (Aadhaar)' },
                                    ...(formData.trademarkType === 'LOGO' ? [{ id: 'LOGO_IMAGE', label: 'High Res Logo (JPEG/PNG)' }] : []),
                                    ...(formData.applicantType === 'SMALL_ENTERPRISE' ? [{ id: 'UDYAM_REGISTRATION', label: 'Udyam Registration Certificate' }] : []),
                                    ...(formData.applicantType === 'STARTUP' ? [{ id: 'STARTUP_CERT', label: 'Startup India Certificate' }] : []),
                                    ...(formData.applicantType === 'OTHERS' ? [{ id: 'INCORPORATION_CERT', label: 'Company Incorporation Cert' }] : [])
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-blue-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
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
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-[#2B3446] text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We have received your trademark request for <strong>{formData.brandName}</strong>. A trademark attorney will verify your class.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Estimated Cost</p>
                                <p className="text-4xl font-black text-[#2B3446]">₹1,999<span className="text-sm font-normal text-slate-400 block">+ Govt Fee ({getGovtFee()})</span></p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyTrademarkRegistration;
