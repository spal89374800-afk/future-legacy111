import React, { useState, useRef } from 'react';
import { getLessonPlanSuggestions } from '../services/api.ts';
import type { LessonPlanSuggestions } from '../types.ts';
import { X, Loader2, Sparkles, Plus, Trash2 } from 'lucide-react';

interface LessonPlanModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const Section: React.FC<{ title: string; emoji: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, emoji, children, defaultOpen = false }) => (
    <details className="bg-slate-900/50 border border-white/5 rounded-[1.5rem] overflow-hidden" open={defaultOpen}>
        <summary className="p-5 font-black text-sm text-slate-200 cursor-pointer flex items-center gap-4 transition-colors hover:bg-white/5 uppercase tracking-widest">
            <span className="text-2xl">{emoji}</span>
            {title}
        </summary>
        <div className="p-6 border-t border-white/5 bg-slate-800/20">{children}</div>
    </details>
);

const LessonPlanModal: React.FC<LessonPlanModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        subject: 'Physics',
        grade: '',
        objectives: '',
        description: '',
        assignment: '',
    });
    const [subTopics, setSubTopics] = useState<string[]>(['']);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [aiSuggestions, setAiSuggestions] = useState<LessonPlanSuggestions | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubTopicChange = (index: number, value: string) => {
        const newSubTopics = [...subTopics];
        newSubTopics[index] = value;
        setSubTopics(newSubTopics);
    };

    const addSubTopic = () => setSubTopics([...subTopics, '']);
    const removeSubTopic = (index: number) => {
        if (subTopics.length > 1) {
            setSubTopics(subTopics.filter((_, i) => i !== index));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };
    
    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleGenerateAiSuggestions = async () => {
        if (!formData.title || !formData.grade) {
            setAiError('Please enter a Lesson Title and Grade to get AI suggestions.');
            return;
        }
        setIsAiLoading(true);
        setAiError('');
        setAiSuggestions(null);
        try {
            const result = await getLessonPlanSuggestions(formData.title, formData.grade);
            setAiSuggestions(result);
        } catch (error: any) {
            setAiError(error.message);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, subTopics, attachments });
    };

    const subjectOptions = ["Physics", "Chemistry", "Biology", "AI", "App Development", "Social Media", "Lab Activity"];
    
    const formInputClasses = "w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner";
    const formTextareaClasses = `${formInputClasses} min-h-[100px]`;

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <form onSubmit={handleSubmit} className="bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex flex-col h-[90vh] animate-in zoom-in-95 duration-300 border border-white/10">
                <div className="p-8 border-b border-white/5 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-2xl font-black text-white font-montserrat tracking-tight uppercase">Lesson Plan Architect</h3>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition p-2 hover:bg-white/5 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <Section emoji="📝" title="Lesson / Topic Name" defaultOpen>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Photosynthesis – Step by Step Understanding" required className={formInputClasses} />
                    </Section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Section emoji="📚" title="Subject / Category">
                            <select name="subject" value={formData.subject} onChange={handleChange} className={`${formInputClasses} appearance-none`}>
                                {subjectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </Section>
                        <Section emoji="🎓" title="Grade / Class">
                           <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g., Class 10" required className={formInputClasses} />
                        </Section>
                    </div>

                    <Section emoji="🎯" title="Learning Objectives">
                        <textarea name="objectives" value={formData.objectives} onChange={handleChange} rows={3} placeholder="Write 2-5 clear objectives students should achieve." className={formTextareaClasses} />
                    </Section>
                    
                    <Section emoji="📖" title="Lesson Description / Instructions">
                         <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Add detailed step-by-step content or instructions for the topic." className={formTextareaClasses} />
                    </Section>

                    <Section emoji="🧩" title="Sub-topics / Sections (Optional)">
                        <div className="space-y-3">
                        {subTopics.map((topic, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" value={topic} onChange={(e) => handleSubTopicChange(index, e.target.value)} placeholder={`Sub-topic ${index + 1}`} className={formInputClasses} />
                                <button type="button" onClick={() => removeSubTopic(index)} disabled={subTopics.length <= 1} className="p-3 text-rose-400 hover:bg-rose-500/10 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        </div>
                        <button type="button" onClick={addSubTopic} className="mt-4 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                           <Plus size={16} /> Add Sub-topic
                        </button>
                    </Section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Section emoji="📎" title="Attachments (Optional)">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden"/>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full p-4 border-2 border-dashed border-slate-700 rounded-2xl text-center text-slate-400 hover:bg-slate-700/50 hover:border-blue-500/40 transition">Attach Files</button>
                            <div className="mt-3 space-y-2">
                                {attachments.map((file, i) => (
                                    <div key={i} className="text-xs p-2 bg-slate-800 rounded-lg flex justify-between items-center text-slate-300">{file.name}<button type="button" onClick={() => removeAttachment(i)} className="text-rose-400 text-lg">&times;</button></div>
                                ))}
                            </div>
                        </Section>
                        <Section emoji="✍️" title="Assignments (Optional)">
                             <textarea name="assignment" value={formData.assignment} onChange={handleChange} rows={4} placeholder="e.g., Draw a diagram of a chloroplast..." className={formTextareaClasses} />
                        </Section>
                    </div>

                     <Section emoji="✨" title="AI Suggestions (Optional)">
                        <button type="button" onClick={handleGenerateAiSuggestions} disabled={isAiLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20">
                            {isAiLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Generating...</> : <><Sparkles size={16} /> Get AI Suggestions</>}
                        </button>
                        {aiError && <p className="text-xs text-rose-400 mt-2">{aiError}</p>}
                        {aiSuggestions && (
                            <div className="mt-6 space-y-6 animate-in fade-in">
                                <div className="space-y-2"><h4 className="font-bold text-slate-200">Suggested Sub-topics:</h4><ul className="list-disc list-inside text-sm text-slate-300 space-y-1">{aiSuggestions.subTopics.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
                                <div className="space-y-2"><h4 className="font-bold text-slate-200">Example Exercises:</h4><ul className="list-disc list-inside text-sm text-slate-300 space-y-1">{aiSuggestions.exercises.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
                                <div className="space-y-2"><h4 className="font-bold text-slate-200">Creative Teaching Ideas:</h4><ul className="list-disc list-inside text-sm text-slate-300 space-y-1">{aiSuggestions.teachingIdeas.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
                            </div>
                        )}
                    </Section>
                </div>

                <div className="p-6 bg-slate-800/50 border-t border-white/5 flex justify-end gap-4 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-700 text-slate-200 font-black rounded-xl hover:bg-slate-600 transition-colors uppercase text-[10px] tracking-widest">Cancel</button>
                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 uppercase text-[10px] tracking-widest">
                       Review & Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LessonPlanModal;