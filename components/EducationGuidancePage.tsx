import React, { useState, useMemo } from 'react';
import type { GuidanceClass, SkillClass, UserRole, User } from '../types.ts';
import { CareerAITool } from './CareerAITool.tsx';
import { SkillClassesPage } from './SkillClassesPage.tsx';
import { 
  Compass, Search, Plus, Zap, Star, 
  ShieldCheck, Play, Award
} from 'lucide-react';

import GuidanceClassFormModal from './GuidanceClassFormModal.tsx';
import GuidanceEnrollmentModal from './GuidanceEnrollmentModal.tsx';
import { CourseMaterials } from './CourseMaterials.tsx';

interface EducationGuidancePageProps {
  guidanceClasses: GuidanceClass[];
  skillClasses: SkillClass[];
  onEnrollGuidance: (classId: number) => void;
  onEnrollSkill: (classId: number) => void;
  onSaveGuidance: (data: any, id?: number) => void;
  onSaveSkill: (data: any, id?: number) => void;
  onAddReview: (classType: 'guidance' | 'skill', classId: number, reviewData: { rating: number; comment: string }) => void;
  userRole: UserRole;
  currentUser: User;
}

const EducationGuidancePage: React.FC<EducationGuidancePageProps> = ({ 
  guidanceClasses = [], 
  skillClasses = [],
  onEnrollGuidance, 
  onEnrollSkill,
  onSaveGuidance, 
  onSaveSkill,
  userRole, 
  currentUser 
}) => {
    const [activeModule, setActiveModule] = useState<'guidance' | 'skills' | 'career'>('guidance');
    const [enrollingClass, setEnrollingClass] = useState<GuidanceClass | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const filteredGuidance = useMemo(() => {
        return guidanceClasses.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [guidanceClasses, searchQuery]);

    const isTeacher = userRole === 'teacher' || userRole === 'admin';

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-700">
            <header className="space-y-8 border-b border-white/5 pb-12">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-[9px] font-black uppercase tracking-widest">
                        <Compass size={12} />
                        National Scholarly Network
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase font-montserrat leading-none">Education Hub</h2>
                </div>

                <div className="flex flex-wrap gap-4">
                    {[
                        { id: 'guidance', label: 'Strategy & Exams', icon: <Compass size={14}/> },
                        { id: 'skills', label: 'Expert Skillsets', icon: <Award size={14}/> },
                        { id: 'career', label: 'AI Trajectory', icon: <Zap size={14}/> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveModule(tab.id as any)}
                            className={`px-10 py-5 rounded-[2rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-all border ${activeModule === tab.id ? 'bg-white text-black border-white shadow-2xl' : 'bg-[#0c0c0e] text-zinc-500 border-white/5 hover:border-white/20'}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {activeModule === 'career' && <CareerAITool />}

            {activeModule === 'skills' && (
                <SkillClassesPage 
                    skillClasses={skillClasses} 
                    userRole={userRole} 
                    currentUser={currentUser} 
                    onEnroll={onEnrollSkill} 
                    onSaveClass={onSaveSkill} 
                />
            )}

            {activeModule === 'guidance' && (
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="relative group w-full md:w-[28rem]">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400" size={18} />
                            <input
                                type="text"
                                placeholder="Query strategy nodes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0c0c0e] border border-white/5 rounded-[2rem] py-5 pl-14 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30 shadow-inner"
                            />
                        </div>
                        {isTeacher && (
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-10 py-5 bg-violet-600 text-white font-black rounded-[2rem] hover:bg-violet-500 transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest shadow-xl shadow-violet-900/20"
                            >
                                <Plus size={18} /> Deploy Strategy
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                        {filteredGuidance.map(cls => (
                            <div key={cls.id} className="bg-[#0c0c0e] border border-white/5 rounded-[3.5rem] overflow-hidden group hover:border-violet-500/40 transition-all shadow-2xl flex flex-col h-full">
                                <div className="aspect-video relative overflow-hidden">
                                    <img src={cls.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
                                    <div className="absolute top-8 left-8">
                                        <div className="px-4 py-1.5 bg-violet-600/20 backdrop-blur-xl border border-violet-500/30 rounded-xl text-[9px] font-black text-violet-400 uppercase tracking-widest">
                                            {cls.category}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-8 left-8 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                                        <Star size={12} className="text-amber-400 fill-amber-400" />
                                        <span className="text-[10px] font-black text-white">{cls.rating}</span>
                                    </div>
                                </div>

                                <div className="p-10 flex-1 flex flex-col">
                                    <h4 className="text-2xl font-black text-white uppercase font-montserrat tracking-tight leading-tight mb-3">{cls.title}</h4>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Mentor: {cls.instructor}</p>
                                    <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-8 flex-1 line-clamp-3">"{cls.description}"</p>
                                    
                                    <div className="flex gap-4">
                                        {cls.isEnrolled ? (
                                            <button className="flex-1 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
                                                <Play size={16} fill="currentColor" /> Enter Module
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setEnrollingClass(cls)}
                                                className="flex-1 py-5 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-500 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl"
                                            >
                                                <Zap size={16} /> Authorize Uplink (₹{cls.price})
                                            </button>
                                        )}
                                    </div>

                                    {cls.isEnrolled && (
                                        <div className="mt-10 border-t border-white/5 pt-10">
                                            <CourseMaterials notes={cls.notes} dpps={cls.dpps} tests={cls.tests} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isFormOpen && (
                <GuidanceClassFormModal
                    guidanceClass={null}
                    currentUser={currentUser}
                    onClose={() => setIsFormOpen(false)}
                    onSave={onSaveGuidance}
                />
            )}

            {enrollingClass && (
                <GuidanceEnrollmentModal
                    guidanceClass={enrollingClass}
                    onClose={() => setEnrollingClass(null)}
                    onConfirm={(id) => { onEnrollGuidance(id); setEnrollingClass(null); }}
                />
            )}
        </div>
    );
};

export default EducationGuidancePage;