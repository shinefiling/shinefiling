import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle, Trash2, MailOpen } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api';

const ClientNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserEmail(user.email);
            fetchNotifications(user.email);
        }
    }, []);

    const fetchNotifications = async (email) => {
        try {
            setLoading(true);
            const data = await getNotifications(email);
            if (Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead(userEmail);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const unreadCount = notifications.filter(n => !(n.isRead || n.read)).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <Bell className="text-slate-400" size={20} /> Notifications
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">Stay updated with your application status and alerts.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors font-bold text-xs shadow-sm"
                    >
                        <CheckCircle size={14} /> Mark all read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-xs font-bold">Loading notifications...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 transition-colors group flex items-start gap-4 ${(notification.isRead || notification.read) ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/60'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                    notification.type === 'WARNING' ? 'bg-amber-100 text-amber-600' :
                                        notification.type === 'ERROR' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    {(notification.isRead || notification.read) ? <MailOpen size={14} /> : <Bell size={14} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold text-sm ${(notification.isRead || notification.read) ? 'text-slate-700' : 'text-slate-900'}`}>{notification.title}</h4>
                                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2 font-medium">
                                            {new Date(notification.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                    <p className={`text-xs mt-1 leading-relaxed ${(notification.isRead || notification.read) ? 'text-slate-500' : 'text-slate-700'}`}>
                                        {notification.message}
                                    </p>
                                    {!(notification.isRead || notification.read) && (
                                        <button
                                            onClick={() => handleMarkRead(notification.id)}
                                            className="text-[10px] font-bold text-indigo-600 mt-2 hover:underline flex items-center gap-1"
                                        >
                                            <Check size={12} /> Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 text-slate-400">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-slate-300">
                            <Bell size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-600 mb-1">No Notifications</h3>
                        <p className="max-w-xs text-center text-xs">You're all caught up! New updates will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientNotifications;
