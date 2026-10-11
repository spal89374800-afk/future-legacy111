
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg'; isAnimated?: boolean }> = ({ size = 'md', isAnimated = false }) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-14 w-14',
    };

    return (
        <svg
            className={`${sizeClasses[size]} ${isAnimated ? 'animate-pulse' : ''} drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]`}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="goldLuxuryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="50%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
                <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
                </linearGradient>
            </defs>

            {/* Hexagonal Sovereign Shield Frame */}
            <polygon 
                points="50,6 90,26 90,74 50,94 10,74 10,26" 
                fill="#0F172A" 
                fillOpacity="0.9"
                stroke="url(#shieldBorder)" 
                strokeWidth="2.5" 
                strokeLinejoin="round"
            />

            {/* Inner Futuristic Diamond Matrix */}
            <polygon 
                points="50,15 82,31 82,69 50,85 18,69 18,31" 
                fill="none"
                stroke="url(#goldLuxuryGrad)" 
                strokeWidth="1.2" 
                strokeDasharray="2 3"
                opacity="0.6"
            />

            {/* The 'F' & 'L' Interlocked Sovereign Crest */}
            {/* Future Crest (F / Ascending Knowledge Wings) */}
            <path 
                d="M32 30 H68 C72 30 75 33 75 37 C75 41 72 44 68 44 H44 V52 H62 C65 52 67 54 67 57 C67 60 65 62 62 62 H44 V72" 
                stroke="url(#goldLuxuryGrad)" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />

            {/* Glowing Core Neural Spark (Knowledge Beacon) */}
            <circle cx="50" cy="50" r="5" fill="url(#coreGlow)" />
            <circle cx="50" cy="50" r="9" stroke="#60A5FA" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />

            {/* Top North Star (Excellence Anchor) */}
            <polygon points="50,16 52,21 57,21 53,24 55,29 50,26 45,29 47,24 43,21 48,21" fill="#F8FAFC" />

            {/* Corner Precision Nodes */}
            <circle cx="50" cy="94" r="2.5" fill="#818CF8" />
            <circle cx="90" cy="26" r="2.5" fill="#60A5FA" />
            <circle cx="10" cy="26" r="2.5" fill="#60A5FA" />
        </svg>
    );
};

export default Logo;

