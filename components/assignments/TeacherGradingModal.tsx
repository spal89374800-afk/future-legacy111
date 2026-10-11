import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Check, CheckCircle2, ChevronLeft, ChevronRight, Download, 
  Eye, Edit3, MessageSquare, Mic, Volume2, Star, AlertTriangle, 
  Trash2, RefreshCw, PenTool, Circle as CircleIcon, 
  Type, Undo2, Redo2, Bell, Users, Search, Award
} from 'lucide-react';
import type { AssignmentItem, AssignmentSubmission, User as UserType } from '../../types.ts';

interface TeacherGradingModalProps {
  assignment: AssignmentItem;
  submissions: AssignmentSubmission[];
  allStudents?: { id: string; name: string; roll?: string; batch?: string }[];
  currentUser: UserType;
  onClose: () => void;
  onGradeSubmission: (submissionId: string, gradeData: {
    marks: number;
    feedbackText: string;
    feedbackVoiceUrl?: string;
    annotatedPhotoUrl?: string;
    status: 'checked' | 'redo';
  }) => void;
  onSendReminderToUnsubmitted: (unsubmittedStudentIds: string[]) => void;
}

export const TeacherGradingModal: React.FC<TeacherGradingModalProps> = ({
  assignment,
  submissions,
  allStudents = [
    { id: 's1', name: 'Shourya Patel', roll: '1201', batch: 'Class 12th - Target NEET 2026' },
    { id: 's2', name: 'Aarav Sharma', roll: '1202', batch: 'Class 12th - Target NEET 2026' },
    { id: 's3', name: 'Priya Joshi', roll: '1203', batch: 'Class 12th - JEE Advanced Super 30' },
    { id: 's4', name: 'Rohan Mehra', roll: '1204', batch: 'Class 12th - JEE Advanced Super 30' },
    { id: 's5', name: 'Ananya Verma', roll: '1205', batch: 'Class 11th - Foundation Batch' },
    { id: 's6', name: 'Vikram Singh', roll: '1206', batch: 'Class 10th - Board Mastery' }
  ],
  currentUser,
  onClose,
  onGradeSubmission,
  onSendReminderToUnsubmitted
}) => {
  // Current submission index
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [filterTab, setFilterTab] = useState<'submitted' | 'unsubmitted' | 'checked'>('submitted');
  const [searchStudent, setSearchStudent] = useState('');

  // Grading form state for current student
  const [marks, setMarks] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [voiceUrl, setVoiceUrl] = useState<string | undefined>();
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSecs, setRecordingSecs] = useState(0);

  // Photo annotation mode
  const [annotatingPhotoIdx, setAnnotatingPhotoIdx] = useState<number | null>(null);
  const [activeTool, setActiveTool] = useState<'pen' | 'tick' | 'cross' | 'circle' | 'text'>('pen');
  const [drawColor, setDrawColor] = useState('#EF4444'); // red default for teacher
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Group students
  const submittedStudents = allStudents.filter(s => 
    submissions.some(sub => sub.studentId === s.id && (sub.status === 'submitted' || sub.status === 'notebook_done'))
  );
  const checkedStudents = allStudents.filter(s => 
    submissions.some(sub => sub.studentId === s.id && sub.status === 'checked')
  );
  const unsubmittedStudents = allStudents.filter(s => 
    !submissions.some(sub => sub.studentId === s.id && (sub.status === 'submitted' || sub.status === 'checked' || sub.status === 'notebook_done'))
  );

  const currentStudentList = filterTab === 'submitted' ? submittedStudents : filterTab === 'checked' ? checkedStudents : unsubmittedStudents;
  const currentStudent = currentStudentList[selectedStudentIndex] || currentStudentList[0];
  const currentSubmission = submissions.find(s => s.studentId === currentStudent?.id);

  // Load existing grade data when student switches
  useEffect(() => {
    if (currentSubmission) {
      setMarks(currentSubmission.marks ?? Math.round(assignment.totalMarks * 0.9));
      setFeedbackText(currentSubmission.feedbackText || 'Well attempted, good derivations.');
      setVoiceUrl(currentSubmission.feedbackVoiceUrl);
    } else {
      setMarks(0);
      setFeedbackText('');
      setVoiceUrl(undefined);
    }
  }, [currentStudent, currentSubmission, assignment.totalMarks]);

  // Voice recording for feedback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<number | null>(null);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setVoiceUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecordingVoice(true);
      setRecordingSecs(0);
      voiceTimerRef.current = window.setInterval(() => {
        setRecordingSecs(s => s + 1);
      }, 1000);
    } catch {
      alert('Microphone access denied.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }
  };

  // Quick Action Buttons
  const handleQuickCorrect = () => {
    setMarks(assignment.totalMarks);
    setFeedbackText('Excellent work! All answers, formulas and diagrams are 100% correct.');
  };

  const handleQuickNeedsRedo = () => {
    setMarks(Math.round(assignment.totalMarks * 0.4));
    setFeedbackText('Needs Redo: Several calculation errors in step 2. Please re-solve and resubmit.');
  };

  // Save Grade
  const handleSaveGrade = (status: 'checked' | 'redo' = 'checked') => {
    if (!currentSubmission) {
      alert('Student has not submitted work yet.');
      return;
    }

    let annotatedPhotoUrl: string | undefined;
    if (canvasRef.current) {
      annotatedPhotoUrl = canvasRef.current.toDataURL('image/png');
    }

    onGradeSubmission(currentSubmission.id, {
      marks: Number(marks) || 0,
      feedbackText: feedbackText.trim() || 'Checked by faculty.',
      feedbackVoiceUrl: voiceUrl,
      annotatedPhotoUrl,
      status
    });

    // Advance to next student automatically
    if (selectedStudentIndex < currentStudentList.length - 1) {
      setSelectedStudentIndex(prev => prev + 1);
    } else {
      alert('All student submissions in this list checked!');
    }
  };

  // Canvas drawing for photo annotation
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = drawColor;
    ctx.fillStyle = drawColor;
    ctx.lineWidth = 3;

    if (activeTool === 'pen') {
      isDrawingRef.current = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (activeTool === 'tick') {
      // Draw tick ✓
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 10, y + 15);
      ctx.lineTo(x + 30, y - 15);
      ctx.stroke();
    } else if (activeTool === 'cross') {
      // Draw cross ✗
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 12);
      ctx.lineTo(x + 12, y + 12);
      ctx.moveTo(x + 12, y - 12);
      ctx.lineTo(x - 12, y + 12);
      ctx.stroke();
    } else if (activeTool === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.stroke();
    } else if (activeTool === 'text') {
      const txt = prompt('Enter annotation comment:');
      if (txt) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(txt, x, y);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activeTool !== 'pen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex items-start justify-center p-2 sm:p-4 py-6 sm:py-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl sm:rounded-[2.5rem] w-full max-w-6xl my-auto shadow-2xl flex flex-col overflow-hidden max-h-[92vh] sm:max-h-[88vh] text-slate-100 shrink-0">
        
        {/* Header */}
        <header className="p-5 border-b border-white/10 bg-slate-950 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Award size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Checking & Grading Center
                </span>
                <span className="text-xs text-slate-400">Total Marks: {assignment.totalMarks}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-montserrat truncate">
                {assignment.title}
              </h3>
            </div>
          </div>

          {/* Quick stats badges */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold">
              Submitted: {submittedStudents.length}
            </span>
            <span className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold">
              Checked: {checkedStudents.length}
            </span>
            <span className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold">
              Pending: {unsubmittedStudents.length}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white ml-2 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          
          {/* Left Column: Student Selector Sidebar */}
          <div className="lg:col-span-4 bg-slate-950/70 border-r border-white/10 flex flex-col min-h-0">
            {/* Filter Tabs */}
            <div className="p-3 border-b border-white/5 flex gap-1 text-[11px] font-bold">
              <button
                onClick={() => { setFilterTab('submitted'); setSelectedStudentIndex(0); }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  filterTab === 'submitted' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Submitted ({submittedStudents.length})
              </button>
              <button
                onClick={() => { setFilterTab('checked'); setSelectedStudentIndex(0); }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  filterTab === 'checked' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Checked ({checkedStudents.length})
              </button>
              <button
                onClick={() => { setFilterTab('unsubmitted'); setSelectedStudentIndex(0); }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  filterTab === 'unsubmitted' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({unsubmittedStudents.length})
              </button>
            </div>

            {/* Bulk Reminder to unsubmitted students */}
            {filterTab === 'unsubmitted' && unsubmittedStudents.length > 0 && (
              <div className="p-3 bg-amber-950/20 border-b border-amber-500/20 flex items-center justify-between">
                <span className="text-[10px] text-amber-300 font-bold">
                  {unsubmittedStudents.length} students have not submitted
                </span>
                <button
                  onClick={() => {
                    onSendReminderToUnsubmitted(unsubmittedStudents.map(s => s.id));
                    alert(`🔔 Push notification reminders sent to ${unsubmittedStudents.length} pending students!`);
                  }}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Bell size={11} />
                  <span>Send Reminder</span>
                </button>
              </div>
            )}

            {/* Students List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
              {currentStudentList.map((st, idx) => {
                const sub = submissions.find(s => s.studentId === st.id);
                const isSelected = idx === selectedStudentIndex;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStudentIndex(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow' 
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-xs">{st.name}</h5>
                      <p className="text-[10px] text-slate-400">
                        {st.roll && `Roll: ${st.roll} • `}{st.batch}
                      </p>
                    </div>

                    <div className="text-right">
                      {sub?.status === 'checked' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {sub.marks}/{assignment.totalMarks}
                        </span>
                      ) : sub?.status === 'notebook_done' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">
                          Notebook ✓
                        </span>
                      ) : sub ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300">
                          Needs Check
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">
                          Not Done
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next / Previous student navigators */}
            <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
              <button
                disabled={selectedStudentIndex === 0}
                onClick={() => setSelectedStudentIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl disabled:opacity-30 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Prev Student</span>
              </button>
              <span>{selectedStudentIndex + 1} of {currentStudentList.length}</span>
              <button
                disabled={selectedStudentIndex >= currentStudentList.length - 1}
                onClick={() => setSelectedStudentIndex(prev => Math.min(currentStudentList.length - 1, prev + 1))}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl disabled:opacity-30 flex items-center gap-1 cursor-pointer"
              >
                <span>Next Student</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Column: Grading Workspace & Student Work Viewer */}
          <div className="lg:col-span-8 flex flex-col min-h-0 bg-slate-900">
            {currentStudent ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                
                {/* Current student banner */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-white">{currentStudent.name}</h4>
                    <p className="text-xs text-slate-400">
                      {currentStudent.batch} {currentSubmission && `• Submitted on ${new Date(currentSubmission.submittedAt).toLocaleString()}`}
                    </p>
                  </div>

                  {currentSubmission?.status === 'notebook_done' && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold">
                      Notebook Work: Showed in class
                    </span>
                  )}
                </div>

                {/* Student's Attached Work (Photos, PDF, text) */}
                {currentSubmission ? (
                  <div className="space-y-4">
                    {/* Photos of answer sheet */}
                    {currentSubmission.photos && currentSubmission.photos.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                            Student Answer Photos ({currentSubmission.photos.length}) • Click to Draw/Annotate
                          </h5>
                          {annotatingPhotoIdx !== null && (
                            <button
                              onClick={() => setAnnotatingPhotoIdx(null)}
                              className="text-xs font-bold text-rose-400 hover:text-white"
                            >
                              Exit Annotation
                            </button>
                          )}
                        </div>

                        {/* If in Annotation mode on a photo */}
                        {annotatingPhotoIdx !== null ? (
                          <div className="p-4 bg-slate-950 rounded-2xl border border-blue-500 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Draw Tools:</span>
                              {(['pen', 'tick', 'cross', 'circle', 'text'] as const).map(tool => (
                                <button
                                  key={tool}
                                  type="button"
                                  onClick={() => setActiveTool(tool)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                                    activeTool === tool ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {tool === 'tick' ? '✓ Tick' : tool === 'cross' ? '✗ Cross' : tool === 'circle' ? '◯ Circle' : tool}
                                </button>
                              ))}

                              {/* Colors */}
                              <div className="flex items-center gap-1.5 ml-3">
                                {['#EF4444', '#10B981', '#3B82F6', '#F59E0B'].map(c => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => setDrawColor(c)}
                                    className={`w-5 h-5 rounded-full border ${drawColor === c ? 'ring-2 ring-white' : ''}`}
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="relative rounded-xl overflow-hidden border border-white/20 bg-black flex justify-center">
                              <img
                                src={currentSubmission.photos[annotatingPhotoIdx]}
                                alt="Student Page"
                                className="max-h-[450px] object-contain"
                              />
                              <canvas
                                ref={canvasRef}
                                width={600}
                                height={450}
                                onMouseDown={handleCanvasMouseDown}
                                onMouseMove={handleCanvasMouseMove}
                                onMouseUp={handleCanvasMouseUp}
                                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                              />
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Tip: Click on equations or diagrams to place red ticks ✓ or crosses ✗. Your annotations will be saved to the student report!
                            </p>
                          </div>
                        ) : (
                          /* Normal photo gallery */
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {currentSubmission.photos.map((pUrl, pIdx) => (
                              <div
                                key={pIdx}
                                onClick={() => setAnnotatingPhotoIdx(pIdx)}
                                className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-blue-400 transition-all"
                              >
                                <img src={pUrl} alt={`Page ${pIdx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity gap-1">
                                  <PenTool size={20} className="text-red-400" />
                                  <span className="text-[10px] font-bold">Draw / Grade Page {pIdx + 1}</span>
                                </div>
                                <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                                  Page {pIdx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PDF Document answers */}
                    {currentSubmission.files && currentSubmission.files.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                          Submitted PDF Document:
                        </h5>
                        {currentSubmission.files.map((f, fIdx) => (
                          <div key={fIdx} className="p-3 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">{f.name} ({f.size})</span>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg font-bold"
                            >
                              Open PDF
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Written text answer */}
                    {currentSubmission.textAnswer && (
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-1">
                        <h5 className="text-xs font-bold text-slate-400 uppercase">Student Text Answer:</h5>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                          {currentSubmission.textAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-950 rounded-3xl border border-white/5 text-center space-y-2">
                    <p className="text-xs text-slate-400">Student has not submitted any work yet.</p>
                  </div>
                )}

                {/* Grading Controls (Marks, Comments, Voice, Quick Actions) */}
                <div className="p-5 bg-slate-950 rounded-3xl border border-white/15 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <h5 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                      <Edit3 size={15} className="text-blue-400" />
                      <span>Grading & Feedback Panel</span>
                    </h5>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleQuickCorrect}
                        className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={13} />
                        <span>All Correct (Full Marks)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleQuickNeedsRedo}
                        className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={13} />
                        <span>Needs Redo</span>
                      </button>
                    </div>
                  </div>

                  {/* Marks Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Award Marks (Out of {assignment.totalMarks})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={assignment.totalMarks}
                        value={marks}
                        onChange={(e) => setMarks(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-base font-black text-emerald-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Voice Feedback to Student
                      </label>
                      <div className="flex items-center gap-2">
                        {!isRecordingVoice ? (
                          <button
                            type="button"
                            onClick={startVoiceRecording}
                            className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Mic size={14} className="text-purple-400" />
                            <span>{voiceUrl ? 'Re-record Voice' : 'Record Voice Feedback'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopVoiceRecording}
                            className="px-3.5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold animate-pulse"
                          >
                            Stop ({recordingSecs}s)
                          </button>
                        )}
                        {voiceUrl && <audio src={voiceUrl} controls className="h-7 w-48" />}
                      </div>
                    </div>
                  </div>

                  {/* Text Feedback */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Written Remarks & Feedback
                    </label>
                    <textarea
                      rows={2}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Write feedback: strong derivations, points missed, suggestions..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Submit Grade Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveGrade('redo')}
                      className="px-5 py-3 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Return to Student (Needs Redo)
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveGrade('checked')}
                      className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={15} />
                      <span>Save Grade & Notify Student</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
                Select a student from the left sidebar to start checking.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
