import React, { useState, useEffect, useMemo } from 'react';
import type { 
  Task, UserRole, AssignmentItem, AssignmentSubmission, User as UserType 
} from '../types.ts';
import { CreateAssignmentModal } from './assignments/CreateAssignmentModal.tsx';
import { StudentAssignmentDetailModal } from './assignments/StudentAssignmentDetailModal.tsx';
import { TeacherGradingModal } from './assignments/TeacherGradingModal.tsx';
import { AssignmentReportModal } from './assignments/AssignmentReportModal.tsx';
import { 
  BookOpen, Plus, Calendar, Clock, CheckCircle2, 
  AlertCircle, Users, BarChart2, Search, Filter, 
  FileText, Download, Check, Award, ArrowRight, Bell, Sparkles, Send
} from 'lucide-react';

interface TaskPageProps {
  tasks?: Task[];
  onSave?: (data: Omit<Task, 'id' | 'isCompleted'>, id?: number) => void;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  userRole?: UserRole;
  currentUser?: UserType;
}

const DEFAULT_SAMPLE_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-1',
    teacherId: 't1',
    teacherName: 'Prof. Shourya Patel',
    title: 'Chapter 4: Rotational Dynamics & Inertia Derivations',
    message: 'Complete the numericals on Moment of Inertia for Hollow Cone and Solid Sphere. Show all step-by-step integral derivations and draw free-body diagrams for the rolling without slipping problem.',
    subject: 'Physics',
    targetType: 'batch',
    targetClassOrBatch: 'Class 12th - Target NEET 2026',
    submissionType: 'in_app',
    totalMarks: 50,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days from now
    allowLate: true,
    latePenaltyPerDay: 5,
    maxAttempts: 2,
    status: 'published',
    attachments: [
      { id: 'att-1', name: 'Rotational_Dynamics_Question_Bank.pdf', type: 'pdf', url: 'https://example.com/questions.pdf', size: '2.4 MB' },
      { id: 'att-2', name: 'Formula_Sheet_Derivations.png', type: 'image', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600', size: '1.1 MB' }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'asg-2',
    teacherId: 't2',
    teacherName: 'Dr. R. K. Sharma',
    title: 'Human Physiology & NCERT High-Yield Diagram Labeling',
    message: 'Draw and label the nephron structure and counter-current mechanism in your biology notebook. Write short notes on ADH hormone regulation.',
    subject: 'Biology',
    targetType: 'batch',
    targetClassOrBatch: 'Class 12th - Target NEET 2026',
    submissionType: 'notebook',
    totalMarks: 30,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // 3 days from now
    allowLate: false,
    maxAttempts: 1,
    status: 'published',
    attachments: [
      { id: 'att-3', name: 'Nephron_Anatomy_Guide.pdf', type: 'pdf', url: 'https://example.com/guide.pdf', size: '3.1 MB' }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'asg-3',
    teacherId: 't3',
    teacherName: 'Prof. Priya Verma',
    title: 'Organic Chemistry: Electrophilic Substitution Mechanisms',
    message: 'Solve all exercise problems on Nitration, Halogenation, and Friedel-Crafts Acylation from textbook pages 142 to 148.',
    subject: 'Chemistry',
    targetType: 'all',
    submissionType: 'in_app',
    totalMarks: 40,
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // Ended 6 hrs ago (Late)
    allowLate: true,
    latePenaltyPerDay: 4,
    maxAttempts: 1,
    status: 'published',
    attachments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString()
  }
];

const DEFAULT_SAMPLE_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 's1',
    studentName: 'Shourya Patel',
    status: 'submitted',
    attemptNo: 1,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    textAnswer: 'I have derived the moment of inertia for the hollow cone by taking thin rings of radius r = (h-z)R/h and integrating from 0 to h. Final result: I = 1/2 * M * R^2.',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600'
    ],
    files: [
      { name: 'Shourya_Derivations_Full.pdf', url: 'https://example.com/ans.pdf', size: '2.1 MB' }
    ]
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-1',
    studentId: 's2',
    studentName: 'Aarav Sharma',
    status: 'checked',
    attemptNo: 1,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    photos: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600'
    ],
    files: [],
    marks: 48,
    feedbackText: 'Superb step-by-step calculus integration! Very clean diagrams and formula substitutions.',
    checkedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    checkedBy: 'Prof. Shourya Patel'
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-2',
    studentId: 's1',
    studentName: 'Shourya Patel',
    status: 'notebook_done',
    attemptNo: 1,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    photos: [],
    files: []
  }
];

