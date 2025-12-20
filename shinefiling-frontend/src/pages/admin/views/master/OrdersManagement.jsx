import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Activity, ChevronRight, X, User, Search, RefreshCcw, Shield, Zap, Terminal, Play, Eye, Archive, MessageCircle, ShieldCheck, MoreVertical, Paperclip, Smile, Minimize2, Loader2, Send, Mail, Phone, ExternalLink, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    updateApplicationStatus, verifyPrivateLimitedDocs, startAutomation, getAutomationLogs, getAllApplications, BASE_URL, getChatHistory, sendChatMessage, getUnreadChatCounts, markChatAsRead, editChatMessage, deleteChatMessage, clearChatHistory, setTypingStatus, getTypingStatus, updateTradeLicenseStatus,
    updateLabourLicenseStatus, updateDrugLicenseStatus, updatePollutionControlStatus, updateGumasthaLicenseStatus,
    updateTrademarkRegistrationStatus, updateTrademarkObjectionStatus, updateTrademarkHearingStatus, updateTrademarkAssignmentStatus, updateTrademarkRenewalStatus,
    updateCopyrightRegistrationStatus, updatePatentFilingStatus, updateDesignRegistrationStatus,
    updatePFRegistrationStatus, updateESIRegistrationStatus, updateProfessionalTaxStatus, updateLabourWelfareFundStatus, updateGratuityActStatus, updateBonusActStatus, updateMinimumWagesStatus, updateFactoryLicenseStatus,
    updateMSMERegistrationStatus, updateISOCertificationStatus, updateStartupIndiaStatus, updateDigitalSignatureStatus, updateBarCodeStatus, updateTanPanStatus,
    updatePartnershipDeedStatus, updateFoundersAgreementStatus, updateShareholdersAgreementStatus, updateEmploymentAgreementStatus, updateRentAgreementStatus, updateFranchiseAgreementStatus, updateNDAStatus, updateVendorAgreementStatus,
    updateFinancialServiceStatus, deleteOrder, deleteAllChats
} from '../../../../api';
import axios from 'axios';
import FssaiWorkflowPanel from './FssaiWorkflowPanel';

import MsmeWorkflowPanel from './MsmeWorkflowPanel';
import PrivateLimitedWorkflowPanel from './PrivateLimitedWorkflowPanel';

// --- CHART COMPONENTS (Inlined for self-containment) ---
const AreaChart = ({ data, color = "#2563EB", height = 60 }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.map(d => d.value);
    }, [data]);

    if (!chartData.length) return null;
    const max = Math.max(...chartData) || 1;
    const min = 0;
    const points = chartData.map((val, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - ((val - min) / max) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full overflow-hidden" style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color})`} />
                <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
        </div>
    );
};

const DonutChart = ({ data, size = 60 }) => {
    const total = data.reduce((a, b) => a + b.value, 0) || 1;
    let accum = 0;
    const radius = size / 2 - 4;
    const circumference = 2 * Math.PI * radius;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {data.map((item, i) => {
                const percent = item.value / total;
                const dashArray = percent * circumference;
                const dashOffset = -(accum * circumference);
                accum += percent;
                return (
                    <circle key={i} r={radius} cx={size / 2} cy={size / 2} fill="transparent" stroke={item.color} strokeWidth="8" strokeDasharray={`${dashArray} ${circumference}`} strokeDashoffset={dashOffset} />
                );
            })}
        </svg>
    );
};

