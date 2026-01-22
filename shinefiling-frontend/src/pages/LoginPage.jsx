import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Phone, AlertCircle, LogIn, X, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser, googleLogin } from '../api';
import loginHero from '../assets/login_hero.png';


const LoginPage = ({ onLogin }) => {
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'otp'
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

                // Save user/token with timestamp
                const userWithTimestamp = { ...data, loginTimestamp: Date.now() };
                localStorage.setItem('user', JSON.stringify(userWithTimestamp));
                onLogin(userWithTimestamp);

                // Redirect based on Role
                if (data.role === 'ADMIN' || data.email.includes('admin')) {
                    navigate('/admin-dashboard');
                } else if (data.role === 'AGENT') {
                    navigate('/agent-dashboard');
                } else if (data.role === 'CA') {
                    navigate('/ca-dashboard');
                } else if (data.role === 'EMPLOYEE') {
                    navigate('/employee-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } catch (err) {
                setError(err.message || 'Google Login failed.');
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Login Failed');
            setLoading(false);
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await loginUser(formData);

            // Save user/token with timestamp
            const userWithTimestamp = { ...data, loginTimestamp: Date.now() };
            localStorage.setItem('user', JSON.stringify(userWithTimestamp));
            onLogin(userWithTimestamp);

            // Redirect based on Role
            if (data.role === 'ADMIN' || data.email.includes('admin')) {
                navigate('/admin-dashboard');
            } else if (data.role === 'AGENT') {
                navigate('/agent-dashboard');
            } else if (data.role === 'CA') {
                navigate('/ca-dashboard');
            } else if (data.role === 'EMPLOYEE') {
                navigate('/employee-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-[#F2F1EF]">
            {/* LEFT: Hero / Branding (Premium Dark) - Hidden on Mobile */}
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
                        Secure Access to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-yellow-200">Your Empire.</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-md leading-relaxed mb-8">
                        Effortlessly manage your business compliance, tax filings, and legal documents in one powerful dashboard.
                    </p>

                    <div className="space-y-4">
                        {[
                            { text: "Bank-Grade Encryption", sub: "Your data is always safe." },
                            { text: "Real-time Updates", sub: "Track progress as it happens." },
                            { text: "24/7 Expert Support", sub: "Direct access to professionals." }
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

                <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 font-medium mt-12 border-t border-white/5 pt-8">
                    <p>© {new Date().getFullYear()} ShineFiling.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            {/* RIGHT: Login Form (Clean Card Style) */}
            <div className="flex items-center justify-center p-4 sm:p-6 relative w-full h-full overflow-y-auto">
                <Link to="/" className="absolute top-6 right-6 p-2 text-slate-400 hover:text-navy hover:bg-slate-200 rounded-full transition-all md:hidden z-20">
                    <X size={24} />
                </Link>

                {/* Card Container for Neatness */}
                <div className="w-full max-w-[420px] bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative">

                    {/* Header */}
                    <div className="mb-6 text-center md:text-left">
                        {/* Mobile Only Logo */}
                        <div className="md:hidden flex justify-center mb-4">
                            <div className="w-14 h-14 bg-[#10232A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-navy/20">
                                <Shield size={24} fill="currentColor" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-navy mb-2">Welcome Back</h2>
                        <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
                    </div>

                    {/* Method Switcher */}
                    <div className="flex p-1.5 bg-[#F8F9FA] border border-slate-200 rounded-2xl mb-8">
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${loginMethod === 'email' ? 'bg-navy text-white shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-navy hover:bg-white/50'}`}
                        >
                            Email Login
                        </button>
                        <button
                            onClick={() => setLoginMethod('otp')}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${loginMethod === 'otp' ? 'bg-navy text-white shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-navy hover:bg-white/50'}`}
                        >
                            Mobile OTP
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-4 text-xs flex items-start gap-3 animate-in slide-in-from-top-2 fade-in">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block mb-0.5">Authentication Error</span>
                                <span className="text-red-500/90">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {loginMethod === 'email' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@company.com"
                                            className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Password</label>
                                        <Link to="/forgot-password" className="text-[10px] font-bold text-bronze hover:text-navy transition-colors">Forgot Password?</Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-11 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                            required
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy p-1"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-navy uppercase tracking-wider ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-bronze transition-colors duration-300" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="w-full h-11 bg-[#F8F9FA] border border-slate-200 text-navy rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:bg-white focus:border-bronze focus:ring-4 focus:ring-bronze/10 transition-all duration-300"
                                    />
                                </div>
                                <button type="button" className="text-[10px] font-bold text-bronze hover:underline w-full text-right mt-1 flex justify-end items-center gap-1 group/btn">
                                    Send Verification Code <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 flex items-center justify-center bg-navy text-white rounded-xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-bronze hover:shadow-bronze/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
                        >
                            {loading ? 'Logging In...' : (loginMethod === 'email' ? 'Login Securely' : 'Verify & Login')}
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

                    <p className="text-center text-slate-500 text-xs font-medium mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-bronze font-bold hover:text-navy transition-colors inline-flex items-center gap-1 group/link">
                            Create Account <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
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

export default LoginPage;
