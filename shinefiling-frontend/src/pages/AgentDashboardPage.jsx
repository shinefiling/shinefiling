import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, Users, FileText, Settings, LogOut, CheckCircle,
    Bell, ChevronRight, Menu, X, Calendar, Search, Wallet, TrendingUp,
    PlusCircle, ArrowUpRight, Upload, ArrowRight, Clock, Shield,
    User, Smartphone, Building, RefreshCw, Send, MessageSquare, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAgentApplications, updateUserProfile, uploadProfilePicture, requestWithdrawal } from '../api';
import { getBotResponse } from '../utils/chatbotLogic';
import Loader from '../components/Loader';

const AgentDashboardPage = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hello! How can we help you today?", sender: 'system' }
    ]);
    const [newMessage, setNewMessage] = useState("");

    // Stats
    const [stats, setStats] = useState({
        totalApplications: 0,
        pending: 0,
        completed: 0,
        totalEarnings: 0,
        walletBalance: 0
    });

    // KYC State
    const [showKycModal, setShowKycModal] = useState(false);
    const [kycData, setKycData] = useState({ panNumber: '', aadhaarNumber: '' });
    const [kycFiles, setKycFiles] = useState({ pan: null, aadhaar: null });
    const [isKycSubmitting, setIsKycSubmitting] = useState(false);

    // Profile & Bank State
    const [profileData, setProfileData] = useState({
        fullName: '',
        mobile: '',
        bankName: '',
        accountNumber: '',
        ifscCode: ''
    });
    const [isProfileSaving, setIsProfileSaving] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const referralLink = `https://shinefiling.com/ref/${user?.id || 'AGENT'}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    setProfileData({
                        fullName: user.fullName || user.name || '',
                        mobile: user.mobile || '',
                        bankName: user.bankName || '',
                        accountNumber: user.accountNumber || '',
                        ifscCode: user.ifscCode || ''
                    });

                    // Strict KYC Check: If PENDING (null/empty) or REJECTED, show modal
                    if (!user.kycStatus || user.kycStatus === 'PENDING' || user.kycStatus === 'REJECTED') {
                        setShowKycModal(true);
                    }

                    const data = await getAgentApplications(user.email);
                    setTasks(data);

                    const pending = data.filter(t => t.status !== 'COMPLETED' && t.status !== 'REJECTED').length;
                    const completed = data.filter(t => t.status === 'COMPLETED').length;
                    const earnings = completed * 500;

                    setStats({
                        totalApplications: data.length,
                        pending,
                        completed,
                        totalEarnings: earnings,
                        walletBalance: earnings
                    });
                }
            } catch (err) {
                console.error("Agent Data Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleKycSubmit = async (e) => {
        e.preventDefault();
        setIsKycSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('panNumber', kycData.panNumber);
            formData.append('aadhaarNumber', kycData.aadhaarNumber);
            if (kycFiles.pan) formData.append('panFile', kycFiles.pan);
            if (kycFiles.aadhaar) formData.append('aadhaarFile', kycFiles.aadhaar);

            const response = await fetch(`http://localhost:8080/api/users/${user.id}/kyc`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Submission failed');
            }

            const updatedUser = { ...user, kycStatus: 'SUBMITTED' };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setShowKycModal(false);
            alert("KYC Submitted Successfully! Waiting for Admin Approval.");
            window.location.reload();
        } catch (error) {
            alert("KYC Submission Failed: " + error.message);
        } finally {
            setIsKycSubmitting(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsProfileSaving(true);
        try {
            await updateUserProfile(user.id, profileData);
            const updatedUser = { ...user, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert("Profile Updated Successfully!");
        } catch (error) {
            alert("Failed to update profile: " + error.message);
        } finally {
            setIsProfileSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const res = await uploadProfilePicture(user.id, file);
            // res.profileImage contains the new URL
            const updatedUser = { ...user, profileImage: res.profileImage };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert("Profile Image Updated!");
            window.location.reload(); // To refresh header image
        } catch (error) {
            alert("Failed to upload image: " + error.message);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const msg = { id: Date.now(), text: newMessage, sender: 'user' };
        setChatMessages([...chatMessages, msg]);
        setNewMessage("");

        // Artificial Delay for "Typing" feel
        setTimeout(() => {
            const botReplyText = getBotResponse(msg.text, 'AGENT');
            const reply = { id: Date.now() + 1, text: botReplyText, sender: 'system' };
            setChatMessages(prev => [...prev, reply]);
        }, 800);
    };

    const handleWithdrawal = async () => {
        if (stats.walletBalance < 500) {
            alert("Minimum withdrawal amount is ₹500.");
            return;
        }

        const confirm = window.confirm(`Are you sure you want to withdraw ₹${stats.walletBalance}?`);
        if (!confirm) return;

        try {
            const res = await requestWithdrawal(user.id, stats.walletBalance);
            if (res.success) {
                alert(res.message);
                // Reset wallet balance locally for immediate feedback
                setStats(prev => ({ ...prev, walletBalance: 0 }));
            }
        } catch (error) {
            alert("Withdrawal request failed.");
        }
    };

    const copyReferral = () => {
        navigator.clipboard.writeText(referralLink);
        alert("Referral Link Copied!");
    };


    // Side components
    const SidebarItem = ({ icon: Icon, label, id, onClick }) => (
        <button
            onClick={onClick ? onClick : () => { setActiveTab(id); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                {subtext && <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{subtext}</span>}
            </div>
            <div className="text-3xl font-bold text-[#10232A] mb-1">{value}</div>
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</div>
        </div>
    );

    // --- Tab Content Views ---

    const OverviewTab = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {user?.kycStatus === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3 text-red-700">
                        <Shield className="fill-red-100" />
                        <div>
                            <h4 className="font-bold">KYC Rejected</h4>
                            <p className="text-sm">Your previous application was rejected. Please re-submit valid documents.</p>
                        </div>
                    </div>
                    <button onClick={() => setShowKycModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Fix Now</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Wallet Balance" value={`₹${stats.walletBalance.toLocaleString()}`} icon={Wallet} color="bg-emerald-500" subtext="Available" />
                <StatCard title="Total Earnings" value={`₹${stats.totalEarnings.toLocaleString()}`} icon={TrendingUp} color="bg-blue-500" subtext="Lifetime" />
                <StatCard title="Active Applications" value={stats.pending} icon={FileText} color="bg-orange-500" />
                <StatCard title="Total Clients" value={new Set(tasks.map(t => t.userEmail)).size} icon={Users} color="bg-purple-500" />
            </div>

            <div className="bg-gradient-to-r from-[#10232A] to-[#1A3642] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Refer & Earn More</h3>
                        <p className="text-gray-300 max-w-md">Share your unique referral link with potential clients. You earn 10% commission on every completed service.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl flex items-center gap-2 border border-white/20 w-full md:w-auto">
                        <code className="px-3 text-emerald-400 font-mono text-sm">{referralLink}</code>
                        <button onClick={copyReferral} className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors" title="Copy Link"><Copy size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-[#10232A]">Recent Applications</h3>
                    <button onClick={() => setActiveTab('applications')} className="text-emerald-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tasks.slice(0, 5).map((task, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-[#10232A]">{task.serviceName}</td>
                                    <td className="px-6 py-4 text-gray-600">{task.user?.fullName || task.userEmail}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            task.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>{task.status?.replace(/_/g, ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                                        {task.status === 'COMPLETED' ? '₹500' : '-'}
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No applications yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );

    const ApplicationsTab = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-[#10232A]">All Applications</h3>
                    <div className="relative">
                        <input type="text" placeholder="Search applications..." className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-xs">
                        <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Service</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {tasks.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-gray-400">#{t.id}</td>
                                <td className="px-6 py-4 font-bold text-[#10232A]">{t.serviceName}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>{t.status}</span></td>
                                <td className="px-6 py-4 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right"><button className="text-emerald-600 font-bold text-xs hover:underline">View Details</button></td>
                            </tr>
                        ))}
                        {tasks.length === 0 && <tr><td colSpan="5" className="p-12 text-center text-gray-400">No applications found. start a new application!</td></tr>}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );

    const ClientsTab = () => {
        // Create unique list of clients
        const clients = Array.from(new Set(tasks.map(t => t.userEmail)))
            .map(email => {
                const task = tasks.find(t => t.userEmail === email);
                return {
                    name: task?.user?.fullName || 'Guest Client',
                    email: email,
                    phone: task?.user?.mobile || 'N/A',
                    date: task?.createdAt
                }
            });

        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                {client.name[0]}
                            </div>
                            <h4 className="font-bold text-lg text-[#10232A] mb-1">{client.name}</h4>
                            <p className="text-sm text-gray-500 mb-4">{client.email}</p>
                            <div className="border-t pt-4 flex justify-between text-xs text-gray-400">
                                <span>{client.phone}</span>
                                <span>Joined {new Date(client.date).getFullYear()}</span>
                            </div>
                            <button className="w-full mt-4 py-2 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 font-bold text-sm transition-colors">
                                Contact Client
                            </button>
                        </div>
                    ))}
                    {clients.length === 0 && <div className="col-span-3 text-center py-20 text-gray-400">No clients added yet. Complete an application to see clients here.</div>}
                </div>
            </motion.div>
        );
    };

    const EarningsTab = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#10232A] text-white p-8 rounded-3xl shadow-lg lg:col-span-2 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2">Total Wallet Balance</p>
                        <h2 className="text-4xl font-bold mb-6">₹{stats.walletBalance.toLocaleString()}</h2>
                        <div className="flex gap-4">
                            <button onClick={handleWithdrawal} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition">Withdraw Funds</button>
                            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition">View History</button>
                        </div>
                    </div>
                    <Wallet className="absolute right-4 bottom-4 text-white/5 w-48 h-48" />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><TrendingUp size={32} /></div>
                    <h3 className="text-3xl font-bold text-[#10232A] mb-1">₹{stats.totalEarnings.toLocaleString()}</h3>
                    <p className="text-gray-400 text-sm">Lifetime Earnings</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-lg text-[#10232A] mb-6">Payout History</h3>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-xs">
                        <tr><th className="px-6 py-4">Transaction ID</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {/* Mock Data */}
                        {stats.completed > 0 ? (
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-gray-400">#TXN-{Math.floor(Math.random() * 10000)}</td>
                                <td className="px-6 py-4 text-gray-500">{new Date().toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-bold text-[#10232A]">₹{stats.totalEarnings}</td>
                                <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Processed</span></td>
                            </tr>
                        ) : (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">No payouts yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );

    const SettingsTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 flex items-center justify-center">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-gray-300" />
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Upload size={20} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#10232A]">{user?.fullName || 'Agent'}</h3>
                            <p className="text-gray-500 text-sm">Update your personal photo</p>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#10232A] mb-6 flex items-center gap-2"><User size={20} /> Personal Details</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.fullName}
                                    onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    value={profileData.mobile}
                                    onChange={e => setProfileData({ ...profileData, mobile: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mt-6">
                            <h3 className="text-xl font-bold text-[#10232A] mb-6 flex items-center gap-2"><Building size={20} /> Bank Details (For Payouts)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Bank Name</label>
                                    <input
                                        type="text"
                                        value={profileData.bankName}
                                        onChange={e => setProfileData({ ...profileData, bankName: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g. HDFC Bank"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        value={profileData.ifscCode}
                                        onChange={e => setProfileData({ ...profileData, ifscCode: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="HDFC0001234"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Account Number</label>
                                    <input
                                        type="text"
                                        value={profileData.accountNumber}
                                        onChange={e => setProfileData({ ...profileData, accountNumber: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isProfileSaving}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                            >
                                {isProfileSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#10232A] mb-4">KYC Status</h3>
                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${user.kycStatus === 'VERIFIED' ? 'bg-green-50 border-green-200 text-green-700' :
                        user.kycStatus === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                        {user.kycStatus === 'VERIFIED' ? <CheckCircle /> : user.kycStatus === 'REJECTED' ? <X /> : <Shield />}
                        <div>
                            <div className="font-bold">{user.kycStatus || 'PENDING'}</div>
                            <div className="text-xs opacity-80">Last Updated: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    {user.kycStatus === 'REJECTED' && (
                        <button onClick={() => setShowKycModal(true)} className="w-full mt-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm">
                            Re-submit KYC
                        </button>
                    )}
                </div>

                <div className="bg-[#10232A] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                        <p className="text-gray-300 text-sm mb-4">Contact our priority support team for assistance with applications or payouts.</p>
                        <button onClick={() => setShowChat(true)} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold text-sm transition-colors">Start Chat</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (user?.kycStatus === 'SUBMITTED') {
        return (
            <div className="min-h-screen bg-[#F2F1EF] flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-xl text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Clock size={40} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-navy mb-2">Application Under Review</h1>
                        <p className="text-gray-500">Your Agent KYC documents are being reviewed. Expected time: 24-48 hours.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-left text-sm space-y-2">
                        <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-bold text-blue-600 bg-blue-50 px-2 rounded">In Progress</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Submitted On</span><span className="font-bold text-[#10232A]">{new Date().toLocaleDateString()}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Reference ID</span><span className="font-bold text-[#10232A] font-mono">KYC-{user.id}</span></div>
                    </div>
                    <button onClick={onLogout} className="text-red-400 hover:text-red-500 font-bold text-sm flex items-center justify-center gap-2 mx-auto mt-4"><LogOut size={16} /> Sign Out</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2F1EF] flex text-[#2B3446]">
            {/* KYC Modal - Reusable */}
            <AnimatePresence>
                {showKycModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-[#10232A] flex items-center gap-2"><CheckCircle className="text-emerald-500" /> Agent Verification</h2>
                                {!['PENDING', ''].includes(user.kycStatus) && <button onClick={() => setShowKycModal(false)}><X className="text-gray-400 hover:text-red-500" /></button>}
                            </div>
                            <form onSubmit={handleKycSubmit} className="p-6 space-y-6">
                                {user.kycStatus === 'REJECTED' && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-4 border border-red-200">
                                        <strong>Submission Rejected:</strong> Please re-upload clear copies of your documents.
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-bold text-gray-600 mb-1">PAN Number</label><input type="text" value={kycData.panNumber} onChange={e => setKycData({ ...kycData, panNumber: e.target.value.toUpperCase() })} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200" required placeholder="ABCDE1234F" /></div>
                                    <div><label className="block text-sm font-bold text-gray-600 mb-1">Aadhaar Number</label><input type="text" value={kycData.aadhaarNumber} onChange={e => setKycData({ ...kycData, aadhaarNumber: e.target.value })} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200" required placeholder="1234 5678 9012" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['pan', 'aadhaar'].map(type => (
                                        <div key={type} className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition relative group">
                                            <input type="file" accept="image/*,application/pdf" onChange={e => setKycFiles({ ...kycFiles, [type]: e.target.files[0] })} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                            <Upload className={`mx-auto mb-2 ${kycFiles[type] ? 'text-emerald-500' : 'text-gray-400'}`} size={30} />
                                            <p className="text-sm font-bold text-gray-500">{kycFiles[type]?.name || `Upload ${type.toUpperCase()}`}</p>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" disabled={isKycSubmitting} className="w-full py-3 bg-[#10232A] text-white rounded-xl font-bold hover:bg-[#1A3642] transition">{isKycSubmitting ? 'Submitting...' : 'Submit Verification'}</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Modal */}
            <AnimatePresence>
                {showChat && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden h-[450px]">
                        <div className="bg-[#10232A] p-4 flex justify-between items-center text-white shrink-0">
                            <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18} /> Support Chat</h3>
                            <button onClick={() => setShowChat(false)}><X size={18} className="text-gray-400 hover:text-white" /></button>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-xl text-xs max-w-[80%] shadow-sm ${msg.sender === 'user' ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-600 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t bg-white flex gap-2 shrink-0">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 text-sm p-2 outline-none"
                            />
                            <button onClick={handleSendMessage} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"><Send size={16} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`fixed inset-y-0 left-0 w-72 bg-[#10232A] text-white z-40 transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
                    <div><h1 className="font-bold text-lg">Agent Portal</h1><p className="text-xs text-emerald-400 font-medium tracking-wider">PREMIUM PARTNER</p></div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-gray-400"><X /></button>
                </div>
                <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)]">
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-4">Overview</div>
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" id="overview" />
                    <SidebarItem icon={FileText} label="Applications" id="applications" />
                    <SidebarItem icon={Users} label="My Clients" id="clients" />
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-6">Finance</div>
                    <SidebarItem icon={Wallet} label="Earnings & Payouts" id="earnings" />
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-6">Settings</div>
                    <SidebarItem icon={Settings} label="Profile & Banking" id="settings" />
                </div>
                <div className="absolute bottom-0 w-full p-4 bg-[#0d1c21]">
                    <button onClick={() => setShowChat(true)} className="w-full mb-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-xl font-bold text-sm border border-emerald-600/30 flex items-center justify-center gap-2 hover:bg-emerald-600/30 transition"><MessageSquare size={16} /> Support</button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"><LogOut size={18} /> Sign Out</button>
                </div>
            </div>

            <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Menu /></button>
                        <h2 className="text-xl font-bold text-[#10232A] hidden md:block capitalize">{activeTab.replace('-', ' ')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/services/apply')} className="bg-[#10232A] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2"><PlusCircle size={16} /> New Application</button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#10232A]">{user?.fullName || 'Agent Name'}</p>
                                <p className="text-xs text-gray-400">ID: {user?.id || '---'}</p>
                            </div>
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                            ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[#10232A] border border-gray-200">
                                    {user?.fullName?.[0] || 'A'}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-10 flex-1 overflow-y-auto">
                    {loading ? <div className="h-96 flex items-center justify-center"><Loader fullScreen={false} /><span className="ml-3 text-gray-400 font-bold">Loading Dashboard...</span></div> : (
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && <OverviewTab key="overview" />}
                            {activeTab === 'applications' && <ApplicationsTab key="applications" />}
                            {activeTab === 'clients' && <ClientsTab key="clients" />}
                            {activeTab === 'earnings' && <EarningsTab key="earnings" />}
                            {activeTab === 'settings' && <SettingsTab key="settings" />}
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AgentDashboardPage;
