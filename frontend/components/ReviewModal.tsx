

import React, { useState } from 'react';
import { X, Star, Send, Award, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

// Removed unused declare global for renderMathInElement and katex

interface ReviewModalProps {
  itemName: string;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string }) => void;
}

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex justify-center items-center gap-2 text-4xl">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        const isActive = ratingValue <= (hover || rating);
        return (
          <button
            type="button"
            key={ratingValue}
            className={`transition-all duration-300 transform hover:scale-125 ${isActive ? 'text-amber-400' : 'text-slate-700'}`}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${ratingValue} stars`}
          >
            <Star 
              size={36} 
              fill={isActive ? 'currentColor' : 'none'} 
              strokeWidth={isActive ? 1.5 : 2}
              className={isActive ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' : ''}
            />
          </button>
        );
      })}
    </div>
  );
};

const ReviewModal: React.FC<ReviewModalProps> = ({ itemName, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10 space-y-10">
          <header className="space-y-4 text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto shadow-inner ring-1 ring-white/5">
               <Award size={32} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat leading-tight">Leave a Review</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Audit of node: <span className="text-blue-400">{itemName}</span></p>
            </div>
          </header>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Quality Synchronicity</label>
                <StarRatingInput rating={rating} setRating={setRating} />
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <MessageSquare size={12} /> Detailed Observations (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Synthesize your experience with this module..."
                rows={4}
                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[140px] placeholder:text-slate-600 shadow-inner"
              ></textarea>
            </div>

            <div className="pt-4 space-y-6">
              <button 
                type="submit" 
                disabled={rating === 0}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
              >
                <Send size={18} />
                Authorize Transmission
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldCheck size={10} /> Verified Record
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

export default ReviewModal;