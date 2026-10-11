import React from 'react';
import { Logo } from './Logo.tsx';
import { ChevronLeft, User, GraduationCap, Sprout, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Zap, Lock } from 'lucide-react';
import type { UserRole, User as UserType } from '../types.ts';

interface RoleSelectionScreenProps {
  onSelectRole: (role: 'student' | 'teacher' | 'farmer') => void;
  onBack: () => void;
  onBackToSplash?: () => void;
  onReturnToApp?: () => void;
  hasExistingSession?: boolean;
  hasEverLoggedIn?: boolean;
  lastUser?: UserType;
  onDirectEnter?: (role?: 'student' | 'teacher' | 'farmer') => void;
  onLockedDirectEnterClick?: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ 
  onSelectRole, 
  onBack, 
  onBackToSplash,
  onReturnToApp,
  hasExistingSession = false,
  hasEverLoggedIn = false,
  lastUser,
  onDirectEnter,
  onLockedDirectEnterClick
}) => {
  const roles = [
    { 
      role: 'student' as const, 
      badge: 'As a Student',
      title: 'Student (NEET • JEE • Boards)',
      tag: 'Academic Track',
      description: 'NCERT smart notes, AI study assistant, live classrooms, 720 marks mock tests, and mentor guidance.',
      icon: <GraduationCap size={32} />,
      accentGlow: 'hover:border-blue-500/70 hover:shadow-[0_0_35px_rgba(59,130,246,0.35)]',
      gradient: 'from-blue-950/70 via-slate-900/90 to-slate-950',
      iconBox: 'bg-blue-600/20 text-blue-400 border-blue-500/40',
      tagColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      buttonBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
      features: ['AI Study Assistant', 'Full NEET/JEE Mock Tests', 'NCERT Chapter Notes']
    },
    { 
      role: 'teacher' as const, 
      badge: 'As a Teacher',
      title: 'Faculty & Mentor',
      tag: 'Educator Track',
      description: 'Host live classrooms, share syllabus and notes, guide aspirants, and collaborate with star faculty.',
      icon: <User size={32} />,
      accentGlow: 'hover:border-purple-500/70 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]',
      gradient: 'from-purple-950/70 via-slate-900/90 to-slate-950',
      iconBox: 'bg-purple-600/20 text-purple-400 border-purple-500/40',
      tagColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      buttonBg: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500',
      features: ['Broadcast Live Classes', 'Whiteboard & Tools', 'Student Guidance']
    },
    { 
      role: 'farmer' as const, 
      badge: 'As a Farmer',
      title: 'Agro Innovator & Farming',
      tag: 'Agriculture Track',
      description: 'AI crop disease doctor, smart hydroponics, soil moisture tests, mandi rates, and expert consultation.',
      icon: <Sprout size={32} />,
      accentGlow: 'hover:border-emerald-500/70 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)]',
      gradient: 'from-emerald-950/70 via-slate-900/90 to-slate-950',
      iconBox: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40',
      tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      buttonBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
      features: ['Plant Leaf Scanner', 'Mandi Live Rates', 'Modern Hydroponics']
    },
  ];

  return (
    <div className="w-full min-h-screen min-h-[100dvh] py-6 sm:py-10 px-4 md:px-8 relative flex flex-col items-center justify-start gap-8 bg-[#050713] text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden overflow-y-auto custom-scrollbar pb-16">
        
        {/* Dynamic Cosmic Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-blue-600/10 to-transparent blur-[140px] rounded-full"></div>
          <div className="absolute -bottom-32 right-1/4 w-[500px] h-[350px] bg-emerald-600/15 blur-[130px] rounded-full"></div>
        </div>

        {/* TOP NAV BAR */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-2 relative z-20 gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBackToSplash || onBack} 
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl text-slate-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl group cursor-pointer hover:border-white/25 active:scale-95"
              title="Return to Welcome Screen"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-amber-400" />
              <span>Back</span>
            </button>

            {hasExistingSession && onReturnToApp && (
              <button 
                onClick={onReturnToApp}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-wider shadow-lg cursor-pointer active:scale-95"
              >
                <span>Resume Active Session</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Logo size="sm" isAnimated />
            <span className="text-xs font-black text-white uppercase tracking-wider font-montserrat hidden sm:inline">
              Future Legacy
            </span>
          </div>
        </div>

        {/* MAIN SELECTION CONTAINER */}
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 my-2">
          
          {/* Header Title */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/90 border border-indigo-500/30 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-[0.25em] shadow-md">
              <Sparkles size={13} className="text-amber-300" />
              <span>Choose Your Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-montserrat tracking-tight uppercase leading-tight">
              Select Your Profile & Enter
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Click on your role below to immediately unlock personalized tools, live classrooms, and AI engines.
            </p>

            {/* Instant Enter Status Pill */}
            {hasEverLoggedIn ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/40 rounded-full text-emerald-300 text-xs font-bold shadow-md animate-in fade-in">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>✓ Previous Login Verified {lastUser?.name ? `(${lastUser.name})` : ''} • Instant 1-Click Enter is Active</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-medium shadow-md">
                <Lock size={13} className="text-amber-400" />
                <span>Instant 1-Click Enter pehle 1 baar Login karne ke baad hi unlock hoga</span>
              </div>
            )}
          </div>

          {/* 3 Interactive Role Cards (Student, Teacher, Farmer) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full pt-2">
            {roles.map((item) => (
              <div
                key={item.role}
                onClick={() => onSelectRole(item.role)}
                className={`group relative bg-gradient-to-b ${item.gradient} bg-[#0c1024]/90 backdrop-blur-2xl border border-white/10 ${item.accentGlow} p-6 sm:p-7 rounded-[2rem] text-left transition-all duration-300 hover:-translate-y-2 shadow-2xl flex flex-col justify-between cursor-pointer active:scale-[0.98]`}
              >
                {/* Top Role Badge */}
                <div>
                  <div className="w-full flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${item.iconBox} group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${item.tagColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  
                  {/* Card Title & Desc */}
                  <div className="space-y-2">
                    <h2 className="font-black text-xl text-white uppercase tracking-tight font-montserrat group-hover:text-blue-200 transition-colors">
                      {item.badge}
                    </h2>
                    <p className="text-xs font-bold text-amber-300 tracking-wide">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-300 font-normal leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                    {item.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 w-full space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRole(item.role);
                    }}
                    className={`w-full py-3.5 px-4 ${item.buttonBg} text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer active:scale-95`}
                  >
                    <span>
                      {item.role === 'student' ? 'Login as Student' : item.role === 'teacher' ? 'Login as Teacher' : 'Login as Farmer'}
                    </span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Instant 1-Click Enter: UNLOCKED only if user has logged in at least once before */}
                  {hasEverLoggedIn && onDirectEnter ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDirectEnter(item.role);
                      }}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500/15 via-blue-500/15 to-emerald-500/15 hover:from-amber-500/25 hover:to-emerald-500/25 text-amber-300 hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-xl border border-amber-400/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
                    >
                      <Zap size={13} className="text-amber-400 fill-amber-400" />
                      <span>⚡ Instant 1-Click Enter (Unlocked)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onLockedDirectEnterClick) {
                          onLockedDirectEnterClick();
                        } else {
                          onSelectRole(item.role);
                        }
                      }}
                      className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-300 font-bold text-[10px] uppercase tracking-wider rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer group active:scale-95"
                      title="Pehle ek baar login karna zaroori hai"
                    >
                      <Lock size={12} className="text-amber-400/80 group-hover:text-amber-300" />
                      <span>1-Click Enter (🔒 Pehle Login Karein)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* BOTTOM BADGE */}
        <div className="w-full max-w-5xl pt-6 border-t border-white/10 flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            Verified Educational Protocol • Secure Mobile OTP Auth
          </span>
          <span className="text-slate-500">Future Legacy System 2026</span>
        </div>

    </div>
  );
};

export default RoleSelectionScreen;
