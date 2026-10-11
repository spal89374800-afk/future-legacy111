import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Upload, Plus, FileText, Image as ImageIcon, Video, 
  Music, Link as LinkIcon, Check, CheckCircle2, AlertCircle, 
  Trash2, Sparkles, ChevronDown, ChevronUp, Globe, Loader2, 
  FolderPlus, Star, Lock, Eye, Download, ShieldCheck, ArrowLeft
} from 'lucide-react';
import type { StudyMaterialItem, User as UserType } from '../../types.ts';

interface UploadStudyMaterialModalProps {
  onClose: () => void;
  onSave: (materials: StudyMaterialItem[]) => void;
  currentUser: UserType;
  existingChapters?: string[];
  initialBatch?: string;
  initialSubject?: string;
}

const DEFAULT_BATCHES = [
  'Class 12th - Target NEET 2026',
  'Class 12th - JEE Advanced Super 30',
  'Class 11th - Foundation Batch',
  'Class 10th - Board Mastery',
  'All Students (Global)'
];

const DEFAULT_SUBJECTS = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'];

interface SelectedFileItem {
  id: string;
  file?: File;
  name: string;
  cleanTitle: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'link';
  sizeMB: number;
  url: string;
  progress: number;
  status: 'ready' | 'uploading' | 'done' | 'error';
  errorMessage?: string;
}

