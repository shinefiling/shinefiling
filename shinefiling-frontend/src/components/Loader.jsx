import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = "Loading...", fullScreen = true, size = "md" }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-[9999] flex items-center justify-center bg-navy/95 backdrop-blur-sm"
        : "flex items-center justify-center p-8";

    const sizeScales = {
        sm: 0.5,
        md: 1,
        lg: 1.5
    };

    const scale = sizeScales[size] || 1;

    // 3D faces for the cube
    const faces = [
        { rotateY: 0, translateZ: 32, color: 'bg-bronze' },     // Front
        { rotateY: 180, translateZ: 32, color: 'bg-bronze/80' }, // Back
        { rotateY: 90, translateZ: 32, color: 'bg-bronze/90' },  // Right
        { rotateY: -90, translateZ: 32, color: 'bg-bronze/90' }, // Left
        { rotateX: 90, translateZ: 32, color: 'bg-bronze/70' },  // Top
        { rotateX: -90, translateZ: 32, color: 'bg-bronze/70' }, // Bottom
    ];

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-12">
                <div className="relative" style={{ perspective: '1000px', transform: `scale(${scale})` }}>
                    {/* Orbital Rings */}
                    <motion.div
                        className="absolute inset-0 -m-16 rounded-full border border-white/10"
                        style={{ width: '12rem', height: '12rem' }}
                        animate={{
                            rotateX: [0, 360],
                            rotateY: [0, 360],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-0 -m-12 rounded-full border border-bronze/20"
                        style={{ width: '10rem', height: '10rem', left: '1rem', top: '1rem' }}
                        animate={{
                            rotateX: [360, 0],
                            rotateZ: [0, 360],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />

                    {/* 3D Cube */}
                    <motion.div
                        className="relative w-16 h-16"
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{
                            rotateX: [0, 360],
                            rotateY: [0, 360]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {faces.map((face, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 w-full h-full ${face.color} border border-white/20 shadow-lg`}
                                style={{
                                    transform: `rotateX(${face.rotateX || 0}deg) rotateY(${face.rotateY || 0}deg) translateZ(${face.translateZ}px)`,
                                    backfaceVisibility: 'visible',
                                    opacity: 0.9,
                                }}
                            >
                                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-[1px] bg-white/30 rotate-45 transform origin-center" />
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* 3D Shadow/Glow */}
                    <motion.div
                        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-20 h-4 bg-bronze/40 blur-xl rounded-full"
                        animate={{
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                {/* Loading Text */}
                {text && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <h3 className="text-xl font-bold text-white tracking-[0.2em] uppercase">{text}</h3>
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-bronze"
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Loader;
