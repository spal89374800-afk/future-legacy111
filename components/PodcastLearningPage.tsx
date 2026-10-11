
import React, { useState, useRef, useEffect } from 'react';
import { Radio, Mic, Loader2, Play, Pause, RotateCcw, Volume2, Headphones, FileText, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { safeSetItem, safeGetItem } from '../utils/storage.ts';
import * as api from '../services/api.ts';

export const PodcastLearningPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [podcastContent, setPodcastContent] = useState('');
    const [studyNotes, setStudyNotes] = useState('');
    const [status, setStatus] = useState<'idle' | 'generating' | 'playing' | 'paused'>('idle');
    const [currentTime, setCurrentTime] = useState(0);
    const [showNotes, setShowNotes] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const generateLearningSet = async () => {
        if (!topic) return;
        
        const cacheKey = `study_cache_${topic.toLowerCase().trim()}`;
        const cachedData = safeGetItem(cacheKey);

        if (cachedData) {
            try {
                const { pContent, nContent } = JSON.parse(cachedData);
                setPodcastContent(pContent);
                setStudyNotes(nContent);
                startPlayback(pContent);
                return;
            } catch (e) {
                console.error("Cache corrupted, re-generating...");
                localStorage.removeItem(cacheKey);
            }
        }

        setStatus('generating');
        
        const prompt = `Act as an expert IIT-JEE / NEET level teacher (HOD level).
        Topic: ${topic}
        
        CRITICAL MANDATE: Everything must be strictly based on the latest NCERT syllabus and Paper Patterns. Use high-authority academic language with clear, engaging educational English. 
        Special focus for Biology: Ensure terms like Cleistogamy, Chasmogamy, and Anemophily are defined VERBATIM from NCERT.
        
        TASK 1: Create an engaging, high-energy educational podcast script in clear English for audio learning. 
        Structure: Intro, Simple Concepts, Real-world Analogy, Formula explanation, Summary.
        
        TASK 2: Create highly professional "Classroom Study Notes" exactly as an expert teacher would write on a blackboard for a Ranker's batch.
        - Use clear Headings, Bullet Points, and perfectly formatted LaTeX for ALL mathematical/chemical formulas.
        - VERY IMPORTANT: Wrap all final or important formulas inside a LaTeX Box using \boxed{...} or wrap them in $$ ... $$ with a border style in mind.
        - [SACRED NCERT]: Verbatim lines from the textbook.
        - [FORMULA BOX]: Clean LaTeX formulas. Example: $\boxed{\tan\phi = \frac{a_c}{a_t} = \frac{v^2/r}{\alpha r} = \frac{v^2}{\alpha r^2}}$.
        - [TEACHER'S TRAP ALERT]: Common mistakes in exams.
        - [SOLVED EXAMPLE]: Step-by-step paper-based problem.
        
        Format your response exactly as follows:
        ---PODCAST_START---
        (The podcast script text here)
        ---PODCAST_END---
        ---NOTES_START---
        (The structured LaTeX markdown study notes here)
        ---NOTES_END---`;
        
        try {
            const response = await api.getAIStudyResponse([{ role: 'user', parts: [{ text: prompt }] }]);
            const fullText = response.text || '';
            
            const podcastMatch = fullText.match(/---PODCAST_START---([\s\S]*?)---PODCAST_END---/);
            const notesMatch = fullText.match(/---NOTES_START---([\s\S]*?)---NOTES_END---/);
            
            let pContent = podcastMatch ? podcastMatch[1].trim() : fullText;
            let nContent = notesMatch ? notesMatch[1].trim() : "";
            
            if (!notesMatch) {
              setStudyNotes("Teacher is preparing notes... please wait.");
              const fallbackNotes = await api.generateNotes(topic, "Class 12");
              nContent = fallbackNotes;
            }

            // Save to cache safely
            safeSetItem(cacheKey, JSON.stringify({ pContent, nContent }));

            setPodcastContent(pContent);
            setStudyNotes(nContent);
            startPlayback(pContent);
        } catch (error) {
            console.error('Failed to generate content:', error);
            setStatus('idle');
        }
    };

    const startPlayback = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onstart = () => setStatus('playing');
        utterance.onend = () => {
            setStatus('idle');
            setCurrentTime(0);
        };
        utterance.onboundary = (event) => {
            if (event.charIndex > 0) {
                const progress = (event.charIndex / text.length) * 100;
                setCurrentTime(progress);
            }
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const togglePlayPause = () => {
        if (status === 'playing') {
            window.speechSynthesis.pause();
            setStatus('paused');
        } else if (status === 'paused') {
            window.speechSynthesis.resume();
            setStatus('playing');
        }
    };

    const resetPodcast = () => {
        window.speechSynthesis.cancel();
        setStatus('idle');
        setPodcastContent('');
        setStudyNotes('');
        setTopic('');
        setCurrentTime(0);
        setShowNotes(false);
    };

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-[90vh] p-4 space-y-8 pb-32">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-2xl p-10 text-white relative overflow-hidden"
            >
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl mb-8 shadow-lg shadow-indigo-500/20">
                        <Headphones size={48} className="text-white" />
                    </div>

                    <h2 className="text-4xl font-black tracking-tighter mb-2 text-center uppercase">Learn with Podcast</h2>
                    <p className="text-slate-400 text-center mb-10 text-lg font-medium px-4">
                        Turn any complex chapter into an interactive audio masterclass with teacher notes.
                    </p>

                    <AnimatePresence mode="wait">
                        {status === 'idle' || status === 'generating' ? (
                            <motion.div 
                                key="input"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full space-y-6"
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter topic or chapter name..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/10 rounded-3xl px-8 py-5 text-lg placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                                    />
                                    {status === 'generating' && (
                                        <div className="absolute right-6 top-5">
                                            <Loader2 className="animate-spin text-indigo-500" size={28} />
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={generateLearningSet}
                                    disabled={status === 'generating' || !topic}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-indigo-900/20"
                                >
                                    {status === 'generating' ? 'Preparing your session...' : 'Start Audio Session'}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="player"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full space-y-10"
                            >
                                {/* Podcast Title Display */}
                                <div className="text-center">
                                    <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs">Now Explaining</span>
                                    <h3 className="text-2xl font-bold mt-2 truncate max-w-full">{topic}</h3>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" 
                                            animate={{ width: `${currentTime}%` }}
                                            transition={{ ease: "linear" }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-slate-500">
                                        <span>Teacher's Voice</span>
                                        <span>AI Enhanced</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-10">
                                    <button 
                                        onClick={resetPodcast}
                                        className="p-4 text-slate-500 hover:text-white transition-colors"
                                        title="Reset"
                                    >
                                        <RotateCcw size={32} />
                                    </button>

                                    <button 
                                        onClick={togglePlayPause}
                                        className="w-24 h-24 bg-white text-slate-950 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-2xl shadow-white/10"
                                    >
                                        {status === 'playing' ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                                    </button>

                                    <button
                                        onClick={() => setShowNotes(!showNotes)}
                                        className={`p-4 transition-colors ${showNotes ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}
                                        title="Toggle Notes"
                                    >
                                        <FileText size={32} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Structured Notes Section */}
            <AnimatePresence>
                {studyNotes && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl space-y-6"
                    >
                        <div className="flex items-center justify-between px-6">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <FileText className="text-indigo-400" />
                                Teacher's Study Notes
                            </h3>
                            <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={12} />
                                Ready for Exam
                            </div>
                        </div>

                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                            <div className="prose prose-invert prose-indigo max-w-none 
                                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter 
                                prose-p:text-slate-400 prose-p:leading-relaxed 
                                prose-strong:text-indigo-400 prose-strong:font-black
                                prose-ul:list-disc prose-li:text-slate-400
                                prose-hr:border-white/10">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm, remarkMath]} 
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {studyNotes}
                                </ReactMarkdown>
                            </div>
                        </div>
                        
                        <div className="flex justify-center pb-10">
                            <p className="text-slate-600 text-[10px] uppercase font-black tracking-[0.4em]">End of Study Module</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
