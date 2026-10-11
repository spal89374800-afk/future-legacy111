import React, { useState, useRef } from 'react';
import type { Mentor } from '../types.ts';
import { Logo } from './Logo.tsx';
import CameraModal from './CameraModal.tsx';
import { 
  ChevronLeft, User, Phone, Camera, Upload, 
  ShieldCheck, Zap, Briefcase, Award, MessageSquare, ArrowRight 
} from 'lucide-react';

interface TeacherRegistrationFormProps {
  onComplete: (data: Omit<Mentor, 'id' | 'followers' | 'isFollowed'> & { mobileNumber: string }) => void;
  onBack: () => void;
  initialData?: {
    name?: string;
    mobileNumber?: string;
    email?: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
  };
}

const TeacherRegistrationForm: React.FC<TeacherRegistrationFormProps> = ({ onComplete, onBack, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: '', 
    experience: '',
    about: '',
    imageUrl: '',
    mobileNumber: initialData?.mobileNumber ? initialData.mobileNumber.replace(/\D/g, '').slice(-10) : '',
    isFeatured: false,
    videoUrl: '',
    audioUrl: '',
    allowMessages: true,
    socials: {
        linkedin: '',
        twitter: '',
        website: ''
    }
  });
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    if (['linkedin', 'twitter', 'website'].includes(name)) {
        setFormData(prev => ({...prev, socials: {...prev.socials, [name]: value }}));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePhotoCapture = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: imageDataUrl }));
    setIsCameraOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      formData.imageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name || 'Mentor'}&backgroundColor=7c3aed,4f46e5`;
    }
    onComplete(formData as any);
  };

  return (
    <>
      <div className="min-h-screen min-h-[100dvh] bg-[#09090b] flex flex-col items-center justify-start p-4 md:p-6 py-6 md:py-12 relative overflow-y-auto custom-scrollbar pb-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

        <div className="w-full max-w-4xl flex justify-start mb-6 relative z-20">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl text-slate-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-2xl group cursor-pointer hover:border-white/20 active:scale-95"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-purple-400" />
            Back
          </button>
        </div>

        <div className="w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/10 p-12 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Award size={160} className="text-violet-400" />
            </div>

            <div className="text-center mb-16 space-y-4">
                <Logo size="md" isAnimated />
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-white font-montserrat tracking-tight uppercase leading-tight">Pedagogical Architect</h1>
                  <p className="text-slate-500 font-medium text-lg">Construct your high-performance professional node profile.</p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[3rem] overflow-hidden bg-slate-800 border-2 border-white/5 shadow-inner ring-1 ring-white/10 transition-all group-hover:ring-violet-500/50 group-hover:scale-105 duration-700">
                          {formData.imageUrl ? (
                             <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-700">
                                <User size={64} />
                             </div>
                          )}
                        </div>
                        
                        <div className="absolute -bottom-2 -right-2 flex gap-3">
                           <button 
                             type="button" 
                             onClick={() => setIsCameraOpen(true)} 
                             className="p-3 bg-violet-600 text-white rounded-2xl shadow-2xl hover:bg-violet-500 transition-all border border-white/10"
                           >
                              <Camera size={20} />
                           </button>
                           <button 
                             type="button" 
                             onClick={() => fileInputRef.current?.click()} 
                             className="p-3 bg-slate-800 text-white rounded-2xl shadow-2xl hover:bg-slate-700 transition-all border border-white/10"
                           >
                              <Upload size={20} />
                           </button>
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Architect Biometric Link</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                      <User size={14} className="text-violet-500" /> Full identity
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      className="w-full p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-lg shadow-inner" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                      <Phone size={14} className="text-violet-500" /> Secure Uplink Node
                    </label>
                    <input 
                      type="tel" 
                      name="mobileNumber" 
                      value={formData.mobileNumber} 
                      onChange={handleChange} 
                      required 
                      pattern="\d{10}" 
                      className="w-full p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-lg shadow-inner" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                      <Briefcase size={14} className="text-violet-500" /> Professional Title
                    </label>
                    <input 
                      type="text" 
                      name="role" 
                      value={formData.role} 
                      onChange={handleChange} 
                      placeholder="e.g., Software Architect"
                      required 
                      className="w-full p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-lg shadow-inner" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                      <Award size={14} className="text-violet-500" /> Experience Tenure
                    </label>
                    <input 
                      type="text" 
                      name="experience" 
                      value={formData.experience} 
                      onChange={handleChange} 
                      placeholder="e.g., 12+ Years"
                      required 
                      className="w-full p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-lg shadow-inner" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                      <Zap size={14} className="text-violet-500" /> Professional Narrative
                    </label>
                    <textarea 
                      name="about" 
                      value={formData.about} 
                      onChange={handleChange} 
                      rows={4} 
                      placeholder="Synthesize your professional journey and vision..." 
                      required
                      className="w-full p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-base min-h-[150px] shadow-inner"
                    />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                    <MessageSquare size={14} className="text-violet-500" /> Communication Protocol
                  </label>
                  <div className="flex items-center justify-between p-6 bg-slate-800/40 border border-white/5 rounded-[2rem] cursor-pointer hover:bg-slate-800 transition-all group">
                    <div className="space-y-0.5">
                      <p className="text-base font-bold text-white group-hover:text-violet-400 transition-colors">Direct Node Access</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Allow student assets to establish secure messaging links</p>
                    </div>
                    <input
                      type="checkbox"
                      id="allowMessages"
                      name="allowMessages"
                      checked={formData.allowMessages}
                      onChange={handleChange}
                      className="h-7 w-7 rounded-xl bg-slate-900 border-white/10 text-violet-600 focus:ring-0 transition-all cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="pt-8">
                  <button 
                    type="submit" 
                    className="w-full py-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-[2rem] hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-violet-900/40 uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-4 active:scale-[0.98]"
                  >
                    <ShieldCheck size={24} />
                    Finalize Architect Profile
                  </button>
                </div>
            </form>
          </div>
          
          <div className="mt-12 text-center opacity-30">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Future Legacy Protocol v4.2.17 Verified</p>
          </div>
        </div>
      </div>
      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} onCapture={handlePhotoCapture} />}
    </>
  );
};

export default TeacherRegistrationForm;