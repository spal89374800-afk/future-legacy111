import React, { useState, useRef, useEffect } from 'react';
import useMediaRecorder, { UseMediaRecorderResult } from '../hooks/useMediaRecorder';
import type { ClassSchedule, SkillClass, AgroClass, GuidanceClass } from '../types.ts';
import { generateImageFromPrompt } from '../services/api.ts';
import { 
  X, Calendar, Clock, Link as LinkIcon, Edit3, 
  Sparkles, Image as ImageIcon, Mic, Video, 
  Upload, Save, Zap, Loader2, Play, Square, 
  Trash2, ShieldCheck, Globe
} from 'lucide-react';

interface ScheduleFormModalProps {
  onClose: () => void;
  onSave: (data: Omit<ClassSchedule, 'id'>) => void;
  onSaveRecording: (blob: Blob, type: 'audio' | 'video') => void;
  skillClasses: SkillClass[];
  agroClasses: AgroClass[];
  guidanceClasses: GuidanceClass[];
}

type MediaTab = 'text' | 'image' | 'audio' | 'video';

const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({ 
  onClose, onSave, onSaveRecording, skillClasses, agroClasses, guidanceClasses 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    scheduleTime: '',
    text: '',
  });
  const [classSelection, setClassSelection] = useState('');
  const [customClassName, setCustomClassName] = useState('');
  const [activeTab, setActiveTab] = useState<MediaTab>('text');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'ai'>('url');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRecorder = useMediaRecorder({ audio: true });
  const videoRecorder = useMediaRecorder({ audio: true, video: true });
  
  const getRecorder = () => activeTab === 'audio' ? audioRecorder : videoRecorder;

  useEffect(() => {
    const recorder = getRecorder();
    if (recorder.previewStream && videoRef.current) {
        videoRef.current.srcObject = recorder.previewStream;
    }
  }, [getRecorder().previewStream, activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGenerationError('');
    try {
        const generatedImageUrl = await generateImageFromPrompt(imagePrompt);
        setImageUrl(generatedImageUrl);
    } catch (err: any) {
        setGenerationError('Neural synthesis link failure. Verify prompt context.');
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.scheduleTime || !classSelection) return;

    setIsSubmitting(true);
    const schedulePayload: Omit<ClassSchedule, 'id'> = {
        title: formData.title,
        scheduleTime: formData.scheduleTime,
        text: formData.text,
        className: '',
        author: "Chief Architect",
        authorImageUrl: "https://i.pravatar.cc/150?u=admin",
        timestamp: new Date().toISOString(),
    };
    
    if (classSelection === 'other') {
        schedulePayload.className = customClassName;
    } else {
        const [classType, classIdStr] = classSelection.split('-');
        const classId = parseInt(classIdStr, 10);
        let sourceArray: (SkillClass | AgroClass | GuidanceClass)[] = [];
        if (classType === 'skill') sourceArray = skillClasses;
        else if (classType === 'agro') sourceArray = agroClasses;
        else sourceArray = guidanceClasses;
        
        const selectedClass = sourceArray.find(c => c.id === classId);
        if (selectedClass) {
          schedulePayload.className = selectedClass.title;
          schedulePayload.classId = classId;
          schedulePayload.classType = classType as any;
        }
    }

    if (activeTab === 'image' && imageUrl) {
        schedulePayload.mediaUrl = imageUrl;
        schedulePayload.mediaType = 'image';
    } else if (activeTab === 'audio' && audioRecorder.mediaBlobUrl) {
        schedulePayload.mediaUrl = audioRecorder.mediaBlobUrl;
        schedulePayload.mediaType = 'audio';
    } else if (activeTab === 'video' && videoRecorder.mediaBlobUrl) {
        schedulePayload.mediaUrl = videoRecorder.mediaBlobUrl;
        schedulePayload.mediaType = 'video';
    }

    await new Promise(res => setTimeout(res, 1000));
    onSave(schedulePayload);
    setIsSubmitting(false);
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

    return (
      <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4 shadow-inner">
          {type === 'video' && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/5">
              <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover transform -scale-x-100 ${!recorder.previewStream && 'hidden'}`}></video>
              {!recorder.previewStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 gap-3">
                  <Video size={40} className="opacity-20" />
                  <p className="text-[9px] font-black uppercase tracking-widest px-8 text-center">Establish Camera Uplink</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Uplink: <span className={recorder.isRecording ? "text-rose-500 animate-pulse" : "text-emerald-500"}>{recorder.status}</span>
            </p>
          </div>

          {recorder.mediaBlobUrl && (
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 animate-in zoom-in-95">
              {type === 'audio' ? <audio src={recorder.mediaBlobUrl} controls className="w-full" /> : <video src={recorder.mediaBlobUrl} controls className="w-full rounded-xl" />}
            </div>
          )}

          <div className="flex justify-center items-center gap-3">
            {!recorder.isRecording ? 
              <button onClick={recorder.startRecording} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                <Play size={14} fill="currentColor" /> Initialize
              </button>
              :
              <button onClick={recorder.stopRecording} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-rose-500 transition-all flex items-center justify-center gap-2">
                <Square size={14} fill="currentColor" /> Terminate
              </button>
            }
            {recorder.mediaBlobUrl && (
               <button onClick={handleSave} className={`px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${isSaved ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                  {isSaved ? <ShieldCheck size={16} /> : <Save size={16} />}
                  {isSaved ? 'Archived' : 'Archive'}
              </button>
            )}
          </div>
      </div>
  )};

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Temporal Dispatch</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Academic Event Architecture</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={20} /></button>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Transmission Title</label>
               <input 
                 type="text" 
                 name="title" 
                 placeholder="e.g., Quantum Node Alpha Sync" 
                 value={formData.title} 
                 onChange={handleChange} 
                 className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner" 
                 required 
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><Clock size={12} /> Chronos Node</label>
                    <input 
                      type="datetime-local" 
                      name="scheduleTime" 
                      value={formData.scheduleTime} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none appearance-none" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><LinkIcon size={12} /> Academic Uplink</label>
                    <select 
                      name="classLink" 
                      value={classSelection} 
                      onChange={(e) => setClassSelection(e.target.value)} 
                      required 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Select destination node...</option>
                        <optgroup label="Skill Modules" className="bg-slate-900">
                            {skillClasses.map(c => <option key={`skill-${c.id}`} value={`skill-${c.id}`}>{c.title}</option>)}
                        </optgroup>
                        <optgroup label="Agro Protocols" className="bg-slate-900">
                            {agroClasses.map(c => <option key={`agro-${c.id}`} value={`agro-${c.id}`}>{c.title}</option>)}
                        </optgroup>
                        <option value="other">Custom Destination...</option>
                    </select>
                </div>
            </div>
            
            {classSelection === 'other' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Custom Node ID</label>
                     <input 
                        type="text" 
                        placeholder="Define custom academic channel..." 
                        value={customClassName}
                        onChange={(e) => setCustomClassName(e.target.value)}
                        className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white mt-1 focus:outline-none" 
                    />
                </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><Edit3 size={12} /> Dispatch Narrative</label>
              <textarea 
                name="text" 
                placeholder="Elaborate on the dispatch parameters..." 
                value={formData.text} 
                onChange={handleChange} 
                rows={4} 
                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
             
            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><Globe size={12} /> Multimedia Asset Protocol</p>
                <div className="flex gap-1 p-1 bg-slate-950/30 rounded-xl border border-white/5">
                    {[
                      { id: 'text', icon: <X size={14} />, label: 'None' },
                      { id: 'image', icon: <ImageIcon size={14} />, label: 'Visual' },
                      { id: 'audio', icon: <Mic size={14} />, label: 'Vocal' },
                      { id: 'video', icon: <Video size={14} />, label: 'Stream' }
                    ].map(tab => (
                        <button 
                          key={tab.id} 
                          type="button" 
                          onClick={() => setActiveTab(tab.id as MediaTab)} 
                          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
                        >
                            {tab.id !== 'text' && tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                <div className="animate-in fade-in duration-500">
                    {activeTab === 'image' && (
                         <div className="space-y-6">
                            <div className="flex p-1 bg-slate-950/30 rounded-xl border border-white/5">
                                <button type="button" onClick={() => setImageInputMode('url')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${imageInputMode === 'url' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:bg-white/5'}`}>Manual Uplink</button>
                                <button type="button" onClick={() => setImageInputMode('ai')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${imageInputMode === 'ai' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-white/5'}`}><Sparkles size={12} /> AI Synthesis</button>
                            </div>
                            <div className="space-y-4">
                                {imageInputMode === 'url' ? (
                                    <div className="space-y-4">
                                      <input type="file" accept="image/*" id="schedule-img-upload" onChange={handleFileChange} className="hidden" />
                                      <button 
                                        type="button" 
                                        onClick={() => document.getElementById('schedule-img-upload')?.click()}
                                        className="w-full p-10 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-500 hover:bg-white/5 hover:border-blue-500/30 transition-all flex flex-col items-center gap-4 group"
                                      >
                                          <Upload size={32} className="group-hover:scale-110 group-hover:text-blue-400 transition-all" />
                                          <span className="text-[9px] font-black uppercase tracking-widest leading-none">Inject High-Fidelity Asset</span>
                                      </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <textarea 
                                          value={imagePrompt} 
                                          onChange={(e) => setImagePrompt(e.target.value)} 
                                          placeholder="Synthesize visual parameters (e.g., A minimalist blueprints of a telescope in neon blue)..." 
                                          rows={3} 
                                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none"
                                        />
                                        <button 
                                          type="button" 
                                          onClick={handleGenerateImage} 
                                          disabled={isGeneratingImage || !imagePrompt.trim()} 
                                          className="w-full bg-blue-600 text-white font-black py-4 px-6 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
                                        >
                                            {isGeneratingImage ? <><Loader2 className="animate-spin" size={18} /> Synthesizing...</> : <><Zap size={18} /> Authorize Synthesis</>}
                                        </button>
                                        {generationError && <p className="text-[9px] font-black text-rose-500 text-center uppercase tracking-widest">{generationError}</p>}
                                    </div>
                                )}
                                {imageUrl && (
                                  <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl animate-in zoom-in-95">
                                    <img src={imageUrl} alt="preview" className="w-full h-auto max-h-64 object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                                    <button onClick={() => setImageUrl(null)} className="absolute top-4 right-4 p-2 bg-rose-600/80 text-white rounded-xl hover:bg-rose-500 transition-all shadow-lg"><Trash2 size={16} /></button>
                                  </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'audio' && <RecorderControls recorder={audioRecorder} type="audio" />}
                    {activeTab === 'video' && <RecorderControls recorder={videoRecorder} type="video" />}
                </div>
            </div>
        </div>

        <footer className="p-8 bg-slate-900 border-t border-white/5 flex justify-end gap-4 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
          <button type="button" onClick={onClose} className="px-8 py-4 text-slate-500 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Abort</button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={!formData.title.trim() || !formData.scheduleTime || !classSelection || isSubmitting}
            className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
            Authorize Dispatch
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ScheduleFormModal;