const TaskPage: React.FC<TaskPageProps> = ({ 
  userRole = 'student', 
  currentUser = { id: 's1', name: 'Shourya Patel', role: 'student', mobileNumber: '+91 98765 43210', imageUrl: '' } 
}) => {
  // Assignments list
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_assignments_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_ASSIGNMENTS;
    } catch {
      return DEFAULT_SAMPLE_ASSIGNMENTS;
    }
  });

  // Submissions list
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_submissions_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_SUBMISSIONS;
    } catch {
      return DEFAULT_SAMPLE_SUBMISSIONS;
    }
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // Student tabs: Pending / Submitted / Checked / Late
  const [studentTab, setStudentTab] = useState<'pending' | 'submitted' | 'checked' | 'late'>('pending');

  // Teacher tabs: Published / Drafts / Closed
  const [teacherTab, setTeacherTab] = useState<'published' | 'drafts' | 'all'>('published');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignmentForDetail, setSelectedAssignmentForDetail] = useState<AssignmentItem | null>(null);
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<AssignmentItem | null>(null);
  const [selectedAssignmentForReport, setSelectedAssignmentForReport] = useState<AssignmentItem | null>(null);

  const isTeacher = userRole === 'teacher';

  // Save new or updated assignment
  const handleSaveAssignment = (newAssignment: AssignmentItem) => {
    const updated = [newAssignment, ...assignments.filter(a => a.id !== newAssignment.id)];
    setAssignments(updated);
    try {
      localStorage.setItem('future_legacy_assignments_v1', JSON.stringify(updated));
    } catch {}
    alert(`🎉 Assignment "${newAssignment.title}" successfully published and students notified!`);
  };

  // Student submits assignment
  const handleStudentSubmit = (assignmentId: string, subData: any) => {
    const existing = submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
    const newSub: AssignmentSubmission = {
      id: existing?.id || `sub-${Date.now()}`,
      assignmentId,
      studentId: currentUser.id,
      studentName: currentUser.name || 'Shourya Patel',
      status: subData.status || 'submitted',
      attemptNo: (existing?.attemptNo || 0) + 1,
      submittedAt: new Date().toISOString(),
      textAnswer: subData.textAnswer,
      linkAnswer: subData.linkAnswer,
      photos: subData.photos || [],
      files: subData.files || [],
      marks: existing?.marks,
      feedbackText: existing?.feedbackText
    };

    const updated = [newSub, ...submissions.filter(s => s.id !== newSub.id)];
    setSubmissions(updated);
    try {
      localStorage.setItem('future_legacy_submissions_v1', JSON.stringify(updated));
    } catch {}
    alert('✅ Assignment submitted successfully to teacher!');
  };

  // Teacher grades a submission
  const handleGradeSubmission = (submissionId: string, gradeData: any) => {
    const updated = submissions.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          marks: gradeData.marks,
          feedbackText: gradeData.feedbackText,
          feedbackVoiceUrl: gradeData.feedbackVoiceUrl,
          annotatedPhotoUrl: gradeData.annotatedPhotoUrl,
          status: gradeData.status as 'checked' | 'redo',
          checkedAt: new Date().toISOString(),
          checkedBy: currentUser.name || 'Faculty Mentor'
        };
      }
      return sub;
    });

    setSubmissions(updated);
    try {
      localStorage.setItem('future_legacy_submissions_v1', JSON.stringify(updated));
    } catch {}
  };

  // Send bulk reminder to unsubmitted students
  const handleSendReminderToUnsubmitted = (studentIds: string[]) => {
    alert(`🔔 Sent automatic push notification reminder to ${studentIds.length} students!`);
  };

  // Filter assignments based on search & subject
  const filteredAssignments = useMemo(() => {
    return assignments.filter(asg => {
      const matchSearch = !searchQuery || asg.title.toLowerCase().includes(searchQuery.toLowerCase()) || asg.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSub = selectedSubject === 'All' || asg.subject === selectedSubject;
      return matchSearch && matchSub;
    });
  }, [assignments, searchQuery, selectedSubject]);

  // Student categorized lists
  const studentCategorized = useMemo(() => {
    const now = new Date().getTime();

    const pending: AssignmentItem[] = [];
    const submitted: AssignmentItem[] = [];
    const checked: AssignmentItem[] = [];
    const late: AssignmentItem[] = [];

    filteredAssignments.forEach(asg => {
      const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);
      const isPastDeadline = new Date(asg.deadline).getTime() < now;

      if (sub?.status === 'checked') {
        checked.push(asg);
      } else if (sub?.status === 'submitted' || sub?.status === 'notebook_done') {
        submitted.push(asg);
      } else if (isPastDeadline) {
        late.push(asg);
      } else {
        pending.push(asg);
      }
    });

    return { pending, submitted, checked, late };
  }, [filteredAssignments, submissions, currentUser.id]);

  // Calculate countdown string
  const getDeadlineBadge = (deadlineStr: string) => {
    const diff = new Date(deadlineStr).getTime() - Date.now();
    if (diff <= 0) return { text: 'Deadline Passed', isLate: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return { text: `${days} din baaki (${days}d left)`, isLate: false };
    return { text: `${hours} ghante baaki (${hours}h left)`, isLate: false };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 text-slate-100">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <BookOpen size={13} />
            <span>Assignments & Academic Evaluation Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase font-montserrat">
            {isTeacher ? 'Teacher Assignment Control' : 'Student Assignments'}
          </h2>
          <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">
            {isTeacher 
              ? 'Create, assign, notify, check answer sheets, draw corrections, award marks, and export report.' 
              : 'Complete your assignments, upload notebook photos/PDF, tap "Maine kar liya", and view marks & feedback.'}
          </p>
        </div>

        {/* Teacher Create Button */}
        {isTeacher ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-blue-500/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Plus size={18} />
              <span>+ Create Assignment</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-xl">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">My Progress</p>
              <p className="text-xl font-black text-white font-mono">
                {studentCategorized.checked.length + studentCategorized.submitted.length} / {assignments.length} Done
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
          </div>
        )}
      </header>

      {/* SEARCH & SUBJECT FILTERS */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search assignments by topic or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Subject:</span>
          {['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics'].map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === sub 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. TEACHER VIEW */}
      {/* ======================================================== */}
      {isTeacher && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Total Assignments</p>
              <p className="text-2xl font-black text-white font-mono">{assignments.length}</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Student Submissions</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{submissions.length}</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Evaluated / Checked</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">
                {submissions.filter(s => s.status === 'checked').length}
              </p>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Needs Checking</p>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {submissions.filter(s => s.status === 'submitted' || s.status === 'notebook_done').length}
              </p>
            </div>
          </div>

          {/* Teacher Assignments Cards Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Created & Published Assignments ({filteredAssignments.length})
            </h3>

            {filteredAssignments.length === 0 ? (
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-12 text-center space-y-3">
                <BookOpen size={40} className="mx-auto text-slate-600" />
                <h4 className="text-base font-bold text-white">No assignments found</h4>
                <p className="text-xs text-slate-400">Click "+ Create Assignment" above to assign work to students.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map(asg => {
                  const asgSubs = submissions.filter(s => s.assignmentId === asg.id);
                  const checkedSubs = asgSubs.filter(s => s.status === 'checked');
                  const countdown = getDeadlineBadge(asg.deadline);

                  return (
                    <div
                      key={asg.id}
                      className="bg-slate-900 border border-white/10 hover:border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
                            {asg.subject}
                          </span>

                          <span className="text-[10px] font-bold text-slate-400">
                            {asg.totalMarks} Marks
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-white leading-snug line-clamp-2">
                            {asg.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {asg.message}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Clock size={12} className={countdown.isLate ? 'text-rose-400' : 'text-amber-400'} />
                            <span className={countdown.isLate ? 'text-rose-400' : 'text-slate-300'}>{countdown.text}</span>
                          </span>
                          <span className="text-[10px] text-indigo-300 font-semibold">{asg.targetClassOrBatch || 'All Students'}</span>
                        </div>

                        {/* Submissions count bar */}
                        <div className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-bold text-slate-300">Submissions</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {asgSubs.length} received ({checkedSubs.length} checked)
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${Math.min(100, asgSubs.length * 15)}%` }} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-3 border-t border-white/5">
                        <button
                          onClick={() => setSelectedAssignmentForGrading(asg)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                        >
                          <CheckCircle2 size={14} />
                          <span>Check & Grade Submissions ({asgSubs.length})</span>
                        </button>

                        <button
                          onClick={() => setSelectedAssignmentForReport(asg)}
                          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <BarChart2 size={14} />
                          <span>View Report & Export CSV</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. STUDENT VIEW */}
      {/* ======================================================== */}
      {!isTeacher && (
        <div className="space-y-6">
          {/* Student Status Tabs (Pending / Submitted / Checked / Late) */}
          <div className="flex gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 max-w-xl text-xs">
            <button
              onClick={() => setStudentTab('pending')}
              className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
                studentTab === 'pending' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({studentCategorized.pending.length})
            </button>

            <button
              onClick={() => setStudentTab('submitted')}
              className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
                studentTab === 'submitted' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Submitted ({studentCategorized.submitted.length})
            </button>

            <button
              onClick={() => setStudentTab('checked')}
              className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
                studentTab === 'checked' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Checked ★ ({studentCategorized.checked.length})
            </button>

            <button
              onClick={() => setStudentTab('late')}
              className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
                studentTab === 'late' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Late ({studentCategorized.late.length})
            </button>
          </div>

          {/* Student Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentCategorized[studentTab].map(asg => {
              const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);
              const countdown = getDeadlineBadge(asg.deadline);

              return (
                <div
                  key={asg.id}
                  className="bg-slate-900 border border-white/10 hover:border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
                        {asg.subject}
                      </span>

                      {/* Marks / Status Pill */}
                      {sub?.status === 'checked' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          Score: {sub.marks} / {asg.totalMarks}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          {asg.totalMarks} Marks
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-black text-white leading-snug line-clamp-2">
                        {asg.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {asg.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock size={12} className={countdown.isLate ? 'text-rose-400' : 'text-amber-400'} />
                        <span className={countdown.isLate ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'}>
                          {countdown.text}
                        </span>
                      </span>
                      <span>Faculty: <strong className="text-slate-200">{asg.teacherName}</strong></span>
                    </div>

                    {/* Show notebook quick hint */}
                    {asg.submissionType === 'notebook' && (
                      <div className="p-2.5 bg-purple-950/30 border border-purple-500/20 rounded-xl text-[11px] text-purple-300 flex items-center gap-2">
                        <span>📓</span>
                        <span>Complete in notebook & show in classroom</span>
                      </div>
                    )}
                  </div>

                  {/* Big Action Button */}
                  <div className="pt-3 border-t border-white/5">
                    {studentTab === 'checked' ? (
                      <button
                        onClick={() => setSelectedAssignmentForDetail(asg)}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
                      >
                        <Award size={15} />
                        <span>View Marks & Teacher Feedback ★</span>
                      </button>
                    ) : sub?.status === 'notebook_done' ? (
                      <div className="w-full py-3 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Check size={14} />
                        <span>Marked Done in Notebook</span>
                      </div>
                    ) : sub?.status === 'submitted' ? (
                      <button
                        onClick={() => setSelectedAssignmentForDetail(asg)}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 size={14} className="text-blue-400" />
                        <span>View Submitted Work / Resubmit</span>
                      </button>
                    ) : asg.submissionType === 'notebook' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedAssignmentForDetail(asg)}
                          className="py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                        >
                          Instructions
                        </button>
                        <button
                          onClick={() => handleStudentSubmit(asg.id, { status: 'notebook_done' })}
                          className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-purple-900/30 cursor-pointer active:scale-95 transition-all"
                        >
                          ✓ Maine Kar Liya
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignmentForDetail(asg)}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                      >
                        <Send size={14} />
                        <span>View Details & Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {studentCategorized[studentTab].length === 0 && (
            <div className="p-12 bg-slate-900 border border-white/5 rounded-3xl text-center space-y-2">
              <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
              <h4 className="text-base font-bold text-white">No assignments in this tab</h4>
              <p className="text-xs text-slate-400">Great job! All caught up.</p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}
      {showCreateModal && (
        <CreateAssignmentModal
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveAssignment}
        />
      )}

      {selectedAssignmentForDetail && (
        <StudentAssignmentDetailModal
          assignment={selectedAssignmentForDetail}
          submission={submissions.find(s => s.assignmentId === selectedAssignmentForDetail.id && s.studentId === currentUser.id)}
          currentUser={currentUser}
          onClose={() => setSelectedAssignmentForDetail(null)}
          onSubmit={(subData) => handleStudentSubmit(selectedAssignmentForDetail.id, subData)}
        />
      )}

      {selectedAssignmentForGrading && (
        <TeacherGradingModal
          assignment={selectedAssignmentForGrading}
          submissions={submissions.filter(s => s.assignmentId === selectedAssignmentForGrading.id)}
          currentUser={currentUser}
          onClose={() => setSelectedAssignmentForGrading(null)}
          onGradeSubmission={handleGradeSubmission}
          onSendReminderToUnsubmitted={handleSendReminderToUnsubmitted}
        />
      )}

      {selectedAssignmentForReport && (
        <AssignmentReportModal
          assignment={selectedAssignmentForReport}
          submissions={submissions.filter(s => s.assignmentId === selectedAssignmentForReport.id)}
          onClose={() => setSelectedAssignmentForReport(null)}
        />
      )}
    </div>
  );
};

export default TaskPage;
