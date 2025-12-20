import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle, Smartphone, ArrowRight, X, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { signupUser, verifyOtp, resendOtp, googleLogin } from '../api';
import loginHero from '../assets/login_hero.png';


const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        mobile: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('details'); // details, otp
    const [otp, setOtp] = useState('');

    const googleLoginAction = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                // Fetch user info from Google
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                }).then(res => res.json());

                // Send to backend
                const data = await googleLogin({
                    email: userInfo.email,
                    name: userInfo.name,
                    googleId: userInfo.sub
                });

                // Save user and redirect
                const userWithTimestamp = { ...data, loginTimestamp: Date.now() };
                localStorage.setItem('user', JSON.stringify(userWithTimestamp));
                navigate('/dashboard');
            } catch (err) {
                setError("Google Login failed. Please try again or use email.");
                setLoading(false);
            }
        },
        onError: () => {
            setError("Google Login Failed");
            setLoading(false);
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signupUser(formData);
            setStep('otp');
            setError('');
        } catch (err) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await verifyOtp({ email: formData.email, otp });
            navigate('/login');
        } catch (err) {
            setError(err.message || 'OTP Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await resendOtp(formData.email);
            setError('');
            alert('OTP resent successfully!');
        } catch (err) {
            setError(err.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-[#F2F1EF]">
            {/* LEFT: Hero / Branding (Premium Dark) - Hidden on Mobile */}
            <div className="hidden md:flex flex-col justify-between p-8 lg:p-12 bg-[#10232A] relative overflow-hidden text-white h-full">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src={loginHero} alt="Background" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#10232A]/90 via-[#10232A]/70 to-[#10232A]/90"></div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none z-0"></div>

                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bronze/10 rounded-full blur-[120px] pointer-events-none -mr-32 -mt-32 z-0"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20 z-0"></div>

                <div className="relative z-10 w-full max-w-lg mx-auto md:mx-0">
                    <Link to="/" className="flex items-center gap-3 mb-10 group inline-flex">
                        <div className="w-12 h-12 bg-bronze rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-bronze/30">
                            <Shield size={24} fill="currentColor" />
                        </div>
                        <span className="text-3xl font-black tracking-tight text-white">ShineFiling</span>
                    </Link>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
                        Join the Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-yellow-200">Corporate Compliance.</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-md leading-relaxed mb-8">
                        Start your journey today. Get instant access to expert tools, secure document storage, and real-time filing updates.
                    </p>

                    <div className="space-y-4">
                        {[
                            { text: "Instant Registration", sub: "Get started in less than 2 minutes." },
                            { text: "Secure Document Vault", sub: "Bank-grade encryption for all files." },
                            { text: "Expert Guidance", sub: "Access to top legal professionals." }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <CheckCircle size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{feature.text}</p>
                                    <p className="text-xs text-slate-500">{feature.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 font-medium mt-8 border-t border-white/5 pt-6">
                    <p>© {new Date().getFullYear()} ShineFiling.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            {/* RIGHT: Signup Form (Clean Card Style) */}
            <div className="flex items-center justify-center p-4 sm:p-6 relative w-full h-full overflow-y-auto">
                <Link to="/" className="absolute top-6 right-6 p-2 text-slate-400 hover:text-navy hover:bg-slate-200 rounded-full transition-all md:hidden z-20">
                    <X size={24} />
                </Link>

                <div className="w-full max-w-[420px] bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative my-auto">

                    <div className="mb-6 text-center md:text-left">
                        {/* Mobile Only Logo */}
                        <div className="md:hidden flex justify-center mb-4">
                            <div className="w-12 h-12 bg-[#10232A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-navy/20">
                                <Shield size={24} fill="currentColor" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-navy mb-2">
                            {step === 'details' ? 'Create Account' : 'Verify Email'}
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {step === 'details' ? 'Enter your details to get started.' : `Enter the code sent to ${formData.email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-4 text-xs flex items-start gap-3 animate-in slide-in-from-top-2 fade-in">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block mb-0.5">Registration Error</span>
                                <span className="text-red-500/90">{error}</span>
                            </div>
                        </div>
                    )}

                    {step === 'details' ? (
                        <>
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@company.com"
                                            className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">I am a</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'USER' })}
                                            className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${formData.role === 'USER'
                                                ? 'bg-navy/5 border-navy text-navy shadow-sm'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`mb-1 ${formData.role === 'USER' ? 'text-navy' : 'text-slate-300'}`}>
                                                <User size={20} />
                                            </div>
                                            <span className="text-xs font-bold">Business Owner</span>
                                            {formData.role === 'USER' && (
                                                <div className="absolute top-2 right-2 text-navy">
                                                    <CheckCircle size={12} fill="currentColor" className="text-navy" />
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'AGENT' })}
                                            className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${formData.role === 'AGENT'
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`mb-1 ${formData.role === 'AGENT' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                <Shield size={20} />
                                            </div>
                                            <span className="text-xs font-bold">Partner / Agent</span>
                                            {formData.role === 'AGENT' && (
                                                <div className="absolute top-2 right-2 text-emerald-500">
                                                    <CheckCircle size={12} fill="currentColor" className="text-emerald-500" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@company.com"
                                            className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Mobile</label>
                                        <div className="relative group">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                placeholder="98765..."
                                                className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-2 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 pt-1">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            className="h-3.5 w-3.5 rounded border-slate-300 text-bronze focus:ring-bronze cursor-pointer"
                                            required
                                        />
                                    </div>
                                    <label htmlFor="terms" className="text-[10px] text-slate-500 leading-tight">
                                        I agree to the <a href="#" className="font-bold text-bronze hover:underline">Terms</a> and <a href="#" className="font-bold text-bronze hover:underline">Privacy Policy</a>.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 flex items-center justify-center bg-navy text-white rounded-xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-bronze hover:shadow-bronze/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                    {!loading && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px]">
                                    <span className="bg-white px-3 text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => googleLoginAction()}
                                className="w-full h-11 flex items-center justify-center bg-white border border-slate-200 text-navy rounded-xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
                            >
                                <svg className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Sign in with Google
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Verification Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <CheckCircle className="h-5 w-5 text-bronze" />
                                    </div>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="• • • • • •"
                                        className="w-full h-14 bg-white border border-slate-300 text-navy text-center text-2xl tracking-[0.5em] font-bold rounded-xl focus:outline-none focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all placeholder:text-slate-300"
                                        required
                                        maxLength={6}
                                        autoFocus
                                    />
                                </div>
                                <p className="text-[10px] text-center text-slate-400">Please enter the 6-digit code sent to your email.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 flex items-center justify-center bg-navy text-white rounded-xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-bronze hover:shadow-bronze/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-bronze transition-colors"
                            >
                                Didn't receive code? Resend
                            </button>
                        </form>
                    )}

                    <p className="text-center text-slate-500 text-xs font-medium mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-bronze font-bold hover:text-navy transition-colors inline-flex items-center gap-1 group/link">
                            Log In <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </div>

                {/* Secure Badge Mobile */}
                <div className="absolute bottom-6 left-0 w-full text-center md:hidden pointer-events-none opacity-50">
                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Lock size={10} /> 256-bit Secure SSL Connection
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
