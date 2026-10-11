
import React, { useState } from 'react';
import { generateFullSyllabusOutline } from '../services/api';
import type { FullSyllabusOutline } from '../types.ts';
import { X, Loader2, Sparkles, Calendar, BookOpen, Target, Edit3 } from 'lucide-react';

interface WeeklySyllabusModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const defaultDailyPlan = () => ({ topic: '', subTopics: '', assignment: '' });

const WeeklySyllabusModal: React.FC<WeeklySyllabusModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        course: '',
        duration: '',
        objectives: '',
        notes: '',
    });
    const [dailyPlans, setDailyPlans] = useState(Array(7).fill(null).map(defaultDailyPlan));
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDailyPlanChange = (index: number, field: keyof ReturnType<typeof defaultDailyPlan>, value: string) => {
        const newPlans = [...dailyPlans];
        newPlans[index][field] = value;
        setDailyPlans(newPlans);
    };

    const handleAutoFill = async () => {
        if (!formData.course) {
            setAiError('Please enter a Course/Subject to auto-fill.');
            return;
        }
        setIsAiLoading(true);
        setAiError('');
        try {
            const result = await generateFullSyllabusOutline(formData.course, formData.duration || 'One Week');
            setFormData(prev => ({ ...prev, objectives: result.learningObjectives }));
            setDailyPlans(result.dailyPlans);
        } catch (err: any) {
            setAiError(err.message);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, dailyPlans });
    };

    const formInputClasses = "w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner";

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <form onSubmit={handleSubmit} className="bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl flex flex-col h-[95vh] animate-in zoom-in-95 duration-300 border border-white/10">
                <div className="p-8 border-b border-white/5 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-2xl font-black text-white font-montserrat tracking-tight uppercase">Weekly Syllabus Architect</h3>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition p-2 hover:bg-white/5 rounded-xl">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Course / Subject Title</label>
                            <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="e.g., Advanced AI Architectures" required className={formInputClasses} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Duration / Period</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 8 Weeks" className={formInputClasses} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><Target size={12}/> Learning Objectives</label>
                        <textarea name="objectives" value={formData.objectives} onChange={handleChange} rows={3} placeholder="Define high-level learning outcomes..." className={`${formInputClasses} min-h-[100px]`} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2"><BookOpen size={12}/> Syllabus Notes (Optional)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Add any special instructions or additional notes for the syllabus..." className={`${formInputClasses} min-h-[100px]`} />
                    </div>

                    <div className="pt-4 space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} className="text-blue-400" /> Weekly Curriculum & Syllabus Plan
                            </h4>
                            <button type="button" onClick={handleAutoFill} disabled={isAiLoading || !formData.course} className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2 transition-colors">
                                {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                AI Auto-Fill
                            </button>
                        </div>
                        {aiError && <p className="text-xs text-rose-400 mt-2">{aiError}</p>}
                        <div className="space-y-4">
                            {dailyPlans.map((day, index) => (
                                <details key={index} className="bg-slate-800/40 border border-white/5 rounded-[1.5rem] overflow-hidden" open>
                                    <summary className="p-5 font-black text-sm text-slate-200 cursor-pointer flex items-center gap-4 transition-colors hover:bg-white/5 uppercase tracking-widest">
                                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-lg">{index < 7 ? `Day ${index + 1}` : `Week ${index + 1}`}</div>
                                        {day.topic || `Topic for ${index < 7 ? `Day ${index + 1}` : `Week ${index + 1}`}`}
                                    </summary>
                                    <div className="p-6 border-t border-white/5 bg-slate-900/20 space-y-4">
                                        <div>
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Main Chapter / Topic</label>
                                            <input type="text" value={day.topic} onChange={e => handleDailyPlanChange(index, 'topic', e.target.value)} placeholder="e.g., Optics & Wave Theory" className={formInputClasses} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Sub-topics / Activities</label>
                                            <textarea value={day.subTopics} onChange={e => handleDailyPlanChange(index, 'subTopics', e.target.value)} rows={2} placeholder="e.g., Perceptrons, Activation Functions, Lab: Simple NN in Python" className={formInputClasses} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Assignment / Reading</label>
                                            <textarea value={day.assignment} onChange={e => handleDailyPlanChange(index, 'assignment', e.target.value)} rows={1} placeholder="e.g., Read Ch. 1-2, Practice Set A" className={formInputClasses} />
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="p-6 bg-slate-800/50 border-t border-white/5 flex justify-end gap-4 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-700 text-slate-200 font-black rounded-xl hover:bg-slate-600 transition-colors uppercase text-[10px] tracking-widest">Cancel</button>
                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 uppercase text-[10px] tracking-widest flex items-center gap-2">
                       <Edit3 size={16} /> Review & Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WeeklySyllabusModal;