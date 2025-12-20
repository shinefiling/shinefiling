import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Trash2, Plus, IndianRupee, Users, X
} from 'lucide-react';
import { uploadFile, submitLlpRegistration } from '../../../api';
import Loader from '../../../components/Loader';

const LlpRegistration = ({ isLoggedIn, isModal, onClose, initialPlan }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/llp-registration/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams]);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'basic');

    const [formData, setFormData] = useState({
        proposedNames: ['', '', ''],
        businessActivity: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        district: '',
        pincode: '',
        ownershipStatus: 'rented',
        totalCapitalContribution: '100000',

        // Partners (Min 2)
        partners: [
            {
                name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', address: '',
                isDesignatedPartner: true, contributionAmount: '50000', profitSharingRatio: '50', dinNumber: ''
            },
            {
                name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', address: '',
                isDesignatedPartner: true, contributionAmount: '50000', profitSharingRatio: '50', dinNumber: ''
            }
        ]
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
                "2 DSC & 2 DPIN", "Name Reservation", "Incorporation Cert.", "LLP Agreement Draft", "PAN & TAN", "Bank Support"
            ],
            color: 'bg-white border-gray-200'
        },
        standard: {
            price: 8999,
            title: 'Standard Plan',
            features: [
                "Everything in Basic", "LLP Agreement Filing", "Partner Profit Register", "Capital Register", "Detailed PAN/TAN"
            ],
            recommended: true,
            color: 'bg-beige/10 border-beige'
        },
        premium: {
            price: 12999,
            title: 'Premium Plan',
            features: [
                "Everything in Standard", "GST Registration", "MSME Registration", "Bank Account (End-to-End)", "1-Year Compliance"
            ],
            color: 'bg-beige/10 border-beige'
        }
    };

    const handleInputChange = (e, section = null, index = null) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (section === 'partners') {
            const newPartners = [...formData.partners];
            newPartners[index] = { ...newPartners[index], [name]: val };
            setFormData({ ...formData, partners: newPartners });
        } else if (section === 'proposedNames') {
            const newNames = [...formData.proposedNames];
            newNames[index] = value;
            setFormData({ ...formData, proposedNames: newNames });
        } else {
            setFormData({ ...formData, [name]: val });
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const addPartner = () => {
        setFormData({
            ...formData,
            partners: [...formData.partners, {
                name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', address: '',
                isDesignatedPartner: false, contributionAmount: '0', profitSharingRatio: '0', dinNumber: ''
            }]
        });
    };

    const removePartner = (index) => {
        if (formData.partners.length <= 2) {
            alert("Minimum 2 partners are required.");
            return;
        }
        const newPartners = formData.partners.filter((_, i) => i !== index);
        setFormData({ ...formData, partners: newPartners });
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.proposedNames[0]) { newErrors.proposedNames = "At least one name is required"; isValid = false; }
            if (!formData.businessActivity) { newErrors.businessActivity = "Business activity is required"; isValid = false; }
            if (!formData.addressLine1) { newErrors.addressLine1 = "Address is required"; isValid = false; }
            if (!formData.pincode) { newErrors.pincode = "Pincode is required"; isValid = false; }
            if (!formData.totalCapitalContribution || isNaN(formData.totalCapitalContribution)) { newErrors.totalCapitalContribution = "Valid Amount Required"; isValid = false; }
        }

        if (step === 2) {
            // Validate Partners
            let designatedCount = 0;
            let totalRatio = 0;
            const seenPans = new Set();

            formData.partners.forEach((partner, idx) => {
                if (!partner.name) { newErrors[`partner_${idx}_name`] = "Name required"; isValid = false; }
                if (!partner.pan) { newErrors[`partner_${idx}_pan`] = "PAN required"; isValid = false; }
                if (!partner.aadhaar) { newErrors[`partner_${idx}_aadhaar`] = "Aadhaar required"; isValid = false; }

                if (partner.pan && seenPans.has(partner.pan)) {
                    newErrors[`partner_${idx}_pan`] = "Duplicate PAN not allowed"; isValid = false;
                }
                seenPans.add(partner.pan);

                if (partner.isDesignatedPartner) designatedCount++;
                totalRatio += parseFloat(partner.profitSharingRatio || 0);

                if (partner.contributionAmount && isNaN(partner.contributionAmount)) {
                    newErrors[`partner_${idx}_capital`] = "Invalid Amount"; isValid = false;
                }
            });

            if (designatedCount < 2) {
                newErrors.generic = "At least 2 partners must be Designated Partners.";
                isValid = false;
            }

            if (Math.abs(totalRatio - 100) > 0.1) {
                newErrors.genericRatio = `Total Profit Sharing Ratio must be 100%. Current: ${totalRatio}%`;
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

    const handleFileUpload = async (e, key, partnerIdx = null) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            let category = 'client_docs';
            let finalKey = key;

            if (partnerIdx !== null) {
                category = `partner_${partnerIdx}_docs`;
                finalKey = `${key}_${partnerIdx}`;
            }

            const response = await uploadFile(file, category);

            setUploadedFiles(prev => ({
                ...prev,
                [finalKey]: {
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
            case 1: // LLP Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">


                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-navy" /> PROPOSED LLP NAMES</h3>
                            <div className="grid gap-3">
                                {formData.proposedNames.map((name, i) => (
                                    <input key={i} type="text" value={name} onChange={(e) => handleInputChange(e, 'proposedNames', i)}
                                        placeholder={`Proposed Name ${i + 1}`}
                                        className={`w-full p-3 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition ${errors.proposedNames && i === 0 ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                ))}
                                {errors.proposedNames && <p className="text-red-500 text-xs">{errors.proposedNames}</p>}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-purple-600" /> BUSINESS ACTIVITY</h3>
                            <textarea name="businessActivity" value={formData.businessActivity} onChange={handleInputChange}
                                placeholder="Describe main business activity..." className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${errors.businessActivity ? 'border-red-500' : 'border-gray-200'}`} rows="3"></textarea>
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
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><CreditCard size={20} className="text-slate" /> CAPITAL CONTRIBUTION</h3>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Total Contribution (₹)</label>
                                <input type="text" name="totalCapitalContribution" value={formData.totalCapitalContribution} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.totalCapitalContribution ? 'border-red-500' : 'border-gray-200'}`} />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Partner Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 p-3 bg-beige/10 text-blue-800 rounded-lg text-sm border border-blue-100 flex-1 mr-4">
                                <AlertCircle size={16} /> <span>Min 2 Designated Partners required. Total Profit Share must be 100%.</span>
                            </div>
                            <button onClick={addPartner} className="flex items-center gap-2 px-4 py-2 bg-[#2B3446] text-white rounded-lg font-bold text-xs hover:bg-black transition">
                                <Plus size={14} /> Add Partner
                            </button>
                        </div>

                        {errors.generic && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold mb-4">{errors.generic}</div>}
                        {errors.genericRatio && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold mb-4">{errors.genericRatio}</div>}

                        {formData.partners.map((partner, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        <User size={16} className="text-bronze" /> Partner {idx + 1}
                                    </h4>
                                    {formData.partners.length > 2 && (
                                        <button onClick={() => removePartner(idx)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <input type="text" name="name" value={partner.name} onChange={(e) => handleInputChange(e, 'partners', idx)} placeholder="Full Name" className={`w-full p-3 border rounded-lg ${errors[`partner_${idx}_name`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="text" name="fatherName" value={partner.fatherName} onChange={(e) => handleInputChange(e, 'partners', idx)} placeholder="Father's Name" className="p-3 border rounded-lg" />
                                    <input type="date" name="dob" value={partner.dob} onChange={(e) => handleInputChange(e, 'partners', idx)} className="p-3 border rounded-lg" />
                                    <input type="text" name="pan" value={partner.pan} onChange={(e) => handleInputChange(e, 'partners', idx)} placeholder="PAN Number" className={`w-full p-3 border rounded-lg ${errors[`partner_${idx}_pan`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="text" name="aadhaar" value={partner.aadhaar} onChange={(e) => handleInputChange(e, 'partners', idx)} placeholder="Aadhaar Number" className={`w-full p-3 border rounded-lg ${errors[`partner_${idx}_aadhaar`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="email" name="email" value={partner.email} onChange={(e) => handleInputChange(e, 'partners', idx)} placeholder="Email" className="p-3 border rounded-lg" />
                                    <input type="tel" name="phone" value={partner.phone} onChange={(e) => handleInputChange(e, 'partners', idx)} placeholder="Mobile" className="p-3 border rounded-lg" />
                                    <input type="text" name="dinNumber" value={partner.dinNumber} onChange={(e) => handleInputChange(e, 'partners', idx)} placeholder="DIN (Optional)" className="p-3 border rounded-lg" />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="isDesignatedPartner" checked={partner.isDesignatedPartner} onChange={(e) => handleInputChange(e, 'partners', idx)} className="w-4 h-4 text-navy rounded" />
                                        <span className="text-sm font-bold text-gray-700">Designated Partner?</span>
                                    </label>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Contribution (₹)</label>
                                        <input type="text" name="contributionAmount" value={partner.contributionAmount} onChange={(e) => handleInputChange(e, 'partners', idx)} className="w-full p-2 border rounded bg-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Profit Share (%)</label>
                                        <input type="number" name="profitSharingRatio" value={partner.profitSharingRatio} onChange={(e) => handleInputChange(e, 'partners', idx)} className="w-full p-2 border rounded bg-white text-sm" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 3: // Documents
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        {/* Office Docs */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Office Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {['Electricity/Gas Bill', 'NOC from Owner', formData.ownershipStatus === 'rented' ? 'Rent Agreement' : 'Sale Deed'].map((label, idx) => {
                                    if (!label) return null;
                                    const key = `office_doc_${idx}`;
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

                        {/* Partners Docs */}
                        {formData.partners.map((partner, pIdx) => (
                            <div key={pIdx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-navy mb-4 flex items-center justify-between">
                                    <span>Documents for {partner.name || `Partner ${pIdx + 1}`}</span>
                                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded">Partner {pIdx + 1}</span>
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {['PAN Card', 'Aadhaar Card', 'Photo', 'Address Proof'].map((doc, dIdx) => {
                                        const key = `partner_doc_${doc.replace(/[\s/]/g, '').toLowerCase()}`;
                                        const finalKey = `${key}_${pIdx}`;
                                        return (
                                            <div key={dIdx} className="bg-gray-50 p-3 rounded border flex justify-between items-center">
                                                <span className="text-xs font-medium">{doc}</span>
                                                <div className="flex items-center gap-2">
                                                    {uploadedFiles[finalKey] && <CheckCircle size={14} className="text-bronze" />}
                                                    <input type="file" className="w-24 text-[10px]" onChange={(e) => handleFileUpload(e, key, pIdx)} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
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
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Proposed Name</span>
                                    <span className="font-bold">{formData.proposedNames[0]}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Total Capital</span>
                                    <span className="font-bold">₹{formData.totalCapitalContribution}</span>
                                </div>
                                <div className="mt-4">
                                    <span className="text-gray-500 block mb-2">Partner Summary:</span>
                                    <div className="space-y-2">
                                        {formData.partners.map((p, i) => (
                                            <div key={i} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                                                <span>{p.name} ({p.isDesignatedPartner ? 'DP' : 'P'})</span>
                                                <span className="font-mono">{p.profitSharingRatio}%</span>
                                            </div>
                                        ))}
                                    </div>
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
                        <p className="text-gray-500 mb-8">Complete payment to initiate LLP registration.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (Later)</p>
                        </div>

                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit Application'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
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

            // Map partners with their specific document URLs
            const enrichedPartners = formData.partners.map((p, idx) => ({
                ...p,
                photoUrl: uploadedFiles[`partner_doc_photo_${idx}`]?.fileUrl,
                panUrl: uploadedFiles[`partner_doc_pancard_${idx}`]?.fileUrl,
                aadhaarUrl: uploadedFiles[`partner_doc_aadhaarcard_${idx}`]?.fileUrl,
                addressProofUrl: uploadedFiles[`partner_doc_addressproof_${idx}`]?.fileUrl
            }));

            const finalPayload = {
                submissionId: `LLP-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.partners[0].email,
                formData: {
                    ...formData,
                    partners: enrichedPartners,
                    officeUtilityBillUrl: uploadedFiles['office_doc_0']?.fileUrl,
                    officeNocUrl: uploadedFiles['office_doc_1']?.fileUrl,
                    officeDeedUrl: uploadedFiles['office_doc_2']?.fileUrl
                },
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitLlpRegistration(finalPayload);
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
            {isSubmitting && <Loader fullScreen={true} text="Submitting Application..." />}
            {isModal && (
                <button onClick={onClose} className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition text-navy border border-gray-200 group">
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">LLP Registration Successful!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <span className="font-bold text-navy">{plans[selectedPlan].title}</span> has been submitted.
                        Order ID: <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">{automationPayload?.submissionId}</span>
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navylack transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-bold text-navy">LLP Registration</h1>
                        <p className="text-gray-500">Complete the process to incorporate your Limited Liability Partnership.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['LLP Details', 'Partner Details', 'Documents', 'Review', 'Payment'].map((step, i) => (
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
                                    <button onClick={() => navigate('/services/llp-registration')} className="text-xs font-bold text-gray-500 hover:text-navylack underline">Change Plan</button>
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

export default LlpRegistration;

