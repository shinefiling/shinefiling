import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Clock, CheckCircle } from 'lucide-react';
import { getUserPayments } from '../../api';

const ClientPayments = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.id) {
                    const data = await getUserPayments(user.id);
                    if (Array.isArray(data)) {
                        setHistory(data);
                    }
                }
            } catch (error) {
                console.error("Failed to load payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Cards Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Total Spend Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#10232A] via-[#1C3540] to-[#2A4550] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#B58863]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Total Expenditure</p>
                                <h3 className="text-3xl font-bold tracking-tight">₹{history.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toLocaleString()}<span className="text-xl text-slate-500">.00</span></h3>
                            </div>
                            <div className="p-2.5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
                                <CreditCard size={20} className="text-[#B58863]" />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="px-4 py-2 bg-[#B58863] text-white rounded-xl text-xs font-bold shadow-lg hover:bg-[#A57753] transition flex items-center gap-2">
                                Add Funds Credit
                            </button>
                            <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition flex items-center gap-2">
                                <Download size={14} /> Statement
                            </button>
                        </div>
                    </div>
                </div>

                {/* Saved Methods */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div>
                        <h4 className="font-bold text-slate-800 text-base mb-1">Payment Methods</h4>
                        <p className="text-xs text-slate-500 mb-4">Manage your saved cards and UPI handles used for checkout.</p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[7px] text-white font-mono">VISA</div>
                                <span className="text-xs font-mono text-slate-600 font-medium">•••• 4242</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition border-dashed">
                        + Add New Method
                    </button>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-center md:justify-between bg-[#FDFBF7]">
                    <h3 className="font-bold text-[#10232A] text-base">Transaction History</h3>
                    <button className="text-[#B58863] text-xs font-bold hover:underline hidden md:block">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 font-medium text-xs">Loading payments...</td></tr>
                            ) : history.length > 0 ? (
                                history.map((txn, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition border-b border-slate-50 last:border-none">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.id || `TXN_${i}`}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 text-xs">{txn.desc || txn.description || 'Payment'}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{txn.method || 'Online'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">{txn.date || new Date().toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-bold text-slate-800 text-xs">₹{txn.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${txn.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                {txn.status === 'Success' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                                {txn.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-800 text-[10px] font-bold transition">
                                                <Download size={12} /> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-xs">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientPayments;
