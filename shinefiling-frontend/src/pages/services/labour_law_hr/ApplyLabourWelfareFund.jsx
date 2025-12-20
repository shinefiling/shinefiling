import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Users, Plus, Trash2 } from 'lucide-react';
import { uploadFile, submitLabourWelfareFund } from '../../../api';

const ApplyLabourWelfareFund = ({ isLoggedIn }) => {
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
        state: 'TAMIL_NADU',
        businessType: 'COMPANY',
        employeeCount: '',
        filingType: 'ANNUAL_FILING',
        lwfRegistrationNumber: '',

        // Employees
        employees: [],

        // Docs
        uploadedDocuments: []
    });

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        salary: '',
        joiningDate: '',
        isEligible: true,
        isExempted: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour-law/labour-welfare-fund/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleEmployeeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewEmployee({ ...newEmployee, [name]: type === 'checkbox' ? checked : value });
    };

    const addEmployee = () => {
        if (newEmployee.name && newEmployee.salary && newEmployee.joiningDate) {
            setFormData({
                ...formData,
                employees: [...formData.employees, { ...newEmployee, id: Date.now() }]
            });
            setNewEmployee({
                name: '',
                salary: '',
                joiningDate: '',
                isEligible: true,
                isExempted: false
            });
        }
    };

    const removeEmployee = (id) => {
        setFormData({
            ...formData,
            employees: formData.employees.filter(emp => emp.id !== id)
        });
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'labour-welfare-fund');
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

    const calculateContributions = () => {
        // Simplified calculation - actual rates vary by state
        const eligibleEmployees = formData.employees.filter(emp => emp.isEligible && !emp.isExempted);
        const employerContribution = eligibleEmployees.length * 20; // Example: ₹20 per employee
        const employeeContribution = eligibleEmployees.length * 10; // Example: ₹10 per employee
        return {
            employer: employerContribution,
            employee: employeeContribution,
            total: employerContribution + employeeContribution
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const contributions = calculateContributions();

            const payload = {
                submissionId: `LWF-${Date.now()}`,
                userEmail: formData.userEmail,
                businessName: formData.businessName,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    state: formData.state,
                    businessType: formData.businessType,
                    employeeCount: formData.employeeCount,
                    filingType: formData.filingType,
                    lwfRegistrationNumber: formData.lwfRegistrationNumber || null,
                    employerContribution: contributions.employer,
                    employeeContribution: contributions.employee,
                    totalContribution: contributions.total
                },
                employees: formData.employees,
                documents: formData.uploadedDocuments
            };

            await submitLabourWelfareFund(payload);
            setCurrentStep(4);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFee = () => {
        return formData.filingType === 'REGISTRATION' ? '₹2,499' : '₹1,999';
    };

    return (
        <div className="min-h-screen bg-[#F0FFF4] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#059669] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-200 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Users size={20} className="text-emerald-300" /> Labour Welfare Fund</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-emerald-200 -z-10"></div>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-emerald-200 text-emerald-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Establishment Details</h2>
                            <p className="text-slate-500 mb-8">State-wise LWF compliance.</p>

                            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                                        <input type="text" name="businessName" value={formData.businessName} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Business Type</label>
                                        <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="COMPANY">Private Limited Company</option>
                                            <option value="LLP">LLP</option>
                                            <option value="PARTNERSHIP">Partnership</option>
                                            <option value="PROPRIETORSHIP">Proprietorship</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="TAMIL_NADU">Tamil Nadu</option>
                                            <option value="MAHARASHTRA">Maharashtra</option>
                                            <option value="KARNATAKA">Karnataka</option>
                                            <option value="ANDHRA_PRADESH">Andhra Pradesh</option>
                                            <option value="TELANGANA">Telangana</option>
                                            <option value="GUJARAT">Gujarat</option>
                                            <option value="DELHI">Delhi</option>
                                            <option value="PUNJAB">Punjab</option>
                                            <option value="HARYANA">Haryana</option>
                                            <option value="MADHYA_PRADESH">Madhya Pradesh</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Filing Type</label>
                                        <select name="filingType" value={formData.filingType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="REGISTRATION">Registration</option>
                                            <option value="ANNUAL_FILING">Annual Filing</option>
                                            <option value="HALF_YEARLY">Half-Yearly Filing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Employee Count</label>
                                        <input type="number" name="employeeCount" value={formData.employeeCount} required className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">LWF Registration Number (if already registered)</label>
                                        <input type="text" name="lwfRegistrationNumber" value={formData.lwfRegistrationNumber} className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="Optional" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Employee Details</h2>
                            <p className="text-slate-500 mb-8">Add employee information for LWF calculation.</p>

                            <div className="space-y-6">
                                {/* Add Employee Form */}
                                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                                    <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                        <Plus size={18} /> Add Employee
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <input
                                            type="text"
                                            name="name"
                                            value={newEmployee.name}
                                            onChange={handleEmployeeChange}
                                            placeholder="Employee Name"
                                            className="p-3 border border-emerald-300 rounded-lg"
                                        />
                                        <input
                                            type="number"
                                            name="salary"
                                            value={newEmployee.salary}
                                            onChange={handleEmployeeChange}
                                            placeholder="Monthly Salary"
                                            className="p-3 border border-emerald-300 rounded-lg"
                                        />
                                        <input
                                            type="date"
                                            name="joiningDate"
                                            value={newEmployee.joiningDate}
                                            onChange={handleEmployeeChange}
                                            className="p-3 border border-emerald-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="flex gap-4 mb-4">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                name="isEligible"
                                                checked={newEmployee.isEligible}
                                                onChange={handleEmployeeChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="font-medium">Eligible for LWF</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                name="isExempted"
                                                checked={newEmployee.isExempted}
                                                onChange={handleEmployeeChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="font-medium">Exempted</span>
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addEmployee}
                                        className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
                                    >
                                        Add Employee
                                    </button>
                                </div>

                                {/* Employee List */}
                                {formData.employees.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-slate-700 mb-3">Added Employees ({formData.employees.length})</h3>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {formData.employees.map((emp) => (
                                                <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm">{emp.name}</p>
                                                        <p className="text-xs text-slate-500">Salary: ₹{emp.salary} | Joined: {emp.joiningDate}</p>
                                                        {emp.isExempted && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Exempted</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => removeEmployee(emp.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6">
                                    <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(3)}
                                        disabled={formData.employees.length === 0}
                                        className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next Step
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Upload Documents</h2>
                            <p className="text-slate-500 mb-8">Upload required documents.</p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { id: 'PAN', label: 'Business PAN Card' },
                                    { id: 'GST_CIN', label: 'GST Certificate / CIN / LLPIN' },
                                    { id: 'ADDRESS_PROOF', label: 'Address Proof of Establishment' },
                                    { id: 'EMPLOYEE_LIST', label: 'Employee List (Excel)' }
                                ].map((doc, i) => {
                                    const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                    return (
                                        <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-emerald-200 text-emerald-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                    {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block ${uploadedDoc ? 'text-emerald-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                    {uploadingFiles[doc.id] ? (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                    ) : uploadedDoc ? (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">Attached</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}>
                                                {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                                <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Contribution Summary */}
                            {formData.employees.length > 0 && (
                                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 mb-6">
                                    <h3 className="font-bold text-emerald-900 mb-4">Contribution Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Eligible Employees:</span>
                                            <span className="font-bold">{formData.employees.filter(e => e.isEligible && !e.isExempted).length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Employer Contribution:</span>
                                            <span className="font-bold">₹{calculateContributions().employer}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Employee Contribution:</span>
                                            <span className="font-bold">₹{calculateContributions().employee}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-emerald-300">
                                            <span className="font-bold">Total Contribution:</span>
                                            <span className="font-bold text-lg text-emerald-700">₹{calculateContributions().total}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-6 border border-red-200 flex items-center gap-2"><AlertTriangle size={18} /> {error}</div>}

                            <div className="flex gap-4">
                                <button onClick={() => setCurrentStep(2)} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">
                                    Back
                                </button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition flex justify-center items-center">
                                    {loading ? 'Processing...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We've received your Labour Welfare Fund application for <strong>{formData.state}</strong> with <strong>{formData.employees.length}</strong> employees.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Service Fee</p>
                                <p className="text-4xl font-black text-[#2B3446]">{getFee()}</p>
                                <p className="text-xs text-slate-400 mt-2">{formData.filingType.replace('_', ' ')}</p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyLabourWelfareFund;
