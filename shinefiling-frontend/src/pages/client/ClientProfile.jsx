import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Lock, Database, Camera, ShieldCheck, ChevronRight, Fingerprint, AlertTriangle } from 'lucide-react';
import { updateUserProfile, uploadProfilePicture } from '../../api';

const ClientProfile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user.id) return;
        try {
            setLoading(true);
            const res = await uploadProfilePicture(user.id, file);
            const updatedUser = { ...user, profileImage: res.profileImage };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist to local storage
            window.dispatchEvent(new Event('userUpdated'));
            setMsg({ type: 'success', text: "Profile Picture Updated!" });
        } catch (error) {
            setMsg({ type: 'error', text: 'Failed to upload photo.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user.id) return;
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await updateUserProfile(user.id, user);
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('userUpdated'));
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMsg({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-[#043E52] dark:text-white">Account Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <div className="lg:col-span-2 bg-white dark:bg-[#043E52] rounded-3xl shadow-sm border border-slate-100 dark:border-[#1C3540] overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-[#1C3540] flex justify-between items-center bg-[#FDFBF7] dark:bg-[#043E52]">
                        <h3 className="font-bold text-lg text-[#043E52] dark:text-white flex items-center gap-2">
                            Profile Details
                        </h3>
                        <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800">
                            <ShieldCheck size={12} /> KYC Verified
                        </span>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                            <div className="relative group cursor-pointer">
                                <div className="overflow-hidden rounded-full border-4 border-white shadow-2xl w-32 h-32 relative z-10">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#ED6E3F] flex items-center justify-center text-white">
                                            {user.fullName ? <span className="text-4xl font-bold">{user.fullName.charAt(0)}</span> : <User size={48} />}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 z-20 bg-[#043E52] text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-[#ED6E3F] transition hover:scale-110">
                                    <Camera size={18} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>

                            <div className="text-center md:text-left pt-2">
                                <h2 className="text-2xl font-bold text-[#043E52] dark:text-white mb-1">{user.fullName || 'User Name'}</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">Client Account • ID: <span className="font-mono text-xs bg-slate-100 dark:bg-[#1C3540] px-1.5 py-0.5 rounded">#{user.id || '---'}</span></p>
                                <p className="text-xs text-slate-400 max-w-xs">Update your photo and personal details here.</p>
                            </div>
                        </div>

                        {msg.text && (
                            <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {msg.type === 'success' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />} {msg.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl focus-within:border-[#ED6E3F] focus-within:ring-4 focus-within:ring-[#ED6E3F]/10 transition">
                                    <User size={18} className="text-slate-400" />
                                    <input name="fullName" value={user.fullName || ''} onChange={handleChange} className="bg-transparent w-full text-slate-800 dark:text-white font-bold text-sm focus:outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-[#152a33] border border-slate-200 dark:border-[#2A4550] rounded-xl cursor-not-allowed opacity-75">
                                    <Mail size={18} className="text-slate-400" />
                                    <input disabled value={user.email || ''} className="bg-transparent w-full text-slate-500 dark:text-slate-400 font-bold text-sm focus:outline-none cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Mobile Number</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl focus-within:border-[#ED6E3F] focus-within:ring-4 focus-within:ring-[#ED6E3F]/10 transition">
                                    <Phone size={18} className="text-slate-400" />
                                    <input name="mobile" value={user.mobile || ''} onChange={handleChange} type="tel" className="bg-transparent w-full text-slate-800 dark:text-white font-bold text-sm focus:outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Location</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#1C3540] border border-slate-200 dark:border-[#2A4550] rounded-xl focus-within:border-[#ED6E3F] focus-within:ring-4 focus-within:ring-[#ED6E3F]/10 transition">
                                    <MapPin size={18} className="text-slate-400" />
                                    <input name="address" value={user.address || ''} onChange={handleChange} placeholder="City, State" className="bg-transparent w-full text-slate-800 dark:text-white font-bold text-sm focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-[#1C3540] flex justify-end">
                            <button onClick={handleSave} disabled={loading} className="px-8 py-3.5 bg-[#043E52] dark:bg-[#ED6E3F] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 text-sm">
                                <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Boxes */}
                <div className="space-y-6">
                    {/* DigiLocker */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/20">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl leading-none">DigiLocker</h4>
                                    <span className="text-[10px] opacity-70 uppercase tracking-wider font-bold">Connected India</span>
                                </div>
                            </div>
                            <p className="text-blue-100/80 text-sm mb-8 leading-relaxed font-medium">Auto-fetch Aadhaar, PAN, and other KYC documents securely from government servers.</p>
                            <button className="w-full py-3.5 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                                Connect Wallet
                            </button>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white dark:bg-[#043E52] border border-slate-100 dark:border-[#1C3540] p-6 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl border border-rose-100 dark:border-rose-900/30">
                                <Lock size={20} />
                            </div>
                            <h4 className="font-bold text-[#043E52] dark:text-white text-lg">Login & Security</h4>
                        </div>
                        <div className="space-y-3">
                            {['Change Password', 'Two-Factor Authentication', 'Active Sessions'].map((item, i) => (
                                <button key={i} className="w-full text-left py-4 px-5 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#1C3540] hover:bg-slate-100 dark:hover:bg-[#2A4550] transition-all flex justify-between items-center group">
                                    {item}
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-[#ED6E3F] group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
