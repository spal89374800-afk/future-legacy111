import React, { useState } from 'react';
import { Users, Share2, Copy, Check, Gift, Award, Star, Trophy, Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface ReferralRewardsProps {
  currentUser: User;
  showToast?: (msg: string) => void;
}

interface ReferredFriend {
  id: string;
  name: string;
  date: string;
  status: 'Enrolled' | 'Pending';
  rewardEarned: string;
}

interface ReferralTier {
  id: string;
  requiredCount: number;
  title: string;
  rewardDescription: string;
  badgeName: string;
  icon: any;
  unlocked: boolean;
}

export const ReferralRewards: React.FC<ReferralRewardsProps> = ({ currentUser, showToast }) => {
  const [copied, setCopied] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState('');
  const [referredList, setReferredList] = useState<ReferredFriend[]>([
    { id: 'ref-1', name: 'Aarav Gupta', date: '2026-09-18', status: 'Enrolled', rewardEarned: '10% Discount + 500 XP' },
    { id: 'ref-2', name: 'Sneha Patel', date: '2026-09-20', status: 'Enrolled', rewardEarned: '10% Discount + 500 XP' },
    { id: 'ref-3', name: 'Rohan Verma', date: '2026-09-21', status: 'Pending', rewardEarned: 'Pending Enrollment' }
  ]);

  const referralCode = `FL-${currentUser.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)}-${currentUser.id.slice(-4)}`;
  const referralLink = `https://futurelegacy.app/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast?.('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedEmail.trim() || !invitedEmail.includes('@')) {
      showToast?.('Please enter a valid email address.');
      return;
    }

    const newFriend: ReferredFriend = {
      id: `ref-${Date.now()}`,
      name: invitedEmail.split('@')[0],
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      rewardEarned: 'Pending Enrollment'
    };

    setReferredList([newFriend, ...referredList]);
    setInvitedEmail('');
    showToast?.(`Invitation successfully sent to ${invitedEmail}!`);
  };

  const totalInvites = referredList.length;
  const successfulEnrolments = referredList.filter(r => r.status === 'Enrolled').length;
  const currentDiscount = successfulEnrolments >= 3 ? '25%' : successfulEnrolments >= 1 ? '10%' : '0%';
  const totalXP = successfulEnrolments * 500;

  const tiers: ReferralTier[] = [
    {
      id: 'tier-1',
      requiredCount: 1,
      title: 'Community Starter',
      rewardDescription: '10% Course Discount + 500 XP',
      badgeName: 'Friendly Scholar',
      icon: Users,
      unlocked: successfulEnrolments >= 1
    },
    {
      id: 'tier-2',
      requiredCount: 3,
      title: 'Campus Vanguard',
      rewardDescription: '25% All Courses Discount + 1,500 XP + Ambassador Badge',
      badgeName: 'Campus Vanguard',
      icon: Award,
      unlocked: successfulEnrolments >= 3
    },
    {
      id: 'tier-3',
      requiredCount: 5,
      title: 'Future Legacy Elite',
      rewardDescription: '50% Lifetime Scholarship + Gold Crown Profile Frame',
      badgeName: 'Legacy Ambassador',
      icon: Trophy,
      unlocked: successfulEnrolments >= 5
    }
  ];

  return (
    <div className="bg-slate-900 border border-blue-500/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Gift size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">Referral Rewards Program</span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">Active Discount: {currentDiscount}</span>
            </div>
            <h3 className="text-lg font-black font-montserrat text-white mt-1">Invite Friends, Earn Badges & Discounts</h3>
          </div>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Referral XP</p>
            <p className="text-base font-black text-blue-400 font-montserrat">+{totalXP.toLocaleString()} XP</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-white/5 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Your Exclusive Referral Code & Link</h4>
            <p className="text-xs text-slate-400 mt-0.5">Share your link with classmates and friends. When they join Future Legacy, you both earn rewards!</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            {referralCode}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-300 font-mono truncate select-all">
            {referralLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied Link!' : 'Copy Link'}
          </button>
        </div>

        {/* Quick Share Buttons */}
        <div className="pt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2">Quick Share:</span>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join Future Legacy using my invite link and get free premium perks and discounts: ${referralLink}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join Future Legacy with my referral link!')}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            Telegram
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent('Invitation to Future Legacy Platform')}&body=${encodeURIComponent(`Hey,\n\nCheck out Future Legacy, the advanced academic and professional training platform. Join using my referral link to unlock special course discounts: ${referralLink}`)}`}
            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            Email Invite
          </a>
        </div>
      </div>

      {/* Invite by Email Input */}
      <form onSubmit={handleSendInvite} className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5 space-y-3 relative z-10">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Share2 size={14} className="text-blue-400" /> Send Direct Email Invitation
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={invitedEmail}
            onChange={(e) => setInvitedEmail(e.target.value)}
            placeholder="friend.email@example.com"
            className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Send Invite <ArrowRight size={14} />
          </button>
        </div>
      </form>

      {/* Referral Milestone Tiers */}
      <div className="space-y-4 relative z-10">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Referral Milestone Tiers & Badges</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  tier.unlocked
                    ? 'bg-gradient-to-b from-blue-950/40 to-slate-950 border-blue-500/40 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-950/30 border-white/5 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${tier.unlocked ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <Icon size={20} className="stroke-[2.5]" />
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${tier.unlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                      {tier.unlocked ? 'Unlocked' : `${tier.requiredCount} Friends`}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-sm text-white font-montserrat">{tier.title}</h5>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{tier.rewardDescription}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Badge: <span className="text-blue-400 font-bold">{tier.badgeName}</span></span>
                  {tier.unlocked && <ShieldCheck size={16} className="text-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referred Friends History */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Referred Friends Activity ({totalInvites})</h4>
          <span className="text-xs text-slate-400">{successfulEnrolments} Successful Enrolments</span>
        </div>

        <div className="bg-slate-950/60 rounded-3xl border border-white/5 overflow-hidden">
          {referredList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No invitations sent yet. Share your link above to start earning!</div>
          ) : (
            <div className="divide-y divide-white/5">
              {referredList.map((ref) => (
                <div key={ref.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 font-bold text-xs flex items-center justify-center">
                      {ref.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{ref.name}</h5>
                      <p className="text-[10px] text-slate-500">Invited on {ref.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-amber-400 hidden sm:inline">{ref.rewardEarned}</span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${ref.status === 'Enrolled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
