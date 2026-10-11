
import React, { useState, useEffect } from 'react';
import type { SavedRecording, UserRole } from '../types.ts';
import SimpleConfirmationModal from './SimpleConfirmationModal.tsx';
import { Video, Music, Download, Trash2, Clock, Search, Filter, ShieldCheck, PlayCircle, Eye, Shield } from 'lucide-react';

interface RecordingCardProps {
  recording: SavedRecording;
  onDelete: (id: number) => void;
  isTeacherOrAdmin?: boolean;
}

const RecordingCard: React.FC<RecordingCardProps> = ({ recording, onDelete, isTeacherOrAdmin }) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    // If it's a blob, create a URL, otherwise use the provided string URL
    if (recording.blob) {
      const url = URL.createObjectURL(recording.blob);
      setMediaUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMediaUrl(recording.url);
    }
  }, [recording.blob, recording.url]);
  
  const handleDownload = () => {
    if (mediaUrl) {
      const a = document.createElement('a');
      a.href = mediaUrl;
      const fileExtension = recording.type === 'video' ? 'webm' : 'ogg';
      a.download = `${recording.title.replace(/[^\w\s]/gi, '')}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all shadow-2xl">
      <div className="p-8 flex-grow flex flex-col space-y-6">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-white/5 shadow-inner">
          {mediaUrl && recording.type === 'video' && (
            <video src={mediaUrl} controls className="w-full h-full object-cover"></video>
          )}
          {mediaUrl && recording.type === 'audio' && (
            <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
               <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                  <Music size={32} />
               </div>
               <audio src={mediaUrl} controls className="w-full accent-blue-600"></audio>
            </div>
          )}
          {!mediaUrl && (
             <div className="h-full flex items-center justify-center">
                <ShieldCheck size={48} className="text-slate-800" />
             </div>
          )}
        </div>

        <div>
           <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${recording.type === 'video' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                 {recording.type} Dispatch
              </span>
              <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                 <Clock size={10} />
                 {new Date(recording.timestamp).toLocaleDateString()}
              </div>
           </div>
           <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors truncate uppercase font-montserrat tracking-tight">
             {recording.title}
           </h3>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 border-t border-white/5 flex justify-end items-center gap-3">
        <button 
          onClick={handleDownload} 
          className="flex-1 py-3.5 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 font-black rounded-xl transition-all uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={14} />
          Archive Local
        </button>
        {isTeacherOrAdmin && (
          <button 
            onClick={() => onDelete(recording.id)} 
            className="p-3.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Delete archive asset"
          >
             <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

interface MediaLibraryPageProps {
  recordings: SavedRecording[];
  onDelete: (id: number) => void;
  userRole?: UserRole;
}

const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({ recordings, onDelete, userRole }) => {
  const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const handleDeleteConfirm = () => {
    if (deletingId) {
      onDelete(deletingId);
    }
    setDeletingId(null);
  };

  const filteredRecs = recordings.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black uppercase tracking-widest">
            <Video size={12} />
            {isTeacherOrAdmin ? 'Encrypted Faculty Vault' : 'Student Lecture Archives (रिकॉर्डेड लेक्चर्स)'}
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat">Media Library</h2>
          <p className="text-slate-500 font-medium max-w-xl">Central repository for archived academic transmissions, vocal briefs, and instructional stream assets.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-all" size={16} />
            <input 
              type="text" 
              placeholder="Search vault archives..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all w-full md:w-64"
            />
          </div>
        </div>
      </header>

      {filteredRecs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(rec => (
            <RecordingCard key={rec.id} recording={rec} onDelete={setDeletingId} isTeacherOrAdmin={isTeacherOrAdmin} />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-slate-700 shadow-inner">
             <Video size={48} />
          </div>
          <div className="max-w-xs space-y-2">
             <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight">Vault Standby</h4>
             <p className="text-slate-600 text-sm font-medium leading-relaxed">
               No archived assets detected in this node. Authorized recordings from schedules or notifications will appear here for retrieval.
             </p>
          </div>
        </div>
      )}
      
      {deletingId && (
        <SimpleConfirmationModal
            title="Purge Archive Asset"
            message="Are you sure you want to permanently delete this neural transmission? This action cannot be reversed within current node version."
            onClose={() => setDeletingId(null)}
            onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default MediaLibraryPage;
