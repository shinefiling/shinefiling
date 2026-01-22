import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = "Loading...", fullScreen = true, size = "md" }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1221]/95 backdrop-blur-md"
        : "flex items-center justify-center p-8";

    // Dynamic sizing similar to original prop
    const baseSize = size === 'sm' ? 40 : size === 'lg' ? 80 : 60;

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-bronze/10 blur-[60px] rounded-full transform scale-150 animate-pulse"></div>

                    {/* Outer Ring (Static/Subtle Pulse) */}
                    <motion.div
                        style={{ width: baseSize * 2.8, height: baseSize * 2.8 }}
                        className="rounded-full border border-white/5 absolute"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Primary Spinning Arc (Gold) */}
                    <motion.div
                        style={{ width: baseSize * 2.2, height: baseSize * 2.2 }}
                        className="rounded-full border-[3px] border-transparent border-t-bronze border-r-bronze absolute"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Secondary Counter-Spinning Arc (White/Silver) */}
                    <motion.div
                        style={{ width: baseSize * 1.6, height: baseSize * 1.6 }}
                        className="rounded-full border-[2px] border-transparent border-b-slate-400/30 border-l-slate-400/30 absolute"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Central Static Logo Container */}
                    <motion.div
                        className="relative z-10 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-bronze/20"
                        style={{ width: baseSize, height: baseSize }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* We assume there is a logo.png. If not, fallback to text S */}
                        <img
                            src="/logo.png"
                            alt="SF"
                            className="w-1/2 h-1/2 object-contain"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <span className="hidden text-navy font-black text-xl">S</span>
                    </motion.div>
                </div>

                {text && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 flex flex-col items-center gap-3"
                    >
                        <h3 className="text-sm font-bold text-white tracking-[0.3em] uppercase">{text}</h3>
                        {/* Elegant Line Progress */}
                        <div className="h-[2px] w-24 bg-white/10 rounded-full overflow-hidden relative">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-bronze to-transparent w-1/2"
                                animate={{ left: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Loader;
