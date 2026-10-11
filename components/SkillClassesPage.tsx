
import React, { useState, useMemo } from 'react';
import type { SkillClass, UserRole, User, PriceTier } from '../types.ts';
import { 
  Star, Users, Award, ShieldCheck, Zap, Plus, 
  Search, Play, BookOpen, Target, ArrowUpRight, 
  Filter, CheckCircle2, MoreHorizontal, FileText,
  GraduationCap
} from 'lucide-react';
import SkillClassFormModal from './SkillClassFormModal.tsx';
import EnrollmentModal from './EnrollmentModal.tsx';
import CourseAndTeacherModal from './CourseAndTeacherModal.tsx';
import { CourseMaterials } from './CourseMaterials.tsx';

// Removed unused declare global for renderMathInElement and katex

interface SkillClassesPageProps {
  skillClasses: SkillClass[];
  onEnroll: (classId: number) => void;
  onSaveClass: (data: Omit<SkillClass, 'id' | 'isEnrolled' | 'studentsEnrolled'>, id?: number) => void;
  userRole: UserRole;
  currentUser: User;
}

const getPriceDisplay = (tiers: PriceTier[] | undefined) => {
  if (!tiers || tiers.length === 0) return "Protocol Locked";
  const prices = tiers.map(t => t.price).sort((a, b) => a - b);
  const minPrice = prices[0];
  if (minPrice === 0 && prices.every(p => p === 0)) return "Open Access";
  return tiers.length === 1 ? `₹${minPrice}` : `From ₹${minPrice}`;
};