export const UploadStudyMaterialModal: React.FC<UploadStudyMaterialModalProps> = ({
  onClose,
  onSave,
  currentUser,
  existingChapters = [
    'Chapter 1: Electrostatics & Gauss Law',
    'Chapter 2: Current Electricity & Circuits',
    'Chapter 3: Magnetic Effects of Current',
    'Chapter 4: Rotational Dynamics & Inertia',
    'Chapter 5: Ray Optics & Wave Nature'
  ],
  initialBatch,
  initialSubject
}) => {
  // Language toggle
  const [lang, setLang] = useState<'hi' | 'en'>('en');

  // Remembered last selections
  const [selectedBatch, setSelectedBatch] = useState(() => {
    return initialBatch || localStorage.getItem('last_study_batch') || DEFAULT_BATCHES[0];
  });
  const [selectedSubject, setSelectedSubject] = useState(() => {
    return initialSubject || localStorage.getItem('last_study_subject') || DEFAULT_SUBJECTS[0];
  });
  const [selectedChapter, setSelectedChapter] = useState(() => {
    return localStorage.getItem('last_study_chapter') || existingChapters[0];
  });

  // Custom Subject list state (persisted)
  const [subjectsList, setSubjectsList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_custom_subjects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...DEFAULT_SUBJECTS, ...parsed]));
        }
      }
    } catch {}
    return DEFAULT_SUBJECTS;
  });
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');

  // Custom Batch list state (persisted)
  const [batchesList, setBatchesList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_custom_batches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...DEFAULT_BATCHES, ...parsed]));
        }
      }
    } catch {}
    return DEFAULT_BATCHES;
  });
  const [showCustomBatchInput, setShowCustomBatchInput] = useState(false);
  const [customBatchName, setCustomBatchName] = useState('');

  // Inline "Create New Chapter"
  const [showNewChapterInput, setShowNewChapterInput] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');

  // Selected files queue for bulk or single upload
  const [fileQueue, setFileQueue] = useState<SelectedFileItem[]>([]);
  const [pastedLink, setPastedLink] = useState('');
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  // "More options" collapsible
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Important, NCERT, Revision');
  const [isImportant, setIsImportant] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [allowDownload, setAllowDownload] = useState(true);
  const [visibility, setVisibility] = useState<'all_batch' | 'selected' | 'paid_only'>('all_batch');
  const [hasConfirmedRights, setHasConfirmedRights] = useState(true);

  // Clean filename helper (e.g., "Physics_Ch3_Notes.pdf" -> "Physics Ch3 Notes")
  const cleanFileName = (filename: string): string => {
    const withoutExt = filename.replace(/\.[^/.]+$/, '');
    return withoutExt
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Guess subject from filename
  const guessSubject = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('phy') || lower.includes('mechanic') || lower.includes('optic')) return 'Physics';
    if (lower.includes('chem') || lower.includes('organic') || lower.includes('inorganic')) return 'Chemistry';
    if (lower.includes('bio') || lower.includes('botany') || lower.includes('zoology')) return 'Biology';
    if (lower.includes('math') || lower.includes('calculus') || lower.includes('algebra')) return 'Mathematics';
    return selectedSubject;
  };

  // Handle multi-file pick
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fallbackType?: 'image' | 'pdf' | 'video' | 'audio') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: SelectedFileItem[] = [];

    Array.from(files).forEach((file) => {
      const sizeMB = file.size / (1024 * 1024);
      let detectedType: 'pdf' | 'doc' | 'image' | 'video' | 'audio' = fallbackType || 'pdf';

      if (file.type.includes('image')) detectedType = 'image';
      else if (file.type.includes('pdf')) detectedType = 'pdf';
      else if (file.type.includes('video')) detectedType = 'video';
      else if (file.type.includes('audio')) detectedType = 'audio';
      else if (file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.ppt')) detectedType = 'doc';

      // Limit check: PDF/doc/image 25MB, audio 50MB, video 200MB
      const limitMB = detectedType === 'video' ? 200 : detectedType === 'audio' ? 50 : 25;
      const isOverLimit = sizeMB > limitMB;

      const guessed = guessSubject(file.name);
      if (guessed && guessed !== selectedSubject) {
        setSelectedSubject(guessed);
      }

      newItems.push({
        id: `f-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        file,
        name: file.name,
        cleanTitle: cleanFileName(file.name),
        type: detectedType,
        sizeMB,
        url: URL.createObjectURL(file),
        progress: 0,
        status: isOverLimit ? 'error' : 'ready',
        errorMessage: isOverLimit ? `File exceeds ${limitMB} MB limit (${sizeMB.toFixed(1)} MB)` : undefined
      });
    });

    setFileQueue(prev => [...prev, ...newItems]);
  };

  // Add Link or YouTube
  const handleAddLink = () => {
    if (!pastedLink.trim()) return;
    const isYouTube = pastedLink.includes('youtube.com') || pastedLink.includes('youtu.be');
    const titleGuessed = isYouTube ? 'YouTube Video Lecture' : 'Web Study Link';

    const newItem: SelectedFileItem = {
      id: `link-${Date.now()}`,
      name: pastedLink.trim(),
      cleanTitle: titleGuessed,
      type: isYouTube ? 'video' : 'link',
      sizeMB: 0,
      url: pastedLink.trim().startsWith('http') ? pastedLink.trim() : `https://${pastedLink.trim()}`,
      progress: 100,
      status: 'ready'
    };

    setFileQueue(prev => [...prev, newItem]);
    setPastedLink('');
  };

  // Remove item from queue
  const handleRemoveItem = (id: string) => {
    setFileQueue(prev => prev.filter(item => item.id !== id));
  };

  // Add inline new chapter
  const handleAddNewChapter = () => {
    if (!newChapterName.trim()) return;
    const added = newChapterName.trim();
    setSelectedChapter(added);
    setShowNewChapterInput(false);
    setNewChapterName('');
  };

  // Add inline new custom subject (Teacher write & add)
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
    setSelectedSubject(trimmed);
    try {
      localStorage.setItem('last_study_subject', trimmed);
    } catch {}
    setCustomSubjectName('');
    setShowCustomSubjectInput(false);
  };

  // Add inline new custom batch (Teacher write & add)
  const handleAddNewBatch = () => {
    const trimmed = customBatchName.trim();
    if (!trimmed) return;
    if (!batchesList.includes(trimmed)) {
      const updated = [...batchesList, trimmed];
      setBatchesList(updated);
      try {
        localStorage.setItem('future_legacy_custom_batches', JSON.stringify(updated));
      } catch {}
    }
    setSelectedBatch(trimmed);
    try {
      localStorage.setItem('last_study_batch', trimmed);
    } catch {}
    setCustomBatchName('');
    setShowCustomBatchInput(false);
  };

  // Submit and Upload
  const handleUploadAll = async () => {
    if (fileQueue.length === 0) {
      alert(lang === 'hi' ? 'कृपया कम से कम एक फ़ाइल चुनें।' : 'Please select at least one file or link.');
      return;
    }

    if (!hasConfirmedRights) {
      alert('Please confirm that you have the right to share this educational material.');
      return;
    }

    setIsBulkUploading(true);

    // Save remembered selections
    try {
      localStorage.setItem('last_study_batch', selectedBatch);
      localStorage.setItem('last_study_subject', selectedSubject);
      localStorage.setItem('last_study_chapter', selectedChapter);
    } catch {}

    // Simulate progress per file
    for (let i = 0; i < fileQueue.length; i++) {
      setFileQueue(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading', progress: 50 } : f));
      await new Promise(res => setTimeout(res, 250));
      setFileQueue(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'done', progress: 100 } : f));
    }

    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const createdMaterials: StudyMaterialItem[] = fileQueue
      .filter(f => f.status !== 'error')
      .map(item => ({
        id: `mat-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        uploaderId: currentUser.id,
        uploaderName: currentUser.name || 'Faculty',
        uploaderRole: (currentUser.role === 'admin' ? 'admin' : 'teacher'),
        title: item.cleanTitle.trim() || item.name,
        description: description.trim() || `Study notes and practice material for ${selectedChapter}.`,
        type: item.type,
        fileUrl: item.url,
        fileSize: item.sizeMB > 0 ? `${item.sizeMB.toFixed(1)} MB` : undefined,
        batch: selectedBatch,
        subject: selectedSubject,
        chapter: selectedChapter,
        tags: tagsArray.length > 0 ? tagsArray : ['Revision', 'Notes'],
        isImportant,
        isPinned,
        isPremium,
        allowDownload,
        visibility,
        status: 'published',
        version: 1,
        viewsCount: 0,
        downloadsCount: 0,
        helpfulVotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

    setIsBulkUploading(false);
    onSave(createdMaterials);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] !m-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl sm:rounded-[2rem] w-full max-w-3xl h-full max-h-[92vh] sm:max-h-[88vh] shadow-2xl flex flex-col overflow-hidden text-slate-100 relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <header className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md shrink-0">
              <Upload size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {lang === 'hi' ? '4-स्टेप में अपलोड' : '4-Tap Fast Upload Flow'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-montserrat uppercase tracking-tight mt-1">
                {lang === 'hi' ? 'अध्ययन सामग्री अपलोड करें' : 'Upload Study Material'}
              </h3>
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
              <ArrowLeft size={14} className="text-emerald-400" />
              <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
            </button>

            {/* Hindi / English Switch */}
            <button
              type="button"
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 border border-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Globe size={13} className="text-emerald-400" />
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

        {/* 4-Tap Body (Max 5 Fields visible on main screen) */}
        <div className="p-5 sm:p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">

          {/* STEP 1 & 2: PICK FILES OR PASTE LINK */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider">
                1 & 2. {lang === 'hi' ? 'फ़ाइल चुनें या लिंक डालें (Multi-Select Supported)' : 'Pick Files or Paste URL (Multi-Select)'}
              </label>
              <span className="text-[10px] text-slate-400">PDF/Images: 25MB • Video: 200MB</span>
            </div>

            {/* Quick Pick Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Pick PDFs */}
              <label className="p-4 bg-slate-950 hover:bg-slate-800 border border-white/10 hover:border-purple-500/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group shadow">
                <FileText size={24} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">PDF / Docs</span>
                <span className="text-[10px] text-slate-500">Pick PDF</span>
                <input type="file" accept=".pdf,.doc,.docx" multiple onChange={(e) => handleFileSelect(e, 'pdf')} className="hidden" />
              </label>

              {/* Pick Images */}
              <label className="p-4 bg-slate-950 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group shadow">
                <ImageIcon size={24} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Photos / Notes</span>
                <span className="text-[10px] text-slate-500">Gallery/Camera</span>
                <input type="file" accept="image/*" multiple onChange={(e) => handleFileSelect(e, 'image')} className="hidden" />
              </label>

              {/* Pick Video */}
              <label className="p-4 bg-slate-950 hover:bg-slate-800 border border-white/10 hover:border-blue-500/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group shadow">
                <Video size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Video Lecture</span>
                <span className="text-[10px] text-slate-500">MP4 / WebM</span>
                <input type="file" accept="video/*" onChange={(e) => handleFileSelect(e, 'video')} className="hidden" />
              </label>

              {/* Pick Audio */}
              <label className="p-4 bg-slate-950 hover:bg-slate-800 border border-white/10 hover:border-pink-500/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group shadow">
                <Music size={24} className="text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Audio Podcast</span>
                <span className="text-[10px] text-slate-500">MP3 / Voice</span>
                <input type="file" accept="audio/*" onChange={(e) => handleFileSelect(e, 'audio')} className="hidden" />
              </label>
            </div>

            {/* Paste YouTube / Drive / Web link bar */}
            <div className="flex gap-2 pt-1">
              <input
                type="url"
                placeholder={lang === 'hi' ? 'या YouTube / Google Drive / वेब लिंक यहाँ पेस्ट करें...' : 'Or paste YouTube unlisted video link, Google Drive, or web URL...'}
                value={pastedLink}
                onChange={(e) => setPastedLink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
              >
                <LinkIcon size={14} className="text-amber-400" />
                <span>Add Link</span>
              </button>
            </div>

            {/* File Queue List (Editable titles & auto-filled names) */}
            {fileQueue.length > 0 && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>{fileQueue.length} {lang === 'hi' ? 'फ़ाइलें जोड़ी गईं (शीर्षक एडिट कर सकते हैं):' : 'File(s) Ready to Upload (Titles Auto-Cleaned):'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFileQueue([])}
                    className="text-[10px] text-slate-500 hover:text-red-400"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {fileQueue.map((item, idx) => (
                    <div key={item.id} className="p-2.5 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {item.type === 'pdf' && <FileText size={16} className="text-purple-400 shrink-0" />}
                        {item.type === 'image' && <ImageIcon size={16} className="text-emerald-400 shrink-0" />}
                        {item.type === 'video' && <Video size={16} className="text-blue-400 shrink-0" />}
                        {item.type === 'audio' && <Music size={16} className="text-pink-400 shrink-0" />}
                        {item.type === 'link' && <LinkIcon size={16} className="text-amber-400 shrink-0" />}

                        {/* Editable Clean Title */}
                        <input
                          type="text"
                          value={item.cleanTitle}
                          onChange={(e) => {
                            const updated = [...fileQueue];
                            updated[idx].cleanTitle = e.target.value;
                            setFileQueue(updated);
                          }}
                          className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.sizeMB > 0 && <span className="text-[10px] text-slate-400">{item.sizeMB.toFixed(1)} MB</span>}
                        {item.status === 'error' && <span className="text-[10px] text-rose-400 font-bold">{item.errorMessage}</span>}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: CHOOSE CLASS/BATCH, SUBJECT, CHAPTER */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <FolderPlus size={14} className="text-emerald-400" />
              <span>3. {lang === 'hi' ? 'बैच, विषय और अध्याय चुनें' : 'Choose Class/Batch, Subject & Chapter'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Batch */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    {lang === 'hi' ? 'कक्षा / बैच (Batch)' : 'Class / Batch'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomBatchInput(!showCustomBatchInput)}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>{showCustomBatchInput ? (lang === 'hi' ? 'सूची देखें' : 'View List') : `+ ${lang === 'hi' ? 'नया बैच लिखें' : 'Add Custom Batch'}`}</span>
                  </button>
                </div>

                {showCustomBatchInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'नया बैच नाम लिखें...' : 'Type custom batch name...'}
                      value={customBatchName}
                      onChange={(e) => setCustomBatchName(e.target.value)}
                      className="flex-1 bg-slate-950 border border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none placeholder-slate-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewBatch();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewBatch}
                      disabled={!customBatchName.trim()}
                      className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow disabled:opacity-50"
                    >
                      {lang === 'hi' ? 'जोड़ें' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomBatchInput(false)}
                      className="p-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedBatch}
                    onChange={(e) => {
                      if (e.target.value === '__CUSTOM_BATCH_NEW__') {
                        setShowCustomBatchInput(true);
                      } else {
                        setSelectedBatch(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {batchesList.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="__CUSTOM_BATCH_NEW__" className="text-emerald-400 font-bold bg-slate-900">
                      + {lang === 'hi' ? 'नया बैच लिखें (Custom Batch)...' : 'Type Custom Batch...'}
                    </option>
                  </select>
                )}
              </div>

              {/* Subject */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    {lang === 'hi' ? 'विषय (Subject)' : 'Subject'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomSubjectInput(!showCustomSubjectInput)}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>{showCustomSubjectInput ? (lang === 'hi' ? 'सूची देखें' : 'View List') : `+ ${lang === 'hi' ? 'नया विषय लिखें' : 'Add Custom Subject'}`}</span>
                  </button>
                </div>

                {showCustomSubjectInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'नया विषय लिखें (उदा. Botany, Hindi, History)...' : 'Type custom subject (e.g. Botany, Hindi, History)...'}
                      value={customSubjectName}
                      onChange={(e) => setCustomSubjectName(e.target.value)}
                      className="flex-1 bg-slate-950 border border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none placeholder-slate-500"
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
                      className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow disabled:opacity-50"
                    >
                      {lang === 'hi' ? 'जोड़ें' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomSubjectInput(false)}
                      className="p-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      if (e.target.value === '__CUSTOM_SUBJECT_NEW__') {
                        setShowCustomSubjectInput(true);
                      } else {
                        setSelectedSubject(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {subjectsList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="__CUSTOM_SUBJECT_NEW__" className="text-emerald-400 font-bold bg-slate-900">
                      + {lang === 'hi' ? 'नया विषय लिखें (Custom Subject)...' : 'Type Custom Subject...'}
                    </option>
                  </select>
                )}
              </div>
            </div>

            {/* Chapter with Inline "Create New Chapter" */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">
                  {lang === 'hi' ? 'अध्याय / टॉपिक (Chapter / Topic)' : 'Chapter / Topic Folder'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewChapterInput(!showNewChapterInput)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>+ {lang === 'hi' ? 'नया अध्याय बनाएं' : 'Create New Chapter'}</span>
                </button>
              </div>

              {showNewChapterInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new chapter name..."
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewChapter}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow"
                  >
                    Save Chapter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewChapterInput(false)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {existingChapters.map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* MORE OPTIONS (Collapsible) */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="w-full py-2.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                <span>{lang === 'hi' ? 'अतिरिक्त विकल्प (टैग, डाउनलोड अनुमति, आदि)' : 'More Options (Tags, Download Permissions, Visibility)'}</span>
              </span>
              {showMoreOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showMoreOptions && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 mt-3 space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    {lang === 'hi' ? 'संक्षिप्त विवरण (Description)' : 'Short Description / Notes'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High-yield formulas, NCERT derivation summary and exam graphs"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Revision, Formulas, NEET, Board PYQ"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowDownload}
                      onChange={(e) => setAllowDownload(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span>{lang === 'hi' ? 'ऑफलाइन डाउनलोड की अनुमति दें' : 'Allow Offline Download (PDF / Images)'}</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span>⭐ {lang === 'hi' ? '"Important" स्टार मार्क करें' : 'Mark as "Important" Material'}</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span>📌 {lang === 'hi' ? 'शीर्ष पर पिन करें (Pin to Top)' : 'Pin to Top of Chapter'}</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span>🔒 {lang === 'hi' ? 'प्रीमियम सामग्री (केवल एनरोल्ड छात्र)' : 'Premium Material (Paid Students Only)'}</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Copyright affirmation */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConfirmedRights}
                onChange={(e) => setHasConfirmedRights(e.target.checked)}
                className="rounded text-emerald-500 focus:ring-0"
              />
              <span>I confirm I have the right to share this educational material with students.</span>
            </label>
          </div>
        </div>

        {/* STEP 4: BIG UPLOAD BUTTON */}
        <footer className="p-4 sm:p-6 border-t border-white/10 bg-slate-950 flex items-center justify-between gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={fileQueue.length === 0 || isBulkUploading}
            onClick={handleUploadAll}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/40 cursor-pointer active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            {isBulkUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading {fileQueue.length} item(s)...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>4. {lang === 'hi' ? 'अपलोड करें और छात्रों को सूचित करें' : `Upload ${fileQueue.length > 0 ? `(${fileQueue.length} Items)` : ''} & Notify Students`}</span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};
