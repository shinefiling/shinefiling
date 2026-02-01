import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, AlertTriangle, Users, Plus, Trash2
} from 'lucide-react';
import { uploadFile, submitLabourWelfareFund } from '../../../api';

const ApplyLabourWelfareFund = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('standard');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/labour/labour-welfare-fund/apply` } });
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) setPlanType(plan);
    }, [searchParams]);

    const [formData, setFormData] = useState({
        businessName: '',
        state: 'TAMIL_NADU',
        businessType: 'COMPANY',
        employeeCount: '',
        filingType: 'ANNUAL_FILING',
        lwfRegistrationNumber: '',
        employees: []
    });

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        salary: '',
        joiningDate: '',
        isEligible: true,
        isExempted: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const getFee = () => {
        return formData.filingType === 'REGISTRATION' ? 2499 : 1999;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
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

    const calculateContributions = () => {
        // Simplified calculation
        const eligibleEmployees = formData.employees.filter(emp => emp.isEligible && !emp.isExempted);
        const employerContribution = eligibleEmployees.length * 20;
        const employeeContribution = eligibleEmployees.length * 10;
        return {
            employer: employerContribution,
            employee: employeeContribution,
            total: employerContribution + employeeContribution
        };
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Establishment Details
            if (!formData.businessName) { newErrors.businessName = "Business Name required"; isValid = false; }
            if (!formData.employeeCount) { newErrors.employeeCount = "Employee count required"; isValid = false; }
        }

        if (step === 2) { // Employees
            if (formData.employees.length === 0) {
                setApiError("Please add at least one employee.");
                return false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        setApiError(null);
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'labour-welfare-fund');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
            setApiError(null);
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Establishment Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Users size={20} className="text-emerald-500" /> ESTABLISHMENT DETAILS
                            </h3>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">Business Name</label>
                                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. ABC Pvt Ltd" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">State</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
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
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Business Type</label>
                                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="COMPANY">Private Limited Company</option>
                                        <option value="LLP">LLP</option>
                                        <option value="PARTNERSHIP">Partnership</option>
                                        <option value="PROPRIETORSHIP">Proprietorship</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Employee Count</label>
                                    <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.employeeCount ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. 50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Filing Type</label>
                                    <select name="filingType" value={formData.filingType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="REGISTRATION">Registration</option>
                                        <option value="ANNUAL_FILING">Annual Filing</option>
                                        <option value="HALF_YEARLY">Half-Yearly Filing</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-xs font-bold text-gray-500 block mb-1">LWF Registration Number (if applicable)</label>
                                <input type="text" name="lwfRegistrationNumber" value={formData.lwfRegistrationNumber} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" placeholder="Optional" />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Add Employees
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Plus size={20} className="text-emerald-500" /> ADD EMPLOYEES
                            </h3>

                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
                                <div className="grid md:grid-cols-3 gap-3 mb-3">
                                    <input type="text" name="name" value={newEmployee.name} onChange={handleEmployeeChange} placeholder="Employee Name" className="p-2 border border-emerald-200 rounded-lg text-sm" />
                                    <input type="number" name="salary" value={newEmployee.salary} onChange={handleEmployeeChange} placeholder="Salary" className="p-2 border border-emerald-200 rounded-lg text-sm" />
                                    <input type="date" name="joiningDate" value={newEmployee.joiningDate} onChange={handleEmployeeChange} className="p-2 border border-emerald-200 rounded-lg text-sm" />
                                </div>
                                <div className="flex gap-4 mb-3">
                                    <label className="flex items-center gap-2 text-xs font-bold text-emerald-800"><input type="checkbox" name="isEligible" checked={newEmployee.isEligible} onChange={handleEmployeeChange} /> Eligible</label>
                                    <label className="flex items-center gap-2 text-xs font-bold text-emerald-800"><input type="checkbox" name="isExempted" checked={newEmployee.isExempted} onChange={handleEmployeeChange} /> Exempted</label>
                                </div>
                                <button type="button" onClick={addEmployee} className="w-full py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition">Add Employee</button>
                            </div>

                            {formData.employees.length > 0 && (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {formData.employees.map((emp) => (
                                        <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                            <div>
                                                <p className="font-bold">{emp.name}</p>
                                                <p className="text-xs text-slate-500">₹{emp.salary} | Joined: {emp.joiningDate}</p>
                                            </div>
                                            <button onClick={() => removeEmployee(emp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-emerald-500" /> REQUIRED DOCUMENTS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'PAN', label: 'Business PAN' },
                                    { id: 'GST_CIN', label: 'GST / CIN / LLPIN' },
                                    { id: 'ADDRESS_PROOF', label: 'Address Proof' },
                                    { id: 'EMPLOYEE_LIST', label: 'Employee List (Excel)' }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-6 rounded-xl text-center group hover:border-emerald-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">{doc.label}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png,.xlsx" />
                                            {uploadedFiles[doc.id] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles[doc.id].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contribution Summary */}
                        {formData.employees.length > 0 && (
                            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                                <h3 className="font-bold text-emerald-900 mb-4 text-sm uppercase tracking-wide">Contribution Estimate</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Employer Contribution</span> <span className="font-bold">₹{calculateContributions().employer}</span></div>
                                    <div className="flex justify-between"><span>Employee Contribution</span> <span className="font-bold">₹{calculateContributions().employee}</span></div>
                                    <div className="flex justify-between pt-2 border-t border-emerald-300"><span className="font-bold">Total LWF Due</span> <span className="font-bold text-lg text-emerald-700">₹{calculateContributions().total}</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Professional Fee for {formData.state}</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-lg font-bold text-[#2B3446]">₹{getFee()}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-end">
                                <span className="font-black text-gray-700">Total</span>
                                <span className="text-3xl font-black text-emerald-600">₹{getFee()}</span>
                            </div>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );

            default: return null;
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const contributions = calculateContributions();
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl,
                type: k
            }));

            const finalPayload = {
                submissionId: `LWF-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                businessName: formData.businessName,
                plan: planType,
                amountPaid: getFee(),
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
                documents: docsList
            };

            await submitLabourWelfareFund(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0FFF4] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        We have received your Labour Welfare Fund details for <b>{formData.state}</b>.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Labour Welfare Fund</h1>
                        <p className="text-gray-500">LWF Registration & Compliance</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Establishment', 'Employees', 'Documents', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-emerald-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                                <strong>Service Fee:</strong> <br />
                                <span className="text-lg font-bold">{formData.filingType.replace('_', ' ')}</span>
                                <div className="mt-2 text-xl font-black text-emerald-900">₹{getFee()}</div>
                                <div className="text-[10px] text-emerald-600 mt-1 opacity-75">Professional Fees</div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {apiError && (
                                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {!isSuccess && currentStep < 4 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>

                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyLabourWelfareFund;
