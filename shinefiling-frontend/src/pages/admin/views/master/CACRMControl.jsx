import React, { useState, useEffect } from 'react';
import {
    Settings, Shield, FileText, Calendar, DollarSign, Users, Bell,
    Activity, Lock, Save, Plus, Trash2, CheckCircle, AlertTriangle, Briefcase,
    Clock, Scale, Database, FileCheck, Search, Filter, Download, Loader2
} from 'lucide-react';
import { getComplianceRules, getServiceConfigs, getBillingSettings, getSystemRoles } from '../../../../api';

const CACRMControl = ({ defaultTab = 'compliance' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (defaultTab) setActiveTab(defaultTab);
    }, [defaultTab]);

    // Dynamic Data State
    const [complianceRules, setComplianceRules] = useState([]);
    const [allowedServices, setAllowedServices] = useState([]);
    const [billingRules, setBillingRules] = useState({ minServiceFee: '', maxServiceFee: '', subscriptionPlans: [] });
    const [caRoles, setCaRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'compliance') {
                const data = await getComplianceRules();
                if (Array.isArray(data)) setComplianceRules(data);
            }
            if (activeTab === 'services') {
                const data = await getServiceConfigs();
                if (Array.isArray(data)) setAllowedServices(data);
            }
            if (activeTab === 'billing') {
                const data = await getBillingSettings();
                if (data) setBillingRules(prev => ({ ...prev, ...data }));
            }
            if (activeTab === 'roles') {
                const data = await getSystemRoles();
                if (Array.isArray(data)) setCaRoles(data);
            }
        } catch (error) {
            console.error("Failed to load data for tab:", activeTab, error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderComplianceTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Compliance & Due Dates</h3>
                    <p className="text-sm text-slate-500">Define filing frequencies, due dates, and penalty logic.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
                    <Plus size={16} /> Add Rule
                </button>
            </div>

            {complianceRules.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 font-bold">No compliance rules found.</p>
                    <p className="text-xs text-slate-400 mt-1">Add a new rule to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complianceRules.map(rule => (
                        <div key={rule.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative group">
                            <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    {rule.type}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{rule.type} Compliance</h4>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 font-bold">{rule.frequency}</span>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Due Date Logic</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">Day {rule.dueDateDays}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Penalty</span>
                                    <span className="font-bold text-red-500">{rule.penaltyMetrics}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderServicesTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Service Configuration</h3>
                    <p className="text-sm text-slate-500">Control which services CAs can offer and approval workflows.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-bold">Service Name</th>
                            <th className="px-6 py-4 font-bold">Mandatory Docs</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {allowedServices.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-slate-500">No services configured.</td>
                            </tr>
                        ) : allowedServices.map(svc => (
                            <tr key={svc.id}>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{svc.name}</td>
                                <td className="px-6 py-4 text-slate-500">
                                    <div className="flex gap-2 flex-wrap">
                                        {Array.isArray(svc.docsRequired)
                                            ? svc.docsRequired.map(d => <span key={d} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">{d}</span>)
                                            : <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">{svc.docsRequired} Documents Required</span>
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${svc.enabled ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {svc.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-500 hover:underline font-bold text-xs">Configure</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderBillingTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fee Limits */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                        <DollarSign size={18} className="text-[#F97316]" /> Service Fee Limits
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Minimum Service Fee (₹)</label>
                            <input type="number" value={billingRules.minServiceFee} className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Maximum Service Fee (₹)</label>
                            <input type="number" value={billingRules.maxServiceFee} className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold" />
                        </div>
                    </div>
                </div>

                {/* Subscription Plans */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Activity size={18} className="text-[#F97316]" /> CA Subscriptions
                        </h3>
                        <button className="text-xs text-[#F97316] font-bold">Manage Plans</button>
                    </div>
                    <div className="space-y-3">
                        {billingRules.subscriptionPlans.map((plan, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{plan.name}</p>
                                    <p className="text-xs text-slate-500">{plan.limit}</p>
                                </div>
                                <span className="font-bold text-slate-600 dark:text-slate-300">₹{plan.price}/mo</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRolesTab = () => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">CA Role & Permission Matrix</h3>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-slate-500"><Loader2 className="animate-spin inline mr-2" /> Loading Roles...</div>
                ) : caRoles.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">No roles configured.</div>
                ) : (
                    caRoles.map(role => (
                        <div key={role.id || role.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">{(role.name || 'R')[0]}</div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">{role.name}</span>
                            </div>
                            <div className="flex gap-4 text-xs font-bold text-slate-500">
                                <label className="flex items-center gap-2"><input type="checkbox" checked={role.canView} readOnly /> View</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={role.canApprove} readOnly /> Approve</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={role.canFile} readOnly /> File</label>
                                <button className="text-[#F97316] hover:underline">Edit</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const TAB_NAMES = {
        compliance: 'Compliance & Due Dates',
        services: 'Service Configuration',
        billing: 'Billing & Fees',
        roles: 'Roles & Access',
        audit: 'System Audit Logs',
        power: 'Power Actions'
    };

    return (
        <div className="space-y-6 font-[Roboto,sans-serif]">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <Scale className="text-[#F97316]" size={28} /> CA CRM Control Center <span className="text-slate-300 dark:text-slate-600">/</span> {TAB_NAMES[activeTab] || 'Settings'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Master controls for CA onboarding, compliance rules, service configuration, and system-wide settings.
                </p>
            </div>

            {/* Content Body - Driven by activeTab (from prop/sidebar) */}
            <div className="min-h-[400px]">
                {activeTab === 'compliance' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderComplianceTab())}
                {activeTab === 'services' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderServicesTab())}
                {activeTab === 'billing' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderBillingTab())}
                {activeTab === 'roles' && (isLoading ? <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div> : renderRolesTab())}

                {activeTab === 'audit' && (
                    <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <FileCheck size={40} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="font-bold text-slate-500">System Audit Logs</h3>
                        <p className="text-xs text-slate-400">View filing history, changes, and approval logs here.</p>
                    </div>
                )}

                {activeTab === 'power' && (
                    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                        <h3 className="text-red-600 font-bold flex items-center gap-2 mb-4"><AlertTriangle size={20} /> Master Power Actions</h3>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50">Suspend CA Access</button>
                            <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50">Force Close Filings</button>
                            <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50">Reset Permissions</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CACRMControl;
