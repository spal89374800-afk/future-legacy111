
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
    BookOpen, Target, Download, Loader2, Maximize2, Minimize2, 
    ArrowLeft, GraduationCap, ShieldCheck, FileText, 
    Zap, Globe, ChevronRight, Sparkles, FileDown,
    Beaker, Dna, Atom, Layers, Info, Save, ExternalLink, Search,
    Cpu, Book, Award, Layout, Archive, Hash, Link as LinkIcon
} from 'lucide-react';
import { generateChapterShortNotes, generateChapterQuestions } from '../services/api.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx';

type Subject = 'Physics' | 'Chemistry' | 'Biology';

const NEET_SYLLABUS: Record<Subject, string[]> = {
  Biology: [
    "The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
    "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals",
    "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division",
    "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development",
    "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and their Elimination",
    "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration",
    "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health",
    "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution",
    "Human Health and Disease", "Microbes in Human Welfare", "Biotechnology: Principles and Processes",
    "Biotechnology and its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"
  ],
  Chemistry: [
    "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity",
    "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", "Redox Reactions",
    "p-Block Elements", "Organic Chemistry: Some Basic Principles and Techniques", "Hydrocarbons",
    "Solutions", "Electrochemistry", "Chemical Kinetics", "d-and f-Block Elements",
    "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"
  ],
  Physics: [
    "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion",
    "Work, Energy and Power", "System of Particles and Rotational Motion", "Gravitation",
    "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter",
    "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves",
    "Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity",
    "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction",
    "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments",
    "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei",
    "Electronic Devices (Semiconductors)"
  ]
};

interface Props {
  onFullScreenChange: (v: boolean) => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
}

