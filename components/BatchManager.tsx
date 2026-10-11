import React, { useState } from 'react';
import { Users, Plus, Shield, BookOpen, Send, Check, Trash2, Search, UserCheck, Lock, Unlock, AlertCircle, Settings } from 'lucide-react';
import { User } from '../types.ts';

interface BatchManagerProps {
  currentUser: User;
  showToast?: (msg: string) => void;
  onBack?: () => void;
}

interface StudentMember {
  id: string;
  name: string;
  email: string;
  enrolledCourse: string;
  status: 'Active' | 'Pending';
}

interface Batch {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  maxCapacity: number;
  assignedCourses: string[];
  students: StudentMember[];
  accessLevel: 'Public' | 'Restricted' | 'Invite-Only';
  announcement?: string;
}

const DEFAULT_BATCHES: Batch[] = [
  {
    id: 'batch-1',
    name: 'NEET Physics Alpha 2026',
    subject: 'Physics',
    schedule: 'Mon, Wed, Fri - 5:00 PM',
    maxCapacity: 50,
    assignedCourses: ['Complete NEET/JEE Physics Masterclass 2026'],
    accessLevel: 'Restricted',
    students: [
      { id: 'st-1', name: 'Aarav Gupta', email: 'aarav@example.com', enrolledCourse: 'Physics Masterclass', status: 'Active' },
      { id: 'st-2', name: 'Sneha Patel', email: 'sneha@example.com', enrolledCourse: 'Physics Masterclass', status: 'Active' },
      { id: 'st-3', name: 'Rohan Verma', email: 'rohan@example.com', enrolledCourse: 'Physics Masterclass', status: 'Active' }
    ],
    announcement: 'Next live doubt session on Electrodynamics is scheduled for Friday at 5 PM.'
  },
  {
    id: 'batch-2',
    name: 'JEE Advanced Mathematics Pro',
    subject: 'Mathematics',
    schedule: 'Tue, Thu, Sat - 6:30 PM',
    maxCapacity: 40,
    assignedCourses: ['Full-Stack Software Engineering & System Design'],
    accessLevel: 'Invite-Only',
    students: [
      { id: 'st-4', name: 'Priya Sharma', email: 'priya@example.com', enrolledCourse: 'System Design', status: 'Active' },
      { id: 'st-5', name: 'Karan Mehta', email: 'karan@example.com', enrolledCourse: 'System Design', status: 'Pending' }
    ],
    announcement: 'Calculus assignment #4 submission deadline extended to Sunday midnight.'
  }
];

const MOCK_ALL_STUDENTS: StudentMember[] = [
  { id: 'st-1', name: 'Aarav Gupta', email: 'aarav@example.com', enrolledCourse: 'Physics Masterclass', status: 'Active' },
  { id: 'st-2', name: 'Sneha Patel', email: 'sneha@example.com', enrolledCourse: 'Physics Masterclass', status: 'Active' },
  { id: 'st-3', name: 'Rohan Verma', email: 'rohan@example.com', enrolledCourse: 'Physics Masterclass', status: 'Active' },
  { id: 'st-4', name: 'Priya Sharma', email: 'priya@example.com', enrolledCourse: 'System Design', status: 'Active' },
  { id: 'st-5', name: 'Karan Mehta', email: 'karan@example.com', enrolledCourse: 'System Design', status: 'Pending' },
  { id: 'st-6', name: 'Divya Iyer', email: 'divya@example.com', enrolledCourse: 'Chemistry Pro', status: 'Active' },
  { id: 'st-7', name: 'Kabir Singh', email: 'kabir@example.com', enrolledCourse: 'NCERT Biology', status: 'Active' }
];

const sanitizeBatch = (b: any): Batch => ({
  id: b?.id || `batch-${Date.now()}`,
  name: b?.name || 'Untitled Batch',
  subject: b?.subject || 'Physics',
  schedule: b?.schedule || 'Flexible Timetable',
  maxCapacity: Number(b?.maxCapacity) || 50,
  assignedCourses: Array.isArray(b?.assignedCourses) ? b.assignedCourses : ['Physics Masterclass'],
  students: Array.isArray(b?.students) ? b.students : [],
  accessLevel: b?.accessLevel || 'Restricted',
  announcement: b?.announcement || ''
});

