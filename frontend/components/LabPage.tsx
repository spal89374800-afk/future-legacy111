import React, { useState } from 'react';
import { generateScienceVisuals } from '../services/api.ts';
import type { ScienceVisual, Subject, VisualLabelItem } from '../types.ts';
import { safeSetItem, safeGetItem } from '../utils/storage.ts';
import { 
  FlaskConical, Sparkles, Loader2, Copy, Download, 
  Target, Info, ChevronRight, Zap, GraduationCap,
  Trash2, Image as ImageIcon, Maximize2, X, BookOpen,
  CheckCircle2, Layers, HelpCircle, Compass
} from 'lucide-react';

declare global {
    interface ClipboardItem {
      readonly types: readonly string[];
      readonly presentationStyle: "unspecified" | "inline" | "attachment";
      getType(type: string): Promise<Blob>;
    }
    interface Clipboard {
      write(data: ClipboardItem[]): Promise<void>;
    }
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-20 space-y-8 animate-in fade-in">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full"></div>
            <Loader2 className="animate-spin text-blue-500 relative z-10" size={80} />
        </div>
        <div className="text-center">
            <p className="text-sm font-black text-white uppercase tracking-[0.4em]">Visual Intelligence Synthesis</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Generating Real Concept Diagrams & Detailed Labelling...</p>
        </div>
    </div>
);

