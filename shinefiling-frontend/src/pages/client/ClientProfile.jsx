import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Lock, Database, Camera, ShieldCheck, ChevronRight } from 'lucide-react';
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

            // Update state
            const newImage = res.profileImage;
            const updatedUser = { ...user, profileImage: newImage };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist to local storage

            alert("Profile Picture Updated!");
            window.location.reload(); // Refresh to update header avatar
        } catch (error) {
            console.error(error);
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
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMsg({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Profile Form */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-[#10232A] flex items-center gap-2">
                            <User size={20} className="text-[#3D4D55]" /> Personal Information
                        </h3>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                            <ShieldCheck size={12} /> KYC Verified
                        </span>
                    </div>

                    <div className="p-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-xl w-24 h-24">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#B58863] to-[#D4B08C] flex items-center justify-center text-white">
                                        {user.fullName ? <span className="text-3xl font-bold">{user.fullName.charAt(0)}</span> : <User size={36} />}
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-[#10232A]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera size={24} className="text-white" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#10232A] mb-1">{user.fullName || 'User Name'}</h2>
                                <p className="text-[#3D4D55] text-sm font-medium">Client Account • ID: #{user.id || '---'}</p>
                            </div>
                        </div>

                        {msg.text && (
                            <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {msg.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#3D4D55] uppercase tracking-wider">Full Name</label>
                                <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl focus-within:border-[#B58863] focus-within:ring-2 focus-within:ring-[#B58863]/20 transition">
                                    <User size={18} className="text-[#3D4D55]" />
                                    <input name="fullName" value={user.fullName || ''} onChange={handleChange} className="bg-transparent w-full text-[#10232A] font-medium text-sm focus:outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#3D4D55] uppercase tracking-wider">Email Address</label>
                                <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                                    <Mail size={18} className="text-[#3D4D55]" />
                                    <input disabled value={user.email || ''} className="bg-transparent w-full text-[#3D4D55] font-medium text-sm focus:outline-none cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#3D4D55] uppercase tracking-wider">Mobile Number</label>
                                <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl focus-within:border-[#B58863] focus-within:ring-2 focus-within:ring-[#B58863]/20 transition">
                                    <Phone size={18} className="text-[#3D4D55]" />
                                    <input name="mobile" value={user.mobile || ''} onChange={handleChange} type="tel" className="bg-transparent w-full text-[#10232A] font-medium text-sm focus:outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#3D4D55] uppercase tracking-wider">Location</label>
                                <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl focus-within:border-[#B58863] focus-within:ring-2 focus-within:ring-[#B58863]/20 transition">
                                    <MapPin size={18} className="text-[#3D4D55]" />
                                    <input name="address" value={user.address || ''} onChange={handleChange} placeholder="City, State" className="bg-transparent w-full text-[#10232A] font-medium text-sm focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                            <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-[#10232A] text-white font-bold rounded-xl shadow-lg hover:bg-[#B58863] transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 text-sm">
                                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Boxes (DigiLocker & Security) */}
                <div className="space-y-6">
                    {/* DigiLocker */}
                    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                    <Database size={20} />
                                </div>
                                <h4 className="font-bold text-lg">DigiLocker</h4>
                            </div>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">Connect your government DigiLocker account to automatically fetch PAN, Aadhaar, and other KYC documents.</p>
                            <button className="w-full py-3 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                                Connect Wallet
                            </button>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                                <Lock size={20} />
                            </div>
                            <h4 className="font-bold text-[#10232A] text-lg">Security</h4>
                        </div>
                        <div className="space-y-2">
                            <button className="w-full text-left py-3 px-4 rounded-xl text-sm font-semibold text-[#3D4D55] hover:bg-[#FDFBF7] hover:text-[#10232A] transition-all flex justify-between items-center group">
                                Change Password
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#B58863] group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left py-3 px-4 rounded-xl text-sm font-semibold text-[#3D4D55] hover:bg-[#FDFBF7] hover:text-[#10232A] transition-all flex justify-between items-center group">
                                Enable 2FA
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#B58863] group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left py-3 px-4 rounded-xl text-sm font-semibold text-[#3D4D55] hover:bg-[#FDFBF7] hover:text-[#10232A] transition-all flex justify-between items-center group">
                                Active Sessions
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#B58863] group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
