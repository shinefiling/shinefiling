import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Mail, Phone, MapPin, Building, Filter, Plus, X } from 'lucide-react';
import { getAllUsers, getClientAnalysis } from '../../../api'; // Reuse existing API

const CRMSystem = () => {
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState(null); // { totalClients, newClients, activeClients, inactiveClients }
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null); // For detail view

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allUsers, analysisData] = await Promise.all([
                    getAllUsers(),
                    getClientAnalysis()
                ]);

                if (analysisData) setStats(analysisData);

                // Filter only 'USER' role or those who have applications
                const clientUsers = allUsers.filter(u => u.role === 'USER' || !u.role);

                // Map API data to UI requirements
                const formattedClients = clientUsers.map(u => ({
                    ...u,
                    company: u.companyName || 'N/A',
                    status: u.status || 'Active',
                    lastInteraction: 'N/A', // Could come from analysisData detailed list if needed
                }));
                setClients(formattedClients);
            } catch (err) {
                console.error("Failed to fetch clients", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredClients = clients.filter(client =>
        client.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ClientDetailModal = ({ client, onClose }) => (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                <div className="bg-[#2B3446] p-6 text-white flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#F59E0B] text-[#2B3446] flex items-center justify-center text-2xl font-bold">
                            {client.fullName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{client.fullName}</h2>
                            <p className="text-gray-300 flex items-center gap-1"><Building size={14} /> {client.company}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={20} /></button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Mail size={18} className="text-gray-400" /> {client.email}
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Phone size={18} className="text-gray-400" /> {client.mobile || 'N/A'}
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <MapPin size={18} className="text-gray-400" /> Mumbai, India (Mock)
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">CRM Insights</h3>
                        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="font-bold text-green-600 px-2 py-0.5 bg-green-100 rounded-md">Active</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Lifetime Value</span>
                                <span className="font-bold text-[#2B3446]">₹14,500</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Last Active</span>
                                <span className="font-bold text-[#2B3446]">Today</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-100">View Transactions</button>
                    <button className="px-4 py-2 bg-[#2B3446] text-white rounded-lg font-bold hover:bg-black">Send Message</button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[calc(100vh-140px)] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-[#2B3446] flex items-center gap-2">
                        <Users size={20} className="text-[#F59E0B]" /> Client Relationship Management (CRM)
                    </h2>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F59E0B] w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-[#d97706] transition flex items-center gap-2">
                            <Plus size={16} /> <span className="hidden sm:inline">Add Client</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Analytics Header */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Clients</p>
                                <h3 className="text-3xl font-bold text-[#2B3446]">{stats.totalClients}</h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-green-500 text-xs font-bold uppercase tracking-wider">New (30 Days)</p>
                                <h3 className="text-3xl font-bold text-[#2B3446]">{stats.newClients}</h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-blue-500 text-xs font-bold uppercase tracking-wider">Active</p>
                                <h3 className="text-3xl font-bold text-[#2B3446]">{stats.activeClients}</h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Inactive</p>
                                <h3 className="text-3xl font-bold text-[#2B3446]">{stats.inactiveClients}</h3>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading clients...</div>
                    ) : filteredClients.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-bold">No clients found</p>
                            <p className="text-sm text-gray-400">Try adjusting your search terms.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredClients.map((client) => (
                                <div key={client.id} className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-[#F59E0B]/30 transition relative overflow-hidden" onClick={() => setSelectedClient(client)}>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#F59E0B]/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#F59E0B]/10 transition"></div>

                                    <div className="flex items-center gap-4 mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-full bg-[#2B3446] text-white flex items-center justify-center font-bold text-lg shadow-md">
                                            {client.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#2B3446] truncate w-32">{client.fullName}</h3>
                                            <p className="text-xs text-gray-500 truncate w-32">{client.company}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p className="flex items-center gap-2 truncate"><Mail size={14} className="text-gray-400 min-w-[14px]" /> {client.email}</p>
                                        <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400 min-w-[14px]" /> {client.mobile || 'N/A'}</p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-600 rounded-md">Active</span>
                                        <button className="text-xs font-bold text-[#F59E0B] group-hover:underline">View Profile</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default CRMSystem;
