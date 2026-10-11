import React, { useState, useEffect, useRef } from 'react';
import type { 
  LiveClass, User, LiveClassParticipant, LiveChatMessage, 
  WhiteboardPage, WhiteboardElement, LivePoll, SharedNote, LiveClassRecordingItem 
} from '../types.ts';
import Whiteboard from './Whiteboard.tsx';
import TeacherLiveControls from './TeacherLiveControls.tsx';
import PostClassSummaryModal from './PostClassSummaryModal.tsx';
import CourseAndTeacherModal from './CourseAndTeacherModal.tsx';
import PaymentModal from './PaymentModal.tsx';
import { AttendanceTracker } from './AttendanceTracker.tsx';
import { getTeacherProfile } from './teacherData.ts';
import { 
  Menu, X, Video, VideoOff, Mic, MicOff, ShieldAlert,
  ChevronLeft, ChevronRight, Plus, Settings, User as UserIcon, 
  Hand, HandMetal, Send, GraduationCap, BookOpen, BadgeCheck, 
  Star, Lock, CreditCard, Radio, ScreenShare, Monitor, 
  BarChart2, FileText, Download, Users, CheckCircle2, 
  AlertCircle, Volume2, VolumeX, Trash2, HelpCircle
} from 'lucide-react';

interface LiveClassViewProps {
  classData: LiveClass;
  currentUser: User;
  userClassRole: 'teacher' | 'student';
  participants: User[]; 
  onExit: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onEnrollAndPay?: (cls: LiveClass) => void;
}

