import React, { useState, useEffect } from 'react';
import {
    Users, Lock, Clock, Plus, Trash2, Calendar, Shield,
    CheckCircle, UserPlus, Briefcase,
    MoreVertical, ToggleLeft, ToggleRight, Command, Crown, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDepartments, updateDepartment, getAllUsers, updateUserRole } from '../../../../api';
import RolePermissionsEditor from './RolePermissionsEditor';

const AdminControls = () => {
    const [activeTab, setActiveTab] = useState('teams');

    // Data State
    const [departments, setDepartments] = useState([]);
    const [admins, setAdmins] = useState([]);

    // State for Features
    const [deptModalOpen, setDeptModalOpen] = useState(false);
    const [deptForm, setDeptForm] = useState({ name: '', head: '', color: 'bg-indigo-50 text-indigo-700' });
    const [operationalHours, setOperationalHours] = useState('09:00 AM - 06:00 PM IST');
    const [isEditingHours, setIsEditingHours] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            // ... existing loadData logic ... (kept implicitly via effect body continuation)
            try {
                // Fetch Departments
                const deptData = await getDepartments();
                if (deptData && deptData.length > 0) {
                    setDepartments(deptData);
                } else {
                    // Fallback Mock
                    setDepartments([
                        { id: 1, name: 'Legal Board', count: 12, head: 'Adv. Sharma', color: 'bg-indigo-50 text-indigo-700' },
                        { id: 2, name: 'Support Ops', count: 8, head: 'Priya K.', color: 'bg-pink-50 text-pink-700' },
                        { id: 3, name: 'Finance', count: 4, head: 'Amit R.', color: 'bg-emerald-50 text-emerald-700' },
                        { id: 4, name: 'Tech Team', count: 6, head: 'Suresh V.', color: 'bg-blue-50 text-blue-700' }
                    ]);
                }

                // Fetch Users (Admins)
                const userData = await getAllUsers();
                if (userData && userData.length > 0) {
                    // Filter for admin/staff roles if applicable, or show all for now
                    const mappedUsers = userData.map(u => ({
                        id: u.id || Math.random().toString(36),
                        name: u.fullName || u.username || 'Unknown',
                        role: u.role || 'Member',
                        email: u.email,
                        status: u.status || 'Active',
                        lastActive: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'
                    }));
                    setAdmins(mappedUsers);
                } else {
                    // Fallback Mock
                    setAdmins([
                        { id: 1, name: 'Prakasahar', role: 'Super Admin', email: 'admin@shinefiling.com', status: 'Active', lastActive: 'Now' },
                        { id: 2, name: 'Sarah Jenkins', role: 'Compliance Head', email: 'sarah@shinefiling.com', status: 'Active', lastActive: '2m ago' },
                        { id: 3, name: 'Rahul M.', role: 'Moderator', email: 'rahul@shinefiling.com', status: 'Inactive', lastActive: '2d ago' }
                    ]);
                }
            } catch (err) {
                console.error("Admin controls data fetch failed", err);
            }
        };
        loadData();
    }, []);

    const handleSaveDept = () => {
        const newDept = {
            id: Math.random().toString(36).substr(2, 9),
            name: deptForm.name,
            head: deptForm.head,
            count: 0,
            color: deptForm.color
        };
        setDepartments([...departments, newDept]);
        setDeptModalOpen(false);
        setDeptForm({ name: '', head: '', color: 'bg-indigo-50 text-indigo-700' });
    };

    const handleDeleteDept = (id) => {
        if (window.confirm("Delete this department?")) {
            setDepartments(departments.filter(d => d.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <Crown size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#10232A]">Admin Command Center</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase border border-indigo-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                                Clearance Level 5
                            </span>
                            <span className="text-[#3D4D55] text-xs">| Root Access Granted</span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                    {[
                        { id: 'teams', label: 'Organization', icon: Briefcase },
                        { id: 'users', label: 'Administrators', icon: Users },
                        { id: 'roles', label: 'Permissions', icon: Lock },
                        { id: 'time', label: 'Operations', icon: Clock },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-[#10232A] text-white shadow-md'
                                : 'text-[#3D4D55] hover:bg-gray-50 hover:text-[#10232A]'
                                }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COL (MAIN) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* TEAMS LAYOUT */}
                    {activeTab === 'teams' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {departments.map(dept => (
                                <div key={dept.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${dept.color || 'bg-gray-100 text-[#3D4D55]'}`}>
                                            {dept.name}
                                        </div>
                                        <button onClick={() => handleDeleteDept(dept.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-[#10232A]">{dept.count}</h3>
                                    <p className="text-xs text-[#3D4D55] font-medium uppercase tracking-wider mb-6">Active Members</p>

                                    <div className="flex items-center gap-2 border-t border-gray-50 pt-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{(dept.head || 'U').charAt(0)}</div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-[#10232A]">Lead: {dept.head || 'Unassigned'}</p>
                                        </div>
                                        <button className="text-xs font-bold text-[#B58863] hover:underline">Manage</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setDeptModalOpen(true)} className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-6 text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition min-h-[200px]">
                                <Plus size={32} />
                                <span className="font-bold text-sm">Add New Department</span>
                            </button>
                        </div>
                    )}

                    {/* USERS LAYOUT */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-[#2B3446]">Authorized Personnel</h3>
                                <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                                    <UserPlus size={14} /> Invite Admin
                                </button>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {admins.map(admin => (
                                        <tr key={admin.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-xs">{admin.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-bold text-[#2B3446]">{admin.name}</p>
                                                        <p className="text-[10px] text-gray-400">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold border border-indigo-100">{admin.role}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1.5 text-xs font-bold ${admin.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                    {admin.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs font-mono text-gray-500">
                                                {admin.lastActive}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* PERMISSIONS LAYOUT */}
                    {activeTab === 'roles' && (
                        <RolePermissionsEditor />
                    )}

                    {/* OPERATIONS LAYOUT */}
                    {activeTab === 'time' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2"><Clock size={16} /> Operational Hours</h4>
                                    <button onClick={() => setIsEditingHours(!isEditingHours)} className="text-xs font-bold text-indigo-600 hover:underline">
                                        {isEditingHours ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                                <div className="flex gap-2 justify-center mb-6">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                        <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${i < 5 ? 'bg-[#2B3446] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                                            {d}
                                        </div>
                                    ))}
                                </div>
                                {isEditingHours ? (
                                    <input
                                        type="text"
                                        value={operationalHours}
                                        onChange={(e) => setOperationalHours(e.target.value)}
                                        className="w-full text-center p-3 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-bold border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <div className="text-center p-3 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-bold">
                                        {operationalHours}
                                    </div>
                                )}
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2"><Calendar size={16} /> Holiday Calendar</h4>
                                    <button className="text-xs font-bold text-indigo-600 hover:underline">Manage</button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                                        <div className="p-2 bg-white rounded-lg text-red-500 font-bold text-xs shadow-sm flex flex-col items-center leading-tight">
                                            <span>25</span><span>DEC</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-900 text-sm">Christmas Day</p>
                                            <p className="text-xs text-red-600 opacity-80">Upcoming Holiday</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                                        <div className="p-2 bg-white rounded-lg text-gray-500 font-bold text-xs shadow-sm flex flex-col items-center leading-tight">
                                            <span>26</span><span>JAN</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 text-sm">Republic Day</p>
                                            <p className="text-xs text-gray-500">Next Year</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                </div>

                {/* RIGHT COL (STATS) */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#10232A] to-black rounded-2xl p-6 text-white shadow-xl">
                        <Shield className="mb-4 text-[#B58863]" size={32} />
                        <h3 className="text-2xl font-extrabold mb-1">Security Score</h3>
                        <p className="text-indigo-200 text-sm mb-6">Your organization security is strong.</p>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-white/50">
                            <span>Vulnerability Scan</span>
                            <span>92/100</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-[#2B3446] mb-4 text-sm uppercase tracking-wide">Pending Requests</h3>
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">New Admin Access</p>
                                        <p className="text-[10px] text-gray-500 mb-2">requested by hr@shinefiling.com</p>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-[#10232A] text-white text-[10px] font-bold rounded hover:bg-[#B58863]">Approve</button>
                                            <button className="px-3 py-1 bg-gray-100 text-[#3D4D55] text-[10px] font-bold rounded hover:bg-gray-200">Deny</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Dept Modal */}
            <AnimatePresence>
                {deptModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-700">Add Department</h3>
                                <button onClick={() => setDeptModalOpen(false)}><X size={18} /></button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Department Name</label>
                                    <input value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} className="w-full border rounded-lg p-2 font-bold text-sm mt-1 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Sales" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Head of Dept</label>
                                    <input value={deptForm.head} onChange={e => setDeptForm({ ...deptForm, head: e.target.value })} className="w-full border rounded-lg p-2 font-bold text-sm mt-1 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Theme</label>
                                    <div className="flex gap-2 mt-2">
                                        {[
                                            'bg-indigo-50 text-indigo-700',
                                            'bg-pink-50 text-pink-700',
                                            'bg-emerald-50 text-emerald-700',
                                            'bg-blue-50 text-blue-700',
                                            'bg-orange-50 text-orange-700'
                                        ].map(c => (
                                            <button key={c} onClick={() => setDeptForm({ ...deptForm, color: c })} className={`w-6 h-6 rounded-full ${c.split(' ')[0]} border-2 ${deptForm.color === c ? 'border-gray-400' : 'border-transparent'}`}></button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={handleSaveDept} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg mt-2 hover:bg-indigo-700 transition">Create Department</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminControls;
