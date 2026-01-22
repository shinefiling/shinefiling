import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, FileText, ChevronRight, Save, Building, Users, CreditCard, Lock, RefreshCw, Smartphone } from 'lucide-react';
import { submitMSMERegistration } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const ApplyMSMERegistration = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Steps: 1-Service Selection, 2-Business Details, 3-OTP Auth, 4-Final Review
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [enteredOtp, setEnteredOtp] = useState("");

    const [formData, setFormData] = useState({
        // Step 1: Service Selection / Basic Info
        businessName: '',
        entityType: 'Proprietorship',
        panNumber: '',
        aadhaarNumber: '',
        mobile: '',
        email: '',
        businessAddress: '',
        bankAccountNumber: '',
        ifscCode: '',
        mainActivity: 'Services', // Manufacturing, Services, Both

        // Step 2: Business Details
        dateOfCommencement: '',
        nicCodes: [], // Array of selected codes
        numberOfEmployees: '',
        investmentPlantMachinery: '',
        turnover: '', // Auto-fetched simulation
    });

    // Simulated NIC Codes for Auto-suggestion
    const nicOptions = [
        { code: "6201", desc: "Computer programming activities" },
        { code: "6202", desc: "Computer consultancy and computer facilities management activities" },
        { code: "6311", desc: "Data processing, hosting and related activities" },
        { code: "4791", desc: "Retail sale via mail order houses or via Internet" },
        { code: "5610", desc: "Restaurants and mobile food service activities" }
    ];
    const [nicSearch, setNicSearch] = useState("");

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
        // Scroll to top on step change
        window.scrollTo(0, 0);
    }, [step]);

    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Step 1: Validation & Proceed
    const handleStep1Submit = () => {
        if (!formData.businessName || !formData.panNumber || !formData.aadhaarNumber || !formData.businessAddress) {
            setError("Please fill all mandatory fields.");
            return;
        }
        if (formData.panNumber.length !== 10) {
            setError("Invalid PAN Number.");
            return;
        }
        if (formData.aadhaarNumber.length !== 12) {
            setError("Invalid Aadhaar Number.");
            return;
        }

        // Simulate Aadhaar-PAN Validation
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setError(null);
            // Auto-fetch turnover if not set (simulation)
            if (!formData.turnover) {
                setFormData(prev => ({ ...prev, turnover: '1500000' })); // Expecting PAN linked turnover
            }
            setStep(2);
        }, 1500);
    };

    // Step 2: Validation & Proceed
    const handleStep2Submit = () => {
        if (!formData.dateOfCommencement || formData.nicCodes.length === 0 || !formData.investmentPlantMachinery) {
            setError("Please complete all business details.");
            return;
        }
        setError(null);
        setStep(3);
        // Auto send OTP when reaching step 3
        handleSendOtp();
    };

    // Step 3: OTP Logic
    const handleSendOtp = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOtpSent(true);
            setOtpTimer(30); // 30 seconds timer
            // In a real app, this would trigger backend to send OTP to Aadhaar linked mobile
        }, 1000);
    };

    const handleVerifyOtp = () => {
        if (enteredOtp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setError(null);
            setStep(4);
        }, 1500);
    };

    // Step 4: Final Submission
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : {};

            const msmeFormData = {
                applicantName: user.fullName || formData.businessName,
                aadhaarNumber: formData.aadhaarNumber,
                panNumber: formData.panNumber,
                enterpriseName: formData.businessName,
                organisationType: formData.entityType,
                plantAddress: formData.businessAddress,
                officialAddress: formData.businessAddress,
                bankAccountNumber: formData.bankAccountNumber,
                ifscCode: formData.ifscCode,
                mobileNumber: formData.mobile,
                email: formData.email,
                dateOfCommencement: formData.dateOfCommencement,
                majorActivity: formData.mainActivity,
                nicCodes: JSON.stringify(formData.nicCodes),
                maleEmployees: parseInt(formData.numberOfEmployees) || 0,
                femaleEmployees: 0,
                otherEmployees: 0,
                investmentPlantMachinery: parseFloat(formData.investmentPlantMachinery) || 0,
                investmentEquipment: 0,
                turnover: parseFloat(formData.turnover) || 0
            };

            const finalPayload = {
                submissionId: `MSME-${Date.now()}`,
                userEmail: user.email || formData.email || 'guest@example.com',
                plan: 'standard',
                amountPaid: 1499, // Standard Fee
                status: "INITIATED",
                formData: msmeFormData,
                documents: []
            };

            await submitMSMERegistration(finalPayload);
            navigate('/dashboard?tab=orders');
        } catch (err) {
            setError(err.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    // Helpers for NIC Selection
    const addNicCode = (code) => {
        if (!formData.nicCodes.find(c => c.code === code.code)) {
            setFormData(prev => ({ ...prev, nicCodes: [...prev.nicCodes, code] }));
        }
        setNicSearch("");
    };

    const removeNicCode = (codeToRemove) => {
        setFormData(prev => ({ ...prev, nicCodes: prev.nicCodes.filter(c => c.code !== codeToRemove) }));
    };

    // Progress Bar
    const progress = (step / 4) * 100;

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-800">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">New Udyam Registration</h1>
                            <p className="text-xs text-slate-500">Ministry of MSME, Govt. of India</p>
                        </div>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1 bg-slate-100 w-full">
                    <div className="h-full bg-orange-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 shadow-sm"
                    >
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {/* STEP 1: SERVICE SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                                    <Building size={20} className="text-orange-600" /> Basic Business Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Name of Enterprise / Business</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            placeholder="e.g. ABC Trading Co."
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Type of Entity</label>
                                        <select
                                            name="entityType"
                                            value={formData.entityType}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        >
                                            <option>Proprietorship</option>
                                            <option>Partnership Firm</option>
                                            <option>Private Limited Company</option>
                                            <option>Limited Liability Partnership (LLP)</option>
                                            <option>One Person Company (OPC)</option>
                                            <option>Hindu Undivided Family (HUF)</option>
                                            <option>Society / Trust</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Main Activity</label>
                                        <select
                                            name="mainActivity"
                                            value={formData.mainActivity}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        >
                                            <option>Manufacturing</option>
                                            <option>Services</option>
                                            <option>Both</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">PAN Number</label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            maxLength={10}
                                            placeholder="ABCDE1234F"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800 uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Aadhaar Number</label>
                                        <input
                                            type="text"
                                            name="aadhaarNumber"
                                            value={formData.aadhaarNumber}
                                            onChange={handleChange}
                                            maxLength={12}
                                            placeholder="0000 0000 0000"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Business Address</label>
                                        <textarea
                                            name="businessAddress"
                                            value={formData.businessAddress}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="Complete address with PIN code"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bank Account Number</label>
                                        <input
                                            type="text"
                                            name="bankAccountNumber"
                                            value={formData.bankAccountNumber}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">IFSC Code</label>
                                        <input
                                            type="text"
                                            name="ifscCode"
                                            value={formData.ifscCode}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800 uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleStep1Submit}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition disabled:opacity-50 shadow-lg shadow-orange-500/20"
                                >
                                    {loading ? (
                                        <><RefreshCw className="animate-spin" size={18} /> Validating...</>
                                    ) : (
                                        <>Proceed to Business Details <ChevronRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BUSINESS DETAILS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                                    <FileText size={20} className="text-orange-600" /> Additional Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date of Commencement</label>
                                        <input
                                            type="date"
                                            name="dateOfCommencement"
                                            value={formData.dateOfCommencement}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Number of Employees</label>
                                        <input
                                            type="number"
                                            name="numberOfEmployees"
                                            value={formData.numberOfEmployees}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Investment in Plant & Machinery (₹)</label>
                                        <input
                                            type="number"
                                            name="investmentPlantMachinery"
                                            value={formData.investmentPlantMachinery}
                                            onChange={handleChange}
                                            placeholder="Excluding Land & Building"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Turnover (₹) {formData.turnover && <span className="text-green-600 ml-2 text-[10px] bg-green-50 px-2 py-0.5 rounded-full">Auto-fetched from PAN</span>}</label>
                                        <input
                                            type="number"
                                            name="turnover"
                                            value={formData.turnover}
                                            onChange={handleChange}
                                            readOnly={!!formData.turnover} // Read only if fetched
                                            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition font-medium text-slate-800 ${formData.turnover ? 'bg-green-50/50 text-green-800' : 'focus:ring-2 focus:ring-orange-500'}`}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">NIC Codes (Business Activities)</label>
                                        <div className="relative mb-2">
                                            <input
                                                type="text"
                                                placeholder="Search activity (e.g. Retail, Computer, Manufacturing)"
                                                value={nicSearch}
                                                onChange={(e) => setNicSearch(e.target.value)}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-medium text-slate-800"
                                            />
                                            {nicSearch.length > 2 && (
                                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-xl mt-1 z-10 max-h-60 overflow-y-auto">
                                                    {nicOptions.filter(n => n.desc.toLowerCase().includes(nicSearch.toLowerCase())).map(n => (
                                                        <div
                                                            key={n.code}
                                                            onClick={() => addNicCode(n)}
                                                            className="p-3 hover:bg-orange-50 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                                                        >
                                                            <span className="font-bold text-orange-600">{n.code}</span> - {n.desc}
                                                        </div>
                                                    ))}
                                                    {nicOptions.filter(n => n.desc.toLowerCase().includes(nicSearch.toLowerCase())).length === 0 && (
                                                        <div className="p-3 text-sm text-slate-400">No matching activities found</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.nicCodes.map(code => (
                                                <div key={code.code} className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-bold">
                                                    <span>{code.code} - {code.desc}</span>
                                                    <button onClick={() => removeNicCode(code.code)} className="hover:text-red-600">×</button>
                                                </div>
                                            ))}
                                            {formData.nicCodes.length === 0 && <span className="text-sm text-slate-400 italic">No activities selected</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleStep2Submit}
                                    className="flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/20"
                                >
                                    Next: Authentication <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: OTP AUTHENTICATION */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center py-12">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                                    <Smartphone size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">Aadhaar Authentication</h2>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
                                    An OTP has been sent to the mobile number linked with Aadhaar <strong>XXXX-XXXX-{formData.aadhaarNumber.slice(-4)}</strong>
                                </p>

                                <div className="max-w-xs mx-auto space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={enteredOtp}
                                            onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full text-center text-2xl tracking-[0.5em] font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition text-slate-800"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-xs font-bold px-1">
                                        <span className={otpTimer > 0 ? "text-orange-600" : "text-slate-400"}>
                                            {otpTimer > 0 ? `Expires in 00:${otpTimer < 10 ? `0${otpTimer}` : otpTimer}` : "OTP Expired"}
                                        </span>
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={loading || otpTimer > 0}
                                            className="text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Resend OTP
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={loading}
                                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/20 mt-4 flex justify-center items-center gap-2"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={18} /> : "Verify & Proceed"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition"
                                >
                                    Back
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: FINAL REVIEW */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-center gap-3 text-green-800">
                                <CheckCircle className="shrink-0" size={20} />
                                <p className="text-sm font-medium">Aadhaar authentication successful! Please review details before final submission.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-4 border-b border-gray-100">
                                    <FileText size={20} className="text-orange-600" /> Application Summary
                                </h2>

                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Enterprise Name</span>
                                        <p className="font-bold text-slate-800">{formData.businessName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Organization Type</span>
                                        <p className="font-bold text-slate-800">{formData.entityType}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase">PAN Number</span>
                                        <p className="font-bold text-slate-800">{formData.panNumber}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Invested Amount</span>
                                        <p className="font-bold text-slate-800">₹{formData.investmentPlantMachinery}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Selected Activities (NIC)</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {formData.nicCodes.map(c => (
                                                <span key={c.code} className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 text-xs">{c.code} - {c.desc}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 text-xs text-orange-800 leading-relaxed">
                                    <strong>Declaration:</strong> I hereby declare that the information given above and in the enclosed documents is true to the best of my knowledge and belief and nothing has been concealed therein. I am aware that if any information is incorrect, my registration may be cancelled.
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-lg shadow-green-600/20"
                                >
                                    {loading ? 'Submitting...' : 'Confirm & Submit'} {!loading && <Save size={18} />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ApplyMSMERegistration;