export const LiveClassView: React.FC<LiveClassViewProps> = ({ 
  classData, 
  currentUser, 
  userClassRole, 
  participants: initialParticipants, 
  onExit, 
  showToast, 
  onEnrollAndPay 
}) => {
  const [currentClass, setCurrentClass] = useState<LiveClass>(classData);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    setCurrentClass(classData);
  }, [classData]);

  const isEnrolled = userClassRole === 'teacher' || Boolean(currentClass.isEnrolled);

  // If not enrolled, block non-teacher students with payment wall
  if (!isEnrolled) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="bg-slate-900 border border-rose-500/30 rounded-[2.5rem] p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1.5">
              <ShieldAlert size={12} /> Live Room Locked • Enrollment Required
            </span>
            <h3 className="text-2xl font-black text-white font-montserrat uppercase tracking-tight">
              {currentClass.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This synchronized live classroom by <strong className="text-white">{currentClass.instructor}</strong> is restricted to enrolled students.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-2xl border border-white/5 flex items-center justify-between text-left">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Access Pass</p>
              <p className="text-xl font-black text-emerald-400 font-mono">₹{currentClass.price || 499}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">One-Time Live Classroom Access</span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                if (onEnrollAndPay) onEnrollAndPay(currentClass);
                else setShowPaymentModal(true);
              }}
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-rose-900/40 cursor-pointer active:scale-95 transition-all"
            >
              Pay & Enroll (₹{currentClass.price || 499}) to Enter
            </button>
            <button
              onClick={onExit}
              className="w-full py-3 bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Back to All Classes
            </button>
          </div>
        </div>

        {showPaymentModal && (
          <PaymentModal
            itemName={`Live Class Pass: ${currentClass.title}`}
            amount={currentClass.price || 499}
            category="Live Class Access"
            onClose={() => setShowPaymentModal(false)}
            onPaymentSuccess={() => {
              setCurrentClass({ ...currentClass, isEnrolled: true });
              setShowPaymentModal(false);
              showToast(`🎉 Enrolled in "${currentClass.title}". Entering live room...`, 'success');
            }}
          />
        )}
      </div>
    );
  }

  // Whiteboard state
  const [whiteboardPages, setWhiteboardPages] = useState<WhiteboardPage[]>([{ id: 'page-1', elements: [] }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [history, setHistory] = useState<WhiteboardElement[][]>([[]]);
  const [redoHistory, setRedoHistory] = useState<WhiteboardElement[][]>([[]]); 
  const [activeTool, setActiveTool] = useState<'select' | 'pen' | 'highlighter' | 'eraser' | 'text'>('pen');
  const [strokeColor, setStrokeColor] = useState('#3B82F6');
  const [strokeWidth, setStrokeWidth] = useState(4);

  // View mode: Whiteboard vs Screen Share vs Video Feed
  const [viewMode, setViewMode] = useState<'whiteboard' | 'screenshare'>('whiteboard');

  // Live stream controls (Video + Audio)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'chat' | 'people' | 'notes' | 'polls'>('chat');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [handRaisedNotification, setHandRaisedNotification] = useState<string | null>(null);

  // Class recording state (jo students baad me dekh sakein)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Chat & doubts
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    { id: '1', senderName: classData.instructor, senderRole: 'teacher', text: `Welcome all students! Today we are covering high-yield derivations in ${classData.title}. Feel free to drop doubts in this channel.`, timestamp: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isDoubtOnlyFilter, setIsDoubtOnlyFilter] = useState(false);
  const [markAsDoubtChecked, setMarkAsDoubtChecked] = useState(false);

  // Participants & attendance
  const [liveParticipants, setLiveParticipants] = useState<LiveClassParticipant[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Polls state
  const [activePoll, setActivePoll] = useState<LivePoll | null>({
    id: 'poll-1',
    question: 'Concept Check: What is the SI unit of Magnetic Flux?',
    options: [
      { text: 'Weber (Wb)', votes: 8 },
      { text: 'Tesla (T)', votes: 2 },
      { text: 'Henry (H)', votes: 1 },
      { text: 'Gauss (G)', votes: 0 }
    ],
    totalVotes: 11,
    active: true,
    correctOptionIndex: 0,
    createdAt: 'Just now'
  });
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '', '', '']);
  const [newPollCorrectIndex, setNewPollCorrectIndex] = useState(0);

  // Notes/PDF share state
  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>([
    { id: 'sn-1', title: 'Chapter Derivation Handout & Formula Sheet (PDF)', fileSize: '3.2 MB', fileName: 'Class-Handout.pdf', uploadedBy: classData.instructor, timestamp: '10 mins ago' }
  ]);
  const [showShareNoteModal, setShowShareNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  // Modals
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const teacherProfile = getTeacherProfile(classData.instructor);
  const intervalRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Initialize participants
  useEffect(() => {
    const initialList: LiveClassParticipant[] = [
      {
        id: currentUser.id,
        name: currentUser.name || (userClassRole === 'teacher' ? 'Prof. Shourya Patel' : 'Shourya Patel'),
        imageUrl: currentUser.imageUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User',
        mobileNumber: currentUser.mobileNumber || '+91 98765 43210',
        role: userClassRole,
        isMuted: false,
        isCameraOn: true,
        handRaised: false,
        joinedAt: '04:00 PM'
      },
      ...initialParticipants.slice(0, 8).map((p, idx) => ({
        ...p,
        isMuted: true,
        isCameraOn: idx % 2 === 0,
        handRaised: false,
        role: (p.role || 'student') as 'teacher' | 'student',
        joinedAt: `04:0${idx + 2} PM`
      }))
    ];
    setLiveParticipants(initialList);

    intervalRef.current = window.setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, [currentUser, userClassRole]);

  // Handle Recording duration
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, [isRecording]);

  // Whiteboard logic
  const currentWhiteboardPage = whiteboardPages[currentPageIndex];
  const canUndo = history.length > 1;
  const canRedo = redoHistory.length > 0;

  const handleElementsUpdate = (newElements: WhiteboardElement[]) => {
    setWhiteboardPages(prev => prev.map((page, idx) => 
      idx === currentPageIndex ? { ...page, elements: newElements } : page
    ));
    setHistory(prev => [...prev, newElements]);
    setRedoHistory([]);
  };

  const handleUndo = () => {
    if (!canUndo) return;
    const lastElements = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const prevElements = newHistory[newHistory.length - 1] || [];
    setRedoHistory(prev => [lastElements, ...prev]);
    setHistory(newHistory);
    setWhiteboardPages(prev => prev.map((page, idx) => 
      idx === currentPageIndex ? { ...page, elements: prevElements } : page
    ));
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const [nextElements, ...restRedo] = redoHistory;
    setHistory(prev => [...prev, nextElements]);
    setRedoHistory(restRedo);
    setWhiteboardPages(prev => prev.map((page, idx) => 
      idx === currentPageIndex ? { ...page, elements: nextElements } : page
    ));
  };

  const handleClearPage = () => {
    setHistory(prev => [...prev, []]);
    setRedoHistory([]);
    setWhiteboardPages(prev => prev.map((page, idx) => 
      idx === currentPageIndex ? { ...page, elements: [] } : page
    ));
  };

  const handleAddPage = () => {
    setWhiteboardPages(prev => [...prev, { id: `page-${Date.now()}`, elements: [] }]);
    setCurrentPageIndex(whiteboardPages.length);
    setHistory([[]]);
    setRedoHistory([]);
  };

  // Chat message sending
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;
    const newMsg: LiveChatMessage = {
      id: Date.now().toString(),
      senderName: currentUser.name || (userClassRole === 'teacher' ? 'Faculty' : 'Student'),
      senderRole: userClassRole,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoubt: markAsDoubtChecked,
      isSolved: false
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setMarkAsDoubtChecked(false);
  };

  const handleMarkDoubtSolved = (msgId: string) => {
    setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, isSolved: true } : m));
    showToast('✓ Doubt marked as answered by faculty!', 'success');
  };

  // Mute / Unmute & Hand Raise
  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      showToast(next ? 'Microphone Muted' : 'Microphone Unmuted & Live', 'success');
      return next;
    });
  };

  const toggleCamera = () => {
    setIsCameraOn(prev => {
      const next = !prev;
      showToast(next ? 'Webcam Camera Active' : 'Camera Feed Turned Off', 'success');
      return next;
    });
  };

  const toggleHandRaise = () => {
    const next = !handRaised;
    setHandRaised(next);
    if (next) {
      showToast('✋ Hand Raised! Faculty has been notified to give you mic access.', 'success');
      setLiveParticipants(prev => prev.map(p => p.id === currentUser.id ? { ...p, handRaised: true } : p));
    } else {
      setLiveParticipants(prev => prev.map(p => p.id === currentUser.id ? { ...p, handRaised: false } : p));
    }
  };

  // Teacher Controls: Mute All & Remove Student
  const handleMuteAll = () => {
    setLiveParticipants(prev => prev.map(p => p.role === 'student' ? { ...p, isMuted: true } : p));
    showToast('🔇 All student microphones have been muted by faculty.', 'success');
  };

  const handleToggleStudentMute = (studentId: string) => {
    setLiveParticipants(prev => prev.map(p => {
      if (p.id === studentId) {
        const nextMuted = !p.isMuted;
        showToast(`${p.name} ${nextMuted ? 'muted' : 'unmuted and given mic access'}.`, 'success');
        return { ...p, isMuted: nextMuted, handRaised: false };
      }
      return p;
    }));
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${studentName}" from the live classroom?`)) return;
    setLiveParticipants(prev => prev.filter(p => p.id !== studentId));
    showToast(`🚫 ${studentName} was removed from the live session.`, 'error');
  };

  // Class Recording Toggle (jo students baad me dekh sakein)
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      showToast('⏺️ Live Class Recording Started! Session is being archived in HD.', 'success');
    } else {
      setIsRecording(false);
      // Save recording to localStorage
      saveRecordingArchive();
      showToast('⏹️ Recording stopped & saved to Class Recordings Archive!', 'success');
    }
  };

  const saveRecordingArchive = () => {
    const newRec: LiveClassRecordingItem = {
      id: `rec-${Date.now()}`,
      classId: classData.id,
      title: classData.title,
      instructor: classData.instructor,
      subject: classData.subject || 'Live Masterclass',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      duration: formatTime(recordingSeconds || elapsedTime),
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      chatHistory: chatMessages,
      notes: sharedNotes,
      attendanceCount: liveParticipants.length
    };

    try {
      const existing = localStorage.getItem('future_legacy_class_recordings');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('future_legacy_class_recordings', JSON.stringify([newRec, ...parsed]));
    } catch {}
  };

  // Attendance CSV Export
  const handleExportAttendance = () => {
    const csvHeader = 'Name,Role,Status,Join Time\n';
    const csvRows = liveParticipants.map(p => `"${p.name}","${p.role}","PRESENT","${p.joinedAt || '04:00 PM'}"`).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attendance-${classData.title.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('📥 Attendance CSV exported successfully!', 'success');
  };

  // Live Poll Vote
  const handleVotePoll = (optionIndex: number) => {
    if (!activePoll || activePoll.userVoteIndex !== undefined) return;
    const updatedOptions = activePoll.options.map((opt, idx) => {
      if (idx === optionIndex) return { ...opt, votes: opt.votes + 1 };
      return opt;
    });
    setActivePoll({
      ...activePoll,
      options: updatedOptions,
      totalVotes: activePoll.totalVotes + 1,
      userVoteIndex: optionIndex
    });
    showToast('✓ Your answer submitted to the live poll!', 'success');
  };

  // Create Poll Submit
  const handleCreatePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion.trim()) return;
    const validOptions = newPollOptions.filter(o => o.trim().length > 0);
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options.');
      return;
    }
    const created: LivePoll = {
      id: `poll-${Date.now()}`,
      question: newPollQuestion.trim(),
      options: validOptions.map(t => ({ text: t.trim(), votes: 0 })),
      totalVotes: 0,
      active: true,
      correctOptionIndex: newPollCorrectIndex,
      createdAt: 'Just now'
    };
    setActivePoll(created);
    setShowCreatePollModal(false);
    setNewPollQuestion('');
    setNewPollOptions(['', '', '', '']);
    showToast('📊 Live Poll Launched to all students in room!', 'success');
  };

  // Share Note Submit
  const handleShareNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const newNote: SharedNote = {
      id: `sn-${Date.now()}`,
      title: newNoteTitle.trim(),
      fileSize: '2.8 MB',
      fileName: `${newNoteTitle.trim().replace(/\s+/g, '_')}.pdf`,
      uploadedBy: currentUser.name || (userClassRole === 'teacher' ? 'Faculty' : 'Student'),
      timestamp: 'Just now'
    };
    setSharedNotes(prev => [newNote, ...prev]);
    setShowShareNoteModal(false);
    setNewNoteTitle('');
    showToast('📑 Chapter PDF note shared with everyone in live room!', 'success');
  };

  const handleExitClass = () => {
    if (isRecording) {
      saveRecordingArchive();
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShowSummaryModal(true);
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      {/* Teacher Drawing Tools Sidebar */}
      {userClassRole === 'teacher' && viewMode === 'whiteboard' && (
        <TeacherLiveControls 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          strokeColor={strokeColor}
          setStrokeColor={setStrokeColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearPage={handleClearPage}
          canUndo={canUndo}
          canRedo={canRedo}
          participants={liveParticipants}
          chatMessages={chatMessages}
          currentUser={currentUser}
          onSendMessage={(msg) => setChatMessages(prev => [...prev, msg])}
        />
      )}

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Top Header Bar */}
        <header className="h-20 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 z-20 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 bg-slate-800 border border-white/10 rounded-xl hover:bg-slate-700 transition-all flex-shrink-0 cursor-pointer"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h1 className="text-xs sm:text-base font-black text-white tracking-tight truncate font-montserrat uppercase">
                  {classData.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="font-bold text-slate-300">{classData.instructor}</span>
                <span>•</span>
                <span className="font-mono text-emerald-400 font-bold">{formatTime(elapsedTime)}</span>
                {isRecording && (
                  <span className="flex items-center gap-1 font-mono text-rose-400 font-bold bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/40 animate-pulse">
                    <Radio size={11} /> REC {formatTime(recordingSeconds)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick View Controls: Whiteboard vs Screen Share */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode('whiteboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'whiteboard' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Whiteboard</span>
            </button>
            <button
              onClick={() => setViewMode('screenshare')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'screenshare' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ScreenShare size={14} />
              <span>Screen Share</span>
            </button>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Class Recording Toggle (Teacher only) */}
            {userClassRole === 'teacher' && (
              <button
                onClick={toggleRecording}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow transition-all ${
                  isRecording 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                }`}
                title="Record class for students to watch later"
              >
                <Radio size={14} />
                <span className="hidden sm:inline">{isRecording ? 'Stop Recording' : 'Record Class'}</span>
              </button>
            )}

            {/* Mic Toggle */}
            <button 
              onClick={toggleMute} 
              className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                isMuted ? 'bg-rose-600/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Camera Toggle */}
            <button 
              onClick={toggleCamera} 
              className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                isCameraOn ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-600/20 text-rose-400 border border-rose-500/40'
              }`}
              title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>

            {/* Hand Raise (Students) */}
            {userClassRole === 'student' && (
              <button 
                onClick={toggleHandRaise} 
                className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                  handRaised ? 'bg-amber-600 text-white animate-bounce shadow-lg shadow-amber-900/50' : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
                }`}
                title="Raise Hand to ask doubt"
              >
                {handRaised ? <HandMetal size={18} /> : <Hand size={18} />}
              </button>
            )}

            {/* Leave / End Class */}
            <button 
              onClick={handleExitClass} 
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all uppercase text-[11px] tracking-wider shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              <span>Leave</span>
            </button>
          </div>
        </header>

        {/* Hand Raised Notification Banner (For Teacher) */}
        {userClassRole === 'teacher' && liveParticipants.some(p => p.handRaised) && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-300 animate-in slide-in-from-top duration-300 z-10">
            <div className="flex items-center gap-2 font-bold">
              <Hand size={16} className="animate-bounce text-amber-400" />
              <span>
                {liveParticipants.filter(p => p.handRaised).map(p => p.name).join(', ')} raised hand to ask doubt!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const raised = liveParticipants.find(p => p.handRaised);
                  if (raised) handleToggleStudentMute(raised.id);
                }}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Allow to Speak
              </button>
              <button
                onClick={() => setLiveParticipants(prev => prev.map(p => ({ ...p, handRaised: false })))}
                className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Main Viewport */}
        <main className="flex-1 flex min-h-0 bg-slate-950">
          <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 min-w-0">
            {viewMode === 'whiteboard' ? (
              /* Whiteboard Mode */
              <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl flex flex-col">
                <Whiteboard 
                  elements={currentWhiteboardPage.elements}
                  onElementsUpdate={handleElementsUpdate}
                  activeTool={activeTool}
                  strokeColor={strokeColor}
                  strokeWidth={strokeWidth}
                  isTeacher={userClassRole === 'teacher'}
                />

                {/* Floating camera PiP of faculty */}
                {isCameraOn && (
                  <div className="absolute top-4 right-4 w-44 sm:w-52 aspect-video bg-black rounded-2xl overflow-hidden border-2 border-indigo-500/60 shadow-2xl z-30 group">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" 
                      alt="Camera Feed" 
                      className="w-full h-full object-cover opacity-80" 
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{classData.instructor}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Screen Share Mode */
              <div className="w-full h-full relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-950 flex flex-col shadow-2xl p-6 items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 animate-pulse">
                  <Monitor size={40} />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Faculty Screen Broadcast Active</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sharing high-yield NCERT presentation slides, diagram animations, and PYQ formula sheets with all students.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('whiteboard')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Switch Back to Whiteboard
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Chat / Doubts / People / Notes / Polls */}
          {isSidebarOpen && (
            <div className="w-80 sm:w-96 bg-slate-900 border-l border-white/10 flex-shrink-0 flex flex-col h-full">
              {/* Sidebar Tabs */}
              <div className="flex border-b border-white/10 text-xs font-bold">
                <button
                  onClick={() => setSidebarTab('chat')}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    sidebarTab === 'chat' ? 'bg-slate-800 text-white border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare size={14} />
                  <span>Chat & Doubts</span>
                </button>

                <button
                  onClick={() => setSidebarTab('people')}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    sidebarTab === 'people' ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>People ({liveParticipants.length})</span>
                </button>

                <button
                  onClick={() => setSidebarTab('notes')}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    sidebarTab === 'notes' ? 'bg-slate-800 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText size={14} />
                  <span>Notes ({sharedNotes.length})</span>
                </button>

                <button
                  onClick={() => setSidebarTab('polls')}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    sidebarTab === 'polls' ? 'bg-slate-800 text-white border-b-2 border-amber-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart2 size={14} />
                  <span>Poll</span>
                </button>
              </div>

              {/* TAB CONTENT: CHAT & DOUBTS */}
              {sidebarTab === 'chat' && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Doubt Filter Bar */}
                  <div className="p-3 bg-slate-950/60 border-b border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live Discussion</span>
                    <button
                      onClick={() => setIsDoubtOnlyFilter(!isDoubtOnlyFilter)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        isDoubtOnlyFilter ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <HelpCircle size={11} />
                      <span>{isDoubtOnlyFilter ? 'Showing Doubts Only' : 'Filter Doubts'}</span>
                    </button>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {chatMessages
                      .filter(m => !isDoubtOnlyFilter || m.isDoubt)
                      .map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`p-3 rounded-2xl border transition-all ${
                            msg.isDoubt 
                              ? 'bg-amber-950/30 border-amber-500/30' 
                              : msg.senderRole === 'teacher' 
                                ? 'bg-indigo-950/30 border-indigo-500/30' 
                                : 'bg-slate-800/60 border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={`font-bold ${msg.senderRole === 'teacher' ? 'text-indigo-400' : 'text-blue-400'}`}>
                              {msg.senderName} {msg.senderRole === 'teacher' && '(Faculty)'}
                            </span>
                            <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                          </div>

                          <p className="text-xs text-slate-200 mt-1 leading-relaxed">{msg.text}</p>

                          {msg.isDoubt && (
                            <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/5 text-[10px]">
                              {msg.isSolved ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Answered by Faculty
                                </span>
                              ) : (
                                <span className="text-amber-400 font-bold">Unsolved Student Doubt</span>
                              )}

                              {userClassRole === 'teacher' && !msg.isSolved && (
                                <button
                                  onClick={() => handleMarkDoubtSolved(msg.id)}
                                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold cursor-pointer"
                                >
                                  Mark Solved
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Input form */}
                  <div className="p-3 border-t border-white/10 bg-slate-950 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={markAsDoubtChecked}
                          onChange={(e) => setMarkAsDoubtChecked(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="font-bold text-amber-400">❓ Tag as Doubt</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={markAsDoubtChecked ? "Ask your question or doubt to faculty..." : "Send a message to class..."}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl cursor-pointer shadow transition-all active:scale-95"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PEOPLE & ATTENDANCE */}
              {sidebarTab === 'people' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="p-3.5 bg-slate-950/60 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Live Attendance</span>
                      <p className="text-xs font-bold text-white">{liveParticipants.length} Connected</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {userClassRole === 'teacher' && (
                        <button
                          onClick={handleMuteAll}
                          className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                          title="Mute all student mics"
                        >
                          Mute All
                        </button>
                      )}

                      <button
                        onClick={handleExportAttendance}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Download Attendance CSV"
                      >
                        <Download size={11} />
                        <span>CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {liveParticipants.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate leading-tight">{p.name}</p>
                            <span className="text-[9px] font-semibold text-slate-400 uppercase">
                              {p.role} {p.joinedAt && `• Joined ${p.joinedAt}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {p.handRaised && (
                            <Hand size={14} className="text-amber-400 animate-bounce" title="Hand Raised" />
                          )}

                          {userClassRole === 'teacher' && p.role === 'student' && (
                            <>
                              <button
                                onClick={() => handleToggleStudentMute(p.id)}
                                className={`p-1.5 rounded-lg cursor-pointer ${
                                  p.isMuted ? 'text-rose-400 bg-rose-500/20' : 'text-emerald-400 bg-emerald-500/20'
                                }`}
                                title={p.isMuted ? "Unmute Student" : "Mute Student"}
                              >
                                {p.isMuted ? <MicOff size={13} /> : <Mic size={13} />}
                              </button>

                              <button
                                onClick={() => handleRemoveStudent(p.id, p.name)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/20 cursor-pointer"
                                title="Remove student from classroom"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: SHARED NOTES / PDF */}
              {sidebarTab === 'notes' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="p-3.5 bg-slate-950/60 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Class Handouts</span>
                      <p className="text-xs font-bold text-white">{sharedNotes.length} Files Available</p>
                    </div>

                    <button
                      onClick={() => setShowShareNoteModal(true)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Share PDF</span>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {sharedNotes.map((note) => (
                      <div key={note.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <FileText size={18} className="text-purple-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white leading-snug">{note.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{note.fileSize} • Uploaded by {note.uploadedBy}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            alert(`📥 Downloading "${note.title}"...\nFile saved to your downloads folder.`);
                          }}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                        >
                          <Download size={12} />
                          <span>Download Notes (PDF)</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: POLLS / QUIZ */}
              {sidebarTab === 'polls' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="p-3.5 bg-slate-950/60 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Live Concept Check</span>
                      <p className="text-xs font-bold text-white">Active Quiz & Polls</p>
                    </div>

                    {userClassRole === 'teacher' && (
                      <button
                        onClick={() => setShowCreatePollModal(true)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>New Poll</span>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {activePoll ? (
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-4">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Live Question
                          </span>
                          <h4 className="text-xs font-bold text-white mt-2 leading-relaxed">
                            {activePoll.question}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                            Total Votes: {activePoll.totalVotes}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {activePoll.options.map((opt, idx) => {
                            const pct = activePoll.totalVotes > 0 ? Math.round((opt.votes / activePoll.totalVotes) * 100) : 0;
                            const isVoted = activePoll.userVoteIndex === idx;
                            return (
                              <button
                                key={idx}
                                disabled={activePoll.userVoteIndex !== undefined}
                                onClick={() => handleVotePoll(idx)}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all relative overflow-hidden cursor-pointer ${
                                  isVoted 
                                    ? 'border-amber-400 bg-amber-500/20 font-bold' 
                                    : 'border-white/10 bg-slate-900/80 hover:border-amber-500/40'
                                }`}
                              >
                                <div 
                                  className="absolute top-0 bottom-0 left-0 bg-amber-500/20 rounded-xl transition-all duration-500" 
                                  style={{ width: `${pct}%` }} 
                                />
                                <div className="relative z-10 flex items-center justify-between">
                                  <span className="text-white">{opt.text}</span>
                                  <span className="font-mono font-bold text-amber-300 ml-2">{pct}%</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {activePoll.userVoteIndex !== undefined && (
                          <div className="text-center text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 size={12} /> Your vote is recorded in real-time.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10 space-y-2 text-slate-400">
                        <BarChart2 size={32} className="mx-auto text-slate-600" />
                        <p className="text-xs">No active poll right now.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Whiteboard Footer */}
        {viewMode === 'whiteboard' && (
          <footer className="h-16 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-4 flex-shrink-0">
            <button 
              onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))} 
              disabled={currentPageIndex === 0}
              className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            {whiteboardPages.map((page, idx) => (
              <span 
                key={page.id} 
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${idx === currentPageIndex ? 'bg-blue-500 scale-125' : 'bg-slate-700'}`}
                onClick={() => setCurrentPageIndex(idx)}
              />
            ))}
            <button 
              onClick={() => setCurrentPageIndex(prev => Math.min(whiteboardPages.length - 1, prev + 1))} 
              disabled={currentPageIndex === whiteboardPages.length - 1}
              className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
            {userClassRole === 'teacher' && (
              <button 
                onClick={handleAddPage} 
                className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600 hover:text-white transition-all ml-4 cursor-pointer"
                title="Add New Whiteboard Page"
              >
                <Plus size={18} />
              </button>
            )}
          </footer>
        )}
      </div>

      {/* CREATE POLL MODAL */}
      {showCreatePollModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Launch Live Poll / Quiz Question</h3>
              <button onClick={() => setShowCreatePollModal(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePollSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the derivative of sin(2x)?"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Options (Select Correct)</label>
                {newPollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newPollCorrectIndex === idx}
                      onChange={() => setNewPollCorrectIndex(idx)}
                      className="text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newPollOptions];
                        copy[idx] = e.target.value;
                        setNewPollOptions(copy);
                      }}
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePollModal(false)}
                  className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                >
                  Launch Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHARE NOTES / PDF MODAL */}
      {showShareNoteModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Share PDF Notes with Class</h3>
              <button onClick={() => setShowShareNoteModal(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleShareNoteSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Notes Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 3 Derivations & Numerical Tricks"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Attach PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-purple-600 file:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareNoteModal(false)}
                  className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow"
                >
                  Share to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUMMARY MODAL ON EXIT */}
      {showSummaryModal && (
        <PostClassSummaryModal 
          elapsedTime={elapsedTime} 
          userRole={userClassRole}
          onClose={() => {
            setShowSummaryModal(false);
            onExit();
          }} 
        />
      )}
    </div>
  );
};
