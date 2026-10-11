import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Download, Bookmark, BookmarkCheck, CheckCircle2, 
  ThumbsUp, ThumbsDown, MessageSquare, Send, FileText, 
  ZoomIn, ZoomOut, Moon, Sun, Volume2, Play, Pause, 
  ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Star,
  Maximize2, Minimize2
} from 'lucide-react';
import type { StudyMaterialItem, User as UserType } from '../../types.ts';

interface MaterialViewerModalProps {
  material: StudyMaterialItem;
  currentUser: UserType;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isCompleted: boolean;
  onToggleCompleted: () => void;
  onDownloadOffline?: () => void;
}

export const MaterialViewerModal: React.FC<MaterialViewerModalProps> = ({
  material,
  currentUser,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isCompleted,
  onToggleCompleted,
  onDownloadOffline
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'doubts' | 'notes'>('content');
  const [helpfulVote, setHelpfulVote] = useState<'up' | 'down' | null>(null);

  // PDF Viewer state
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isNightMode, setIsNightMode] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 14;

  // Personal notes
  const [personalNotes, setPersonalNotes] = useState<string>(() => {
    return localStorage.getItem(`material_notes_${material.id}_${currentUser.id}`) || '';
  });
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Fullscreen Reading Mode state
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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

  // Doubts thread
  const [doubtText, setDoubtText] = useState('');
  const [doubtMessages, setDoubtMessages] = useState<{ id: string; sender: string; text: string; time: string; role: string }[]>([
    { id: '1', sender: 'Aarav Sharma', text: 'Sir, in page 3 derivation, why is the integration limit taken from 0 to R instead of -R to R?', time: '2 hours ago', role: 'student' },
    { id: '2', sender: material.uploaderName, text: 'Good observation Aarav! Because of symmetry about the central axis, we integrate from 0 to R and multiply by 2.', time: '1 hour ago', role: 'teacher' }
  ]);

  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    setDoubtMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: currentUser.name || 'Student',
        text: doubtText.trim(),
        time: 'Just now',
        role: currentUser.role || 'student'
      }
    ]);
    setDoubtText('');
  };

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    localStorage.setItem(`material_notes_${material.id}_${currentUser.id}`, personalNotes);
    setTimeout(() => setIsSavingNotes(false), 400);
  };

  const isYouTube = material.fileUrl.includes('youtube.com') || material.fileUrl.includes('youtu.be');
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return createPortal(
    <div className={`fixed inset-0 z-[9999] !m-0 ${isFullscreen ? 'bg-slate-950 p-0' : 'bg-slate-950/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center overflow-y-auto custom-scrollbar'} animate-in fade-in duration-200 text-slate-100`}>
      <div className={`bg-slate-900 border ${isFullscreen ? 'w-screen h-screen max-w-none max-h-none rounded-none border-none shadow-none' : 'border-white/15 rounded-2xl sm:rounded-[2rem] w-full max-w-5xl h-[90vh] max-h-[92dvh] my-auto shadow-2xl'} flex flex-col overflow-hidden relative transition-all duration-200`}>
        
        {/* Fullscreen indicator banner */}
        {isFullscreen && (
          <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-white shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Full Screen Reading Mode Active (पूर्ण स्क्रीन मोड) • No Distractions
            </span>
            <button
              onClick={toggleFullscreen}
              className="px-2.5 py-0.5 bg-black/30 hover:bg-black/50 rounded-lg text-white font-bold flex items-center gap-1 text-[10px] cursor-pointer"
            >
              <Minimize2 size={12} /> Exit Fullscreen (ESC)
            </button>
          </div>
        )}
        
        {/* Top Header */}
        <header className="p-4 sm:p-5 border-b border-white/10 bg-slate-950 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {material.subject}
                </span>
                <span className="text-xs text-slate-400 truncate">{material.chapter}</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white font-montserrat truncate mt-0.5">
                {material.title}
              </h3>
            </div>
          </div>

          {/* Student Actions Bar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Fullscreen Reading Button */}
            <button
              onClick={toggleFullscreen}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isFullscreen 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
              }`}
              title={isFullscreen ? "Exit Fullscreen" : "Full Screen Reading Mode (पूर्ण स्क्रीन)"}
            >
              {isFullscreen ? <Minimize2 size={14} className="text-emerald-400" /> : <Maximize2 size={14} className="text-indigo-400" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
            </button>

            {/* Mark as done */}
            <button
              onClick={onToggleCompleted}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isCompleted 
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
              }`}
              title="Mark as read / studied"
            >
              <CheckCircle2 size={14} className={isCompleted ? 'text-white' : 'text-slate-400'} />
              <span className="hidden sm:inline">{isCompleted ? 'Marked Done' : 'Mark Done'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isBookmarked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Material"}
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>

            {/* Offline Download button */}
            {material.allowDownload !== false && (
              <button
                onClick={() => {
                  if (onDownloadOffline) onDownloadOffline();
                  alert(`📥 Downloading "${material.title}" for offline revision...\nFile saved to your offline downloads!`);
                }}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                title="Download for offline viewing"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Offline</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Sub-tabs: Document Viewer, Doubts Thread, Personal Notes */}
        <div className="flex bg-slate-900 border-b border-white/5 text-xs font-bold px-6">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'content' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Study Material Content
          </button>
          <button
            onClick={() => setActiveTab('doubts')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'doubts' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare size={13} />
            <span>Ask Doubts ({doubtMessages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notes' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>My Personal Notes</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
          
          {/* TAB 1: CONTENT VIEWER */}
          {activeTab === 'content' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
              
              {/* PDF TOOLBAR */}
              {material.type === 'pdf' && (
                <div className="p-2.5 bg-slate-900 border-b border-white/10 flex items-center justify-between text-xs px-6">
                  {/* Page Jump */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded bg-slate-800 disabled:opacity-30"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded bg-slate-800 disabled:opacity-30"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Zoom & Night mode */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setZoomLevel(z => Math.max(60, z - 15))}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="font-mono text-[11px]">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel(z => Math.min(180, z + 15))}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>

                    <button
                      onClick={() => setIsNightMode(!isNightMode)}
                      className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:text-white ml-2 cursor-pointer"
                      title="Toggle Night / Dark Mode"
                    >
                      {isNightMode ? <Sun size={14} /> : <Moon size={14} />}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ml-1 ${
                        isFullscreen
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 hover:text-white border-transparent'
                      }`}
                      title={isFullscreen ? "Exit Fullscreen" : "Full Screen Reading Mode"}
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {/* VIEWER VIEWPORT */}
              <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 pt-6 sm:pt-10 pb-20 flex flex-col items-center justify-start relative custom-scrollbar">
                
                {/* PDF Viewer Page Simulation */}
                {material.type === 'pdf' && (
                  <div 
                    className={`max-w-3xl w-full p-8 sm:p-12 rounded-2xl shadow-2xl transition-all border relative my-4 sm:my-6 ${
                      isNightMode 
                        ? 'bg-slate-900 border-white/10 text-slate-100' 
                        : 'bg-white border-slate-300 text-slate-900 shadow-xl'
                    }`}
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  >
                    {/* Watermark Protection (Name + Phone watermark) */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-around items-center opacity-5 overflow-hidden select-none">
                      <span className="text-4xl font-black uppercase rotate-[-25deg]">{currentUser.name} • {currentUser.mobileNumber}</span>
                      <span className="text-4xl font-black uppercase rotate-[-25deg]">{currentUser.name} • Future Legacy</span>
                    </div>

                    <div className="space-y-6">
                      <div className="border-b pb-4 border-slate-700/40">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Official Faculty Notes</span>
                        <h2 className="text-xl font-black mt-1 font-montserrat">{material.title}</h2>
                        <p className="text-xs text-slate-400 mt-1">Instructor: {material.uploaderName} • {material.chapter}</p>
                      </div>

                      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                        <p><strong>1. Fundamental Concept & Governing Laws:</strong></p>
                        <p>In this chapter, we derive the foundational relationships governing {material.chapter}. The differential formulation is given by:</p>
                        <div className="p-4 bg-slate-950/40 rounded-xl border border-white/10 font-mono text-center text-emerald-400">
                          ∫ B · dl = μ₀ (I_enclosed + ε₀ dΦ_E/dt)
                        </div>
                        <p>Where the displacement current represents the rate of change of electric flux between capacitor plates during charging.</p>
                        
                        <p><strong>2. High-Yield Exam Observations:</strong></p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-300">
                          <li>Direct formula application frequently appears in competitive NEET & JEE benchmarks.</li>
                          <li>Pay special attention to unit dimensional consistency in numericals.</li>
                          <li>Graph of flux vs frequency exhibits sharp resonance at ω₀ = 1/√(LC).</li>
                        </ul>
                      </div>

                      <div className="pt-8 border-t border-slate-700/40 flex justify-between text-[10px] text-slate-500">
                        <span>Page {currentPage} of {totalPages}</span>
                        <span>Verified Educational Resource</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Viewer (Embedded YouTube or HTML5) */}
                {material.type === 'video' && (
                  <div className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black flex items-center justify-center my-auto">
                    {isYouTube ? (
                      <iframe
                        src={getYouTubeEmbedUrl(material.fileUrl)}
                        title={material.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video
                        src={material.fileUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                )}

                {/* Image Viewer */}
                {material.type === 'image' && (
                  <div className="max-w-4xl max-h-[75vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black my-auto">
                    <img src={material.fileUrl} alt={material.title} className="w-full h-full object-contain" />
                  </div>
                )}

                {/* Audio Podcast Player */}
                {material.type === 'audio' && (
                  <div className="max-w-md w-full p-8 bg-slate-900 border border-white/10 rounded-3xl text-center space-y-6 shadow-2xl my-auto">
                    <div className="w-20 h-20 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/30">
                      <Volume2 size={36} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{material.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Audio Lecture • {material.uploaderName}</p>
                    </div>
                    <audio src={material.fileUrl} controls className="w-full" />
                  </div>
                )}

                {/* Plain Link */}
                {material.type === 'link' && (
                  <div className="max-w-md p-8 bg-slate-900 border border-white/10 rounded-3xl text-center space-y-4 my-auto">
                    <ExternalLink size={36} className="text-amber-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">{material.title}</h4>
                    <p className="text-xs text-slate-400">{material.fileUrl}</p>
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider"
                    >
                      <span>Open External Link</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom Helpful Rating Bar */}
              <div className="p-3 bg-slate-900 border-t border-white/10 flex items-center justify-between px-6 text-xs">
                <span className="text-slate-400">Was this study material helpful?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setHelpfulVote('up'); alert('Thank you for your feedback! 👍'); }}
                    className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                      helpfulVote === 'up' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={13} />
                    <span>Yes, helpful ({material.helpfulVotes + (helpfulVote === 'up' ? 1 : 0)})</span>
                  </button>
                  <button
                    onClick={() => { setHelpfulVote('down'); alert('Thank you for letting us know.'); }}
                    className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                      helpfulVote === 'down' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <ThumbsDown size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ASK DOUBTS THREAD */}
          {activeTab === 'doubts' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white">Doubts & Questions on this Material</h4>
                  <p className="text-[11px] text-slate-400">Questions asked here are answered directly by faculty {material.uploaderName}</p>
                </div>
              </div>

              {/* Doubts list */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {doubtMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border ${
                      msg.role === 'teacher' ? 'bg-emerald-950/30 border-emerald-500/30 ml-4' : 'bg-slate-900 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`font-bold ${msg.role === 'teacher' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {msg.sender} {msg.role === 'teacher' && '(Faculty)'}
                      </span>
                      <span className="text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Send doubt input */}
              <form onSubmit={handleSendDoubt} className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Type your question or clarification on this chapter..."
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Send size={14} />
                  <span>Ask Doubt</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PERSONAL NOTES */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white">My Personal Study Notes</h4>
                  <p className="text-[11px] text-slate-400">Jot down important points, tricky formula reminders, and exam tricks for quick revision.</p>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase"
                >
                  {isSavingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              <textarea
                rows={12}
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Write your notes here... e.g. Remember to double check the sign convention in question 4."
                className="w-full flex-1 bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-mono"
              />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