export const BatchManager: React.FC<BatchManagerProps> = ({ currentUser, showToast, onBack }) => {
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const [batches, setBatches] = useState<Batch[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_batches_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeBatch);
        }
      }
    } catch {}
    return DEFAULT_BATCHES.map(sanitizeBatch);
  });
  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => batches[0]?.id || DEFAULT_BATCHES[0].id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist batches across role switches and sessions
  React.useEffect(() => {
    try {
      localStorage.setItem('future_legacy_batches_v1', JSON.stringify(batches));
    } catch {}
  }, [batches]);

  // New Batch Form State
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchSubject, setNewBatchSubject] = useState('Physics');
  const [newBatchSchedule, setNewBatchSchedule] = useState('Mon, Wed - 4:00 PM');
  const [newBatchCapacity, setNewBatchCapacity] = useState(50);
  const [newBatchAccess, setNewBatchAccess] = useState<'Public' | 'Restricted' | 'Invite-Only'>('Restricted');

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) {
      showToast?.('Please enter a valid batch name.');
      return;
    }

    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      name: newBatchName,
      subject: newBatchSubject,
      schedule: newBatchSchedule,
      maxCapacity: Number(newBatchCapacity),
      assignedCourses: [`${newBatchSubject} Masterclass`],
      students: [],
      accessLevel: newBatchAccess,
      announcement: 'Welcome to the batch! Stay tuned for live class links and updates.'
    };

    setBatches([...batches, newBatch]);
    setSelectedBatchId(newBatch.id);
    setNewBatchName('');
    setShowCreateModal(false);
    showToast?.(`Batch "${newBatch.name}" created successfully!`);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setBatches(batches.map(b => b.id === selectedBatch.id ? { ...b, announcement: announcementText } : b));
    setAnnouncementText('');
    showToast?.(`Broadcast announcement sent to all ${selectedBatch.students.length} students in ${selectedBatch.name}!`);
  };

  const handleAddStudentToBatch = (student: StudentMember) => {
    if (selectedBatch.students.some(s => s.id === student.id)) {
      showToast?.(`${student.name} is already in this batch.`);
      return;
    }

    setBatches(batches.map(b => {
      if (b.id === selectedBatch.id) {
        return { ...b, students: [...b.students, student] };
      }
      return b;
    }));
    showToast?.(`Added ${student.name} to ${selectedBatch.name}!`);
  };

  const handleRemoveStudent = (studentId: string) => {
    setBatches(batches.map(b => {
      if (b.id === selectedBatch.id) {
        return { ...b, students: b.students.filter(s => s.id !== studentId) };
      }
      return b;
    }));
    showToast?.('Student removed from batch.');
  };

  const filteredStudents = MOCK_ALL_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Users size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                {isTeacherOrAdmin ? 'Faculty Batch & Access Manager' : 'Student Batches & Class Timetables (बैचेस और कक्षाएं)'}
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">{batches.length} Active Batches</span>
            </div>
            <h3 className="text-xl font-black font-montserrat text-white mt-1">
              {isTeacherOrAdmin ? 'Student Grouping & Course Access Control' : 'Active Batches, Schedules & Teacher Announcements'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl transition-all cursor-pointer border border-white/10"
            >
              ← Back to Dashboard
            </button>
          )}
          {isTeacherOrAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
            >
              <Plus size={16} /> Create New Batch
            </button>
          )}
        </div>
      </div>

      {/* Student View Information Banner */}
      {!isTeacherOrAdmin && (
        <div className="p-4 bg-purple-950/40 border border-purple-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-purple-200 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Student View Mode • विद्यार्थी दृश्य</p>
              <p className="text-[11px] text-purple-300">You can view all teacher-created batches, subject schedules, and classroom announcements. Batch creation/editing is reserved for faculty.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full font-bold text-[10px] border border-purple-500/30 uppercase tracking-wider shrink-0">
            Read-Only
          </span>
        </div>
      )}

        {/* Batch Selector Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar relative z-10">
          {batches.map((batch) => (
            <button
              key={batch.id}
              onClick={() => setSelectedBatchId(batch.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-3 flex-shrink-0 cursor-pointer border ${
                selectedBatchId === batch.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-xl shadow-purple-600/20'
                  : 'bg-slate-950/60 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users size={16} />
              <div className="text-left">
                <p className="font-bold">{batch.name}</p>
                <p className="text-[10px] opacity-75">{(batch.students || []).length} Students • {batch.subject}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Batch Detailed Management View */}
        {selectedBatch && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            
            {/* Left 2 Cols: Batch Info & Students */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Batch Metadata Card */}
              <div className="bg-slate-950/70 p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">{selectedBatch.subject}</span>
                    <h4 className="text-lg font-black text-white font-montserrat mt-1">{selectedBatch.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Schedule: <span className="text-slate-200 font-semibold">{selectedBatch.schedule}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-xl border ${
                      selectedBatch.accessLevel === 'Public' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      selectedBatch.accessLevel === 'Restricted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {selectedBatch.accessLevel} Access
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-3 py-1 rounded-xl border border-white/10">
                      {(selectedBatch.students || []).length} / {selectedBatch.maxCapacity || 50} Capacity
                    </span>
                  </div>
                </div>

                {/* Assigned Courses & Access Control */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-purple-400" /> Course Access Permissions
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedBatch.assignedCourses.map((c, i) => (
                      <span key={i} className="text-xs font-bold bg-purple-600/20 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <Unlock size={12} className="text-emerald-400" /> {c}
                      </span>
                    ))}
                    {isTeacherOrAdmin && (
                      <button 
                        onClick={() => showToast?.('Course restriction updated.')}
                        className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                      >
                        + Assign Course
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Student List in Batch */}
              <div className="bg-slate-950/70 p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">
                      {isTeacherOrAdmin ? `Enrolled Students (${selectedBatch.students.length})` : `Classmates & Peers (${selectedBatch.students.length})`}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isTeacherOrAdmin ? 'Manage batch members and individual permissions' : 'Verified students enrolled in this curriculum batch'}
                    </p>
                  </div>
                  {isTeacherOrAdmin && (
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus size={14} /> Add Student
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {selectedBatch.students.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">No students added to this batch yet.</div>
                  ) : (
                    selectedBatch.students.map((st) => (
                      <div key={st.id} className="p-3.5 bg-slate-900/90 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">{st.name}</h5>
                            <p className="text-[10px] text-slate-400">{st.email} • Enrolled in {st.enrolledCourse}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                            {st.status}
                          </span>
                          {isTeacherOrAdmin && (
                            <button
                              onClick={() => handleRemoveStudent(st.id)}
                              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                              title="Remove student from batch"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Col: Broadcast Communication & Quick Actions */}
            <div className="space-y-6">
              
              {/* Batch Announcement / Broadcast Card */}
              <div className="bg-slate-950/70 p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Send size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Batch Communication</h4>
                    <p className="text-[11px] text-slate-400">
                      {isTeacherOrAdmin ? 'Broadcast notice to all members' : 'Faculty Notices & Live Session Updates'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Current Pinned Announcement:</p>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Faculty Notice
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed">"{selectedBatch.announcement || 'No active announcements.'}"</p>
                </div>

                {isTeacherOrAdmin ? (
                  <form onSubmit={handleSendAnnouncement} className="space-y-3">
                    <textarea
                      rows={3}
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="Type broadcast message for this batch..."
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send size={14} /> Send Batch Broadcast
                    </button>
                  </form>
                ) : (
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-slate-400 text-xs flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                    <span className="text-[11px] leading-relaxed">Live announcements from your faculty appear here automatically for your classes and tests.</span>
                  </div>
                )}
              </div>

              {/* Quick Batch Stats */}
              <div className="bg-slate-950/70 p-6 rounded-[2rem] border border-white/5 space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Batch Access Control</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-white/5">
                    <span className="text-slate-300">Live Class Access</span>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-white/5">
                    <span className="text-slate-300">Assignment Submissions</span>
                    <span className="text-emerald-400 font-bold">Open</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-white/5">
                    <span className="text-slate-300">Doubt Forum Access</span>
                    <span className="text-emerald-400 font-bold">Unlocked</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Create New Batch Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-purple-500/30 rounded-[2.5rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h4 className="text-lg font-black text-white font-montserrat">Create New Student Batch</h4>
                <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl">✕</button>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Batch Name</label>
                  <input
                    type="text"
                    required
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    placeholder="e.g. NEET Organic Chemistry Batch C"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subject</label>
                    <select
                      value={newBatchSubject}
                      onChange={(e) => setNewBatchSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Max Capacity</label>
                    <input
                      type="number"
                      value={newBatchCapacity}
                      onChange={(e) => setNewBatchCapacity(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Schedule Time</label>
                  <input
                    type="text"
                    value={newBatchSchedule}
                    onChange={(e) => setNewBatchSchedule(e.target.value)}
                    placeholder="e.g. Mon, Wed, Fri - 5:00 PM"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Access Control Policy</label>
                  <select
                    value={newBatchAccess}
                    onChange={(e) => setNewBatchAccess(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    <option value="Restricted">Restricted (Teacher Invite Only)</option>
                    <option value="Public">Public Enrolment</option>
                    <option value="Invite-Only">Invite-Only Secret Batch</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/25 cursor-pointer"
                  >
                    Create Batch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-purple-500/30 rounded-[2.5rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-lg font-black text-white font-montserrat">Add Students to {selectedBatch.name}</h4>
                  <p className="text-xs text-slate-400">Select students from database to enroll</p>
                </div>
                <button onClick={() => setShowAddStudentModal(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl">✕</button>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-4 top-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {filteredStudents.map((st) => {
                  const isAlreadyInBatch = selectedBatch.students.some(s => s.id === st.id);
                  return (
                    <div key={st.id} className="p-3.5 bg-slate-950/80 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-purple-400 font-bold text-xs flex items-center justify-center">
                          {st.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{st.name}</h5>
                          <p className="text-[10px] text-slate-400">{st.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddStudentToBatch(st)}
                        disabled={isAlreadyInBatch}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                          isAlreadyInBatch
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md cursor-pointer'
                        }`}
                      >
                        {isAlreadyInBatch ? <Check size={14} /> : <Plus size={14} />}
                        {isAlreadyInBatch ? 'Enrolled' : 'Add to Batch'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
};
