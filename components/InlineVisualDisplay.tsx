
import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to the import
import { generateGeminiImage } from '../services/geminiService.ts';
import { Loader2, RefreshCw, ShieldCheck, Maximize2, AlertCircle } from 'lucide-react';

interface InlineVisualDisplayProps {
  prompt: string;
}

const InlineVisualDisplay: React.FC<InlineVisualDisplayProps> = ({ prompt }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the actual Gemini image generation service
      const dataUrl = await generateGeminiImage(prompt);
      setImageUrl(dataUrl);
    } catch (err: any) {
      console.error("Visual generation error:", err.message);
      setError("Failed to synchronize HD Visual. Neural link timeout.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [prompt]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 bg-slate-50 rounded-[3rem] my-16 border-2 border-dashed border-slate-200 animate-in fade-in">
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-blue-500/10 blur-3xl animate-pulse rounded-full"></div>
           <Loader2 className="animate-spin text-blue-600 relative z-10" size={80} />
        </div>
        <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.5em] text-center">Synthesizing Macro-Scale Schematic...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose rounded-[2rem] my-12 border border-rose-100 text-center gap-6 animate-in fade-in">
        <AlertCircle className="text-rose-500" size={40} />
        <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">{error}</p>
        <button 
          onClick={fetchImage}
          className="px-10 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/10"
        >
          Retry Link
        </button>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="my-20 relative group animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Elite Badge */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] flex items-center gap-3 shadow-2xl border border-white/10">
                <ShieldCheck size={18} className="text-emerald-400" /> 
                EXHAUSTIVE MASTER SCHEMATIC
            </div>
        </div>
        
        {/* Full Width Image Container */}
        <div className="relative rounded-[2.5rem] bg-white border-[12px] border-slate-100 overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.15)] group-hover:border-blue-50 transition-all duration-700">
            <img
              src={imageUrl}
              alt={`Academic Diagram: ${prompt}`}
              className="w-full h-auto object-contain transition-all duration-1000 group-hover:scale-[1.01]"
              style={{ minHeight: '600px' }} // Increased for full-page theory integration
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>
        
        {/* Interaction Bar */}
        <div className="absolute inset-x-0 -bottom-10 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-30">
            <div className="flex gap-4">
              <button 
                  onClick={fetchImage}
                  className="px-12 py-5 bg-slate-900 text-white border border-white/10 rounded-2xl text-[12px] font-black hover:bg-blue-600 transition-all uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl"
              >
                  <RefreshCw size={18} /> Re-Synthesize
              </button>
              <a 
                  href={imageUrl}
                  target="_blank"
                  className="p-5 bg-slate-900 text-white border border-white/10 rounded-2xl hover:bg-emerald-600 transition-all shadow-2xl"
              >
                  <Maximize2 size={24} />
              </a>
            </div>
        </div>

        {/* Legend Placeholder */}
        <p className="mt-12 text-center text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] px-16 leading-relaxed">
            Note: Every label in this macro-schematic corresponds to the exhaustive theory provided below.
        </p>
      </div>
    );
  }

  return null;
};

export default InlineVisualDisplay;
