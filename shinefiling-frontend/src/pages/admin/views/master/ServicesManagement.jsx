import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    FileText, Plus, Edit2, CheckCircle, X, Search, Filter, FolderOpen,
    Tag, Box, Power, LayoutGrid, List, Clock, MoreVertical, AlertCircle,
    DollarSign, BarChart3, ChevronDown, Layers, Shield, Globe, Database, User, Zap,
    Building, Coins, Briefcase, Landmark, Award, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICE_DATA } from '../../../../data/services';
import { getInactiveServices, toggleServiceStatus } from '../../../../utils/serviceManager';
import { getServiceCatalog, createServiceProduct, updateServiceProduct } from '../../../../api';

const ServicesManagement = () => {
    // State
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [isModalOpen, setModalOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [inactiveIds, setInactiveIds] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    // Initial Form State
    const initialForm = {
        name: '',
        categoryId: 'business_reg',
        price: '',
        sla: '3-5 Days',
        docsRequired: 2,
        description: '',
        status: 'ACTIVE'
    };
    const [formData, setFormData] = useState(initialForm);

    // Sync Inactive Status (Legacy LocalStorage support, typically API handles this)
    useEffect(() => {
        setInactiveIds(getInactiveServices());
        const handleStatusChange = () => setInactiveIds(getInactiveServices());
        window.addEventListener('serviceStatusChanged', handleStatusChange);
        return () => window.removeEventListener('serviceStatusChanged', handleStatusChange);
    }, []);

    const handleToggleStatus = async (serviceId) => {
        // Optimistic UI Update
        const updatedInactive = toggleServiceStatus(serviceId);
        setInactiveIds(updatedInactive);

        // Update main services state too
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: updatedInactive.includes(serviceId) ? 'INACTIVE' : 'ACTIVE' } : s));

        try {
            await updateServiceProduct(serviceId, { status: updatedInactive.includes(serviceId) ? 'INACTIVE' : 'ACTIVE' });
        } catch (e) {
            console.error("Failed to sync status with server", e);
        }
    };

    const loadServices = async () => {
        try {
            const apiData = await getServiceCatalog();
            if (apiData && apiData.length > 0) {
                const mappedServices = apiData.map(s => ({
                    ...s,
                    icon: resolveIcon(s.categoryId || 'default'),
                    color: SERVICE_DATA[s.categoryId]?.colorHex || '#4F46E5'
                }));
                setServices(mappedServices);
            } else {
                let list = [];
                Object.values(SERVICE_DATA).forEach(cat => {
                    cat.items.forEach((item, index) => {
                        const uniqueId = `${cat.id}_${index}`;
                        list.push({
                            id: uniqueId,
                            name: item,
                            category: cat.label,
                            categoryId: cat.id,
                            price: (index + 1) * 999 + 499,
                            sla: `${3 + index} - ${5 + index} Days`,
                            docsRequired: 2 + (index % 3),
                            icon: cat.icon,
                            color: cat.colorHex,
                            status: 'ACTIVE'
                        });
                    });
                });
                setServices(list);
            }
        } catch (error) {
            console.error("Failed to fetch service catalog", error);
        } finally {
            // Loading state removed
        }
    };

    // Helper to resolve icon
    const resolveIcon = (iconName) => {
        const iconMap = {
            FileText, Box, Shield, Zap, Globe, Database, User,
            Building, Coins, Briefcase, Landmark, Award, Scale,

            // Legacy Mappings
            'fssai': Landmark,
            'inc': Building,
            'tax': Coins,
            'ip': Shield,

            // New Backend Mappings
            'business_reg': Building,
            'tax_compliance': Coins,
            'roc_compliance': Briefcase,
            'licenses': Landmark,
            'ipr': Shield,
            'labour_hr': User,
            'certifications': Award,
            'legal': Scale,
            'financial': FileText,
            'storage': Database
        };
        // If it's already a component (from local data), return it
        if (typeof iconName !== 'string') return iconName;
        // If string, lookup or default
        return iconMap[iconName] || Box;
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleEdit = (service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            categoryId: service.categoryId,
            price: service.price,
            sla: service.sla,
            docsRequired: service.docsRequired,
            description: service.description || '',
            status: service.status
        });
        setModalOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedService(null);
        setFormData(initialForm);
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setActionMessage(null);

        try {
            if (selectedService) {
                // Update
                await updateServiceProduct(selectedService.id, formData);
                setActionMessage({ type: 'success', text: 'Service updated successfully!' });
            } else {
                // Create
                await createServiceProduct(formData);
                setActionMessage({ type: 'success', text: 'New service created successfully!' });
            }
            // Close after delay or immediately refresh
            setTimeout(() => {
                setModalOpen(false);
                loadServices();
            }, 1000);
        } catch (error) {
            setActionMessage({ type: 'error', text: error.message || 'Operation failed' });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredServices = useMemo(() => {
        return services.filter(s => {
            // Check both API status and LocalStorage override
            const isInactive = s.status === 'INACTIVE' || inactiveIds.includes(s.id);
            const matchesCat = filterCategory === 'ALL' || s.categoryId === filterCategory;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' && !isInactive) || (filterStatus === 'INACTIVE' && isInactive);
            return matchesCat && matchesSearch && matchesStatus;
        });
    }, [services, inactiveIds, filterCategory, filterStatus, searchQuery]);

    // Metrics
    const metrics = useMemo(() => {
        const total = services.length;
        const active = total - inactiveIds.length;
        const inactive = inactiveIds.length;
        const avgPrice = total > 0 ? Math.round(services.reduce((acc, curr) => acc + curr.price, 0) / total) : 0;
        return { total, active, inactive, avgPrice };
    }, [services, inactiveIds]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Metrics */}
            <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-end">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A]">Pricing & Service Catalog</h2>
                    <p className="text-[#3D4D55] text-sm mt-1">Global pricing control and service requirement management.</p>
                </div>
                <div className="flex gap-4">
                    {[
                        { label: 'Total Services', val: metrics.total, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Active', val: metrics.active, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Inactive', val: metrics.inactive, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
                        { label: 'Avg Price', val: `₹${metrics.avgPrice}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((m, i) => (
                        <div key={i} className="hidden md:flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}><m.icon size={16} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-[#3D4D55] uppercase">{m.label}</p>
                                <p className="font-extrabold text-[#10232A]">{m.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex flex-1 gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow text-[#B58863]' : 'text-gray-400 hover:text-gray-600'}`}>
                            <LayoutGrid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-[#B58863]' : 'text-gray-400 hover:text-gray-600'}`}>
                            <List size={16} />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-2 shrink-0"></div>

                    {/* Category Tabs */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 py-1.5 px-3 outline-none cursor-pointer hover:bg-gray-100 transition"
                    >
                        <option value="ALL">All Categories</option>
                        {Object.values(SERVICE_DATA).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 py-1.5 px-3 outline-none cursor-pointer hover:bg-gray-100 transition"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active Only</option>
                        <option value="INACTIVE">Inactive Only</option>
                    </select>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4D55]" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-transparent focus:border-[#B58863] rounded-lg text-sm transition outline-none"
                        />
                    </div>
                    <button onClick={handleCreateNew} className="bg-[#10232A] hover:bg-[#B58863] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#10232A]/20 transition flex items-center gap-2 shrink-0">
                        <Plus size={16} /> <span className="hidden sm:inline">New Service</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {filteredServices.length === 0 ? (
                <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-4 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="p-4 bg-gray-50 rounded-full"><Box size={40} /></div>
                    <p className="font-bold">No services found matching your criteria.</p>
                    <button onClick={() => { setFilterCategory('ALL'); setSearchQuery('') }} className="text-blue-600 text-sm font-bold hover:underline">Clear Filters</button>
                </div>
            ) : (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredServices.map((s) => {
                            const isInactive = inactiveIds.includes(s.id);
                            return (
                                <div key={s.id} className={`bg-white rounded-2xl p-5 border transition-all duration-300 group hover:shadow-lg flex flex-col ${isInactive ? 'border-gray-200 opacity-70 grayscale-[0.5]' : 'border-gray-100 hover:border-blue-100'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform" style={{ backgroundColor: s.color }}>
                                            <s.icon size={20} />
                                        </div>
                                        <div className="relative">
                                            <button className="text-gray-300 hover:text-gray-600 transition"><MoreVertical size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-[10px] font-bold text-[#3D4D55] uppercase tracking-wider">{s.category}</span>
                                        <h3 className="font-bold text-[#10232A] text-sm mt-1 leading-snug line-clamp-2 min-h-[40px]">{s.name}</h3>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-gray-50 rounded-md text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                                <Clock size={10} /> {s.sla}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-50 rounded-md text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                                <FileText size={10} /> {s.docsRequired} Docs
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Pricing</p>
                                            <p className="font-extrabold text-lg text-[#10232A]">₹{s.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleEdit(s)} className="p-2 bg-gray-50 text-[#3D4D55] hover:text-[#B58863] rounded-lg transition border border-transparent hover:border-[#B58863]/20">
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(s.id)}
                                                className={`w-9 h-5 rounded-full flex items-center transition-colors px-0.5 ${!isInactive ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                                            >
                                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">SLA / Docs</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredServices.map((s) => {
                                    const isInactive = inactiveIds.includes(s.id);
                                    return (
                                        <tr key={s.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.color }}>
                                                        <s.icon size={14} />
                                                    </div>
                                                    <span className={`font-bold text-sm ${isInactive ? 'text-gray-400' : 'text-[#2B3446]'}`}>{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{s.category}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-[#2B3446]">₹{s.price.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10} /> {s.sla}</span>
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><FileText size={10} /> {s.docsRequired} Documents</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${!isInactive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {!isInactive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleToggleStatus(s.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition" title="Toggle Status">
                                                        <Power size={14} />
                                                    </button>
                                                    <button onClick={() => handleEdit(s)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition" title="Edit">
                                                        <Edit2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {/* Create Service Modal */}
            {createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#10232A]">{selectedService ? 'Update Pricing' : 'Create New Service'}</h3>
                                        <p className="text-xs text-[#3D4D55] mt-1">Configure details, pricing, and requirements.</p>
                                    </div>
                                    <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition"><X size={18} /></button>
                                </div>
                                <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                    {actionMessage && (
                                        <div className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${actionMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {actionMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                            {actionMessage.text}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Service Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Private Limited Company Registration"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B58863] focus:bg-white transition text-sm font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category</label>
                                            <select
                                                required
                                                value={formData.categoryId}
                                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B58863] focus:bg-white transition text-sm font-medium"
                                            >
                                                {Object.values(SERVICE_DATA).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Base Price (₹)</label>
                                            <div className="relative">
                                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    placeholder="4999"
                                                    className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B58863] focus:bg-white transition text-sm font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Est. SLA (Days)</label>
                                            <select
                                                value={formData.sla}
                                                onChange={e => setFormData({ ...formData, sla: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B58863] focus:bg-white transition text-sm font-medium"
                                            >
                                                <option>1-3 Days</option>
                                                <option>3-5 Days</option>
                                                <option>7-10 Days</option>
                                                <option>15+ Days</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Required Docs Count</label>
                                            <input
                                                type="number"
                                                value={formData.docsRequired}
                                                onChange={e => setFormData({ ...formData, docsRequired: e.target.value })}
                                                placeholder="2"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B58863] focus:bg-white transition text-sm font-medium"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Description & Deliverables</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe the service..."
                                                rows="4"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B58863] focus:bg-white transition text-sm font-medium resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-[#3D4D55] font-bold hover:bg-gray-100 rounded-xl transition text-sm">Cancel</button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2.5 bg-[#10232A] text-white font-bold rounded-xl hover:bg-[#B58863] shadow-lg shadow-[#10232A]/10 transition text-sm flex items-center gap-2"
                                        >
                                            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={16} />}
                                            {isSaving ? 'Saving...' : selectedService ? 'Update Product' : 'Create Product'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ServicesManagement;
