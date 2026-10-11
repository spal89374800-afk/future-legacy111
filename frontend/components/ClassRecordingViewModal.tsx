import React, { useState } from 'react';
import { 
  Play, Download, MessageSquare, FileText, Users, Clock, 
  Calendar, CheckCircle2, ChevronRight, X, ArrowLeft, Volume2
} from 'lucide-react';
import type { LiveClassRecordingItem } from '../types.ts';

interface ClassRecordingViewModalProps {
  recording: LiveClassRecordingItem;
  onClose: () => void;
}

export const ClassRecordingViewModal: React.FC<ClassRecordingViewModalProps> = ({
  recording,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'attendance'>('chat');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDownload = (filename: string) => {
    alert(`📥 Downloading "${filename}" for offline study...\nFile saved to your offline downloads!`);
  };

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-5xl p-6 sm:p-8 shadow-2xl flex flex-col space-y-6 max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                Class Archive & Recording
              </span>
              <h3 className="text-base sm:text-lg font-black text-white font-montserrat truncate mt-1">
                {recording.title}
              </h3>
              <p className="text-xs text-slate-400">
                Faculty: <strong className="text-white">{recording.instructor}</strong> • {recording.subject} • {recording.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Video Replay Box */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group">
              <img 
                src={recording.thumbnailUrl} 
                alt={recording.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              
              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="relative z-10 w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-900/50 hover:scale-110 transition-all cursor-pointer"
                >
                  <Play size={32} fill="currentColor" className="ml-1" />
                </button>
              ) : (
                <div className="relative z-10 text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-600/30 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                    <Volume2 size={28} />
                  </div>
                  <p className="text-xs font-bold text-white">Playing Recorded HD Masterclass</p>
                  <span className="text-[10px] text-emerald-400 bg-black/60 px-3 py-1 rounded-full backdrop-blur">
                    Synced with Live Chat Log below
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                <span className="bg-black/60 px-3 py-1 rounded-full text-[10px] font-mono backdrop-blur flex items-center gap-1.5">
                  <Clock size={12} className="text-rose-400" />
                  {recording.duration}
                </span>
                <span className="bg-black/60 px-3 py-1 rounded-full text-[10px] backdrop-blur flex items-center gap-1.5">
                  <Users size={12} className="text-blue-400" />
                  {recording.attendanceCount} Students Attended
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDownload(`${recording.title}-OfflineVideo.mp4`)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Download size={14} />
                <span>Download Video (HD MP4)</span>
              </button>

              <button
                onClick={() => handleDownload(`${recording.title}-FullNotesBundle.pdf`)}
                className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <FileText size={14} />
                <span>Download Class Notes (PDF)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Synced Chat History, Notes & Attendance */}
          <div className="lg:col-span-5 bg-slate-950/70 border border-white/10 rounded-3xl p-5 flex flex-col min-h-0 space-y-4">
            {/* Tabs */}
            <div className="flex gap-1.5 bg-slate-900 p-1 rounded-2xl border border-white/5 text-[11px]">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare size={13} />
                <span>Chat History ({recording.chatHistory.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'notes' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText size={13} />
                <span>Notes & PDFs ({recording.notes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'attendance' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>Attendance</span>
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              {activeTab === 'chat' && (
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 font-medium">
                    Questions & doubts asked by students during the live synchronized broadcast:
                  </p>
                  {recording.chatHistory.map((msg) => (
                    <div key={msg.id} className="bg-slate-900/80 p-3 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-indigo-300">{msg.senderName}</span>
                        <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                      {msg.isSolved && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={10} /> Faculty Answered
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 font-medium">
                    Official chapter slides, handwritten derivation notes, and question sheets:
                  </p>
                  {recording.notes.map((note) => (
                    <div key={note.id} className="bg-slate-900 p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText size={18} className="text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{note.title}</p>
                          <p className="text-[10px] text-slate-400">{note.fileSize} • Uploaded by {note.uploadedBy}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(note.fileName)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer shadow"
                      >
                        <Download size={11} />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="space-y-3">
                  <div className="bg-slate-900 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Attended</span>
                      <p className="text-2xl font-black text-emerald-400 font-mono">{recording.attendanceCount}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-bold">
                      ✓ Verified Live Room
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Attendance was automatically logged for this session. All enrolled students who attended received credit for course completion certificate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
