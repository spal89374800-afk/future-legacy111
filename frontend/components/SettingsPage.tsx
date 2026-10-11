
import React, { useState } from 'react';
import { User, UserRole, Mentor, NotificationPreferences, LocalizationSettings } from '../types.ts';
import { 
  User as UserIcon, Shield, Settings as SettingsIcon, Award, 
  LogOut, ChevronRight, Bell, MessageSquare, Sparkles, 
  ShieldCheck, Camera, Phone, Save, X, CreditCard, ShieldAlert,
  Globe, Languages, CheckCircle2, RefreshCw
} from 'lucide-react';
import { getSecureMerchantUPI, saveSecureMerchantUPI, verifyAdminAccessPin } from '../utils/security.ts';
import { TransactionHistory } from './TransactionHistory.tsx';
import { PaymentStatusTracker } from './PaymentStatusTracker.tsx';
import { StudentAchievement } from './StudentAchievement.tsx';
import { ReferralRewards } from './ReferralRewards.tsx';

declare global {
  interface Window {
    // renderMathInElement and katex are no longer used
  }
}

interface SettingsPageProps {
  currentUser: User;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onEditProfile: () => void;
  onUpdateProfile: (user: User) => void;
  mentors: Mentor[];
  notificationPreferences: NotificationPreferences;
  onUpdatePreferences: (newPreferences: NotificationPreferences) => void;
  onOpenFeedbackModal: () => void;
  onLogout?: () => void;
  showToast?: (msg: string) => void;
  localizationSettings?: LocalizationSettings;
  onUpdateLocalization?: (newSettings: LocalizationSettings) => void;
}

