import React, { useState } from 'react';
import { getSkillClassSuggestions } from '../services/api.ts';
import { Sparkles, Loader2, Brain, Zap, AlertCircle, ArrowRight } from 'lucide-react';

interface AISuggestionBannerProps {
  studentInterests: string;
  enrolledClassTitles: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const AISuggestionBanner: React.FC<AISuggestionBannerProps> = ({ studentInterests, enrolledClassTitles, onSuggestionClick }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const result = await getSkillClassSuggestions(studentInterests, enrolledClassTitles);
      if (!result || result.length === 0) {
        setError("Neural link could not synthesize recommendations. Protocol restart advised.");
      } else {
        setSuggestions(result);
      }
    } catch (err) {
      setError('Neural network connectivity failure. Verification required.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-white/5 rounded-[2.5rem] p-8 md:p-10 my-10 relative overflow-hidden shadow-2xl group animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Ambient background decor */}
      <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-[3s]">
        <Brain size={160} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)] flex-shrink-0">
            <Sparkles size={32} className="fill-current" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-montserrat">Neural Inspiration Hub</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Synthesize high-performance academic suggestions tailored to your neural profile.
            </p>
          </div>
        </div>
        
        <button
          onClick={handleGetSuggestions}
          disabled={isLoading}
          className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 uppercase text-[10px] tracking-widest whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Synthesizing...
            </>
          ) : (
            <>
              <Zap size={16} className="fill-current" />
              Generate Directives
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="mt-10 pt-8 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-6 ml-1">
             <ArrowRight size={14} className="text-blue-500" />
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recommended Trajectories</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="bg-slate-900/50 hover:bg-blue-600 hover:text-white border border-white/5 hover:border-blue-400 text-slate-300 text-[10px] font-black py-2.5 px-5 rounded-xl transition-all shadow-lg hover:shadow-blue-900/20 uppercase tracking-widest flex items-center gap-2 group/tag"
              >
                <span className="w-1 h-1 bg-blue-500 rounded-full group-hover/tag:bg-white transition-colors" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestionBanner;