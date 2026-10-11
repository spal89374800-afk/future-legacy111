import React, { useState } from 'react';
import type { TeacherEducationProfile, CourseChapter, LiveClass, SkillClass, GuidanceClass } from '../types.ts';
import { getTeacherProfile, DEFAULT_COURSE_SYLLABUS } from './teacherData.ts';
import { 
  X, GraduationCap, Award, BookOpen, Clock, Users, Star, 
  CheckCircle2, ShieldCheck, FileText, ChevronRight, Sparkles, 
  Building2, Landmark, Trophy, MessageSquare, Play, Download,
  BadgeCheck, Compass, School, Briefcase, Share2
} from 'lucide-react';

interface CourseAndTeacherModalProps {
  courseData?: LiveClass | SkillClass | GuidanceClass | null;
  teacherProfile?: TeacherEducationProfile | null;
  instructorName?: string;
  onClose: () => void;
  onJoinClass?: () => void;
  onOpenChatWithTeacher?: (teacherName: string) => void;
  initialTab?: 'teacher' | 'course';
}

export const CourseAndTeacherModal: React.FC<CourseAndTeacherModalProps> = ({
  courseData,
  teacherProfile: propTeacherProfile,
  instructorName: propInstructorName,
  onClose,
  onJoinClass,
  onOpenChatWithTeacher,
  initialTab = 'teacher'
}) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'course'>(initialTab);

  const instructorName = propInstructorName || (courseData as any)?.instructor || 'Dr. Alex Sterling';
  const profile: TeacherEducationProfile = propTeacherProfile || getTeacherProfile(instructorName);
  const syllabus: CourseChapter[] = (courseData as any)?.syllabus || DEFAULT_COURSE_SYLLABUS;

  const courseTitle = (courseData as any)?.title || 'Comprehensive Concept & Exam Mastery Masterclass';
  const courseDesc = (courseData as any)?.description || profile.bio;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div 
        className="bg-[#0b0f19] border border-white/15 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-white/10 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 flex-shrink-0 shadow-inner">
              <GraduationCap size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck size={11} /> Verified Educator Dossier
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{profile.certificateNumber}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight truncate font-montserrat">
                {courseTitle}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-95"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* TABS SWITCHER */}
        <div className="flex border-b border-white/10 bg-slate-950/60 px-4 sm:px-8 gap-4 sm:gap-8 flex-shrink-0">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`py-3.5 sm:py-4 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'teacher'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap size={16} className={activeTab === 'teacher' ? 'text-indigo-400' : ''} />
            <span>👨‍🏫 Teacher Qualifications & Degrees</span>
          </button>

          <button
            onClick={() => setActiveTab('course')}
            className={`py-3.5 sm:py-4 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'course'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={16} className={activeTab === 'course' ? 'text-blue-400' : ''} />
            <span>📖 Complete Course Syllabus</span>
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 custom-scrollbar">
          {activeTab === 'teacher' ? (
            /* TEACHER PROFILE & COMPLETE DEGREES DOSSIER */
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Profile Hero Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-black border border-indigo-500/30 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none"></div>

                <div className="relative flex-shrink-0">
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.fullName} 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-indigo-400/40 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-slate-950 rounded-xl shadow-lg border border-white/20" title="UGC & Institution Verified">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight">
                      {profile.fullName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      {profile.highestDegree}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-indigo-200/90 leading-snug">
                    {profile.designation}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-1 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-white/5">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-white">{profile.rating}</span>
                      <span className="text-[10px] text-slate-400">({profile.totalReviews} reviews)</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-white/5">
                      <Briefcase size={14} className="text-blue-400" />
                      <span className="font-bold text-white">{profile.totalTeachingExperience}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-white/5">
                      <Users size={14} className="text-purple-400" />
                      <span className="font-bold text-white">{profile.studentsMentoredCount}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-2">
                    {profile.bio}
                  </p>
                </div>
              </div>

              {/* HIGHER EDUCATION & DEGREES HIGHLIGHT BANNER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Total Academic Education</span>
                    <span className="text-sm sm:text-base font-black text-white">{profile.totalHigherEducationYears}</span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Verification Status</span>
                  <span className="text-xs font-bold text-slate-200">{profile.verificationBadge}</span>
                </div>
              </div>

              {/* COMPLETE ACADEMIC DEGREES (DETAILED BREAKDOWN) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Landmark size={18} className="text-indigo-400" />
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-montserrat">
                    All Earned Degrees & University Credentials
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.degrees.map((deg, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-black text-xs">
                            0{idx + 1}
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-white font-montserrat leading-tight">{deg.degreeName}</h5>
                            <span className="text-[10px] text-indigo-300 font-semibold">{deg.fieldOfStudy}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                          {deg.graduationYear}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Building2 size={13} className="text-blue-400 flex-shrink-0" />
                          <span className="font-medium text-[11px] truncate">{deg.institution}</span>
                        </div>

                        {deg.scoreOrHonors && (
                          <div className="flex items-center gap-2 text-amber-300">
                            <Trophy size={13} className="text-amber-400 flex-shrink-0" />
                            <span className="font-bold text-[11px]">{deg.scoreOrHonors}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 size={12} /> University Certified Degree
                        </span>
                        <span className="text-slate-500 font-mono">Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPETITIVE EXAMS & ALL INDIA RANKS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-amber-400" />
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-montserrat">
                    National Competitive Exam Ranks & Honors
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.competitiveExamsCracked.map((exam, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-xs font-bold text-amber-200"
                    >
                      <Award size={18} className="text-amber-400 flex-shrink-0" />
                      <span>{exam}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* INSTITUTES TAUGHT AT & CAREER EXPERIENCES */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-400" />
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-montserrat">
                    Teaching Career & Premier Institutes Taught At
                  </h4>
                </div>

                <div className="space-y-2">
                  {profile.institutesTaughtAt.map((inst, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-3 text-xs text-slate-200"
                    >
                      <School size={16} className="text-indigo-400 flex-shrink-0" />
                      <span className="font-semibold">{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CORE SPECIALIZATION TOPICS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-400" />
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-montserrat">
                    Key Subject Specializations
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map((spec, idx) => (
                    <span 
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-400/30"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* RESEARCH PAPERS & PUBLICATIONS */}
              {profile.researchPublications && profile.researchPublications.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-cyan-400" />
                    <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-montserrat">
                      Research Papers & Academic Publications
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {profile.researchPublications.map((pub, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex items-start gap-3 text-xs text-cyan-200"
                      >
                        <FileText size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{pub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STUDENT SUCCESS METRICS */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block">Proven Track Record</span>
                  <p className="text-sm sm:text-base font-black text-white font-montserrat">
                    {profile.selectionCount}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-bold">Languages:</span>
                  <span className="text-white font-mono">{profile.languages.join(' • ')}</span>
                </div>
              </div>
            </div>
          ) : (
            /* COMPLETE COURSE SYLLABUS & CHAPTER BREAKDOWN */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Comprehensive Curriculum
                  </span>
                  <span className="text-xs text-slate-400">• Complete Syllabus with DPP & Notes</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-montserrat">{courseTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{courseDesc}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-center">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Instructor</span>
                    <span className="text-xs font-black text-indigo-300">{profile.fullName.split(',')[0]}</span>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Modules</span>
                    <span className="text-xs font-black text-white">{syllabus.length} Chapters</span>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Digital Notes</span>
                    <span className="text-xs font-black text-emerald-400">Included (PDF)</span>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">DPPs & Tests</span>
                    <span className="text-xs font-black text-amber-400">Available</span>
                  </div>
                </div>
              </div>

              {/* CHAPTERS ACCORDION LIST */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                  Chapter-Wise Academic Roadmap
                </h4>

                <div className="space-y-3">
                  {syllabus.map((ch, idx) => (
                    <div 
                      key={ch.id || idx}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-blue-500/40 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-black text-xs">
                            {idx + 1}
                          </div>
                          <h5 className="font-bold text-sm text-white font-montserrat">{ch.title}</h5>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 self-start sm:self-auto">
                          <Clock size={12} className="text-blue-400" />
                          <span>{ch.duration}</span>
                        </span>
                      </div>

                      <div className="pl-11 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Concepts Covered:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ch.topics.map((t, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pl-11 pt-2 flex items-center gap-3 border-t border-white/5">
                        {ch.hasNotes && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <FileText size={11} /> Handwritten Notes Ready
                          </span>
                        )}
                        {ch.hasDPP && (
                          <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                            <Award size={11} /> Practice DPP Attached
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {onOpenChatWithTeacher && (
              <button
                onClick={() => onOpenChatWithTeacher(profile.fullName)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/10 transition-all cursor-pointer active:scale-95"
              >
                <MessageSquare size={14} className="text-indigo-400" />
                <span>Ask Doubt to {profile.fullName.split(' ')[0]}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Back
            </button>

            {onJoinClass && (
              <button
                onClick={() => {
                  onClose();
                  onJoinClass();
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-white/20"
              >
                <Play size={14} fill="currentColor" />
                <span>Join Classroom Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAndTeacherModal;
