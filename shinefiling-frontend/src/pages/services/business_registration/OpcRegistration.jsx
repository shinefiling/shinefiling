import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, X, Lock, IndianRupee, UserCheck
} from 'lucide-react';
import { uploadFile, submitOnePersonCompanyRegistration } from '../../../api';

const OpcRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/one-person-company/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        companyNames: ['', '', ''],
        businessActivity: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        ownershipStatus: 'rented',
        authorizedCapital: '100000',
        paidUpCapital: '100000',

        // Owner Details
        owner: {
            name: '', fatherName: '', dob: '',
            pan: '', aadhaar: '', email: '', phone: '',
            dinNumber: ''
        },

        // Nominee Details (Mandatory for OPC)
        nominee: {
            name: '', fatherName: '', dob: '',
            pan: '', aadhaar: '', email: '', phone: '',
            relationship: ''
        }
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam && ['basic', 'standard', 'premium'].includes(planParam.toLowerCase())) {
            setSelectedPlan(planParam.toLowerCase());
        }
    }, [searchParams]);

    const plans = {
        basic: {
            price: 4999,
            title: 'Basic Plan',
            features: [
                "1 DSC & 1 DIN", "Name Approval", "Certificate of Inc.", "MOA & AOA Drafting", "PAN & TAN", "GST & Bank Account (Support)"
            ],
            color: 'bg-white border-gray-200'
        },
        standard: {
            price: 8999,
            title: 'Standard Plan',
            features: [
                "Everything in Basic", "Nominee Consent Filing", "Share Certificate", "PAN & TAN Allocation", "GST & Bank Account"
            ],
            recommended: true,
            color: 'bg-beige/10 border-beige'
        },
        premium: {
            price: 12999,
            title: 'Premium Plan',
            features: [
                "Everything in Standard", "GST Registration", "MSME Registration", "Bank Account (Full)", "First Board Resolution", "Compliance Guidance (1Y)"
            ],
            color: 'bg-beige/10 border-beige'
        }
    };

    const handleInputChange = (e, section = null, subsection = null) => {
        const { name, value } = e.target;

        if (section === 'companyNames') {
            const newNames = [...formData.companyNames];
            newNames[subsection] = value;
            setFormData({ ...formData, companyNames: newNames });
        } else if (section === 'owner' || section === 'nominee') {
            setFormData({
                ...formData,
                [section]: { ...formData[section], [name]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.companyNames[0]) { newErrors.companyNames = "At least one company name is required"; isValid = false; }
            if (!formData.businessActivity) { newErrors.businessActivity = "Business activity is required"; isValid = false; }
            if (!formData.addressLine1) { newErrors.addressLine1 = "Address is required"; isValid = false; }
            if (!formData.pincode) { newErrors.pincode = "Pincode is required"; isValid = false; }
            if (!formData.authorizedCapital || isNaN(formData.authorizedCapital)) { newErrors.authorizedCapital = "Valid Amount Required"; isValid = false; }
        }

        if (step === 2) {
            // Owner Validation
            if (!formData.owner.name) { newErrors.owner_name = "Owner name required"; isValid = false; }
            if (!formData.owner.pan) { newErrors.owner_pan = "Owner PAN required"; isValid = false; }
            if (!formData.owner.aadhaar) { newErrors.owner_aadhaar = "Owner Aadhaar required"; isValid = false; }

            // Nominee Validation (Mandatory for OPC)
            if (!formData.nominee.name) { newErrors.nominee_name = "Nominee name required"; isValid = false; }
            if (!formData.nominee.pan) { newErrors.nominee_pan = "Nominee PAN required"; isValid = false; }
            if (!formData.nominee.aadhaar) { newErrors.nominee_aadhaar = "Nominee Aadhaar required"; isValid = false; }

            // Validation: Nominee ≠ Owner
            if (formData.owner.pan && formData.nominee.pan && formData.owner.pan === formData.nominee.pan) {
                newErrors.nominee_pan = "Nominee cannot be the same as Owner";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            let category = 'client_docs';
            if (key.includes('owner')) category = 'owner_docs';
            if (key.includes('nominee')) category = 'nominee_docs';
            if (key.includes('company')) category = 'company_docs';

            const response = await uploadFile(file, category);

            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
                    preview: file.type.includes('image') ? URL.createObjectURL(file) : null,
                    fileUrl: response.fileUrl,
                    fileId: response.id
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed. Please try again.");
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Company Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                {isModal && (
                    <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                )}
                
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-navy" /> PROPOSED COMPANY NAMES</h3>
                            <div className="grid gap-3">
                                {formData.companyNames.map((name, i) => (
                                    <input key={i} type="text" value={name} onChange={(e) => handleInputChange(e, 'companyNames', i)}
                                        placeholder={`Proposed Name ${i + 1} (OPC) Private Limited`}
                                        className={`w-full p-3 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition ${errors.companyNames && i === 0 ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                ))}
                                {errors.companyNames && <p className="text-red-500 text-xs">{errors.companyNames}</p>}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-purple-600" /> BUSINESS ACTIVITY</h3>
                            <textarea name="businessActivity" value={formData.businessActivity} onChange={handleInputChange}
                                placeholder="Describe main business activity..." className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${errors.businessActivity ? 'border-red-500' : 'border-gray-200'}`} rows="3"></textarea>
                            {errors.businessActivity && <p className="text-red-500 text-xs mt-1">{errors.businessActivity}</p>}
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-orange-600" /> REGISTERED OFFICE ADDRESS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" className={`w-full p-3 rounded-lg border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full p-3 rounded-lg border border-gray-200" />
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className={`w-full p-3 rounded-lg border ${errors.pincode ? 'border-red-500' : 'border-gray-200'}`} />
                                <select name="ownershipStatus" value={formData.ownershipStatus} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                    <option value="rented">Rented</option>
                                    <option value="owned">Owned</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><CreditCard size={20} className="text-slate" /> CAPITAL DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Authorized Capital (Min ₹1)</label>
                                    <input type="text" name="authorizedCapital" value={formData.authorizedCapital} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.authorizedCapital ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Paid-up Capital</label>
                                    <input type="text" name="paidUpCapital" value={formData.paidUpCapital} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Owner & Nominee Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 mb-2 p-3 bg-beige/10 text-blue-800 rounded-lg text-sm border border-blue-100">
                            <AlertCircle size={16} /> <span>OPC requires exactly 1 Owner and 1 Nominee (who cannot be the same person).</span>
                        </div>

                        {/* Owner Details */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-gray-800 mb-4 bg-beige/10 inline-block px-3 py-1 rounded text-sm flex items-center gap-2">
                                <User size={16} /> Owner (Director & Sole Member)
                            </h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                <input type="text" name="name" value={formData.owner.name} onChange={(e) => handleInputChange(e, 'owner')} placeholder="Full Name" className={`w-full p-3 border rounded-lg ${errors.owner_name ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="fatherName" value={formData.owner.fatherName} onChange={(e) => handleInputChange(e, 'owner')} placeholder="Father's Name" className="p-3 border rounded-lg" />
                                <input type="date" name="dob" value={formData.owner.dob} onChange={(e) => handleInputChange(e, 'owner')} className="p-3 border rounded-lg" />
                                <input type="text" name="pan" value={formData.owner.pan} onChange={(e) => handleInputChange(e, 'owner')} placeholder="PAN Number" className={`w-full p-3 border rounded-lg ${errors.owner_pan ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="aadhaar" value={formData.owner.aadhaar} onChange={(e) => handleInputChange(e, 'owner')} placeholder="Aadhaar Number" className={`w-full p-3 border rounded-lg ${errors.owner_aadhaar ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="email" name="email" value={formData.owner.email} onChange={(e) => handleInputChange(e, 'owner')} placeholder="Email" className="p-3 border rounded-lg" />
                                <input type="tel" name="phone" value={formData.owner.phone} onChange={(e) => handleInputChange(e, 'owner')} placeholder="Mobile" className="p-3 border rounded-lg" />
                                <input type="text" name="dinNumber" value={formData.owner.dinNumber} onChange={(e) => handleInputChange(e, 'owner')} placeholder="DIN (Optional)" className="p-3 border rounded-lg" />
                            </div>
                        </div>

                        {/* Nominee Details */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-gray-800 mb-4 bg-beige/10 inline-block px-3 py-1 rounded text-sm flex items-center gap-2">
                                <UserCheck size={16} /> Nominee (Mandatory for OPC)
                            </h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                <input type="text" name="name" value={formData.nominee.name} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Full Name" className={`w-full p-3 border rounded-lg ${errors.nominee_name ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="fatherName" value={formData.nominee.fatherName} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Father's Name" className="p-3 border rounded-lg" />
                                <input type="date" name="dob" value={formData.nominee.dob} onChange={(e) => handleInputChange(e, 'nominee')} className="p-3 border rounded-lg" />
                                <input type="text" name="pan" value={formData.nominee.pan} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="PAN Number" className={`w-full p-3 border rounded-lg ${errors.nominee_pan ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="text" name="aadhaar" value={formData.nominee.aadhaar} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Aadhaar Number" className={`w-full p-3 border rounded-lg ${errors.nominee_aadhaar ? 'border-red-500' : 'border-gray-200'}`} />
                                <input type="email" name="email" value={formData.nominee.email} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Email" className="p-3 border rounded-lg" />
                                <input type="tel" name="phone" value={formData.nominee.phone} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Mobile" className="p-3 border rounded-lg" />
                                <input type="text" name="relationship" value={formData.nominee.relationship} onChange={(e) => handleInputChange(e, 'nominee')} placeholder="Relationship with Owner" className="p-3 border rounded-lg" />
                            </div>
                            {errors.nominee_pan && <p className="text-red-500 text-xs mt-2">{errors.nominee_pan}</p>}
                        </div>
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        {/* Company Docs */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Company Office Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['Office Proof (Electricity/Gas Bill)', 'NOC from Owner'].map((label, idx) => {
                                    const key = `company_doc_${idx}`;
                                    return (
                                        <div key={idx} className="border border-dashed p-4 rounded-lg flex justify-between items-center group hover:border-blue-300 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Upload size={16} className="text-gray-400 group-hover:text-bronze" />
                                                <span className="text-sm font-medium text-gray-600">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={16} className="text-bronze" />}
                                                <input type="file" onChange={(e) => handleFileUpload(e, key)} className="text-xs w-24" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Owner Docs */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Owner Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['PAN Card', 'Aadhaar Card', 'Photo', 'Address Proof', 'Utility Bill'].map((doc, dIdx) => {
                                    const key = `owner_${doc.replace(/[\s/()]/g, '').toLowerCase()}`;
                                    return (
                                        <div key={dIdx} className="bg-gray-50 p-3 rounded border flex justify-between items-center">
                                            <span className="text-xs font-medium">{doc}</span>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={14} className="text-bronze" />}
                                                <input type="file" className="w-24 text-[10px]" onChange={(e) => handleFileUpload(e, key)} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Nominee Docs */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Nominee Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['PAN Card', 'Aadhaar Card', 'Consent Form (INC-3)'].map((doc, dIdx) => {
                                    const key = `nominee_${doc.replace(/[\s/()-]/g, '').toLowerCase()}`;
                                    return (
                                        <div key={dIdx} className="bg-gray-50 p-3 rounded border flex justify-between items-center">
                                            <span className="text-xs font-medium">{doc}</span>
                                            <div className="flex items-center gap-2">
                                                {uploadedFiles[key] && <CheckCircle size={14} className="text-bronze" />}
                                                <input type="file" className="w-24 text-[10px]" onChange={(e) => handleFileUpload(e, key)} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Plan</span>
                                    <span className="font-bold font-mono uppercase text-navy">{plans[selectedPlan].title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan Amount</span>
                                    <span className="font-bold">₹{plans[selectedPlan].price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Govt Fees</span>
                                    <span className="italic text-xs text-gray-400">To be paid later</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Company Name</span>
                                    <span className="font-bold">{formData.companyNames[0]}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Owner</span>
                                    <span className="font-bold">{formData.owner.name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Nominee</span>
                                    <span className="font-bold">{formData.nominee.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto mb-6 text-navy">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Complete your payment to initiate the OPC registration process.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (Later)</p>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing Payment...' : 'Pay Now & Submit Application'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                            <Lock size={12} /> Secure 256-bit SSL Payment
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const enrichedOwner = {
                ...formData.owner,
                photoUrl: uploadedFiles['owner_photo']?.fileUrl,
                panUrl: uploadedFiles['owner_pancard']?.fileUrl,
                aadhaarUrl: uploadedFiles['owner_aadhaarcard']?.fileUrl,
                addressProofUrl: uploadedFiles['owner_addressproof']?.fileUrl,
                utilityBillUrl: uploadedFiles['owner_utilitybill']?.fileUrl
            };

            const enrichedNominee = {
                ...formData.nominee,
                panUrl: uploadedFiles['nominee_pancard']?.fileUrl,
                aadhaarUrl: uploadedFiles['nominee_aadhaarcard']?.fileUrl,
                consentFormUrl: uploadedFiles['nominee_consentforminc3']?.fileUrl
            };

            const finalPayload = {
                submissionId: `OPC-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.owner.email,
                formData: {
                    ...formData,
                    owner: enrichedOwner,
                    nominee: enrichedNominee
                },
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitOnePersonCompanyRegistration(finalPayload);

            setAutomationPayload(response);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={isModal ? "bg-[#F8F9FA] p-4 md:p-8" : "min-h-screen bg-[#F8F9FA] pb-20 pt-24 px-4 md:px-8"}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">OPC Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Your Order ID is <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{automationPayload?.submissionId}</span>.
                    </p>
                    <div className="bg-beige/10 p-6 rounded-xl max-w-xl mx-auto mb-8 text-left">
                        <h4 className="font-bold text-blue-800 mb-2 text-sm">Next Steps (Super Admin Queue):</h4>
                        <ul className="list-disc pl-5 text-sm text-bronze-dark space-y-1">
                            <li>Document Verification (24 Hrs)</li>
                            <li>DSC & DIN Application</li>
                            <li>Name Approval Filing</li>
                            <li>Nominee Consent Processing</li>
                        </ul>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navylack transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">One Person Company Registration</h1>
                        <p className="text-gray-500">Complete the process to incorporate your OPC.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Company Details', 'Owner & Nominee', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-bronze-dark' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-bronze" />}
                                    </div>
                                ))}
                            </div>

                            <div className={`p-6 rounded-2xl border shadow-sm ${plans[selectedPlan].color} relative overflow-hidden transition-all sticky top-24`}>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</div>
                                    <div className="text-3xl font-bold text-gray-800 mb-2">{plans[selectedPlan].title}</div>
                                    <div className="text-3xl font-bold text-navy mb-4">₹{plans[selectedPlan].price.toLocaleString()}</div>

                                    <div className="space-y-3 mb-6">
                                        {plans[selectedPlan].features.map((feat, i) => (
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                                                <CheckCircle size={14} className="text-slate shrink-0 mt-0.5" />
                                                <span className="leading-tight">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => navigate('/services/one-person-company')} className="text-xs font-bold text-gray-500 hover:text-navylack underline">Change Plan</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {renderStepContent()}

                            {!isSuccess && currentStep < 5 && (
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

export default OpcRegistration;

