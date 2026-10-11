import React, { useState } from 'react';
import type { Page, Mentor, LiveClass, Task, UserRole, User, AgroClass, AgroProfessional } from '../types.ts';
import { Logo } from './Logo.tsx';
import FarmerDashboard from './FarmerDashboard.tsx';
import CourseAndTeacherModal from './CourseAndTeacherModal.tsx';
import { 
  ArrowUpRight, TrendingUp, Users, Clock, PlayCircle, Sparkles, 
  ShieldCheck, Zap, Award, BookOpen, Flame, CheckCircle2, ChevronRight,
  GraduationCap, Sprout, Trophy, Radio, HeartPulse, CheckSquare,
  Calendar, Check, ArrowRight, Video, FlaskConical, MessageSquare,
  Compass, Headphones, BookMarked, BrainCircuit, Activity, PlusCircle,
  Bell, FileText, PenTool, LayoutDashboard, Share2, Layers, HelpCircle,
  ClipboardList, UserCheck, Plus, CreditCard, Lock
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  mentors?: Mentor[];
  liveClasses?: LiveClass[];
  tasks?: Task[];
  userRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
  currentUser?: User;
  onJoinLiveClass?: (c: LiveClass) => void;
  onStartMockTest?: (t: any) => void;
  agroClasses?: AgroClass[];
  agroProfessionals?: AgroProfessional[];
  // Teacher Action Modals
  onOpenCreateLiveModal?: () => void;
  onOpenScheduleModal?: () => void;
  onOpenSkillModal?: () => void;
  onOpenGuidanceModal?: () => void;
  onOpenLibraryModal?: () => void;
  onOpenNotificationModal?: () => void;
  onOpenAssignmentModal?: () => void;
  onOpenWhiteboardModal?: () => void;
  onOpenMentorModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  mentors = [], 
  liveClasses = [], 
  tasks = [],
  userRole = 'student',
  onSwitchRole,
  currentUser,
  onJoinLiveClass,
  onStartMockTest,
  onOpenCreateLiveModal,
  onOpenScheduleModal,
  onOpenSkillModal,
  onOpenGuidanceModal,
  onOpenLibraryModal,
  onOpenNotificationModal,
  onOpenAssignmentModal,
  onOpenWhiteboardModal,
  onOpenMentorModal,
}) => {
  // Teacher and Course Modal State
  const [selectedClassForModal, setSelectedClassForModal] = useState<LiveClass | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'teacher' | 'course'>('teacher');

  const openTeacherModal = (cls: LiveClass, tab: 'teacher' | 'course' = 'teacher') => {
    setSelectedClassForModal(cls);
    setModalInitialTab(tab);
  };

  // Local task state so students can toggle completion interactively on the Home Page
  const [localTasks, setLocalTasks] = useState<Task[]>(() => {
    if (Array.isArray(tasks) && tasks.length > 0) return tasks;
    return [
      { id: 1, title: 'NEET Physics: Thermodynamics Formula Mastery', description: 'Review Carnot Engine, Entropy and solve 15 PYQs', isCompleted: false, dueDate: 'Today, 6:00 PM' },
      { id: 2, title: 'Rapid NCERT Biology Flashcards Review', description: 'Genetics, DNA Replication & Transcription', isCompleted: true, dueDate: 'Completed' },
      { id: 3, title: 'Organic Chemistry Live Reaction Mechanisms', description: 'Interactive Masterclass with Dr. Alex Sterling', isCompleted: false, dueDate: 'Tomorrow, 10:00 AM' }
    ];
  });

  const toggleTask = (id: number) => {
    setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const safeMentors = Array.isArray(mentors) && mentors.length > 0 ? mentors : [
    {
      id: 1,
      name: 'Dr. APJ Abdul Kalam',
      role: 'Aerospace Scientist & Visionary Guide',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/1200px-A._P._J._Abdul_Kalam.jpg',
      about: 'Beloved educator who ignited millions of young minds to innovate, dream big, and master sovereign technology.',
      followers: 12500000,
      isFollowed: true
    },
    {
      id: 2,
      name: 'Sudha Murthy',
      role: 'Technologist, Author & Philanthropist',
      imageUrl: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2015/09/01/Photos/sudha-k3UD--621x414@LiveMint.jpg',
      about: 'Legendary mentor championing grassroots engineering, female empowerment, and authentic value-based education.',
      followers: 8900000,
      isFollowed: false
    }
  ];

  const safeLiveClasses = Array.isArray(liveClasses) && liveClasses.length > 0 ? liveClasses : [
    { 
      id: 1, 
      title: "Physics Mechanics & NEET Hotspot Derivations", 
      instructor: "Dr. Alex Sterling", 
      startTime: new Date().toISOString(), 
      viewerCount: 1420,
      price: 499,
      isEnrolled: false
    },
    { 
      id: 2, 
      title: "Smart Hydroponics & Soil Nutrient Diagnostics", 
      instructor: "Dr. Meena Singh", 
      startTime: new Date().toISOString(), 
      viewerCount: 890,
      price: 499,
      isEnrolled: false
    }
  ];

  const completedCount = localTasks.filter(t => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / (localTasks.length || 1)) * 100);

  // =========================================================================
  // 1. DEDICATED FARMER PORTAL (Strict Role Isolation: Only Farmer Content)
  // =========================================================================
  if (userRole === 'farmer') {
    return (
      <FarmerDashboard
        currentUser={currentUser}
        onNavigate={onNavigate}
        onSwitchRole={onSwitchRole}
        agroClasses={agroClasses}
        agroProfessionals={agroProfessionals}
      />
    );
  }

  // =========================================================================
  // 2. STUDENT & TEACHER ACADEMIC PLATFORM
  // Students strictly see learning modules, tests, and classrooms.
  // Teachers get the exclusive Faculty Action Center, telemetry, and live broadcaster.
  // =========================================================================
  return (
    <div className="space-y-8 md:space-y-10 pb-20 font-sans text-slate-100">
      
      {/* 1. EXECUTIVE WELCOME & IDENTITY STATUS BANNER */}
      <section className={`relative overflow-hidden rounded-3xl ${
        userRole === 'teacher' 
          ? 'bg-gradient-to-r from-[#170e2b] via-[#110e24] to-[#0a0718] border-purple-500/30 shadow-[0_15px_40px_rgba(23,14,43,0.8)]' 
          : 'bg-gradient-to-r from-[#0b1329] via-[#0f172a] to-[#080d1e] border-blue-500/25 shadow-[0_15px_40px_rgba(15,23,42,0.8)]'
      } border p-6 md:p-8 backdrop-blur-2xl`}>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/15 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* 🌟 APP LOGO, FUTURE LEGACY & BUILD YOUR LEGACY DISPLAY */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-4">
          <div className="relative mb-3 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-3.5 bg-slate-950/90 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl flex items-center justify-center">
              <Logo size="lg" isAnimated={true} />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-amber-300 drop-shadow-[0_4px_25px_rgba(99,102,241,0.6)]">
            Future Legacy
          </h2>

          <div className="mt-2.5 flex items-center justify-center gap-3">
            <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-indigo-400/60"></span>
            <p className="text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.35em] sm:tracking-[0.45em] text-indigo-300 drop-shadow-[0_2px_10px_rgba(99,102,241,0.5)] font-mono flex items-center gap-2">
              <span>✨</span>
              <span>Build Your Legacy</span>
              <span>✨</span>
            </p>
            <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-indigo-400/60"></span>
          </div>
        </div>

        {/* FACULTY TELEMETRY METRICS (When Teacher) */}
        {userRole === 'teacher' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5 pt-5 border-t border-white/10">
            <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Enrolled Students</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">2,450+</span>
            </div>
            <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Classes Conducted</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">48 Live</span>
            </div>
            <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Doubt Resolution</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">98.4%</span>
            </div>
            <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Faculty Rating</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">4.9 / 5.0 ⭐</span>
            </div>
          </div>
        )}
      </section>

      {/* TEACHER CREATION & CALL STUDIO (When Teacher: Direct access to all class and calling tools) */}
      {userRole === 'teacher' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-wider">
                <Sparkles size={16} />
                <span>Faculty Class Creation & Video Call Studio</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
                Teacher Action Center
              </h3>
              <p className="text-xs text-slate-400">
                Create and host live classes, video calls, schedule lectures, publish assignments, and upload notes for students
              </p>
            </div>
            
            {onOpenCreateLiveModal && (
              <button
                onClick={onOpenCreateLiveModal}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20 self-start sm:self-auto"
              >
                <Radio size={16} className="animate-ping text-white" />
                <span>+ Start Live Class & Call</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                id: 'create-live',
                title: 'Start Live Class & Call',
                desc: 'Start an instant interactive video lecture with digital whiteboard and real-time chat',
                icon: <Radio size={24} className="text-red-400 animate-pulse" />,
                badge: 'Live Call',
                badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
                border: 'border-red-500/40 hover:border-red-400',
                gradient: 'from-red-950/40 via-slate-900 to-slate-950',
                action: () => onOpenCreateLiveModal ? onOpenCreateLiveModal() : onNavigate('All Live Classes'),
                highlight: true
              },
              {
                id: 'schedule-class',
                title: 'Schedule Lecture',
                desc: 'Plan upcoming chapter lectures, select batch, and auto-notify students',
                icon: <Calendar size={24} className="text-blue-400" />,
                badge: 'Timetable',
                badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                border: 'border-blue-500/40 hover:border-blue-400',
                gradient: 'from-blue-950/40 via-slate-900 to-slate-950',
                action: () => onOpenScheduleModal ? onOpenScheduleModal() : onNavigate('Class Schedule')
              },
              {
                id: 'create-assignment',
                title: 'Create Assignment',
                desc: 'Assign chapter practice sets, homework, and evaluate student submissions',
                icon: <ClipboardList size={24} className="text-emerald-400" />,
                badge: 'Homework',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                border: 'border-emerald-500/40 hover:border-emerald-400',
                gradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
                action: () => onOpenAssignmentModal ? onOpenAssignmentModal() : onNavigate('My Tasks')
              },
              {
                id: 'upload-material',
                title: 'Study Material & Notes Vault',
                desc: 'Upload NCERT chapter PDFs, handwritten formulas, derivations, and video lecture notes',
                icon: <BookOpen size={24} className="text-emerald-400" />,
                badge: '4-Tap Vault',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                border: 'border-emerald-500/40 hover:border-emerald-400',
                gradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
                action: () => onNavigate('Study Material')
              },
              {
                id: 'broadcast-notification',
                title: 'Broadcast Notice',
                desc: 'Send urgent notifications, exam date announcements, and classroom links',
                icon: <Bell size={24} className="text-amber-400" />,
                badge: 'Instant Alert',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                border: 'border-amber-500/40 hover:border-amber-400',
                gradient: 'from-amber-950/40 via-slate-900 to-slate-950',
                action: () => onOpenNotificationModal ? onOpenNotificationModal() : null
              },
              {
                id: 'skill-masterclass',
                title: 'Create Skill Masterclass',
                desc: 'Publish specialized sessions in AI, coding, lab skills, or robotics',
                icon: <Award size={24} className="text-violet-400" />,
                badge: 'Practical Skills',
                badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
                border: 'border-violet-500/40 hover:border-violet-400',
                gradient: 'from-violet-950/40 via-slate-900 to-slate-950',
                action: () => onOpenSkillModal ? onOpenSkillModal() : onNavigate('Science and Concept Visualizer')
              },
              {
                id: 'guidance-session',
                title: 'Guidance & Counseling',
                desc: 'Host 1-on-1 career mentorship, study roadmap sessions, and mental health counseling',
                icon: <Compass size={24} className="text-rose-400" />,
                badge: '1-on-1 Mentorship',
                badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                border: 'border-rose-500/40 hover:border-rose-400',
                gradient: 'from-rose-950/40 via-slate-900 to-slate-950',
                action: () => onOpenGuidanceModal ? onOpenGuidanceModal() : onNavigate('Education & Guidance')
              },
              {
                id: 'whiteboard-studio',
                title: 'Digital Whiteboard',
                desc: 'Draw diagrams, explain equations with pen tools, and save board snapshots',
                icon: <PenTool size={24} className="text-teal-400" />,
                badge: 'Interactive Canvas',
                badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
                border: 'border-teal-500/40 hover:border-teal-400',
                gradient: 'from-teal-950/40 via-slate-900 to-slate-950',
                action: () => onOpenWhiteboardModal ? onOpenWhiteboardModal() : null
              },
              {
                id: 'faculty-profile',
                title: 'Educator Profile & Bio',
                desc: 'Update your qualification, subject specialties, schedule, and student feedback',
                icon: <UserCheck size={24} className="text-indigo-400" />,
                badge: 'Verified Bio',
                badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                border: 'border-indigo-500/40 hover:border-indigo-400',
                gradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
                action: () => onOpenMentorModal ? onOpenMentorModal() : onNavigate('Education & Guidance')
              }
            ].map((card) => (
              <button
                key={card.id}
                onClick={card.action}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b ${card.gradient} border ${card.border} text-left transition-all duration-300 shadow-xl flex flex-col justify-between space-y-3 cursor-pointer group active:scale-[0.98] hover:-translate-y-1 relative overflow-hidden ${
                  card.highlight ? 'ring-2 ring-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-11 h-11 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    {card.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm sm:text-base text-white font-montserrat flex items-center gap-1.5">
                    <span>{card.title}</span>
                    <Plus size={14} className="text-purple-400 group-hover:rotate-90 transition-transform flex-shrink-0" />
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{card.desc}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-slate-300 group-hover:text-white border-t border-white/5">
                  <span>Open Form</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 2. GRAND VIBRANT HERO CARD WITH 4 DIRECT ACTION ENGINES */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0c1638] via-[#090f26] to-[#040612] border border-indigo-500/35 p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(20,30,70,0.7)] group">
        <div className="absolute -top-20 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-blue-500/20 via-indigo-600/15 to-transparent blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 left-0 w-[400px] h-[400px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 backdrop-blur-xl border border-indigo-500/40 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-[0.25em] shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Future Legacy • Sovereign Platform 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-montserrat leading-tight">
              Empowering India's <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-300">
                Future Leaders & Innovators
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Learn directly from top doctors, scientists & civil servants. Master NCERT with smart AI notes, compete in national mock tests, and discover smart agriculture.
            </p>

            {/* 4 Flagship Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              <button 
                onClick={() => onNavigate('AI Personalised Study Assistant')}
                className="px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-2.5 uppercase text-xs tracking-wider cursor-pointer border border-white/25"
              >
                <Zap size={16} className="fill-yellow-300 text-yellow-300 animate-pulse" />
                <span>AI Study Suite</span>
              </button>

              <button 
                onClick={() => onNavigate('All Live Classes')}
                className="px-5 py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-95 flex items-center gap-2.5 uppercase text-xs tracking-wider cursor-pointer border border-white/25"
              >
                <Radio size={16} className="text-white animate-ping" />
                <span>Live Classes</span>
              </button>

              <button 
                onClick={() => onNavigate('All India Mock Test')}
                className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95 flex items-center gap-2.5 uppercase text-xs tracking-wider cursor-pointer border border-amber-300"
              >
                <Trophy size={16} className="fill-slate-950 text-slate-950" />
                <span>Mock Test (720 Marks)</span>
              </button>

              <button 
                onClick={() => onNavigate('Agro Future')}
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 flex items-center gap-2.5 uppercase text-xs tracking-wider cursor-pointer border border-white/20"
              >
                <Sprout size={16} className="text-emerald-200" />
                <span>Agro Future</span>
              </button>
            </div>
          </div>

          <div className="relative flex-shrink-0 hidden md:flex items-center justify-center">
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950 border border-indigo-500/40 p-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-2xl group-hover:scale-105 transition-transform duration-500">
              <Logo size="lg" isAnimated />
              <div className="mt-3 text-center">
                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest block">Future Legacy</span>
                <span className="text-[9px] font-bold text-slate-400">Knowledge & Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALL STUDENT FEATURES & ICONS BENTO GRID ("Home ke andar jitne icon ha wo saare aae") */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Sparkles size={16} />
              <span>All Student Modules & Learning Engines</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              Complete Learning Ecosystem
            </h3>
            <p className="text-xs text-slate-400">Explore all academic, testing, library, agro and community features with one click</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              id: 'ai-study',
              name: 'AI Study Assistant',
              desc: 'NCERT Notes, Mind Maps, Formula sheets & Doubts',
              icon: <Zap size={22} className="text-yellow-300 fill-yellow-300" />,
              gradient: 'from-blue-600/30 via-indigo-600/20 to-slate-900',
              border: 'border-blue-500/35 hover:border-blue-400',
              action: () => onNavigate('AI Personalised Study Assistant')
            },
            {
              id: 'live-classes',
              name: 'Live Classrooms',
              desc: 'Live video lectures, whiteboard & live doubt solving',
              icon: <Radio size={22} className="text-rose-400 animate-pulse" />,
              gradient: 'from-rose-600/30 via-red-600/20 to-slate-900',
              border: 'border-rose-500/35 hover:border-rose-400',
              action: () => onNavigate('All Live Classes')
            },
            {
              id: 'mock-test',
              name: 'All India Mock Test',
              desc: 'National NEET/JEE test series with AIR rank predictor',
              icon: <Trophy size={22} className="text-amber-400 fill-amber-400" />,
              gradient: 'from-amber-600/30 via-yellow-600/20 to-slate-900',
              border: 'border-amber-500/35 hover:border-amber-400',
              action: () => onNavigate('All India Mock Test')
            },
            {
              id: 'library',
              name: 'Digital E-Library',
              desc: 'NCERT Books, PYQs, Formula Vault & Topper Notes',
              icon: <BookOpen size={22} className="text-cyan-400" />,
              gradient: 'from-cyan-600/30 via-blue-600/20 to-slate-900',
              border: 'border-cyan-500/35 hover:border-cyan-400',
              action: () => onNavigate('E-Library')
            },
            {
              id: 'study-material',
              name: 'Study Material & Notes',
              desc: 'Chapter PDF derivations, formula sheets & video modules',
              icon: <FileText size={22} className="text-emerald-400" />,
              gradient: 'from-emerald-600/30 via-teal-600/20 to-slate-900',
              border: 'border-emerald-500/35 hover:border-emerald-400',
              action: () => onNavigate('Study Material')
            },
            {
              id: 'agro-future',
              name: 'Agro Future Hub',
              desc: 'AI Crop Doctor, Hydroponics, Soil Diagnostics & Mandi Rates',
              icon: <Sprout size={22} className="text-emerald-400" />,
              gradient: 'from-emerald-600/30 via-teal-600/20 to-slate-900',
              border: 'border-emerald-500/35 hover:border-emerald-400',
              action: () => onNavigate('Agro Future')
            },
            {
              id: 'discussion',
              name: 'Discussion Forum',
              desc: 'Peer doubts solving, question sharing & community answers',
              icon: <MessageSquare size={22} className="text-indigo-400" />,
              gradient: 'from-indigo-600/30 via-purple-600/20 to-slate-900',
              border: 'border-indigo-500/35 hover:border-indigo-400',
              action: () => onNavigate('Discussion Forum')
            },
            {
              id: 'podcast',
              name: 'Learn with Podcast',
              desc: 'Audio masterclasses & rapid chapter concept summaries',
              icon: <Headphones size={22} className="text-violet-400" />,
              gradient: 'from-violet-600/30 via-purple-600/20 to-slate-900',
              border: 'border-violet-500/35 hover:border-violet-400',
              action: () => onNavigate('Learn with Podcast')
            },
            {
              id: 'lab',
              name: 'Virtual STEM Lab',
              desc: 'Interactive physics, chemistry & bio visual simulations',
              icon: <FlaskConical size={22} className="text-fuchsia-400" />,
              gradient: 'from-fuchsia-600/30 via-pink-600/20 to-slate-900',
              border: 'border-fuchsia-500/35 hover:border-fuchsia-400',
              action: () => onNavigate('Science and Concept Visualizer')
            },
            {
              id: 'schedule',
              name: 'Class Timetable',
              desc: 'Weekly routine, upcoming sessions & live lecture alerts',
              icon: <Calendar size={22} className="text-blue-400" />,
              gradient: 'from-blue-600/30 via-sky-600/20 to-slate-900',
              border: 'border-blue-500/35 hover:border-blue-400',
              action: () => onNavigate('Class Schedule')
            },
            {
              id: 'tasks',
              name: 'My Study Tasks',
              desc: 'Daily revision targets, checklists and 7-day study streak',
              icon: <CheckSquare size={22} className="text-teal-400" />,
              gradient: 'from-teal-600/30 via-emerald-600/20 to-slate-900',
              border: 'border-teal-500/35 hover:border-teal-400',
              action: () => onNavigate('My Tasks')
            },
            {
              id: 'mentors',
              name: 'Star Mentors',
              desc: 'National luminaries, career guidance & strategy roadmap',
              icon: <Compass size={22} className="text-amber-400" />,
              gradient: 'from-amber-600/30 via-orange-600/20 to-slate-900',
              border: 'border-amber-500/35 hover:border-amber-400',
              action: () => onNavigate('Education & Guidance')
            },
            {
              id: 'wellness',
              name: 'Emergency & Help',
              desc: 'Student stress counseling, mental wellness & SOS hotline',
              icon: <HeartPulse size={22} className="text-rose-400" />,
              gradient: 'from-rose-600/30 via-red-600/20 to-slate-900',
              border: 'border-rose-500/35 hover:border-rose-400',
              action: () => onNavigate('Emergency Help')
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b ${item.gradient} border ${item.border} text-left transition-all duration-300 shadow-lg flex flex-col justify-between space-y-3 cursor-pointer group active:scale-[0.98] hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {item.icon}
                </div>
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/15 transition-all">
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-bold text-sm sm:text-base text-white font-montserrat truncate">{item.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. LIVE BROADCAST CLASSROOMS SPOTLIGHT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Active Video Broadcasts</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              Live Broadcast Classrooms
            </h3>
            <p className="text-xs text-slate-400">Join ongoing interactive lectures with real-time doubt clearing</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {userRole === 'teacher' && onOpenCreateLiveModal && (
              <button
                onClick={onOpenCreateLiveModal}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-white/20"
              >
                <Plus size={14} />
                <span>+ Start Live Class & Call</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('All Live Classes')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeLiveClasses.map((item) => {
            const isEnrolled = userRole === 'teacher' || item.isEnrolled;
            return (
            <div 
              key={item.id}
              className="bg-slate-900/80 border border-white/10 hover:border-blue-500/50 rounded-3xl p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between space-y-4 group hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live Broadcast
                    </span>
                    {userRole !== 'teacher' && (
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isEnrolled 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 size={10} />
                            <span>✓ Enrolled</span>
                          </>
                        ) : (
                          <>
                            <Lock size={10} />
                            <span>₹{item.price || 499} Required</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white font-montserrat">{item.title}</h4>
                  <p className="text-xs text-slate-400">Instructor: {item.instructor}</p>
                </div>
                <div className="px-3 py-1 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-1.5 flex-shrink-0">
                  <Users size={13} />
                  <span>{item.viewerCount || 1200} watching</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openTeacherModal(item, 'teacher')}
                    className="py-2 px-3 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 rounded-xl text-[10px] font-black text-indigo-300 hover:text-white uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <GraduationCap size={13} />
                    <span>Teacher Degrees</span>
                  </button>
                  <button
                    onClick={() => openTeacherModal(item, 'course')}
                    className="py-2 px-3 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 rounded-xl text-[10px] font-black text-blue-300 hover:text-white uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <BookOpen size={13} />
                    <span>Complete Course</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onJoinLiveClass ? onJoinLiveClass(item) : onNavigate('All Live Classes')}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all ${
                      userRole === 'teacher'
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500'
                        : isEnrolled
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 hover:from-amber-500 hover:to-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    }`}
                  >
                    {userRole === 'teacher' ? (
                      <>
                        <Video size={16} />
                        <span>Host / Broadcast Class</span>
                      </>
                    ) : isEnrolled ? (
                      <>
                        <PlayCircle size={16} />
                        <span>✓ Enrolled • Join Classroom Now</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        <span>🔒 Buy & Enroll (₹{item.price || 499}) to Join</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );})}
        </div>
      </section>

      {/* 5. INTERACTIVE DAILY TARGET CHECKLIST & STUDY STREAK */}
      <section className="bg-gradient-to-br from-slate-900/90 via-slate-950 to-black border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <CheckSquare size={16} />
                <span>Personalized Daily Learning Tracker</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
                Today's Study Checklist
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-bold">
                {completedCount} of {localTasks.length} Completed ({progressPercent}%)
              </span>
              <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-2.5 pt-1">
            {localTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  task.isCompleted 
                    ? 'bg-slate-950/70 border-emerald-500/30 text-slate-400' 
                    : 'bg-slate-800/70 hover:bg-slate-800 border-white/10 hover:border-indigo-500/40 text-white shadow-md'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                    task.isCompleted 
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                      : 'border-white/20 bg-slate-900 text-transparent'
                  }`}>
                    <Check size={15} className={task.isCompleted ? 'stroke-[3]' : ''} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-bold truncate ${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 truncate">{task.description}</p>
                    )}
                  </div>
                </div>
                {task.dueDate && (
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-lg flex-shrink-0 ${
                    task.isCompleted 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-white/5 text-slate-300 border border-white/10'
                  }`}>
                    {task.dueDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STAR MENTORS SPOTLIGHT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <Compass size={16} />
              <span>National Mentors & Luminaries</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              Star Mentors
            </h3>
            <p className="text-xs text-slate-400">Guiding Indian youth in science, nation building, and values</p>
          </div>
          <button
            onClick={() => onNavigate('Education & Guidance')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>All Mentors</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeMentors.map((m) => (
            <div 
              key={m.id}
              className="bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-5 sm:p-6 transition-all shadow-xl flex items-center gap-4 sm:gap-5"
            >
              <img 
                src={m.imageUrl} 
                alt={m.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/15 flex-shrink-0 shadow-md"
              />
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-base sm:text-lg text-white font-montserrat truncate">{m.name}</h4>
                <p className="text-xs text-indigo-300 font-semibold truncate">{m.role}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{m.about}</p>
                <button
                  onClick={() => onNavigate('Education & Guidance')}
                  className="mt-2 text-[10px] text-blue-400 font-black uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Connect & View Sessions</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 24x7 EMERGENCY & HELPLINE BAR */}
      <section className="bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-950 border border-red-500/35 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0 shadow-lg">
            <HeartPulse size={24} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white uppercase font-montserrat">
              24x7 Emergency Assistance & Student Wellness Hotline
            </h4>
            <p className="text-xs text-slate-400">
              Immediate mental wellness, exam anxiety support & medical guidance helpline.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('Emergency Help')}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] flex-shrink-0 cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <HeartPulse size={16} />
          <span>Access SOS Hotline</span>
        </button>
      </section>

      {/* Render Course & Teacher Qualifications Modal */}
      {selectedClassForModal && (
        <CourseAndTeacherModal
          courseData={selectedClassForModal}
          initialTab={modalInitialTab}
          onClose={() => setSelectedClassForModal(null)}
        />
      )}

    </div>
  );
};

export default HomePage;
