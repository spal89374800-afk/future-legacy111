import React, { useState } from 'react';
import type { AgriBotAnalysis } from '../types.ts';
import { Bot, Camera, ShieldCheck, Video, ArrowLeft } from 'lucide-react';

interface AgriBotAIPageProps {
  onGetAgriBotAnalysis: (media: any, question: string, location: string, language: string) => void;
  agriBotAnalysis: AgriBotAnalysis | null;
  isAgriBotLoading: boolean;
  onGenerateAgriBotVideo: (findings: string, language: string) => void;
}

const AgriBotAIPage: React.FC<AgriBotAIPageProps> = ({
  onGetAgriBotAnalysis,
  agriBotAnalysis,
  isAgriBotLoading,
  onGenerateAgriBotVideo,
}) => {
  const [botQuestion, setBotQuestion] = useState('');
  const [botPreview, setBotPreview] = useState<string | null>(null);
  const [isShowingResults, setIsShowingResults] = useState(false);

  // Sync isShowingResults with analysis presence
  React.useEffect(() => {
    if (agriBotAnalysis) setIsShowingResults(true);
  }, [agriBotAnalysis]);

  const handleBotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExecuteBot = () => {
    if (!botPreview || !botQuestion) return;
    const media = { inlineData: { data: botPreview.split(',')[1], mimeType: 'image/jpeg' } };
    onGetAgriBotAnalysis(media, botQuestion, "Indore, India", "English");
  };

  const handleBackToInput = () => {
      setIsShowingResults(false);
  };

  if (isShowingResults && agriBotAnalysis && !isAgriBotLoading) {
      return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-10">
              <div className="flex items-center justify-between">
                  <button 
                    onClick={handleBackToInput}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-slate-300 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 group shadow-xl"
                  >
                     <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Re-Diagnostic Scan
                  </button>
                  <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      Diagnostic ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl flex flex-col gap-10">
                  <div className="flex justify-between items-center border-b border-white/5 pb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><ShieldCheck size={28} /></div>
                        <h4 className="text-2xl font-black text-white tracking-tight uppercase">Analysis Findings</h4>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Confidence Index</p>
                        <p className="text-3xl font-black text-white">{Math.round(agriBotAnalysis.confidence * 100)}%</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="bg-slate-800/30 rounded-3xl p-8 border border-white/5">
                            <p className="text-lg font-medium text-slate-200 leading-relaxed break-words">{agriBotAnalysis.findings}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {agriBotAnalysis.recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-slate-800/20 border border-white/5 rounded-2xl hover:bg-slate-800 transition-colors group">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs group-hover:bg-emerald-500 group-hover:text-white transition-all">{i+1}</div>
                                <p className="text-slate-400 text-sm font-medium group-hover:text-white break-words">{rec}</p>
                            </div>
                            ))}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                          <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                             <img src={botPreview!} className="w-full h-full object-cover" alt="Scanned Asset" />
                          </div>
                          <button 
                            onClick={() => onGenerateAgriBotVideo(agriBotAnalysis.findings, 'English')}
                            className="w-full py-6 border border-blue-500/20 bg-blue-600/5 text-blue-400 font-black rounded-3xl hover:bg-blue-600 hover:text-white transition-all uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10"
                          >
                            <Video size={20} />
                            Synthesize Instructional Video (Veo)
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
       <div className="xl:col-span-5 space-y-8">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
             <div 
              className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${botPreview ? 'border-emerald-500/30' : 'border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/50'}`}
              onClick={() => document.getElementById('bot-upload')?.click()}
             >
               {botPreview ? <img src={botPreview} className="w-full h-full object-cover" /> : (
                 <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mx-auto"><Camera size={32} /></div>
                    <p className="text-slate-400 font-bold text-sm">Capture Asset Image</p>
                 </div>
               )}
               <input type="file" id="bot-upload" className="hidden" accept="image/*" onChange={handleBotFileChange} />
             </div>
             <textarea 
              value={botQuestion}
              onChange={(e) => setBotQuestion(e.target.value)}
              placeholder="Describe specific symptoms or goals..."
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[120px] shadow-inner"
             />
             <button 
              onClick={handleExecuteBot}
              disabled={isAgriBotLoading || !botPreview || !botQuestion}
              className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 uppercase text-xs tracking-widest disabled:opacity-50"
             >
               {isAgriBotLoading ? <div className="animate-spin border-2 border-white/30 border-t-white w-5 h-5 rounded-full" /> : <Bot size={20} />}
               Execute Diagnostic
             </button>
          </div>
       </div>
       <div className="xl:col-span-7">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 h-full flex flex-col shadow-2xl min-h-[500px]">
             {isAgriBotLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse rounded-full"></div>
                    <Bot size={80} className="text-emerald-500 relative z-10 animate-bounce" />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Neural Link Synchronizing</h4>
                  <p className="text-slate-500 text-sm max-w-sm font-medium">Analyzing asset morphology against 4M+ botanical data points.</p>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-700 border border-white/5 shadow-inner"><Bot size={40} /></div>
                  <h4 className="text-slate-400 font-black text-lg uppercase tracking-widest">Awaiting Command</h4>
                  <p className="text-slate-600 text-sm max-w-xs font-medium">Input visual data and inquiry to initialize the precision pathology scan.</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default AgriBotAIPage;