interface LabPageProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const VisualCard: React.FC<{ 
    title: string, 
    badgeText: string,
    badgeColor: string,
    imageUrl: string, 
    explanation?: string, 
    topic: string, 
    onZoom: (url: string, title: string) => void,
    showToast: LabPageProps['showToast'] 
}> = ({ title, badgeText, badgeColor, imageUrl, explanation, topic, onZoom, showToast }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = imageUrl;
        const fileName = `${topic.replace(/\s+/g, '_')}-${title.replace(/\s+/g, '_')}.png`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
            showToast('Visual asset copied to clipboard.', 'success');
        } catch (err) {
            console.error('Failed to copy image:', err);
            showToast('Direct image copy restricted; use Save image instead.', 'error');
        }
    };

    return (
        <div className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all shadow-2xl animate-in slide-in-from-bottom-4">
            <div 
                onClick={() => onZoom(imageUrl, title)} 
                className="relative aspect-video bg-slate-950 overflow-hidden cursor-zoom-in"
            >
                {!isLoaded && !hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                        <Loader2 className="animate-spin text-blue-500/40 mb-3" size={32} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Synthesizing Diagram...</span>
                    </div>
                )}
                {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-rose-500/50">
                        <ImageIcon size={32} className="mb-2" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); setHasError(false); setIsLoaded(false); }}
                            className="text-[9px] font-black uppercase tracking-widest hover:text-rose-400 underline underline-offset-4"
                        >
                            Retry Projection
                        </button>
                    </div>
                )}
                <img 
                    src={imageUrl} 
                    key={imageUrl}
                    alt={title} 
                    onLoad={() => { setIsLoaded(true); setHasError(false); }}
                    onError={() => setHasError(true)}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeColor} backdrop-blur-md border border-white/10`}>
                        {badgeText}
                    </span>
                </div>

                {/* Floating Action Controls */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                    <button 
                        onClick={() => onZoom(imageUrl, title)}
                        title="Zoom Diagram"
                        className="p-2.5 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-xl hover:bg-white hover:text-slate-950 transition-all"
                    >
                        <Maximize2 size={14} />
                    </button>
                    <button 
                        onClick={handleCopy} 
                        title="Copy Image"
                        className="p-2.5 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-xl hover:bg-white hover:text-slate-950 transition-all"
                    >
                        <Copy size={14} />
                    </button>
                    <button 
                        onClick={handleDownload} 
                        title="Download Image"
                        className="p-2.5 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-xl hover:bg-slate-800 transition-all"
                    >
                        <Download size={14} />
                    </button>
                </div>
            </div>
            {explanation && (
                <div className="p-6 bg-slate-950/40 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">{title}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            {explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const LabPage: React.FC<LabPageProps> = ({ showToast }) => {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('Class 11');
    const [subject, setSubject] = useState<Subject>('Physics');
    const [visuals, setVisuals] = useState<ScienceVisual | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeModalImage, setActiveModalImage] = useState<{ url: string; title: string } | null>(null);

    const handleGenerate = async (presetTopic?: string, presetSubject?: Subject, presetGrade?: string) => {
        const targetTopic = presetTopic || topic;
        const targetSubject = presetSubject || subject;
        const targetGrade = presetGrade || grade;

        if (!targetTopic.trim()) return;
        
        const cacheKey = `lab_cache_${targetSubject.toLowerCase()}_${targetGrade.toLowerCase().replace(/\s+/g, '')}_${targetTopic.toLowerCase().trim()}`;
        const cachedVisuals = safeGetItem(cacheKey);

        if (cachedVisuals) {
            try {
                setVisuals(JSON.parse(cachedVisuals));
                if (presetTopic) setTopic(presetTopic);
                if (presetSubject) setSubject(presetSubject);
                if (presetGrade) setGrade(presetGrade);
                return;
            } catch (e) {
                console.error("Lab cache corrupted, re-generating...");
                localStorage.removeItem(cacheKey);
            }
        }

        setIsLoading(true);
        setError('');
        setVisuals(null);
        if (presetTopic) setTopic(presetTopic);
        if (presetSubject) setSubject(presetSubject);
        if (presetGrade) setGrade(presetGrade);

        try {
            const result = await generateScienceVisuals(targetTopic, targetSubject, targetGrade);
            
            // Save to cache safely
            safeSetItem(cacheKey, JSON.stringify(result));
            
            setVisuals(result);
        } catch (err: any) {
            setError(err.message || 'An error occurred during diagram generation.');
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedNodes = [
        { topic: 'Structure of Atom & Bohr Model', subject: 'Chemistry' as Subject, grade: 'Class 11' },
        { topic: 'Electromagnetic Induction & Faraday Laws', subject: 'Physics' as Subject, grade: 'Class 12' },
        { topic: 'Human Heart Structure & Double Circulation', subject: 'Biology' as Subject, grade: 'Class 11' },
        { topic: 'Thermodynamics & Heat Engine Cycle', subject: 'Physics' as Subject, grade: 'Class 11' },
        { topic: 'Photosynthesis Light Reaction (Z-Scheme)', subject: 'Biology' as Subject, grade: 'Class 11' },
        { topic: 'Chemical Bonding & Hybridization (sp, sp2, sp3)', subject: 'Chemistry' as Subject, grade: 'Class 11' }
    ];

    const clearLabCache = () => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('lab_cache_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        showToast('Diagnostic cache purged.', 'success');
        setVisuals(null);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-40">
            {/* Fullscreen Image Preview Modal */}
            {activeModalImage && (
                <div 
                    onClick={() => setActiveModalImage(null)}
                    className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                >
                    <div 
                        onClick={e => e.stopPropagation()} 
                        className="relative max-w-5xl w-full bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 px-6 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-blue-400" />
                                <span className="text-sm font-black text-white uppercase tracking-tight">{activeModalImage.title}</span>
                            </div>
                            <button 
                                onClick={() => setActiveModalImage(null)}
                                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
                            <img 
                                src={activeModalImage.url} 
                                alt={activeModalImage.title} 
                                className="w-full h-auto max-h-[75vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-[9px] font-black uppercase tracking-widest">
                    <FlaskConical size={12} />
                    NCERT Visual Intelligence Laboratory
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat">Concept Visualizer</h2>
                  <p className="text-slate-400 font-medium max-w-2xl text-sm leading-relaxed">
                    Real, high-definition scientific diagrams, labeled anatomical and mechanical parts, real-world analogies, and topper study notes for complete conceptual mastery.
                  </p>
                </div>
                
                <button 
                  onClick={clearLabCache}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-[10px] font-bold rounded-xl transition-all uppercase tracking-widest border border-white/5"
                >
                  <Trash2 size={14} /> Clear Cache
                </button>
            </header>

            {/* Presets Row */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Zap size={14} className="text-amber-500" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Popular NCERT High-Yield Concepts</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {suggestedNodes.map((node, i) => (
                        <button 
                            key={i}
                            onClick={() => {
                                handleGenerate(node.topic, node.subject, node.grade);
                            }}
                            className="bg-slate-900 border border-white/5 p-3.5 rounded-2xl text-left hover:border-blue-500/40 hover:bg-slate-800 transition-all group flex flex-col justify-between h-28 shadow-xl"
                        >
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{node.subject}</span>
                            <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors uppercase tracking-tight line-clamp-2">{node.topic}</span>
                            <span className="text-[9px] text-slate-500 font-medium">{node.grade}</span>
                        </button>
                    ))}
                </div>
            </section>
            
            <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl max-w-6xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12"><GraduationCap size={120} /></div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
                    <div className="md:col-span-5 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Concept or Topic Name</label>
                        <input 
                            type="text" 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                            placeholder="e.g., Structure of Human Eye, Photoelectric Effect..." 
                            className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 md:p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-inner" 
                        />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Grade Level</label>
                        <select 
                            value={grade} 
                            onChange={e => setGrade(e.target.value)} 
                            className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 md:p-5 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                        >
                            <option>Class 9</option>
                            <option>Class 10</option>
                            <option>Class 11</option>
                            <option>Class 12</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Subject</label>
                        <select 
                            value={subject} 
                            onChange={e => setSubject(e.target.value as Subject)} 
                            className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 md:p-5 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <button 
                            onClick={() => handleGenerate()} 
                            disabled={isLoading || !topic.trim()} 
                            className="w-full py-4 md:py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest active:scale-95 cursor-pointer"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            Generate Real Visuals
                        </button>
                    </div>
                </div>
            </div>

            {isLoading && <LoadingSpinner />}
            {error && (
                <div className="flex items-center justify-center gap-3 p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] max-w-4xl mx-auto">
                    <Info size={20} className="text-rose-500" />
                    <p className="text-xs font-black text-rose-400 uppercase tracking-widest">{error}</p>
                </div>
            )}

            {visuals && !isLoading && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
                    {/* Master Concept Summary Banner */}
                    {visuals.summary && (
                        <div className="bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-violet-600/20 border border-blue-500/20 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden backdrop-blur-sm shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -rotate-12"><Sparkles size={80} /></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                            <Zap className="text-blue-400" size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Master Concept Blueprint</h3>
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                                {visuals.ncertReference || `NCERT ${grade} ${subject}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-200 text-sm md:text-base leading-relaxed font-normal">
                                    {visuals.summary}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 3 Core Visual Perspective Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <VisualCard 
                            title="Scientific Schematic Diagram" 
                            badgeText="Textbook Diagram"
                            badgeColor="bg-blue-500/80 text-white"
                            imageUrl={visuals.scientific} 
                            explanation={visuals.scientificExplanation}
                            topic={topic} 
                            onZoom={(url, t) => setActiveModalImage({ url, title: t })}
                            showToast={showToast} 
                        />
                        <VisualCard 
                            title="Real-World Application" 
                            badgeText="Real Life Analogy"
                            badgeColor="bg-emerald-500/80 text-white"
                            imageUrl={visuals.realWorld} 
                            explanation={visuals.realWorldExplanation}
                            topic={topic} 
                            onZoom={(url, t) => setActiveModalImage({ url, title: t })}
                            showToast={showToast} 
                        />
                        <VisualCard 
                            title="Handwritten Study Notes" 
                            badgeText="Topper Register"
                            badgeColor="bg-amber-500/80 text-white"
                            imageUrl={visuals.bookish} 
                            explanation={visuals.bookishExplanation}
                            topic={topic} 
                            onZoom={(url, t) => setActiveModalImage({ url, title: t })}
                            showToast={showToast} 
                        />
                    </div>

                    {/* Diagram Labeling & Parts Breakdown Section */}
                    {visuals.scientificLabels && visuals.scientificLabels.length > 0 && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <Layers className="text-blue-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Precise Diagram Labeling & Structure Guide</h3>
                                    <p className="text-xs text-slate-400 font-medium">Detailed breakdown of key labeled sections shown in the scientific diagram</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {visuals.scientificLabels.map((item, idx) => (
                                    <div key={idx} className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl space-y-2 hover:border-blue-500/30 transition-all">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-black text-[10px] flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <h4 className="text-xs font-bold text-white uppercase tracking-tight">{item.part}</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed pl-7">
                                            {item.functionOrMeaning}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Formula & Analogy Split Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Formula & Analytical Governing Law */}
                        {visuals.scientificFormula && (
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 shadow-xl flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                                            <BookOpen size={18} />
                                        </div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Governing Equations & Formulas</h4>
                                    </div>
                                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 font-mono text-sm text-emerald-400 break-words">
                                        {visuals.scientificFormula}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Apply these standard formulas in SI units for all numerical derivations and competitive exam questions.
                                </p>
                            </div>
                        )}

                        {/* Real-World Analogy */}
                        {visuals.realWorldAnalogy && (
                            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 shadow-xl flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                            <Compass size={18} />
                                        </div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Intuitive Real-Life Analogy</h4>
                                    </div>
                                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed italic">
                                        "{visuals.realWorldAnalogy}"
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Connecting the concept with everyday experience ensures long-term memory retention.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* High-Yield Exam Checklist */}
                    {visuals.bookishKeyPoints && visuals.bookishKeyPoints.length > 0 && (
                        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <CheckCircle2 className="text-emerald-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">High-Yield Exam Revision Checklist</h3>
                                    <p className="text-xs text-slate-400 font-medium">Top-ranker memory anchors for Board, NEET & JEE tests</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {visuals.bookishKeyPoints.map((point, idx) => (
                                    <div key={idx} className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {!visuals && !isLoading && (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                    <Target size={64} className="text-slate-500 mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">Enter any scientific topic or select a preset above</p>
                </div>
            )}
        </div>
    );
};

export default LabPage;