const ChapterNotesGenerator: React.FC<Props> = ({ onFullScreenChange, showToast }) => {
  const [exam, setExam] = useState('NEET');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [chapter, setChapter] = useState('');
  const [chapterSearch, setChapterSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [step, setStep] = useState(1);

  // V40 - WHATSAPP TEACHER VAULT
  const getVaultKey = (type: string, ex: string, sub: string, ch: string) => 
    `sovereign_v40_vault_${type}_${ex}_${sub}_${ch}`.replace(/\s+/g, '_').toLowerCase();

  const retrieveFromVault = useCallback((type: 'notes' | 'questions', targetChapter?: string) => {
    const ch = targetChapter || chapter;
    if (!exam || !subject || !ch) return null;
    const key = getVaultKey(type, exam, subject, ch);
    const archived = localStorage.getItem(key);
    return archived ? JSON.parse(archived) : null;
  }, [exam, subject, chapter]);

  const archiveInVault = (type: 'notes' | 'questions', data: string, sources: any[], targetChapter?: string) => {
    const ch = targetChapter || chapter;
    const key = getVaultKey(type, exam, subject as string, ch);
    localStorage.setItem(key, JSON.stringify({ text: data, sources, timestamp: Date.now() }));
  };

  useEffect(() => {
    if (content && !isFullScreen) {
        setIsFullScreen(true);
        onFullScreenChange(true);
    }
  }, [content, isFullScreen, onFullScreenChange]);

  const handleGenerate = async (type: 'notes' | 'questions', targetChapter?: string) => {
    const chToUse = targetChapter || chapter;
    if (!exam || !chToUse) return;
    
    setChapter(chToUse);

    // INSTANT CACHE RETRIEVAL
    const archivedRecord = retrieveFromVault(type, chToUse);
    if (archivedRecord) {
        setContent(archivedRecord.text);
        setSources(archivedRecord.sources || []);
        showToast(`${chToUse} synchronized from Vault.`);
        return;
    }

    setIsGenerating(true);
    try {
        const res = type === 'notes' 
            ? await generateChapterShortNotes(exam, `${subject}: ${chToUse}`, useSearch)
            : await generateChapterQuestions(exam, `${subject}: ${chToUse}`, useSearch);
        
        setContent(res.text);
        setSources(res.sources);
        archiveInVault(type, res.text, res.sources, chToUse);
        showToast(`${chToUse} taught via V40 Protocol.`);
    } catch (err) {
        showToast("Neural sync failed.", "error");
    } finally { setIsGenerating(false); }
  };

  const resetToSubject = () => { 
      setContent(null); 
      setChapter(''); 
      setSources([]);
      setStep(3); 
      setIsFullScreen(false);
      onFullScreenChange(false);
  };

  const toggleFullScreen = () => {
      const next = !isFullScreen;
      setIsFullScreen(next);
      onFullScreenChange(next);
  };

  const filteredChapters = useMemo(() => {
    if (!subject) return [];
    return NEET_SYLLABUS[subject as Subject].filter(ch => 
      ch.toLowerCase().includes(chapterSearch.toLowerCase())
    );
  }, [subject, chapterSearch]);

  if (content) {
    return (
      <div className={`flex flex-col h-full bg-white transition-all duration-700 ${isFullScreen ? 'fixed inset-0 z-[500] w-screen h-screen' : 'rounded-[2rem] overflow-hidden'}`}>
        <header className="px-6 py-3 border-b border-slate-100 bg-white flex justify-between items-center z-[100] shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={resetToSubject} className="p-2 bg-slate-100 text-slate-800 hover:bg-[#020617] hover:text-white rounded-xl transition-all shadow-sm"><ArrowLeft size={18} /></button>
                <div className="leading-tight">
                    <h3 className="text-[#020617] font-black uppercase text-xs tracking-tight truncate max-w-[200px] font-montserrat">{chapter}</h3>
                    <p className="text-[7px] font-black text-rose-600 uppercase tracking-[0.3em] mt-0.5">V40 WHATSAPP STYLE</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={toggleFullScreen} className="p-2 bg-slate-100 text-slate-500 rounded-xl border border-slate-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto kinetic-scroll bg-white relative custom-scrollbar">
            <div className="max-w-[1000px] mx-auto px-6 py-10 relative z-10">
                <div className="mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#020617] text-white rounded-lg text-[8px] font-black uppercase tracking-[0.4em] shadow-xl">
                        <Archive size={10} fill="currentColor" className="text-amber-400" /> V40 WHATSAPP TEACHER
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#020617] uppercase tracking-tighter font-montserrat leading-none">{chapter}</h1>
                    <div className="h-1.5 w-32 bg-[#e11d48] rounded-full"></div>
                </div>
                
                <div className="relative notes-content-area">
                    <MarkdownRenderer content={content} />
                </div>
                
                <div className="mt-24 p-10 bg-[#020617] rounded-[3rem] text-center space-y-6 border border-white/5 relative overflow-hidden shadow-2xl">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-[2rem] flex items-center justify-center text-blue-400 mx-auto border border-blue-500/20 shadow-xl">
                        <ShieldCheck size={40} />
                    </div>
                    <div className="space-y-3 relative z-10">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tight font-montserrat leading-tight">Maha-Revision Complete</h4>
                        <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] leading-relaxed">System sync successful. Topper logic established.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-0">
      <div className="w-full h-full md:max-w-5xl bg-[#0c0c0e] md:border md:border-white/5 md:rounded-[3rem] shadow-2xl min-h-0 flex flex-col relative overflow-hidden animate-in fade-in duration-700">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex-1 overflow-y-auto kinetic-scroll custom-scrollbar p-5 md:p-10">
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col items-center justify-center relative z-10">
                    <header className="mb-10 text-center space-y-2">
                        <div className="w-12 h-12 bg-rose-600/10 rounded-2xl border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto shadow-xl mb-4">
                            <Archive size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-montserrat">Grandmaster</h2>
                        <p className="text-rose-500 text-[8px] font-black uppercase tracking-[0.5em] mt-1">V40 WHATSAPP PROTOCOL</p>
                    </header>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
                        {[
                            { id: 'NEET', desc: 'Medical', icon: <GraduationCap /> },
                            { id: 'JEE', desc: 'Engg', icon: <Layers /> },
                            { id: 'UPSC', desc: 'Civil', icon: <ShieldCheck /> },
                            { id: 'BOARDS', desc: 'Acad', icon: <Award /> }
                        ].map(e => (
                            <button key={e.id} onClick={() => { setExam(e.id); setStep(2); }} className="p-6 bg-zinc-900/60 border border-white/5 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-rose-500/40 hover:bg-zinc-900 transition-all group active:scale-95 shadow-lg">
                                <div className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-center text-zinc-600 group-hover:text-rose-400 transition-all">
                                    {React.cloneElement(e.icon as React.ReactElement, { size: 20 })}
                                </div>
                                <span className="font-black text-lg text-white uppercase tracking-widest block font-montserrat">{e.id}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700 h-full flex flex-col flex-1 relative z-10">
                    <button onClick={() => setStep(1)} className="self-start text-[8px] font-black text-zinc-600 hover:text-white uppercase mb-6 flex items-center gap-2 transition-colors group">
                        <div className="p-2 bg-zinc-900 border border-white/10 rounded-lg group-hover:bg-zinc-800 transition-all"><ArrowLeft size={12} /></div>
                        Back
                    </button>
                    <header className="mb-10 text-center">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-montserrat">Select Subject</h2>
                        <p className="text-emerald-500 text-[8px] font-black uppercase tracking-[0.4em] mt-1">Initializing WhatsApp Sync</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto flex-1 items-center">
                        {[
                            { id: 'Biology', icon: <Dna size={32} />, color: 'emerald', desc: 'Life Logic' },
                            { id: 'Chemistry', icon: <Beaker size={32} />, color: 'amber', desc: 'Atomic Core' },
                            { id: 'Physics', icon: <Atom size={32} />, color: 'blue', desc: 'Quantum Path' }
                        ].map(s => (
                            <button key={s.id} onClick={() => { setSubject(s.id as Subject); setStep(3); }} className={`p-8 bg-zinc-900/60 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-6 hover:border-${s.color}-500/40 hover:bg-zinc-900 transition-all group shadow-xl active:scale-95`}>
                                <span className={`text-zinc-600 group-hover:text-${s.color}-400 group-hover:scale-110 transition-all duration-500`}>{s.icon}</span>
                                <span className="font-black text-xl text-white uppercase tracking-widest block font-montserrat">{s.id}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700 h-full flex flex-col flex-1 relative z-10 min-h-0">
                    <div className="flex justify-between items-center mb-6 flex-shrink-0">
                        <button onClick={() => setStep(2)} className="text-[9px] font-black text-zinc-600 hover:text-white uppercase flex items-center gap-3 transition-colors group">
                            <div className="p-2 bg-zinc-900 border border-white/10 rounded-lg group-hover:bg-zinc-800 transition-all"><ArrowLeft size={14} /></div>
                            Subjects
                        </button>
                        <div className="px-6 py-2 bg-zinc-950 border border-white/5 rounded-xl text-zinc-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 shadow-inner">
                            <div className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
                            {subject} SYLLABUS
                        </div>
                    </div>

                    <div className="mb-6 flex-shrink-0">
                        <div className="relative group max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-rose-400 transition-all duration-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search Chapter Protocol..." 
                                value={chapterSearch}
                                onChange={e => setChapterSearch(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-rose-500/20 shadow-inner font-montserrat placeholder:text-zinc-800 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar pr-2 flex-1 pb-6">
                        {filteredChapters.map((ch, idx) => {
                            const archived = localStorage.getItem(getVaultKey('notes', exam, subject as string, ch));
                            const isCurrentlyGenerating = isGenerating && chapter === ch;

                            return (
                                <button 
                                    key={ch} 
                                    onClick={() => handleGenerate('notes', ch)} 
                                    disabled={isGenerating}
                                    className={`p-4 rounded-2xl border text-left transition-all duration-500 group flex items-center justify-between bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-900 hover:border-rose-500/40 disabled:opacity-50 active:scale-[0.98] shadow-lg relative overflow-hidden`}
                                >
                                    <div className="flex items-center gap-4 truncate relative z-10">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-950 text-zinc-700 shadow-inner border border-white/5 group-hover:bg-rose-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                            <span className="text-[10px] font-black">{String(idx + 1).padStart(2, '0')}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <span className="font-black text-[14px] uppercase tracking-tight truncate block group-hover:text-white transition-colors font-montserrat leading-none mb-0.5">{ch}</span>
                                            {archived && (
                                                <span className="text-[7px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">VAULT_SYNCED</span>
                                            )}
                                        </div>
                                    </div>
                                    {isCurrentlyGenerating ? (
                                        <Loader2 size={18} className="animate-spin text-rose-500 relative z-10" />
                                    ) : (
                                        <ChevronRight size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 text-rose-500 relative z-10" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChapterNotesGenerator;
