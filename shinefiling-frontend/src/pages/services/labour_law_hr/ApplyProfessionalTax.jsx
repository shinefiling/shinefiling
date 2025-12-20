import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Receipt } from 'lucide-react';
import { uploadFile, submitProfessionalTax } from '../../../api';

const ApplyProfessionalTax = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        userEmail: user.email || '',
        businessName: '',

        // Form Data
        serviceType: 'BOTH',
        state: 'MAHARASHTRA',
        businessNature: '',
        employeeCount: '',
        salaryStructure: '',
        filingFrequency: 'MONTHLY',

        // Docs
        uploadedDocuments: []
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour-law/professional-tax/apply` } });
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
                const response = await uploadFile(file, 'professional-tax');
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
                submissionId: `PT-${Date.now()}`,
                userEmail: formData.userEmail,
                businessName: formData.businessName,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    serviceType: formData.serviceType,
                    state: formData.state,
                    businessNature: formData.businessNature,
                    employeeCount: formData.employeeCount,
                    salaryStructure: formData.salaryStructure,
                    filingFrequency: formData.filingFrequency
                },
                documents: formData.uploadedDocuments
            };

            await submitProfessionalTax(payload);
            setCurrentStep(3);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFee = () => {
        return formData.serviceType === 'BOTH' ? '₹2,999' : '₹1,999';
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#d97706] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-orange-200 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Receipt size={20} className="text-orange-300" /> Professional Tax</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-orange-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-orange-600 text-white' : 'bg-white border-2 border-orange-200 text-orange-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Business Details</h2>
                            <p className="text-slate-500 mb-8">State-wise PT compliance.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                                        <input type="text" name="businessName" value={formData.businessName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Service Type</label>
                                        <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="REGISTRATION">Registration Only</option>
                                            <option value="FILING">Filing Only</option>
                                            <option value="BOTH">Registration + Filing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="MAHARASHTRA">Maharashtra</option>
                                            <option value="KARNATAKA">Karnataka</option>
                                            <option value="TAMIL_NADU">Tamil Nadu</option>
                                            <option value="TELANGANA">Telangana</option>
                                            <option value="WEST_BENGAL">West Bengal</option>
                                            <option value="GUJARAT">Gujarat</option>
                                            <option value="ANDHRA_PRADESH">Andhra Pradesh</option>
                                            <option value="MADHYA_PRADESH">Madhya Pradesh</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Nature</label>
                                        <input type="text" name="businessNature" value={formData.businessNature} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. IT Services" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Employee Count</label>
                                        <input type="number" name="employeeCount" value={formData.employeeCount} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Filing Frequency</label>
                                        <select name="filingFrequency" value={formData.filingFrequency} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="QUARTERLY">Quarterly</option>
                                            <option value="ANNUAL">Annual</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Salary Structure (Basic Range)</label>
                                    <input type="text" name="salaryStructure" value={formData.salaryStructure} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="e.g. 15k-50k" />
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Upload Documents</h2>
                            <p className="text-slate-500 mb-8">Upload required compliance documents.</p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'PAN', label: 'Business PAN Card' },
                                    { id: 'ADDRESS_PROOF', label: 'Address Proof' },
                                    { id: 'BUSINESS_PROOF', label: 'Business Registration Proof' },
                                    { id: 'EMPLOYEE_LIST', label: 'Employee List (Excel)' },
                                    { id: 'SALARY_SHEET', label: 'Salary Sheet' }
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-orange-200 text-orange-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-orange-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`}>
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
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We've received your Professional Tax application for <strong>{formData.state}</strong>.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Service Fee</p>
                                <p className="text-4xl font-black text-[#2B3446]">{getFee()}</p>
                                <p className="text-xs text-slate-400 mt-2">{formData.serviceType === 'BOTH' ? 'Registration + Filing' : formData.serviceType}</p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyProfessionalTax;
