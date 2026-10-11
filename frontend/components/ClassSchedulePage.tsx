import React, { useState, useMemo, useEffect } from 'react';
import type { ClassSchedule, SkillClass, AgroClass, PlayableMedia, GuidanceClass, UserRole } from '../types.ts';
import { Calendar, Clock, User, Plus, Search, Filter, Play, Music, Image as ImageIcon, Video, ArrowUpRight, Zap } from 'lucide-react';

interface ClassSchedulePageProps {
  schedules: ClassSchedule[];
  userRole: UserRole;
  onSave: (data: Omit<ClassSchedule, 'id'>) => void;
  onPlayMedia: (media: PlayableMedia) => void;
  skillClasses: SkillClass[];
  agroClasses: AgroClass[];
  guidanceClasses: GuidanceClass[];
}

const timeSince = (date: string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const intervals: { [key: string]: number } = { y: 31536000, mo: 2592000, d: 86400, h: 3600, m: 60 };
  for (const key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) return `${interval}${key} ago`;
  }
  return Math.floor(seconds) + "s ago";
};

const ScheduleCard: React.FC<{ schedule: ClassSchedule; onPlayMedia: ClassSchedulePageProps['onPlayMedia'] }> = ({ schedule, onPlayMedia }) => {
  const MediaPreview: React.FC = () => {
    if (!schedule.mediaUrl || !schedule.mediaType) return null;

    const handleMediaClick = () => {
      onPlayMedia({ type: schedule.mediaType!, url: schedule.mediaUrl!, name: schedule.title });
    };

    switch (schedule.mediaType) {
      case 'image':
        return (
          <div className="mt-6 relative group cursor-pointer rounded-2xl overflow-hidden border border-white/5 shadow-2xl" onClick={handleMediaClick}>
            <img src={schedule.mediaUrl} alt={schedule.title} className="w-full h-auto max-h-64 object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
                <ImageIcon size={32} className="text-white" />
              </div>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="mt-6 relative group cursor-pointer rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-slate-950 aspect-video flex items-center justify-center" onClick={handleMediaClick}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-50" />
            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl group-hover:scale-110 transition-transform group-hover:bg-blue-600 group-hover:border-blue-400">
              <Play size={32} className="text-white fill-current ml-1" />
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
              Video Asset
            </div>
          </div>
        );
      case 'audio':
        return (
          <button onClick={handleMediaClick} className="mt-6 w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl flex items-center gap-4 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Music size={24} />
            </div>
            <div className="text-left flex-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Vocal Transmission</p>
              <p className="text-sm font-bold text-slate-200">Play Audio Announcement</p>
            </div>
            <ArrowUpRight size={20} className="text-slate-600 group-hover:text-blue-400" />
          </button>
        );
      default: return null;
    }
  };

  const getTag = () => {
    switch (schedule.classType) {
      case 'skill': return { text: 'Skill Module', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' };
      case 'agro': return { text: 'Agro Protocol', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
      case 'guidance': return { text: 'Academic Strategy', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
      default: return { text: 'General Dispatch', color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' };
    }
  };
  const tag = getTag();

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all shadow-2xl group animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={schedule.authorImageUrl} alt={schedule.author} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/5 group-hover:ring-blue-500/30 transition-all" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full" />
          </div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight uppercase font-montserrat">{schedule.author}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{timeSince(schedule.timestamp)}</p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${tag.color}`}>
          {tag.text}
        </span>
      </header>

      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase font-montserrat group-hover:text-blue-400 transition-colors break-words">{schedule.title}</h4>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Linked Node: <span className="text-slate-300">{schedule.className}</span></p>
        </div>

        <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-blue-400/60 uppercase tracking-widest">Chronos Event</p>
              <p className="text-sm font-bold text-blue-100">
                {new Date(schedule.scheduleTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(schedule.scheduleTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <Zap size={18} className="text-blue-500/30 animate-pulse" />
        </div>

        <p className="text-slate-400 text-sm leading-relaxed font-medium break-words">
          {schedule.text}
        </p>

        <MediaPreview />
      </div>

      <footer className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
          View Detail Protocol <ArrowUpRight size={14} />
        </button>
        <div className="flex items-center gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
           <div className="w-2 h-2 rounded-full bg-slate-600" />
           <div className="w-2 h-2 rounded-full bg-slate-600" />
           <div className="w-2 h-2 rounded-full bg-slate-600" />
        </div>
      </footer>
    </div>
  );
};

const ClassSchedulePage: React.FC<ClassSchedulePageProps> = ({ schedules, userRole, onSave, onPlayMedia, skillClasses, agroClasses, guidanceClasses }) => {
  const [activeTab, setActiveTab] = useState<'my-classes' | 'all'>('my-classes');
  const [classTypeFilter, setClassTypeFilter] = useState<'all' | 'skill' | 'agro' | 'guidance'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const enrolledClassIds = useMemo(() => {
    const skillIds = skillClasses.filter(c => c.isEnrolled).map(c => c.id);
    const agroIds = agroClasses.filter(c => c.isEnrolled).map(c => c.id);
    const guidanceIds = guidanceClasses.filter(c => c.isEnrolled).map(c => c.id);
    return { skill: new Set(skillIds), agro: new Set(agroIds), guidance: new Set(guidanceIds) };
  }, [skillClasses, agroClasses, guidanceClasses]);

  const displayedSchedules = useMemo(() => {
    let sorted = [...schedules].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (activeTab === 'my-classes') {
      sorted = sorted.filter(s => 
        s.classId && s.classType && enrolledClassIds[s.classType as keyof typeof enrolledClassIds]?.has(s.classId)
      );
    }
    
    if (classTypeFilter !== 'all') {
      sorted = sorted.filter(s => s.classType === classTypeFilter);
    }
    
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      sorted = sorted.filter(s => 
        (s.title || '').toLowerCase().includes(lowercasedQuery) ||
        (s.author || '').toLowerCase().includes(lowercasedQuery) ||
        (s.className || '').toLowerCase().includes(lowercasedQuery)
      );
    }

    return sorted;
  }, [schedules, activeTab, enrolledClassIds, classTypeFilter, searchQuery]);

  useEffect(() => {
    setClassTypeFilter('all');
    setSearchQuery('');
  }, [activeTab]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black uppercase tracking-widest">
            <Calendar size={12} />
            Temporal Synchronization Hub
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat">Class Schedule</h2>
          <p className="text-slate-500 font-medium max-w-xl">Monitor academic dispatches, event timelines, and mentor announcements across your active nodes.</p>
        </div>

        {userRole === 'teacher' && (
          <button className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20">
            <Plus size={18} />
            Initialize Dispatch
          </button>
        )}
      </header>

      <section className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex gap-2 p-1 bg-slate-950/50 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('my-classes')} 
              className={`px-8 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${activeTab === 'my-classes' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              My Uplinks
            </button>
            <button 
              onClick={() => setActiveTab('all')} 
              className={`px-8 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Global Dispatches
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-all" size={16} />
              <input 
                type="text" 
                placeholder="Query transmissions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>
            
            <div className="flex gap-2 p-1 bg-slate-800 rounded-xl border border-white/5 overflow-x-auto max-w-full no-scrollbar">
              {(['all', 'skill', 'agro', 'guidance'] as const).map(f => (
                <button 
                  key={f} 
                  onClick={() => setClassTypeFilter(f)} 
                  className={`whitespace-nowrap px-4 py-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-widest ${classTypeFilter === f ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {f === 'all' ? 'Global' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayedSchedules.length > 0 ? (
            displayedSchedules.map(schedule => (
              <ScheduleCard key={schedule.id} schedule={schedule} onPlayMedia={onPlayMedia} />
            ))
          ) : (
            <div className="lg:col-span-2 py-24 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-700 border border-white/5">
                <Calendar size={40} />
              </div>
              <div className="max-w-xs space-y-2">
                <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight">Channel Idle</h4>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  {activeTab === 'my-classes' 
                    ? "No transmissions detected on your active academic uplinks. Monitor 'Global Dispatches' for system-wide alerts."
                    : "No dispatches found matching your current filter parameters."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Sidebar - Premium Feature Visualization */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        <div className="p-8 bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/20 rounded-[2.5rem] group cursor-pointer hover:bg-violet-600/20 transition-all shadow-xl shadow-violet-900/5">
           <Zap className="text-violet-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
           <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Priority Alerts</h4>
           <p className="text-slate-500 text-xs font-medium leading-relaxed">Enable neural notifications for high-priority academic dispatches directly to your uplink device.</p>
        </div>
        <div className="p-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[2.5rem] group cursor-pointer hover:bg-blue-600/20 transition-all shadow-xl shadow-blue-900/5">
           <Clock className="text-blue-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
           <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Temporal History</h4>
           <p className="text-slate-500 text-xs font-medium leading-relaxed">Archive and retrieve all historical academic transmissions across all semesters and node versions.</p>
        </div>
        <div className="p-8 bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/20 rounded-[2.5rem] group cursor-pointer hover:bg-emerald-600/20 transition-all shadow-xl shadow-emerald-900/5">
           <User className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
           <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Elite Mentors</h4>
           <p className="text-slate-500 text-xs font-medium leading-relaxed">Connect directly with dispatch authors for deeper clarification on high-priority temporal events.</p>
        </div>
      </section>
    </div>
  );
};

export default ClassSchedulePage;
