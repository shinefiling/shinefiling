import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload, AlertTriangle, FileText, ArrowRight, CreditCard, Award, AlertCircle, Plus, Trash2, Calculator } from 'lucide-react';
import { uploadFile, submitBonusAct } from '../../../api';

const ApplyBonusAct = ({ isLoggedIn }) => {
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
        companyType: 'COMPANY',
        state: 'MAHARASHTRA',
        employeeCount: '',
        financialYear: '2023-2024',
        bonusPercentage: '8.33',
        allocableSurplus: '',
        totalBonusPayable: '',
        paymentMode: 'BANK',
        paymentDate: '',

        // Employees
        employees: [],

        // Docs
        uploadedDocuments: []
    });

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        employeeId: '',
        basicSalary: '',
        daAmount: '',
        workingDays: '365',
        isEligible: true,
        bonusAmount: 0
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour-law/bonus-act/apply` } });
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (formData.employeeCount) {
            const count = parseInt(formData.employeeCount);
            if (count < 20) {
                setEligibilityWarning('⚠️ Bonus Act applies to establishments with 20+ employees. Your application may not be applicable.');
            } else {
                setEligibilityWarning('');
            }
        }
    }, [formData.employeeCount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleEmployeeChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        const updatedEmployee = { ...newEmployee, [name]: newValue };

        // Auto-calculate eligibility based on salary
        if (name === 'basicSalary' || name === 'daAmount') {
            const basic = parseFloat(updatedEmployee.basicSalary || 0);
            const da = parseFloat(updatedEmployee.daAmount || 0);
            const totalSalary = basic + da;
            updatedEmployee.isEligible = totalSalary <= 21000;
        }

        setNewEmployee(updatedEmployee);
    };

    const calculateBonus = (employee) => {
        const basic = parseFloat(employee.basicSalary || 0);
        const da = parseFloat(employee.daAmount || 0);
        const workingDays = parseFloat(employee.workingDays || 365);
        const bonusPercentage = parseFloat(formData.bonusPercentage || 8.33);

        const annualSalary = (basic + da) * 12;
        const bonusAmount = (annualSalary * bonusPercentage) / 100;
        const proportionateBonus = (bonusAmount * workingDays) / 365;

        return proportionateBonus.toFixed(2);
    };

    const addEmployee = () => {
        if (newEmployee.name && newEmployee.basicSalary) {
            const bonusAmount = calculateBonus(newEmployee);
            setFormData({
                ...formData,
                employees: [...formData.employees, { ...newEmployee, bonusAmount, id: Date.now() }]
            });
            setNewEmployee({
                name: '',
                employeeId: '',
                basicSalary: '',
                daAmount: '',
                workingDays: '365',
                isEligible: true,
                bonusAmount: 0
            });
        }
    };

    const removeEmployee = (id) => {
        setFormData({
            ...formData,
            employees: formData.employees.filter(emp => emp.id !== id)
        });
    };

    const calculateTotalBonus = () => {
        return formData.employees
            .filter(emp => emp.isEligible)
            .reduce((sum, emp) => sum + parseFloat(emp.bonusAmount || 0), 0)
            .toFixed(2);
    };

    const handleFileChange = async (docType, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingFiles(prev => ({ ...prev, [docType]: true }));

            try {
                const response = await uploadFile(file, 'bonus-act');
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
            const totalBonus = calculateTotalBonus();

            const payload = {
                submissionId: `BON-${Date.now()}`,
                userEmail: formData.userEmail,
                businessName: formData.businessName,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    companyType: formData.companyType,
                    state: formData.state,
                    employeeCount: formData.employeeCount,
                    financialYear: formData.financialYear,
                    bonusPercentage: formData.bonusPercentage,
                    allocableSurplus: formData.allocableSurplus,
                    totalBonusPayable: totalBonus,
                    paymentMode: formData.paymentMode,
                    paymentDate: formData.paymentDate,
                    hasMinimum20Employees: parseInt(formData.employeeCount) >= 20
                },
                employees: formData.employees,
                documents: formData.uploadedDocuments
            };

            await submitBonusAct(payload);
            setCurrentStep(4);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFee = () => {
        const count = parseInt(formData.employeeCount || 0);
        return count >= 50 ? '₹3,999' : '₹2,499';
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] font-sans pt-24 pb-24">
            {/* Header */}
            <div className="bg-[#f59e0b] text-white py-6 px-6 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-200 hover:text-white transition">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Award size={20} className="text-amber-300" /> Bonus Act Compliance</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-amber-200 -z-10"></div>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= s ? 'bg-amber-600 text-white' : 'bg-white border-2 border-amber-200 text-amber-400'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">

                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Company Details</h2>
                            <p className="text-slate-500 mb-8">As per Payment of Bonus Act, 1965.</p>

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
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Company Type *</label>
                                        <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="COMPANY">Private Limited Company</option>
                                            <option value="LLP">LLP</option>
                                            <option value="PARTNERSHIP">Partnership Firm</option>
                                            <option value="FACTORY">Factory</option>
                                            <option value="SHOP">Shop & Establishment</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">State *</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="MAHARASHTRA">Maharashtra</option>
                                            <option value="KARNATAKA">Karnataka</option>
                                            <option value="TAMIL_NADU">Tamil Nadu</option>
                                            <option value="DELHI">Delhi</option>
                                            <option value="GUJARAT">Gujarat</option>
                                            <option value="WEST_BENGAL">West Bengal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Total Employees *</label>
                                        <input type="number" name="employeeCount" value={formData.employeeCount} required min="1" className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="Minimum 20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Financial Year *</label>
                                        <select name="financialYear" value={formData.financialYear} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                            <option value="2023-2024">2023-2024</option>
                                            <option value="2022-2023">2022-2023</option>
                                            <option value="2021-2022">2021-2022</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Bonus Percentage (%) *</label>
                                        <input type="number" name="bonusPercentage" value={formData.bonusPercentage} required min="8.33" max="20" step="0.01" className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="8.33 - 20%" />
                                        <p className="text-xs text-slate-500 mt-1">Minimum: 8.33% | Maximum: 20%</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Allocable Surplus (₹)</label>
                                        <input type="number" name="allocableSurplus" value={formData.allocableSurplus} className="w-full p-3 border border-slate-300 rounded-lg" onChange={handleChange} placeholder="From P&L Statement" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Employee & Payroll Data</h2>
                            <p className="text-slate-500 mb-8">Add eligible employees (Salary ≤ ₹21,000/month).</p>

                            <div className="space-y-6">
                                {/* Add Employee Form */}
                                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                                    <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                                        <Plus size={18} /> Add Employee
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <input
                                            type="text"
                                            name="name"
                                            value={newEmployee.name}
                                            onChange={handleEmployeeChange}
                                            placeholder="Employee Name"
                                            className="p-3 border border-amber-300 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={newEmployee.employeeId}
                                            onChange={handleEmployeeChange}
                                            placeholder="Employee ID"
                                            className="p-3 border border-amber-300 rounded-lg"
                                        />
                                        <input
                                            type="number"
                                            name="basicSalary"
                                            value={newEmployee.basicSalary}
                                            onChange={handleEmployeeChange}
                                            placeholder="Basic Salary (₹)"
                                            className="p-3 border border-amber-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <input
                                            type="number"
                                            name="daAmount"
                                            value={newEmployee.daAmount}
                                            onChange={handleEmployeeChange}
                                            placeholder="DA Amount (₹)"
                                            className="p-3 border border-amber-300 rounded-lg"
                                        />
                                        <input
                                            type="number"
                                            name="workingDays"
                                            value={newEmployee.workingDays}
                                            onChange={handleEmployeeChange}
                                            placeholder="Working Days"
                                            className="p-3 border border-amber-300 rounded-lg"
                                        />
                                        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-amber-300">
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    name="isEligible"
                                                    checked={newEmployee.isEligible}
                                                    onChange={handleEmployeeChange}
                                                    className="w-4 h-4"
                                                />
                                                <span className="font-medium">Eligible (≤₹21k)</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addEmployee}
                                        className="w-full py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition"
                                    >
                                        Add Employee
                                    </button>
                                </div>

                                {/* Employee List */}
                                {formData.employees.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <Calculator size={18} />
                                            Added Employees ({formData.employees.length}) - Total Bonus: ₹{calculateTotalBonus()}
                                        </h3>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {formData.employees.map((emp) => (
                                                <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm">{emp.name} ({emp.employeeId})</p>
                                                        <p className="text-xs text-slate-500">
                                                            Basic: ₹{emp.basicSalary} | DA: ₹{emp.daAmount} | Days: {emp.workingDays} | <strong className="text-amber-700">Bonus: ₹{emp.bonusAmount}</strong>
                                                        </p>
                                                        {!emp.isEligible && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Not Eligible (Salary \u003e ₹21k)</span>}
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
                                        className="flex-1 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next Step
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-[#2B3446] mb-2">Upload Documents & Payment Details</h2>
                            <p className="text-slate-500 mb-8">Upload required documents and confirm payment details.</p>

                            <div className="space-y-6">
                                {/* Payment Details */}
                                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                                    <h3 className="font-bold text-amber-900 mb-4">Payment Details</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Payment Mode *</label>
                                            <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full p-3 border border-amber-300 rounded-lg">
                                                <option value="BANK">Bank Transfer</option>
                                                <option value="CASH">Cash (if applicable)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Payment Date *</label>
                                            <input type="date" name="paymentDate" value={formData.paymentDate} required className="w-full p-3 border border-amber-300 rounded-lg" onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Document Upload */}
                                <div className="space-y-4">
                                    {[
                                        { id: 'EMPLOYEE_LIST', label: 'Employee List (Excel) *' },
                                        { id: 'SALARY_SHEET', label: 'Salary Sheet (Basic + DA) *' },
                                        { id: 'PL_STATEMENT', label: 'P&L Statement (for Allocable Surplus) *' },
                                        { id: 'PAYMENT_PROOF', label: 'Payment Proof / Bank Statement' }
                                    ].map((doc, i) => {
                                        const uploadedDoc = formData.uploadedDocuments.find(d => d.type === doc.id);
                                        return (
                                            <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${uploadedDoc ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg border ${uploadedDoc ? 'bg-white border-amber-200 text-amber-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                        {uploadedDoc ? <CheckCircle size={20} /> : <FileText size={20} />}
                                                    </div>
                                                    <div>
                                                        <span className={`font-bold text-sm block ${uploadedDoc ? 'text-amber-800' : 'text-slate-700'}`}>{doc.label}</span>
                                                        {uploadingFiles[doc.id] ? (
                                                            <span className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</span>
                                                        ) : uploadedDoc ? (
                                                            <span className="text-xs text-green-600 font-medium">Attached</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <label className={`cursor-pointer text-sm font-bold px-4 py-2 rounded-lg transition-all ${uploadingFiles[doc.id] ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500' : uploadedDoc ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-amber-600 bg-amber-50 hover:bg-amber-100'}`}>
                                                    {uploadingFiles[doc.id] ? '...' : uploadedDoc ? 'Change' : 'Upload'}
                                                    <input type="file" className="hidden" disabled={uploadingFiles[doc.id]} onChange={(e) => handleFileChange(doc.id, e)} />
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Bonus Summary */}
                                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                    <h3 className="font-bold text-green-900 mb-4">Bonus Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Eligible Employees:</span>
                                            <span className="font-bold">{formData.employees.filter(e => e.isEligible).length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Bonus Percentage:</span>
                                            <span className="font-bold">{formData.bonusPercentage}%</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-green-300">
                                            <span className="font-bold">Total Bonus Payable:</span>
                                            <span className="font-bold text-lg text-green-700">₹{calculateTotalBonus()}</span>
                                        </div>
                                    </div>
                                </div>

                                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 flex items-center gap-2"><AlertTriangle size={18} /> {error}</div>}

                                <div className="flex gap-4">
                                    <button onClick={() => setCurrentStep(2)} className="flex-1 py-4 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">
                                        Back
                                    </button>
                                    <button onClick={handleSubmit} disabled={loading || !formData.paymentDate} className="flex-1 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:bg-amber-700 transition flex justify-center items-center disabled:opacity-50">
                                        {loading ? 'Processing...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-[#2B3446] mb-4">Compliance Submitted!</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                We've received your Bonus Act compliance for <strong>{formData.businessName}</strong> (FY {formData.financialYear}) with <strong>{formData.employees.length}</strong> employees.
                            </p>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 max-w-xs mx-auto">
                                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Service Fee</p>
                                <p className="text-4xl font-black text-[#2B3446]">{getFee()}</p>
                                <p className="text-xs text-slate-400 mt-2">Bonus Act Compliance</p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6 max-w-md mx-auto">
                                <p className="text-sm text-blue-800">
                                    <strong>Next Steps:</strong> Our team will prepare Statutory Registers (A, B, C) and verify payment compliance. You'll receive all documents via email.
                                </p>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="w-full max-w-xs py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:bg-amber-700 transition flex items-center justify-center gap-2 mx-auto">
                                <CreditCard size={18} /> Proceed to Dashboard
                            </button>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplyBonusAct;
