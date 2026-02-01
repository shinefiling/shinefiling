
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Lock, IndianRupee, Users, Plus, Trash2, X
} from 'lucide-react';
import { uploadFile, submitPrivateLimitedRegistration } from '../../../api';

const PrivateLimitedRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Protect Route (Skip if in Modal, assume parent handles or let it stay)
    useEffect(() => {
        if (isModal) return; // Parent handles auth for modal
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'basic';
            navigate('/login', { state: { from: `/services/private-limited-company/register?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    // Validate initialPlan or default to 'startup'
    const validatePlan = (plan) => {
        return ['startup', 'growth', 'enterprise'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'startup';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

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

        // New Fields
        natureOfBusiness: '',
        employeeCount: '',
        bankPreference: '',
        turnoverEstimate: '',
        accountingStartDate: '',
        trademarkName: '',
        trademarkClass: '',
        auditorPreference: '',

        // Directors (Min 2 for Pvt Ltd)
        directors: [
            { name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', dinNumber: '' },
            { name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', dinNumber: '' }
        ]
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans Configuration
    const plans = {
        startup: {
            price: 6999,
            title: 'Startup Plan',
            features: [
                "2 DSC & 2 DIN", "Name Approval", "Certificate of Incorporation", "PAN & TAN", "PF & ESIC Registration", "GST Registration", "1st Year Compliance"
            ],
            color: 'bg-white border-slate-200'
        },
        growth: {
            price: 14999,
            title: 'Growth Plan',
            features: [
                "Everything in Startup", "GST Registration", "Udyam (MSME) Registration", "Business Bank Account Support", "Accounting Software (1 Year)", "Dedicated Account Manager"
            ],
            recommended: true,
            color: 'bg-indigo-50 border-indigo-200'
        },
        enterprise: {
            price: 24999,
            title: 'Enterprise Plan',
            features: [
                "Everything in Growth", "Trademark Filing (1 Class)", "1st Year ROC Compliance", "ADT-1 Auditor Appointment", "INC-20A Filing", "Zero Balance Current Account"
            ],
            color: 'bg-purple-50 border-purple-200'
        }
    };

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(validatePlan(planProp));
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['startup', 'growth', 'enterprise'].includes(planParam.toLowerCase())) {
                setSelectedPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const handleInputChange = (e, section = null, index = null) => {
        const { name, value } = e.target;

        if (section === 'companyNames') {
            const newNames = [...formData.companyNames];
            newNames[index] = value;
            setFormData({ ...formData, companyNames: newNames });
        } else if (section === 'directors') {
            const newDirectors = [...formData.directors];
            newDirectors[index][name] = value;
            setFormData({ ...formData, directors: newDirectors });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const addDirector = () => {
        if (formData.directors.length < 5) {
            setFormData(prev => ({
                ...prev,
                directors: [...prev.directors, { name: '', fatherName: '', dob: '', pan: '', aadhaar: '', email: '', phone: '', dinNumber: '' }]
            }));
        }
    };

    const removeDirector = (index) => {
        if (formData.directors.length > 2) {
            const newDirectors = formData.directors.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, directors: newDirectors }));
        } else {
            alert("A Private Limited Company must have at least 2 directors.");
        }
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
            // Validate all directors
            formData.directors.forEach((dir, i) => {
                if (!dir.name) { newErrors[`director_${i}_name`] = "Name required"; isValid = false; }
                if (!dir.pan) { newErrors[`director_${i}_pan`] = "PAN required"; isValid = false; }
                if (!dir.email) { newErrors[`director_${i}_email`] = "Email required"; isValid = false; }
                // Check dupes
                formData.directors.forEach((otherDir, j) => {
                    if (i !== j && dir.pan && otherDir.pan && dir.pan === otherDir.pan) {
                        newErrors[`director_${i}_pan`] = "Duplicate PAN found";
                        isValid = false;
                    }
                });
            });
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
            if (key.includes('director')) category = 'director_docs';
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

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `PVT-${Date.now()}`,
                plan: selectedPlan,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.directors[0].email,
                formData: formData,
                documents: docsList,
                status: "PAYMENT_SUCCESSFUL"
            };

            const response = await submitPrivateLimitedRegistration(finalPayload);

            setAutomationPayload(response);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Submission error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Company Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* 1. Proposed Info */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Building size={20} className="text-navy" /> PROPOSED COMPANY NAMES</h3>
                            <div className="grid gap-3">
                                {formData.companyNames.map((name, i) => (
                                    <input key={i} type="text" value={name} onChange={(e) => handleInputChange(e, 'companyNames', i)}
                                        placeholder={`Proposed Name ${i + 1} Private Limited`}
                                        className={`w-full p-3 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition ${errors.companyNames && i === 0 ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                ))}
                                {errors.companyNames && <p className="text-red-500 text-xs">{errors.companyNames}</p>}
                            </div>
                        </div>

                        {/* 2. Business Activity */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><FileText size={20} className="text-purple-600" /> BUSINESS ACTIVITY</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Main Object / Activity</label>
                                    <textarea name="businessActivity" value={formData.businessActivity} onChange={handleInputChange}
                                        placeholder="Describe main business activity..." className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${errors.businessActivity ? 'border-red-500' : 'border-gray-200'}`} rows="2"></textarea>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Nature of Business</label>
                                        <select name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                            <option value="">Select Nature</option>
                                            <option value="IT/Software">IT / Software</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Service">Service</option>
                                            <option value="Trading">Trading</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Expected Employees</label>
                                        <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} placeholder="e.g. 5" className="w-full p-3 rounded-lg border border-gray-200" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Address */}
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

                        {/* 4. Capital */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><CreditCard size={20} className="text-slate" /> CAPITAL DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Authorized Capital (Min ₹1 Lakh)</label>
                                    <input type="text" name="authorizedCapital" value={formData.authorizedCapital} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.authorizedCapital ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Paid-up Capital</label>
                                    <input type="text" name="paidUpCapital" value={formData.paidUpCapital} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>

                        {/* 5. GROWTH & ENTERPRISE EXTRAS */}
                        {(selectedPlan === 'growth' || selectedPlan === 'enterprise') && (
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2"><Users size={20} className="text-indigo-600" /> GROWTH PLAN DETAILS</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-indigo-800 mb-1 block">Preferred Bank</label>
                                        <select name="bankPreference" value={formData.bankPreference} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-indigo-200 bg-white">
                                            <option value="">Any Top Bank</option>
                                            <option value="HDFC">HDFC Bank</option>
                                            <option value="ICICI">ICICI Bank</option>
                                            <option value="SBI">SBI</option>
                                            <option value="Axis">Axis Bank</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-indigo-800 mb-1 block">Est. Annual Turnover</label>
                                        <select name="turnoverEstimate" value={formData.turnoverEstimate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-indigo-200 bg-white">
                                            <option value="<10L">Less than 10 Lakhs</option>
                                            <option value="10L-50L">10L - 50L</option>
                                            <option value="50L+">50L+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-indigo-800 mb-1 block">Accounting Start Date</label>
                                        <input type="date" name="accountingStartDate" value={formData.accountingStartDate} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-indigo-200 bg-white" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. ENTERPRISE EXTRAS */}
                        {selectedPlan === 'enterprise' && (
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
                                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2"><Shield size={20} className="text-purple-600" /> ENTERPRISE EXTRAS</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-purple-800 mb-1 block">Trademark Name (Brand)</label>
                                        <input type="text" name="trademarkName" value={formData.trademarkName} onChange={handleInputChange} placeholder="Brand Name to Protect" className="w-full p-3 rounded-lg border border-purple-200 bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-purple-800 mb-1 block">Trademark Class (if known)</label>
                                        <input type="text" name="trademarkClass" value={formData.trademarkClass} onChange={handleInputChange} placeholder="e.g. Class 35" className="w-full p-3 rounded-lg border border-purple-200 bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-purple-800 mb-1 block">Preferred Auditor</label>
                                        <select name="auditorPreference" value={formData.auditorPreference} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-purple-200 bg-white">
                                            <option value="System Assigned">System Assigned</option>
                                            <option value="Own Auditor">I have my own</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2: // Director Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 mb-2 p-3 bg-beige/10 text-blue-800 rounded-lg text-sm border border-blue-100">
                            <AlertCircle size={16} /> <span>Pvt Ltd requires minimum 2 Directors.</span>
                        </div>

                        {formData.directors.map((director, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4 bg-beige/10 p-2 rounded-lg">
                                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                        <User size={16} /> Director {i + 1}
                                    </h4>
                                    {formData.directors.length > 2 && (
                                        <button onClick={() => removeDirector(i)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <input type="text" name="name" value={director.name} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Full Name" className={`w-full p-3 border rounded-lg ${errors[`director_${i}_name`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="text" name="fatherName" value={director.fatherName} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Father's Name" className="p-3 border rounded-lg" />
                                    <input type="date" name="dob" value={director.dob} onChange={(e) => handleInputChange(e, 'directors', i)} className="p-3 border rounded-lg" />
                                    <input type="text" name="pan" value={director.pan} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="PAN Number" className={`w-full p-3 border rounded-lg ${errors[`director_${i}_pan`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="text" name="aadhaar" value={director.aadhaar} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Aadhaar Number" className="p-3 border rounded-lg" />
                                    <input type="email" name="email" value={director.email} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Email" className={`w-full p-3 border rounded-lg ${errors[`director_${i}_email`] ? 'border-red-500' : 'border-gray-200'}`} />
                                    <input type="tel" name="phone" value={director.phone} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="Mobile" className="p-3 border rounded-lg" />
                                    <input type="text" name="dinNumber" value={director.dinNumber} onChange={(e) => handleInputChange(e, 'directors', i)} placeholder="DIN (Optional)" className="p-3 border rounded-lg" />
                                </div>
                            </div>
                        ))}

                        {formData.directors.length < 5 && (
                            <button onClick={addDirector} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-bronze hover:text-bronze transition flex items-center justify-center gap-2">
                                <Plus size={20} /> Add Another Director
                            </button>
                        )}
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

                        {/* Directors Docs */}
                        {formData.directors.map((director, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-navy mb-4">Documents for {director.name || `Director ${i + 1}`}</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {['PAN Card', 'Aadhaar Card', 'Photo', 'Address Proof'].map((doc, dIdx) => {
                                        const key = `director_${i}_${doc.replace(/[\s/()]/g, '').toLowerCase()}`;
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
                                    <span className="text-gray-500">Directors Count</span>
                                    <span className="font-bold">{formData.directors.length}</span>
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
                        <p className="text-gray-500 mb-8">Complete your payment to initiate the PVT LTD registration process.</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-right">+ Govt Fees (Later)</p>
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="max-w-md mx-auto mb-6 text-left bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms_pvt"
                                        type="checkbox"
                                        checked={isTermsAccepted}
                                        onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 text-bronze border-gray-300 rounded focus:ring-bronze"
                                    />
                                </div>
                                <label htmlFor="terms_pvt" className="text-sm text-gray-600">
                                    I agree to the <span className="font-bold text-navy cursor-pointer hover:underline">Terms & Conditions</span>, <span className="font-bold text-navy cursor-pointer hover:underline">Privacy Policy</span>, and Refund Policy. I confirm that all documents provided are authentic.
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={submitApplication}
                            disabled={isSubmitting || !isTermsAccepted}
                            className={`w-full py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 ${isSubmitting || !isTermsAccepted ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-green-600 hover:bg-green-700 hover:shadow-xl text-white'}`}
                        >
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

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-slate" />
                    </div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Registration Successful!</h1>
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
                            <li>Incorporation Filing</li>
                        </ul>
                    </div>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">Private Limited Registration</h1>
                            <p className="text-gray-500">Complete the process to incorporate your Private Limited Company.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Company Details', 'Directors', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-beige/10 border-beige shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
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
                                    {!isModal && <button onClick={() => navigate('/services/private-limited-company')} className="text-xs font-bold text-gray-500 hover:text-navy underline">Change Plan</button>}
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

export default PrivateLimitedRegistration;
