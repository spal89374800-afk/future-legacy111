import React, { useState, useRef, useEffect, useMemo } from 'react';
import { generateVisualNotesForTeachers, generateImageFromPrompt } from '../services/api';
import type { Task } from '../types.ts';
import { X, Sparkles, Loader2, Save, Download, BookOpen, Image, Type } from 'lucide-react';
// FIX: Removed unused import as per coding guidelines
// import InlineVisualDisplay from './InlineVisualDisplay.tsx';
import MarkdownRenderer from './MarkdownRenderer.tsx';

declare global {
  interface Window {
    marked: {
      parse: (markdown: string, options?: object) => string;
    };
    // renderMathInElement and katex are no longer used
  }
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
      <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = true }) => (
    <details className="bg-slate-900/50 border border-white/5 rounded-[1.5rem] overflow-hidden" open={defaultOpen}>
        <summary className="p-5 font-black text-sm text-slate-200 cursor-pointer flex items-center gap-4 transition-colors hover:bg-white/5 uppercase tracking-widest">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-lg">{icon}</div>
            {title}
        </summary>
        <div className="p-6 border-t border-white/5 bg-slate-800/20">{children}</div>
    </details>
);

interface NotesAndVisualsModalProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
}

const NotesAndVisualsModal: React.FC<NotesAndVisualsModalProps> = ({ onClose, onSave }) => {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [keyConcepts, setKeyConcepts] = useState('');
    const [materialType, setMaterialType] = useState<'Notes and Visuals' | 'Notes Only' | 'Visuals Only'>('Notes and Visuals');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedMarkdown, setGeneratedMarkdown] = useState('');
    
    // No longer splitting into segments, directly render the markdown
    // const [parsedContentSegments, setParsedContentSegments] = useState<Array<{ id: string; type: 'text' | 'diagram'; content?: string; prompt?: string }>>([]);

    const handleGenerate = async () => {
        if (!topic.trim() || !grade.trim()) {
            setError('Please provide a topic and grade level.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedMarkdown('');
        // setParsedContentSegments([]); // Clear previous segments
        try {
            const result = await generateVisualNotesForTeachers(topic, grade, materialType, keyConcepts);
            setGeneratedMarkdown(result);
        } catch (err: any) {
            setError(err.message || "Failed to generate content.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (!generatedMarkdown) {
            alert('Please generate content before saving.');
            return;
        }
        const task: Omit<Task, 'id' | 'isCompleted'> = {
            title: `Prepare notes for: ${topic}`,
            description: generatedMarkdown, // Save raw markdown for task description
            dueDate: new Date().toISOString().split('T')[0],
        };
        onSave(task);
    };

    // The useEffect for parsing segments is no longer needed as we're directly rendering raw markdown.
    /*
    useEffect(() => {
        if (!generatedMarkdown || typeof window.marked === 'undefined') {
            setParsedContentSegments([]);
            return;
        }
        
        let currentMarkdown = generatedMarkdown;
        const segments: Array<{ id: string; type: 'text' | 'diagram'; content?: string; prompt?: string }> = [];
        // Regex to identify visual elements: 🖼️, 🧪, 🔬 followed by (Diagram|Equation|Reaction) Visual: [DIAGRAM:"..."]
        const visualRegex = /(🖼️|🧪|🔬)\s*(Diagram|Equation|Reaction)\s*Visual:\s*\[DIAGRAM:\s*"([^"]+)"\]/g; 
        const pyqRegex = /<PYQ>(.*?)<\/PYQ>/g;

        let lastIndex = 0;
        let match;

        while ((match = visualRegex.exec(currentMarkdown)) !== null) {
            const textBefore = currentMarkdown.substring(lastIndex, match.index);
            if (textBefore) {
                segments.push({ id: `text-${lastIndex}`, type: 'text', content: textBefore });
            }
            // match[3] is the captured group for the prompt within the visualRegex
            segments.push({ id: `diagram-${match.index}`, type: 'diagram', prompt: match[3] });
            lastIndex = visualRegex.lastIndex;
        }

        const textAfter = currentMarkdown.substring(lastIndex);
        if (textAfter) {
            segments.push({ id: `text-${lastIndex}`, type: 'text', content: textAfter });
        }

        const processedSegments = segments.map(segment => {
            if (segment.type === 'text' && segment.content) {
                let content = segment.content;

                // 1. Pre-process custom color/underline tags for headings
                const colorTagMap: { [key: string]: string } = {
                    'blue': 'text-blue-400',
                    'green': 'text-emerald-400',
                    'orange': 'text-orange-400', 
                    'red': 'text-rose-400',
                    'teal': 'text-teal-400',
                    'gold': 'text-amber-400',
                    'violet': 'text-violet-400',
                    'cyan': 'text-cyan-400',
                    'magenta': 'text-fuchsia-400',
                };

                const headingColorRegex = /<(blue|green|orange|red|teal|gold|violet|cyan|magenta)><u>(.*?)<\/u><\/(blue|green|orange|red|teal|gold|violet|cyan|magenta)>/g;
                content = content.replace(headingColorRegex, (match, colorTag, headingContent) => {
                    const tailwindClass = colorTagMap[colorTag];
                    return `<h2 class="text-4xl font-black mt-12 mb-8 ${tailwindClass} uppercase tracking-tighter underline decoration-2 underline-offset-4">${headingContent}</h2>`;
                });

                // Add class to standard H2s not captured by above for consistency (if any from raw markdown)
                content = content.replace(/(^|\n)##\s*(.*?)\s*($|\n)/g, '$1<h2 class="text-3xl font-black mb-8 mt-12 text-violet-400 border-l-8 border-violet-600 pl-6 py-2 bg-violet-900/10 rounded-r-xl uppercase tracking-tight">$2</h2>$3');

                // Pre-process PYQ tags into HTML spans
                content = content.replace(pyqRegex, '<span class="pyq-highlight">$1</span>');

                // Post-process blockquotes for specialized styling (removed unused logic)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = window.marked.parse(content);
                
                // Blockquote styling logic was specific and is removed as it's not universally applicable
                // and the current prompt doesn't heavily rely on it in this modal.
                // If specific blockquote styling is needed, it should be re-added with more precise targeting.
                
                return { ...segment, content: tempDiv.innerHTML };
            }
            return segment;
        });

        setParsedContentSegments(processedSegments);

    }, [generatedMarkdown]);
    */

    return (
        <>
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-7xl flex flex-col h-[90vh] animate-in zoom-in-95 duration-300">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center flex-shrink-0 bg-slate-900/50">
                        <h3 className="text-2xl font-black text-white font-montserrat tracking-tight uppercase">AI Notes & Visuals Architect</h3>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition p-2 hover:bg-white/5 rounded-xl">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                        {/* Left Panel: Inputs */}
                        <div className="w-full md:w-1/3 p-8 space-y-8 overflow-y-auto border-r border-white/5 custom-scrollbar">
                            <Section icon={<BookOpen size={16} />} title="Topic Details">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Topic / Lesson Name</label>
                                        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Photosynthesis" required className="w-full mt-2 bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Grade / Class</label>
                                        <input type="text" value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g., Class 10" required className="w-full mt-2 bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white" />
                                    </div>
                                </div>
                            </Section>
                            <Section icon={<Type size={16} />} title="Material Type">
                                <div className="flex gap-2 p-1 bg-slate-950/50 rounded-xl border border-white/5">
                                    {(['Notes and Visuals', 'Notes Only', 'Visuals Only'] as const).map(type => (
                                        <button key={type} onClick={() => setMaterialType(type)} className={`flex-1 py-3 text-[9px] font-black rounded-lg transition-colors uppercase tracking-widest ${materialType === type ? 'bg-blue-600 shadow text-white' : 'text-slate-500 hover:bg-white/5'}`}>{type}</button>
                                    ))}
                                </div>
                            </Section>
                            <Section icon={<Sparkles size={16} />} title="Content Details">
                                <textarea value={keyConcepts} onChange={e => setKeyConcepts(e.target.value)} rows={5} placeholder="List key concepts, definitions, or provide a short description to guide the AI." className="w-full mt-1 text-sm bg-slate-800 border border-white/5 rounded-2xl p-4 min-h-[140px]" />
                            </Section>
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-blue-600 text-white font-black py-5 px-4 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3 transition hover:bg-blue-500 shadow-xl shadow-blue-900/20 text-xs uppercase tracking-widest">
                                {isLoading ? <><Loader2 className="animate-spin" size={18} />Synthesizing...</> : 'Generate Material'}
                            </button>
                            {error && <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</p>}
                        </div>

                        {/* Right Panel: Output */}
                        <div className="flex-grow overflow-y-auto min-h-0 bg-slate-950/20">
                            {isLoading ? <LoadingSpinner />
                            : !generatedMarkdown ? ( // Check generatedMarkdown directly
                                <div className="text-center text-slate-700 h-full flex flex-col justify-center items-center p-12">
                                    <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center border border-white/5 mb-6">
                                        <BookOpen size={40} />
                                    </div>
                                    <h4 className="font-black text-slate-400 uppercase tracking-widest">Projection Node Idle</h4>
                                    <p className="text-xs max-w-xs mt-2">Generated pedagogical assets will be projected in this matrix.</p>
                                </div>
                            ) : (
                                <div id="notes-output-container" className="p-8 md:p-12">
                                    <MarkdownRenderer content={generatedMarkdown} className="prose max-w-none" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-800/50 border-t border-white/5 flex justify-end gap-4 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-700 text-slate-200 font-black rounded-2xl hover:bg-slate-600 transition-colors uppercase text-[10px] tracking-widest">Close</button>
                        <button type="button" onClick={handleSave} disabled={!generatedMarkdown || isLoading} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 uppercase text-[10px] tracking-widest flex items-center gap-3 disabled:opacity-30">
                            <Save size={16} />
                            Save as Task
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotesAndVisualsModal;