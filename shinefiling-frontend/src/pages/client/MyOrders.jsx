import React, { useEffect, useState, useRef } from 'react';
import { Package, Search, ExternalLink, Download, MessageCircle, Clock, ChevronRight, FileCheck, Receipt, Loader2, Send, X, User, ShieldCheck, MoreVertical, Paperclip, Smile, Minimize2, Archive, CheckCircle, Terminal, Star } from 'lucide-react';
import { getUserApplications, BASE_URL, getChatHistory, sendChatMessage, getUserUnreadChatCounts, markChatAsRead, setTypingStatus, getTypingStatus, editChatMessage, deleteChatMessage, clearChatHistory } from '../../api';
import axios from 'axios';
import FeedbackModal from '../../components/FeedbackModal';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

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

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

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
        <div className="space-y-4 animate-in fade-in duration-500 pb-20">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-[#10232A] flex items-center gap-2 mb-1">
                        <Package className="text-[#B58863]" size={22} /> My Applications
                    </h2>
                    <p className="text-[#3D4D55] text-sm font-medium">Track your business filings.</p>
                </div>

                <div className="flex bg-[#FDFBF7] p-1 rounded-lg self-stretch md:self-auto overflow-x-auto no-scrollbar gap-1 border border-slate-100">
                    {['All', 'In Progress', 'Completed', 'Action Required'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${filter === f
                                ? 'bg-[#B58863] text-white shadow-md'
                                : 'text-[#3D4D55] hover:text-[#10232A] hover:bg-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                        <p className="text-slate-400 font-bold text-xs">Fetching applications...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                            <Package size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-700 mb-1">No orders found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mb-4 text-xs">You haven't placed any requests yet.</p>
                    </div>
                ) : (
                    filteredOrders.map((order, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.status === 'Completed' ? 'bg-emerald-500' :
                                order.status === 'Action Required' ? 'bg-rose-500' : 'bg-blue-500'
                                }`}></div>

                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pl-2">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-xl shadow-sm shrink-0">
                                        {['🏢', '📝', '📄', '®️'].find(emoji => Math.random() > 0.5) || '📄'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{order.serviceName}</h4>
                                            <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-mono border border-slate-200 font-bold">#{order.id.toString().replace('ORD-', '').substring(0, 8)}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 font-medium">
                                            <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                                            <span className="flex items-center gap-1 text-indigo-600"><FileCheck size={12} /> Est. 2 Days</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-2 w-full md:w-auto mt-1 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <button
                                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide inline-flex items-center gap-1 ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            order.status === 'Action Required' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
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
                                                className="flex-1 md:flex-none py-1.5 px-3 rounded-lg border border-[#B58863] text-[#B58863] font-bold text-[10px] hover:bg-[#B58863] hover:text-white transition flex items-center justify-center gap-1.5"
                                            >
                                                <Star size={14} /> Feedback
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openChat(order)}
                                            className="flex-1 md:flex-none py-1.5 px-3 rounded-lg border border-slate-200 text-slate-600 font-bold text-[10px] hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center gap-1.5 relative"
                                        >
                                            <MessageCircle size={14} /> Chat
                                            {(unreadCounts[order.submissionId] > 0 || unreadCounts[order.id] > 0) && (
                                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 text-[8px] text-white font-bold items-center justify-center">
                                                    </span>
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => openDetails(order)}
                                            className="flex-1 md:flex-none py-1.5 px-3 rounded-lg bg-[#10232A] text-white font-bold text-[10px] hover:bg-[#B58863] transition flex items-center justify-center gap-1.5 shadow-sm"
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

            {/* DETAILS MODAL - COMPACT */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:px-4 sm:py-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full h-[85vh] md:h-auto md:max-h-[85vh] md:max-w-3xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
                        <div className="px-5 py-3 border-b border-slate-100 bg-white z-10 flex-none flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 line-clamp-1">{selectedOrder.serviceName}</h3>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-medium">ID: #{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition border border-transparent hover:border-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        {(() => {
                            // DATA NORMALIZATION LOGIC
                            let normalized = { ...selectedOrder };
                            let form = typeof selectedOrder.formData === 'string'
                                ? (function () { try { return JSON.parse(selectedOrder.formData) } catch (e) { return {} } })()
                                : (selectedOrder.formData || {});

                            // CASE 1: Generic Order / Raw DTO
                            // often has structure: { formData: { companyNames: ... }, documents: [{id, fileUrl}] }
                            if (form.formData && (Array.isArray(form.formData.companyNames) || form.formData.businessActivity)) {
                                normalized.companyName1 = form.formData.companyNames ? form.formData.companyNames[0] : null;
                                normalized.companyName2 = (form.formData.companyNames && form.formData.companyNames.length > 1) ? form.formData.companyNames[1] : null;
                                normalized.activity = form.formData.businessActivity;
                                normalized.authorizedCapital = form.formData.authorizedCapital;
                                normalized.paidUpCapital = form.formData.paidUpCapital;

                                const { addressLine1, district, state, pincode } = form.formData;
                                normalized.registeredAddress = `${addressLine1 || ''}, ${district || ''}, ${state || ''} - ${pincode || ''}`;
                                normalized.directors = form.formData.directors || [];

                                // Extract Documents from DTO list
                                if (form.documents && Array.isArray(form.documents)) {
                                    if (!normalized.uploadedDocuments) normalized.uploadedDocuments = {};
                                    form.documents.forEach(d => {
                                        // STRICT FILTER: Only add if fileUrl exists and is not empty
                                        if (d.fileUrl && d.fileUrl.trim() !== '') {
                                            normalized.uploadedDocuments[d.id] = d.fileUrl;
                                        }
                                    });
                                }
                            }
                            // CASE 2: Specialized / Reconstructed Map (Backend Controller)
                            else {
                                normalized.companyName1 = form.companyName1 || selectedOrder.businessName;
                                normalized.companyName2 = form.companyName2;
                                normalized.activity = form.activity;
                                normalized.authorizedCapital = form.authorizedCapital;
                                normalized.paidUpCapital = form.paidUpCapital;
                                normalized.registeredAddress = form.registeredAddress;
                                normalized.directors = form.directors || [];

                                // Sometimes documents are inside the 'form' map itself for specialized controllers
                                if (form.uploadedDocuments && typeof form.uploadedDocuments === 'object') {
                                    if (!normalized.uploadedDocuments) normalized.uploadedDocuments = {};
                                    // Merge only valid entries
                                    Object.entries(form.uploadedDocuments).forEach(([k, v]) => {
                                        if (v && typeof v === 'string' && v.trim() !== '') {
                                            normalized.uploadedDocuments[k] = v;
                                        }
                                    });
                                }
                            }

                            // FINAL CHECK: Ensure 'uploadedDocuments' is valid object
                            if (!normalized.uploadedDocuments) normalized.uploadedDocuments = {};

                            // Debug log to help trace if needed (optional)
                            // console.log("Normalized Docs:", normalized.uploadedDocuments);

                            return (
                                <div className="overflow-y-auto p-5 bg-slate-50/50 custom-scrollbar pb-20 h-full">
                                    <div className="space-y-4 max-w-3xl mx-auto">
                                        {/* Timeline */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <h4 className="font-bold text-slate-700 text-xs mb-4">Timeline</h4>
                                            <div className="flex items-center justify-between relative px-2">
                                                <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-slate-100 -z-0"></div>
                                                {['SUBMITTED', 'PROCESSING', 'COMPLETED'].map((s, idx) => {
                                                    const isCompleted = ['SUBMITTED', 'PROCESSING', 'COMPLETED'].indexOf(selectedOrder.status) >= idx;
                                                    return (
                                                        <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2 border-white ${isCompleted ? 'bg-emerald-500 text-white shadow-md scale-110' : 'bg-slate-200 text-slate-400'}`}>
                                                                {isCompleted ? <FileCheck size={12} /> : idx + 1}
                                                            </div>
                                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>{s}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Business Details */}
                                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5"><User size={14} className="text-indigo-600" /> Business Details</h4>

                                                {selectedOrder.serviceName && selectedOrder.serviceName.toLowerCase().includes('private limited') ? (
                                                    <div className="space-y-2 text-xs text-slate-600">
                                                        <div className="flex flex-col border-dashed border-b border-slate-100 pb-2">
                                                            <span className="text-slate-400 font-medium mb-1">Proposed Names</span>
                                                            <span className="font-bold text-slate-800">1. {normalized.companyName1 || 'N/A'}</span>
                                                            {normalized.companyName2 && <span className="font-bold text-slate-800">2. {normalized.companyName2}</span>}
                                                        </div>
                                                        <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5 pt-1.5"><span className="text-slate-400 font-medium">Activity</span> <span className="font-bold text-slate-800 text-right truncate pl-2">{normalized.activity || 'N/A'}</span></div>
                                                        <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5"><span className="text-slate-400 font-medium">Auth. Capital</span> <span className="font-bold text-slate-800">{normalized.authorizedCapital || 'N/A'}</span></div>
                                                        <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5"><span className="text-slate-400 font-medium">Paid-up Capital</span> <span className="font-bold text-slate-800">{normalized.paidUpCapital || 'N/A'}</span></div>
                                                        <div className="pt-1">
                                                            <span className="text-slate-400 font-medium block mb-1">Registered Address</span>
                                                            <span className="font-bold text-slate-800 block leading-snug">{normalized.registeredAddress || 'N/A'}</span>
                                                        </div>
                                                        {normalized.directors && normalized.directors.length > 0 && (
                                                            <div className="pt-2 mt-2 border-t border-slate-100">
                                                                <span className="text-slate-400 font-medium block mb-2">Directors</span>
                                                                <div className="space-y-1.5">
                                                                    {normalized.directors.map((d, idx) => (
                                                                        <div key={idx} className="bg-slate-50 p-1.5 rounded text-[10px] font-bold text-slate-700 border border-slate-100 flex items-center gap-2">
                                                                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[9px] border border-slate-200">{d.name?.charAt(0)}</div>
                                                                            {d.name}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 text-xs text-slate-600">
                                                        <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5"><span className="text-slate-400 font-medium">Name</span> <span className="font-bold text-slate-800">{normalized.businessName || 'N/A'}</span></div>
                                                        <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5"><span className="text-slate-400 font-medium">Type</span> <span className="font-bold text-slate-800">{selectedOrder.businessType || 'N/A'}</span></div>
                                                        <div className="flex justify-between"><span className="text-slate-400 font-medium">Owner</span> <span className="font-bold text-slate-800">{selectedOrder.applicantName || 'N/A'}</span></div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Payment Info */}
                                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5"><Receipt size={14} className="text-indigo-600" /> Payment Info</h4>
                                                <div className="space-y-2 text-xs text-slate-600">
                                                    <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5"><span className="text-slate-400 font-medium">Amount</span> <span className="font-bold text-emerald-600">₹{selectedOrder.amountPaid || '0'}</span></div>
                                                    <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5"><span className="text-slate-400 font-medium">Txn ID</span> <span className="font-mono text-[9px] bg-slate-100 px-1 py-0.5 rounded font-bold">{selectedOrder.paymentId || 'N/A'}</span></div>
                                                    <div className="flex justify-between border-dashed border-b border-slate-100 pb-1.5"><span className="text-slate-400 font-medium">Date</span> <span className="font-bold text-slate-800">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                                                    {(selectedOrder.status !== 'DRAFT' && selectedOrder.serviceName?.toUpperCase().includes('FSSAI')) && (
                                                        <a href={`${BASE_URL}/payment/invoice/${selectedOrder.submissionId || selectedOrder.id}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition shadow-sm mt-1">
                                                            <Download size={12} /> Invoice
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div>
                                            <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5">Documents</h4>
                                            {normalized.uploadedDocuments && Object.keys(normalized.uploadedDocuments).length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {Object.entries(normalized.uploadedDocuments).map(([key, val]) => (
                                                        <a href={val} target="_blank" rel="noreferrer" key={key} className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group/doc">
                                                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover/doc:scale-110 transition"><Download size={14} /></div>
                                                            <div className="overflow-hidden min-w-0">
                                                                <p className="font-bold text-[10px] text-slate-700 truncate capitalize mb-0.5">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}</p>
                                                                <p className="text-[9px] text-slate-400 flex items-center gap-1 font-bold">View <ExternalLink size={8} /></p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-[10px]">No documents found.</div>
                                            )}

                                            {/* Generated/Admin Uploaded Documents */}
                                            {selectedOrder.generatedDocuments && (Array.isArray(selectedOrder.generatedDocuments) ? selectedOrder.generatedDocuments.length > 0 : Object.keys(selectedOrder.generatedDocuments).length > 0) && (
                                                <div className="mt-4 pt-4 border-t border-slate-100">
                                                    <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5"><Archive size={14} className="text-emerald-600" /> Certificates & Downloads</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {Array.isArray(selectedOrder.generatedDocuments) ? (
                                                            selectedOrder.generatedDocuments.map((docPath, i) => (
                                                                <a href={`${BASE_URL}/files/download?path=${encodeURIComponent(docPath)}`} target="_blank" rel="noreferrer" key={i} className="flex items-center gap-2.5 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-all group/doc">
                                                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover/doc:scale-110 transition"><Download size={14} /></div>
                                                                    <div className="overflow-hidden min-w-0">
                                                                        <p className="font-bold text-[10px] text-slate-700 truncate capitalize mb-0.5">{docPath.split('/').pop()}</p>
                                                                        <p className="text-[9px] text-emerald-600 flex items-center gap-1 font-bold">Download <Download size={8} /></p>
                                                                    </div>
                                                                </a>
                                                            ))
                                                        ) : (
                                                            Object.entries(selectedOrder.generatedDocuments).map(([key, val]) => (
                                                                <a href={`${BASE_URL}/admin/download-docs/${selectedOrder.submissionId || selectedOrder.id}?type=${key}`} target="_blank" rel="noreferrer" key={key} className="flex items-center gap-2.5 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-all group/doc">
                                                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover/doc:scale-110 transition"><Download size={14} /></div>
                                                                    <div className="overflow-hidden min-w-0">
                                                                        <p className="font-bold text-[10px] text-slate-700 truncate capitalize mb-0.5">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                                        <p className="text-[9px] text-emerald-600 flex items-center gap-1 font-bold">Download <Download size={8} /></p>
                                                                    </div>
                                                                </a>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )
            }

            {/* FLOATING CHAT - Compact */}
            {
                activeChatOrder && (
                    <div className={`fixed bottom-4 right-4 z-[100] w-[320px] shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-100 flex flex-col transition-all duration-300 ${isChatMinimized ? 'h-12' : 'h-[450px]'}`}>
                        <div className="p-3 bg-indigo-900 text-white flex justify-between items-center cursor-pointer shrink-0 z-10 relative" onClick={() => setIsChatMinimized(!isChatMinimized)}>
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
                            <div className="flex-1 flex flex-col min-h-0 bg-white relative font-sans">
                                <div className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
                                    {chatHistory.length === 0 && <div className="text-center text-gray-400 text-[10px] py-4">Start a conversation...</div>}
                                    {chatHistory.map((msg, i) => {
                                        const isUser = msg.sender === 'USER' || msg.senderRole === 'USER' || msg.senderRole === 'GUEST';
                                        const isAdmin = !isUser;
                                        return (
                                            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group relative`}>
                                                {/* Messages Actions (Edit/Delete) - Only for own messages (User) */}
                                                {isUser && (
                                                    <div className="absolute top-0 right-0 -mr-7 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                        <button onClick={() => handleEditClick(msg)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Terminal size={10} /></button>
                                                        <button onClick={() => handleDeleteClick(msg.id)} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={10} /></button>
                                                    </div>
                                                )}

                                                <div className={`max-w-[85%] p-2 px-3 text-[10px] shadow-sm ${isUser
                                                    ? 'bg-[#4A3B89] text-white rounded-xl rounded-tr-none'
                                                    : 'bg-white text-gray-800 border-gray-100 rounded-xl rounded-tl-none'
                                                    }`}>
                                                    {!isUser && <p className="text-[8px] font-bold text-[#4A3B89] mb-0.5 opacity-80">{msg.senderName}</p>}
                                                    <p className="leading-relaxed">{msg.message} {msg.edited && <span className="text-[8px] opacity-50 italic">(edited)</span>}</p>
                                                    <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                                                        <span className={`text-[8px] font-bold ${isUser ? 'text-white/60' : 'text-gray-300'}`}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isUser && (
                                                            <span className="text-white/80">
                                                                {msg.read ? (
                                                                    // Double tick (Read)
                                                                    <div className="flex -space-x-1">
                                                                        <CheckCircle size={10} className="fill-blue-400 text-white" />
                                                                    </div>
                                                                ) : (
                                                                    // Single tick (Sent)
                                                                    <CheckCircle size={10} />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {whoIsTyping.length > 0 && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 text-gray-500 rounded-xl rounded-tl-none p-2 px-3 text-[10px] flex items-center gap-1">
                                                <span className="animate-pulse">Agent is typing...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input Area - Static Compact */}
                                <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                                    <button onClick={handleClearChat} className="text-gray-400 p-1 hover:text-red-500 transition" title="Clear Chat"><Archive size={16} /></button>
                                    <input
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#4A3B89] transition-colors"
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
                                    <button onClick={handleSendMessage} disabled={!chatMessage.trim() || isMessageSending} className={`p-1.5 rounded-lg ${chatMessage.trim() ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {isMessageSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Feedback Modal */}
            {
                feedbackOrder && (
                    <FeedbackModal
                        order={feedbackOrder}
                        onClose={() => setFeedbackOrder(null)}
                        onSubmit={() => {
                            // Optionally refresh orders or show success message
                            setFeedbackOrder(null);
                        }}
                    />
                )
            }
        </div >
    );
};

export default MyOrders;
