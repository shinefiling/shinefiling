
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Briefcase, User, CheckCircle, RefreshCw, FileText } from 'lucide-react';

const CaWorks = ({ requests, employees, handleAssignEmployee, respondToBoundAmount, fetchData }) => {
    const myWorks = requests.filter(r => r.caApprovalStatus === 'ACCEPTED');

    const statusColors = {
        'COMPLETED': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'PENDING': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        'REVIEW_PENDING_CA': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A] dark:text-white">Assigned Services</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track progress of your ongoing projects.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1C3540] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        {myWorks.length} Total Projects
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-[#10232A] rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-[#1C3540] text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 rounded-l-xl">Service Details</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-[#1C3540]">
                            {myWorks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Briefcase size={48} className="mb-4 opacity-20" />
                                            <p className="font-bold text-lg">No Active Works</p>
                                            <p className="text-xs">Accept new requests from the overview tab.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : myWorks.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-[#1C3540]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#10232A] dark:text-white mb-0.5">{r.serviceName}</div>
                                        <div className="text-xs text-slate-400 font-mono">#{r.id.slice(-8)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                                {(r.user?.fullName || 'C').charAt(0)}
                                            </div>
                                            <span className="text-slate-600 dark:text-slate-300 font-medium">{r.user?.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {r.status?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative group/select">
                                            <select
                                                className="w-full bg-slate-50 dark:bg-[#10232A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-[#B58863] appearance-none cursor-pointer font-medium"
                                                value={r.assignedEmployee?.id || ''}
                                                onChange={(e) => handleAssignEmployee(r.id, e.target.value)}
                                            >
                                                <option value="">-- Assign Employee --</option>
                                                {employees.map(e => (
                                                    <option key={e.id} value={e.id}>{e.fullName}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <User size={12} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {r.status === 'REVIEW_PENDING_CA' ? (
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Mark this request as finally COMPLETED?')) {
                                                        await respondToBoundAmount(r.id, 'COMPLETED_FINAL', 'Work completed by CA');
                                                        fetchData();
                                                    }
                                                }}
                                                className="flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                            >
                                                <CheckCircle size={14} /> Approve & Complete
                                            </button>
                                        ) : (
                                            <button className="text-[#B58863] font-bold text-xs hover:text-[#A67C52] transition-colors flex items-center gap-1 ml-auto">
                                                View Details <FileText size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default CaWorks;
