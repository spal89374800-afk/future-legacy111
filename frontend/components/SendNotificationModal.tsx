
import React, { useState, useRef, useEffect } from 'react';
import useMediaRecorder, { UseMediaRecorderResult } from '../hooks/useMediaRecorder';
import { 
  X, Send, Calendar, Image as ImageIcon, Mic, Video, 
  Upload, Sparkles, Clock, Loader2, Save, Trash2,
  Play, Square, ShieldCheck
} from 'lucide-react';

interface SendNotificationModalProps {
  onClose: () => void;
  onSend: (message: string, media?: { url: string; type: 'image' | 'audio' | 'video' }, scheduledFor?: string | null) => void;
  onSaveRecording: (blob: Blob, type: 'audio' | 'video') => void;
}

type MediaTab = 'text' | 'image' | 'audio' | 'video';

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ onClose, onSend, onSaveRecording }) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<MediaTab>('text');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  
  const audioRecorder = useMediaRecorder({ audio: true });
  const videoRecorder = useMediaRecorder({ audio: true, video: true });
  
  const getRecorder = () => activeTab === 'audio' ? audioRecorder : videoRecorder;

  useEffect(() => {
    const recorder = getRecorder();
    if (recorder.previewStream && videoRef.current) {
        videoRef.current.srcObject = recorder.previewStream;
    }
  }, [getRecorder().previewStream, activeTab]);
  
  useEffect(() => {
      setUploadedFile(null);
      setImageUrl(null);
      audioRecorder.clearMedia();
      videoRecorder.clearMedia();
  }, [activeTab]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);
    let media;
    if (activeTab === 'image' && imageUrl) {
        media = { url: imageUrl, type: 'image' as const };
    } else if ((activeTab === 'audio' || activeTab === 'video')) {
        if(uploadedFile) {
            media = { url: uploadedFile.url, type: activeTab };
        } else {
             const recorder = getRecorder();
             if(recorder.mediaBlobUrl) {
                media = { url: recorder.mediaBlobUrl, type: activeTab };
             }
        }
    }
    
    const scheduledFor = isScheduled && scheduleDateTime ? new Date(scheduleDateTime).toISOString() : null;
    
    // Simulate network delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
    onSend(message, media, scheduledFor);
    setIsSubmitting(false);
  };
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFile({ url, name: file.name });
      audioRecorder.clearMedia();
      videoRecorder.clearMedia();
    }
  };

  const RecorderControls: React.FC<{recorder: UseMediaRecorderResult, type: 'audio' | 'video'}> = ({ recorder, type }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
      if (recorder.mediaBlob) {
        onSaveRecording(recorder.mediaBlob, type);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    };
    
    useEffect(() => {
      if (recorder.isRecording) setIsSaved(false);
      if(uploadedFile) recorder.clearMedia();
    }, [recorder.isRecording, uploadedFile]);

    return (
      <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4 shadow-inner">
          {type === 'video' && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/5">
              <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover transform -scale-x-100 ${!recorder.previewStream && 'hidden'}`}></video>
              {!recorder.previewStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 gap-3">
                  <Video size={40} className="opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Capture Input</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Status: <span className={recorder.isRecording ? "text-rose-500 animate-pulse" : "text-emerald-500"}>{recorder.status}</span>
            </p>
            {recorder.isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></div>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Live Node Recording</span>
              </div>
            )}
          </div>

          {recorder.mediaBlobUrl && (
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95">
              {type === 'audio' ? (
                <audio src={recorder.mediaBlobUrl} controls className="w-full accent-blue-600" />
              ) : (
                <video src={recorder.mediaBlobUrl} controls className="w-full rounded-xl" />
              )}
            </div>
          )}

          <div className="flex justify-center items-center gap-3">
            {!recorder.isRecording ? 
              <button 
                onClick={() => { recorder.startRecording(); setUploadedFile(null); }} 
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20"
              >
                <Play size={14} fill="currentColor" /> Initialize Capture
              </button>
              :
              <button 
                onClick={recorder.stopRecording} 
                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-900/20"
              >
                <Square size={14} fill="currentColor" /> Terminate Capture
              </button>
            }
            {recorder.mediaBlobUrl && (
               <button 
                onClick={handleSave} 
                className={`px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${isSaved ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/20'}`}
               >
                  {isSaved ? <ShieldCheck size={16} /> : <Save size={16} />}
                  {isSaved ? 'Archived' : 'Archive Node'}
              </button>
            )}
          </div>
      </div>
  )};

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Broadcast Protocol</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Neural Alert Distribution</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Alert Payload</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Enter the transmission narrative..." 
                  rows={3} 
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner min-h-[100px]" 
                  required
                />
             </div>
             
            <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                          type="checkbox" 
                          id="schedule" 
                          checked={isScheduled} 
                          onChange={(e) => {
                              setIsScheduled(e.target.checked);
                              if (!e.target.checked) setScheduleDateTime('');
                          }}
                          className="w-5 h-5 rounded-md bg-slate-800 border-white/10 text-blue-600 focus:ring-0 transition-all cursor-pointer"
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Temporal Scheduling</span>
                </label>
                {isScheduled && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-all" size={16} />
                          <input 
                              type="datetime-local" 
                              value={scheduleDateTime}
                              onChange={(e) => setScheduleDateTime(e.target.value)}
                              className="w-full bg-slate-800 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs text-white focus:outline-none appearance-none"
                              min={new Date().toISOString().slice(0, 16)}
                          />
                        </div>
                    </div>
                )}
            </div>

             <div className="space-y-4">
                <div className="flex gap-1 p-1 bg-slate-950/30 rounded-xl border border-white/5">
                    {[
                      { id: 'text', icon: <Sparkles size={14} />, label: 'Text' },
                      { id: 'image', icon: <ImageIcon size={14} />, label: 'Visual' },
                      { id: 'audio', icon: <Mic size={14} />, label: 'Vocal' },
                      { id: 'video', icon: <Video size={14} />, label: 'Stream' }
                    ].map(tab => (
                        <button 
                          key={tab.id} 
                          onClick={() => setActiveTab(tab.id as MediaTab)} 
                          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="animate-in fade-in duration-500">
                    {activeTab === 'image' && (
                        <div className="space-y-4">
                            <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" id="notif-image-upload" />
                            <button 
                              type="button" 
                              onClick={() => document.getElementById('notif-image-upload')?.click()}
                              className="w-full p-8 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-500 hover:bg-white/5 hover:border-blue-500/30 transition-all flex flex-col items-center gap-4 group"
                            >
                                <Upload size={32} className="group-hover:scale-110 group-hover:text-blue-400 transition-all" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Inject High-Fidelity Visual</span>
                            </button>
                            {imageUrl && (
                              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group animate-in zoom-in-95">
                                <img src={imageUrl} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                                <button onClick={() => setImageUrl(null)} className="absolute top-4 right-4 p-2 bg-rose-600/80 text-white rounded-xl hover:bg-rose-500 transition-all shadow-lg"><Trash2 size={16} /></button>
                              </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'audio' && (
                        <div className="space-y-4">
                            <RecorderControls recorder={audioRecorder} type="audio" />
                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-white/5 flex-1"></div>
                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Manual Uplink</span>
                                <div className="h-px bg-white/5 flex-1"></div>
                            </div>
                            <input type="file" accept="audio/*" ref={audioFileInputRef} onChange={handleMediaFileChange} className="hidden" />
                            <button type="button" onClick={() => audioFileInputRef.current?.click()} className="w-full py-4 bg-slate-800 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3">
                              <Upload size={16} /> Select From Archive
                            </button>
                            {uploadedFile && <p className="text-[9px] font-black text-blue-400 mt-2 text-center uppercase tracking-widest truncate px-4">Node Link: {uploadedFile.name}</p>}
                        </div>
                    )}
                    {activeTab === 'video' && (
                        <div className="space-y-4">
                            <RecorderControls recorder={videoRecorder} type="video" />
                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-white/5 flex-1"></div>
                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Manual Uplink</span>
                                <div className="h-px bg-white/5 flex-1"></div>
                            </div>
                            <input type="file" accept="video/*" ref={videoFileInputRef} onChange={handleMediaFileChange} className="hidden" />
                            <button type="button" onClick={() => videoFileInputRef.current?.click()} className="w-full py-4 bg-slate-800 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3">
                              <Upload size={16} /> Select From Archive
                            </button>
                            {uploadedFile && <p className="text-[9px] font-black text-rose-400 mt-2 text-center uppercase tracking-widest truncate px-4">Node Link: {uploadedFile.name}</p>}
                        </div>
                    )}
                    {activeTab === 'text' && (
                      <div className="py-12 text-center space-y-4 opacity-30">
                        <Clock size={48} className="mx-auto" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em]">Temporal Transmission Only</p>
                      </div>
                    )}
                </div>
             </div>
        </div>

        <footer className="p-8 bg-slate-900 border-t border-white/5 flex justify-end gap-4 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
          <button type="button" onClick={onClose} className="px-8 py-4 text-slate-500 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Abort</button>
          <button 
            type="button" 
            onClick={handleSend} 
            disabled={!message.trim() || (isScheduled && !scheduleDateTime) || isSubmitting} 
            className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            {isScheduled && scheduleDateTime ? 'Authorize Temporal Broadcast' : 'Authorize Instant Broadcast'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SendNotificationModal;