export const SkillClassesPage: React.FC<SkillClassesPageProps> = ({ 
  skillClasses, 
  onEnroll, 
  onSaveClass, 
  userRole, 
  currentUser 
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SkillClass | null>(null);
  const [enrollingClass, setEnrollingClass] = useState<SkillClass | null>(null);
  const [selectedClassForModal, setSelectedClassForModal] = useState<SkillClass | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'teacher' | 'course'>('teacher');

  const categories = ['All', 'Finance', 'AI', 'Agriculture', 'STEM', 'Career', 'Creativity'];

  const filteredClasses = useMemo(() => {
    return skillClasses.filter(c => {
      const catMatch = activeCategory === 'All' || c.category === activeCategory;
      const diffMatch = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
      const searchMatch = searchQuery === '' || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && diffMatch && searchMatch;
    });
  }, [skillClasses, activeCategory, searchQuery, difficultyFilter]);

  const isTeacher = userRole === 'teacher';

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* 1. Header Protocol */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-[9px] font-black uppercase tracking-widest">
            <Award size={12} />
            Academic Excellence Hub
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat leading-none">Skill Modules</h2>
          <p className="text-slate-500 font-medium max-w-xl">Master elite disciplines with global architects. Access modular academic protocols spanning the frontiers of human innovation.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-all" size={16} />
            <input 
              type="text" 
              placeholder="Query syllabus..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all w-full md:w-64"
            />
          </div>
          {isTeacher && (
            <button 
              onClick={() => { setEditingClass(null); setIsFormOpen(true); }}
              className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20"
            >
              <Plus size={16} />
              Initialize Module
            </button>
          )}
        </div>
      </header>

      {/* 2. Intelligence Recommendation Banner */}
      <section className="bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-transparent border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-[3s]">
          <BookOpen size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)] flex-shrink-0">
                    <Zap size={32} className="fill-current" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Neural Inspiration Hub</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">
                        Synthesize high-performance academic suggestions tailored to your neural profile.
                    </p>
                </div>
            </div>
            {/* AISuggestionBanner is a separate component that would be rendered here */}
            {/* For now, just a placeholder or the actual component if implemented */}
            <button className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] uppercase text-[10px] tracking-widest whitespace-nowrap">
                Get AI Suggestions <ArrowUpRight size={16} className="ml-2"/>
            </button>
        </div>
      </section>

      {/* 3. Filter Hub */}
      <section className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 ml-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syllabus Classification</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === category ? 'bg-white text-slate-950 border-white shadow-xl' : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10 hover:text-white'}`}
                >
                    {category}
                </button>
            ))}
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-4 border-t border-white/5">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Difficulty:</span>
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${difficultyFilter === diff ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-800 text-slate-600 border-white/5 hover:text-slate-300'}`}
                >
                    {diff}
                </button>
            ))}
        </div>
      </section>

      {/* 4. Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(cls => {
            const isFull = (cls.studentsEnrolled || 0) >= (cls.maxStudents || 100);
            return (
              <div key={cls.id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/40 transition-all duration-500 shadow-2xl flex flex-col h-full hover:-translate-y-2">
                {/* Visual Projection */}
                <div className="aspect-video relative overflow-hidden">
                  <img src={cls.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />

                  {/* Protocol Badges */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-violet-600/20 backdrop-blur-md border border-violet-500/30 rounded-lg text-[9px] font-black text-violet-400 uppercase tracking-widest">
                      {cls.category}
                    </div>
                    {cls.isEnrolled && (
                      <div className="px-3 py-1 bg-emerald-600/20 backdrop-blur-md border border-emerald-500/30 rounded-lg text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <ShieldCheck size={10} /> Active Uplink
                      </div>
                    )}
                  </div>

                  {/* Rating Reveal */}
                  <div className="absolute bottom-6 left-6">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/60 backdrop-blur-md rounded-lg border border-white/10">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-white">{cls.rating}</span>
                    </div>
                  </div>

                  {/* Meta Indicator */}
                  <div className="absolute bottom-6 right-6">
                    <div className="px-3 py-1 bg-slate-950/60 backdrop-blur-md border border-white/5 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      {cls.type}
                    </div>
                  </div>
                </div>

                {/* Data Node */}
                <div className="p-10 flex-1 flex flex-col">
                  <div className="mb-6 flex-1">
                    <h4 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight mb-2 uppercase font-montserrat tracking-tight">{cls.title}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Node Managed By: <span className="text-slate-300">{cls.instructor}</span></p>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">{cls.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural Population</p>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-500/50" />
                        <span className={`text-xs font-black ${isFull ? 'text-rose-500' : 'text-slate-200'}`}>
                          {cls.studentsEnrolled || 0} / {cls.maxStudents || 100}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Temporal Access</p>
                      <span className="text-xs font-black text-slate-200">{getPriceDisplay(cls.pricingTiers)}</span>
                    </div>
                  </div>

                  {/* Teacher Degrees & Course Syllabus Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <button
                      onClick={() => { setSelectedClassForModal(cls); setModalInitialTab('teacher'); }}
                      className="py-2.5 px-3 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 rounded-xl text-[10px] font-black text-indigo-300 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      <GraduationCap size={13} />
                      <span>Teacher Degrees</span>
                    </button>
                    <button
                      onClick={() => { setSelectedClassForModal(cls); setModalInitialTab('course'); }}
                      className="py-2.5 px-3 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 rounded-xl text-[10px] font-black text-blue-300 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      <BookOpen size={13} />
                      <span>Complete Course</span>
                    </button>
                  </div>

                  <div className="mt-4 flex gap-4">
                    {cls.isEnrolled ? (
                      <button className="flex-1 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 active:scale-95">
                        <Play size={16} fill="currentColor" /> Enter Node
                      </button>
                    ) : (
                      <button
                        onClick={() => setEnrollingClass(cls)}
                        disabled={isFull}
                        className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                      >
                        <Zap size={16} /> {isFull ? 'Population Cap Reached' : `Authorize Uplink`}
                      </button>
                    )}
                    {isTeacher && cls.instructor === currentUser.name && (
                      <button
                        onClick={() => { setEditingClass(cls); setIsFormOpen(true); }}
                        className="p-5 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all rounded-2xl"
                      >
                        <Target size={20} />
                      </button>
                    )}
                  </div>
                  {cls.isEnrolled && (
                    <div className="mt-8 border-t border-white/5 pt-8">
                      <CourseMaterials notes={cls.notes} dpps={cls.dpps} tests={cls.tests} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-slate-700 shadow-inner">
              <BookOpen size={48} />
            </div>
            <div className="max-w-xs space-y-2">
              <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight">Archives Idle</h4>
              <p className="text-slate-600 text-sm font-medium">No active modules detected within current filter parameters. Modify search query.</p>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <SkillClassFormModal
          skillClass={editingClass}
          currentUser={currentUser}
          onClose={() => { setIsFormOpen(false); setEditingClass(null); }}
          onSave={onSaveClass}
        />
      )}

      {enrollingClass && (
        <EnrollmentModal
          skillClass={enrollingClass}
          onClose={() => setEnrollingClass(null)}
          onConfirm={(id) => { onEnroll(id); setEnrollingClass(null); }}
        />
      )}

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
