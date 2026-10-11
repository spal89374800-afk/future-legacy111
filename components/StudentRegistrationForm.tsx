import React, { useState, useRef } from 'react';
import { Logo } from './Logo.tsx';
import CameraModal from './CameraModal.tsx';
import { ChevronLeft, User, Phone, Camera, Upload, ShieldCheck, Zap, Mail, CheckCircle2, BookOpen, Award } from 'lucide-react';

interface StudentRegistrationFormProps {
  onComplete: (data: { 
    fullName: string; 
    mobileNumber: string; 
    imageUrl: string;
    email?: string;
    studentClass?: string;
    courseName?: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
  }) => void;
  onBack: () => void;
  userRole?: 'student' | 'farmer';
  initialData?: {
    fullName?: string;
    mobileNumber?: string;
    email?: string;
    studentClass?: string;
    courseName?: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
  };
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  onComplete, 
  onBack, 
  userRole = 'student',
  initialData 
}) => {
  const [formData, setFormData] = useState({ 
    fullName: initialData?.fullName || '', 
    mobileNumber: initialData?.mobileNumber || '', 
    email: initialData?.email || 'spal89374800@gmail.com',
    studentClass: initialData?.studentClass || 'Class 12th (Board & Entrance)',
    courseName: initialData?.courseName || 'NEET Target 2026',
    imageUrl: '' 
  });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFarmer = userRole === 'farmer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      formData.imageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.fullName || (isFarmer ? 'Kisan' : 'Student')}&backgroundColor=${isFarmer ? '059669,10b981' : '0d9488,3b82f6'}`;
    }
    onComplete({
      ...formData,
      isPhoneVerified: initialData?.isPhoneVerified,
      isEmailVerified: initialData?.isEmailVerified
    });
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex flex-col items-center justify-start p-4 md:p-6 py-6 md:py-12 relative bg-[#050711] font-sans selection:bg-indigo-500/30 overflow-y-auto custom-scrollbar pb-20">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,#0f172a,transparent)] opacity-40 pointer-events-none"></div>

        <div className="w-full max-w-lg flex justify-start mb-6 relative z-20">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl text-slate-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-2xl group cursor-pointer hover:border-white/20 active:scale-95"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-blue-400" />
            Back
          </button>
        </div>

        <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-[#0b0f22]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] p-6 md:p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Zap size={80} className="text-blue-400" /></div>
            
            <div className="text-center mb-8 space-y-3">
                <div className="flex justify-center">
                  <div className="p-3.5 bg-slate-900/90 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-xl">
                    <Logo size="md" isAnimated />
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight uppercase leading-tight">
                    {isFarmer ? 'Kisan & Agro Setup' : 'Student Identity Setup'}
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    {isFarmer ? 'Agro Innovator & Farmer Profile Setup' : 'Enter Student Profile Details'}
                  </p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-slate-800 border border-white/10 shadow-inner ring-1 ring-white/10 transition-all group-hover:ring-blue-500/50 duration-500">
                          {formData.imageUrl ? <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={40} /></div>}
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex gap-2">
                           <button type="button" onClick={() => setIsCameraOpen(true)} className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-500 transition-all border border-white/10 cursor-pointer"><Camera size={14} /></button>
                           <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-slate-800 text-white rounded-xl shadow-xl hover:bg-slate-700 transition-all border border-white/10 cursor-pointer"><Upload size={14} /></button>
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setFormData(p => ({...p, imageUrl: r.result as string})); r.readAsDataURL(f); } }} className="hidden" />
                    </div>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Shourya Patel" 
                      value={formData.fullName} 
                      onChange={e => setFormData({...formData, fullName: e.target.value})} 
                      required 
                      className="w-full p-4 bg-slate-900/90 border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-sm placeholder:text-slate-600" 
                    />
                  </div>

                  {/* Mobile Number with verification badge */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Mobile Number
                      </label>
                      {initialData?.isPhoneVerified && (
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={formData.mobileNumber} 
                        onChange={e => setFormData({...formData, mobileNumber: e.target.value})} 
                        required 
                        className="w-full p-4 bg-slate-900/90 border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-sm placeholder:text-slate-600 pr-10" 
                      />
                      <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Gmail with verification badge */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Gmail / Email ID
                      </label>
                      {initialData?.isEmailVerified && (
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Google Verified
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="spal89374800@gmail.com" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        className="w-full p-4 bg-slate-900/90 border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-sm placeholder:text-slate-600 pr-10" 
                      />
                      <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Student Class / Course Selection */}
                  {!isFarmer && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                          <BookOpen size={12} className="text-blue-400" />
                          <span>Class</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. Class 12th Board / Class 11th Science" 
                          value={formData.studentClass} 
                          onChange={e => setFormData({...formData, studentClass: e.target.value})} 
                          className="w-full p-4 bg-slate-900/90 border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-sm placeholder:text-slate-600" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                          <Award size={12} className="text-amber-400" />
                          <span>Target Course / Exam</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. NEET UG / JEE Mains / CUET / State Board" 
                          value={formData.courseName} 
                          onChange={e => setFormData({...formData, courseName: e.target.value})} 
                          className="w-full p-4 bg-slate-900/90 border border-white/10 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-sm placeholder:text-slate-600" 
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-4.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black rounded-2xl hover:opacity-95 transition-all shadow-xl shadow-blue-900/30 uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer border border-white/10">
                    <ShieldCheck size={18} /> Complete & Launch App
                  </button>
                </div>
            </form>
          </div>
          <p className="text-[8px] font-black text-slate-600 mt-6 uppercase tracking-[0.5em] text-center">
            Future Legacy Identity Matrix v4.2
          </p>
        </div>
      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} onCapture={(url) => { setFormData({...formData, imageUrl: url}); setIsCameraOpen(false); }} />}
    </div>
  );
};

export default StudentRegistrationForm;
