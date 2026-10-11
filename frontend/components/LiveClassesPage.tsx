import React, { useState, useEffect } from 'react';
import type { 
  LiveClass, UserRole, OneToOneDoubtCallBooking, LiveClassRecordingItem 
} from '../types.ts';
import { 
  Video, Play, Users, Plus, ArrowRight, Zap, Star, Clock, 
  Bell, BellRing, PhoneCall, Calendar, CheckCircle2, 
  MessageSquare, Film, Download, ShieldCheck, Filter, AlertCircle, X, Search
} from 'lucide-react';
import { OneToOneDoubtCallModal } from './OneToOneDoubtCallModal.tsx';
import { ClassRecordingViewModal } from './ClassRecordingViewModal.tsx';

interface LiveClassesPageProps {
  liveClasses: LiveClass[];
  onJoinClass: (cls: LiveClass) => void;
  onCreateClass: () => void;
  userRole: UserRole;
}

const DEFAULT_RECORDINGS: LiveClassRecordingItem[] = [
  {
    id: 'rec-1',
    classId: 101,
    title: 'Complete Mechanics & Newton\'s Laws Derivations Masterclass',
    instructor: 'Dr. Alex Sterling',
    subject: 'Physics',
    date: 'Yesterday, 04:00 PM',
    duration: '1h 24m',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    attendanceCount: 1420,
    chatHistory: [
      { id: '1', senderName: 'Aarav Sharma', text: 'Sir, in non-inertial frames, pseudo force direction will be opposite to frame acceleration?', timestamp: '04:12 PM', isDoubt: true, isSolved: true },
      { id: '2', senderName: 'Dr. Alex Sterling', text: 'Exactly Aarav! F_pseudo = -m * a_frame. Always opposite.', timestamp: '04:13 PM' },
      { id: '3', senderName: 'Rhea Sen', text: 'Can we apply conservation of momentum if external impulse is zero?', timestamp: '04:28 PM', isDoubt: true, isSolved: true },
      { id: '4', senderName: 'Dr. Alex Sterling', text: 'Yes Rhea, along that specific axis where net external impulse is 0, momentum is conserved.', timestamp: '04:29 PM' }
    ],
    notes: [
      { id: 'n-1', title: 'Chapter Derivations Handwritten Notes (PDF)', fileSize: '3.4 MB', fileName: 'Mechanics-Notes.pdf', uploadedBy: 'Dr. Alex Sterling', timestamp: 'Yesterday' },
      { id: 'n-2', title: 'Formula Sheet & PYQ Solved Bank', fileSize: '2.1 MB', fileName: 'Mechanics-PYQ.pdf', uploadedBy: 'Dr. Alex Sterling', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'rec-2',
    classId: 102,
    title: 'Organic Reaction Mechanisms & Electrophilic Aromatic Substitution',
    instructor: 'Prof. Priya Verma',
    subject: 'Chemistry',
    date: '2 Days Ago',
    duration: '1h 15m',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
    attendanceCount: 1180,
    chatHistory: [
      { id: '1', senderName: 'Kunal Patel', text: 'Why is Friedel-Crafts alkylation prone to carbocation rearrangement?', timestamp: '05:10 PM', isDoubt: true, isSolved: true },
      { id: '2', senderName: 'Prof. Priya Verma', text: 'Because primary carbocations rearrange via hydride or methyl shifts to form more stable 2° or 3° carbocations.', timestamp: '05:11 PM' }
    ],
    notes: [
      { id: 'n-3', title: 'Reaction Mechanisms Pathway Map (PDF)', fileSize: '4.2 MB', fileName: 'Organic-Mechanisms.pdf', uploadedBy: 'Prof. Priya Verma', timestamp: '2 Days Ago' }
    ]
  }
];

const DEFAULT_DOUBT_CALLS: OneToOneDoubtCallBooking[] = [
  {
    id: 'call-1',
    studentId: 'student-curr',
    studentName: 'Shourya Patel',
    teacherName: 'Dr. Alex Sterling',
    subject: 'Physics',
    topic: 'Doubts in Rotational Inertia and Moment of Inertia of Hollow Cone',
    date: 'Today',
    timeSlot: '05:30 PM - 05:45 PM',
    status: 'confirmed',
    mode: 'video'
  }
];

const LiveClassesPage: React.FC<LiveClassesPageProps> = ({ 
  liveClasses, 
  onJoinClass, 
  onCreateClass, 
  userRole 
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'schedule' | 'calls' | 'recordings'>('schedule');

  // Reminders state (Class IDs where student activated 15-min reminder)
  const [reminders, setReminders] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_live_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1-to-1 doubt calls state
  const [doubtCalls, setDoubtCalls] = useState<OneToOneDoubtCallBooking[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_doubt_calls');
      return saved ? JSON.parse(saved) : DEFAULT_DOUBT_CALLS;
    } catch {
      return DEFAULT_DOUBT_CALLS;
    }
  });

  // Booking modal form state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookTeacher, setBookTeacher] = useState('Dr. Alex Sterling');
  const [bookSubject, setBookSubject] = useState('Physics');
  const [bookSlot, setBookSlot] = useState('Today 04:30 PM - 04:45 PM');
  const [bookTopic, setBookTopic] = useState('');
  const [bookMode, setBookMode] = useState<'video' | 'audio'>('video');

  // Active modal triggers
  const [activeDoubtCall, setActiveDoubtCall] = useState<OneToOneDoubtCallBooking | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<LiveClassRecordingItem | null>(null);

  // Class recordings state
  const [recordings, setRecordings] = useState<LiveClassRecordingItem[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_class_recordings');
      return saved ? JSON.parse(saved) : DEFAULT_RECORDINGS;
    } catch {
      return DEFAULT_RECORDINGS;
    }
  });

  // Toggle Reminder
  const toggleReminder = (classId: number, classTitle: string) => {
    setReminders(prev => {
      let updated: number[];
      if (prev.includes(classId)) {
        updated = prev.filter(id => id !== classId);
        alert(`🔕 Reminder removed for "${classTitle}".`);
      } else {
        updated = [...prev, classId];
        alert(`🔔 Reminder Set Successfully!\nYou will receive a notification 10-15 minutes before "${classTitle}" goes live.`);
      }
      try {
        localStorage.setItem('future_legacy_live_reminders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Handle Book Doubt Call
  const handleBookCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTopic.trim()) return;

    const newBooking: OneToOneDoubtCallBooking = {
      id: `booking-${Date.now()}`,
      studentId: 'curr-user',
      studentName: 'Shourya Patel',
      teacherName: bookTeacher,
      subject: bookSubject,
      topic: bookTopic.trim(),
      date: bookSlot.split(' ')[0] || 'Today',
      timeSlot: bookSlot,
      status: 'confirmed',
      mode: bookMode
    };

    const updated = [newBooking, ...doubtCalls];
    setDoubtCalls(updated);
    try {
      localStorage.setItem('future_legacy_doubt_calls', JSON.stringify(updated));
    } catch {}

    setShowBookingModal(false);
    setBookTopic('');
    alert(`🎉 1-to-1 Doubt Call Booked Successfully!\nFaculty ${bookTeacher} has been scheduled for ${bookSlot}.\nYou can join the call directly from the "1-to-1 Doubt Call" tab.`);
  };

  // Handle Doubt Call Finished
  const handleCallFinished = (bookingId: string, rating?: number, feedback?: string) => {
    const updated = doubtCalls.map(c => {
      if (c.id === bookingId) {
        return { ...c, status: 'completed' as const, rating, feedback };
      }
      return c;
    });
    setDoubtCalls(updated);
    try {
      localStorage.setItem('future_legacy_doubt_calls', JSON.stringify(updated));
    } catch {}
    alert('Thank you! Your rating & feedback has been submitted to the faculty profile.');
  };

  // Filtering live classes
  const filteredClasses = liveClasses.filter(cls => {
    const matchSub = selectedSubject === 'All' || (cls.subject && cls.subject.toLowerCase() === selectedSubject.toLowerCase()) || cls.title.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchSearch = !searchQuery || cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || cls.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSub && matchSearch;
  });

  const featuredClass = filteredClasses[0] || liveClasses[0];
  const upcomingClasses = filteredClasses.length > 1 ? filteredClasses.slice(1) : [];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 text-slate-100">
      {/* Top Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-rose-500/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Zap size={13} />
            <span>Synchronized Broadcast Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase font-montserrat">
            Live Classroom & 1-to-1 Doubt Center
          </h2>
          <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">
            Live schedule with 15-min reminder, camera/audio controls, live chat doubts, hand raise, polls, notes sharing, attendance tracking, and 1-to-1 faculty doubt calling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {userRole === 'teacher' ? (
            <button
              onClick={onCreateClass}
              className="px-6 py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black rounded-2xl transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-xl shadow-rose-900/30 cursor-pointer active:scale-95"
            >
              <Plus size={16} />
              <span>Schedule Live Masterclass</span>
            </button>
          ) : (
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-xl shadow-indigo-900/30 cursor-pointer active:scale-95"
            >
              <PhoneCall size={16} />
              <span>Book 1-to-1 Doubt Call</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 max-w-2xl">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'schedule' 
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video size={15} />
          <span>🔴 Live & Scheduled Classes ({liveClasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'calls' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PhoneCall size={15} />
          <span>📞 1-to-1 Doubt Calls ({doubtCalls.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recordings')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'recordings' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film size={15} />
          <span>📼 Class Recordings ({recordings.length})</span>
        </button>
      </div>

      {/* TAB 1: LIVE & SCHEDULED CLASSES */}
      {activeTab === 'schedule' && (
        <div className="space-y-8">
          {/* Filters Bar */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search classes or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Subject:</span>
              {['All', 'Physics', 'Chemistry', 'Biology', 'Neurology'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSubject === sub 
                      ? 'bg-rose-600 text-white shadow' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Live Room */}
          {featuredClass && (
            <section className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-rose-500/30 p-6 sm:p-10 shadow-2xl">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                      <span>🔴 Broadcasting Live Now</span>
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-white/10">
                      Schedule: Today, {new Date(featuredClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white font-montserrat uppercase tracking-tight leading-snug">
                    {featuredClass.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${featuredClass.instructor}&backgroundColor=6366f1`} 
                        alt="Teacher" 
                        className="w-9 h-9 rounded-xl object-cover border border-white/10 shadow" 
                      />
                      <div>
                        <p className="font-bold text-white leading-tight">{featuredClass.instructor}</p>
                        <p className="text-[10px] text-slate-400">Head Faculty & Mentor</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5">
                      <Users size={15} className="text-rose-400" />
                      <span className="font-bold text-white">{featuredClass.viewerCount.toLocaleString()}</span>
                      <span>Students in Room</span>
                    </div>
                  </div>

                  {/* MVP Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => onJoinClass(featuredClass)}
                      className="px-8 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-rose-900/40 flex items-center gap-2.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>{userRole === 'teacher' ? 'Host Live Broadcast' : 'Join Live Class Room'}</span>
                    </button>

                    <button
                      onClick={() => toggleReminder(featuredClass.id, featuredClass.title)}
                      className={`px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
                        reminders.includes(featuredClass.id)
                          ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-emerald-900/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/10'
                      }`}
                    >
                      {reminders.includes(featuredClass.id) ? (
                        <>
                          <BellRing size={16} className="text-emerald-400 animate-bounce" />
                          <span>✓ Reminder Active (15m Pehle)</span>
                        </>
                      ) : (
                        <>
                          <Bell size={16} />
                          <span>🔔 Remind Me (15 min pehle)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Video Preview */}
                <div 
                  className="lg:col-span-5 aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group cursor-pointer"
                  onClick={() => onJoinClass(featuredClass)}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                    alt="Live Stream Preview" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-18 h-18 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-900/50 hover:scale-110 transition-transform">
                      <Play size={30} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Synchronized Feed
                    </span>
                    <span className="text-[10px] bg-black/60 px-2.5 py-1 rounded-md">Full HD 1080p</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Upcoming Class Schedule Cards */}
          <section className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Upcoming Live Class Schedule
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClasses.map((cls) => {
                const hasReminder = reminders.includes(cls.id);
                return (
                  <div 
                    key={cls.id}
                    className="bg-slate-900 border border-white/10 hover:border-rose-500/30 rounded-3xl p-6 shadow-xl space-y-5 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Date & Time pill */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                          <Calendar size={13} />
                          <span>Today • {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          Starts in {Math.max(1, Math.round((new Date(cls.startTime).getTime() - Date.now()) / (1000 * 60)))}m
                        </span>
                      </div>

                      <div>
                        <h5 className="text-base font-black text-white font-montserrat uppercase tracking-tight leading-snug line-clamp-2">
                          {cls.title}
                        </h5>
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                          <span>Faculty:</span>
                          <strong className="text-white">{cls.instructor}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Users size={14} className="text-rose-400" />
                          <span>{cls.viewerCount} Expected</span>
                        </span>
                        <span className="text-emerald-400 font-bold">Free Live Access</span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onJoinClass(cls)}
                          className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-rose-900/30 cursor-pointer active:scale-95 transition-all"
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Join Live</span>
                        </button>

                        <button
                          onClick={() => toggleReminder(cls.id, cls.title)}
                          className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            hasReminder
                              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/10'
                          }`}
                        >
                          {hasReminder ? (
                            <>
                              <BellRing size={13} className="text-emerald-400" />
                              <span>✓ Remind On</span>
                            </>
                          ) : (
                            <>
                              <Bell size={13} />
                              <span>🔔 Remind Me</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: 1-TO-1 DOUBT CALL (SLOT BOOKING) */}
      {activeTab === 'calls' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Anti-Spam Doubt Resolution System
              </span>
              <h3 className="text-2xl font-black text-white font-montserrat uppercase tracking-tight">
                Scheduled 1-to-1 Faculty Doubt Call
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Book a reserved 15-minute 1-to-1 audio/video doubt clearing session with your faculty mentor. Calls only ring during scheduled slots to respect teacher availability.
              </p>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-900/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Book New Doubt Slot</span>
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              My Booked Doubt Sessions ({doubtCalls.length})
            </h4>

            {doubtCalls.length === 0 ? (
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-12 text-center space-y-3">
                <PhoneCall size={40} className="mx-auto text-slate-600" />
                <h5 className="font-bold text-white text-base">No Doubt Calls Scheduled</h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "Book New Doubt Slot" above to select a time slot and connect with a teacher to resolve difficult numericals or concepts.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doubtCalls.map((call) => (
                  <div
                    key={call.id}
                    className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                          {call.subject}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          call.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {call.status === 'completed' ? '✓ Call Completed' : '● Slot Reserved'}
                        </span>
                      </div>

                      <div>
                        <h5 className="text-base font-bold text-white">{call.topic}</h5>
                        <p className="text-xs text-slate-400 mt-1">
                          Mentor: <strong className="text-white">{call.teacherName}</strong>
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-indigo-400" />
                          <span>{call.timeSlot}</span>
                        </div>
                        <span className="uppercase text-[10px] font-bold text-slate-500">{call.mode} Call</span>
                      </div>

                      {call.rating && (
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-amber-400 font-bold">Feedback Rating:</span>
                          <span className="font-bold text-amber-300">★ {call.rating} / 5.0</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      {call.status !== 'completed' ? (
                        <button
                          onClick={() => setActiveDoubtCall(call)}
                          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                        >
                          <PhoneCall size={15} />
                          <span>Start / Join 1-to-1 Call</span>
                        </button>
                      ) : (
                        <div className="text-center py-2 text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>Doubt Resolved & Graded</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CLASS RECORDINGS & CHAT HISTORY */}
      {activeTab === 'recordings' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-purple-500/20 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">Watch Recorded Masterclasses (Revision Hub)</h4>
              <p className="text-xs text-slate-400">
                Missed a live class? Replay video sessions anytime with synchronized side-by-side student doubts chat history and downloadable PDF handouts.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
              {recordings.length} Recorded Archives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-900 border border-white/10 hover:border-purple-500/30 rounded-3xl overflow-hidden shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <img 
                      src={rec.thumbnailUrl} 
                      alt={rec.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <button
                      onClick={() => setSelectedRecording(rec)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-purple-600 group-hover:bg-purple-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                        <Play size={26} fill="currentColor" className="ml-1" />
                      </div>
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span className="bg-black/60 px-2.5 py-0.5 rounded-md font-mono">{rec.duration}</span>
                      <span className="bg-black/60 px-2.5 py-0.5 rounded-md text-emerald-400 font-bold">
                        {rec.attendanceCount} Students
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-purple-400 font-bold uppercase">{rec.subject}</span>
                      <span className="text-slate-500">{rec.date}</span>
                    </div>

                    <h5 className="font-bold text-white text-base leading-snug line-clamp-2">{rec.title}</h5>
                    <p className="text-xs text-slate-400">Faculty: <strong className="text-white">{rec.instructor}</strong></p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-indigo-300">
                        <MessageSquare size={13} />
                        <span>{rec.chatHistory.length} Chat Doubts Saved</span>
                      </span>
                      <span>•</span>
                      <span>{rec.notes.length} PDF Handouts</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedRecording(rec)}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Watch Recording with Chat History</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOK 1-TO-1 DOUBT CALL MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Book 1-to-1 Doubt Call</h3>
                  <p className="text-xs text-slate-400">Reserved slot with faculty • No unannounced spam calls</p>
                </div>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBookCallSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Select Faculty Mentor</label>
                <select
                  value={bookTeacher}
                  onChange={(e) => setBookTeacher(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Dr. Alex Sterling">Dr. Alex Sterling (Physics Specialist)</option>
                  <option value="Dr. R. K. Sharma">Dr. R. K. Sharma (Biology / NCERT Expert)</option>
                  <option value="Prof. Priya Verma">Prof. Priya Verma (Organic Chemistry Faculty)</option>
                  <option value="Vikram Malhotra">Vikram Malhotra (Algorithms & System Design)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Subject</label>
                  <select
                    value={bookSubject}
                    onChange={(e) => setBookSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Call Format</label>
                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setBookMode('video')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        bookMode === 'video' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-white/10'
                      }`}
                    >
                      Video Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookMode('audio')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        bookMode === 'audio' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-white/10'
                      }`}
                    >
                      Audio Call
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Select Available Time Slot</label>
                <select
                  value={bookSlot}
                  onChange={(e) => setBookSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Today 04:30 PM - 04:45 PM">Today • 04:30 PM - 04:45 PM (Available)</option>
                  <option value="Today 05:30 PM - 05:45 PM">Today • 05:30 PM - 05:45 PM (Available)</option>
                  <option value="Today 06:45 PM - 07:00 PM">Today • 06:45 PM - 07:00 PM (Available)</option>
                  <option value="Tomorrow 11:00 AM - 11:15 AM">Tomorrow • 11:00 AM - 11:15 AM (Available)</option>
                  <option value="Tomorrow 04:00 PM - 04:15 PM">Tomorrow • 04:00 PM - 04:15 PM (Available)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Describe Your Question or Doubt</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify problem number, derivation step, or concept you want the teacher to explain..."
                  value={bookTopic}
                  onChange={(e) => setBookTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-900/30"
                >
                  Confirm Reserved Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-TO-1 ACTIVE CALL MODAL */}
      {activeDoubtCall && (
        <OneToOneDoubtCallModal
          booking={activeDoubtCall}
          isTeacher={userRole === 'teacher'}
          onClose={() => setActiveDoubtCall(null)}
          onCallCompleted={handleCallFinished}
        />
      )}

      {/* RECORDED CLASS WITH CHAT HISTORY MODAL */}
      {selectedRecording && (
        <ClassRecordingViewModal
          recording={selectedRecording}
          onClose={() => setSelectedRecording(null)}
        />
      )}
    </div>
  );
};

export default LiveClassesPage;
