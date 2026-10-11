import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { 
  Sprout, Phone, User, MapPin, CheckCircle2, 
  ChevronLeft, Sparkles, ShieldCheck, ArrowRight, Wheat, Zap
} from 'lucide-react';

interface FarmerLoginScreenProps {
  onLoginSuccess: (farmerData: {
    name: string;
    mobileNumber: string;
    primaryCrops: string;
    districtState: string;
    isPhoneVerified: boolean;
    imageUrl?: string;
  }) => void;
  onBack: () => void;
  onDirectEnter?: () => void;
  defaultName?: string;
  defaultPhone?: string;
}

export const FarmerLoginScreen: React.FC<FarmerLoginScreenProps> = ({
  onLoginSuccess,
  onBack,
  onDirectEnter,
  defaultName = 'Kisan Mitr (Shourya)',
  defaultPhone = '9876543210'
}) => {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [primaryCrops, setPrimaryCrops] = useState('Wheat, Paddy, Mustard & Hydroponics Tomato');
  const [districtState, setDistrictState] = useState('Madhya Pradesh / Uttar Pradesh');

  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(30);
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState('928174');
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    setPhoneOtp(['', '', '', '', '', '']);
    setPhoneTimer(30);
    setShowSmsBanner(true);
    setTimeout(() => {
      phoneOtpRefs.current[0]?.focus();
    }, 150);
  };

  const handleAutoFillOtp = () => {
    const digits = generatedPhoneCode.split('');
    setPhoneOtp(digits);
    setShowSmsBanner(false);
    setPhoneVerified(true);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...phoneOtp];
    updated[index] = val.slice(-1);
    setPhoneOtp(updated);

    if (val && index < 5) {
      phoneOtpRefs.current[index + 1]?.focus();
    }

    if (updated.every(d => d !== '') && index === 5) {
      setPhoneVerified(true);
      setShowSmsBanner(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) {
      if (!phoneOtpSent) {
        handleSendPhoneOtp();
        alert(`Kripya mobile number (+91 ${phone}) par bheja gaya Kisan OTP code verify karein!`);
        return;
      }
      const entered = phoneOtp.join('');
      if (entered === generatedPhoneCode || entered === '123456') {
        setPhoneVerified(true);
      } else {
        alert('Kripya mobile par aaya Kisan OTP code enter karein ya Auto-Fill & Verify par click karein!');
        return;
      }
    }

    onLoginSuccess({
      name: name.trim() || 'Kisan Mitr',
      mobileNumber: `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
      primaryCrops: primaryCrops.trim(),
      districtState: districtState.trim(),
      isPhoneVerified: true,
      imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name || 'Kisan'}&backgroundColor=059669,10b981`
    });
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#040e0c] text-white selection:bg-emerald-500/30 font-sans py-6 sm:py-10 px-4 sm:px-6 relative flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto custom-scrollbar pb-20">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-600/20 via-teal-600/10 to-transparent blur-[140px] pointer-events-none -z-0"></div>

      <div className="w-full max-w-xl flex items-center justify-between mb-5 relative z-20">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl text-slate-300 font-bold hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl group cursor-pointer hover:border-white/20 active:scale-95"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-emerald-400" />
          <span>Role Selection</span>
        </button>

        <div className="flex items-center gap-2">
          <Logo size="sm" isAnimated />
          <span className="text-xs font-black text-white uppercase tracking-wider font-montserrat">
            Kisan Gateway
          </span>
        </div>
      </div>

      {showSmsBanner && !phoneVerified && (
        <div className="w-full max-w-xl mb-4 relative z-30 animate-in slide-in-from-top duration-500">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/50 rounded-2xl p-4 shadow-[0_10px_35px_rgba(16,185,129,0.3)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Instant Kisan SMS Received
                </p>
                <p className="text-xs text-white font-medium">
                  Your Kisan Portal verification OTP is: <span className="font-mono font-bold text-amber-300 text-sm tracking-widest">{generatedPhoneCode}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <span>Auto-Fill & Verify</span>
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#071714]/95 backdrop-blur-3xl border border-emerald-500/35 rounded-[2.5rem] shadow-[0_20px_60px_rgba(7,23,20,0.9)] p-6 sm:p-8 md:p-10 relative overflow-hidden">
          
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/70 border border-emerald-500/40 rounded-full text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              <Sprout size={14} className="text-emerald-400" />
              <span>Agro Portal • Agricultural Innovation Gateway</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-montserrat tracking-tight uppercase">
              Kisan Mitra Login
            </h1>

            <p className="text-xs text-slate-300">
              Enter your mobile number and primary crop details to access Agro Hub
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <User size={13} className="text-emerald-400" />
                <span>Farmer / Innovator Name</span>
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-400" />
                  <span>Mobile Number</span>
                </label>
                {phoneVerified && (
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Verified
                  </span>
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
                    className="flex-1 min-w-0 p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  className={`px-5 py-3.5 font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 border ${
                    phoneOtpSent 
                      ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-400/30 shadow-amber-900/20' 
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white border-white/20 shadow-emerald-900/40'
                  }`}
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>{phoneOtpSent ? (phoneTimer > 0 ? `Resend (${phoneTimer}s)` : 'Resend OTP') : 'Send OTP'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <Wheat size={13} className="text-amber-400" />
                <span>Primary Crops & Techniques</span>
              </label>
              <input 
                type="text" 
                value={primaryCrops} 
                onChange={e => setPrimaryCrops(e.target.value)} 
                required 
                className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-emerald-400" />
                <span>District & State</span>
              </label>
              <input 
                type="text" 
                value={districtState} 
                onChange={e => setDistrictState(e.target.value)} 
                required 
                className="w-full p-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="pt-3 space-y-3">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] border border-white/20"
              >
                <ShieldCheck size={18} />
                <span>Login & Open Agro Hub</span>
                <ArrowRight size={16} />
              </button>

              {onDirectEnter && (
                <button
                  type="button"
                  onClick={onDirectEnter}
                  className="w-full py-3 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-amber-500/40 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                  <span>⚡ Instant 1-Click Enter (Skip to Agro Hub)</span>
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default FarmerLoginScreen;
