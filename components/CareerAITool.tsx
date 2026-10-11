

import React, { useState } from 'react';
import { getCareerSuggestion } from '../services/api.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx';
// FIX: Add missing Lucide React icons
import { 
  Briefcase, Sparkles, Loader2, Send, GraduationCap, XCircle
} from 'lucide-react';

declare global {
  interface Window {
    // renderMathInElement and katex are no longer used
  }
}

// FIX: Define the CareerAITool component
export const CareerAITool: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSuggest = async () => {
    if (!interests.trim()) return;
    setIsLoading(true);
    setSuggestion('');
    setError('');
    try {
      const result = await getCareerSuggestion(interests);
      setSuggestion(result);
    } catch (err) {
      setError('Neural link failed. Please retry your query.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in duration-1000">
      <div className="p-10 md:p-14 relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Briefcase size={120} />
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={12} />
            Predictive Career Intelligence
          </div>
          
          <h3 className="text-4xl font-black text-white tracking-tighter">Forge Your Future Path</h3>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Synthesize your interests with global market trends. Let our AI architect your professional trajectory.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., sustainable energy, space travel, neural architecture..."
                className="w-full bg-slate-800 border border-white/5 rounded-2xl py-5 px-6 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSuggest}
              disabled={isLoading || !interests.trim()}
              className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Architect Path
            </button>
          </div>
          
          {error && (
            <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
              <XCircle size={14} />
              {error}
            </div>
          )}

          {suggestion && (
            <div className="mt-10 pt-8 border-t border-white/5 text-left animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 mb-6 ml-1">
                   <GraduationCap size={18} className="text-blue-500" />
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AI Trajectory Analysis</h4>
                </div>
                <div className="prose prose-invert max-w-none">
                    <MarkdownRenderer content={suggestion} />
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
