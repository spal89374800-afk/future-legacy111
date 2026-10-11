import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Download, BookOpen, ZoomIn, ZoomOut, Moon, Sun, 
  ArrowLeft, ArrowRight, ShieldCheck, Maximize2, Minimize2,
  Bookmark, BookmarkCheck, FileText, CheckCircle2, Coffee
} from 'lucide-react';
import type { LibraryItem } from '../types.ts';

interface ELibraryReaderModalProps {
  item: LibraryItem;
  onClose: () => void;
  onDownload: (item: LibraryItem) => void;
}

export const ELibraryReaderModal: React.FC<ELibraryReaderModalProps> = ({
  item,
  onClose,
  onDownload
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 18;
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [themeMode, setThemeMode] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`elib_bookmarked_${item.id}`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [personalNotes, setPersonalNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(`elib_notes_${item.id}`) || '';
    } catch {
      return '';
    }
  });
  const [activeTab, setActiveTab] = useState<'book' | 'notes'>('book');
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch {}
  };

  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      localStorage.setItem(`elib_bookmarked_${item.id}`, String(next));
    } catch {}
  };

  const handleSaveNotes = () => {
    try {
      localStorage.setItem(`elib_notes_${item.id}`, personalNotes);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 1500);
    } catch {}
  };

  const themeStyles = {
    dark: 'bg-slate-900 border-white/10 text-slate-100 shadow-2xl',
    sepia: 'bg-[#fbf0d9] border-[#e4d4b6] text-[#433422] shadow-2xl',
    light: 'bg-white border-slate-300 text-slate-900 shadow-2xl'
  };

  return createPortal(
    <div className={`fixed inset-0 z-[9999] !m-0 ${
      isFullscreen 
        ? 'bg-slate-950 p-0' 
        : 'bg-slate-950/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center overflow-y-auto custom-scrollbar'
    } animate-in fade-in duration-200 text-slate-100`}>
      <div className={`bg-slate-900 border ${
        isFullscreen 
          ? 'w-screen h-screen max-w-none max-h-none rounded-none border-none shadow-none' 
          : 'border-white/15 rounded-2xl sm:rounded-[2rem] w-full max-w-5xl h-[90vh] max-h-[92dvh] my-auto shadow-2xl'
      } flex flex-col overflow-hidden relative transition-all duration-200`}>
        
        {/* Fullscreen indicator banner */}
        {isFullscreen && (
          <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-white shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Full Screen Reading Mode Active (पूर्ण स्क्रीन मोड) • Press ESC or click Exit to restore
            </span>
            <button
              onClick={toggleFullscreen}
              className="px-2.5 py-0.5 bg-black/30 hover:bg-black/50 rounded-lg text-white font-bold flex items-center gap-1 text-[10px] cursor-pointer"
            >
              <Minimize2 size={12} /> Exit Fullscreen
            </button>
          </div>
        )}

        {/* Top Header */}
        <header className="p-3.5 sm:p-4 border-b border-white/10 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all"
              title="Close reader (Back)"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {item.type}
                </span>
                <span className="text-xs text-slate-400 truncate">Author: {item.author}</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white font-montserrat truncate mt-0.5">
                {item.title}
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Fullscreen Reading Mode Button */}
            <button
              onClick={toggleFullscreen}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isFullscreen 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow' 
                  : 'bg-indigo-600/30 text-indigo-300 hover:text-white hover:bg-indigo-600/50 border border-indigo-500/30'
              }`}
              title={isFullscreen ? "Exit Fullscreen" : "Full Screen Reading Mode (पूर्ण स्क्रीन)"}
            >
              {isFullscreen ? <Minimize2 size={14} className="text-emerald-400" /> : <Maximize2 size={14} className="text-indigo-400" />}
              <span className="hidden sm:inline font-bold">{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border-white/10'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark this Asset"}
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>

            {/* Download */}
            <button
              onClick={() => onDownload(item)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/10 cursor-pointer"
              title="Download File"
            >
              <Download size={16} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Secondary Toolbar (Pagination, Zoom, Themes, Notes Tab) */}
        <div className="p-2.5 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs px-4 sm:px-6 shrink-0">
          {/* Tabs: Book vs Personal Notes */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'book' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={13} className="inline mr-1" />
              Document
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'notes' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText size={13} className="inline mr-1" />
              My Notes
            </button>
          </div>

          {activeTab === 'book' && (
            <>
              {/* Page Jump */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Previous Page"
                >
                  <ArrowLeft size={14} />
                </button>
                <span className="font-semibold text-slate-300">
                  Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Next Page"
                >
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Theme & Zoom */}
              <div className="flex items-center gap-2">
                {/* Theme Selector */}
                <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`p-1 rounded ${themeMode === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Night Mode"
                  >
                    <Moon size={13} />
                  </button>
                  <button
                    onClick={() => setThemeMode('sepia')}
                    className={`p-1 rounded ${themeMode === 'sepia' ? 'bg-amber-900/60 text-amber-200' : 'text-slate-400 hover:text-amber-300'}`}
                    title="Sepia Reading Mode"
                  >
                    <Coffee size={13} />
                  </button>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`p-1 rounded ${themeMode === 'light' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                    title="Clean White Light Mode"
                  >
                    <Sun size={13} />
                  </button>
                </div>

                {/* Zoom */}
                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    onClick={() => setZoomLevel(z => Math.max(70, z - 15))}
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span className="font-mono text-[11px] w-9 text-center text-slate-300">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(z => Math.min(160, z + 15))}
                    className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* READER VIEWPORT */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 pt-6 sm:pt-10 pb-20 flex flex-col items-center justify-start relative custom-scrollbar">
          
          {activeTab === 'book' ? (
            /* Document Page Simulation */
            <div 
              className={`max-w-3xl w-full p-8 sm:p-12 rounded-2xl transition-all border relative my-4 sm:my-6 ${themeStyles[themeMode]}`}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Watermark Protection */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-around items-center opacity-5 overflow-hidden select-none">
                <span className="text-4xl font-black uppercase rotate-[-25deg]">Future Legacy Universal E-Library</span>
                <span className="text-4xl font-black uppercase rotate-[-25deg]">Authorized Student Reading Node</span>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-4 border-current/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                      Archive Repository • {item.type}
                    </span>
                    <span className="text-[10px] opacity-60">Section {currentPage}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black mt-2 font-montserrat">{item.title}</h2>
                  <p className="text-xs opacity-75 mt-1 font-medium">Author: {item.author}</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans">
                  <p className="font-semibold text-sm sm:text-base opacity-95">
                    {currentPage === 1 ? 'Prologue & Executive Overview:' : `Chapter ${currentPage}: Advanced Methodologies & Theoretical Framework:`}
                  </p>
                  <p className="italic opacity-80 border-l-2 border-blue-500/40 pl-3">
                    "{item.description}"
                  </p>
                  
                  <div className="p-4 sm:p-5 rounded-xl border border-current/15 bg-black/5 font-mono text-center text-xs sm:text-sm my-4">
                    {currentPage % 2 === 1 
                      ? 'ΔG° = -RT ln(K_eq) = ΔH° - TΔS° • Principle of Thermodynamic Equilibrium' 
                      : '∇ × E = -∂B/∂t • Faraday-Maxwell Electromagnetic Induction Model'}
                  </div>

                  <p>
                    This archival asset is curated specifically for high-yield revision, competitive benchmark examinations, and practical mastery. Key foundational axioms require consistent cross-referencing with standard syllabus guidelines.
                  </p>

                  <div className="space-y-2 pt-2">
                    <p className="font-bold opacity-90">Essential Observations & Direct Applications:</p>
                    <ul className="list-disc pl-5 space-y-1.5 opacity-85">
                      <li>Verify dimensional coherence across all intermediate variables prior to numeric computation.</li>
                      <li>Critical edge conditions frequently emerge in standard multiple-choice configurations.</li>
                      <li>Consult faculty guidance or batch doubts channel for non-trivial edge proofs.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-current/20 flex items-center justify-between text-[11px] opacity-60">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    Verified Pedagogical Standard
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Personal Notes Tab */
            <div className="max-w-2xl w-full bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl my-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white">Personal Study Notes</h4>
                  <p className="text-xs text-slate-400">Notes are saved locally on your device for this resource.</p>
                </div>
                {isSavedToast && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 size={13} /> Saved!
                  </span>
                )}
              </div>

              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Write your personal notes, mnemonics, formula reminders, and doubts here..."
                rows={12}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans resize-none leading-relaxed"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};
