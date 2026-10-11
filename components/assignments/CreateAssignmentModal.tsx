import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Calendar, Clock, BookOpen, User, Users, 
  Upload, Image, FileText, Video, Mic, Link as LinkIcon, 
  ChevronDown, ChevronUp, Check, CheckCircle2, AlertCircle, 
  Trash2, Radio, Sparkles, Copy, Save, Globe, Eye, ArrowLeft
} from 'lucide-react';
import type { AssignmentItem, AssignmentAttachment, User as UserType } from '../../types.ts';

interface CreateAssignmentModalProps {
  onClose: () => void;
  onSave: (assignment: AssignmentItem) => void;
  currentUser: UserType;
  availableStudents?: { id: string; name: string; roll?: string; batch?: string }[];
  initialDraft?: Partial<AssignmentItem>;
}

const DEFAULT_BATCHES = [
  'All Students (Global)',
  'Class 12th - Target NEET 2026',
  'Class 12th - JEE Advanced Super 30',
  'Class 11th - Foundation Batch',
  'Class 10th - Board Mastery'
];

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  onClose,
  onSave,
  currentUser,
  availableStudents = [
    { id: 's1', name: 'Shourya Patel', roll: '1201', batch: 'Class 12th - Target NEET 2026' },
    { id: 's2', name: 'Aarav Sharma', roll: '1202', batch: 'Class 12th - Target NEET 2026' },
    { id: 's3', name: 'Priya Joshi', roll: '1203', batch: 'Class 12th - JEE Advanced Super 30' },
    { id: 's4', name: 'Rohan Mehra', roll: '1204', batch: 'Class 12th - JEE Advanced Super 30' },
    { id: 's5', name: 'Ananya Verma', roll: '1205', batch: 'Class 11th - Foundation Batch' },
    { id: 's6', name: 'Vikram Singh', roll: '1206', batch: 'Class 10th - Board Mastery' }
  ],
  initialDraft
}) => {
  // Language toggle (Hindi / English)
  const [lang, setLang] = useState<'hi' | 'en'>('en');

  // Smart default deadline: Exactly 3 days from now at 11:59 PM
  const getDefaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return `${d.toISOString().split('T')[0]}T23:59`;
  };

  // 8 Main Fields
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [message, setMessage] = useState(initialDraft?.message || '');
  const [subject, setSubject] = useState(initialDraft?.subject || 'Physics');
  const [subjectsList, setSubjectsList] = useState<string[]>(() => {
    const base = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'English'];
    try {
      const saved = localStorage.getItem('future_legacy_custom_subjects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...base, ...parsed]));
        }
      }
    } catch {}
    return base;
  });
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');

  const handleAddNewSubject = () => {
    const trimmed = customSubjectName.trim();
    if (!trimmed) return;
    if (!subjectsList.includes(trimmed)) {
      const updated = [...subjectsList, trimmed];
      setSubjectsList(updated);
      try {
        localStorage.setItem('future_legacy_custom_subjects', JSON.stringify(updated));
      } catch {}
    }
    setSubject(trimmed);
    setCustomSubjectName('');
    setShowCustomSubjectInput(false);
  };
  const [targetType, setTargetType] = useState<'all' | 'batch' | 'selected'>(initialDraft?.targetType === 'class' ? 'batch' : (initialDraft?.targetType || 'batch'));
  const [selectedBatch, setSelectedBatch] = useState(initialDraft?.targetClassOrBatch || DEFAULT_BATCHES[1]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(initialDraft?.targetStudentIds || []);
  const [studentSearch, setStudentSearch] = useState('');
  const [deadline, setDeadline] = useState(initialDraft?.deadline || getDefaultDeadline());
  const [totalMarks, setTotalMarks] = useState<number>(initialDraft?.totalMarks || 50);
  const [submissionType, setSubmissionType] = useState<'in_app' | 'notebook' | 'notice_only'>(initialDraft?.submissionType || 'in_app');

  // Attachments
  const [attachments, setAttachments] = useState<AssignmentAttachment[]>(initialDraft?.attachments || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [linkInput, setLinkInput] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Voice recording for instructions
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceInstructionUrl, setVoiceInstructionUrl] = useState<string | undefined>(initialDraft?.voiceInstructionUrl);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<number | null>(null);

  // "More options" collapsible
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [allowLate, setAllowLate] = useState(initialDraft?.allowLate || false);
  const [lateUntil, setLateUntil] = useState(initialDraft?.lateUntil || '');
  const [latePenaltyPerDay, setLatePenaltyPerDay] = useState(initialDraft?.latePenaltyPerDay || 5);
  const [maxAttempts, setMaxAttempts] = useState(initialDraft?.maxAttempts || 1);
  const [schedulePublish, setSchedulePublish] = useState(false);
  const [publishAt, setPublishAt] = useState(initialDraft?.publishAt || '');
  const [solutionAttachment, setSolutionAttachment] = useState<AssignmentAttachment | undefined>(initialDraft?.solutionAttachment);
  const [draftSavedTime, setDraftSavedTime] = useState<string>('Saved');

  // Auto-save draft to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const draftObj = {
          title, message, subject, targetType, selectedBatch, selectedStudentIds,
          deadline, totalMarks, submissionType, attachments, allowLate, lateUntil,
          latePenaltyPerDay, maxAttempts, voiceInstructionUrl
        };
        localStorage.setItem('future_legacy_assignment_draft', JSON.stringify(draftObj));
        setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, message, subject, targetType, selectedBatch, selectedStudentIds, deadline, totalMarks, submissionType, attachments, allowLate]);

  // Voice recording logic
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
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceInstructionUrl(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      voiceTimerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch {
      alert(lang === 'hi' ? 'माइक्रोफ़ोन अनुमति आवश्यक है।' : 'Microphone permission denied or not available.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }
  };

  // Image compression simulation and file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf' | 'video' | 'audio') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    const file = files[0];
    const sizeMB = file.size / (1024 * 1024);

    // Limit check: video 200MB, others 25MB
    const limitMB = type === 'video' ? 200 : 25;
    if (sizeMB > limitMB) {
      alert(`File too large! Max allowed for ${type} is ${limitMB} MB.`);
      setIsUploading(false);
      return;
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      const objectUrl = URL.createObjectURL(file);
      const newAtt: AssignmentAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name: file.name,
        type,
        url: objectUrl,
        size: `${sizeMB.toFixed(1)} MB`
      };

      setAttachments(prev => [...prev, newAtt]);
      setIsUploading(false);
      setUploadProgress(0);
    }, 800);
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const newAtt: AssignmentAttachment = {
      id: `att-link-${Date.now()}`,
      name: linkInput.trim(),
      type: 'link',
      url: linkInput.trim().startsWith('http') ? linkInput.trim() : `https://${linkInput.trim()}`
    };
    setAttachments(prev => [...prev, newAtt]);
    setLinkInput('');
    setShowLinkModal(false);
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attId));
  };

  // Students selection helpers
  const filteredStudents = availableStudents.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
    (s.roll && s.roll.includes(studentSearch))
  );

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllStudents = () => {
    setSelectedStudentIds(filteredStudents.map(s => s.id));
  };

  const handleDeselectAllStudents = () => {
    setSelectedStudentIds([]);
  };

  // Submit Handler
  const handleSubmit = (status: 'published' | 'draft' = 'published') => {
    if (!title.trim()) {
      alert(lang === 'hi' ? 'कृपया असाइनमेंट का शीर्षक दर्ज करें।' : 'Please enter an assignment title.');
      return;
    }

    const newAssignment: AssignmentItem = {
      id: `assign-${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name || 'Faculty Mentor',
      title: title.trim(),
      message: message.trim() || 'Please complete all exercises and questions before the deadline.',
      voiceInstructionUrl,
      subject,
      targetType: targetType === 'batch' ? 'batch' : targetType,
      targetClassOrBatch: targetType === 'batch' ? selectedBatch : undefined,
      targetStudentIds: targetType === 'selected' ? selectedStudentIds : undefined,
      submissionType,
      totalMarks: Number(totalMarks) || 50,
      deadline,
      allowLate,
      lateUntil: allowLate ? lateUntil : undefined,
      latePenaltyPerDay: allowLate ? Number(latePenaltyPerDay) : undefined,
      maxAttempts: Number(maxAttempts) || 1,
      publishAt: schedulePublish ? publishAt : undefined,
      status: schedulePublish ? 'scheduled' : status,
      attachments,
      solutionAttachment,
      createdAt: new Date().toISOString()
    };

    onSave(newAssignment);
    try {
      localStorage.removeItem('future_legacy_assignment_draft');
    } catch {}
    onClose();
  };

  // Duplicate Previous Assignment Helper
  const handleDuplicatePrevious = () => {
    try {
      const all = localStorage.getItem('future_legacy_assignments_v1');
      if (all) {
        const list: AssignmentItem[] = JSON.parse(all);
        if (list.length > 0) {
          const last = list[0];
          setTitle(`${last.title} (Copy)`);
          setMessage(last.message);
          setSubject(last.subject);
          setTotalMarks(last.totalMarks);
          setSubmissionType(last.submissionType);
          setAttachments(last.attachments);
          alert(lang === 'hi' ? 'पिछला असाइनमेंट कॉपी हो गया! नई तारीख सेट करें।' : 'Previous assignment copied! Set new deadline.');
          return;
        }
      }
    } catch {}
    alert(lang === 'hi' ? 'कोई पिछला असाइनमेंट नहीं मिला।' : 'No previous assignment found to duplicate.');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex items-start justify-center p-3 sm:p-6 py-6 sm:py-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl sm:rounded-[2.5rem] w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] my-auto shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-100 shrink-0">
        
        {/* Top Header */}
        <header className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white font-montserrat uppercase tracking-tight">
                  {lang === 'hi' ? 'नया असाइनमेंट बनाएं' : 'Create New Assignment'}
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Auto-Save ✓ {draftSavedTime}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'अध्यापक के लिए सरल और तेज असाइनमेंट टूल' : 'Easy, fast assignment tool for teachers and students'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title={lang === 'hi' ? 'वापस जाएं (Back)' : 'Go Back'}
            >
              <ArrowLeft size={14} className="text-blue-400" />
              <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
            </button>

            {/* Hindi / English Switch */}
            <button
              type="button"
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 border border-white/10 flex items-center gap-1.5 cursor-pointer"
              title="Switch language"
            >
              <Globe size={13} className="text-blue-400" />
              <span>{lang === 'en' ? 'हिंदी में' : 'English'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Form Body - Only 8 Main Fields Visible */}
        <div className="p-5 sm:p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">

          {/* 1. TITLE */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-white uppercase tracking-wider">
              1. {lang === 'hi' ? 'असाइनमेंट शीर्षक *' : 'Assignment Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'hi' ? 'उदा. अध्याय 4: घूर्णन गति अभ्यास प्रश्न सेट' : 'e.g. Chapter 4: Rotational Dynamics Problem Set 1'}
              className="w-full bg-slate-950 border border-white/15 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner font-medium"
            />
          </div>

          {/* 2. MESSAGE / INSTRUCTIONS (with Bold helper & Voice Record) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider">
                2. {lang === 'hi' ? 'निर्देश व संदेश (Instructions)' : 'Instructions & Message'}
              </label>

              {/* Voice Record Button */}
              <div className="flex items-center gap-2">
                {!isRecordingVoice ? (
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className="px-3 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow"
                  >
                    <Mic size={14} className="text-rose-400" />
                    <span>{voiceInstructionUrl ? (lang === 'hi' ? 'दोबारा रिकॉर्ड करें' : 'Re-record Voice') : (lang === 'hi' ? 'बोलकर निर्देश दें' : 'Record Voice')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 animate-pulse cursor-pointer shadow-lg shadow-rose-900/40"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Stop ({recordingSeconds}s)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Voice Preview Badge if recorded */}
            {voiceInstructionUrl && !isRecordingVoice && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Mic size={16} className="text-rose-400" />
                  <span className="font-bold text-rose-200">{lang === 'hi' ? 'वॉइस निर्देश जुड़ा हुआ है' : 'Voice Instruction Attached'}</span>
                  <audio src={voiceInstructionUrl} controls className="h-7 w-48 ml-2" />
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceInstructionUrl(undefined)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            <div className="relative">
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'hi' ? 'छात्रों के लिए निर्देश लिखें: कौन से प्रश्न हल करने हैं, फ़ॉर्मूले लिखने हैं...' : 'Type student instructions: specify exercise numbers, diagram derivations, presentation requirements...'}
                className="w-full bg-slate-950 border border-white/15 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
                <span>Tip: You can use **bold** or *bullets* in text.</span>
              </div>
            </div>
          </div>

          {/* ATTACHMENTS BAR (Photos, PDF, Video, Audio, Link) */}
          <div className="p-4 bg-slate-950/70 border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                {lang === 'hi' ? 'फ़ाइल या सामग्री जोड़ें (Attachments)' : 'Attach Resources (PDF, Photo, Video, Link)'}
              </span>
              <span className="text-[10px] text-slate-500">Max: 25 MB (Video 200 MB)</span>
            </div>

            {/* Attachment buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Photo Upload */}
              <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow">
                <Image size={15} className="text-emerald-400" />
                <span>{lang === 'hi' ? 'फोटो' : 'Photo'}</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
              </label>

              {/* PDF Document Upload */}
              <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow">
                <FileText size={15} className="text-purple-400" />
                <span>{lang === 'hi' ? 'PDF डॉक्यूमेंट' : 'PDF Document'}</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'pdf')} className="hidden" />
              </label>

              {/* Video Upload */}
              <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow">
                <Video size={15} className="text-blue-400" />
                <span>{lang === 'hi' ? 'वीडियो' : 'Video'}</span>
                <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
              </label>

              {/* Web Link */}
              <button
                type="button"
                onClick={() => setShowLinkModal(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow"
              >
                <LinkIcon size={15} className="text-amber-400" />
                <span>{lang === 'hi' ? 'वेब लिंक' : 'Link / YouTube'}</span>
              </button>
            </div>

            {/* Upload progress indicator */}
            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-blue-400 font-bold">
                  <span>Compressing & Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Attached items list */}
            {attachments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                {attachments.map((att) => (
                  <div key={att.id} className="p-2.5 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {att.type === 'image' && <Image size={15} className="text-emerald-400 shrink-0" />}
                      {att.type === 'pdf' && <FileText size={15} className="text-purple-400 shrink-0" />}
                      {att.type === 'video' && <Video size={15} className="text-blue-400 shrink-0" />}
                      {att.type === 'link' && <LinkIcon size={15} className="text-amber-400 shrink-0" />}
                      <span className="font-semibold text-white truncate max-w-xs">{att.name}</span>
                      {att.size && <span className="text-[10px] text-slate-400">({att.size})</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. SUBJECT & 4. ASSIGN TO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-white uppercase tracking-wider">
                  3. {lang === 'hi' ? 'विषय (Subject)' : 'Subject'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowCustomSubjectInput(!showCustomSubjectInput)}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>{showCustomSubjectInput ? (lang === 'hi' ? 'सूची देखें' : 'View List') : `+ ${lang === 'hi' ? 'नया विषय लिखें' : 'Add Custom Subject'}`}</span>
                </button>
              </div>

              {showCustomSubjectInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? 'नया विषय लिखें (उदा. Botany, Hindi, History)...' : 'Type custom subject name (e.g. Botany, Hindi)...'}
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-blue-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder-slate-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewSubject();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewSubject}
                    disabled={!customSubjectName.trim()}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs uppercase cursor-pointer transition-all disabled:opacity-50"
                  >
                    {lang === 'hi' ? 'जोड़ें' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomSubjectInput(false)}
                    className="p-3 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <select
                  value={subject}
                  onChange={(e) => {
                    if (e.target.value === '__CUSTOM_SUBJECT_NEW__') {
                      setShowCustomSubjectInput(true);
                    } else {
                      setSubject(e.target.value);
                    }
                  }}
                  className="w-full bg-slate-950 border border-white/15 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {subjectsList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="__CUSTOM_SUBJECT_NEW__" className="text-blue-400 font-bold bg-slate-900">
                    + {lang === 'hi' ? 'नया विषय लिखें (Custom Subject)...' : 'Type Custom Subject...'}
                  </option>
                </select>
              )}
            </div>

            {/* Assign To (Target) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-white uppercase tracking-wider">
                4. {lang === 'hi' ? 'किसे सौंपें (Assign To)' : 'Assign To (Batch / Students)'}
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-white/15 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTargetType('batch')}
                  className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    targetType === 'batch' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'hi' ? 'बैच' : 'Batch'}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('all')}
                  className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    targetType === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'hi' ? 'सभी' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('selected')}
                  className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    targetType === 'selected' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'hi' ? 'चुनिंदा' : 'Selected'}
                </button>
              </div>
            </div>
          </div>

          {/* Target Batch Selector */}
          {targetType === 'batch' && (
            <div className="p-3 bg-slate-950 rounded-2xl border border-white/10 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Select Target Batch</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {DEFAULT_BATCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Selected Students Picker (with Search, Select All, Deselect) */}
          {targetType === 'selected' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="Search students by name or roll..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="px-2.5 py-1.5 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllStudents}
                  className="px-2.5 py-1.5 bg-white/5 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold"
                >
                  Deselect
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto custom-scrollbar space-y-1.5">
                {filteredStudents.map(student => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-600/20 border-blue-500 text-white' 
                          : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-600'}`}>
                          {isSelected && <Check size={12} />}
                        </div>
                        <span className="font-semibold">{student.name}</span>
                        {student.roll && <span className="text-[10px] text-slate-500">Roll: {student.roll}</span>}
                      </div>
                      <span className="text-[10px] text-slate-400">{student.batch}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-blue-400 font-bold">
                {selectedStudentIds.length} of {availableStudents.length} students selected
              </p>
            </div>
          )}

          {/* 5. DEADLINE & 6. TOTAL MARKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-white uppercase tracking-wider">
                5. {lang === 'hi' ? 'जमा करने की अंतिम तिथि (Deadline)' : 'Deadline (Date + Time)'}
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
              />
              <span className="text-[10px] text-slate-500 block">Default is 3 days from now.</span>
            </div>

            {/* Total Marks */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-white uppercase tracking-wider">
                6. {lang === 'hi' ? 'कुल अंक (Total Marks)' : 'Total Marks'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={500}
                  required
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/15 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-bold"
                />
                <div className="flex gap-1">
                  {[25, 50, 100].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTotalMarks(m)}
                      className={`px-2.5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        totalMarks === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 7. SUBMISSION TYPE DROPDOWN (3 Max Options) */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-white uppercase tracking-wider">
              7. {lang === 'hi' ? 'जमा करने का प्रकार (Submission Type)' : 'Submission Type (Max 3 Options)'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option a) Submit in App */}
              <button
                type="button"
                onClick={() => setSubmissionType('in_app')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  submissionType === 'in_app' 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg' 
                    : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">📱</span>
                  {submissionType === 'in_app' && <CheckCircle2 size={16} className="text-blue-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{lang === 'hi' ? 'ऐप में जमा करें' : 'Submit in App'}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {lang === 'hi' ? 'फोटो, PDF फ़ाइल, ऑडियो या टेक्स्ट' : 'Photo, PDF, text, audio or link upload'}
                  </p>
                </div>
              </button>

              {/* Option b) Do in notebook and show in class */}
              <button
                type="button"
                onClick={() => setSubmissionType('notebook')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  submissionType === 'notebook' 
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg' 
                    : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">📓</span>
                  {submissionType === 'notebook' && <CheckCircle2 size={16} className="text-purple-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{lang === 'hi' ? 'कॉपी में करके दिखाएं' : 'Notebook / Show in Class'}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {lang === 'hi' ? 'कोई फ़ाइल नहीं; छात्र "मैंने कर लिया" दबाएगा' : 'No upload; student taps "Maine kar liya"'}
                  </p>
                </div>
              </button>

              {/* Option c) Notice Only */}
              <button
                type="button"
                onClick={() => setSubmissionType('notice_only')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  submissionType === 'notice_only' 
                    ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg' 
                    : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">📢</span>
                  {submissionType === 'notice_only' && <CheckCircle2 size={16} className="text-amber-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{lang === 'hi' ? 'केवल सूचना' : 'Notice / Reading Only'}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {lang === 'hi' ? 'कुछ भी जमा नहीं करना; केवल पढ़ना' : 'Informational; nothing to submit'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* MORE OPTIONS (Collapsible Drawer) */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="w-full py-2.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400" />
                <span>{lang === 'hi' ? 'अतिरिक्त विकल्प (More Options)' : 'More Options (Late Submission, Resubmit, Draft)'}</span>
              </span>
              {showMoreOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showMoreOptions && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 mt-3 space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Allow late submission */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowLate}
                      onChange={(e) => setAllowLate(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{lang === 'hi' ? 'अंतिम तिथि के बाद भी जमा करने की अनुमति दें' : 'Allow Late Submission after Deadline'}</span>
                  </label>

                  {allowLate && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Late Allowed Until</label>
                        <input
                          type="datetime-local"
                          value={lateUntil}
                          onChange={(e) => setLateUntil(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Marks Penalty / Day</label>
                        <input
                          type="number"
                          value={latePenaltyPerDay}
                          onChange={(e) => setLatePenaltyPerDay(Number(e.target.value))}
                          placeholder="Marks deducted per day"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Max attempts */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/5">
                  <span>Max Submissions per Student:</span>
                  <select
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(Number(e.target.value))}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value={1}>1 (Single submission)</option>
                    <option value={2}>2 (Allow 1 resubmit)</option>
                    <option value={3}>3 (Allow 2 resubmits)</option>
                    <option value={5}>Unlimited resubmits until deadline</option>
                  </select>
                </div>

                {/* Duplicate previous assignment */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">Duplicate Previous Assignment</p>
                    <p className="text-[10px] text-slate-400">Copy title, questions, instructions from your last assignment</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDuplicatePrevious}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Duplicate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 8. ASSIGN BUTTON BAR */}
        <footer className="p-4 sm:p-6 border-t border-white/10 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Save size={14} />
              <span>{lang === 'hi' ? 'ड्राफ़्ट सेव करें' : 'Save Draft'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            {/* BIG ASSIGN BUTTON */}
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/30 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen size={16} />
              <span>{lang === 'hi' ? 'असाइन करें और छात्रों को भेजें' : '8. Assign & Publish to Students'}</span>
            </button>
          </div>
        </footer>

        {/* Link input submodal */}
        {showLinkModal && (
          <div className="fixed inset-0 z-[250] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 w-full max-w-md space-y-4">
              <h4 className="text-sm font-bold text-white">Add Reference Link / YouTube Video</h4>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... or https://..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
