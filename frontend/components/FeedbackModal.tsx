import React, { useState } from 'react';
import { X, MessageSquare, Send, ShieldCheck, Zap } from 'lucide-react';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (data: { type: string; message: string; contact: string }) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [feedbackType, setFeedbackType] = useState('Suggestion');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit({ type: feedbackType, message, contact });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10 space-y-10">
          <header className="space-y-4 text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto shadow-inner ring-1 ring-white/5">
               <MessageSquare size={32} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">System Feedback</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Refine the Legacy Ecosystem</p>
            </div>
          </header>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Feedback Vector</label>
              <div className="relative group">
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer pr-10"
                >
                  <option>Suggestion</option>
                  <option>Bug Report</option>
                  <option>General Comment</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Zap size={14} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Transmission Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Synthesize your observations here..."
                rows={4}
                required
                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[140px] placeholder:text-slate-600"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Uplink Identity (Optional)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Name or Neural Address"
                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={!message.trim()}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                Authorize Transmission
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldCheck size={10} /> Secure Node
                 </div>
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <Zap size={10} /> End-to-End Encryption
                 </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;