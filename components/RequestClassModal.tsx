

import React, { useState } from 'react';
import type { Mentor } from '../types.ts';
import { X, BookOpen, Send, ShieldCheck, Sparkles } from 'lucide-react';

interface RequestClassModalProps {
  teacher: Mentor;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

const RequestClassModal: React.FC<RequestClassModalProps> = ({ teacher, onClose, onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.1)] w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10 space-y-10">
          <header className="space-y-4 text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto shadow-inner ring-1 ring-white/5">
               <BookOpen size={32} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat leading-tight">Request Protocol</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Uplink to Architect: <span className="text-blue-400">{teacher.name}</span></p>
            </div>
          </header>

          <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-white/5 space-y-2 text-center">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">Describe the pedagogical parameters of your request. This transmission will be reviewed by the mentor node for curriculum integration.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Sparkles size={12} className="text-blue-500" /> Curricula Vision
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Synthesize the topic or discipline you wish to explore..."
                rows={5}
                required
                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[160px] placeholder:text-slate-600 shadow-inner"
              ></textarea>
            </div>

            <div className="pt-4 space-y-6">
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 py-5 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest"
                >
                  Abort
                </button>
                <button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="flex-[2] py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  Transmit Request
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-6 opacity-30">
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldCheck size={10} /> Verified Channel
                 </div>
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <Sparkles size={10} /> Neural Feedback
                 </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestClassModal;