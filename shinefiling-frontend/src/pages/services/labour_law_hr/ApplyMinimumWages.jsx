import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, ChevronRight, Save, X } from 'lucide-react';
import { submitMinimumWages, uploadFile } from '../../../api';

const ApplyMinimumWages = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        establishmentName: '',
        establishmentType: 'Company',
        employerName: '',
        contactNumber: '',
        email: '',
        address: '',
        employeeCount: '',
    });
    const [documents, setDocuments] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isModal) return;
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                contactNumber: user.mobile || ''
            }));
        } else if (!isLoggedIn) {
            navigate('/login', { state: { from: `/services/labour-law/minimum-wages/apply` } });
        }
    }, [isLoggedIn, navigate, isModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e, docType) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const response = await uploadFile(file, 'minimum-wages');
                setDocuments(prev => ({
                    ...prev,
                    [docType]: {
                        name: response.originalName || file.name,
                        url: response.fileUrl,
                        type: docType
                    }
                }));
            } catch (err) {
                alert("File upload failed");
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const docsList = Object.values(documents).map(d => ({
                id: d.type,
                filename: d.name,
                fileUrl: d.url,
                type: d.type
            }));

            const payload = {
                ...formData,
                userEmail: formData.email,
                businessName: formData.establishmentName,
                status: "PAYMENT_SUCCESSFUL",
                formData: { ...formData },
                documents: docsList
            };

            await submitMinimumWages(payload);
            setIsSuccess(true);
        } catch (err) {
            setError(err.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={isModal ? "h-full overflow-y-auto bg-slate-50 relative pb-10 rounded-3xl" : "min-h-screen bg-slate-50 pb-12 pt-24"}>
            <div className={`bg-white border-b border-gray-200 ${isModal ? 'sticky top-0 z-40' : 'fixed top-0 left-0 right-0 z-50'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {!isModal ? (
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
                                <ArrowLeft size={20} />
                            </button>
                        ) : (
                            <div />
                        )}
                        <h1 className="text-lg font-bold text-slate-800">Minimum Wages Compliance</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                            Step {step} of 2
                        </div>
                        {isModal && (
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-3xl shadow-xl text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase tracking-tighter">Compliance Initiated!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
                                We've received your details for <strong>{formData.establishmentName}</strong>. Our legal experts will review your wage structures.
                            </p>
                            {isModal ? (
                                <button onClick={onClose} className="px-8 py-3 bg-slate-800 text-white font-black rounded-xl hover:bg-black transition uppercase tracking-widest">Close Window</button>
                            ) : (
                                <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-slate-800 text-white font-black rounded-xl hover:bg-black transition uppercase tracking-widest">Go to Dashboard</button>
                            )}
                        </motion.div>
                    ) : (
                        step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                        <FileText size={20} className="text-blue-600" /> Establishment Details
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Establishment Name</label>
                                            <input type="text" name="establishmentName" value={formData.establishmentName} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-800" placeholder="e.g. ABC Technologies Pvt Ltd" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type of Entity</label>
                                            <select name="establishmentType" value={formData.establishmentType} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-800 cursor-pointer">
                                                <option value="Company">Private Limited Company</option>
                                                <option value="Partnership">Partnership Firm</option>
                                                <option value="LLP">LLP</option>
                                                <option value="Proprietorship">Proprietorship</option>
                                                <option value="Trust">Trust / NGO</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employer Name</label>
                                            <input type="text" name="employerName" value={formData.employerName} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Count</label>
                                            <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-800" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Address</label>
                                            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-800 h-24 resize-none" placeholder="Full address with Pincode"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button onClick={() => setStep(2)} disabled={!formData.establishmentName || !formData.employerName} className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-black text-white font-black rounded-xl transition disabled:opacity-50 uppercase tracking-widest">
                                        Next Step <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                        <Upload size={20} className="text-blue-600" /> Document Upload
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium">Please upload clear copies of the following documents.</p>

                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'businessProof', label: 'Business Proof' },
                                            { id: 'panCard', label: 'PAN Card' },
                                            { id: 'addressProof', label: 'Address Proof' },
                                            { id: 'wageRegister', label: 'Wage Register / Salary Slips' }
                                        ].map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 transition group bg-white">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition font-bold ${documents[doc.id] ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {documents[doc.id] ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{doc.label}</p>
                                                        {documents[doc.id] && <p className="text-[10px] text-green-600 font-black mt-0.5 truncate max-w-[150px]">{documents[doc.id].name}</p>}
                                                    </div>
                                                </div>
                                                <label className="cursor-pointer px-4 py-2 bg-slate-800 text-white text-[10px] font-black rounded-lg hover:bg-black transition uppercase tracking-widest">
                                                    {documents[doc.id] ? 'Change' : 'Upload'}
                                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, doc.id)} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-500 font-black rounded-xl hover:bg-slate-50 transition uppercase tracking-widest text-xs">
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl transition disabled:opacity-50 shadow-lg shadow-green-600/20 uppercase tracking-widest">
                                        {loading ? 'Submitting...' : 'Submit Application'} {!loading && <Save size={18} />}
                                    </button>
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ApplyMinimumWages;
