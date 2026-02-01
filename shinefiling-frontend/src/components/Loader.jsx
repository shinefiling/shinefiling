import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true }) => {
    return (
        <div className={fullScreen ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px] z-[9999]" : "relative p-20 flex items-center justify-center"}>
            <div className="relative w-28 h-28 flex items-center justify-center">

                {/* ROTATING OUTER RING */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                        <defs>
                            <linearGradient id="tealGradLoader" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0B4F57" />
                                <stop offset="100%" stopColor="#258E94" />
                            </linearGradient>
                            <linearGradient id="orangeGradLoader" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#D96C3A" />
                                <stop offset="100%" stopColor="#F59E75" />
                            </linearGradient>
                        </defs>


                        {/* Actual Visible Paths */}

                        {/* Teal Arc (Top) */}
                        <path
                            d="M 15 50 A 35 35 0 0 1 85 50"
                            fill="none"
                            stroke="url(#tealGradLoader)"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                        {/* Teal Head */}
                        <path d="M 85 50 L 85 38 L 98 50 L 85 62 Z" fill="#258E94" transform="rotate(-5, 85, 50) translate(0,0) scale(0.6)" />


                        {/* Orange Arc (Bottom) */}
                        <path
                            d="M 85 50 A 35 35 0 0 1 15 50"
                            fill="none"
                            stroke="url(#orangeGradLoader)"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                        {/* Orange Head */}
                        <path d="M 15 50 L 15 62 L 2 50 L 15 38 Z" fill="#F59E75" transform="rotate(-5, 15, 50) scale(0.6)" />

                    </svg>
                </motion.div>

                {/* CENTRAL STATIC LOGO */}
                <div className="relative z-10 w-[55%] h-[55%] rounded-full shadow-inner flex items-center justify-center bg-gradient-to-br from-[#D96C3A] to-[#C25626]">
                    <span className="text-white text-4xl font-black font-sans pt-1 pr-0.5 select-none filter drop-shadow-sm">S</span>
                </div>

            </div>
        </div>
    );
};

export default Loader;
