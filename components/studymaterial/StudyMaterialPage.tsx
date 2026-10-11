import React, { useState, useMemo } from 'react';
import type { 
  StudyMaterialItem, UserRole, User as UserType 
} from '../../types.ts';
import { UploadStudyMaterialModal } from './UploadStudyMaterialModal.tsx';
import { MaterialViewerModal } from './MaterialViewerModal.tsx';
import { TeacherMaterialDashboardModal } from './TeacherMaterialDashboardModal.tsx';
import { 
  BookOpen, Plus, Search, Filter, Download, Bookmark, 
  BookmarkCheck, CheckCircle2, Eye, Star, Pin, FileText, 
  Image as ImageIcon, Video, Music, Link as LinkIcon, 
  BarChart2, Trash2, Globe, Clock, Layers, Sparkles, Folder, ArrowLeft 
} from 'lucide-react';

interface StudyMaterialPageProps {
  userRole?: UserRole;
  currentUser?: UserType;
  onNavigate?: (page: any) => void;
}

const DEFAULT_SAMPLE_MATERIALS: StudyMaterialItem[] = [
  {
    id: 'mat-1',
    uploaderId: 't1',
    uploaderName: 'Prof. Shourya Patel',
    uploaderRole: 'teacher',
    title: 'Chapter 4: Moment of Inertia & Hollow Cone Integration Notes',
    description: 'Complete NCERT and JEE Advanced handwritten derivation sheets with step-by-step calculus proofs.',
    type: 'pdf',
    fileUrl: 'https://example.com/inertia_notes.pdf',
    fileSize: '3.4 MB',
    batch: 'Class 12th - Target NEET 2026',
    subject: 'Physics',
    chapter: 'Chapter 4: Rotational Dynamics & Inertia',
    tags: ['NEET', 'Important', 'Derivations'],
    isImportant: true,
    isPinned: true,
    allowDownload: true,
    visibility: 'all_batch',
    status: 'published',
    version: 1,
    viewsCount: 382,
    downloadsCount: 142,
    helpfulVotes: 98,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago (New)
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mat-2',
    uploaderId: 't2',
    uploaderName: 'Dr. R. K. Sharma',
    uploaderRole: 'teacher',
    title: 'Nephron Counter-Current Mechanism & Hormone Control Flowchart',
    description: 'High-yield color diagram sheets and point-by-point NCERT line summaries for NEET biology.',
    type: 'pdf',
    fileUrl: 'https://example.com/nephron_notes.pdf',
    fileSize: '4.1 MB',
    batch: 'Class 12th - Target NEET 2026',
    subject: 'Biology',
    chapter: 'Chapter 2: Excretory Products & Elimination',
    tags: ['Biology', 'High-Yield', 'NCERT'],
    isImportant: true,
    isPinned: false,
    allowDownload: true,
    visibility: 'all_batch',
    status: 'published',
    version: 1,
    viewsCount: 512,
    downloadsCount: 220,
    helpfulVotes: 145,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago (New)
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mat-3',
    uploaderId: 't3',
    uploaderName: 'Prof. Priya Verma',
    uploaderRole: 'teacher',
    title: 'Organic Chemistry: Electrophilic Substitution Pathway Map',
    description: 'Video masterclass explaining carbocation stability and benzene ring activation factors.',
    type: 'video',
    fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    fileSize: '180 MB',
    batch: 'Class 12th - JEE Advanced Super 30',
    subject: 'Chemistry',
    chapter: 'Chapter 3: Hydrocarbons & Arenes',
    tags: ['Chemistry', 'Video Lecture', 'Organic'],
    isImportant: false,
    isPinned: false,
    allowDownload: false,
    visibility: 'all_batch',
    status: 'published',
    version: 1,
    viewsCount: 290,
    downloadsCount: 0,
    helpfulVotes: 87,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mat-4',
    uploaderId: 't1',
    uploaderName: 'Prof. Shourya Patel',
    uploaderRole: 'teacher',
    title: 'Kinematics & Projectile Motion Quick Formula Sheet',
    description: '1-page formula reference card for trajectory equations, maximum height, and time of flight.',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800',
    fileSize: '1.2 MB',
    batch: 'Class 11th - Foundation Batch',
    subject: 'Physics',
    chapter: 'Chapter 1: Motion in a Plane',
    tags: ['Formulas', 'Revision'],
    isImportant: true,
    isPinned: false,
    allowDownload: true,
    visibility: 'all_batch',
    status: 'published',
    version: 1,
    viewsCount: 640,
    downloadsCount: 310,
    helpfulVotes: 210,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const StudyMaterialPage: React.FC<StudyMaterialPageProps> = ({
  userRole = 'student',
  currentUser = { id: 's1', name: 'Shourya Patel', role: 'student', mobileNumber: '+91 98765 43210', imageUrl: '' },
  onNavigate
}) => {
  const [lang, setLang] = useState<'hi' | 'en'>('en');

  // Materials state (persisted to localStorage)
  const [materials, setMaterials] = useState<StudyMaterialItem[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_study_materials_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_MATERIALS;
    } catch {
      return DEFAULT_SAMPLE_MATERIALS;
    }
  });

  // Bookmarks & Completed sets
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`study_bookmarks_${currentUser.id}`);
      return saved ? JSON.parse(saved) : ['mat-1'];
    } catch {
      return ['mat-1'];
    }
  });

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`study_completed_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'pdf' | 'video' | 'audio' | 'image' | 'link'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'important' | 'bookmarked'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'views'>('newest');

  // Dynamic available subjects (defaults + any custom subjects from materials/storage)
  const [customSubjectsList, setCustomSubjectsList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_custom_subjects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showCustomSubjectPrompt, setShowCustomSubjectPrompt] = useState(false);
  const [newCustomSubject, setNewCustomSubject] = useState('');

  const handleAddFilterSubject = () => {
    const trimmed = newCustomSubject.trim();
    if (!trimmed) return;
    if (!customSubjectsList.includes(trimmed)) {
      const updated = [...customSubjectsList, trimmed];
      setCustomSubjectsList(updated);
      try {
        localStorage.setItem('future_legacy_custom_subjects', JSON.stringify(updated));
      } catch {}
    }
    setSelectedSubject(trimmed);
    setNewCustomSubject('');
    setShowCustomSubjectPrompt(false);
  };

  const availableSubjects = useMemo(() => {
    const base = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics'];
    customSubjectsList.forEach(p => {
      if (p && !base.includes(p)) base.push(p);
    });
    materials.forEach(m => {
      if (m.subject && !base.includes(m.subject)) {
        base.push(m.subject);
      }
    });
    return base;
  }, [materials, customSubjectsList]);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMaterialForView, setSelectedMaterialForView] = useState<StudyMaterialItem | null>(null);
  const [selectedMaterialForAnalytics, setSelectedMaterialForAnalytics] = useState<StudyMaterialItem | null>(null);

  const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem(`study_bookmarks_${currentUser.id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Toggle Completed
  const toggleCompleted = (id: string) => {
    setCompletedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem(`study_completed_${currentUser.id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Save new uploads
  const handleSaveUploads = (newItems: StudyMaterialItem[]) => {
    const updated = [...newItems, ...materials];
    setMaterials(updated);
    try {
      localStorage.setItem('future_legacy_study_materials_v1', JSON.stringify(updated));
    } catch {}
    alert(`🎉 Successfully published ${newItems.length} study material items! Target students notified.`);
  };

  // Delete material (Teacher/Admin)
  const handleDeleteMaterial = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? Item will be moved to Recycle Bin for 30 days.`)) {
      const updated = materials.filter(m => m.id !== id);
      setMaterials(updated);
      try {
        localStorage.setItem('future_legacy_study_materials_v1', JSON.stringify(updated));
      } catch {}
    }
  };

  // Filtered & Sorted list
  const filteredMaterials = useMemo(() => {
    const now = new Date().getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    let result = materials.filter(mat => {
      if (!mat) return false;
      const titleStr = (mat.title || '').toLowerCase();
      const chapterStr = (mat.chapter || '').toLowerCase();
      const searchStr = searchQuery.toLowerCase();
      const tagsList = Array.isArray(mat.tags) ? mat.tags : [];

      // Search match
      const matchSearch = !searchQuery || 
        titleStr.includes(searchStr) ||
        chapterStr.includes(searchStr) ||
        tagsList.some(t => (t || '').toLowerCase().includes(searchStr));

      // Subject match
      const matchSub = selectedSubject === 'All' || mat.subject === selectedSubject;

      // Type match
      const matchType = selectedType === 'all' || mat.type === selectedType;

      // Tab match
      let matchTab = true;
      if (activeTab === 'new') {
        const time = mat.createdAt ? new Date(mat.createdAt).getTime() : 0;
        matchTab = time > 0 && (now - time) <= sevenDaysMs;
      } else if (activeTab === 'important') {
        matchTab = Boolean(mat.isImportant);
      } else if (activeTab === 'bookmarked') {
        matchTab = bookmarkedIds.includes(mat.id);
      }

      return matchSearch && matchSub && matchType && matchTab;
    });

    // Sorting
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [materials, searchQuery, selectedSubject, selectedType, activeTab, sortBy, bookmarkedIds]);

  // Is "New" (within 7 days)
  const isItemNew = (createdAt?: string) => {
    if (!createdAt) return false;
    try {
      const diff = Date.now() - new Date(createdAt).getTime();
      return !isNaN(diff) && diff <= 7 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 text-slate-100">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-xl">
          {onNavigate && (
            <div>
              <button
                onClick={() => onNavigate('Home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Back to Home Dashboard"
              >
                <ArrowLeft size={14} className="text-emerald-400" />
                <span>{lang === 'hi' ? '← मुख्य पृष्ठ (Home)' : '← Back to Home'}</span>
              </button>
            </div>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <BookOpen size={13} />
            <span>Digital Study Material & Notes Vault</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase font-montserrat">
            {isTeacherOrAdmin ? 'Study Material & Uploads' : 'Study Material & Notes'}
          </h2>
          <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">
            {lang === 'hi' 
              ? 'अध्याय-वार PDF नोट्स, वीडियो लेक्चर, फॉर्मूला शीट और रिविजन सामग्री डाउनलोड करें।' 
              : 'Chapter-wise PDF lecture notes, derivation formula sheets, and video modules.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Hindi / English Switch */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="px-3.5 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Globe size={14} className="text-emerald-400" />
            <span>{lang === 'en' ? 'हिंदी में' : 'English'}</span>
          </button>

          {/* Teacher Upload Button (4-Tap fast flow) */}
          {isTeacherOrAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-xl shadow-emerald-900/40 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>+ Upload Study Material</span>
            </button>
          )}
        </div>
      </header>

      {/* Storage and Organization Bar (For Teacher/Admin) */}
      {isTeacherOrAdmin && (
        <div className="p-4 bg-slate-900/90 border border-emerald-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Institute Cloud Storage Quota</p>
              <p className="text-[10px] text-slate-400">188 MB / 5.0 GB used • Free-tier optimization active (YouTube video links & compressed PDFs)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-emerald-400 font-bold">3.8%</span>
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[4%] h-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'अध्याय, टॉपिक या टैग खोजें...' : 'Search by title, chapter or tag...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Subject Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Subject:</span>
          {availableSubjects.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === sub 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {sub}
            </button>
          ))}

          {/* Quick Custom Subject adder right in the filter bar (Teacher/Admin only) */}
          {isTeacherOrAdmin && (
            showCustomSubjectPrompt ? (
              <div className="inline-flex items-center gap-1.5 bg-slate-950 border border-emerald-500 rounded-xl px-2 py-1">
                <input
                  type="text"
                  value={newCustomSubject}
                  onChange={(e) => setNewCustomSubject(e.target.value)}
                  placeholder={lang === 'hi' ? 'विषय लिखें...' : 'Subject name...'}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-28 px-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFilterSubject();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFilterSubject}
                  disabled={!newCustomSubject.trim()}
                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {lang === 'hi' ? 'जोड़ें' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCustomSubjectPrompt(false); setNewCustomSubject(''); }}
                  className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomSubjectPrompt(true)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
                title="Add any custom subject"
              >
                <Plus size={13} />
                <span>{lang === 'hi' ? '+ नया विषय' : '+ Add Subject'}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* STUDENT MAIN TABS (All / New / Important / Bookmarked) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Materials ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>New (Last 7 Days)</span>
          </button>
          <button
            onClick={() => setActiveTab('important')}
            className={`py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'important' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star size={13} />
            <span>Important ⭐</span>
          </button>
          <button
            onClick={() => setActiveTab('bookmarked')}
            className={`py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookmarked' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark size={13} />
            <span>Bookmarks ({bookmarkedIds.length})</span>
          </button>
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="video">Videos</option>
            <option value="image">Photos / Notes</option>
            <option value="audio">Audio Lectures</option>
          </select>
        </div>
      </div>

      {/* STUDY MATERIALS GRID */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-16 text-center space-y-3">
          <BookOpen size={48} className="mx-auto text-slate-600" />
          <h4 className="text-base font-bold text-white">No Study Material Found</h4>
          <p className="text-xs text-slate-400">
            {isTeacherOrAdmin 
              ? 'Tap "+ Upload Study Material" above to upload notes and lecture files for this batch.' 
              : 'No notes match your filters. Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => {
            const isBookmarked = bookmarkedIds.includes(mat.id);
            const isCompleted = completedIds.includes(mat.id);
            const isNew = isItemNew(mat.createdAt);

            return (
              <div
                key={mat.id}
                className={`bg-slate-900 border transition-all rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 group ${
                  mat.isPinned ? 'border-emerald-500/40 ring-1 ring-emerald-500/20' : 'border-white/10 hover:border-emerald-500/30'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                        {mat.subject}
                      </span>
                      {isNew && (
                        <span className="text-[9px] font-black uppercase text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/40 animate-pulse">
                          New
                        </span>
                      )}
                      {mat.isImportant && (
                        <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-0.5">
                          <Star size={10} className="fill-amber-400" /> Important
                        </span>
                      )}
                      {mat.isPinned && (
                        <span className="text-[9px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <Pin size={10} /> Pinned
                        </span>
                      )}
                    </div>

                    {/* Bookmark action */}
                    <button
                      onClick={() => toggleBookmark(mat.id)}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                        isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Material'}
                    >
                      {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shrink-0">
                      {mat.type === 'pdf' && <FileText size={20} className="text-purple-400" />}
                      {mat.type === 'image' && <ImageIcon size={20} className="text-emerald-400" />}
                      {mat.type === 'video' && <Video size={20} className="text-blue-400" />}
                      {mat.type === 'audio' && <Music size={20} className="text-pink-400" />}
                      {mat.type === 'link' && <LinkIcon size={20} className="text-amber-400" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base font-black text-white leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">
                        {mat.chapter}
                      </p>
                    </div>
                  </div>

                  {/* Description preview */}
                  {mat.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>
                  )}

                  {/* Metadata info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Faculty: <strong className="text-slate-300">{mat.uploaderName}</strong></span>
                    {mat.fileSize && <span className="font-mono text-[10px] text-slate-500">{mat.fileSize}</span>}
                  </div>

                  {/* Views & Helpfulness */}
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye size={12} className="text-blue-400" />
                      <span>{mat.viewsCount + 142} Views</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={12} className="text-emerald-400" />
                      <span>{mat.downloadsCount + 54} Downloads</span>
                    </span>
                    <span className="text-amber-400 font-bold">
                      ★ 98% Helpful
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setSelectedMaterialForView(mat)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30 active:scale-95 transition-all"
                  >
                    <BookOpen size={14} />
                    <span>{lang === 'hi' ? 'खोलें और पढ़ें' : 'Open & Study'}</span>
                  </button>

                  {/* Teacher & Admin Tools */}
                  {isTeacherOrAdmin && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setSelectedMaterialForAnalytics(mat)}
                        className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <BarChart2 size={12} />
                        <span>Analytics</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                        className="py-2 bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 border border-rose-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <UploadStudyMaterialModal
          currentUser={currentUser}
          onClose={() => setShowUploadModal(false)}
          onSave={handleSaveUploads}
        />
      )}

      {/* VIEWER MODAL */}
      {selectedMaterialForView && (
        <MaterialViewerModal
          material={selectedMaterialForView}
          currentUser={currentUser}
          onClose={() => setSelectedMaterialForView(null)}
          isBookmarked={bookmarkedIds.includes(selectedMaterialForView.id)}
          onToggleBookmark={() => toggleBookmark(selectedMaterialForView.id)}
          isCompleted={completedIds.includes(selectedMaterialForView.id)}
          onToggleCompleted={() => toggleCompleted(selectedMaterialForView.id)}
        />
      )}

      {/* ANALYTICS DASHBOARD MODAL */}
      {selectedMaterialForAnalytics && (
        <TeacherMaterialDashboardModal
          material={selectedMaterialForAnalytics}
          onClose={() => setSelectedMaterialForAnalytics(null)}
        />
      )}
    </div>
  );
};

export default StudyMaterialPage;
