
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Shield, User, CreditCard, Award,
    CheckCircle2, AlertCircle, Upload, ChevronRight,
    ChevronLeft, Lock, FileSignature, Info, Eye,
    ClipboardCheck, Printer, Download, QrCode,
    Building2, Briefcase, Landmark, Camera,
    Check, X, Search, Globe, Languages, Heart,
    Fingerprint, MousePointer2, ShieldCheck, Database
} from 'lucide-react';

const CaKyc = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Detailed form data as per 11 points
    const [formData, setFormData] = useState({
        // 1. Basic Registration
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '987XXXXXX0',
        city: '',
        state: '',
        yearsOfExperience: '',
        practiceType: 'Individual', // Individual / Firm
        isEmailVerified: false,
        isPhoneVerified: false,

        // 2. Identity KYC
        panNumber: '',
        aadharNumber: '',
        passportNumber: '', // Optional
        panCard: null,
        aadharFront: null,
        aadharBack: null,
        selfie: null,

        // 3. CA Qualification
        caMembershipNumber: '',
        copNumber: '',
        yearOfQualification: '',
        caCertificate: null,
        copCertificate: null,

        // 4. Firm Details
        firmName: '',
        firmPan: '',
        gstNumber: '',
        firmRegistrationCertificate: null,
        officeAddress: '',

        // 5. Bank Account
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: '',
        cancelledCheque: null,

        // 6. Profile Completion
        aboutDescription: '',
        servicesOffered: [], // ['ITR Filing', 'GST Filing', 'Audit', 'Company Registration', 'Compliance']
        pricingModel: 'Fixed',
        languages: [],

        // 7. Legal
        agreeToTerms: false,
        agreeToPrivacy: false,
        agreeToNonSolicitation: false,
        agreeToCommission: false,
        digitalSignature: ''
    });

    const [isVerifyingPan, setIsVerifyingPan] = useState(false);
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [activeService, setActiveService] = useState('');

    const steps = [
        { id: 1, title: 'Profile Info', icon: User, desc: 'Experience & Practice' },
        { id: 2, title: 'Identity', icon: CreditCard, desc: 'Aadhar & PAN' },
        { id: 3, title: 'Professional', icon: Award, desc: 'ICAI Credentials' },
        { id: 4, title: 'Firm & Payout', icon: Landmark, desc: 'Bank & Firm Details' },
        { id: 5, title: 'Expertise', icon: Briefcase, desc: 'Services & Profile' },
        { id: 6, title: 'Compliance', icon: ShieldCheck, desc: 'Legal Agreements' }
    ];

    const serviceOptions = [
        'ITR Filing', 'GST Filing', 'Audit', 'Company Registration',
        'Compliance', 'Tax Planning', 'ROC Filing', 'Financial Advisory'
    ];

    const languageOptions = ['English', 'Tamil', 'Hindi', 'Malayalam', 'Telugu', 'Kannada'];

    const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [field]: file });
        }
    };

    const toggleService = (service) => {
        const current = [...formData.servicesOffered];
        if (current.includes(service)) {
            setFormData({ ...formData, servicesOffered: current.filter(s => s !== service) });
        } else {
            setFormData({ ...formData, servicesOffered: [...current, service] });
        }
    };

    const toggleLanguage = (lang) => {
        const current = [...formData.languages];
        if (current.includes(lang)) {
            setFormData({ ...formData, languages: current.filter(l => l !== lang) });
        } else {
            setFormData({ ...formData, languages: [...current, lang] });
        }
    };

    const verifyPan = () => {
        if (formData.panNumber.length !== 10) return;
        setIsVerifyingPan(true);
        setTimeout(() => {
            setIsVerifyingPan(false);
            setIsPanVerified(true);
        }, 1500);
    };

    const [isVerifyingOtp, setIsVerifyingOtp] = useState({ email: false, phone: false });

    const handleVerifyOtp = (type) => {
        setIsVerifyingOtp({ ...isVerifyingOtp, [type]: true });
        setTimeout(() => {
            setIsVerifyingOtp({ ...isVerifyingOtp, [type]: false });
            setFormData(prev => ({ ...prev, [type === 'email' ? 'isEmailVerified' : 'isPhoneVerified']: true }));
        }, 1200);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate detailed submission and review process
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 3000);
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return formData.fullName && formData.city && formData.state && formData.yearsOfExperience && formData.isEmailVerified && formData.isPhoneVerified;
            case 2: return formData.panNumber && formData.aadharNumber && formData.panCard && formData.aadharFront;
            case 3: return formData.caMembershipNumber && formData.copNumber && formData.caCertificate;
            case 4: return formData.accountNumber && formData.ifscCode && formData.cancelledCheque;
            case 5: return formData.servicesOffered.length > 0 && formData.aboutDescription.length > 20;
            case 6: return formData.agreeToTerms && formData.digitalSignature.length > 2;
            default: return false;
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: {
                return (
                    <div className="space-y-8">
                        <div className="premium-card p-8 space-y-8">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Basic Professional Details</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">Tell us about your practice and location</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Practice Type</label>
                                    <div className="flex gap-3">
                                        {['Individual', 'Firm'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setFormData({ ...formData, practiceType: type })}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all border ${formData.practiceType === type ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-orange-500/30'}`}
                                            >
                                                {type === 'Individual' ? <User size={16} /> : <Building2 size={16} />}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Years of Experience</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="number"
                                            placeholder="e.g. 10"
                                            className="input-premium pl-12"
                                            value={formData.yearsOfExperience}
                                            onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">City</label>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Mumbai"
                                            className="input-premium pl-12"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">State</label>
                                    <div className="relative">
                                        <select
                                            className="input-premium appearance-none pr-10"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        >
                                            <option value="">Select State</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Delhi">Delhi</option>
                                        </select>
                                        <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email ID</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            className="input-premium pl-12 pr-28"
                                            value={formData.email}
                                            readOnly={formData.isEmailVerified}
                                        />
                                        <button
                                            onClick={() => handleVerifyOtp('email')}
                                            disabled={formData.isEmailVerified || isVerifyingOtp.email}
                                            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-[10px] font-bold rounded-xl transition-all ${formData.isEmailVerified ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                                        >
                                            {isVerifyingOtp.email ? '...' : formData.isEmailVerified ? 'VERIFIED' : 'VERIFY'}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            className="input-premium pl-12 pr-28"
                                            value={formData.phone}
                                            readOnly={formData.isPhoneVerified}
                                        />
                                        <button
                                            onClick={() => handleVerifyOtp('phone')}
                                            disabled={formData.isPhoneVerified || isVerifyingOtp.phone}
                                            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-[10px] font-bold rounded-xl transition-all ${formData.isPhoneVerified ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                                        >
                                            {isVerifyingOtp.phone ? '...' : formData.isPhoneVerified ? 'VERIFIED' : 'VERIFY'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 2: {
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="premium-card p-8 space-y-8">
                                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Identity Verification</h3>
                                            <p className="text-xs text-slate-500 font-medium tracking-tight">Government issued ID verification</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">PAN Card Number</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                                    <CreditCard size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="ABCDE1234F"
                                                    className="input-premium pl-12 pr-28 uppercase font-mono tracking-widest text-sm"
                                                    value={formData.panNumber}
                                                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                                                />
                                                <button
                                                    onClick={verifyPan}
                                                    disabled={isVerifyingPan || isPanVerified || formData.panNumber.length !== 10}
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-[10px] font-bold rounded-xl transition-all ${isPanVerified ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                                                >
                                                    {isVerifyingPan ? '...' : isPanVerified ? 'VALID' : 'VERIFY'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Aadhar Number</label>
                                            <div className="relative group">
                                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012"
                                                    className="input-premium pl-12 font-mono tracking-widest text-sm"
                                                    value={formData.aadharNumber}
                                                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { id: 'panCard', label: 'PAN Card' },
                                            { id: 'aadharFront', label: 'Aadhar Front' },
                                            { id: 'aadharBack', label: 'Aadhar Back' }
                                        ].map(doc => (
                                            <label key={doc.id} className="premium-card p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500 transition-all border-dashed aspect-square group">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData[doc.id] ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500'}`}>
                                                    {formData[doc.id] ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{doc.label}</span>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl text-white space-y-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <Camera className="text-orange-500" size={20} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Liveness Capture</h4>
                                    </div>

                                    <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group/camera cursor-pointer" onClick={() => document.getElementById('selfie-input').click()}>
                                        {formData.selfie ? (
                                            <div className="w-full h-full p-2">
                                                <div className="w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center">
                                                    <Check size={48} className="text-emerald-500" />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover/camera:scale-110 transition-transform">
                                                    <Camera size={24} className="text-white" />
                                                </div>
                                                <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Selfie</p>
                                            </>
                                        )}
                                        <input id="selfie-input" type="file" capture="user" className="hidden" onChange={(e) => handleFileUpload(e, 'selfie')} />
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Please ensure your face is clearly visible and within the frame.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 3: {
                return (
                    <div className="space-y-8">
                        <div className="premium-card p-8 space-y-8">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">CA Professional Credentials</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">ICAI Registration and COP details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Membership No.</label>
                                    <div className="relative group">
                                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={18} />
                                        <input
                                            placeholder="6 Digits"
                                            className="input-premium pl-12 font-bold"
                                            value={formData.caMembershipNumber}
                                            onChange={(e) => setFormData({ ...formData, caMembershipNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">COP Number</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={18} />
                                        <input
                                            placeholder="5-6 Digits"
                                            className="input-premium pl-12 font-bold"
                                            value={formData.copNumber}
                                            onChange={(e) => setFormData({ ...formData, copNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Year Qualified</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={18} />
                                        <input
                                            placeholder="e.g. 2018"
                                            className="input-premium pl-12 font-bold"
                                            value={formData.yearOfQualification}
                                            onChange={(e) => setFormData({ ...formData, yearOfQualification: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { id: 'caCertificate', label: 'Membership Certificate' },
                                    { id: 'copCertificate', label: 'COP Document' }
                                ].map(doc => (
                                    <div key={doc.id} className="space-y-3">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{doc.label}</label>
                                        <label className="premium-card h-40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-500 transition-all border-dashed group">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData[doc.id] ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500'}`}>
                                                {formData[doc.id] ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{formData[doc.id] ? formData[doc.id].name : 'Click to Upload'}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }
            case 4: {
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="premium-card p-8">
                                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <Landmark className="text-orange-500" size={20} />
                                        <h4 className="text-sm font-bold">Payout Bank Details</h4>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Account Holder Name</label>
                                            <input
                                                className="input-premium font-bold"
                                                value={formData.accountHolderName}
                                                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Account Number</label>
                                                <input
                                                    className="input-premium font-mono tracking-widest"
                                                    value={formData.accountNumber}
                                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">IFSC Code</label>
                                                <input
                                                    className="input-premium font-mono tracking-widest uppercase"
                                                    value={formData.ifscCode}
                                                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                                                />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-4 p-5 premium-card border-dashed cursor-pointer hover:border-orange-500 transition-all group">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.cancelledCheque ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500'}`}>
                                                {formData.cancelledCheque ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-bold uppercase tracking-wider">Cancelled Cheque Photo</p>
                                                <p className="text-[10px] text-slate-500 font-medium truncate">{formData.cancelledCheque ? formData.cancelledCheque.name : 'Proof for bank verification'}</p>
                                            </div>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'cancelledCheque')} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="premium-card p-8 bg-slate-50/50 dark:bg-slate-900/40">
                                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                                        <Building2 className="text-slate-400" size={20} />
                                        <h4 className="text-sm font-bold text-slate-500">Firm Info (Optional)</h4>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Firm Name</label>
                                            <input
                                                className="input-premium font-bold disabled:opacity-50"
                                                disabled={formData.practiceType === 'Individual'}
                                                value={formData.firmName}
                                                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Firm PAN</label>
                                                <input
                                                    className="input-premium font-mono tracking-widest uppercase disabled:opacity-50"
                                                    disabled={formData.practiceType === 'Individual'}
                                                    value={formData.firmPan}
                                                    onChange={(e) => setFormData({ ...formData, firmPan: e.target.value.toUpperCase() })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">GST Number</label>
                                                <input
                                                    className="input-premium font-mono tracking-widest uppercase disabled:opacity-50"
                                                    disabled={formData.practiceType === 'Individual'}
                                                    value={formData.gstNumber}
                                                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 5: {
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="premium-card p-8 space-y-8">
                                    <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <Briefcase className="text-orange-500" size={20} />
                                        <h4 className="text-sm font-bold">Professional Expertise</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Select Your Services</label>
                                        <div className="flex flex-wrap gap-2">
                                            {serviceOptions.map(service => (
                                                <button
                                                    key={service}
                                                    onClick={() => toggleService(service)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.servicesOffered.includes(service) ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                >
                                                    {service}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-8">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Professional Bio</label>
                                            <span className={`text-[10px] font-bold ${formData.aboutDescription.length > 450 ? 'text-rose-500' : 'text-slate-400'}`}>{formData.aboutDescription.length} / 500</span>
                                        </div>
                                        <textarea
                                            placeholder="Tell us about your professional background, specializations, and years of experience..."
                                            className="input-premium h-40 py-4 resize-none"
                                            value={formData.aboutDescription}
                                            onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Languages</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {languageOptions.map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() => toggleLanguage(lang)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${formData.languages.includes(lang) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pricing Model</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Fixed', 'Hourly'].map(model => (
                                                <button
                                                    key={model}
                                                    onClick={() => setFormData({ ...formData, pricingModel: model })}
                                                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${formData.pricingModel === model ? 'bg-white text-slate-900 border-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                                >
                                                    {model}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case 6: {
                return (
                    <div className="space-y-8">
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-6 rounded-[2rem] space-y-6">
                            <div className="flex gap-4">
                                <Shield className="text-amber-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1">Legal Agreements & Disclosures</h4>
                                    <p className="text-[11px] text-amber-800/70 dark:text-amber-400">Please read carefully before digital confirmation. These agreements are legally binding under the IT Act 2000.</p>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar text-[11px] bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/50 scroll-smooth">
                                <p className="font-bold border-b border-amber-200 pb-1 mb-2 uppercase tracking-widest">1. Professional Code of Conduct</p>
                                <p>CAs are bound by the Chartered Accountants Act, 1949. Professional negligence or sharing client data will lead to platform debarment and ICAI disciplinary action.</p>

                                <p className="font-bold border-b border-amber-200 pb-1 mb-2 mt-4 uppercase tracking-widest">2. Data Privacy & Non-Solicitation</p>
                                <p>You shall not solicit clients outside ShineFiling. All communication must happen through the platform. Client data is encrypted and must not be stored on personal devices.</p>

                                <p className="font-bold border-b border-amber-200 pb-1 mb-2 mt-4 uppercase tracking-widest">3. Commission Agreement</p>
                                <p>Platform charges a flat commission of 15% on every successful transaction. TDS will be deducted as per Govt. norms. Payouts will be processed within 48 hours of work completion.</p>
                            </div>

                            <div className="space-y-3 mt-6">
                                {[
                                    { id: 'agreeToTerms', label: 'Accept Platform Terms & Conditions' },
                                    { id: 'agreeToNonSolicitation', label: 'Agree to Non-Solicitation Policy' },
                                    { id: 'agreeToCommission', label: 'Acknowledge Platform Commission & Payout Terms' }
                                ].map(clause => (
                                    <label key={clause.id} className="flex gap-3 items-center p-3 rounded-xl border border-amber-200/50 hover:bg-amber-100 transition-colors cursor-pointer">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${formData[clause.id] ? 'bg-amber-600 border-amber-600' : 'bg-transparent border-amber-300'}`}>
                                            {formData[clause.id] && <Check size={14} className="text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={formData[clause.id]} onChange={() => setFormData({ ...formData, [clause.id]: !formData[clause.id] })} />
                                        <span className="text-[10px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">{clause.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 border border-white/5 shadow-2xl">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h4 className="text-xl font-black tracking-tight underline decoration-orange-500 decoration-4 underline-offset-8">Authorized Digital Signature</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Type your legal name to authorize this verification. This binds your physical documents to your digital profile with a cryptographical timestamp.</p>
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mt-4">
                                    <MousePointer2 size={12} /> IP Address Logged: 102.16.XX.XX
                                </div>
                            </div>
                            <div className="w-full md:w-64 space-y-4">
                                <div className="h-32 bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center group focus-within:border-orange-500 transition-all">
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest pt-2">Legal Authorized Sign</p>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="bg-transparent border-b border-white/10 text-center text-3xl font-signature italic text-orange-500 outline-none w-full py-2 focus:border-orange-500"
                                        value={formData.digitalSignature}
                                        onChange={(e) => setFormData({ ...formData, digitalSignature: e.target.value })}
                                    />
                                    <p className="text-[7px] text-slate-700 italic pb-2">Binding Confirmation {new Date().getFullYear()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            default: return null;
        }
    };

    return (
        <div className="min-h-[500px] flex flex-col font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                .font-signature { font-family: 'Dancing Script', cursive !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>

            {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto mb-10">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-4 border-slate-100 dark:border-slate-800 overflow-hidden">
                        {/* Final Success Certificate UI */}
                        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                            <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/20 rounded-full blur-[80px]"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="space-y-6 text-center md:text-left">
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                            <ShieldCheck size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <span className="text-2xl font-black tracking-tighter uppercase italic block leading-none text-orange-500">ShineFiling</span>
                                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 block mt-1">COMPLIANCE MODULE</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black tracking-tighter md:text-4xl text-white">ONBOARDING CONFIRMED</h1>
                                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-2">Professional Credentials & Identity Verified</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center md:items-end gap-3">
                                    <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/10 text-center min-w-[200px]">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Onboarding Ref.</p>
                                        <p className="text-xl font-mono font-black text-orange-500">SF-CA-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                                        <Database size={12} /> System Status: SECURED
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 md:p-16 space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                <div className="lg:col-span-7 space-y-12">
                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                            <div className="w-8 h-px bg-slate-200"></div> PARTNER BIODATA
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Partner Name</p>
                                                <p className="text-lg font-black text-slate-800 dark:text-white uppercase truncate">{user.fullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Practice Type</p>
                                                <p className="text-lg font-black text-slate-800 dark:text-white uppercase">{formData.practiceType}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ICAI Reg No.</p>
                                                <p className="text-lg font-black text-slate-800 dark:text-white font-mono">{formData.caMembershipNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Verification</p>
                                                <p className="text-sm font-bold text-emerald-500 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-lg w-fit">
                                                    <Check size={14} /> Aadhaar Match
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                            <div className="w-8 h-px bg-slate-200"></div> SCOPE OF EXPERTISE
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {formData.servicesOffered.map(tag => (
                                                <span key={tag} className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">{tag}</span>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
                                    <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem] p-10 relative group overflow-hidden">
                                        <div className="absolute -bottom-10 -left-10 opacity-5 -rotate-12"><QrCode size={150} /></div>
                                        <h3 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 underline underline-offset-8">Authorized Digital Signature</h3>
                                        <div className="text-center py-10">
                                            <p className="font-signature text-6xl text-orange-500 -rotate-3 transition-transform group-hover:scale-110 drop-shadow-xl">{formData.digitalSignature}</p>
                                        </div>
                                        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 space-y-2">
                                            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                <span>Timestamp:</span>
                                                <span>{new Date().toISOString()}</span>
                                            </div>
                                            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                <span>Audit Link:</span>
                                                <span className="text-orange-500 underline">VERIFIED_SECURE</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <QrCode className="text-white/20 shrink-0" size={50} />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Verify Authenticity</p>
                                            <p className="text-[9px] text-white/50 leading-relaxed font-medium">Scan QR to verify this CA Onboarding Certificate on ShineFiling Blockchain Public Ledger.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:shadow-2xl transition-all"><Printer size={20} /> Print Record</button>
                                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:shadow-2xl transition-all"><Download size={20} /> E-Vault Saved</button>
                                </div>
                                <button onClick={onComplete} className="w-full md:w-auto px-20 py-6 bg-orange-500 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/40 hover:scale-[1.05] active:scale-[0.98] transition-all">Finish & Go to Dashboard</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="max-w-6xl mx-auto space-y-12 mb-20 px-4">
                    {/* Progress Header */}
                    <div className="premium-card p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-3 text-center md:text-left">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">KYC <span className="text-orange-500">HUB</span></h2>
                            <p className="text-slate-500 font-semibold uppercase tracking-widest text-[11px] bg-slate-100 dark:bg-slate-800 w-fit px-4 py-1.5 rounded-full">Secure Partner Verification</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Onboarding Progress</p>
                                <p className="text-2xl font-black text-slate-900">{(step / steps.length * 100).toFixed(0)}%</p>
                            </div>
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative shadow-inner overflow-hidden">
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full bg-orange-500"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${step / steps.length * 100}%` }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                />
                                <span className="relative z-10 text-xs font-black text-slate-900 mix-blend-difference">{step}/{steps.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Stepper */}
                    <div className="hidden md:grid grid-cols-6 gap-4">
                        {steps.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => step > s.id && setStep(s.id)}
                                className={`premium-card p-5 group flex flex-col gap-4 text-left transition-all ${step === s.id ? 'border-orange-500 ring-4 ring-orange-500/5' : step < s.id ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-orange-500/50'}`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${step >= s.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                    {step > s.id ? <Check size={20} /> : <s.icon size={20} />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Step {s.id}</p>
                                    <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{s.title}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Form Content */}
                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="min-h-[500px]">
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10">
                        <button onClick={prevStep} disabled={step === 1 || isSubmitting} className="group flex items-center gap-3 px-8 py-4 text-slate-400 hover:text-orange-500 disabled:opacity-20 transition-all font-bold text-sm tracking-wide">
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            BACK
                        </button>

                        <div className="flex gap-4">
                            {step === steps.length ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStepValid() || isSubmitting}
                                    className="btn-premium px-16 py-4 flex items-center gap-3"
                                >
                                    {isSubmitting ? 'SECURELY SAVING...' : <>FINALIZE KYC <ShieldCheck size={20} /></>}
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    disabled={!isStepValid() || isSubmitting}
                                    className="btn-premium px-16 py-4 flex items-center gap-3 group"
                                >
                                    PROCEED <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaKyc;
