
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Briefcase, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const CaOverview = ({ requests, handleAcceptRequest, handleRejectRequest, setActiveTab }) => {
    const pendingApproval = requests.filter(r => r.caApprovalStatus === 'PENDING_APPROVAL');
    const activeWorks = requests.filter(r => r.caApprovalStatus === 'ACCEPTED' && r.status !== 'COMPLETED');
    const completed = requests.filter(r => r.status === 'COMPLETED');

    const StatCard = ({ title, value, icon: Icon, color, bg }) => (
        <div className="bg-white dark:bg-[#10232A] p-6 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bg} bg-opacity-10 dark:bg-opacity-20 ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="text-3xl font-bold text-[#10232A] dark:text-white mb-1 group-hover:scale-105 transition-transform origin-left">{value}</div>
            <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A] dark:text-white">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Track your assigned services and pending requests.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Pending Requests"
                    value={pendingApproval.length}
                    icon={Clock}
                    color="text-amber-500"
                    bg="bg-amber-500"
                />
                <StatCard
                    title="Active Projects"
                    value={activeWorks.length}
                    icon={Briefcase}
                    color="text-blue-500"
                    bg="bg-blue-500"
                />
                <StatCard
                    title="Completed Works"
                    value={completed.length}
                    icon={CheckCircle}
                    color="text-emerald-500"
                    bg="bg-emerald-500"
                />
            </div>

            {/* Pending Requests List */}
            {pendingApproval.length > 0 && (
                <div className="bg-white dark:bg-[#10232A] rounded-3xl border border-slate-100 dark:border-[#1C3540] p-6 shadow-sm">
                    <h3 className="font-bold text-[#10232A] dark:text-white text-lg mb-4 flex items-center gap-2">
                        <Bell className="text-[#B58863]" size={20} /> New Requests from Admin
                    </h3>
                    <div className="space-y-4">
                        {pendingApproval.map(r => (
                            <div key={r.id} className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-[#10232A] dark:text-white text-lg">{r.serviceName}</h4>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-white/10 text-slate-500 uppercase border border-slate-200 dark:border-white/10">#{r.id}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Client: <span className="font-bold">{r.user?.fullName}</span> ({r.user?.email})</p>

                                    <div className="flex items-center gap-4 text-xs font-mono bg-white/50 dark:bg-black/20 p-2 rounded-lg inline-flex">
                                        <span className="text-slate-500 dark:text-slate-400">Offered Amount:</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">₹{r.boundAmount}</span>
                                    </div>

                                    {r.adminComments && (
                                        <div className="mt-2 text-xs text-slate-500 italic flex items-start gap-1">
                                            <span className="font-bold">Note:</span> {r.adminComments}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleRejectRequest(r)}
                                        className="flex-1 md:flex-none px-4 py-2 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAcceptRequest(r)}
                                        className="flex-1 md:flex-none px-6 py-2 bg-[#10232A] dark:bg-[#B58863] text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm"
                                    >
                                        Accept Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity / Empty State if no pending requests */}
            {pendingApproval.length === 0 && (
                <div className="bg-white dark:bg-[#10232A] rounded-3xl border border-slate-100 dark:border-[#1C3540] p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#10232A] dark:text-white mb-2">All Caught Up!</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        You have no pending requests from the admin. Check your active works to manage ongoing projects.
                    </p>
                    <button
                        onClick={() => setActiveTab('works')}
                        className="mt-6 px-6 py-2.5 bg-slate-100 dark:bg-[#1C3540] text-slate-700 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-[#2C4A57] transition-colors"
                    >
                        View Active Works
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default CaOverview;
