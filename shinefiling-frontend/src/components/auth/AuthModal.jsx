import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Mail, Lock, Smartphone, ChevronRight,
    Shield, CheckCircle, ArrowRight, User,
    AlertCircle, Eye, EyeOff, Building
} from 'lucide-react';
import { loginUser, signupUser, verifyOtp, resendOtp, googleLogin } from '../../api';
import { useGoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
    const [step, setStep] = useState('details'); // 'details' or 'otp' for signup
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        mobile: '',
        role: 'USER'
    });
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError('');
            setStep('details');
        }
    }, [isOpen, initialMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                }).then(res => res.json());

                const data = await googleLogin({
                    email: userInfo.email,
                    name: userInfo.name,
                    googleId: userInfo.sub
                });

                localStorage.setItem('user', JSON.stringify({ ...data, loginTimestamp: Date.now() }));
                if (onAuthSuccess) onAuthSuccess(data);
                onClose();
            } catch (err) {
                setError('Google authentication failed.');
            } finally {
                setLoading(false);
            }
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                const data = await loginUser(formData);
                localStorage.setItem('user', JSON.stringify({ ...data, loginTimestamp: Date.now() }));
                if (onAuthSuccess) onAuthSuccess(data);
                onClose();
            } else {
                if (step === 'details') {
                    await signupUser(formData);
                    setStep('otp');
                } else {
                    await verifyOtp({ email: formData.email, otp });
                    setMode('login');
                    setStep('details');
                    setError('Account verified successfully! Please login.');
                }
            }
        } catch (err) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#043E52]/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-[900px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
                >
                    {/* LEFT: Branding/Info */}
                    <div className="hidden md:flex w-2/5 bg-[#043E52] p-10 flex-col justify-between relative overflow-hidden text-white">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#043E52]/90 via-[#043E52]/70 to-[#043E52]/90"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-12">
                                <img src="/logo.png" alt="Logo" className="h-[120px] w-auto brightness-200" />
                            </div>

                            <h2 className="text-3xl font-bold leading-tight mb-4 tracking-tight">
                                {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium">
                                {mode === 'login'
                                    ? 'Access your unified compliance dashboard and manage all your filings in one place.'
                                    : 'Join thousands of businesses managed through our expert-led compliance platform.'}
                            </p>

                            <div className="space-y-4">
                                {[
                                    { text: "Real-time Tracking", icon: Building },
                                    { text: "Expert Legal Support", icon: Shield },
                                    { text: "Secure Document Vault", icon: Lock }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                            <item.icon size={16} className="text-[#ED6E3F]" />
                                        </div>
                                        <span className="text-xs font-bold text-white/90">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 pt-8 border-t border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            © {new Date().getFullYear()} ShineFiling. Professional Partner.
                        </div>
                    </div>

                    {/* RIGHT: Form Area */}
                    <div className="flex-1 p-8 md:p-10 flex flex-col relative bg-white max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-[#043E52] hover:bg-slate-100 rounded-full transition-all z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-[#043E52] tracking-tight">
                                {mode === 'login' ? 'Sign In' : (step === 'details' ? 'Create Account' : 'Verify Identity')}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1 font-medium">
                                {mode === 'login' ? 'Enter your details to access your portal' : 'Start your journey with us today'}
                            </p>
                        </div>

                        {/* Login Method Switcher (Only for Login) */}
                        {mode === 'login' && (
                            <div className="flex p-1.5 bg-[#F8F9FA] border border-slate-200 rounded-2xl mb-6">
                                <button
                                    onClick={() => setLoginMethod('email')}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${loginMethod === 'email' ? 'bg-[#043E52] text-white shadow-md' : 'text-slate-500 hover:text-[#043E52]'}`}
                                >
                                    Email Login
                                </button>
                                <button
                                    onClick={() => setLoginMethod('otp')}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${loginMethod === 'otp' ? 'bg-[#043E52] text-white shadow-md' : 'text-slate-500 hover:text-[#043E52]'}`}
                                >
                                    Mobile OTP
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-xs animate-in slide-in-from-top-2 fade-in ${error.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold' : 'bg-red-50 text-red-700 border border-red-100 font-bold'}`}>
                                {error.includes('successfully') ? <CheckCircle size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'signup' && step === 'details' && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#043E52] uppercase tracking-wider ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full h-11 bg-[#F8F9FA] border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] focus:bg-white focus:ring-4 focus:ring-[#ED6E3F]/5 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Role Selection */}
                                    <div className="space-y-2 py-1">
                                        <label className="text-[10px] font-black text-[#043E52] uppercase tracking-wider ml-1">I am a</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'USER', label: 'Business Owner', icon: User },
                                                { id: 'AGENT', label: 'Partner / Agent', icon: Shield }
                                            ].map((role) => (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${formData.role === role.id
                                                        ? (role.id === 'USER' ? 'bg-[#043E52]/5 border-[#043E52] text-[#043E52]' : 'bg-emerald-50 border-emerald-500 text-emerald-700')
                                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={`mb-1.5 ${formData.role === role.id ? (role.id === 'USER' ? 'text-[#043E52]' : 'text-emerald-500') : 'text-slate-300'}`}>
                                                        <role.icon size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{role.label}</span>
                                                    {formData.role === role.id && (
                                                        <div className="absolute top-2 right-2">
                                                            <CheckCircle size={14} fill="currentColor" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 'details' ? (
                                <>
                                    {loginMethod === 'email' ? (
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-[#043E52] uppercase tracking-wider ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" size={18} />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@company.com"
                                                        className="w-full h-11 bg-[#F8F9FA] border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] focus:bg-white focus:ring-4 focus:ring-[#ED6E3F]/5 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-black text-[#043E52] uppercase tracking-wider">Password</label>
                                                    {mode === 'login' && <button type="button" className="text-[10px] font-bold text-[#ED6E3F] hover:underline">Forgot Password?</button>}
                                                </div>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" size={18} />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="••••••••"
                                                        className="w-full h-11 bg-[#F8F9FA] border border-slate-200 rounded-xl pl-12 pr-12 text-sm font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] focus:bg-white focus:ring-4 focus:ring-[#ED6E3F]/5 transition-all"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#043E52]"
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {mode === 'signup' && (
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-[#043E52] uppercase tracking-wider ml-1">Mobile Number</label>
                                                    <div className="relative group">
                                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" size={18} />
                                                        <input
                                                            type="tel"
                                                            name="mobile"
                                                            value={formData.mobile}
                                                            onChange={handleChange}
                                                            placeholder="91 98765 43210"
                                                            className="w-full h-11 bg-[#F8F9FA] border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] focus:bg-white focus:ring-4 focus:ring-[#ED6E3F]/5 transition-all"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-[#043E52] uppercase tracking-wider ml-1">Mobile Number</label>
                                            <div className="relative group">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ED6E3F] transition-colors" size={18} />
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleChange}
                                                    placeholder="91 98765 43210"
                                                    className="w-full h-11 bg-[#F8F9FA] border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-semibold text-[#043E52] focus:outline-none focus:border-[#ED6E3F] focus:bg-white focus:ring-4 focus:ring-[#ED6E3F]/5 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-6 pt-4">
                                    <div className="text-center space-y-2">
                                        <p className="text-sm text-slate-600 font-medium">Verify your email address</p>
                                        <p className="text-xs text-slate-400">Enter the 6-digit code sent to <b className="text-[#043E52]">{formData.email}</b></p>
                                    </div>
                                    <div className="flex justify-center">
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="0 0 0 0 0 0"
                                            className="w-full h-16 bg-[#F8F9FA] border-2 border-slate-200 rounded-2xl text-center text-3xl font-black tracking-widest text-[#043E52] focus:outline-none focus:border-[#ED6E3F] focus:bg-white focus:ring-8 focus:ring-[#ED6E3F]/5 transition-all"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => resendOtp(formData.email)}
                                            className="text-[10px] font-black uppercase tracking-widest text-[#ED6E3F] hover:text-[#043E52] transition-colors"
                                        >
                                            Didn't receive code? Resend
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-[#043E52] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#043E52]/20 hover:bg-[#ED6E3F] hover:shadow-[#ED6E3F]/30 transition-all duration-300 flex items-center justify-center gap-3 group mt-4 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative z-10">{loading ? 'Processing...' : (mode === 'login' ? 'Sign In Now' : (step === 'details' ? 'Create My Account' : 'Verify & Continue'))}</span>
                                {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                            </button>

                            {mode === 'signup' && step === 'details' && (
                                <p className="text-[10px] text-slate-400 text-center leading-relaxed px-4 pt-2">
                                    By creating an account, you agree to our <a href="#" className="text-slate-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-slate-600 font-bold hover:underline">Privacy Policy</a>.
                                </p>
                            )}
                        </form>

                        {step === 'details' && (
                            <div className="mt-8 flex flex-col items-center gap-6">
                                <div className="w-full flex items-center gap-4">
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or Securely</span>
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleGoogleLogin()}
                                    className="w-full h-11 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all bg-white shadow-sm group"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-slate-600">Continue with Google</span>
                                </button>

                                <button
                                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                    className="text-xs text-slate-500 font-bold"
                                >
                                    {mode === 'login' ? "New to ShineFiling?" : "Already have an account?"}
                                    <span className="text-[#ED6E3F] font-black ml-2 hover:underline cursor-pointer uppercase tracking-wider">
                                        {mode === 'login' ? 'Create Account' : 'Sign In'}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Scrollbar CSS */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #cbd5e1;
                    }
                `}} />
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
