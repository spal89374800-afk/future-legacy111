import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { 
  GraduationCap, Phone, User, BookOpen, CheckCircle2, 
  ChevronLeft, Sparkles, ShieldCheck, ArrowRight, BookCheck, 
  HelpCircle, PenLine, Award, Zap
} from 'lucide-react';
import type { User as UserType } from '../types.ts';

interface StudentLoginScreenProps {
  onLoginSuccess: (studentData: {
    name: string;
    mobileNumber: string;
    studentClass: string;
    courseName: string;
    isPhoneVerified: boolean;
    imageUrl?: string;
  }) => void;
  onBack: () => void;
  onDirectEnter?: () => void;
  defaultName?: string;
  defaultPhone?: string;
}

export const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({
  onLoginSuccess,
  onBack,
  onDirectEnter,
  defaultName = 'Shourya Patel',
  defaultPhone = '9876543210'
}) => {
  // Personal Info
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  
  // Phone OTP States
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(30);
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState('739215');
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Class & Course Selection / Writing
  const [selectedClass, setSelectedClass] = useState('Class 12th (Board & Entrance)');
  const [selectedCourse, setSelectedCourse] = useState('NEET UG');
  const [customCourseOrClass, setCustomCourseOrClass] = useState('Class 12th Medical (NEET Target 2026)');

  // Quick Class Options
  const classOptions = [
    'Class 9th',
    'Class 10th (Board)',
    'Class 11th (Science)',
    'Class 12th (Board & Entrance)',
    'Dropper / Repeater Batch',
    'College / Degree Student',
    'Other / Custom'
  ];

  // Quick Course Options
  const courseOptions = [
    'NEET UG',
    'JEE Main & Advanced',
    'CBSE & State Board Exams',
    'CUET / ICAR Exam',
    'Foundation & Olympiad',
    'Agro & Allied Sciences'
  ];

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (phoneOtpSent && phoneTimer > 0 && !phoneVerified) {
      interval = setInterval(() => setPhoneTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneOtpSent, phoneTimer, phoneVerified]);

  const handleSendPhoneOtp = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPhoneCode(newCode);
    setPhoneOtpSent(true);
    setPhoneOtp('');
    setPhoneTimer(30);
    setShowSmsBanner(true);
  };

  const handleAutoFillOtp = () => {
    setPhoneOtp(generatedPhoneCode);
    setShowSmsBanner(false);
    setPhoneVerified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) {
      if (!phoneOtpSent) {
        handleSendPhoneOtp();
        alert(`Kripya mobile number (+91 ${phone}) par bheja gaya OTP code verify karein!`);
        return;
      }
      const entered = phoneOtp;
      if (entered === generatedPhoneCode || entered === '123456') {
        setPhoneVerified(true);
      } else {
        alert('Kripya mobile par aaya 6-digit OTP code enter karein ya Auto-Fill & Verify par click karein!');
        return;
      }
    }

    const finalClass = selectedClass === 'Other / Custom' ? customCourseOrClass : selectedClass;
    const finalCourse = customCourseOrClass.trim() || selectedCourse;

    onLoginSuccess({
      name: name.trim() || 'Shourya Patel',
      mobileNumber: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
      studentClass: finalClass,
      courseName: finalCourse,
      isPhoneVerified: true,
      imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name || 'Student'}&backgroundColor=0d9488,3b82f6`
    });
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#050713] text-white selection:bg-blue-500/30 font-sans py-6 sm:py-10 px-4 sm:px-6 relative flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto custom-scrollbar pb-20">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[300px] bg-cyan-600/10 blur-[130px] pointer-events-none -z-0"></div>

      {/* TOP BAR / BACK NAVIGATION */}
      <div className="w-full max-w-xl flex items-center justify-between mb-5 relative z-20">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl text-slate-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl group cursor-pointer hover:border-white/20 active:scale-95"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-blue-400" />
          <span>Role Selection</span>
        </button>

        <div className="flex items-center gap-2">
          <Logo size="sm" isAnimated />
          <span className="text-xs font-black text-white uppercase tracking-wider font-montserrat">
            Student Portal
          </span>
        </div>
      </div>

      {/* SMS PUSH NOTIFICATION BANNER (Realistic Phone OTP) */}
      {showSmsBanner && !phoneVerified && (
        <div className="w-full max-w-xl mb-4 relative z-30 animate-in slide-in-from-top duration-500">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-blue-500/50 rounded-2xl p-4 shadow-[0_10px_35px_rgba(59,130,246,0.3)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Instant SMS Received
                </p>
                <p className="text-xs text-white font-medium">
                  Your Future Legacy verification OTP is: <span className="font-mono font-bold text-amber-300 text-sm tracking-widest">{generatedPhoneCode}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <span>Auto-Fill & Verify</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN STUDENT LOGIN CONTAINER */}
      <div className="w-full max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#0b1026]/95 backdrop-blur-3xl border border-blue-500/30 rounded-[2.5rem] shadow-[0_20px_60px_rgba(11,16,38,0.9)] p-6 sm:p-8 md:p-10 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/70 border border-blue-500/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-wider">
              <GraduationCap size={14} className="text-blue-400" />
              <span>Student Gateway</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight uppercase">
              Student Login & Class Setup
            </h1>

            <p className="text-xs text-slate-300">
              Enter your mobile number and select or specify your current class and target exam
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. STUDENT FULL NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <User size={13} className="text-blue-400" />
                <span>Full Name</span>
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. Shourya Patel"
                className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* 2. PHONE NUMBER LOGIN (phone number se login) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={13} className="text-blue-400" />
                  <span>Mobile Number Login</span>
                </label>
                {phoneVerified ? (
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 size={11} /> Phone Verified
                  </span>
                ) : (
                  <span className="text-[9px] text-blue-400 font-semibold">Instant SMS OTP</span>
                )}
              </div>

              {/* Responsive Phone & Send OTP layout: guaranteed never clipped on mobile/touch screens */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center justify-center px-3.5 py-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-slate-300 font-mono text-sm font-bold flex-shrink-0">
                    +91
                  </div>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(digits);
                      setPhoneVerified(false);
                    }}
                    required
                    placeholder="9876543210"
                    className="flex-1 min-w-0 p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  className={`px-5 py-3.5 font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 border ${
                    phoneOtpSent 
                      ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-400/30 shadow-amber-900/20' 
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white border-white/20 shadow-blue-900/40'
                  }`}
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>{phoneOtpSent ? (phoneTimer > 0 ? `Resend (${phoneTimer}s)` : 'Resend OTP') : 'Send OTP'}</span>
                </button>
              </div>

              {/* OTP 6-Digit Boxes if OTP sent & not yet verified */}
              {phoneOtpSent && !phoneVerified && (
                <div className="p-3 bg-black/40 rounded-2xl border border-blue-500/20 space-y-2 mt-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Enter 6-digit OTP code (+91 {phone})</span>
                    <span>{phoneTimer > 0 ? `Resend in ${phoneTimer}s` : 'Code sent'}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setPhoneOtp(val);
                        if (val.length === 6) {
                          if (val === generatedPhoneCode || val === '123456') {
                            setPhoneVerified(true);
                            setShowSmsBanner(false);
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                      autoFocus
                    />
                    <div className="flex justify-between gap-1 sm:gap-2 pointer-events-none">
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const digit = phoneOtp[idx] || '';
                        return (
                          <div
                            key={idx}
                            className={`w-10 sm:w-12 h-11 flex items-center justify-center bg-slate-900 border rounded-xl text-white font-mono font-bold text-lg ${
                              digit ? 'border-emerald-400 bg-emerald-950/30' : 'border-white/15'
                            }`}
                          >
                            {digit}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setPhoneVerified(true)}
                      className="text-[10px] text-blue-400 hover:underline font-bold cursor-pointer"
                    >
                      Instant Phone Verification
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="text-[10px] text-amber-300 font-bold hover:underline cursor-pointer"
                    >
                      Use Demo OTP ({generatedPhoneCode})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. CLASS SELECTION (class kon si class me hai) */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={13} className="text-blue-400" />
                  <span>Select Class</span>
                </label>
                <span className="text-[9px] text-blue-300 font-semibold">{selectedClass}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {classOptions.map((cls) => (
                  <button
                    type="button"
                    key={cls}
                    onClick={() => {
                      setSelectedClass(cls);
                      if (cls !== 'Other / Custom') {
                        setCustomCourseOrClass(`${cls} • ${selectedCourse}`);
                      }
                    }}
                    className={`p-2.5 rounded-xl text-[11px] font-bold transition-all text-left border cursor-pointer ${
                      selectedClass === cls
                        ? 'bg-blue-600/30 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-slate-900/70 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. COURSE SELECTION (yaa koi course kar raha hai) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Award size={13} className="text-amber-400" />
                  <span>Target Course & Exam</span>
                </label>
                <span className="text-[9px] text-amber-300 font-semibold">{selectedCourse}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {courseOptions.map((crs) => (
                  <button
                    type="button"
                    key={crs}
                    onClick={() => {
                      setSelectedCourse(crs);
                      setCustomCourseOrClass(`${selectedClass} • ${crs}`);
                    }}
                    className={`p-2.5 rounded-xl text-[11px] font-bold transition-all text-left border cursor-pointer ${
                      selectedCourse === crs
                        ? 'bg-amber-500/25 text-amber-200 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900/70 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {crs}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. CUSTOM INPUT BOX (wo likhne ka option aae) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <PenLine size={13} className="text-emerald-400" />
                <span>Specify Class or Target Course</span>
              </label>
              <input 
                type="text" 
                value={customCourseOrClass} 
                onChange={e => setCustomCourseOrClass(e.target.value)}
                required
                placeholder="e.g. Class 12 Science (PCM) / NEET 2026 Dropper / BCA 1st Year..."
                className="w-full p-3.5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
              />
              <p className="text-[10px] text-slate-400 px-1">
                You can customize your class or target batch name as desired.
              </p>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] border border-white/20"
              >
                <ShieldCheck size={18} />
                <span>Login as Student & Enter App</span>
                <ArrowRight size={16} />
              </button>

              {onDirectEnter && (
                <button
                  type="button"
                  onClick={onDirectEnter}
                  className="w-full py-3 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-amber-500/40 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                  <span>⚡ Instant 1-Click Enter (Skip to App)</span>
                </button>
              )}
            </div>

          </form>

        </div>

        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6">
          National Academic & Innovation Network • Student Protocol v4.2
        </p>
      </div>

    </div>
  );
};

export default StudentLoginScreen;
