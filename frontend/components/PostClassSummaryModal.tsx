
import React from 'react';
import { X, Award, Clock, Users, ArrowRight, Zap, Star } from 'lucide-react';

interface PostClassSummaryModalProps {
  elapsedTime: number;
  userRole: 'teacher' | 'student';
  onClose: () => void;
}

const PostClassSummaryModal: React.FC<PostClassSummaryModalProps> = ({ elapsedTime, userRole, onClose }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(59,130,246,0.2)] w-full max-w-xl overflow-hidden relative animate-in zoom-in-95 duration-500">
        <div className="p-12 text-center space-y-10">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-600/20 rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto border border-blue-500/20 shadow-2xl relative z-10">
               <Award size={48} />
            </div>
            <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full"></div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat leading-tight">Session Concluded</h2>
            <p className="text-slate-500 font-medium text-lg">Neural transmission successful. Academic nodes synchronized.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                   <Clock size={12} className="text-blue-400" /> Temporal Duration
                </p>
                <p className="text-2xl font-black text-white">{formatTime(elapsedTime)}</p>
             </div>
             <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                   <Star size={12} className="text-amber-400" /> Quota Efficiency
                </p>
                <p className="text-2xl font-black text-white">98%</p>
             </div>
          </div>

          <div className="space-y-6 pt-4">
             <div className="bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/5 text-left flex items-center gap-5">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                   <Zap size={24} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-tight">Archive Generated</h4>
                   <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest mt-1">High-fidelity replay in Media Vault</p>
                </div>
                <ArrowRight size={20} className="ml-auto text-slate-700" />
             </div>

             <button 
               onClick={onClose}
               className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest"
             >
                Return to Hub
             </button>
          </div>

          <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Future Legacy Protocol v4.2</p>
        </div>
      </div>
    </div>
  );
};

export default PostClassSummaryModal;
