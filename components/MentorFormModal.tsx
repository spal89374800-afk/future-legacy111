import React, { useState, useEffect, useRef } from 'react';
import type { Mentor } from '../types.ts';
import CameraModal from './CameraModal.tsx';
import { Camera, X, Upload, Video, Music, Linkedin, Twitter, Globe, Save, Sparkles, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    // renderMathInElement and katex are no longer used
  }
}

interface MentorFormModalProps {
  mentor: Mentor | null;
  onClose: () => void;
  onSave: (data: Omit<Mentor, 'id' | 'followers' | 'isFollowed'>) => void;
}

const MentorFormModal: React.FC<MentorFormModalProps> = ({ mentor, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    imageUrl: '',
    about: '',
    isFeatured: false,
    videoUrl: '',
    audioUrl: '',
    allowMessages: false,
    socials: {
        linkedin: '',
        twitter: '',
        website: ''
    }
  });
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mentor) {
      setFormData({
        name: mentor.name,
        role: mentor.role,
        experience: mentor.experience || '',
        imageUrl: mentor.imageUrl,
        about: mentor.about || '',
        isFeatured: mentor.isFeatured || false,
        videoUrl: mentor.videoUrl || '',
        audioUrl: mentor.audioUrl || '',
        allowMessages: mentor.allowMessages || false,
        socials: {
            linkedin: mentor.socials?.linkedin || '',
            twitter: mentor.socials?.twitter || '',
            website: mentor.socials?.website || '',
        }
      });
    }
  }, [mentor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (['linkedin', 'twitter', 'website'].includes(name)) {
        setFormData(prev => ({...prev, socials: {...prev.socials, [name]: value }}));
    } else {
        const isCheckbox = type === 'checkbox';
        const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
    }
  };
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'videoUrl' | 'audioUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [fieldName]: objectUrl }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handlePhotoCapture = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: imageDataUrl }));
    setIsCameraOpen(false);
  };
  
  const SocialInput: React.FC<{name: 'linkedin' | 'twitter' | 'website', value: string, onChange: any, placeholder: string, icon: React.ReactNode}> = ({name, value, onChange, placeholder, icon}) => (
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{name}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">{icon}</div>
            <input 
              type="url" 
              name={name} 
              placeholder={placeholder} 
              value={value} 
              onChange={onChange} 
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
            />
        </div>
      </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col h-[90vh] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">Architect Profile</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Mentor Identity Protocol</p>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Identity Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0 relative group">
                        <img 
                          src={formData.imageUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=Mentor'} 
                          alt="Preview" 
                          className="w-32 h-32 rounded-[2rem] object-cover bg-slate-800 border-2 border-slate-700 shadow-xl" 
                        />
                        <div className="absolute -bottom-3 -right-3 flex gap-2">
                           <button type="button" onClick={() => setIsCameraOpen(true)} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 transition-all">
                              <Camera size={16} />
                           </button>
                           <button type="button" onClick={() => imageFileInputRef.current?.click()} className="p-2 bg-slate-700 text-white rounded-xl shadow-lg hover:bg-slate-600 transition-all">
                              <Upload size={16} />
                           </button>
                        </div>
                        <input type="file" accept="image/*" ref={imageFileInputRef} onChange={handleImageFileChange} className="hidden" />
                    </div>
                    
                    <div className="flex-grow w-full space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Legal Name</label>
                                <input 
                                  type="text" 
                                  name="name" 
                                  value={formData.name} 
                                  onChange={handleChange} 
                                  required 
                                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Professional Title</label>
                                <input 
                                  type="text" 
                                  name="role" 
                                  value={formData.role} 
                                  onChange={handleChange} 
                                  required 
                                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Experience Tenure</label>
                            <input 
                              type="text" 
                              name="experience" 
                              placeholder="e.g., 15+ Years in Aerospace" 
                              value={formData.experience} 
                              onChange={handleChange} 
                              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                {/* Narrative Section */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Professional Bio</label>
                    <textarea 
                      name="about" 
                      value={formData.about} 
                      onChange={handleChange} 
                      rows={4} 
                      placeholder="Synthesize your professional journey and vision..." 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[120px]"
                    />
                </div>

                {/* Media Section */}
                <div className="space-y-6 bg-slate-950/50 p-6 rounded-[2rem] border border-white/5">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Sparkles size={14} className="text-blue-400" />
                      Multimedia Uplinks
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Video Story</label>
                            <div className="flex gap-2">
                              <div className="relative flex-1 group">
                                <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="url" name="videoUrl" placeholder="Direct MP4 URL" value={formData.videoUrl} onChange={handleChange} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 pl-12 text-sm text-slate-200 focus:outline-none" />
                              </div>
                              <button type="button" onClick={() => videoFileInputRef.current?.click()} className="p-4 bg-slate-800 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><Upload size={18} /></button>
                              <input type="file" accept="video/*" ref={videoFileInputRef} onChange={(e) => handleMediaFileChange(e, 'videoUrl')} className="hidden" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Audio Master</label>
                            <div className="flex gap-2">
                              <div className="relative flex-1 group">
                                <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input type="url" name="audioUrl" placeholder="Direct MP3 URL" value={formData.audioUrl} onChange={handleChange} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 pl-12 text-sm text-slate-200 focus:outline-none" />
                              </div>
                              <button type="button" onClick={() => audioFileInputRef.current?.click()} className="p-4 bg-slate-800 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><Upload size={18} /></button>
                              <input type="file" accept="audio/*" ref={audioFileInputRef} onChange={(e) => handleMediaFileChange(e, 'audioUrl')} className="hidden" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Connect */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SocialInput name="linkedin" value={formData.socials.linkedin} onChange={handleChange} placeholder="URL" icon={<Linkedin size={18} />} />
                    <SocialInput name="twitter" value={formData.socials.twitter} onChange={handleChange} placeholder="URL" icon={<Twitter size={18} />} />
                    <SocialInput name="website" value={formData.socials.website} onChange={handleChange} placeholder="URL" icon={<Globe size={18} />} />
                </div>

                {/* Permissions */}
                <div className="flex flex-wrap gap-4">
                    <label className="flex-1 flex items-center justify-between gap-4 p-5 bg-slate-800/50 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all group">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Direct Messaging</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Allow student inquiries</p>
                        </div>
                        <input type="checkbox" name="allowMessages" checked={formData.allowMessages} onChange={handleChange} className="w-6 h-6 rounded-lg bg-slate-900 border-white/10 text-blue-600 focus:ring-0" />
                    </label>
                    <label className="flex-1 flex items-center justify-between gap-4 p-5 bg-slate-800/50 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all group">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Featured Status</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global visibility boost</p>
                        </div>
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-6 h-6 rounded-lg bg-slate-900 border-white/10 text-blue-600 focus:ring-0" />
                    </label>
                </div>
            </form>

            <div className="p-8 bg-slate-900 border-t border-white/5 flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Cancel</button>
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 uppercase text-[10px] tracking-widest flex items-center gap-3"
                >
                  <Save size={18} />
                  Authorize Profile
                </button>
            </div>
        </div>
      </div>
      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} onCapture={handlePhotoCapture} />}
    </>
  );
};

export default MentorFormModal;