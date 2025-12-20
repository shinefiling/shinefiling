import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, ChevronDown, ChevronUp, Send, FileQuestion, X, User } from 'lucide-react';
import { submitSupportTicket } from '../../api';
import { getBotResponse } from '../../utils/chatbotLogic';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    { q: "How long does GST registration take?", a: "Typically 3-5 working days after document submission, subject to government processing times." },
    { q: "Is Digital Signature (DSC) included?", a: "Yes, for Company Registration packages, 2 Class-3 DSCs are included securely." },
    { q: "Can I cancel my order?", a: "Cancellation is possible before the application is filed with the government. A cancellation fee may apply." },
    { q: "What documents are required for Trademark?", a: "ID proof, address proof, and a logo image (if applicable). Our team will guide you." }
];

const ClientSupport = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [ticket, setTicket] = useState({ subject: '', type: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    // Chat State
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hello! Need help with your application?", sender: 'system' }
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            await submitSupportTicket(ticket);
            setStatus('success');
            setTicket({ subject: '', type: '', description: '' });
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const msg = { id: Date.now(), text: newMessage, sender: 'user' };
        setChatMessages([...chatMessages, msg]);
        const userMsg = newMessage;
        setNewMessage("");

        setTimeout(() => {
            const botReplyText = getBotResponse(userMsg, 'CLIENT');
            const reply = { id: Date.now() + 1, text: botReplyText, sender: 'system' };
            setChatMessages(prev => [...prev, reply]);
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* Quick Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => setShowChat(true)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-600 hover:shadow-md transition cursor-pointer relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h4 className="font-bold text-slate-800 text-base mb-0.5">Live Chat</h4>
                        <p className="text-xs text-slate-500">Wait time: ~2 mins</p>
                    </div>
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition relative z-10">
                        <MessageSquare size={20} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-600 hover:shadow-md transition cursor-pointer relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h4 className="font-bold text-slate-800 text-base mb-0.5">Call Support</h4>
                        <p className="text-xs text-slate-500">Mon-Sat, 9AM - 7PM</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition relative z-10">
                        <Phone size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ticket Form */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500"><FileQuestion size={18} /></div>
                        <div>
                            <h3 className="font-bold text-base text-slate-800">Raise a Ticket</h3>
                            <p className="text-slate-500 text-xs">We usually respond within 4 hours.</p>
                        </div>
                    </div>

                    {status === 'success' && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl font-bold text-xs">
                            Ticket submitted successfully! We'll get back to you soon.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl font-bold text-xs">
                            Failed to submit ticket. Please try again.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                                <input
                                    required
                                    value={ticket.subject}
                                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition font-medium text-slate-700 text-sm"
                                    placeholder="e.g., Delay in GST Application"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issue Type</label>
                                <select
                                    required
                                    value={ticket.type}
                                    onChange={(e) => setTicket({ ...ticket, type: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition font-medium text-slate-700 text-sm appearance-none cursor-pointer"
                                >
                                    <option value="">Select Issue Type</option>
                                    <option value="Order Delay">Order Delay</option>
                                    <option value="Payment Issue">Payment Issue</option>
                                    <option value="Document Query">Document Query</option>
                                    <option value="Technical Issue">Technical Issue</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                            <textarea
                                required
                                value={ticket.description}
                                onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-32 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition font-medium text-slate-700 resize-none text-sm"
                                placeholder="Please describe your issue in detail..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button disabled={loading} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 text-sm">
                                <Send size={16} /> {loading ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                    <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                        <HelpCircle size={18} className="text-indigo-600" /> Common Questions
                    </h3>
                    <div className="space-y-2">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`bg-white border rounded-xl overflow-hidden transition-all ${activeFaq === i ? 'border-indigo-600 shadow-md' : 'border-slate-200 shadow-sm'}`}>
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex justify-between items-center p-3 text-left font-bold text-slate-700 hover:bg-slate-50 text-xs"
                                >
                                    {faq.q}
                                    {activeFaq === i ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-slate-400" />}
                                </button>
                                {activeFaq === i && (
                                    <div className="p-3 pt-0 text-xs text-slate-500 bg-slate-50/30 leading-relaxed border-t border-slate-100">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client Chat Modal */}
            <AnimatePresence>
                {showChat && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden h-[450px]">
                        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
                            <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18} /> Support Assistant</h3>
                            <button onClick={() => setShowChat(false)}><X size={18} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-xl text-xs max-w-[80%] shadow-sm ${msg.sender === 'user' ? 'bg-[#B58863] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-slate-600 rounded-tl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t bg-white flex gap-2 shrink-0">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about status, pricing..."
                                className="flex-1 text-sm p-2 outline-none"
                            />
                            <button onClick={handleSendMessage} className="p-2 bg-[#B58863] text-white rounded-lg hover:bg-[#a07654]"><Send size={16} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientSupport;
