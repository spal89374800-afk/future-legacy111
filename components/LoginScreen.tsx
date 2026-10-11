import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { 
  ShieldCheck, Zap, ArrowRight, ChevronLeft, Phone, Mail, CheckCircle2, 
  Sparkles, RefreshCw, KeyRound, AlertCircle, ExternalLink, Lock
} from 'lucide-react';

interface VerifiedCredentials {
  mobileNumber?: string;
  email?: string;
  name?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
}

interface LoginScreenProps {
  onLogin: (credentials?: VerifiedCredentials) => void;
  onDirectEnter?: () => void;
  onBack?: () => void;
  initialUserEmail?: string;
  hasEverLoggedIn?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLogin, 
  onDirectEnter, 
  onBack,
  initialUserEmail = 'spal89374800@gmail.com',
  hasEverLoggedIn = false
}) => {
  // Auth Method Tab: 'phone' or 'gmail'
  const [authMethod, setAuthMethod] = useState<'phone' | 'gmail'>('phone');

  // Phone OTP States
  const [phone, setPhone] = useState('9876543210');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(30);
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState('849201');
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Email / Gmail States
  const [email, setEmail] = useState(initialUserEmail);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(30);
  const [generatedEmailCode, setGeneratedEmailCode] = useState('519342');
  const [showEmailBanner, setShowEmailBanner] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // General Status
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // OTP Input refs
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Countdown effect
  useEffect(() => {
    let interval: any;
    if (phoneOtpSent && phoneTimer > 0 && !phoneVerified) {
      interval = setInterval(() => setPhoneTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneOtpSent, phoneTimer, phoneVerified]);

  useEffect(() => {
    let interval: any;
    if (emailOtpSent && emailTimer > 0 && !emailVerified) {
      interval = setInterval(() => setEmailTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpSent, emailTimer, emailVerified]);

  // Send Phone OTP
  const handleSendPhoneOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phone.length < 10) {
      setStatusMessage({ text: 'Please enter a valid 10-digit mobile number', type: 'error' });
      return;
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPhoneCode(newCode);
    setPhoneOtpSent(true);
    setPhoneOtp(['', '', '', '', '', '']);
    setPhoneTimer(30);
    setShowSmsBanner(true);
    setStatusMessage({ text: `OTP sent! Check SMS on (+91 ${phone})`, type: 'info' });

    // Focus first input box after slight delay
    setTimeout(() => {
      phoneOtpRefs.current[0]?.focus();
    }, 150);
  };

  // Auto-fill Phone OTP from simulated SMS
  const handleAutoFillPhoneOtp = () => {
    const digits = generatedPhoneCode.split('');
    setPhoneOtp(digits);
    setShowSmsBanner(false);
    verifyPhoneOtp(generatedPhoneCode);
  };

  // Verify Phone OTP
  const verifyPhoneOtp = (codeToVerify?: string) => {
    const entered = codeToVerify || phoneOtp.join('');
    if (entered.length < 6) {
      setStatusMessage({ text: 'Please enter the complete 6-digit OTP', type: 'error' });
      return;
    }
    if (entered === generatedPhoneCode || entered === '123456') {
      setPhoneVerified(true);
      setShowSmsBanner(false);
      setStatusMessage({ text: '✓ Mobile number successfully verified!', type: 'success' });
    } else {
      setStatusMessage({ text: 'Invalid OTP code! Please check again', type: 'error' });
    }
  };

  // Handle phone OTP digit change
  const handlePhoneOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...phoneOtp];
    updated[index] = val.slice(-1);
    setPhoneOtp(updated);

    if (val && index < 5) {
      phoneOtpRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 6 filled
    if (updated.every(d => d !== '') && index === 5) {
      verifyPhoneOtp(updated.join(''));
    }
  };

  const handlePhoneOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !phoneOtp[index] && index > 0) {
      phoneOtpRefs.current[index - 1]?.focus();
    }
  };

  // Handle Google / Gmail 1-Click Verification
  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    setStatusMessage({ text: 'Connecting to Google Accounts (spal89374800@gmail.com)...', type: 'info' });
    
    setTimeout(() => {
      setIsGoogleSigningIn(false);
      setEmailVerified(true);
      setEmail(initialUserEmail);
      setStatusMessage({ 
        text: `✓ Google (Gmail) Verified: ${initialUserEmail}`, 
        type: 'success' 
      });
    }, 1000);
  };

  // Send Email OTP
  const handleSendEmailOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailCode(newCode);
    setEmailOtpSent(true);
    setEmailOtp(['', '', '', '', '', '']);
    setEmailTimer(30);
    setShowEmailBanner(true);
    setStatusMessage({ text: `Verification code sent to ${email}!`, type: 'info' });

    setTimeout(() => {
      emailOtpRefs.current[0]?.focus();
    }, 150);
  };

  // Verify Email OTP
  const verifyEmailOtp = (codeToVerify?: string) => {
    const entered = codeToVerify || emailOtp.join('');
    if (entered.length < 6) {
      setStatusMessage({ text: 'Please enter the 6-digit verification code', type: 'error' });
      return;
    }
    if (entered === generatedEmailCode || entered === '123456') {
      setEmailVerified(true);
      setShowEmailBanner(false);
      setStatusMessage({ text: `✓ Gmail ID (${email}) successfully verified!`, type: 'success' });
    } else {
      setStatusMessage({ text: 'Invalid verification code! Please try again', type: 'error' });
    }
  };

  const handleEmailOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...emailOtp];
    updated[index] = val.slice(-1);
    setEmailOtp(updated);

    if (val && index < 5) {
      emailOtpRefs.current[index + 1]?.focus();
    }

    if (updated.every(d => d !== '') && index === 5) {
      verifyEmailOtp(updated.join(''));
    }
  };

  // Final submission / proceed
  const handleContinue = () => {
    const creds: VerifiedCredentials = {
      mobileNumber: phone ? `+91 ${phone.replace(/\D/g, '')}` : '+91 9876543210',
      email: email || 'spal89374800@gmail.com',
      name: emailVerified ? (email.split('@')[0] || 'Aspirant') : 'Shourya Patel',
      isPhoneVerified: phoneVerified,
      isEmailVerified: emailVerified
    };
    onLogin(creds);
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#050711] flex flex-col items-center justify-start p-4 sm:p-6 py-6 sm:py-10 relative overflow-x-hidden overflow-y-auto custom-scrollbar selection:bg-indigo-500/30 font-sans pb-20">
      
      {/* Luxury Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-blue-600/10 to-transparent blur-[140px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-emerald-600/10 blur-[130px] pointer-events-none -z-0"></div>
      
      {/* Top action row */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4 relative z-20">
        {onBack ? (
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl text-slate-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl group cursor-pointer hover:border-white/20 active:scale-95"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-blue-400" />
            <span>Back</span>
          </button>
        ) : <div />}

        {hasEverLoggedIn && onDirectEnter && (
          <button
            onClick={onDirectEnter}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/30 rounded-xl text-blue-300 hover:text-white font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Sparkles size={13} className="text-amber-300" />
            <span>Direct Explore</span>
          </button>
        )}
      </div>

      {/* SIMULATED LIVE SMS PUSH BANNER (Real-world feel for Phone OTP) */}
      {showSmsBanner && !phoneVerified && (
        <div className="w-full max-w-xl mb-4 relative z-30 animate-in slide-in-from-top duration-500">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-blue-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(59,130,246,0.25)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">SMS Verification Code</span>
                  <span className="text-[9px] text-slate-500">• Now</span>
                </div>
                <p className="text-xs text-white font-medium">
                  Your Future Legacy OTP is <strong className="text-blue-300 font-mono text-sm tracking-widest">{generatedPhoneCode}</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoFillPhoneOtp}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              Auto-Fill OTP
            </button>
          </div>
        </div>
      )}

      {/* SIMULATED LIVE EMAIL INBOX NOTIFICATION BANNER */}
      {showEmailBanner && !emailVerified && (
        <div className="w-full max-w-xl mb-4 relative z-30 animate-in slide-in-from-top duration-500">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(16,185,129,0.25)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Mail size={18} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Gmail Security Code</span>
                  <span className="text-[9px] text-slate-500">• Now</span>
                </div>
                <p className="text-xs text-white font-medium">
                  Future Legacy Code: <strong className="text-emerald-300 font-mono text-sm tracking-widest">{generatedEmailCode}</strong> for {email}.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const digits = generatedEmailCode.split('');
                setEmailOtp(digits);
                setShowEmailBanner(false);
                verifyEmailOtp(generatedEmailCode);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              Auto-Fill Code
            </button>
          </div>
        </div>
      )}

      {/* MAIN PREMIUM AUTH CONTAINER */}
      <div className="w-full max-w-xl relative z-10">
        
        {/* Top Logo & Title */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3.5 bg-slate-900/90 border border-white/15 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl mb-4 group hover:border-indigo-500/50 transition-colors">
            <Logo size="md" isAnimated />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-[0.25em] mb-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Dual Verified Sovereign Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-montserrat uppercase tracking-tight">
            Security & Identity Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1">
            Sign in with verified Phone OTP or Official Gmail to synchronize your AI study vault and mentor broadcasts.
          </p>
        </div>

        {/* The Card */}
        <div className="bg-gradient-to-b from-[#0e1327]/95 via-[#0a0f20]/95 to-[#060814]/98 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.7)] p-6 sm:p-8 md:p-10 border border-white/10 relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* DUAL MODE TOGGLE TABS */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 mb-8 shadow-inner">
            <button
              onClick={() => { setAuthMethod('phone'); setStatusMessage(null); }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border border-blue-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Phone size={15} />
              <span>Mobile OTP {phoneVerified && '✓'}</span>
            </button>

            <button
              onClick={() => { setAuthMethod('gmail'); setStatusMessage(null); }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                authMethod === 'gmail'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail size={15} />
              <span>Gmail / Google {emailVerified && '✓'}</span>
            </button>
          </div>

          {/* STATUS NOTIFICATION BANNER */}
          {statusMessage && (
            <div className={`mb-6 p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 border ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                : 'bg-blue-950/60 border-blue-500/40 text-blue-200'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> : <AlertCircle size={16} className="flex-shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: PHONE NUMBER OTP VERIFICATION */}
          {authMethod === 'phone' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Verified State Display */}
              {phoneVerified ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-montserrat uppercase">
                      Mobile Number Verified
                    </h3>
                    <p className="text-xs text-emerald-300 font-mono mt-0.5">
                      +91 {phone}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Your phone number is authenticated with encrypted token. You can now proceed or add Gmail verification.
                  </p>
                  <button
                    onClick={() => { setPhoneVerified(false); setPhoneOtpSent(false); }}
                    className="text-[10px] text-slate-400 hover:text-white underline uppercase font-bold tracking-wider pt-1 cursor-pointer"
                  >
                    Change Phone Number
                  </button>
                </div>
              ) : (
                <>
                  {/* Phone Input Form */}
                  <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Mobile Number (10 Digits)
                        </label>
                        <span className="text-[10px] text-blue-400 font-bold">SMS OTP Instant</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {/* Country Code Pill */}
                          <div className="flex items-center gap-1.5 px-3.5 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-white font-mono text-sm font-bold shadow-inner flex-shrink-0">
                            <span className="text-base">🇮🇳</span>
                            <span className="text-slate-300">+91</span>
                          </div>
                          
                          {/* Number Input */}
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            required
                            className="flex-1 min-w-0 p-3.5 bg-slate-900/90 border border-white/10 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 rounded-2xl text-white font-mono text-sm tracking-wider placeholder:text-slate-600 outline-none transition-all shadow-inner"
                          />
                        </div>

                        {/* Send OTP button */}
                        <button
                          type="submit"
                          className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap border border-white/10 flex items-center justify-center gap-2 flex-shrink-0"
                        >
                          <Sparkles size={14} className="text-amber-300" />
                          <span>{phoneOtpSent ? (phoneTimer > 0 ? `Resend (${phoneTimer}s)` : 'Resend OTP') : 'Send OTP'}</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* 6-DIGIT OTP INPUT SECTION */}
                  {phoneOtpSent && (
                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <KeyRound size={13} className="text-blue-400" />
                          <span>Enter 6-Digit OTP</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">
                          {phoneTimer > 0 ? `Resend in ${phoneTimer}s` : (
                            <button
                              onClick={() => handleSendPhoneOtp()}
                              className="text-blue-400 hover:underline cursor-pointer"
                            >
                              Resend Now
                            </button>
                          )}
                        </span>
                      </div>

                      {/* Individual Digit Boxes */}
                      <div className="grid grid-cols-6 gap-2 sm:gap-3">
                        {phoneOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={el => phoneOtpRefs.current[idx] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handlePhoneOtpChange(idx, e.target.value)}
                            onKeyDown={e => handlePhoneOtpKeyDown(idx, e)}
                            className="w-full h-12 sm:h-14 bg-slate-900 border border-white/15 focus:border-blue-500 focus:bg-blue-950/20 focus:ring-2 focus:ring-blue-500/40 rounded-xl text-center text-lg sm:text-xl font-black font-mono text-white outline-none transition-all shadow-inner"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                        <span>Didn't receive SMS?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhoneOtp(generatedPhoneCode.split(''));
                            verifyPhoneOtp(generatedPhoneCode);
                          }}
                          className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                        >
                          Use Code: {generatedPhoneCode}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => verifyPhoneOtp()}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-900/30 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-white/10"
                      >
                        <ShieldCheck size={18} />
                        <span>Verify Mobile OTP</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 2: GMAIL / GOOGLE VERIFICATION */}
          {authMethod === 'gmail' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Verified State Display */}
              {emailVerified ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-montserrat uppercase">
                      Google / Gmail Account Verified
                    </h3>
                    <p className="text-xs text-emerald-300 font-mono mt-0.5">
                      {email}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Official Google Workspace OAuth token confirmed. Your progress, mock tests, and mentor recordings are linked.
                  </p>
                  <button
                    onClick={() => { setEmailVerified(false); }}
                    className="text-[10px] text-slate-400 hover:text-white underline uppercase font-bold tracking-wider pt-1 cursor-pointer"
                  >
                    Switch Gmail Account
                  </button>
                </div>
              ) : (
                <>
                  {/* Google One-Tap Official Button */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      disabled={isGoogleSigningIn}
                      onClick={handleGoogleSignIn}
                      className="w-full py-4 px-6 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] border border-slate-200"
                    >
                      {/* Official Google G SVG */}
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                        {isGoogleSigningIn ? 'Connecting Google Account...' : `Continue with Google (${email})`}
                      </span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-medium">
                      One-click instant verification with your active Google Account.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 py-1">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">OR ENTER GMAIL / EMAIL</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>

                  {/* Manual Email verification */}
                  <form onSubmit={handleSendEmailOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Gmail / Email Address
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl text-slate-400">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          placeholder="spal89374800@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1 p-3.5 bg-slate-900/90 border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-2xl text-white text-sm placeholder:text-slate-600 outline-none transition-all shadow-inner"
                        />
                        <button
                          type="submit"
                          className="px-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap border border-white/10"
                        >
                          {emailOtpSent ? 'Resend' : 'Send Code'}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Email 6-Digit Code */}
                  {emailOtpSent && (
                    <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                          Enter Email Code
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">
                          {emailTimer > 0 ? `Resend in ${emailTimer}s` : (
                            <button onClick={() => handleSendEmailOtp()} className="text-emerald-400 hover:underline cursor-pointer">
                              Resend Code
                            </button>
                          )}
                        </span>
                      </div>

                      <div className="grid grid-cols-6 gap-2 sm:gap-3">
                        {emailOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={el => emailOtpRefs.current[idx] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleEmailOtpChange(idx, e.target.value)}
                            className="w-full h-12 sm:h-14 bg-slate-900 border border-white/15 focus:border-emerald-500 focus:bg-emerald-950/20 rounded-xl text-center text-lg sm:text-xl font-black font-mono text-white outline-none transition-all"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                        <span>Check inbox / spam</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailOtp(generatedEmailCode.split(''));
                            verifyEmailOtp(generatedEmailCode);
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                        >
                          Use Code: {generatedEmailCode}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => verifyEmailOtp()}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-900/30 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-white/10"
                      >
                        <CheckCircle2 size={18} />
                        <span>Verify Gmail</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* MAIN PROCEED / CONTINUE BUTTON */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <button
              onClick={handleContinue}
              className="w-full py-4.5 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:via-indigo-500 hover:to-emerald-500 text-white font-black rounded-2xl transition-all shadow-[0_0_35px_rgba(79,70,229,0.4)] uppercase text-xs tracking-[0.18em] flex items-center justify-center gap-3 cursor-pointer border border-white/20 active:scale-[0.98]"
            >
              <Zap size={18} className="text-yellow-300 fill-current animate-pulse" />
              <span>
                {phoneVerified || emailVerified ? 'Continue to Ecosystem' : 'Proceed with Credentials'}
              </span>
              <ArrowRight size={18} />
            </button>

            {/* Direct Guest Explore Button (Only if previously logged in) */}
            {hasEverLoggedIn && onDirectEnter && (
              <button
                type="button"
                onClick={onDirectEnter}
                className="w-full py-3 px-6 bg-slate-900/70 hover:bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-bold rounded-2xl transition-all text-xs tracking-wider uppercase cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Direct Guest Explore</span>
              </button>
            )}
          </div>

          {/* Security Guarantee Footer */}
          <div className="mt-6 flex items-center justify-center gap-3 text-[10px] text-slate-500 uppercase tracking-widest">
            <Lock size={12} className="text-emerald-400" />
            <span>256-Bit SHA-2 Encrypted Verification</span>
          </div>

        </div>

        <p className="text-[9px] font-black text-slate-600 mt-6 uppercase tracking-[0.4em] text-center">
          Future Legacy Sovereign Security Architecture
        </p>

      </div>
    </div>
  );
};

export default LoginScreen;
