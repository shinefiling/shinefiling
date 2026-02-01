import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBotResponse } from '../utils/chatbotLogic';

const QUICK_CHIPS = ['Services', 'Pricing', 'Status', 'Contact', 'Login Help', 'GST', 'Trademark'];

const ChatWidget = ({ role = 'CLIENT', userName = 'Guest' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Hello ${userName}! How can I help you today?`, sender: 'system' }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (text = input) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Simulate Bot Typing
        setTimeout(() => {
            const botResponse = getBotResponse(text, role);
            const botMsg = { id: Date.now() + 1, text: botResponse, sender: 'system' };
            setMessages(prev => [...prev, botMsg]);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white w-[350px] max-w-[calc(100vw-40px)] h-[500px] max-h-[80vh] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#043E52] p-4 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Shine Assistant</h3>
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] text-gray-300">Online Now</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={18} className="text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 bg-gray-50/50 p-4 overflow-y-auto custom-scrollbar space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                        max-w-[80%] p-3 text-sm shadow-sm whitespace-pre-wrap
                                        ${msg.sender === 'user'
                                            ? 'bg-[#043E52] text-white rounded-2xl rounded-tr-sm'
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'
                                        }
                                    `}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions (Chips) */}
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                            {QUICK_CHIPS.map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => handleSendMessage(chip)}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-[#043E52] hover:text-white hover:border-[#043E52] transition-colors whitespace-nowrap shrink-0 shadow-sm"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-100 text-sm p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#043E52]/10 transition"
                            />
                            <button
                                onClick={() => handleSendMessage(input)}
                                disabled={!input.trim()}
                                className="p-3 bg-[#043E52] text-white rounded-xl hover:bg-[#1a3642] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                    w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300
                    ${isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-[#043E52] text-white hover:bg-[#1a3642] border-2 border-white/20'}
                `}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
