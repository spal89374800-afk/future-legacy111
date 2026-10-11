import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { 
  User, Phone, Award, BookOpen, CheckCircle2, 
  ChevronLeft, Sparkles, ShieldCheck, ArrowRight, 
  Briefcase, GraduationCap, Building2, Plus, X, PenLine, Zap
} from 'lucide-react';
import type { Mentor } from '../types.ts';

interface TeacherLoginScreenProps {
  onLoginSuccess: (teacherData: {
    name: string;
    mobileNumber: string;
    qualifications: string;
    collegeOrUniversity: string;
    teachingSubject: string;
    experience: string;
    bio: string;
    isPhoneVerified: boolean;
    imageUrl?: string;
  }) => void;
  onBack: () => void;
  defaultName?: string;
  defaultPhone?: string;
  hasEverLoggedIn?: boolean;
  onDirectEnter?: () => void;
}

export const TeacherLoginScreen: React.FC<TeacherLoginScreenProps> = ({
  onLoginSuccess,
  onBack,
  defaultName = 'Prof. Shourya Patel',
  defaultPhone = '9876543210',
  hasEverLoggedIn = false,
  onDirectEnter
}) => {
  // Teacher Identity
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);

  // Phone OTP States
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(30);
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState('841923');
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Education / Qualifications ("kya kya padai ki hai")
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([
    'M.Sc (Physics)', 
    'B.Ed (Pedagogy)', 
    'CSIR-NET Qualified'
  ]);
  const [customQualifications, setCustomQualifications] = useState('M.Sc in Physics (Gold Medalist), B.Ed, CSIR-NET & GATE Qualified');
  const [collegeOrUniversity, setCollegeOrUniversity] = useState('Delhi University / IIT Delhi Alumnus');
  const [teachingSubject, setTeachingSubject] = useState('Physics & Concept Mechanics');
  const [experience, setExperience] = useState('8+ Years Teaching Experience');
  const [bio, setBio] = useState('Dedicated Senior Faculty guiding NEET & JEE aspirants with NCERT focus, concept visualization, and doubt clearance.');

  // Pre-set degree tags
  const degreeOptions = [
    'M.Sc (Physics)',
    'M.Sc (Chemistry)',
    'M.Sc (Biology/Botany)',
    'M.Sc (Mathematics)',
    'B.Tech / M.Tech',
    'Ph.D / Doctorate',
    'B.Ed / M.Ed',
    'MBBS / MD',
    'CSIR-NET / JRF',
    'GATE Qualified',
    'B.Sc (Honours)'
  ];

  // Subject Options
  const subjectOptions = [
    'Physics',
    'Chemistry',
    'Biology (Botany & Zoology)',
    'Mathematics',
    'Computer Science & AI',
    'Agricultural Science'
  ];

  // Experience Options
  const experienceOptions = [
    '1 - 3 Years',
    '3 - 5 Years',
    '5 - 8 Years',
    '8+ Years Teaching Experience',
    '12+ Years Senior Faculty'
  ];

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (phoneOtpSent && phoneTimer > 0 && !phoneVerified) {
      interval = setInterval(() => setPhoneTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneOtpSent, phoneTimer, phoneVerified]);

  const toggleDegree = (degree: string) => {
    let updated: string[];
    if (selectedDegrees.includes(degree)) {
      updated = selectedDegrees.filter(d => d !== degree);
    } else {
      updated = [...selectedDegrees, degree];
    }
    setSelectedDegrees(updated);
    setCustomQualifications(updated.join(', '));
  };

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
        alert('Kripya mobile number (+91 ' + phone + ') par bheja gaya OTP code enter karke verify karein!');
        return;
      }
      const entered = phoneOtp;
      if (entered === generatedPhoneCode || entered === '123456') {
        setPhoneVerified(true);
      } else {
        alert('Kripya mobile par aaya 6-digit OTP code enter karein ya notification me Auto-Fill & Verify par click karein!');
        return;
      }
    }

    onLoginSuccess({
      name: name.trim() || 'Prof. Shourya Patel',
      mobileNumber: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
      qualifications: customQualifications.trim() || selectedDegrees.join(', '),
      collegeOrUniversity: collegeOrUniversity.trim() || 'Central University Alumnus',
      teachingSubject: teachingSubject.trim() || 'Physics',
      experience: experience.trim() || '5+ Years',
      bio: bio.trim(),
      isPhoneVerified: true,
      imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name || 'Prof'}&backgroundColor=7c3aed,4f46e5`
    });
  };

  const handleInstantEnter = () => {
    if (!hasEverLoggedIn) {
      alert('Pehle ek baar mobile OTP se login karna zaroori hai!');
      return;
    }
    if (onDirectEnter) {
      onDirectEnter();
      return;
    }
    onLoginSuccess({
      name: name.trim() || 'Prof. Shourya Patel',
      mobileNumber: `+91 ${phone.replace(/\D/g, '').slice(-10) || '9876543210'}`,
      qualifications: customQualifications.trim() || selectedDegrees.join(', ') || 'M.Sc in Physics, B.Ed',
      collegeOrUniversity: collegeOrUniversity.trim() || 'Delhi University Alumnus',
      teachingSubject: teachingSubject.trim() || 'Physics & Concept Mechanics',
      experience: experience.trim() || '8+ Years Teaching Experience',
      bio: bio.trim() || 'Dedicated Senior Faculty guiding NEET & JEE aspirants.',
      isPhoneVerified: true,
      imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name || 'Prof'}&backgroundColor=7c3aed,4f46e5`
    });
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#070512] text-white selection:bg-purple-500/30 font-sans py-6 sm:py-10 px-4 sm:px-6 relative flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto custom-scrollbar pb-20">
      
      {/* Luxury ambient purple & indigo glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[300px] bg-amber-600/10 blur-[130px] pointer-events-none -z-0"></div>

      {/* TOP BAR / BACK NAVIGATION */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-5 relative z-20 gap-3">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl text-slate-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl group cursor-pointer hover:border-white/20 active:scale-95"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-purple-400" />
          <span>Role Selection</span>
        </button>

        <div className="flex items-center gap-2">
          {hasEverLoggedIn && (
            <button
              type="button"
              onClick={handleInstantEnter}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-400 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 border border-white/20"
            >
              <Zap size={13} className="text-amber-300" />
              <span>⚡ 1-Click Quick Enter</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <Logo size="sm" isAnimated />
            <span className="text-xs font-black text-white uppercase tracking-wider font-montserrat">
              Teacher Studio
            </span>
          </div>
        </div>
      </div>

      {/* SMS PUSH NOTIFICATION BANNER (Realistic Phone OTP) */}
      {showSmsBanner && !phoneVerified && (
        <div className="w-full max-w-2xl mb-4 relative z-30 animate-in slide-in-from-top duration-500">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-purple-500/50 rounded-2xl p-4 shadow-[0_10px_35px_rgba(168,85,247,0.3)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Instant Faculty SMS Received
                </p>
                <p className="text-xs text-white font-medium">
                  Your Teacher Portal login verification OTP is: <span className="font-mono font-bold text-amber-300 text-sm tracking-widest">{generatedPhoneCode}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <span>Auto-Fill & Verify</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN TEACHER LOGIN CONTAINER */}
      <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#110c24]/95 backdrop-blur-3xl border border-purple-500/35 rounded-[2.5rem] shadow-[0_20px_60px_rgba(17,12,36,0.9)] p-6 sm:p-8 md:p-10 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/70 border border-purple-500/40 rounded-full text-purple-300 text-[10px] font-black uppercase tracking-wider">
              <Award size={14} className="text-purple-400" />
              <span>Educator Gateway</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight uppercase">
              Teacher Login & Faculty Profile
            </h1>

            <p className="text-xs text-slate-300">
              Enter your professional details, credentials, and academic qualifications
            </p>
          </div>

          {/* Fast-Track 1-Click Action (Only if previously logged in) */}
          {hasEverLoggedIn && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-purple-950/60 border border-purple-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold shrink-0">
                  <Zap size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Direct Faculty Access</p>
                  <p className="text-[10px] text-slate-300">Enter studio immediately with pre-loaded faculty credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstantEnter}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 border border-white/20"
              >
                <span>Instant Enter</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. TEACHER NAME ("teacher ki bane" / Teacher Name) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <User size={13} className="text-purple-400" />
                <span>Teacher Name</span>
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. Prof. Shourya Patel or Dr. Aryan Sharma"
                className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* 2. PHONE NUMBER LOGIN ("phone number se logon ok") */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={13} className="text-purple-400" />
                  <span>Phone Number Login</span>
                </label>
                {phoneVerified ? (
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 size={11} /> Mobile Verified
                  </span>
                ) : (
                  <span className="text-[9px] text-purple-400 font-semibold">Faculty SMS OTP</span>
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
                    className="flex-1 min-w-0 p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  className={`px-5 py-3.5 font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 border ${
                    phoneOtpSent 
                      ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-400/30 shadow-amber-900/20' 
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white border-white/20 shadow-purple-900/40'
                  }`}
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>{phoneOtpSent ? (phoneTimer > 0 ? `Resend (${phoneTimer}s)` : 'Resend OTP') : 'Send OTP'}</span>
                </button>
              </div>

              {/* OTP 6-Digit Boxes if OTP sent & not yet verified */}
              {phoneOtpSent && !phoneVerified && (
                <div className="p-3 bg-black/40 rounded-2xl border border-purple-500/20 space-y-2 mt-2">
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
                      className="text-[10px] text-purple-400 hover:underline font-bold cursor-pointer"
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

            {/* 3. QUALIFICATIONS & STUDIES ("wo sab kya kya padai ki hai") */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-purple-400" />
                  <span>Educational Qualifications</span>
                </label>
                <span className="text-[9px] text-purple-300 font-semibold">{selectedDegrees.length} Degrees Selected</span>
              </div>

              {/* Degrees Quick Multi-Select */}
              <div className="flex flex-wrap gap-2">
                {degreeOptions.map((deg) => {
                  const isSelected = selectedDegrees.includes(deg);
                  return (
                    <button
                      type="button"
                      key={deg}
                      onClick={() => toggleDegree(deg)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-600/30 text-purple-200 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'bg-slate-900/70 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span>{deg}</span>
                      {isSelected && <CheckCircle2 size={12} className="text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Custom Qualifications Text Field */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Specify All Degrees & Diplomas
                </label>
                <input 
                  type="text" 
                  value={customQualifications} 
                  onChange={e => setCustomQualifications(e.target.value)}
                  required
                  placeholder="e.g. M.Sc in Physics (Gold Medalist), B.Ed, CSIR-NET & GATE Qualified"
                  className="w-full p-3.5 bg-slate-900/90 border border-purple-500/30 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* College / University Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                  <Building2 size={12} className="text-purple-400" />
                  <span>College / University / Institute Name</span>
                </label>
                <input 
                  type="text" 
                  value={collegeOrUniversity} 
                  onChange={e => setCollegeOrUniversity(e.target.value)}
                  required
                  placeholder="e.g. Delhi University / IIT Bombay / BHU / AIIMS..."
                  className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* 4. PRIMARY TEACHING SUBJECT & EXPERIENCE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Teaching Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                  <BookOpen size={13} className="text-purple-400" />
                  <span>Primary Subject</span>
                </label>
                <input 
                  type="text" 
                  value={teachingSubject} 
                  onChange={e => setTeachingSubject(e.target.value)}
                  required
                  placeholder="e.g. Physics, Organic Chemistry, Biology"
                  className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Teaching Experience */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-purple-400" />
                  <span>Experience Tenure</span>
                </label>
                <select 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)}
                  className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer"
                >
                  {experienceOptions.map(exp => (
                    <option key={exp} value={exp} className="bg-slate-900 text-white">
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* 5. BRIEF BIO / PHILOSOPHY */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <PenLine size={13} className="text-purple-400" />
                <span>Short Introduction for Students</span>
              </label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)}
                rows={2}
                placeholder="Briefly introduce your teaching methodology and guidance philosophy..."
                className="w-full p-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* SUBMIT BUTTON & FAST LOGIN */}
            <div className="pt-3 space-y-3">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] border border-white/20"
              >
                <ShieldCheck size={18} />
                <span>Login as Teacher & Open Studio</span>
                <ArrowRight size={16} />
              </button>

              {hasEverLoggedIn && (
                <button
                  type="button"
                  onClick={handleInstantEnter}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap size={14} className="text-amber-400" />
                  <span>1-Click Instant Enter (Saved Session)</span>
                </button>
              )}
            </div>

          </form>

        </div>

        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6">
          National Academic & Innovation Network • Verified Faculty Protocol v4.2
        </p>
      </div>

    </div>
  );
};

export default TeacherLoginScreen;
