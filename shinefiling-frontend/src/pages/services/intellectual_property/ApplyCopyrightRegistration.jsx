import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, Copyright, BookOpen, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitCopyrightRegistration } from '../../../api';

const ApplyCopyrightRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [planType, setPlanType] = useState('standard');

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/intellectual-property/copyright-registration/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const [formData, setFormData] = useState({
        workTitle: '',
        workCategory: 'LITERARY', // LITERARY, ARTISTIC, SOFTWARE, MUSIC, CINEMATOGRAPH
        authorName: '',
        publicationStatus: 'UNPUBLISHED',
        publicationDate: ''
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    // Plans
    const plans = {
        standard: { title: "Copyright Filing", serviceFee: 2999 },
    };

    const getTotalPrice = () => {
        return (plans[planType]?.serviceFee || 2999);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) { // Work Details
            if (!formData.workTitle) { newErrors.workTitle = "Title required"; isValid = false; }
            if (!formData.authorName) { newErrors.authorName = "Author Name required"; isValid = false; }
            if (formData.publicationStatus === 'PUBLISHED' && !formData.publicationDate) {
                newErrors.publicationDate = "Publication Date required"; isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(3, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'copyright');
            setUploadedFiles(prev => ({
                ...prev,
                [key]: {
                    originalFile: file,
                    name: response.originalName || file.name,
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
            case 1: // Work Details
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Copyright size={20} className="text-orange-500" /> WORK DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Title of Work</label>
                                    <input type="text" name="workTitle" value={formData.workTitle} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.workTitle ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. My Book Title" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Category</label>
                                    <select name="workCategory" value={formData.workCategory} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="LITERARY">Literary (Books / Text)</option>
                                        <option value="ARTISTIC">Artistic (Logo / Design)</option>
                                        <option value="SOFTWARE">Software / Code</option>
                                        <option value="MUSIC">Musical Work</option>
                                        <option value="CINEMATOGRAPH">Cinematograph (Video)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Author Name</label>
                                    <input type="text" name="authorName" value={formData.authorName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.authorName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Status</label>
                                    <select name="publicationStatus" value={formData.publicationStatus} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="UNPUBLISHED">Unpublished</option>
                                        <option value="PUBLISHED">Published</option>
                                    </select>
                                </div>
                            </div>

                            {formData.publicationStatus === 'PUBLISHED' && (
                                <div className="animate-in fade-in">
                                    <label className="text-xs font-bold text-gray-500 block mb-1">First Publication Date</label>
                                    <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.publicationDate ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2: // Upload
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-orange-500" /> UPLOAD WORK
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { id: 'WORK_COPY', label: 'Copy of Work (PDF/Img/Zip)' },
                                    { id: 'NOC', label: 'NOC (If Author ≠ Applicant)' },
                                    { id: 'ID_PROOF', label: 'ID Proof of Applicant' }
                                ].map((doc) => (
                                    <div key={doc.id} className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1">{doc.label}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} accept=".pdf,.jpg,.png,.zip" />
                                            {uploadedFiles[doc.id] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles[doc.id].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3: // Payment
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Professional Fee</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-lg font-bold text-[#2B3446]">₹2,999</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between items-end">
                                <span className="font-black text-gray-700">Total</span>
                                <span className="text-3xl font-black text-orange-600">₹2,999</span>
                            </div>
                            <p className="text-xs text-center mt-4 text-gray-400">Govt Fees will be calculated based on category.</p>
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
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl,
                type: k
            }));

            const finalPayload = {
                submissionId: `CPR-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                workTitle: formData.workTitle,
                plan: planType,
                amountPaid: getTotalPrice(),
                status: "PAYMENT_SUCCESSFUL",
                formData: formData,
                documents: docsList
            };

            await submitCopyrightRegistration(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF7ED] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Copyright Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your application for <b>{formData.workTitle}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Copyright Registration</h1>
                        <p className="text-gray-500">Protect your Creative Works</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Work Details', 'Upload Files', 'Payment'].map((step, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${currentStep === i + 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">STEP {i + 1}</span>
                                            <span className={`font-bold text-sm ${currentStep === i + 1 ? 'text-orange-700' : 'text-gray-600'}`}>{step}</span>
                                        </div>
                                        {currentStep > i + 1 && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-xs text-orange-800">
                                <strong>Estimated Fees:</strong> <br />
                                <span className="text-lg font-bold">Standard Filing</span>
                                <div className="mt-2 text-xl font-black text-orange-900">₹2,999</div>
                                <div className="text-[10px] text-orange-600 mt-1 opacity-75">Govt Fees Extra</div>
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

                            {!isSuccess && currentStep < 3 && (
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

export default ApplyCopyrightRegistration;
