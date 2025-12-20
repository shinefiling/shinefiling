import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { uploadFile, submitGratuityAct } from '../../../api';

const ApplyGratuityAct = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});
    const [eligibilityWarning, setEligibilityWarning] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        businessName: '',

        // Form Data
        establishmentType: 'COMPANY',
        dateOfCommencement: '',
        employeeCount: '',
        state: 'MAHARASHTRA',
        labourOfficeJurisdiction: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        pincode: '',
        employerName: '',
        employerDesignation: '',
        hasFactoryLicense: false,
        hasShopActLicense: false,

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour-law/gratuity-act/apply` } });
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        // Check eligibility when employee count changes
        if (formData.employeeCount) {
            const count = parseInt(formData.employeeCount);
            if (count < 10) {
                setEligibilityWarning('⚠️ Gratuity Act registration requires minimum 10 employees. Your application may be rejected.');
            } else {
                setEligibilityWarning('');
            }
        }
    }, [formData.employeeCount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'gratuity-act');
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
                submissionId: `GRA-${Date.now()}`,
                userEmail: formData.userEmail,
                businessName: formData.businessName,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    establishmentType: formData.establishmentType,
                    dateOfCommencement: formData.dateOfCommencement,
                    employeeCount: formData.employeeCount,
                    state: formData.state,
                    labourOfficeJurisdiction: formData.labourOfficeJurisdiction,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    pincode: formData.pincode,
                    employerName: formData.employerName,
                    employerDesignation: formData.employerDesignation,
                    hasFactoryLicense: formData.hasFactoryLicense,
                    hasShopActLicense: formData.hasShopActLicense
                },
                documents: formData.uploadedDocuments
            };

            await submitGratuityAct(payload);
            setCurrentStep(3);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F5] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#dc2626] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-red-200 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Shield size={20} className="text-red-300" /> Gratuity Act Registration</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-red-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-red-600 text-white' : 'bg-white border-2 border-red-200 text-red-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Establishment Details</h2>
                            <p className="text-slate-500 mb-8">As per Payment of Gratuity Act, 1972.</p>

                            {eligibilityWarning && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-yellow-800">{eligibilityWarning}</p>
                                </div>
                            )}

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Name *</label>
                                        <input type="text" name="businessName" value={formData.businessName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Establishment Type *</label>
                                        <select name="establishmentType" value={formData.establishmentType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="COMPANY">Company</option>
                                            <option value="LLP">LLP</option>
                                            <option value="FACTORY">Factory</option>
                                            <option value="SHOP">Shop & Establishment</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Date of Commencement *</label>
                                        <input type="date" name="dateOfCommencement" value={formData.dateOfCommencement} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Total Employee Count *</label>
                                        <input type="number" name="employeeCount" value={formData.employeeCount} required min="1" className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="Minimum 10 required" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State *</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="MAHARASHTRA">Maharashtra</option>
                                            <option value="KARNATAKA">Karnataka</option>
                                            <option value="TAMIL_NADU">Tamil Nadu</option>
                                            <option value="DELHI">Delhi</option>
                                            <option value="GUJARAT">Gujarat</option>
                                            <option value="WEST_BENGAL">West Bengal</option>
                                            <option value="TELANGANA">Telangana</option>
                                            <option value="ANDHRA_PRADESH">Andhra Pradesh</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Labour Office Jurisdiction</label>
                                        <input type="text" name="labourOfficeJurisdiction" value={formData.labourOfficeJurisdiction} className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. Mumbai Central" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Address Line 1 *</label>
                                    <input type="text" name="addressLine1" value={formData.addressLine1} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Address Line 2</label>
                                        <input type="text" name="addressLine2" value={formData.addressLine2} className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                                        <input type="text" name="city" value={formData.city} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Pincode *</label>
                                        <input type="text" name="pincode" value={formData.pincode} required pattern="[0-9]{6}" className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="6 digits" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Employer Name *</label>
                                        <input type="text" name="employerName" value={formData.employerName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Employer Designation *</label>
                                        <input type="text" name="employerDesignation" value={formData.employerDesignation} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. Director, Proprietor" />
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" name="hasFactoryLicense" checked={formData.hasFactoryLicense} onChange={handleChange} className="w-4 h-4" />
                                        <span className="text-sm font-medium">Has Factory License</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" name="hasShopActLicense" checked={formData.hasShopActLicense} onChange={handleChange} className="w-4 h-4" />
                                        <span className="text-sm font-medium">Has Shop Act License</span>
                                    </label>
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
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Upload Documents</h2>
                            <p className="text-slate-500 mb-8">Upload all mandatory documents for registration.</p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'COI', label: 'Certificate of Incorporation / Registration *', required: true },
                                    { id: 'PAN', label: 'PAN Card of Establishment *', required: true },
                                    { id: 'ADDRESS_PROOF', label: 'Address Proof *', required: true },
                                    { id: 'FACTORY_LICENSE', label: 'Factory License (if applicable)', required: formData.hasFactoryLicense },
                                    { id: 'SHOP_LICENSE', label: 'Shop Act License (if applicable)', required: formData.hasShopActLicense },
                                    { id: 'EMPLOYER_ID', label: 'Employer ID Proof *', required: true }
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
                                    {loading ? 'Processing...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We've received your Gratuity Act registration application for <strong>{formData.businessName}</strong> with <strong>{formData.employeeCount}</strong> employees.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Service Fee</p>
                                <p className="text-4xl font-black text-[#2B3446]">₹2,999</p>
                                <p className="text-xs text-slate-400 mt-2">Gratuity Act Registration</p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6 max-w-md mx-auto">
                                <p className="text-sm text-blue-800">
                                    <strong>Next Steps:</strong> Our team will prepare Form A and file with the Labour Department. You'll receive updates via email.
                                </p>
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

export default ApplyGratuityAct;
