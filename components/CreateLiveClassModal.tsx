import React, { useState } from 'react';
import { 
  X, Video, Calendar, Clock, BookOpen, User, 
  CheckCircle2, Radio, MessageSquare, Hand, ScreenShare, 
  FileText, BarChart2, Bell, Users, Plus, Upload, Loader2, Sparkles 
} from 'lucide-react';
import { User as UserType } from '../types.ts';

interface CreateLiveClassModalProps {
  onClose: () => void;
  onSave: (data: { 
    title: string; 
    instructor: string;
    subject?: string;
    startTime?: string;
    duration?: string;
    description?: string;
    price?: number;
    hasRecording?: boolean;
    hasPolls?: boolean;
    hasWhiteboard?: boolean;
    hasChat?: boolean;
    hasHandRaise?: boolean;
    hasAttendance?: boolean;
    notesFileName?: string;
  }) => void;
  currentUser: UserType;
}

const CreateLiveClassModal: React.FC<CreateLiveClassModalProps> = ({ 
  onClose, 
  onSave, 
  currentUser 
}) => {
  // Required MVP fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('17:00');
  const [duration, setDuration] = useState('90 Mins');
  const [instructor, setInstructor] = useState(currentUser.name || 'Faculty Mentor');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  // Features to enable for this class
  const [enableChat, setEnableChat] = useState(true);
  const [enableHandRaise, setEnableHandRaise] = useState(true);
  const [enableRecording, setEnableRecording] = useState(true);
  const [enableAttendance, setEnableAttendance] = useState(true);
  const [enablePolls, setEnablePolls] = useState(true);
  const [enableWhiteboard, setEnableWhiteboard] = useState(true);
  const [enableReminder, setEnableReminder] = useState(true);

  // Lecture notes / PDF attachment
  const [notesFileName, setNotesFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNotesFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    // Combine date and time
    const startDateTime = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();

    const classData = {
      title: title.trim(),
      instructor: instructor.trim() || currentUser.name,
      subject,
      startTime: startDateTime,
      duration,
      description: description.trim() || `Live masterclass covering core concepts and derivations in ${subject}.`,
      price: Number(price) || 0,
      hasChat: enableChat,
      hasHandRaise: enableHandRaise,
      hasRecording: enableRecording,
      hasAttendance: enableAttendance,
      hasPolls: enablePolls,
      hasWhiteboard: enableWhiteboard,
      notesFileName: notesFileName || undefined
    };

    // Simulated short save
    await new Promise(res => setTimeout(res, 600));
    onSave(classData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl my-8 overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Video size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                Teacher Live Scheduling
              </span>
              <h3 className="text-xl font-black text-white font-montserrat uppercase tracking-tight mt-1">
                Schedule New Live Masterclass
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* 1. Schedule & Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} />
              <span>1. Class Schedule & Subject Details</span>
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                Class Title *
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete Optics & Derivations (Target NEET/JEE 2026)"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="General Science">General Science</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                  Faculty / Teacher Name
                </label>
                <input 
                  type="text" 
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            {/* Date, Time, Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                  Schedule Date
                </label>
                <input 
                  type="date" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                  Start Time
                </label>
                <input 
                  type="time" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="45 Mins">45 Mins</option>
                  <option value="60 Mins">60 Mins (1 Hour)</option>
                  <option value="90 Mins">90 Mins (1.5 Hours)</option>
                  <option value="120 Mins">120 Mins (2 Hours)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                Session Description & Topics Covered
              </label>
              <textarea 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What derivations, formulas, or problem sets will be covered in this live session..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>
          </div>

          {/* 2. Interactive Features Checklist (All features requested by user) */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} />
              <span>2. Class Features & Student Controls</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={enableChat}
                  onChange={(e) => setEnableChat(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-blue-400" />
                    <span>Live Doubts Chat</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Students ask doubts during stream</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={enableHandRaise}
                  onChange={(e) => setEnableHandRaise(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Hand size={13} className="text-amber-400" />
                    <span>Student Hand Raise</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Teacher can grant speaking access</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={enableRecording}
                  onChange={(e) => setEnableRecording(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Radio size={13} className="text-rose-400" />
                    <span>Class Recording</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Save replay for students to watch later</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={enableAttendance}
                  onChange={(e) => setEnableAttendance(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users size={13} className="text-emerald-400" />
                    <span>Attendance Tracking</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Track attendees & export CSV</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={enablePolls}
                  onChange={(e) => setEnablePolls(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart2 size={13} className="text-amber-400" />
                    <span>In-Class Polls & Quizzes</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Real-time voting & concept checks</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-white/5 cursor-pointer hover:border-white/15">
                <input
                  type="checkbox"
                  checked={enableReminder}
                  onChange={(e) => setEnableReminder(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell size={13} className="text-yellow-400" />
                    <span>15-Min Reminder Alert</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Notify students 10-15 min pehle</p>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Attach Lecture PDF / Notes */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} />
              <span>3. Attach Lecture Notes or Handout (PDF)</span>
            </h4>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-dashed border-white/20 hover:border-purple-500 cursor-pointer transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate max-w-xs">
                    {notesFileName || 'Choose PDF File from Computer'}
                  </p>
                  <p className="text-[10px] text-slate-400">Formula sheet, slides, or question paper</p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] uppercase rounded-xl">
                Browse
              </span>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-rose-900/40 cursor-pointer active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Scheduling Broadcast...</span>
                </>
              ) : (
                <>
                  <Video size={16} />
                  <span>Publish & Schedule Live Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLiveClassModal;
