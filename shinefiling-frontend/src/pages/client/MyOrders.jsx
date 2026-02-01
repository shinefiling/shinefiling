import React, { useEffect, useState, useRef } from 'react';
import { Package, Search, ExternalLink, Download, MessageCircle, Clock, ChevronRight, FileCheck, Receipt, Loader2, Send, X, User, ShieldCheck, MoreVertical, Paperclip, Smile, Minimize2, Archive, CheckCircle, Terminal, Star, Briefcase, FileText, Filter, Activity, TrendingUp } from 'lucide-react';
import { getUserApplications, BASE_URL, getChatHistory, sendChatMessage, getUserUnreadChatCounts, markChatAsRead, setTypingStatus, getTypingStatus, editChatMessage, deleteChatMessage, clearChatHistory } from '../../api';
import FeedbackModal from '../../components/FeedbackModal';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const data = await getUserApplications(user.email);
                if (data) setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'All' || o.status === filter;
        const matchesSearch = o.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(o.id).includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeChatOrder, setActiveChatOrder] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [user, setUser] = useState(null);
    const [isMessageSending, setIsMessageSending] = useState(false);

    const chatEndRef = useRef(null);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [whoIsTyping, setWhoIsTyping] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const prevUnreadCounts = useRef({});
    const ordersRef = useRef(orders);
    const typingTimeoutRef = useRef(null);
    const [feedbackOrder, setFeedbackOrder] = useState(null);

    useEffect(() => {
        ordersRef.current = orders;
    }, [orders]);

    // Fetch user and start polling for unread counts
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
        if (u && u.email) {
            fetchUnreadCounts(u.email);
            const interval = setInterval(() => fetchUnreadCounts(u.email), 15000);
            return () => clearInterval(interval);
        }
    }, []);

    const fetchUnreadCounts = async (email) => {
        try {
            const counts = await getUserUnreadChatCounts(email);
            if (counts) {
                Object.keys(counts).forEach(chatId => {
                    const prev = prevUnreadCounts.current[chatId] || 0;
                    const curr = counts[chatId];
                    if (curr > prev) {
                        const order = ordersRef.current.find(o =>
                            o.submissionId === chatId || o.id === chatId || String(o.id) === String(chatId)
                        );

                        if (order) {
                            const title = `New Message`;
                            const body = `Order #${order.id.toString().replace('ORD-', '')}: You have a new message.`;

                            if (Notification.permission === 'granted' && (!activeChatOrder || (activeChatOrder.submissionId !== chatId && activeChatOrder.id !== chatId))) {
                                const notification = new Notification(title, { body, icon: '/favicon.ico' });
                                notification.onclick = () => {
                                    window.focus();
                                    openChat(order);
                                };
                            }
                        }
                    }
                });
                prevUnreadCounts.current = counts;
                setUnreadCounts(counts);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (activeChatOrder && !isChatMinimized) {
            scrollToBottom();
        }
    }, [chatHistory, activeChatOrder, isChatMinimized, whoIsTyping]);

    // Chat polling logic inside MyOrders
    useEffect(() => {
        let interval;
        if (activeChatOrder && !isChatMinimized) {
            const fetchChat = async () => {
                try {
                    const chatId = activeChatOrder.submissionId || activeChatOrder.id;
                    const history = await getChatHistory(chatId);

                    if (JSON.stringify(history) !== JSON.stringify(chatHistory)) {
                        setChatHistory(history || []);
                        scrollToBottom();
                    }

                    // Poll typing
                    const typing = await getTypingStatus(chatId);
                    const othersTyping = typing.filter(role => role === 'ADMIN'); // User cares if ADMIN is typing
                    setWhoIsTyping(othersTyping);

                } catch (e) { }
            };
            fetchChat();
            interval = setInterval(fetchChat, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeChatOrder, isChatMinimized, chatHistory]);

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        const chatId = activeChatOrder.submissionId || activeChatOrder.id;

        // Handle Edit
        if (editingMessageId) {
            await editChatMessage(chatId, editingMessageId, chatMessage);
            setEditingMessageId(null);
            setChatMessage('');
            // Force refresh
            const msgs = await getChatHistory(chatId);
            setChatHistory(msgs);
            return;
        }

        setIsMessageSending(true);
        // Stop typing immediately
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingStatus(chatId, 'USER', false);

        try {
            await sendChatMessage({
                ticketId: chatId,
                message: chatMessage,
                email: user.email,
                role: 'USER'
            });
            setChatMessage('');
            const history = await getChatHistory(chatId);
            setChatHistory(history || []);
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error(error);
        } finally {
            setIsMessageSending(false);
            setTypingStatus(chatId, 'USER', false);
        }
    };

    const handleTyping = (e) => {
        setChatMessage(e.target.value);
        if (activeChatOrder) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            setTypingStatus(chatId, 'USER', true);

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setTypingStatus(chatId, 'USER', false);
            }, 5000);
        }
    };

    const handleEditClick = (msg) => {
        setChatMessage(msg.message);
        setEditingMessageId(msg.id);
    };

    const handleDeleteClick = async (msgId) => {
        if (window.confirm('Delete this message?')) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            await deleteChatMessage(chatId, msgId);
            const msgs = await getChatHistory(chatId);
            setChatHistory(msgs);
        }
    }

    const handleClearChat = async () => {
        if (window.confirm('Clear chat history?')) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            await clearChatHistory(chatId);
            setChatHistory([]);
        }
    }

    const openDetails = (order) => setSelectedOrder(order);

    const openChat = async (order) => {
        setActiveChatOrder(order);
        setIsChatMinimized(false);
        setChatHistory([]);

        const chatId = order.submissionId || order.id;
        // Mark as read immediately when opening
        if (unreadCounts[chatId] > 0) {
            setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
            await markChatAsRead(chatId, 'USER'); // 'USER' is reading the message
            if (user && user.email) fetchUnreadCounts(user.email);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#015A62] dark:text-white">My Applications</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your ongoing business services.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search applications..."
                            className="bg-white dark:bg-[#043E52] border border-slate-200 dark:border-[#1C3540] rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-slate-700 dark:text-white focus:outline-none focus:border-[#ED6E3F]"
                        />
                    </div>
                    <div className="flex bg-[#FDFBF7] dark:bg-[#043E52] p-1 rounded-xl overflow-x-auto no-scrollbar gap-1 border border-slate-200 dark:border-[#1C3540]">
                        {['All', 'In Progress', 'Completed', 'Action Required'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === f
                                    ? 'bg-[#ED6E3F] text-white shadow-md'
                                    : 'text-[#3D4D55] dark:text-slate-400 hover:text-[#015A62] dark:hover:text-white hover:bg-white dark:hover:bg-[#1C3540]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center bg-white dark:bg-[#043E52] rounded-2xl border border-slate-100 dark:border-[#1C3540]">
                        <Loader2 className="w-8 h-8 animate-spin text-[#ED6E3F] mx-auto mb-3" />
                        <p className="text-slate-400 font-bold text-xs">Fetching applications...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-[#043E52] rounded-2xl border border-dashed border-slate-300 dark:border-[#1C3540] p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-[#1C3540] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Package size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">No applications found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mb-6 text-sm">You haven't placed any requests yet.</p>
                    </div>
                ) : (
                    filteredOrders.map((order, i) => (
                        <div key={i} className="bg-white dark:bg-[#043E52] rounded-2xl border border-slate-100 dark:border-[#1C3540] p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.status === 'Completed' ? 'bg-emerald-500' :
                                order.status === 'Action Required' ? 'bg-rose-500' : 'bg-blue-500'
                                }`}></div>

                            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between pl-3">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#FDFBF7] dark:bg-[#1C3540] border border-[#ED6E3F]/10 dark:border-[#ED6E3F]/20 rounded-xl flex items-center justify-center text-[#ED6E3F] shadow-sm shrink-0">
                                        {(() => {
                                            const name = order.serviceName?.toLowerCase() || '';
                                            if (name.includes('gst') || name.includes('tax')) return <Receipt size={22} />;
                                            if (name.includes('trademark') || name.includes('copyright')) return <ShieldCheck size={22} />;
                                            if (name.includes('private') || name.includes('company') || name.includes('llp')) return <Briefcase size={22} />;
                                            return <FileText size={22} />;
                                        })()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-[#015A62] dark:text-white text-base group-hover:text-[#ED6E3F] transition-colors">{order.serviceName}</h4>
                                            <span className="bg-slate-100 dark:bg-[#1C3540] text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700 font-bold">#{order.id.toString().replace('ORD-', '').substring(0, 8)}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                                            <span className={`flex items-center gap-1.5 ${order.paymentStatus === 'Success' ? 'text-emerald-500' : 'text-amber-500'}`}><FileCheck size={12} /> {order.paymentStatus === 'Success' ? 'Paid' : (order.paymentStatus || 'Unpaid')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#1C3540]">
                                    <button
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-2 ${order.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' :
                                            order.status === 'Action Required' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30' :
                                                'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500' :
                                            order.status === 'Action Required' ? 'bg-rose-500' : 'bg-blue-500'
                                            }`}></span>
                                        {order.status || 'Processing'}
                                    </button>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        {order.status === 'Completed' && (
                                            <button
                                                onClick={() => setFeedbackOrder(order)}
                                                className="flex-1 md:flex-none py-2 px-4 rounded-xl border border-[#ED6E3F] text-[#ED6E3F] font-bold text-[10px] hover:bg-[#ED6E3F] hover:text-white transition flex items-center justify-center gap-2"
                                            >
                                                <Star size={14} /> Feedback
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openChat(order)}
                                            className="flex-1 md:flex-none py-2 px-4 rounded-xl border border-slate-200 dark:border-[#2A4550] text-slate-600 dark:text-slate-300 font-bold text-[10px] hover:bg-slate-50 dark:hover:bg-[#1C3540] hover:text-[#015A62] dark:hover:text-white transition flex items-center justify-center gap-2 relative bg-white dark:bg-[#043E52]"
                                        >
                                            <MessageCircle size={14} /> Chat
                                            {(unreadCounts[order.submissionId] > 0 || unreadCounts[order.id] > 0) && (
                                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 text-[8px] text-white font-bold items-center justify-center"></span>
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => openDetails(order)}
                                            className="flex-1 md:flex-none py-2 px-4 rounded-xl bg-[#015A62] dark:bg-[#ED6E3F] text-white font-bold text-[10px] hover:bg-black dark:hover:bg-[#A57753] transition flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* DETAILS MODAL - PREMIUM REDESIGN */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#043E52] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-[#1C3540]">

                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-[#1C3540] bg-white dark:bg-[#043E52] flex justify-between items-start shrink-0">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-[#FDFBF7] dark:bg-[#1C3540] border border-[#ED6E3F]/20 rounded-2xl flex items-center justify-center text-[#ED6E3F] shadow-sm">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[#015A62] dark:text-white leading-tight">{selectedOrder.serviceName}</h3>
                                    <div className="flex items-center gap-3 mt-1.5 text-sm">
                                        <span className="font-mono font-bold text-slate-500 bg-slate-100 dark:bg-[#1C3540] px-2 py-0.5 rounded">#{selectedOrder.id.toString().replace('ORD-', '')}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Date N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2.5 bg-slate-50 dark:bg-[#1C3540] hover:bg-slate-100 dark:hover:bg-[#2A4550] rounded-full text-slate-500 dark:text-slate-400 transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] dark:bg-[#0D1C22]">
                            {(() => {
                                // DATA NORMALIZATION
                                let normalized = { ...selectedOrder };
                                let form = typeof selectedOrder.formData === 'string'
                                    ? (function () { try { return JSON.parse(selectedOrder.formData) } catch (e) { return {} } })()
                                    : (selectedOrder.formData || {});

                                if (form.formData && (Array.isArray(form.formData.companyNames) || form.formData.businessActivity)) {
                                    normalized.companyName1 = form.formData.companyNames ? form.formData.companyNames[0] : null;
                                    normalized.companyName2 = (form.formData.companyNames && form.formData.companyNames.length > 1) ? form.formData.companyNames[1] : null;
                                    normalized.activity = form.formData.businessActivity;
                                    normalized.authorizedCapital = form.formData.authorizedCapital;
                                    normalized.paidUpCapital = form.formData.paidUpCapital;
                                    const { addressLine1, district, state, pincode } = form.formData;
                                    normalized.registeredAddress = `${addressLine1 || ''}, ${district || ''}, ${state || ''} - ${pincode || ''}`;
                                    normalized.directors = form.formData.directors || [];
                                    if (form.documents && Array.isArray(form.documents)) {
                                        if (!normalized.uploadedDocuments) normalized.uploadedDocuments = {};
                                        form.documents.forEach(d => {
                                            if (d.fileUrl && d.fileUrl.trim() !== '') {
                                                normalized.uploadedDocuments[d.id] = d.fileUrl;
                                            }
                                        });
                                    }
                                } else {
                                    normalized.companyName1 = form.companyName1 || selectedOrder.businessName;
                                    normalized.companyName2 = form.companyName2;
                                    normalized.activity = form.activity;
                                    normalized.authorizedCapital = form.authorizedCapital;
                                    normalized.paidUpCapital = form.paidUpCapital;
                                    normalized.registeredAddress = form.registeredAddress;
                                    normalized.directors = form.directors || [];
                                    if (form.uploadedDocuments && typeof form.uploadedDocuments === 'object') {
                                        if (!normalized.uploadedDocuments) normalized.uploadedDocuments = {};
                                        Object.entries(form.uploadedDocuments).forEach(([k, v]) => {
                                            if (v && typeof v === 'string' && v.trim() !== '') {
                                                normalized.uploadedDocuments[k] = v;
                                            }
                                        });
                                    }
                                }
                                if (!normalized.uploadedDocuments) normalized.uploadedDocuments = {};

                                return (
                                    <div className="space-y-8">
                                        {/* 1. Status Stepper */}
                                        <div className="bg-white dark:bg-[#043E52] p-8 rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Activity size={100} />
                                            </div>
                                            <h4 className="font-bold text-[#015A62] dark:text-white text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-[#ED6E3F]" /> Tracking Timeline
                                            </h4>
                                            <div className="relative px-4">
                                                {/* Connecting Line */}
                                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-[#1C3540] z-0 mx-10"></div>
                                                <div className="flex justify-between relative z-10">
                                                    {['Review', 'Processing', 'Approval', 'Download'].map((s, idx) => {
                                                        const stages = ['SUBMITTED', 'PROCESSING', 'APPROVED', 'COMPLETED'];
                                                        const currentIdx = stages.findIndex(st => st === (selectedOrder.status === 'Action Required' ? 'PROCESSING' : selectedOrder.status)) || 0;
                                                        const isCompleted = currentIdx >= idx;

                                                        return (
                                                            <div key={s} className="flex flex-col items-center gap-4">
                                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all border-4 ${isCompleted ? 'bg-[#ED6E3F] text-white border-white dark:border-[#043E52] shadow-xl scale-110' : 'bg-slate-100 dark:bg-[#1C3540] text-slate-400 border-white dark:border-[#043E52]'}`}>
                                                                    {isCompleted ? <CheckCircle size={20} /> : idx + 1}
                                                                </div>
                                                                <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-[#015A62] dark:text-white' : 'text-slate-400'}`}>{s}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* 2. Left Column: Business Info */}
                                            <div className="lg:col-span-2 space-y-8">
                                                <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm overflow-hidden">
                                                    <div className="p-6 border-b border-slate-100 dark:border-[#1C3540] bg-slate-50/50 dark:bg-[#1C3540]/30 flex justify-between items-center">
                                                        <h4 className="font-bold text-[#015A62] dark:text-white flex items-center gap-2">
                                                            <Briefcase size={18} className="text-[#ED6E3F]" /> Application Details
                                                        </h4>
                                                    </div>
                                                    <div className="p-6">
                                                        {selectedOrder.serviceName && selectedOrder.serviceName.toLowerCase().includes('private limited') ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                                <div>
                                                                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Proposed Name 1</label>
                                                                    <p className="font-bold text-slate-800 dark:text-white">{normalized.companyName1 || '---'}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Proposed Name 2</label>
                                                                    <p className="font-bold text-slate-800 dark:text-white">{normalized.companyName2 || '---'}</p>
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Business Activity</label>
                                                                    <p className="font-medium text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{normalized.activity || 'N/A'}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Authorized Capital</label>
                                                                    <p className="font-bold text-slate-800 dark:text-white">{normalized.authorizedCapital || '---'}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Paid-up Capital</label>
                                                                    <p className="font-bold text-slate-800 dark:text-white">{normalized.paidUpCapital || '---'}</p>
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registered Address</label>
                                                                    <div className="flex items-start gap-2 bg-slate-50 dark:bg-[#1C3540] p-3 rounded-xl border border-slate-100 dark:border-[#2A4550]">
                                                                        <User size={16} className="text-[#ED6E3F] shrink-0 mt-0.5" />
                                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{normalized.registeredAddress || 'No address provided'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200 dark:border-[#2A4550]">
                                                                    <span className="text-slate-500 text-sm font-medium">Business Name / Applicant</span>
                                                                    <span className="font-bold text-[#015A62] dark:text-white">{normalized.businessName || selectedOrder.applicantName || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200 dark:border-[#2A4550]">
                                                                    <span className="text-slate-500 text-sm font-medium">Entity Type</span>
                                                                    <span className="font-bold text-[#015A62] dark:text-white">{selectedOrder.businessType || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. Right Column: Payment & Docs */}
                                            <div className="space-y-6">
                                                {/* Payment Card */}
                                                <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm p-6">
                                                    <h4 className="font-bold text-[#015A62] dark:text-white mb-4 flex items-center gap-2">
                                                        <Receipt size={18} className="text-[#ED6E3F]" /> Payment Summary
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-500">Service Fee</span>
                                                            <span className="font-bold text-slate-800 dark:text-white">₹{selectedOrder.amountPaid || '0.00'}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-500">Status</span>
                                                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Paid via Online</span>
                                                        </div>
                                                        <div className="pt-3 border-t border-slate-100 dark:border-[#1C3540] mt-1">
                                                            <button className="w-full py-2.5 bg-[#015A62] dark:bg-white text-white dark:text-[#015A62] font-bold rounded-xl text-xs hover:opacity-90 transition flex items-center justify-center gap-2">
                                                                <Download size={14} /> Download Invoice
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Files Card */}
                                                <div className="bg-white dark:bg-[#043E52] rounded-3xl border border-slate-100 dark:border-[#1C3540] shadow-sm p-6 flex-1">
                                                    <h4 className="font-bold text-[#015A62] dark:text-white mb-4 flex items-center gap-2">
                                                        <Paperclip size={18} className="text-[#ED6E3F]" /> Attachments
                                                    </h4>

                                                    <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
                                                        {normalized.uploadedDocuments && Object.keys(normalized.uploadedDocuments).length > 0 ? (
                                                            Object.entries(normalized.uploadedDocuments).map(([key, val]) => (
                                                                <a href={val} target="_blank" rel="noreferrer" key={key} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1C3540] rounded-xl hover:bg-slate-100 dark:hover:bg-[#2A4550] transition group">
                                                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#0D1C22] flex items-center justify-center text-slate-400 group-hover:text-[#ED6E3F]">
                                                                        <FileText size={16} />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-bold text-slate-700 dark:text-white truncate capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}</p>
                                                                        <span className="text-[9px] text-slate-400">View Document</span>
                                                                    </div>
                                                                </a>
                                                            ))
                                                        ) : (
                                                            <p className="text-xs text-slate-400 italic">No files attached.</p>
                                                        )}
                                                    </div>

                                                    {(selectedOrder.generatedDocuments && (Array.isArray(selectedOrder.generatedDocuments) ? selectedOrder.generatedDocuments.length > 0 : Object.keys(selectedOrder.generatedDocuments).length > 0)) && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#1C3540]">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Deliverables</p>
                                                            {/* Render deliverables similar to docs but with emerald theme - condensed for brevity */}
                                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
                                                                <Download size={16} className="text-emerald-600" />
                                                                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Download All Files</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING CHAT - Compact */}
            {activeChatOrder && (
                <div className={`fixed bottom-4 right-4 z-[100] w-[320px] shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#043E52] border border-gray-100 dark:border-[#1C3540] flex flex-col transition-all duration-300 ${isChatMinimized ? 'h-12' : 'h-[450px]'}`}>
                    <div className="p-3 bg-[#015A62] text-white flex justify-between items-center cursor-pointer shrink-0 z-10 relative" onClick={() => setIsChatMinimized(!isChatMinimized)}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><ShieldCheck size={12} /></div>
                            <div>
                                <h3 className="font-bold text-xs">Support</h3>
                                <p className="text-[9px] text-white/70">#{activeChatOrder.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setIsChatMinimized(!isChatMinimized); }} className="p-1 hover:bg-white/10 rounded"><Minimize2 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatOrder(null); }} className="p-1 hover:bg-white/10 rounded"><X size={14} /></button>
                        </div>
                    </div>

                    {!isChatMinimized && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#0D1C22] relative font-sans">
                            <div className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-[#0D1C22]">
                                {chatHistory.length === 0 && <div className="text-center text-gray-400 text-[10px] py-4">Start a conversation...</div>}
                                {chatHistory.map((msg, i) => {
                                    const isUser = msg.sender === 'USER' || msg.senderRole === 'USER' || msg.senderRole === 'GUEST';
                                    return (
                                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group relative`}>
                                            {isUser && (
                                                <div className="absolute top-0 right-0 -mr-7 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                    <button onClick={() => handleEditClick(msg)} className="p-1 hover:bg-gray-100 dark:hover:bg-[#1C3540] rounded text-gray-500"><Terminal size={10} /></button>
                                                    <button onClick={() => handleDeleteClick(msg.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-500"><X size={10} /></button>
                                                </div>
                                            )}
                                            <div className={`max-w-[85%] p-2 px-3 text-[10px] shadow-sm ${isUser
                                                ? 'bg-[#015A62] dark:bg-[#ED6E3F] text-white rounded-xl rounded-tr-none'
                                                : 'bg-white dark:bg-[#1C3540] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-[#2A4550] rounded-xl rounded-tl-none'
                                                }`}>
                                                {!isUser && <p className="text-[8px] font-bold text-[#ED6E3F] mb-0.5 opacity-80">{msg.senderName}</p>}
                                                <p className="leading-relaxed">{msg.message} {msg.edited && <span className="text-[8px] opacity-50 italic">(edited)</span>}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                                                    <span className={`text-[8px] font-bold ${isUser ? 'text-white/60' : 'text-gray-300'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isUser && (
                                                        <span className="text-white/80">
                                                            {msg.read ? <div className="flex -space-x-1"><CheckCircle size={10} className="fill-blue-400 text-white" /></div> : <CheckCircle size={10} />}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {whoIsTyping.length > 0 && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 dark:bg-[#1C3540] text-gray-500 dark:text-gray-400 rounded-xl rounded-tl-none p-2 px-3 text-[10px] flex items-center gap-1">
                                            <span className="animate-pulse">Agent is typing...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-2.5 bg-white dark:bg-[#043E52] border-t border-gray-100 dark:border-[#1C3540] flex items-center gap-2 shrink-0">
                                <button onClick={handleClearChat} className="text-gray-400 p-1 hover:text-red-500 transition" title="Clear Chat"><Archive size={16} /></button>
                                <input
                                    className="flex-1 bg-gray-50 dark:bg-[#1C3540] border border-gray-200 dark:border-[#2A4550] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#ED6E3F] transition-colors dark:text-white"
                                    placeholder={editingMessageId ? "Edit message..." : "Type your message..."}
                                    value={chatMessage}
                                    onChange={handleTyping}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button onClick={handleSendMessage} disabled={!chatMessage.trim() || isMessageSending} className={`p-1.5 rounded-lg ${chatMessage.trim() ? 'bg-[#ED6E3F] text-white' : 'bg-gray-100 dark:bg-[#1C3540] text-gray-400'}`}>
                                    {isMessageSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {feedbackOrder && (
                <FeedbackModal
                    order={feedbackOrder}
                    onClose={() => setFeedbackOrder(null)}
                    onSubmit={() => setFeedbackOrder(null)}
                />
            )}
        </div >
    );
};

export default MyOrders;