const OrdersManagement = ({ orders = [] }) => {
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [localOrders, setLocalOrders] = useState(orders);

    // Automation Logging State
    const [showLogs, setShowLogs] = useState(false);
    const [jobLogs, setJobLogs] = useState([]);
    const [polling, setPolling] = useState(false);

    // FSSAI State
    const [fssaiData, setFssaiData] = useState({ docs: [], genDocs: [] });
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingDocId, setRejectingDocId] = useState(null);

    // Chat State (Floating Widget)
    const [activeChatOrder, setActiveChatOrder] = useState(null);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatMessage, setChatMessage] = useState('');
    const [isMessageSending, setIsMessageSending] = useState(false);
    const [whoIsTyping, setWhoIsTyping] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const prevUnreadCounts = useRef({});
    const localOrdersRef = useRef(orders);
    const [unreadCounts, setUnreadCounts] = useState({});
    const chatEndRef = useRef(null); // Fix: Define chatEndRef

    useEffect(() => {
        localOrdersRef.current = localOrders;
    }, [localOrders]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        fetchUnreadCounts();
        const interval = setInterval(fetchUnreadCounts, 15000); // Poll unread counts every 15s
        return () => clearInterval(interval);
    }, []);

    const hasUnread = (order) => {
        if (!order) return false;
        const ids = [
            order.submissionId,
            order.id,
            order.realId,
            String(order.realId),
            String(order.id),
            (order.id || '').toString().replace('ORD-', '')
        ];
        return ids.some(id => id && unreadCounts[id] > 0);
    };

    const getUnreadCount = (order) => {
        if (!order) return 0;
        const ids = [
            order.submissionId,
            order.id,
            order.realId,
            String(order.realId),
            String(order.id),
            (order.id || '').toString().replace('ORD-', '')
        ];
        for (const id of ids) {
            if (id && unreadCounts[id] > 0) return unreadCounts[id];
        }
        return 0;
    };

    const fetchUnreadCounts = async () => {
        try {
            const counts = await getUnreadChatCounts();
            if (counts) {
                Object.keys(counts).forEach(chatId => {
                    const prev = prevUnreadCounts.current[chatId] || 0;
                    const curr = counts[chatId];
                    if (curr > prev) {
                        const order = localOrdersRef.current.find(o =>
                            o.submissionId === chatId || o.id === chatId || String(o.realId) === String(chatId) || String(o.id) === String(chatId)
                        );
                        if (order) {
                            if (Notification.permission === 'granted' && (!activeChatOrder || (activeChatOrder.id !== order.id))) {
                                new Notification(`New Message from ${order.client}`, { body: `Order #${order.id}` })
                                    .onclick = () => { window.focus(); openChat(order); };
                            }
                        }
                    }
                });
                prevUnreadCounts.current = counts;
                setUnreadCounts(counts);
            }
        } catch (e) { console.error(e); }
    };

    // --- PRICING HELPER ---
    const getOrderAmount = (order) => {
        if (order.amount) return order.amount;

        const plan = (order.plan || order.formData?.plan || 'basic').toLowerCase();
        const service = (order.service || '').toLowerCase();

        // 1. Private Limited Company
        if (service.includes('private limited') || service.includes('pvt ltd')) {
            if (plan === 'startup') return 6999;
            if (plan === 'growth') return 14999;
            if (plan === 'enterprise') return 24999;
            return 6999; // default
        }

        // 2. One Person Company (OPC)
        if (service.includes('one person') || service.includes('opc')) {
            if (plan === 'basic') return 4999;
            if (plan === 'standard') return 8999;
            if (plan === 'premium') return 12999;
            return 4999; // default
        }

        // 3. FSSAI (Mock prices based on typical plans if not provided)
        if (service.includes('fssai')) {
            if (plan.includes('1 year')) return 1499;
            if (plan.includes('3 year')) return 2999;
            if (plan.includes('5 year')) return 4999;
            return 1999;
        }

        return 4999; // Fallback for unknown services
    };

    // --- ANALYTICS CALCULATION ---
    const analytics = useMemo(() => {
        const total = localOrders.length;
        const pending = localOrders.filter(o => o.status === 'PENDING').length;
        const auto = localOrders.filter(o => o.status === 'AUTOMATION_STARTED').length;
        const completed = localOrders.filter(o => o.status === 'COMPLETED').length;

        // Calculate dynamic revenue
        const revenue = localOrders.reduce((acc, order) => acc + getOrderAmount(order), 0);

        // Status Dist
        const statusDist = [
            { label: 'Completed', value: completed, color: '#10B981' },
            { label: 'Pending', value: pending, color: '#F59E0B' },
            { label: 'Auto', value: auto, color: '#6366F1' },
            { label: 'Other', value: total - (pending + auto + completed), color: '#94A3B8' }
        ].filter(d => d.value > 0);

        // Revenue Trend (Mock 6 Days based on dynamic total)
        const trend = [0.4, 0.6, 0.5, 0.7, 0.8, 1].map(m => ({ value: m * revenue / 6 })); // Normalized shape

        return { total, pending, auto, completed, revenue, statusDist, trend };
    }, [localOrders]);

    // Sync local orders if props change
    useMemo(() => {
        setLocalOrders(orders);
    }, [orders]);

    const refreshOrderDetails = async () => {
        if (!selectedOrder) return;
        try {
            const allRaw = await getAllApplications();
            // Normalize data to match MasterDashboard structure
            const all = allRaw.map(app => ({
                ...app,
                id: `ORD-${app.id}`,
                realId: app.id,
                submissionId: app.submissionId,
                service: app.service || app.serviceName || 'N/A',
                client: app.client || app.user?.fullName || 'Guest',
                email: app.email || app.user?.email || 'N/A',
                mobile: app.mobile || app.user?.mobile || 'N/A',
                status: app.status,
                tasks: app.tasks,
                date: app.createdAt || new Date().toISOString()
            }));

            const updated = all.find(o =>
                String(o.realId) === String(selectedOrder.realId || selectedOrder.id.toString().replace('ORD-', '')) ||
                o.submissionId === selectedOrder.submissionId
            );

            if (updated) {
                setLocalOrders(all);
                setSelectedOrder(prev => ({ ...prev, ...updated }));
            }
        } catch (e) {
            console.error("Failed to refresh order", e);
        }
    };

    // Auto-refresh when opening modal
    useEffect(() => {
        if (selectedOrder) {
            refreshOrderDetails();
            // Also fetch logs if available
            if (selectedOrder.submissionId) {
                getAutomationLogs(selectedOrder.submissionId).then(logs => setJobLogs(logs || [])).catch(() => { });
            }

            // FSSAI Fetch
            if (selectedOrder.service?.toLowerCase().includes('fssai')) {
                const realId = selectedOrder.realId || selectedOrder.id.toString().replace('ORD-', '');
                // Simple parallel fetch
                Promise.all([
                    axios.get(`${BASE_URL}/fssai/${realId}/documents`),
                    axios.get(`${BASE_URL}/fssai/${realId}/generated-docs`)
                ]).then(([d, g]) => {
                    setFssaiData({ docs: d.data, genDocs: g.data });
                }).catch(err => console.error("FSSAI Fetch Error", err));
            }
        }
    }, [selectedOrder?.id]);

    // Poll logs when log panel is open
    useEffect(() => {
        let interval;
        if (showLogs && selectedOrder && selectedOrder.realId) {
            setPolling(true);
            const fetchLogs = async () => {
                try {
                    const logs = await getAutomationLogs(selectedOrder.realId);
                    setJobLogs(logs || []);
                } catch (e) { console.error("Log poll failed", e); }
            };
            fetchLogs(); // Initial
            interval = setInterval(fetchLogs, 3000);
        } else {
            setPolling(false);
        }
        return () => clearInterval(interval);
    }, [showLogs, selectedOrder]);

    const statusColors = {
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700',
        'COMPLETED': 'bg-green-100 text-green-700',
        'REJECTED': 'bg-red-100 text-red-700',
        'ASSIGNED': 'bg-purple-100 text-purple-700',
        'AUTOMATION_STARTED': 'bg-indigo-100 text-indigo-700',
        'DOCUMENTS_VERIFIED': 'bg-purple-100 text-purple-700'
    };

    const filteredOrders = localOrders.filter(order => {
        let matchesFilter = false;
        if (filter === 'ALL') matchesFilter = true;
        else if (filter === 'CHAT_PENDING') {
            const chatId = order.submissionId || order.id || order.realId;
            matchesFilter = (unreadCounts[chatId] > 0 || unreadCounts[order.id] > 0 || unreadCounts[order.realId] > 0);
        }
        else matchesFilter = order.status === filter;
        const matchesSearch =
            (order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.service?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.client?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        setStatusUpdating(true);
        try {
            const realId = selectedOrder.dbId || selectedOrder.realId || selectedOrder.id.toString().replace('ORD-', '');

            // Check if it's a Trade License
            if (selectedOrder.service?.toLowerCase().includes('trade license') || selectedOrder.id.toString().startsWith('TL-')) {
                await updateTradeLicenseStatus(selectedOrder.id, newStatus);
            } else if (selectedOrder.service?.toLowerCase().includes('factory license') || selectedOrder.id.toString().startsWith('FL-')) {
                await updateFactoryLicenseStatus(selectedOrder.id, newStatus);
            } else if (selectedOrder.id.toString().startsWith('LAB-')) {
                await updateLabourLicenseStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DRUG-')) {
                await updateDrugLicenseStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PCB-')) {
                await updatePollutionControlStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('GUM-')) {
                await updateGumasthaLicenseStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM-')) { // Trademark Reg
                await updateTrademarkRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_OBJ-')) {
                await updateTrademarkObjectionStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_HEAR-')) {
                await updateTrademarkHearingStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_ASN-')) {
                await updateTrademarkAssignmentStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TM_REN-')) {
                await updateTrademarkRenewalStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('CPY-')) {
                await updateCopyrightRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PAT-')) {
                await updatePatentFilingStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DES-')) {
                await updateDesignRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PF-')) {
                await updatePFRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('ESI-')) {
                await updateESIRegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PT-')) {
                await updateProfessionalTaxStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('LWF-')) {
                await updateLabourWelfareFundStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('GRA-')) {
                await updateGratuityActStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BONUS-')) {
                await updateBonusActStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('MW-')) {
                await updateMinimumWagesStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('MSME-')) {
                await updateMSMERegistrationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('ISO-')) {
                await updateISOCertificationStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('STARTUP-')) {
                await updateStartupIndiaStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DSC-')) {
                await updateDigitalSignatureStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BAR-')) {
                await updateBarCodeStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('TP-')) {
                await updateTanPanStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PARTNER-')) {
                await updatePartnershipDeedStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('FOUNDER-')) {
                await updateFoundersAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('SHARE-')) {
                await updateShareholdersAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('EMPLOY-')) {
                await updateEmploymentAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('RENT-')) {
                await updateRentAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('FRANCHISE-')) {
                await updateFranchiseAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('NDA-')) {
                await updateNDAStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('VENDOR-')) {
                await updateVendorAgreementStatus(realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('CMA-')) {
                await updateFinancialServiceStatus('cma-data-preparation', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('DPR-')) {
                await updateFinancialServiceStatus('project-report', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BL-')) {
                await updateFinancialServiceStatus('bank-loan-documentation', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('CF-')) {
                await updateFinancialServiceStatus('cash-flow-compliance', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('PD-')) {
                await updateFinancialServiceStatus('startup-pitch-deck', realId, newStatus);
            } else if (selectedOrder.id.toString().startsWith('BV-')) {
                await updateFinancialServiceStatus('business-valuation', realId, newStatus);
            } else {
                // Generic Service Request
                await updateApplicationStatus(realId, newStatus);
            }

            setLocalOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));

            alert('Status updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update status: ' + error.message);
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleStartAutomation = async () => {
        if (!selectedOrder) return;
        setStatusUpdating(true);
        try {
            const realId = selectedOrder.realId || selectedOrder.id.toString().replace('ORD-', '');
            await startAutomation(realId);

            // Optimistic update
            const newStatus = "AUTOMATION_STARTED";
            setLocalOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));

            setShowLogs(true); // Open log panel automatically
            alert("Automation Job Started! View logs for progress.");
        } catch (e) {
            alert("Failed to start automation: " + e.message);
        } finally {
            setStatusUpdating(false);
        }
    };



    // Poll Chat
    useEffect(() => {
        let interval;
        if (activeChatOrder) {
            const fetchChat = async () => {
                if (activeChatOrder && !isChatMinimized) {
                    const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
                    const msgs = await getChatHistory(chatId);
                    if (JSON.stringify(msgs) !== JSON.stringify(chatHistory)) {
                        setChatHistory(msgs || []);
                        // Assuming `shouldScroll` and `scrollToBottom` are defined elsewhere or will be added.
                        // For now, we'll just scroll if chat history changes.
                        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }

                    // Poll typing status
                    const typing = await getTypingStatus(chatId); // Assuming getTypingStatus is defined
                    const othersTyping = typing.filter(role => role !== 'ADMIN');
                    setWhoIsTyping(othersTyping);
                }
            };
            fetchChat();
            interval = setInterval(fetchChat, 3000);
        }
        return () => {
            clearInterval(interval);
            // Clear typing status when chat is closed or order changes
            if (activeChatOrder) {
                const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
                setTypingStatus(chatId, 'ADMIN', false); // Assuming setTypingStatus is defined
            }
        };
    }, [activeChatOrder, isChatMinimized, chatHistory, whoIsTyping]); // Added chatHistory to dependencies for comparison

    const handleAdminSendMessage = async () => {
        if (!chatMessage.trim() || !activeChatOrder) return;
        setIsMessageSending(true);
        try {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id;
            if (editingMessageId) {
                await editChatMessage(editingMessageId, chatMessage); // Assuming editChatMessage is defined
                setEditingMessageId(null);
            } else {
                await sendChatMessage({
                    message: chatMessage,
                    ticketId: chatId,
                    email: 'admin@shinefiling.com', // Admin logic
                    role: 'ADMIN'
                });
            }
            setChatMessage('');
            // Trigger immediate fetch
            const history = await getChatHistory(chatId);
            setChatHistory(history || []);
        } catch (e) {
            alert("Failed to send message: " + e.message);
        } finally {
            setIsMessageSending(false);
            // Clear typing status after sending message
            if (activeChatOrder) {
                const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
                setTypingStatus(chatId, 'ADMIN', false);
            }
        }
    };

    const openChat = async (order) => {
        setActiveChatOrder(order);
        setIsChatMinimized(false);
        setChatHistory([]);

        const chatId = order.submissionId || order.id || order.realId;
        // Mark as read immediately when opening
        if (unreadCounts[chatId] > 0) {
            setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
            await markChatAsRead(chatId, 'ADMIN');
            fetchUnreadCounts(); // Refresh to be sure
        }
    };

    const handleTyping = (e) => {
        setChatMessage(e.target.value);
        if (activeChatOrder) {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
            setTypingStatus(chatId, 'ADMIN', true); // Assuming setTypingStatus is defined

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                setTypingStatus(chatId, 'ADMIN', false);
            }, 5000); // Stop typing status after 5 seconds of inactivity
        }
    };

    const handleEditClick = (message) => {
        setEditingMessageId(message.id);
        setChatMessage(message.message);
    };

    const handleDeleteClick = async (messageId) => {
        if (!activeChatOrder || !window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteChatMessage(messageId); // Assuming deleteChatMessage is defined
            const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
            const history = await getChatHistory(chatId);
            setChatHistory(history || []);
        } catch (e) {
            alert("Failed to delete message: " + e.message);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("CRITICAL: Are you sure you want to permanently delete this order? All related data (chats, files) will be removed.")) return;

        try {
            await deleteOrder(orderId);
            setOrders(orders.filter(o => o.id !== orderId)); // Optimistic update
            alert("Order deleted successfully.");
            refreshOrderDetails(); // Refresh list just in case
        } catch (e) {
            alert("Failed to delete order: " + e.message);
        }
    };

    const handleClearChat = async () => {
        if (!activeChatOrder || !window.confirm("Are you sure you want to clear this chat? This action cannot be undone.")) return;
        try {
            const chatId = activeChatOrder.submissionId || activeChatOrder.id || activeChatOrder.realId;
            await clearChatHistory(chatId); // Assuming clearChatHistory is defined
            setChatHistory([]);
        } catch (e) {
            alert("Failed to clear chat: " + e.message);
        }
    };

    const handleDeleteAllChats = async () => {
        const pwd = prompt("CRITICAL: Enter Admin Password to DELETE ALL CHAT HISTORY globally:");
        if (pwd) {
            try {
                await deleteAllChats(pwd);
                alert("All chats deleted successfully.");
                setChatHistory([]); // Clear current view if any
                setUnreadCounts({}); // Reset counts
            } catch (e) {
                alert("Operation failed: " + e.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#10232A]">Global Order Management</h2>
                    <p className="text-[#3D4D55] text-sm">Track and manage client applications.</p>
                </div>
                <div>
                    <button onClick={handleDeleteAllChats} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition flex items-center gap-2 border border-red-100">
                        <Trash2 size={16} /> Delete All Chats
                    </button>
                </div>
            </div>

            {/* ANALYTICS DASHBOARD ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Revenue Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-[#3D4D55] uppercase tracking-wide">Total Revenue</p>
                        <h3 className="text-2xl font-extrabold text-[#10232A] mt-1">₹{analytics.revenue.toLocaleString()}</h3>
                    </div>
                    <div className="mt-4">
                        <AreaChart data={analytics.trend} color="#10B981" height={40} />
                    </div>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-[#3D4D55] uppercase">Total Orders</p>
                        <h3 className="text-2xl font-extrabold text-[#10232A]">{analytics.total}</h3>
                        <p className="text-[10px] text-green-500 font-bold mt-1">+12% vs last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50/50 flex items-center justify-center text-[#B58863]">
                        <FileText size={20} />
                    </div>
                </div>

                {/* 3. Status Distribution */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <DonutChart data={analytics.statusDist} size={60} />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Order Status</p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {analytics.statusDist.slice(0, 4).map((d, i) => (
                                <div key={i} className="flex items-center gap-1 text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                                    <span className="text-gray-600 font-medium truncate">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Action Card */}
                <div className="bg-gradient-to-br from-[#10232A] to-[#1e2430] p-4 rounded-xl shadow-sm text-white flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-white/60 uppercase">Pending Actions</p>
                    <h3 className="text-3xl font-extrabold mt-1 text-[#B58863]">{analytics.pending}</h3>
                    <button className="mt-3 px-3 py-1 bg-[#B58863] hover:bg-[#A57753] rounded-lg text-[10px] font-bold transition">Process Now</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full items-center">
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863] w-full text-sm"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4D55]" />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-gray-200 overflow-x-auto w-full md:w-auto items-center max-w-full no-scrollbar">
                    {['ALL', 'CHAT_PENDING', 'PENDING', 'AUTOMATION_STARTED', 'COMPLETED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-[#FDFBF7] text-[#B58863] border border-[#B58863]/20 shadow-sm' : 'text-[#3D4D55] hover:text-[#10232A]'}`}
                        >
                            {f === 'CHAT_PENDING' ? 'PENDING REPLY' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Order ID / Date</th>
                                <th className="px-6 py-4">Service Details</th>
                                <th className="px-6 py-4">Client Info</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Payment</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length > 0 ? filteredOrders.map((o, i) => (
                                <tr key={i} className="hover:bg-blue-50/50 transition duration-200 cursor-pointer group" onClick={() => setSelectedOrder(o)}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-[#B58863] text-xs">{o.id}</span>
                                            <span className="text-[10px] text-[#3D4D55] font-medium mt-0.5 flex items-center gap-1">
                                                <Activity size={10} /> {new Date(o.createdAt || o.date || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-[#FDFBF7] text-[#B58863] rounded-lg border border-[#B58863]/20">
                                                <FileText size={14} />
                                            </div>
                                            <div className="max-w-[180px]">
                                                <div className="font-bold text-slate-700 text-xs truncate" title={o.service}>{o.service}</div>
                                                <div className="text-[10px] text-gray-400 truncate">Standard Plan</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-2 ring-white">
                                                {(o.client || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{o.client || 'Unknown Client'}</span>
                                                <span className="text-[10px] text-gray-400">{o.email || 'N/A'}</span>
                                                <span className="text-[9px] text-gray-400">{o.mobile || ''}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-slate-700 text-xs">₹{(getOrderAmount(o)).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase">
                                            <CheckCircle size={10} /> Paid
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColors[o.status]
                                            ? statusColors[o.status].replace('bg-', 'bg-opacity-10 border-').replace('text-', 'text-')
                                            : 'bg-gray-50 text-gray-500 border-gray-100'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[o.status]?.includes('green') ? 'bg-green-500' : 'bg-current'}`}></span>
                                            {o.status?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteOrder(o.realId || o.id.replace('ORD-', '')); }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Order"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openChat(o); }}
                                                className={`p-2 rounded-lg transition-colors relative ${hasUnread(o) ? 'bg-red-50 text-red-600 animate-pulse' : 'text-indigo-500 hover:bg-indigo-50'}`}
                                                title="Chat with Client"
                                            >
                                                <MessageCircle size={16} />
                                                {hasUnread(o) && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[9px] text-white font-bold items-center justify-center border-2 border-white">
                                                            {getUnreadCount(o)}
                                                        </span>
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (o.service === 'FSSAI License' || o.service === 'FSSAI Registration') {
                                                        // Navigate to dedicated FSSAI Admin Page
                                                        // Ensure we use the correct ID (submissionId or id depending on what API expects)
                                                        navigate(`/admin/fssai/${o.submissionId || o.realId || o.id.replace('ORD-', '')}`);
                                                    } else {
                                                        setSelectedOrder(o);
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-[#10232A] text-white text-[10px] font-bold rounded-lg hover:bg-[#B58863] transition-colors shadow-sm flex items-center gap-1"
                                            >
                                                Details <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-50 rounded-full"><Search size={24} className="opacity-20" /></div>
                                            <p className="font-bold text-sm">No orders found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredOrders.length > 0 ? filteredOrders.map((o, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:scale-[0.99] transition-transform" onClick={() => setSelectedOrder(o)}>
                        <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                            <div>
                                <span className="font-mono font-bold text-blue-600 text-xs block">{o.id}</span>
                                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                                    <Activity size={10} /> {new Date(o.createdAt || o.date || Date.now()).toLocaleDateString()}
                                </span>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColors[o.status]
                                ? statusColors[o.status].replace('bg-', 'bg-opacity-10 border-').replace('text-', 'text-')
                                : 'bg-gray-50 text-gray-500 border-gray-100'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[o.status]?.includes('green') ? 'bg-green-500' : 'bg-current'}`}></span>
                                {o.status?.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                    <FileText size={16} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="font-bold text-slate-700 text-xs truncate">{o.service}</div>
                                    <div className="text-[10px] text-gray-400">Standard Plan</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
                                    {(o.client || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-slate-700 truncate">{o.client || 'Unknown Client'}</div>
                                    <div className="text-[10px] text-gray-400 truncate">{o.email || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                <span className="block text-[10px] text-gray-400 font-bold uppercase">Amount</span>
                                <span className="font-bold text-slate-700 text-sm">₹{(o.amount || 4999).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteOrder(o.realId || o.id); }}
                                    className="p-2 text-red-500 bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openChat(o); }}
                                    className="p-2 text-indigo-500 bg-indigo-50 rounded-lg"
                                >
                                    <MessageCircle size={18} />
                                </button>
                                <button
                                    className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                                >
                                    Details <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="flex flex-col items-center gap-2">
                            <Search size={20} className="opacity-20" />
                            <p className="font-bold text-xs">No orders found.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {createPortal(
                <AnimatePresence>
                    {selectedOrder && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#10232A]">Order #{selectedOrder.id}</h3>
                                        <p className="text-xs text-[#3D4D55] font-bold uppercase">{selectedOrder.service}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setShowLogs(!showLogs); }} className={`p-2 hover:bg-gray-200 rounded-full transition ${showLogs ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`} title="Toggle Logs"><Terminal size={18} /></button>
                                        <button onClick={refreshOrderDetails} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500" title="Refresh Data"><RefreshCcw size={18} /></button>
                                        <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} className="text-gray-500" /></button>
                                    </div>
                                </div>

                                <div className="flex h-full overflow-hidden">
                                    {/* LEFT PANEL: Info & Workflow */}
                                    <div className={`p-6 overflow-y-auto space-y-6 ${showLogs ? 'w-1/2 border-r border-gray-100 hidden md:block' : 'w-full'}`}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Client Details</p>
                                                <p className="font-bold text-[#2B3446]">{selectedOrder.client || 'Unknown Client'}</p>
                                                <div className="space-y-1 mt-2">
                                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                                        <Mail size={12} className="text-blue-500" />
                                                        {selectedOrder.email || 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                                        <Phone size={12} className="text-green-500" />
                                                        {selectedOrder.mobile || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Status</p>
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusColors[selectedOrder.status] || 'bg-gray-100'}`}>
                                                    {selectedOrder.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Application Workflow Section */}
                                        <div>
                                            <h4 className="font-bold text-[#2B3446] mb-4">Application Workflow</h4>
                                            {selectedOrder.service?.toLowerCase().includes('fssai') ? (
                                                <FssaiWorkflowPanel
                                                    orderId={selectedOrder.realId || selectedOrder.id}
                                                    submissionId={selectedOrder.submissionId}
                                                    docs={fssaiData.docs}
                                                    genDocs={fssaiData.genDocs}
                                                    onRefresh={refreshOrderDetails}
                                                />
                                            ) : (selectedOrder.service?.toLowerCase().includes('msme') || selectedOrder.service?.toLowerCase().includes('udyam')) ? (
                                                <MsmeWorkflowPanel
                                                    order={selectedOrder}
                                                    onUpdateStatus={handleUpdateStatus}
                                                    onClose={() => setSelectedOrder(null)}
                                                />
                                            ) : (selectedOrder.service?.includes('Private Limited') || selectedOrder.service?.includes('Registration') && !selectedOrder.service?.toLowerCase().includes('fssai') && !selectedOrder.service?.toLowerCase().includes('msme')) ? (
                                                <PrivateLimitedWorkflowPanel
                                                    order={selectedOrder}
                                                    onUpdateStatus={handleUpdateStatus}
                                                    onClose={() => setSelectedOrder(null)}
                                                />
                                            ) : selectedOrder.service?.toLowerCase().includes('trade license') ? (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Business Name</p>
                                                            <p className="font-bold text-slate-700 text-sm">{selectedOrder.businessName || 'N/A'}</p>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Trade Type</p>
                                                            <p className="font-bold text-slate-700 text-sm">{selectedOrder.businessType || selectedOrder.tradeType || 'N/A'}</p>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Applicant Name</p>
                                                            <p className="font-bold text-slate-700 text-sm">{selectedOrder.applicantName || 'N/A'}</p>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Municipality / Ward</p>
                                                            <p className="font-bold text-slate-700 text-sm">
                                                                {selectedOrder.municipality || 'N/A'} {selectedOrder.ward ? `(Ward ${selectedOrder.ward})` : ''}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                        <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5">
                                                            <Paperclip size={14} className="text-indigo-600" /> Uploaded Documents
                                                        </h4>
                                                        {selectedOrder.uploadedDocuments && Object.keys(selectedOrder.uploadedDocuments).length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {Object.entries(selectedOrder.uploadedDocuments).map(([docName, url]) => (
                                                                    <a
                                                                        key={docName}
                                                                        href={url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-100 rounded-lg transition-all group"
                                                                    >
                                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                                            <div className="p-1.5 bg-white rounded-md text-indigo-600 shadow-sm">
                                                                                <FileText size={14} />
                                                                            </div>
                                                                            <span className="text-xs font-bold text-slate-700 truncate capitalize">
                                                                                {docName.replace(/_/g, ' ')}
                                                                            </span>
                                                                        </div>
                                                                        <ExternalLink size={12} className="text-slate-400 group-hover:text-indigo-600" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                                                No documents uploaded yet.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : selectedOrder.service?.toLowerCase().includes('factory license') ? (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Business Name</p>
                                                            <p className="font-bold text-slate-700 text-sm">{selectedOrder.businessName || 'N/A'}</p>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Factory Address</p>
                                                            <p className="font-bold text-slate-700 text-sm">{selectedOrder.factoryAddress || 'N/A'}</p>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Factory Type</p>
                                                            <p className="font-bold text-slate-700 text-sm">{selectedOrder.factoryType === 'with_power' ? 'With Power' : 'Without Power'}</p>
                                                        </div>
                                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Workers</p>
                                                            <p className="font-bold text-slate-700 text-sm">{selectedOrder.workerCount || '0'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                        <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5">
                                                            <Paperclip size={14} className="text-indigo-600" /> Uploaded Documents
                                                        </h4>
                                                        {selectedOrder.uploadedDocuments && Object.keys(selectedOrder.uploadedDocuments).length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {Object.entries(selectedOrder.uploadedDocuments).map(([docName, url]) => (
                                                                    <a key={docName} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-100 rounded-lg transition-all group">
                                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                                            <div className="p-1.5 bg-white rounded-md text-indigo-600 shadow-sm"><FileText size={14} /></div>
                                                                            <span className="text-xs font-bold text-slate-700 truncate capitalize">{docName.replace(/_/g, ' ')}</span>
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-lg border border-dashed border-slate-200">No documents uploaded yet.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                                                    {(() => {
                                                        // Generic Workflow Configuration
                                                        let steps = [
                                                            { label: 'Payment Received', isCompleted: true },
                                                            { label: 'Processing', isCompleted: selectedOrder.status !== 'PENDING' },
                                                            { label: 'Completed', isCompleted: selectedOrder.status === 'COMPLETED' }
                                                        ];

                                                        return steps.map((step, idx) => (
                                                            <div key={idx} className="relative">
                                                                <div className={`absolute -left-8 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white text-[10px] transition-colors ${step.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                                    {step.isCompleted ? <CheckCircle size={12} /> : <div className="w-2 h-2 rounded-full bg-white" />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <p className={`font-bold text-sm ${step.isCompleted ? 'text-[#2B3446]' : 'text-gray-400'}`}>{step.label}</p>
                                                                </div>
                                                            </div>
                                                        ));
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Generic Uploaded Documents Display */}
                                        {selectedOrder.uploadedDocuments && Object.keys(selectedOrder.uploadedDocuments).length > 0 && !selectedOrder.service?.toLowerCase().includes('factory license') && !selectedOrder.service?.toLowerCase().includes('fssai') && (
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <h4 className="font-bold text-[#2B3446] mb-4 flex items-center gap-1.5">
                                                    <Paperclip size={14} className="text-indigo-600" /> Uploaded Documents
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {Object.entries(selectedOrder.uploadedDocuments).map(([docName, url]) => (
                                                        <a key={docName} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-100 rounded-lg transition-all group">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <div className="p-1.5 bg-white rounded-md text-indigo-600 shadow-sm"><FileText size={14} /></div>
                                                                <span className="text-xs font-bold text-slate-700 truncate capitalize">{docName.replace(/_/g, ' ')}</span>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedOrder.generatedDocuments && Object.keys(selectedOrder.generatedDocuments).length > 0 && !selectedOrder.service?.toLowerCase().includes('fssai') && (
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <h4 className="font-bold text-[#2B3446] mb-4">Generated Documents</h4>
                                                <div className="space-y-2">
                                                    {Object.entries(selectedOrder.generatedDocuments).map(([type, path], i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-100 rounded text-blue-600">
                                                                    <FileText size={16} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-sm text-gray-700">{type}</p>
                                                                    <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{path.split('/').pop()}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(`${BASE_URL}/admin/download-docs/${selectedOrder.submissionId}?type=${type}`, '_blank');
                                                                }}
                                                                className="text-white hover:bg-blue-700 bg-blue-600 font-bold text-xs flex items-center gap-1 px-3 py-1.5 rounded transition shadow-sm"
                                                            >
                                                                <Archive size={12} /> Download
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT PANEL: Logs (Visible only when automation active/requested) */}
                                    <AnimatePresence>
                                        {showLogs && (
                                            <motion.div
                                                initial={{ width: 0, opacity: 0 }} animate={{ width: "50%", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                                                className="bg-[#0f172a] text-white flex flex-col h-full"
                                            >
                                                <div className="p-4 bg-[#1e293b] border-b border-gray-700 flex justify-between items-center">
                                                    <div className="flex items-center gap-2 text-sm font-bold">
                                                        <Terminal size={16} className="text-green-400" />
                                                        <span>Live Worker Logs</span>
                                                    </div>
                                                    <button onClick={() => setShowLogs(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                                                </div>
                                                <div className="flex-1 p-4 font-mono text-xs space-y-2 overflow-y-auto custom-scrollbar">
                                                    {jobLogs.length > 0 ? jobLogs.map((log, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <span className="text-gray-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                                            <span className={`${log.level === 'INFO' ? 'text-blue-400' : log.level === 'ERROR' ? 'text-red-400' : 'text-gray-300'} font-bold`}>{log.level}</span>
                                                            <span className="text-gray-300 break-all">{log.message}</span>
                                                        </div>
                                                    )) : (
                                                        <div className="text-gray-500 italic">Waiting for logs...</div>
                                                    )}
                                                    {polling && <div className="text-green-500 animate-pulse">_</div>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* RIGHT PANEL: CHAT REMOVED FROM HERE */}
                                </div>

                                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 flex-wrap">


                                    {/* Private Limited specific buttons removed as they are now in the WorkflowPanel */}

                                    {selectedOrder.status !== 'COMPLETED' && (
                                        <button
                                            onClick={() => handleUpdateStatus('COMPLETED')}
                                            disabled={statusUpdating}
                                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                        >
                                            {statusUpdating ? <RefreshCcw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                            Mark Completed
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
            {/* FLOATING CHAT WIDGET */}
            {/* FLOATING CHAT WIDGET */}
            {activeChatOrder && (
                <div className={`fixed bottom-4 right-4 z-[200] w-[320px] shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-200 flex flex-col transition-all duration-300 ${isChatMinimized ? 'h-12' : 'h-[450px]'}`}>
                    {/* Chat Header */}
                    <div
                        className="p-3 bg-[#4A3B89] text-white flex justify-between items-center cursor-pointer shrink-0 z-10 relative"
                        onClick={() => setIsChatMinimized(!isChatMinimized)}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                                <User size={12} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xs">{activeChatOrder.client || 'Client'}</h3>
                                <p className="text-[9px] text-white/70 font-mono">#{activeChatOrder.id.toString().replace('ORD-', '')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setIsChatMinimized(!isChatMinimized); }} className="p-1 hover:bg-white/10 rounded"><Minimize2 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatOrder(null); }} className="p-1 hover:bg-white/10 rounded"><X size={14} /></button>
                        </div>
                    </div>

                    {!isChatMinimized && (
                        <div className="flex-1 flex flex-col min-h-0 bg-white relative font-sans">
                            {/* Chat Messages */}
                            <div className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
                                {chatHistory.length === 0 && (
                                    <div className="text-center text-gray-400 text-[10px] py-8 flex flex-col items-center gap-2">
                                        <MessageCircle size={20} className="opacity-20" />
                                        <span>Start conversation with client...</span>
                                    </div>
                                )}
                                {chatHistory.map((msg, i) => {
                                    const isAdmin = msg.sender === 'ADMIN' || msg.senderRole === 'ADMIN' || msg.senderRole === 'SUB_ADMIN';
                                    return (
                                        <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} group relative`}>
                                            {/* Messages Actions (Edit/Delete) - Only for own messages */}
                                            {isAdmin && (
                                                <div className="absolute top-0 right-0 -mr-7 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                    <button onClick={() => handleEditClick(msg)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Terminal size={10} /></button>
                                                    <button onClick={() => handleDeleteClick(msg.id)} className="p-1 hover:bg-red-50 rounded text-red-500"><X size={10} /></button>
                                                </div>
                                            )}

                                            <div className={`max-w-[85%] p-2 px-3 text-[10px] shadow-sm ${isAdmin
                                                ? 'bg-[#4A3B89] text-white rounded-xl rounded-tr-none'
                                                : 'bg-white text-gray-800 border-gray-100 rounded-xl rounded-tl-none'
                                                }`}>
                                                {!isAdmin && <p className="text-[8px] font-bold text-[#4A3B89] mb-0.5 opacity-80">{msg.senderName}</p>}
                                                <p className="leading-relaxed">{msg.message} {msg.edited && <span className="text-[8px] opacity-50 italic">(edited)</span>}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                                                    <span className={`text-[8px] font-bold ${isAdmin ? 'text-white/60' : 'text-gray-300'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isAdmin && (
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
                                            <span className="animate-pulse">Typing...</span>
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
                                    placeholder={editingMessageId ? "Edit message..." : "Reply to client..."}
                                    value={chatMessage}
                                    onChange={handleTyping}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAdminSendMessage();
                                        }
                                    }}
                                />                   <button
                                    onClick={handleAdminSendMessage}
                                    disabled={!chatMessage.trim() || isMessageSending}
                                    className={`p-1.5 rounded-lg transition-colors ${chatMessage.trim() ? 'bg-[#4A3B89] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    {isMessageSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
