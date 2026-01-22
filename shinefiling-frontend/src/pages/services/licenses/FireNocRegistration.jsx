import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Upload, FileText,
    ArrowLeft, ArrowRight, IndianRupee, MapPin, Flame, Building, AlertTriangle
} from 'lucide-react';
import { uploadFile, submitFireNoc } from '../../../api';

const FireNocRegistration = ({ isLoggedIn }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);

    // Protect Route
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const isReallyLoggedIn = isLoggedIn || !!storedUser;

        if (!isReallyLoggedIn) {
            navigate('/login', { state: { from: `/services/licenses/fire-safety-noc/apply` } });
        }
    }, [isLoggedIn, navigate]);

    const [formData, setFormData] = useState({
        buildingName: '',
        state: '',
        requestType: 'NEW', // NEW, RENEWAL
        buildingType: '',
        address: '',
        heightInMeters: '',
        numberOfFloors: '',
        plotAreaSqMeters: '',
        accessRoadWidth: '',
        hasExtinguishers: false,
        hasHydrants: false,
        hasSprinklers: false,
        hasFireAlarm: false,
        hasEmergencyExits: false
    });

    const [uploadedFiles, setUploadedFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [errors, setErrors] = useState({});

    const price = 14999;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.buildingName) { newErrors.buildingName = "Building Name required"; isValid = false; }
            if (!formData.state) { newErrors.state = "State required"; isValid = false; }
            if (!formData.buildingType) { newErrors.buildingType = "Building Type required"; isValid = false; }
            if (!formData.address) { newErrors.address = "Address required"; isValid = false; }
        }
        else if (step === 2) {
            if (!formData.heightInMeters) { newErrors.heightInMeters = "Height required"; isValid = false; }
            if (!formData.numberOfFloors) { newErrors.numberOfFloors = "Floors required"; isValid = false; }
            if (!formData.plotAreaSqMeters) { newErrors.plotAreaSqMeters = "Plot Area required"; isValid = false; }

            // High-Rise warning (soft validation)
            if (parseFloat(formData.heightInMeters) >= 15 && !formData.hasSprinklers) {
                if (!window.confirm("High-Rise buildings (>15m) typically require Sprinklers. Continue without selecting them?")) {
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(4, prev + 1));
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await uploadFile(file, 'fire_noc');
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
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Building size={20} className="text-orange-600" /> BUILDING DETAILS
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Building Name</label>
                                    <input type="text" name="buildingName" value={formData.buildingName} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.buildingName ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">State</label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-200'}`}>
                                        <option value="">Select State</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Gujarat">Gujarat</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Request Type</label>
                                    <select name="requestType" value={formData.requestType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-gray-200">
                                        <option value="NEW">New NOC</option>
                                        <option value="RENEWAL">Renewal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Building Type</label>
                                    <select name="buildingType" value={formData.buildingType} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.buildingType ? 'border-red-500' : 'border-gray-200'}`}>
                                        <option value="">Select</option>
                                        <option value="COMMERCIAL">Commercial</option>
                                        <option value="RESIDENTIAL_APT">Residential Apartment</option>
                                        <option value="INDUSTRIAL">Industrial</option>
                                        <option value="HOSPITAL">Hospital</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 block mb-1">Site Address</label>
                                <textarea name="address" rows="2" value={formData.address} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-200'}`}></textarea>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2">
                                <Flame size={20} className="text-orange-600" /> DIMENSIONS & SAFETY
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Height (m)</label>
                                    <input type="number" step="0.1" name="heightInMeters" value={formData.heightInMeters} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.heightInMeters ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">No. of Floors</label>
                                    <input type="number" name="numberOfFloors" value={formData.numberOfFloors} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.numberOfFloors ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Plot Area (sq m)</label>
                                    <input type="number" step="0.1" name="plotAreaSqMeters" value={formData.plotAreaSqMeters} onChange={handleInputChange} className={`w-full p-3 rounded-lg border ${errors.plotAreaSqMeters ? 'border-red-500' : 'border-gray-200'}`} />
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <h4 className="font-bold text-red-900 mb-2 text-xs uppercase">Safety Systems Installed</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Extinguishers', 'Hydrants', 'Sprinklers', 'FireAlarm', 'EmergencyExits'].map(sys => (
                                        <label key={sys} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name={`has${sys}`} checked={formData[`has${sys}`]} onChange={handleInputChange} className="w-4 h-4 text-red-600 rounded" />
                                            <span className="text-sm font-medium text-gray-700">{sys.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Upload size={20} className="text-orange-600" /> DOCUMENTS</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {['BUILDING_PLAN', 'FIRE_LAYOUT', 'ELECTRIC_CERT'].map((docKey) => (
                                    <div key={docKey} className="border border-dashed p-6 rounded-xl text-center group hover:border-orange-300 transition">
                                        <label className="cursor-pointer block">
                                            <div className="mb-2 mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition">
                                                <FileText size={24} />
                                            </div>
                                            <span className="font-bold text-gray-700 block mb-1 capitalize">{docKey.replace('_', ' ').toLowerCase()}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, docKey)} accept=".pdf,.jpg" />
                                            {uploadedFiles[docKey] ?
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{uploadedFiles[docKey].name}</span> :
                                                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">Choose File</span>
                                            }
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#2B3446] mb-2">Payment Summary</h2>
                        <p className="text-gray-500 mb-8">Professional Fee for Fire NOC</p>

                        <div className="max-w-xs mx-auto bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-3xl font-black text-[#2B3446]">₹{price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end text-xs text-gray-400">
                                <span>Govt Fee</span>
                                <span>Actuals Extra</span>
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
            const docsList = Object.entries(uploadedFiles).map(([k, v]) => ({
                id: k,
                filename: v.name,
                fileUrl: v.fileUrl
            }));

            const finalPayload = {
                submissionId: `FIRE-${Date.now()}`,
                userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com',
                plan: "standard",
                amountPaid: price,
                buildingName: formData.buildingName,
                state: formData.state,
                requestType: formData.requestType,
                status: "PAYMENT_SUCCESSFUL",
                formData: {
                    ...formData,
                    heightInMeters: parseFloat(formData.heightInMeters) || 0,
                    numberOfFloors: parseInt(formData.numberOfFloors) || 0,
                    plotAreaSqMeters: parseFloat(formData.plotAreaSqMeters) || 0,
                    accessRoadWidth: parseFloat(formData.accessRoadWidth) || 0
                },
                documents: docsList
            };

            const response = await submitFireNoc(finalPayload);
            setIsSuccess(true);

        } catch (error) {
            console.error(error);
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] pb-20 pt-24 px-4 md:px-8">
            {isSuccess ? (
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B3446] mb-4">Application Submitted!</h1>
                    <p className="text-gray-500 mb-8">
                        Your Fire NOC application for <b>{formData.buildingName}</b> has been received.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="bg-[#2B3446] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Go to Dashboard</button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-4 font-bold text-xs uppercase hover:text-black transition"><ArrowLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-black text-[#2B3446]">Fire Safety NOC</h1>
                        <p className="text-gray-500">Fire Department No Objection Certificate</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                                {['Building Details', 'Safety Specs', 'Documents', 'Payment'].map((step, i) => (
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
                                <strong>Selected Plan:</strong> <br />
                                <span className="text-lg font-bold">Standard NOC</span>
                                <div className="mt-2 text-xl font-black text-orange-900">₹{price.toLocaleString()}</div>
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

export default FireNocRegistration;
