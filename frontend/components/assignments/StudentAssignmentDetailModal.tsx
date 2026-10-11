import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Calendar, Clock, BookOpen, User, FileText, Image as ImageIcon, 
  Video, Mic, Link as LinkIcon, Download, CheckCircle2, 
  Upload, Trash2, ArrowLeft, Send, AlertCircle, Eye, Star, 
  Volume2, RefreshCw, Check
} from 'lucide-react';
import type { AssignmentItem, AssignmentSubmission, User as UserType } from '../../types.ts';

interface StudentAssignmentDetailModalProps {
  assignment: AssignmentItem;
  submission?: AssignmentSubmission;
  currentUser: UserType;
  onClose: () => void;
  onSubmit: (submissionData: {
    textAnswer?: string;
    linkAnswer?: string;
    photos: string[];
    files: { name: string; url: string; size?: string }[];
    status?: 'submitted' | 'notebook_done';
  }) => void;
}

export const StudentAssignmentDetailModal: React.FC<StudentAssignmentDetailModalProps> = ({
  assignment,
  submission,
  currentUser,
  onClose,
  onSubmit
}) => {
  // Submission fields
  const [textAnswer, setTextAnswer] = useState(submission?.textAnswer || '');
  const [linkAnswer, setLinkAnswer] = useState(submission?.linkAnswer || '');
  const [photos, setPhotos] = useState<string[]>(submission?.photos || []);
  const [files, setFiles] = useState<{ name: string; url: string; size?: string }[]>(submission?.files || []);

  // UI state
  const [activeTab, setActiveTab] = useState<'details' | 'submit' | 'feedback'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Time remaining calculation
  const getRemainingTime = () => {
    const now = new Date().getTime();
    const target = new Date(assignment.deadline).getTime();
    const diff = target - now;

    if (diff <= 0) return { text: 'Deadline Passed (Late submission)', isLate: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return { text: `${days} din ${hours} ghante baaki (${days} days left)`, isLate: false };
    if (hours > 0) return { text: `${hours} ghante ${minutes} min baaki (${hours}h left)`, isLate: false };
    return { text: `${minutes} minute baaki (Due soon!)`, isLate: false };
  };

  const remaining = getRemainingTime();

  // Save offline work draft to localStorage so student work is never lost
  useEffect(() => {
    try {
      const offlineKey = `offline_assignment_${assignment.id}_${currentUser.id}`;
      if (!submission || submission.status === 'pending') {
        const draft = localStorage.getItem(offlineKey);
        if (draft && !textAnswer && photos.length === 0) {
          const parsed = JSON.parse(draft);
          setTextAnswer(parsed.textAnswer || '');
          setPhotos(parsed.photos || []);
        }
      }
    } catch {}
  }, [assignment.id, currentUser.id]);

  const handleSaveDraftOffline = (text: string, p: string[]) => {
    try {
      const offlineKey = `offline_assignment_${assignment.id}_${currentUser.id}`;
      localStorage.setItem(offlineKey, JSON.stringify({ textAnswer: text, photos: p }));
    } catch {}
  };

  // Photo upload / camera
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newPhotos: string[] = [];
    Array.from(fileList).forEach(file => {
      const url = URL.createObjectURL(file);
      newPhotos.push(url);
    });

    const updated = [...photos, ...newPhotos];
    setPhotos(updated);
    handleSaveDraftOffline(textAnswer, updated);
  };

  const handleRemovePhoto = (idx: number) => {
    const updated = photos.filter((_, i) => i !== idx);
    setPhotos(updated);
    handleSaveDraftOffline(textAnswer, updated);
  };

  // PDF / Document Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles: { name: string; url: string; size?: string }[] = [];
    Array.from(fileList).forEach(file => {
      const url = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      newFiles.push({ name: file.name, url, size: `${sizeMB} MB` });
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  // Notebook "Maine kar liya" 1-tap handler
  const handleNotebookDone = () => {
    if (window.confirm('Confirm: Did you complete the assignment in your notebook? This will mark your status as "Completed in Notebook".')) {
      onSubmit({
        status: 'notebook_done',
        photos: [],
        files: []
      });
      onClose();
    }
  };

  // Final Submit
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        textAnswer,
        linkAnswer,
        photos,
        files,
        status: 'submitted'
      });
      try {
        localStorage.removeItem(`offline_assignment_${assignment.id}_${currentUser.id}`);
      } catch {}
      setIsSubmitting(false);
      setShowConfirmModal(false);
      onClose();
    }, 600);
  };

  const isChecked = submission?.status === 'checked';
  const isSubmitted = submission && (submission.status === 'submitted' || submission.status === 'checked' || submission.status === 'notebook_done');

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex items-start justify-center p-3 sm:p-6 py-6 sm:py-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl sm:rounded-[2.5rem] w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] my-auto shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-100 shrink-0">
        
        {/* Top Header */}
        <header className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {assignment.subject} • {assignment.totalMarks} Marks
              </span>
              <h3 className="text-base sm:text-xl font-black text-white font-montserrat truncate mt-1">
                {assignment.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white shrink-0 cursor-pointer"
          >
            <X size={20} />
          </button>
        </header>

        {/* Status & Deadline Banner */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Clock size={14} className={remaining.isLate ? 'text-rose-400' : 'text-amber-400'} />
            <span className={remaining.isLate ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'}>
              {remaining.text}
            </span>
            <span className="text-slate-500 font-mono">
              (Due: {new Date(assignment.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})
            </span>
          </div>

          {/* Submission status badge */}
          <div>
            {isChecked ? (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>Checked • {submission.marks} / {assignment.totalMarks} Marks</span>
              </span>
            ) : submission?.status === 'notebook_done' ? (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-bold flex items-center gap-1.5">
                <Check size={13} />
                <span>Marked Done in Notebook</span>
              </span>
            ) : isSubmitted ? (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>Submitted (Under Review)</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                ● Pending Submission
              </span>
            )}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-900 border-b border-white/5 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-center transition-all cursor-pointer ${
              activeTab === 'details' ? 'border-b-2 border-blue-500 text-white bg-slate-800/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Instructions & Files
          </button>

          {assignment.submissionType !== 'notice_only' && (
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                activeTab === 'submit' ? 'border-b-2 border-blue-500 text-white bg-slate-800/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isSubmitted ? 'My Submission / Resubmit' : 'Submit My Work'}
            </button>
          )}

          {isChecked && (
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                activeTab === 'feedback' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-emerald-950/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Teacher Marks & Feedback ★
            </button>
          )}
        </div>

        {/* Main Body */}
        <div className="p-5 sm:p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">

          {/* TAB 1: INSTRUCTIONS & ATTACHMENTS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Teacher instructions shown big and clear */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <User size={14} className="text-blue-400" />
                    <span>Faculty: {assignment.teacherName}</span>
                  </span>
                  <span>Assigned: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="text-sm sm:text-base text-white font-medium leading-relaxed whitespace-pre-line">
                  {assignment.message}
                </div>

                {/* Voice Instruction Player if teacher attached */}
                {assignment.voiceInstructionUrl && (
                  <div className="pt-3 border-t border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                      <Mic size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Teacher's Voice Instruction</p>
                      <audio src={assignment.voiceInstructionUrl} controls className="h-7 w-56 mt-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Attachments Section (open directly) */}
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">
                    Attached Resources ({assignment.attachments.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignment.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3.5 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {att.type === 'image' && <ImageIcon size={20} className="text-emerald-400 shrink-0" />}
                          {att.type === 'pdf' && <FileText size={20} className="text-purple-400 shrink-0" />}
                          {att.type === 'video' && <Video size={20} className="text-blue-400 shrink-0" />}
                          {att.type === 'link' && <LinkIcon size={20} className="text-amber-400 shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{att.name}</p>
                            {att.size && <p className="text-[10px] text-slate-400">{att.size}</p>}
                          </div>
                        </div>

                        {att.type === 'link' ? (
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-xl text-xs font-bold shrink-0"
                          >
                            Open Link
                          </a>
                        ) : (
                          <a
                            href={att.url}
                            download={att.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Download size={13} />
                            <span>Open</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBMIT WORK */}
          {activeTab === 'submit' && (
            <div className="space-y-6">
              {/* If "Notebook" type */}
              {assignment.submissionType === 'notebook' ? (
                <div className="bg-slate-950 p-8 rounded-3xl border border-purple-500/20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto text-3xl">
                    📓
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">Do in Notebook & Show in Class</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Complete this assignment neatly in your physical notebook. When done, tap the button below to notify your teacher.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNotebookDone}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-purple-900/30 cursor-pointer active:scale-95 transition-all"
                  >
                    ✓ Maine Kar Liya (I Have Completed in Notebook)
                  </button>
                </div>
              ) : (
                /* In-App Submission Workspace */
                <div className="space-y-6">
                  {/* Photo submission (Multiple photos with preview & delete) */}
                  <div className="p-5 bg-slate-950 rounded-3xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <ImageIcon size={15} className="text-emerald-400" />
                        <span>Photos of Answer Sheet ({photos.length})</span>
                      </span>

                      <label className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-all">
                        <Upload size={13} />
                        <span>Take / Add Photos</span>
                        <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
                      </label>
                    </div>

                    {photos.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        No photos added yet. Tap "Take / Add Photos" to capture your notebook pages.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {photos.map((photoUrl, idx) => (
                          <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group bg-black">
                            <img src={photoUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                              Page {idx + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg opacity-90 hover:opacity-100 cursor-pointer shadow"
                            >
                              <Trash2 size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewPhoto(photoUrl)}
                              className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-lg cursor-pointer"
                            >
                              <Eye size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PDF Document Upload */}
                  <div className="p-5 bg-slate-950 rounded-3xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <FileText size={15} className="text-purple-400" />
                        <span>PDF Document / Answer File</span>
                      </span>

                      <label className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-all">
                        <Upload size={13} />
                        <span>Upload PDF</span>
                        <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {files.map((file, idx) => (
                          <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="text-slate-400 hover:text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Written Text Answer */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                      Written Answer / Final Notes
                    </label>
                    <textarea
                      rows={3}
                      value={textAnswer}
                      onChange={(e) => {
                        setTextAnswer(e.target.value);
                        handleSaveDraftOffline(e.target.value, photos);
                      }}
                      placeholder="Type step-by-step numerical answer, derivation summary, or explanations..."
                      className="w-full bg-slate-950 border border-white/15 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Web Link / Project URL (optional) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                      Reference Link / Google Drive Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={linkAnswer}
                      onChange={(e) => setLinkAnswer(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Big Submit Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={photos.length === 0 && files.length === 0 && !textAnswer.trim()}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/30 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <Send size={16} />
                      <span>{isSubmitted ? 'Resubmit Assignment' : 'Submit Assignment to Teacher'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHECKED MARKS & TEACHER FEEDBACK */}
          {activeTab === 'feedback' && isChecked && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-500/30 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Evaluated by Faculty
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">
                    {submission.marks}
                  </span>
                  <span className="text-xl text-slate-500 font-bold">/ {assignment.totalMarks}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Graded on {new Date(submission.checkedAt || '').toLocaleDateString()}
                </p>
              </div>

              {/* Feedback text */}
              {submission.feedbackText && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Teacher's Remarks:</h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{submission.feedbackText}"
                  </p>
                </div>
              )}

              {/* Voice feedback if any */}
              {submission.feedbackVoiceUrl && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Teacher's Voice Feedback</h5>
                    <audio src={submission.feedbackVoiceUrl} controls className="h-7 w-56 mt-1" />
                  </div>
                </div>
              )}

              {/* Annotated Photo if teacher drew corrections */}
              {submission.annotatedPhotoUrl && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Teacher Annotated Sheet:</h4>
                  <div className="rounded-2xl overflow-hidden border border-white/15 bg-black">
                    <img src={submission.annotatedPhotoUrl} alt="Annotated Answer Sheet" className="w-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Photo Lightbox Preview */}
        {previewPhoto && (
          <div className="fixed inset-0 z-[250] bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white cursor-pointer"
              >
                <X size={20} />
              </button>
              <img src={previewPhoto} alt="Preview" className="max-h-[85vh] max-w-full object-contain rounded-2xl" />
            </div>
          </div>
        )}

        {/* Confirmation Modal before final submit */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 w-full max-w-md space-y-4 animate-scale-up">
              <h4 className="text-base font-black text-white uppercase font-montserrat">Confirm Submission</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                You are submitting <strong>{photos.length} photos</strong> and <strong>{files.length} documents</strong> to faculty {assignment.teacherName}.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
