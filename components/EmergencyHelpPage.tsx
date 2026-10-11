import React, { useState, useEffect } from 'react';
import { getEmergencyGuidance } from '../services/api.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx'; // Import MarkdownRenderer
// FIX: Import missing Lucide React icons
import { 
  Zap, MapPin, Loader2, Send, Phone, Eye, ExternalLink, Info,
  HeartPulse, Flame, AlertTriangle, ShieldAlert, LifeBuoy
} from 'lucide-react';

declare global {
  interface Window {
    marked: { parse: (markdown: string, options?: object) => string; };
    // renderMathInElement and katex are no longer used
  }
}

const EmergencyHelpPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<string>('Detecting location...');
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<{ text: string, sources: any[] } | null>(null);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
        },
        () => setLocation('Location access denied. Please provide manually for better local context.')
      );
    }
  }, []);

  const handleGetHelp = async (situation?: string) => {
    const targetSituation = situation || query;
    if (!targetSituation.trim()) return;

    setIsLoading(true);
    setGuidance(null);
    try {
      const result = await getEmergencyGuidance(targetSituation, location);
      setGuidance(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'medical', label: 'Medical First Aid', icon: <HeartPulse />, color: 'rose', desc: 'Heart attack, choking, bleeding' },
    { id: 'fire', label: 'Fire Safety', icon: <Flame />, color: 'orange', desc: 'Electrical fire, structure fire' },
    { id: 'agri', label: 'Agri-Crisis', icon: <AlertTriangle />, color: 'amber', desc: 'Crop failure, livestock emergency' },
    { id: 'safety', label: 'Personal Safety', icon: <ShieldAlert />, color: 'blue', desc: 'Intruder, secure lockdown' }
  ];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-rose-500/10 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-[9px] font-black uppercase tracking-widest animate-pulse">
            <Zap size={12} />
            High Priority Response Hub
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Emergency Response</h2>
          <p className="text-slate-500 font-medium max-w-2xl">Instant life-saving directives powered by real-time intelligence grounding.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-white/5 rounded-2xl p-4 shadow-xl">
           <MapPin size={20} className="text-rose-500" />
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Node Location</p>
              <p className="text-xs font-bold text-white truncate max-w-[180px]">{location}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-5 space-y-10">
          {/* Action Hub */}
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleGetHelp(cat.label)}
                className={`flex flex-col items-start p-6 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-${cat.color}-500/30 hover:bg-slate-900 transition-all text-left group`}
              >
                <div className={`w-12 h-12 bg-${cat.color}-500/10 rounded-2xl flex items-center justify-center text-${cat.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                   {cat.icon}
                </div>
                <h4 className="font-black text-white text-sm uppercase tracking-tight">{cat.label}</h4>
                <p className="text-[10px] font-medium text-slate-500 mt-1 leading-snug">{cat.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
             <div className="space-y-6 relative z-10">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Custom Situation</h3>
                <div className="space-y-4">
                   <div className="relative group">
                      <LifeBuoy className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-500 transition-all" size={20} />
                      <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe the emergency..."
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                   </div>
                   <button 
                    onClick={() => handleGetHelp()}
                    disabled={isLoading || !query.trim()}
                    className="w-full py-5 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-500 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-rose-900/20 uppercase tracking-widest text-xs"
                   >
                     {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                     Initialize Guidance
                   </button>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldAlert size={120} />
             </div>
          </div>

          <div className="space-y-3">
            <div className="p-6 bg-rose-500/10 border border-rose-500/25 rounded-[2rem] flex items-center gap-4">
               <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center animate-pulse flex-shrink-0">
                  <Phone size={22} />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">National Police & Medical Priority Line</p>
                  <p className="text-lg font-black text-white">Call 112 / 100</p>
               </div>
               <a href="tel:112" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest cursor-pointer transition-all">Call Now</a>
            </div>

            <div className="p-6 bg-emerald-500/10 border border-emerald-500/25 rounded-[2rem] flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone size={22} />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">National Kisan 24x7 Toll-Free Call Center</p>
                  <p className="text-lg font-black text-white">1800-180-1551</p>
               </div>
               <a href="tel:18001801551" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest cursor-pointer transition-all">Call Kisan</a>
            </div>

            <div className="p-6 bg-blue-500/10 border border-blue-500/25 rounded-[2rem] flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone size={22} />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Student Tele-MANAS Wellness Helpline</p>
                  <p className="text-lg font-black text-white">14416 (Toll-Free)</p>
               </div>
               <a href="tel:14416" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest cursor-pointer transition-all">Call Support</a>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
           <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 h-full flex flex-col shadow-2xl relative min-h-[500px]">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="relative">
                      <div className="absolute inset-0 bg-rose-500/20 blur-3xl animate-ping"></div>
                      <Loader2 className="animate-spin text-rose-500 relative z-10" size={80} />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest">Synthesizing Protocol</h4>
                      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto font-medium">Accessing global emergency databases. Verifying local resource nodes. Calculating immediate survival actions.</p>
                   </div>
                </div>
              ) : guidance ? (
                <div className="animate-in fade-in slide-in-from-right-6 duration-700 flex flex-col h-full space-y-10">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                            <Eye size={24} />
                         </div>
                         <div>
                            <h4 className="text-2xl font-black text-white tracking-tight">Active Directives</h4>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Sync: Grounded AI Engine</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 bg-slate-800/30 rounded-[2.5rem] p-8 border border-white/5 overflow-y-auto custom-scrollbar">
                      <MarkdownRenderer
                        content={guidance.text}
                        className="prose prose-emergency text-slate-200 text-lg leading-relaxed whitespace-pre-wrap"
                      />
                   </div>

                   {guidance.sources.length > 0 && (
                     <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Verification Sources & Local Resources</h5>
                        <div className="flex flex-wrap gap-3">
                           {guidance.sources.map((source, i) => (
                              <a 
                                key={i} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest"
                              >
                                 <ExternalLink size={12} />
                                 {source.title || 'Official Source'}
                              </a>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                   <div className="w-24 h-24 bg-slate-800/20 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-inner">
                      <ShieldAlert size={48} className="text-rose-700" />
                   </div>
                   <div className="max-w-xs space-y-2">
                      <h4 className="text-slate-400 font-black text-lg uppercase tracking-widest">Protocol Standby</h4>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">System awaiting emergency description. Once initialized, instant directives will be projected.</p>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-slate-950/50 border border-white/5 rounded-2xl">
                      <Info size={16} className="text-blue-500" />
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Data grounded via live search for real-time accuracy.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyHelpPage;