import React, { useState, useEffect } from 'react';
import {
    Shield, Database, Globe, Key, Save, Download, Server, Wifi,
    Bell, Lock, RefreshCw, Cpu, Activity, AlertOctagon, CheckCircle,
    UserX, Terminal, User, Camera, Mail, Moon, Sun, Monitor, Radio, Smartphone, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSystemSettings, updateSystemSettings, uploadProfilePicture, updateUserProfile } from '../../../../api';

// --- Reusable Components ---
const ToggleRow = ({ icon: Icon, color, title, desc, enabled, onToggle }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all cursor-pointer group" onClick={onToggle}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white shadow-sm ring-4 ring-white group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="font-bold text-[#10232A] text-sm group-hover:text-[#B58863] transition-colors">{title}</h4>
                <p className="text-xs text-[#3D4D55]">{desc}</p>
            </div>
        </div>
        <button
            className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${enabled ? 'bg-green-500' : 'bg-gray-200'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

const SectionHeader = ({ icon: Icon, title, desc, color = "text-gray-700", bg = "bg-gray-100" }) => (
    <div className="mb-8 flex items-start justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                <Icon size={24} className={color.replace('text-', 'text-')} /> {/* Simplified for demo, ideally pass text color class */}
            </div>
            <div>
                <h3 className="font-extrabold text-xl text-[#10232A]">{title}</h3>
                <p className="text-sm text-[#3D4D55] mt-1">{desc}</p>
            </div>
        </div>
    </div>
);

const SystemSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    // Load local user first
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Mock State for Profile
    const [profile, setProfile] = useState({
        id: localUser.id || null,
        name: localUser.fullName || 'Master Admin',
        email: localUser.email || 'admin@shinefiling.com',
        role: localUser.role || 'Super User',
        profileImage: localUser.profileImage || null,
        notifications: true,
        theme: 'light'
    });

    // Settings State
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        publicRegistration: true,
        twoFactorAuth: false,
        debugMode: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSystemSettings();
                if (data) {
                    setSettings({
                        maintenanceMode: data.maintenanceMode ?? false,
                        publicRegistration: data.publicRegistration ?? true,
                        twoFactorAuth: data.twoFactorAuth ?? false,
                        debugMode: data.debugMode ?? false
                    });
                }
            } catch (error) {
                console.error("Failed to load system settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !profile.id) return;

        try {
            const res = await uploadProfilePicture(profile.id, file);

            // Update local state and local storage
            const newImage = res.profileImage;
            setProfile(p => ({ ...p, profileImage: newImage }));

            const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
            lsUser.profileImage = newImage;
            localStorage.setItem('user', JSON.stringify(lsUser));

            alert("Profile Image Updated!");
            window.location.reload(); // Refresh to update header
        } catch (error) {
            console.error(error);
            alert("Failed to upload image");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSystemSettings(settings);
            // Also update basic profile info if needed
            if (profile.id) {
                await updateUserProfile(profile.id, { fullName: profile.name, mobile: profile.mobile });
                const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
                lsUser.fullName = profile.name;
                localStorage.setItem('user', JSON.stringify(lsUser));
            }
            await new Promise(r => setTimeout(r, 800));
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User, color: 'text-blue-500' },
        { id: 'general', label: 'General', icon: Globe, color: 'text-indigo-500' },
        { id: 'security', label: 'Security', icon: Shield, color: 'text-red-500' },
        { id: 'integrations', label: 'API Keys', icon: Key, color: 'text-orange-500' },
        { id: 'logs', label: 'System Logs', icon: Terminal, color: 'text-gray-500' },
    ];

    return (
        <div className="flex flex-col md:flex-row h-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* --- SIDEBAR NAVIGATION --- */}
            <div className="w-full md:w-72 flex flex-col gap-6 shrink-0">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 bg-gradient-to-br from-white to-[#FDFBF7]">
                    <div className="w-10 h-10 bg-[#10232A] rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                        <Activity size={20} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#10232A] mb-1">Settings</h2>
                    <p className="text-xs text-[#3D4D55] font-medium">Global Configuration v2.4</p>
                </div>

                <nav className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1 min-h-[500px]">
                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Personal</p>
                    {tabs.slice(0, 1).map(tab => (
                        <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}

                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Workspace</p>
                    {tabs.slice(1, 4).map(tab => (
                        <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}

                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Technical</p>
                    {tabs.slice(4).map(tab => (
                        <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                </nav>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-1 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-gray-50 to-transparent rounded-bl-full -z-10 opacity-50"></div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-32">
                    <AnimatePresence mode='wait'>

                        {/* 1. PROFILE SETTINGS */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-8 max-w-4xl"
                            >
                                <SectionHeader
                                    icon={User}
                                    title="My Profile"
                                    desc="Manage your personal information, avatar and preferences."
                                    color="text-[#B58863]"
                                    bg="bg-[#FDFBF7]"
                                />

                                {/* Avatar Card */}
                                <div className="p-1 rounded-3xl bg-gradient-to-br from-[#10232A] to-[#B58863]">
                                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white rounded-[20px]">
                                        <div className="relative group cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-xl">
                                            {profile.profileImage ? (
                                                <img src={profile.profileImage} alt="Profile" className="w-28 h-28 object-cover" />
                                            ) : (
                                                <div className="w-28 h-28 bg-[#10232A] text-white flex items-center justify-center text-4xl font-bold">
                                                    {profile.name.charAt(0)}
                                                </div>
                                            )}

                                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <Camera size={24} className="text-white" />
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                        <div className="text-center md:text-left flex-1">
                                            <h3 className="text-2xl font-bold text-[#10232A]">{profile.name}</h3>
                                            <p className="text-[#3D4D55] font-medium mb-4">{profile.role} • {profile.email}</p>
                                            <div className="flex gap-3 justify-center md:justify-start">
                                                <button className="px-5 py-2.5 bg-[#10232A] text-white rounded-xl text-xs font-bold hover:bg-[#B58863] transition shadow-lg shadow-gray-200">Upload New</button>
                                                <button className="px-5 py-2.5 bg-white border border-gray-200 text-[#3D4D55] rounded-xl text-xs font-bold hover:bg-gray-50 transition">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Display Name" icon={User} value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
                                    <InputGroup label="Email Address" icon={Mail} value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
                                </div>

                                {/* Preferences Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-[#10232A] mb-4 flex items-center gap-2"><Lock size={16} /> Security</h4>
                                        <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#3D4D55] hover:border-[#B58863] hover:text-[#B58863] transition shadow-sm mb-2">Change Password</button>
                                        <p className="text-[10px] text-[#3D4D55]/60 text-center">Last updated 3 months ago</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-[#2B3446] mb-4 flex items-center gap-2"><Monitor size={16} /> Appearance</h4>
                                        <div className="flex bg-gray-200 p-1 rounded-xl">
                                            <button className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${profile.theme === 'light' ? 'bg-white shadow-sm' : 'text-gray-500'}`} onClick={() => setProfile({ ...profile, theme: 'light' })}><Sun size={14} /> Light</button>
                                            <button className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${profile.theme === 'dark' ? 'bg-white shadow-sm' : 'text-gray-500'}`} onClick={() => setProfile({ ...profile, theme: 'dark' })}><Moon size={14} /> Dark</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. GENERAL SETTINGS */}
                        {activeTab === 'general' && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-6"
                            >
                                <SectionHeader icon={Globe} title="Platform Settings" desc="Configure global system behavior." color="text-[#B58863]" bg="bg-[#FDFBF7]" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Platform Name" value="ShineFiling Dashboard" />
                                    <InputGroup label="Support Hotline" value="+91 94000 00000" />
                                </div>

                                <div className="space-y-4">
                                    <ToggleRow icon={AlertOctagon} color="bg-red-500" title="Maintenance Mode" desc="Take platform offline for updates." enabled={settings.maintenanceMode} onToggle={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })} />
                                    <ToggleRow icon={UserX} color="bg-orange-500" title="Public Registration" desc="Allow new users to sign up freely." enabled={settings.publicRegistration} onToggle={() => setSettings({ ...settings, publicRegistration: !settings.publicRegistration })} />
                                </div>
                            </motion.div>
                        )}

                        {/* 3. SECURITY SETTINGS */}
                        {activeTab === 'security' && (
                            <motion.div key="security" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                                <SectionHeader icon={Shield} title="Security & Access" desc="Firewall and authentication limits." color="text-red-600" bg="bg-red-50" />
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm"><Lock size={24} /></div>
                                        <div>
                                            <h4 className="font-bold text-red-900 border-none">Emergency Protocol</h4>
                                            <p className="text-xs text-red-700">Invalidate all active sessions instantly.</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-red-700 transition">Initiate Lockdown</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <ToggleRow icon={Smartphone} color="bg-blue-600" title="Two-Factor Authentication (2FA)" desc="Enforce SMS/Email OTP for staff." enabled={settings.twoFactorAuth} onToggle={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })} />
                                    <ToggleRow icon={Server} color="bg-purple-600" title="Session Timeout" desc="Auto-logout after 15 minutes of inactivity." enabled={true} onToggle={() => { }} />
                                </div>
                            </motion.div>
                        )}

                        {/* 4. API & INTEGRATIONS */}
                        {activeTab === 'integrations' && (
                            <motion.div key="integrations" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                                <SectionHeader icon={Key} title="API & Secrets" desc="Third-party service keys." color="text-orange-600" bg="bg-orange-50" />
                                <div className="space-y-4">
                                    <ApiKeyRow name="Razorpay Live" value="rzp_live_xxxxxxxx" color="orange" />
                                    <ApiKeyRow name="OpenAI Secret" value="sk-proj-xxxxxxxx" color="green" />
                                    <ApiKeyRow name="AWS S3 Access" value="AKIAxxxxxxxx" color="blue" />
                                </div>
                            </motion.div>
                        )}


                    </AnimatePresence>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-end items-center z-10">
                    <button
                        onClick={handleSave}
                        className={`px-10 py-4 bg-[#10232A] text-white font-bold rounded-2xl shadow-xl hover:bg-[#B58863] transition flex items-center gap-3 ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                        {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Sub Comps ---
const TabButton = ({ tab, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all text-left relative overflow-hidden group ${activeTab === tab.id
            ? 'bg-[#10232A] text-white shadow-lg shadow-[#10232A]/20 scale-[1.02]'
            : 'text-[#3D4D55] hover:bg-gray-50 hover:text-[#10232A]'
            }`}
    >
        <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : `${tab.color} opacity-70 group-hover:opacity-100`} />
        {tab.label}
        {activeTab === tab.id && <div className="absolute right-4 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>}
    </button>
);

const InputGroup = ({ label, icon: Icon, value, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-[#3D4D55] uppercase mb-2 ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#B58863] transition-colors" />}
            <input
                type="text"
                defaultValue={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-[#10232A] outline-none focus:bg-white focus:border-[#B58863] focus:ring-4 focus:ring-[#B58863]/10 transition-all shadow-sm`}
            />
        </div>
    </div>
);

const ApiKeyRow = ({ name, value, color }) => (
    <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-5 rounded-2xl border border-gray-100 items-center group hover:border-gray-300 transition-colors">
        <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">{name}</label>
            <div className="relative">
                <input type="password" value={value} readOnly className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 pl-4 transition-all focus:type-text" />
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-${color}-500`}></div>
            </div>
        </div>
        <button className="px-5 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition whitespace-nowrap shadow-sm group-hover:border-gray-300">Rotate Key</button>
    </div>
);

export default SystemSettings;
