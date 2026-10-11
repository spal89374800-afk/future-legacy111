import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { Page, User, AppNotification, UserRole } from '../types.ts';
import { 
  Menu, X, ShieldCheck, ArrowLeft, Home, BookOpen, CheckSquare, 
  MessageSquare, Calendar, Library, Sprout, Cpu, Settings, Award, 
  Users, HelpCircle, FlaskConical, Video, Trophy, Radio, Bot, GraduationCap, FileText,
  Maximize2, Minimize2
} from 'lucide-react';
import NotificationBell from './NotificationBell.tsx';

interface LayoutProps {
  currentPage: Page;
  userRole: UserRole;
  currentUser?: User;
  navigationHistory: Page[];
  notifications: AppNotification[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  onNavigate: (p: Page) => void;
  onBack: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (s: string) => void;
  onOpenBroadcast?: () => void;
  onSwitchRole?: () => void;
  onOpenLogin?: () => void;
  children: React.ReactNode;
}

interface NavItem {
  name: Page;
  icon: React.ReactNode;
  displayLabel: string;
  badge?: string;
}

export const getRoleNavigation = (role: UserRole): NavItem[] => {
  if (role === 'farmer') {
    return [
      { name: 'Home', icon: <Home size={18} />, displayLabel: 'Kisan Krishi Hub', badge: 'Active' },
      { name: 'Agro Future', icon: <Sprout size={18} />, displayLabel: 'Agro Future & AI Doctor', badge: 'AI' },
      { name: 'Chat', icon: <MessageSquare size={18} />, displayLabel: 'Kisan Community Chat' },
      { name: 'Settings', icon: <Settings size={18} />, displayLabel: 'Settings & Language' },
      { name: 'Emergency Help', icon: <HelpCircle size={18} />, displayLabel: 'Kisan 24x7 Helpline', badge: '1800-180-1551' },
    ];
  }

  if (role === 'teacher') {
    return [
      { name: 'Home', icon: <Home size={18} />, displayLabel: 'Faculty Action Center', badge: 'Faculty' },
      { name: 'Batch Manager', icon: <Users size={18} />, displayLabel: 'Batch & Access Manager', badge: 'Teacher' },
      { name: 'Advanced AI Studio', icon: <Bot size={18} />, displayLabel: 'Advanced AI Studio', badge: 'AI' },
      { name: 'Complete Courses', icon: <GraduationCap size={18} />, displayLabel: 'Complete Courses', badge: 'New' },
      { name: 'Study Material', icon: <FileText size={18} />, displayLabel: 'Study Material & Vault', badge: 'Notes' },
      { name: 'All Live Classes', icon: <Video size={18} />, displayLabel: 'Live Broadcasts & Calls', badge: 'Host' },
      { name: 'All India Mock Test', icon: <Trophy size={18} />, displayLabel: 'All India Mock Test', badge: 'Exams' },
      { name: 'Class Schedule', icon: <Calendar size={18} />, displayLabel: 'Schedule & Timetable' },
      { name: 'My Tasks', icon: <CheckSquare size={18} />, displayLabel: 'Assignments & Grading' },
      { name: 'E-Library', icon: <Library size={18} />, displayLabel: 'E-Library & Uploads' },
      { name: 'Education & Guidance', icon: <BookOpen size={18} />, displayLabel: 'Mentorship & Guidance' },
      { name: 'AI Personalised Study Assistant', icon: <Cpu size={18} />, displayLabel: 'AI Pedagogical Engine' },
      { name: 'Skill Classes', icon: <Award size={18} />, displayLabel: 'Skill Masterclasses' },
      { name: 'Discussion Forum', icon: <Users size={18} />, displayLabel: 'Student Doubts Forum' },
      { name: 'Science and Concept Visualizer', icon: <FlaskConical size={18} />, displayLabel: 'STEM Concept Lab' },
      { name: 'Learn with Podcast', icon: <Radio size={18} />, displayLabel: 'Audio Masterclasses' },
      { name: 'Media Library', icon: <Video size={18} />, displayLabel: 'Lecture Archives' },
      { name: 'Chat', icon: <MessageSquare size={18} />, displayLabel: 'Faculty Messages' },
      { name: 'Settings', icon: <Settings size={18} />, displayLabel: 'Profile & Settings' },
      { name: 'Emergency Help', icon: <HelpCircle size={18} />, displayLabel: 'Emergency Support' },
    ];
  }

  // Student Role (Has all icons to view what teachers post, without faculty modification rights)
  return [
    { name: 'Home', icon: <Home size={18} />, displayLabel: 'Home Dashboard' },
    { name: 'Batch Manager', icon: <Users size={18} />, displayLabel: 'Batches & Enrollments', badge: 'Batches' },
    { name: 'Advanced AI Studio', icon: <Bot size={18} />, displayLabel: 'Advanced AI Studio', badge: 'AI' },
    { name: 'Complete Courses', icon: <GraduationCap size={18} />, displayLabel: 'Complete Courses', badge: 'New' },
    { name: 'Study Material', icon: <FileText size={18} />, displayLabel: 'Study Material & Notes', badge: 'Free' },
    { name: 'All Live Classes', icon: <Video size={18} />, displayLabel: 'Live Classrooms', badge: 'Live' },
    { name: 'All India Mock Test', icon: <Trophy size={18} />, displayLabel: 'All India Mock Test', badge: '720 M' },
    { name: 'Class Schedule', icon: <Calendar size={18} />, displayLabel: 'Class Timetable' },
    { name: 'My Tasks', icon: <CheckSquare size={18} />, displayLabel: 'Daily Study Tasks' },
    { name: 'E-Library', icon: <Library size={18} />, displayLabel: 'Digital E-Library & PYQs' },
    { name: 'Education & Guidance', icon: <BookOpen size={18} />, displayLabel: 'Education & Mentors' },
    { name: 'AI Personalised Study Assistant', icon: <Cpu size={18} />, displayLabel: 'AI Study Assistant', badge: 'AI' },
    { name: 'Skill Classes', icon: <Award size={18} />, displayLabel: 'Skill Masterclasses' },
    { name: 'Discussion Forum', icon: <Users size={18} />, displayLabel: 'Discussion Forum' },
    { name: 'Science and Concept Visualizer', icon: <FlaskConical size={18} />, displayLabel: 'Science & Concept Lab' },
    { name: 'Learn with Podcast', icon: <Radio size={18} />, displayLabel: 'Learn with Podcast' },
    { name: 'Media Library', icon: <Video size={18} />, displayLabel: 'Media & Lecture Archives', badge: 'Vault' },
    { name: 'Chat', icon: <MessageSquare size={18} />, displayLabel: 'Doubt Chat' },
    { name: 'Settings', icon: <Settings size={18} />, displayLabel: 'Settings' },
    { name: 'Emergency Help', icon: <HelpCircle size={18} />, displayLabel: 'Emergency & SOS', badge: '24x7' },
  ];
};

const Layout: React.FC<LayoutProps> = ({
  currentPage,
  isSidebarOpen,
  setIsSidebarOpen,
  onNavigate,
  onBack,
  navigationHistory,
  notifications,
  currentUser,
  userRole,
  onOpenBroadcast,
  onSwitchRole,
  onOpenLogin,
  children
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsAppFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleAppFullscreen = () => {
    setIsAppFullscreen(prev => !prev);
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className="flex h-screen h-[100dvh] max-h-[100dvh] bg-[#060813] text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30 relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none -z-0"></div>

      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden transition-opacity"
        />
      )}

      {/* FIXED SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-[#080d1e]/95 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group leading-none" onClick={() => { onNavigate('Home'); setIsSidebarOpen(false); }}>
              <Logo size="sm" />
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors uppercase font-montserrat">Future Legacy</span>
                <span className="text-[7px] font-black text-indigo-400 tracking-[0.4em] uppercase">Ecosystem</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-xl"><X size={18} /></button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
            {getRoleNavigation(userRole).map(link => {
              const isActive = currentPage === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => { onNavigate(link.name); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 text-left ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-500 text-white shadow-[0_8px_25px_rgba(79,70,229,0.35)] font-bold border border-indigo-400/40' 
                      : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`}>
                      {link.icon}
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wider leading-tight truncate font-montserrat">
                      {link.displayLabel}
                    </span>
                  </div>
                  {link.badge && (
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : link.badge.includes('1800') 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/10 text-slate-400 border border-white/10'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-white/10">
             <div className="flex items-center gap-3 p-3 bg-slate-900/90 rounded-2xl border border-white/10 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">Future Legacy v2.2</span>
                  <span className="text-[8px] font-semibold text-emerald-400 tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    All Systems Online
                  </span>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* VIEWPORT NODE */}
      <div className="flex-1 lg:ml-72 flex flex-col h-screen h-[100dvh] max-h-[100dvh] overflow-hidden relative">
        <header className="h-16 md:h-20 bg-[#080d1e]/90 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-40 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>

            {/* UNIVERSAL BACK BUTTON (Always shown whenever user is not on Home or has history) */}
            {(currentPage !== 'Home' || navigationHistory.length > 1) && (
              <button
                onClick={() => {
                  if (navigationHistory.length > 1) {
                    onBack();
                  } else {
                    onNavigate('Home');
                  }
                }}
                className="px-2.5 sm:px-3 py-1.5 bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 hover:text-white border border-indigo-500/35 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm group"
                title="Go back to previous page (पिछला पृष्ठ / Back)"
                aria-label="Back to Previous Page"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform text-indigo-300" />
                <span className="font-bold">Back</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider font-montserrat">
                {currentPage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* App-Wide Fullscreen Mode Toggle */}
            <button
              onClick={toggleAppFullscreen}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer text-xs font-bold active:scale-95 ${
                isAppFullscreen 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-950/40' 
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
              }`}
              title={isAppFullscreen ? "Exit Fullscreen (पूर्ण स्क्रीन से बाहर निकलें)" : "Enter Fullscreen Mode (पूर्ण स्क्रीन मोड)"}
            >
              {isAppFullscreen ? (
                <>
                  <Minimize2 size={16} className="text-emerald-400" />
                  <span className="hidden md:inline text-[11px] font-bold text-emerald-400">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 size={16} className="text-indigo-400" />
                  <span className="hidden md:inline text-[11px] font-bold text-slate-300">Fullscreen</span>
                </>
              )}
            </button>

            {currentUser && (
              <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block leading-tight">
                  <p className="text-[11px] font-bold text-white uppercase tracking-tight font-montserrat">{currentUser.name}</p>
                  <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider mt-0.5">{userRole}</p>
                </div>
                <div className="relative group cursor-pointer" onClick={() => onNavigate('Settings')}>
                    <img 
                      src={currentUser.imageUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=3b82f6,6366f1'} 
                      alt={currentUser.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=3b82f6,6366f1';
                      }}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover ring-2 ring-white/20 shadow-xl group-hover:ring-indigo-500 transition-all" 
                    />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* FLUID KINETIC SCROLL AREA */}
        <main 
          ref={mainRef}
          key={currentPage}
          className="flex-1 kinetic-scroll overflow-y-auto overflow-x-hidden pb-28 md:pb-36 custom-scrollbar overscroll-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 md:pt-5 pb-16 sm:pb-24 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;