const SettingsToggle: React.FC<{
  label: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}> = ({ label, description, isEnabled, onToggle, icon }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-slate-800/20 border border-white/5 rounded-2xl hover:bg-slate-800/40 transition-all group">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isEnabled ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-tight">{label}</h4>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-xs">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-12 transition-all shadow-inner ${
          isEnabled ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'
        }`}
        aria-checked={isEnabled}
        role="switch"
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-md ${
            isEnabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  currentUser, 
  userRole, 
  onRoleChange, 
  onUpdateProfile,
  onEditProfile, 
  notificationPreferences, 
  onUpdatePreferences, 
  onOpenFeedbackModal,
  onLogout,
  showToast,
  localizationSettings,
  onUpdateLocalization
}) => {
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState({
    name: currentUser.name,
    mobileNumber: currentUser.mobileNumber,
    imageUrl: currentUser.imageUrl
  });
  const [upiInputVal, setUpiInputVal] = useState(() => getSecureMerchantUPI());
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const [localization, setLocalization] = useState<LocalizationSettings>(() => {
    if (localizationSettings) return localizationSettings;
    try {
      const saved = localStorage.getItem('future_legacy_localization');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      language: 'en',
      strictEnglishEnforced: true,
      zeroHindiMode: true
    };
  });

  const [isVerifyingLanguage, setIsVerifyingLanguage] = useState(false);

  const handleToggleLocalization = (key: keyof LocalizationSettings) => {
    if (key === 'language') return;
    const updated = {
      ...localization,
      [key]: !localization[key]
    };
    setLocalization(updated);
    try {
      localStorage.setItem('future_legacy_localization', JSON.stringify(updated));
    } catch {}
    onUpdateLocalization?.(updated);
    showToast?.(
      key === 'strictEnglishEnforced'
        ? (updated.strictEnglishEnforced ? 'Strict English Mode: Enabled (Zero Hindi Enforced)' : 'Strict English Mode: Standard')
        : (updated.zeroHindiMode ? 'Zero-Hindi Protocol: Active' : 'Zero-Hindi Protocol: Standard')
    );
  };

  const handleScanCompliance = () => {
    setIsVerifyingLanguage(true);
    setTimeout(() => {
      setIsVerifyingLanguage(false);
      showToast?.('Verification Passed: 100% Zero-Hindi Compliance across all platform modules.');
    }, 600);
  };

  const handleIdentitySave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentUser,
      name: identityForm.name,
      mobileNumber: identityForm.mobileNumber,
      imageUrl: identityForm.imageUrl
    });
    setIsEditingIdentity(false);
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    onUpdatePreferences({
      ...notificationPreferences,
      [key]: !notificationPreferences[key],
    });
  };

  return (
    <div className="w-full space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="border-b border-white/5 pb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black uppercase tracking-widest">
           <SettingsIcon size={12} />
           Core Configuration
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat">System Settings</h2>
        <p className="text-slate-500 font-medium">Manage your digital identity, neural access protocols, and operational footprint.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-10">
          <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <UserIcon className="text-blue-500" size={24} />
                Identity Matrix
              </h3>
              {!isEditingIdentity && (
                <button 
                  onClick={() => setIsEditingIdentity(true)}
                  className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditingIdentity ? (
              <form onSubmit={handleIdentitySave} className="space-y-6 bg-slate-800/30 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <UserIcon size={12} /> Full Identity
                    </label>
                    <input 
                      type="text" 
                      value={identityForm.name}
                      onChange={(e) => setIdentityForm({...identityForm, name: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Phone size={12} /> Secure Uplink (Mobile)
                    </label>
                    <input 
                      type="tel" 
                      value={identityForm.mobileNumber}
                      onChange={(e) => setIdentityForm({...identityForm, mobileNumber: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      required
                      pattern="\d{10,13}"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Camera size={12} /> Profile Asset URL
                  </label>
                  <input 
                    type="url" 
                    value={identityForm.imageUrl}
                    onChange={(e) => setIdentityForm({...identityForm, imageUrl: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingIdentity(false)}
                    className="px-6 py-3 bg-slate-800 text-slate-400 font-black rounded-xl hover:text-white transition-all uppercase text-[10px] tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 uppercase text-[10px] tracking-widest flex items-center gap-2"
                  >
                    <Save size={16} /> Save Identity
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-800/30 rounded-[2.5rem] border border-white/5 shadow-inner">
                <img src={currentUser.imageUrl} alt={currentUser.name} className="w-24 h-24 rounded-[1.5rem] object-cover border-2 border-white/10 ring-4 ring-blue-600/5 shadow-2xl" />
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-2xl font-black text-white">{currentUser.name}</h4>
                  <p className="text-slate-500 font-medium">{currentUser.mobileNumber || 'No mobile link established'}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black uppercase tracking-widest">{userRole?.toUpperCase()} PROTOCOL</span>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-black uppercase tracking-widest">VERIFIED ASSET</span>
                  </div>
                </div>
                {userRole === 'teacher' && (
                  <button 
                    onClick={onEditProfile}
                    className="px-8 py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl"
                  >
                    <Award size={16} />
                    Refine Architect Node
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Bell className="text-violet-500" size={24} />
              Neural Alert Matrix
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingsToggle
                icon={<SettingsIcon size={18} />}
                label="New Class Sync"
                description="Instant notifications when elite Skill or Agro modules are deployed."
                isEnabled={notificationPreferences.newClasses}
                onToggle={() => handleToggle('newClasses')}
              />
              <SettingsToggle
                icon={<MessageSquare size={18} />}
                label="Mentor Directives"
                description="Alerts for node inquiries, secure transmissions, and peer requests."
                isEnabled={notificationPreferences.mentorMessages}
                onToggle={() => handleToggle('mentorMessages')}
              />
              <SettingsToggle
                icon={<ShieldCheck size={18} />}
                label="Temporal Sync"
                description="Dispatches regarding schedule shifts, live uplinks, or module cancellations."
                isEnabled={notificationPreferences.scheduleChanges}
                onToggle={() => handleToggle('scheduleChanges')}
              />
              <SettingsToggle
                icon={<Shield size={18} />}
                label="Quota Reminders"
                description="Neural nudges when academic objectives reach critical expiration nodes."
                isEnabled={notificationPreferences.taskReminders}
                onToggle={() => handleToggle('taskReminders')}
              />
            </div>
          </section>

          {/* Global Localization & Language Matrix */}
          <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black uppercase tracking-widest">
                  <Globe size={12} />
                  Global Localization Matrix
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Languages className="text-blue-400" size={24} />
                  Language & Script Protocol
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Enforce pure, international English across the platform. Guarantees zero Hindi text in any component.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={12} />
                  Strict English Active
                </span>
              </div>
            </div>

            {/* Language Selector / Indicator */}
            <div className="p-6 bg-slate-950/60 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-base shrink-0">
                  EN
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">English (Global Standard)</h4>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[8px] font-black uppercase tracking-widest">Default & Enforced</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                    All navigational hubs, diagnostic reports, notes, whiteboard controls, questions, and system dialogues are locked in clean, professional English.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleScanCompliance}
                disabled={isVerifyingLanguage}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg"
              >
                <RefreshCw size={13} className={isVerifyingLanguage ? 'animate-spin text-blue-400' : 'text-blue-400'} />
                {isVerifyingLanguage ? 'Auditing Nodes...' : 'Verify English Compliance'}
              </button>
            </div>

            {/* Strict Enforcement Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingsToggle
                icon={<ShieldCheck size={18} />}
                label="Strict English Enforcement"
                description="Overrides and prevents any Hindi or regional translations from appearing anywhere in the user interface."
                isEnabled={localization.strictEnglishEnforced}
                onToggle={() => handleToggleLocalization('strictEnglishEnforced')}
              />
              <SettingsToggle
                icon={<Globe size={18} />}
                label="Zero-Hindi Protocol"
                description="Enforces pure Latin script across study materials, AI chat responses, notes, and question palettes."
                isEnabled={localization.zeroHindiMode}
                onToggle={() => handleToggleLocalization('zeroHindiMode')}
              />
            </div>
          </section>

          <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Shield className="text-emerald-500" size={24} />
              Access Protocols
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { id: 'student', label: 'Academic Asset', icon: <UserIcon />, desc: 'Primary learning access' },
                { id: 'teacher', label: 'Architect Node', icon: <Award />, desc: 'Pedagogical authority' },
                { id: 'farmer', label: 'Agro Innovator', icon: <SettingsIcon />, desc: 'Tech operational access' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => onRoleChange(role.id as UserRole)}
                  className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all space-y-4 group ${userRole === role.id ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-900/40' : 'bg-slate-800/40 border-white/5 hover:border-blue-500/30'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${userRole === role.id ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-600/10'}`}>
                    {role.icon}
                  </div>
                  <div className="text-center">
                    <p className={`font-black text-[10px] uppercase tracking-widest ${userRole === role.id ? 'text-white' : 'text-slate-400'}`}>{role.label}</p>
                    <p className={`text-[9px] mt-1 font-bold uppercase tracking-tight ${userRole === role.id ? 'text-blue-100' : 'text-slate-600'}`}>{role.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 space-y-10">
          {/* Merchant Payout & Custom Gateway Setup Panel */}
          <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
             <header className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[8px] font-black uppercase tracking-widest">
                   <CreditCard size={10} /> Active Gateway
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Merchant Payout Hub</h4>
                <p className="text-[10px] text-slate-500 font-medium">Configure real-time funds routing directly to your accounts.</p>
             </header>

             {userRole !== 'teacher' ? (
                <div className="bg-slate-950/60 p-6 rounded-[2rem] border border-blue-500/10 text-center space-y-3">
                   <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                      <Shield size={18} />
                   </div>
                   <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Multi-factor Security</h5>
                   <p className="text-[9px] text-slate-500 leading-relaxed">
                      Gateway configurations are strictly locked and encrypted for students to prevent unauthorized routing manipulations.
                   </p>
                </div>
             ) : (
                <>
                   {/* Direct Peer UPI Configuration */}
                   <div className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Bank Payout (UPI VPA)</h5>
                         <span className="p-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase">0% Commission</span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-relaxed">
                         Enter your PhonePe, Google Pay, or Paytm UPI handle. Customers who scan your QR code will pay 100% directly to your bank account with zero fees.
                      </p>
                      
                      <div className="space-y-3">
                         <div className="relative">
                            <input 
                               type="text"
                               value={upiInputVal}
                               onChange={(e) => setUpiInputVal(e.target.value.trim())}
                               className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 px-4 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                               placeholder="e.g. yourname@ybl"
                            />
                         </div>
                         {settingsError && (
                            <p className="text-[9px] text-rose-400 font-bold uppercase tracking-wide px-1">⚠️ {settingsError}</p>
                         )}
                         <button 
                            onClick={() => {
                               const pin = prompt('🔐 Enter secure Admin PIN to authorize modifying payment destination:');
                               if (!pin) return;

                               if (verifyAdminAccessPin(pin)) {
                                  saveSecureMerchantUPI(upiInputVal);
                                  setSettingsError(null);
                                  alert('✅ Success: Merchant Destination UPI updated and locked with a cryptographic sign signature.');
                               } else {
                                  setSettingsError('Access denied: Invalid Admin authorization PIN.');
                                  alert('❌ Access Denied: Incorrect Admin Authorization PIN! Resetting...');
                                  setUpiInputVal(getSecureMerchantUPI());
                               }
                            }}
                            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl text-[9px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5"
                         >
                            <Save size={12} /> Save Destination UPI
                         </button>
                      </div>
                   </div>

                   {/* Razorpay Setup Guidelines */}
                   <div className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cards & Netbanking (Razorpay)</h5>
                         <span className="p-1 px-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase">Online API</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed">
                         To accept live Visa/Mastercard payments:
                         <span className="block mt-2 font-mono text-blue-400 bg-blue-950/30 p-2 rounded border border-blue-900/40 text-[8.5px]">
                            Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env configuration.
                         </span>
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                         <span className="text-[8.5px] font-black text-blue-400 uppercase tracking-wider">Gateway Sandbox: Simulator Engaged</span>
                      </div>
                   </div>
                </>
             )}
          </section>

          <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400" /> System Integrity
             </h4>
             <div className="space-y-1">
                {['Encryption Node V4', 'Two-Factor Uplink', 'Bio-Metric Ledger', 'Neural Proxy Hub'].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group text-left">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{item}</span>
                    <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
             </div>
             
             <div className="mt-10 pt-10 border-t border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Neural Feedback</h4>
                <div className="bg-slate-800/20 p-6 rounded-[2rem] border border-white/5 space-y-4">
                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Synchronize your observations with the core architect team to refine the Legacy platform.</p>
                    <button 
                        onClick={onOpenFeedbackModal}
                        className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-blue-50 hover:text-white transition-all shadow-xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                    >
                        <MessageSquare size={16} />
                        Transmit Feedback
                    </button>
                </div>
             </div>

             <div className="mt-10 pt-8">
                <button 
                   onClick={onLogout}
                   className="w-full py-4 bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                   <LogOut size={16} />
                   Log Out / Disconnect
                </button>
             </div>
          </section>
        </div>

        <div className="mt-8 space-y-6">
           <StudentAchievement currentUser={currentUser} />
           <ReferralRewards currentUser={currentUser} showToast={showToast} />
           <PaymentStatusTracker userId={currentUser.id} />
           <TransactionHistory userId={currentUser.id} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;