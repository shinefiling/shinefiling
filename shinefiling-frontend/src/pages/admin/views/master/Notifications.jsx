import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Mail, Bell, Send, Clock, CheckCircle,
    AlertTriangle, Info, X, Trash2, Filter, Search, Inbox,
    FileText, Plus, Edit2, Save, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getNotifications, markNotificationRead, markAllNotificationsRead,
    getTemplates, createTemplate, updateTemplate, deleteTemplate
} from '../../../../api';

const Notifications = () => {
    const [activeTab, setActiveTab] = useState('inbox');
    // Tabs: 'inbox', 'broadcast', 'email-templates', 'whatsapp-templates'

    // Notifications State
    const [notifications, setNotifications] = useState([]);

    // Templates State
    const [templates, setTemplates] = useState([]);
    const [editingTemplate, setEditingTemplate] = useState(null); // null = list, object = edit/create
    const [templateForm, setTemplateForm] = useState({ name: '', subject: '', body: '', variables: '' });

    // Poll for notifications
    useEffect(() => {
        const fetchNotifs = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.email) {
                try {
                    const data = await getNotifications(user.email);
                    if (data && Array.isArray(data)) {
                        const mapped = data.map(n => ({
                            id: n.id,
                            type: (n.type || 'INFO').toLowerCase(),
                            title: n.title,
                            msg: n.message,
                            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            read: n.read || n.isRead
                        }));
                        setNotifications(mapped);
                    }
                } catch (e) { console.error(e); }
            }
        };

        const fetchTemplatesData = async () => {
            try {
                const data = await getTemplates();
                if (Array.isArray(data)) setTemplates(data);
            } catch (e) { console.error(e); }
        };

        fetchNotifs();
        fetchTemplatesData(); // Initial load

        const interval = setInterval(fetchNotifs, 10000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (e) { }
    };

    const markAllRead = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            await markAllNotificationsRead(user.email);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const deleteNotif = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // --- TEMPLATE HANDLERS ---
    const handleSaveTemplate = async () => {
        const type = activeTab === 'email-templates' ? 'EMAIL' : 'WHATSAPP';
        const payload = { ...templateForm, type };

        try {
            if (editingTemplate && editingTemplate.id) {
                await updateTemplate(editingTemplate.id, payload);
            } else {
                await createTemplate(payload);
            }
            // Refresh
            const data = await getTemplates();
            setTemplates(data || []);
            setEditingTemplate(null);
            setTemplateForm({ name: '', subject: '', body: '', variables: '' });
        } catch (e) { alert("Failed to save template"); }
    };

    const handleDeleteTemplate = async (id) => {
        if (!window.confirm("Delete this template?")) return;
        try {
            await deleteTemplate(id);
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (e) { alert("Failed to delete"); }
    };

    const openTemplateEditor = (tpl = null) => {
        setEditingTemplate(tpl || { new: true });
        if (tpl) {
            setTemplateForm({
                name: tpl.name,
                subject: tpl.subject || '',
                body: tpl.body || '',
                variables: tpl.variables || ''
            });
        } else {
            setTemplateForm({ name: '', subject: '', body: '', variables: '' });
        }
    };

    const getFilteredTemplates = () => {
        const type = activeTab === 'email-templates' ? 'EMAIL' : 'WHATSAPP';
        return templates.filter(t => t.type === type);
    };

    // Icons Map
    const getIcon = (type) => {
        const t = (type || 'INFO').toUpperCase();
        if (t === 'SUCCESS') return <CheckCircle size={18} className="text-green-500" />;
        if (t === 'WARNING') return <AlertTriangle size={18} className="text-orange-500" />;
        if (t === 'ERROR') return <AlertTriangle size={18} className="text-red-500" />;
        return <Info size={18} className="text-blue-500" />;
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A]">Notification Center</h2>
                    <p className="text-[#3D4D55] text-sm">Manage alerts, broadcasts, and communication templates.</p>
                </div>
                <div className="p-1.5 bg-white rounded-xl border border-gray-100 shadow-sm flex gap-1 overflow-x-auto max-w-full">
                    <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'inbox' ? 'bg-[#FDFBF7] text-[#B58863] border border-[#B58863]/20 shadow-sm' : 'text-[#3D4D55] hover:bg-gray-50'}`}>
                        <Inbox size={14} /> Inbox
                        {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">{unreadCount}</span>}
                    </button>
                    <button onClick={() => setActiveTab('broadcast')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'broadcast' ? 'bg-[#FDFBF7] text-[#B58863] border border-[#B58863]/20 shadow-sm' : 'text-[#3D4D55] hover:bg-gray-50'}`}>
                        <Send size={14} /> Broadcast
                    </button>
                    <button onClick={() => setActiveTab('email-templates')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'email-templates' ? 'bg-[#FDFBF7] text-[#B58863] border border-[#B58863]/20 shadow-sm' : 'text-[#3D4D55] hover:bg-gray-50'}`}>
                        <Mail size={14} /> Email Tpl
                    </button>
                    <button onClick={() => setActiveTab('whatsapp-templates')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'whatsapp-templates' ? 'bg-[#FDFBF7] text-[#B58863] border border-[#B58863]/20 shadow-sm' : 'text-[#3D4D55] hover:bg-gray-50'}`}>
                        <MessageSquare size={14} /> WhatsApp Tpl
                    </button>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 relative min-h-[500px]">
                <AnimatePresence mode='wait'>

                    {/* INBOX TAB */}
                    {activeTab === 'inbox' && (
                        <motion.div
                            key="inbox"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1">
                                        <Filter size={12} /> Filter
                                    </button>
                                    <div className="relative">
                                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none w-48" placeholder="Search alerts..." />
                                    </div>
                                </div>
                                <button onClick={markAllRead} className="text-xs font-bold text-[#B58863] hover:underline">Mark all read</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {notifications.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                        <Bell size={48} className="mb-2 opacity-20" />
                                        <p>No notifications yet</p>
                                    </div>
                                )}
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-4 rounded-xl border flex gap-4 transition-all hover:shadow-md ${n.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'}`}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        <div className={`p-2 rounded-full h-fit shrink-0 ${n.type === 'success' ? 'bg-green-100' :
                                            n.type === 'error' ? 'bg-red-100' :
                                                n.type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                                            }`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`font-bold text-sm ${n.read ? 'text-[#10232A]' : 'text-black'}`}>{n.title}</h4>
                                                <span className="text-[10px] font-bold text-[#3D4D55] bg-gray-100 px-2 py-0.5 rounded-full">{n.time}</span>
                                            </div>
                                            <p className={`text-xs mt-1 ${n.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>{n.msg}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                                            className="text-gray-300 hover:text-red-400 p-1"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* BROADCAST TAB */}
                    {activeTab === 'broadcast' && (
                        <motion.div
                            key="broadcast"
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto h-full"
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <h3 className="font-bold text-[#10232A] text-lg">Send System Broadcast</h3>
                                    <p className="text-sm text-[#3D4D55]">Message all users or specific groups.</p>
                                </div>
                                {/* Broadcast form (existing) */}
                                <div className="space-y-5 flex-1">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-[#3D4D55] uppercase mb-2 block">Target Audience</label>
                                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#10232A] outline-none focus:border-[#B58863] focus:bg-white transition">
                                                <option>All Users (Clients)</option>
                                                <option>All Agents</option>
                                                <option>Sub-Admins Only</option>
                                                <option>Specific User Group (Beta)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Priority Level</label>
                                            <div className="flex gap-2">
                                                <label className="flex-1 cursor-pointer">
                                                    <input type="radio" name="priority" className="peer hidden" defaultChecked />
                                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-200 transition">Normal</div>
                                                </label>
                                                <label className="flex-1 cursor-pointer">
                                                    <input type="radio" name="priority" className="peer hidden" />
                                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs font-bold text-gray-500 peer-checked:bg-red-50 peer-checked:text-red-600 peer-checked:border-red-200 transition">High / Critical</div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-[#3D4D55] uppercase mb-2 block">Subject / Title</label>
                                        <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#10232A] outline-none focus:border-[#B58863] focus:bg-white transition" placeholder="e.g. Scheduled System Maintenance" />
                                    </div>

                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Message Content</label>
                                        <textarea className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:bg-white focus:border-purple-500 transition" placeholder="Type your announcement here..."></textarea>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <label className="flex items-center gap-2 p-3 bg-green-50 rounded-xl cursor-pointer border border-transparent hover:border-green-200 transition">
                                            <input type="checkbox" className="w-4 h-4 text-green-600 rounded" defaultChecked />
                                            <span className="text-sm font-bold text-green-700 flex items-center gap-2"><MessageSquare size={16} /> WhatsApp</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl cursor-pointer border border-transparent hover:border-blue-200 transition">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                                            <span className="text-sm font-bold text-blue-700 flex items-center gap-2"><Mail size={16} /> Email</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl cursor-pointer border border-transparent hover:border-orange-200 transition">
                                            <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" defaultChecked />
                                            <span className="text-sm font-bold text-orange-700 flex items-center gap-2"><Bell size={16} /> In-App Push</span>
                                        </label>
                                    </div>

                                    <button className="w-full py-4 bg-[#10232A] text-white font-bold rounded-xl shadow-lg hover:bg-[#B58863] transition flex items-center justify-center gap-2 mt-4">
                                        <Send size={18} /> Send Broadcast Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* EMAIL & WHATSAPP TEMPLATES TABS */}
                    {(activeTab === 'email-templates' || activeTab === 'whatsapp-templates') && (
                        <motion.div
                            key="templates"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm flex h-full overflow-hidden"
                        >
                            {/* Left: List */}
                            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                                    <h3 className="font-bold text-[#10232A]">
                                        {activeTab === 'email-templates' ? 'Email Templates' : 'WhatsApp Templates'}
                                    </h3>
                                    <button onClick={() => openTemplateEditor()} className="p-2 bg-[#10232A] text-white rounded-lg hover:bg-[#B58863] transition">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {getFilteredTemplates().map(t => (
                                        <div key={t.id} onClick={() => openTemplateEditor(t)} className="p-3 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-[#B58863] transition hover:shadow-sm">
                                            <h4 className="font-bold text-sm text-[#10232A]">{t.name}</h4>
                                            <p className="text-xs text-[#3D4D55] mt-1 line-clamp-1">{t.subject || t.body.substring(0, 30)}</p>
                                        </div>
                                    ))}
                                    {getFilteredTemplates().length === 0 && (
                                        <div className="text-center p-8 text-gray-400 text-xs">No templates found. Create one!</div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Editor */}
                            <div className="w-2/3 flex flex-col h-full bg-white">
                                {editingTemplate ? (
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                            <h3 className="font-bold text-gray-700">{editingTemplate.id ? 'Edit Template' : 'New Template'}</h3>
                                            <div className="flex gap-2">
                                                {editingTemplate.id && (
                                                    <button onClick={() => handleDeleteTemplate(editingTemplate.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => setEditingTemplate(null)} className="text-gray-400 p-2 hover:bg-gray-100 rounded-lg">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 overflow-y-auto space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#3D4D55] uppercase mb-1">Template Name</label>
                                                <input value={templateForm.name} onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-[#B58863] font-bold text-[#10232A]" placeholder="e.g. Welcome Email" />
                                            </div>

                                            {activeTab === 'email-templates' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                                                    <input value={templateForm.subject} onChange={e => setTemplateForm({ ...templateForm, subject: e.target.value })} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-sm" placeholder="Email Subject Line" />
                                                </div>
                                            )}

                                            <div className="flex-1 flex flex-col">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content Body</label>
                                                <textarea value={templateForm.body} onChange={e => setTemplateForm({ ...templateForm, body: e.target.value })} className="w-full h-48 p-4 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 resize-none font-mono text-sm" placeholder="Hello {{name}}, content here..."></textarea>
                                                <p className="text-[10px] text-gray-400 mt-2">Available Variables: {'{{name}}'}, {'{{order_id}}'}, {'{{status}}'}, {'{{date}}'}</p>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Variables Used (Comma Sep)</label>
                                                <input value={templateForm.variables} onChange={e => setTemplateForm({ ...templateForm, variables: e.target.value })} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 text-xs" placeholder="name, order_id" />
                                            </div>
                                        </div>
                                        <div className="p-4 border-t border-gray-100 flex justify-end">
                                            <button onClick={handleSaveTemplate} className="px-6 py-2 bg-[#10232A] text-white font-bold rounded-lg hover:bg-[#B58863] transition flex items-center gap-2">
                                                <Save size={16} /> Save Template
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                                        <FileText size={48} className="mb-2 opacity-20" />
                                        <p>Select a template to edit or create new.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
