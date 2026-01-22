import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, CreditCard, FileText, User,
    Building, ArrowLeft, ArrowRight, Shield, AlertCircle, Globe, Users, Plus, Trash2, X
} from 'lucide-react';
import { uploadFile, submitForeignCompanyRegistration } from '../../../api';

const ForeignCompanyRegistration = ({ isLoggedIn, isModal = false, planProp, onClose }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModal) return;
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            const plan = searchParams.get('plan') || 'liaison';
            navigate('/login', { state: { from: `/services/foreign-company-registration?plan=${plan}` } });
        }
    }, [isLoggedIn, navigate, searchParams, isModal]);

    const [currentStep, setCurrentStep] = useState(1);

    const validatePlan = (plan) => {
        return ['liaison', 'branch', 'project'].includes(plan?.toLowerCase()) ? plan.toLowerCase() : 'liaison';
    };

    const [selectedPlan, setSelectedPlan] = useState(validatePlan(planProp || searchParams.get('plan')));

    useEffect(() => {
        if (planProp) {
            setSelectedPlan(validatePlan(planProp));
        } else {
            const planParam = searchParams.get('plan');
            if (planParam && ['liaison', 'branch', 'project'].includes(planParam.toLowerCase())) {
                setSelectedPlan(planParam.toLowerCase());
            }
        }
    }, [searchParams, planProp]);

    const [formData, setFormData] = useState({
        parentCompanyName: '',
        countryOfIncorporation: '',
        officeType: 'Liaison Office', // Default
        proposedActivities: '',
        authorizedRepName: '',
        authorizedRepEmail: '',
        authorizedRepPhone: '',
        registeredAddressIndia: '',
        pincode: '',
        sector: '',
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [automationPayload, setAutomationPayload] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans based on Office Type
    const plans = {
        liaison: {
            price: 49999,
            title: 'Liaison Office',
            features: [
                "RBI Approval Filing", "ROC Registration", "PAN & TAN for Office", "Documentation Support", "Liaison Officer KYC"
            ],
            color: 'bg-white border-slate-200'
        },
        branch: {
            price: 74999,
            title: 'Branch Office',
            features: [
                "Invest India/RBI Approval", "ROC Registration", "Import/Export License", "GST Registration", "Commercial Operations Setup"
            ],
            recommended: true,
            color: 'bg-emerald-50 border-emerald-200'
        },
        project: {
            price: 99999,
            title: 'Project Office',
            features: [
                "Specific Project Approval", "RBI Reporting", "Bank Account Setup", "Project Contract Vetting", "Temporary Establishment"
            ],
            color: 'bg-blue-50 border-blue-200'
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;
        if (step === 1) {
            if (!formData.parentCompanyName) { newErrors.parentCompanyName = "Parent company name required"; isValid = false; }
            if (!formData.countryOfIncorporation) { newErrors.countryOfIncorporation = "Country required"; isValid = false; }
            if (!formData.proposedActivities) { newErrors.proposedActivities = "Activities description required"; isValid = false; }
        }
        if (step === 2) {
            if (!formData.authorizedRepName) { newErrors.authorizedRepName = "Representative name required"; isValid = false; }
            if (!formData.authorizedRepEmail) { newErrors.authorizedRepEmail = "Email required"; isValid = false; }
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => Math.min(5, prev + 1));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const response = await uploadFile(file, 'foreign_company_docs');
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
            alert("File upload failed. Please try again.")
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

            const payload = {
                ...formData,
                plan: selectedPlan,
                amount: plans[selectedPlan].price,
                documents: docsList,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || formData.authorizedRepEmail,
                submissionId: `FOR-${Date.now()}`
            };

            const response = await submitForeignCompanyRegistration(payload);

            if (response) {
                setAutomationPayload(response);
                setIsSuccess(true);
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert("Submission failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Company Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><Globe size={20} className="text-navy" /> FOREIGN PARENT DETAILS</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Foreign Parent Company Name</label>
                                    <input name="parentCompanyName" value={formData.parentCompanyName} onChange={handleInputChange} placeholder="e.g. Acme Corp USA" className={`w-full p-3 rounded-lg border ${errors.parentCompanyName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Country of Incorporation</label>
                                    <input name="countryOfIncorporation" value={formData.countryOfIncorporation} onChange={handleInputChange} placeholder="e.g. USA" className={`w-full p-3 rounded-lg border ${errors.countryOfIncorporation ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Office Type</label>
                                    <select name="officeType" value={selectedPlan === 'basic' ? 'Liaison Office' : selectedPlan === 'standard' ? 'Branch Office' : 'Project Office'} disabled className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <option value="Liaison Office">Liaison Office</option>
                                        <option value="Branch Office">Branch Office</option>
                                        <option value="Project Office">Project Office</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Proposed Activities in India</label>
                                    <textarea name="proposedActivities" value={formData.proposedActivities} onChange={handleInputChange} placeholder="e.g. Market research, Export promotion..." className={`w-full p-3 rounded-lg border ${errors.proposedActivities ? 'border-red-500' : 'border-gray-200'}`} rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Representatives
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><User size={20} className="text-blue-600" /> AUTHORIZED REPRESENTATIVE (IN INDIA)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="authorizedRepName" value={formData.authorizedRepName} onChange={handleInputChange} placeholder="Full Name" className={`w-full p-3 rounded-lg border ${errors.authorizedRepName ? 'border-red-500' : 'border-gray-200'}`} />
                                <input name="authorizedRepEmail" value={formData.authorizedRepEmail} onChange={handleInputChange} placeholder="Email" className={`w-full p-3 rounded-lg border ${errors.authorizedRepEmail ? 'border-red-500' : 'border-gray-200'}`} />
                                <input name="authorizedRepPhone" value={formData.authorizedRepPhone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-3 rounded-lg border border-gray-200" />
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Proposed Address in India (If any)</label>
                                    <input name="registeredAddressIndia" value={formData.registeredAddressIndia} onChange={handleInputChange} placeholder="Address Line 1" className="w-full p-3 rounded-lg border border-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Required Documents</h3>
                            <div className="space-y-4">
                                <div className="border border-dashed p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium">COI / Charter of Parent Company (Apostilled)</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'parent_coi')} className="text-xs" />
                                </div>
                                <div className="border border-dashed p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium">MOA & AOA of Parent Company (Translated)</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'parent_moa_aoa')} className="text-xs" />
                                </div>
                                <div className="border border-dashed p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium">Board Resolution for India Office</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'board_resolution')} className="text-xs" />
                                </div>
                                <div className="border border-dashed p-4 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium">KYC of Authorized Representative</span>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'rep_kyc')} className="text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold text-navy mb-6">Review Application</h2>
                        <div className="bg-emerald-50/50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between mb-2"><span className="text-gray-600">Office Type</span><span className="font-bold text-navy uppercase">{plans[selectedPlan].title}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Processing Fee</span><span className="font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span></div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Parent Company:</strong> {formData.parentCompanyName}</p>
                            <p><strong>Activities:</strong> {formData.proposedActivities}</p>
                            <p><strong>Representative:</strong> {formData.authorizedRepName}</p>
                        </div>
                    </div>
                );
            case 5: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <Building size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-navy mb-2">Payment Summary</h2>
                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Total Payable</span>
                                <span className="text-3xl font-bold text-navy">₹{plans[selectedPlan].price.toLocaleString()}</span>
                            </div>
                        </div>
                        <button onClick={submitApplication} disabled={isSubmitting} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                            {isSubmitting ? 'Processing...' : 'Pay & Submit'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={`bg-[#F8F9FA] ${isModal ? 'h-full overflow-y-auto p-6' : 'min-h-screen pb-20 pt-24 px-4 md:px-8'}`}>
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} className="text-green-600" /></div>
                    <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">We will initiate the RBI/ROC filing process for your <span className="font-bold text-navy">{plans[selectedPlan].title}</span>.</p>
                    <button onClick={() => isModal ? onClose() : navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">{isModal ? 'Close' : 'Go to Dashboard'}</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <button onClick={() => isModal ? onClose() : navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-navy transition"><ArrowLeft size={14} /> {isModal ? 'Close' : 'Back'}</button>
                            <h1 className="text-3xl font-bold text-navy">Foreign Company Registration</h1>
                            <p className="text-gray-500">Establish a Liaison, Branch, or Project Office in India.</p>
                        </div>
                        {isModal && <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Company Info', 'Representative', 'Documents', 'Review', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-emerald-50 border-emerald-100 shadow-sm cursor-default' : 'bg-transparent border-transparent opacity-60 cursor-pointer hover:bg-gray-50'}`}
                                        onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1) }}
                                    >
                                        <div><span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span><span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-emerald-700' : 'text-gray-600'}`}>{step}</span></div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
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
                                            <div key={i} className="flex gap-2 text-xs font-medium text-gray-600"><CheckCircle size={14} className="text-slate shrink-0 mt-0.5" /><span className="leading-tight">{feat}</span></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            {renderStepContent()}
                            {!isSuccess && currentStep < 5 && (
                                <div className="mt-8 flex justify-between">
                                    <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Back</button>
                                    <button onClick={handleNext} className="px-8 py-3 bg-[#2B3446] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2">Next Step <ArrowRight size={18} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForeignCompanyRegistration;
