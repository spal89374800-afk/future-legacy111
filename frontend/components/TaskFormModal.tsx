
import React, { useState, useEffect } from 'react';
import type { Task } from '../types.ts';
import { X, Calendar, Type, FileText, Save, Zap, Loader2 } from 'lucide-react';

interface TaskFormModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id' | 'isCompleted'>, id?: number) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ task, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(formData, task?.id);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">
              {task ? 'Refine Objective' : 'Initialize Objective'}
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Goal Architecture Protocol</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Type size={12} /> Objective Title
            </label>
            <input 
              type="text" 
              name="title" 
              placeholder="e.g., Finalize Aerospace Module" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <FileText size={12} /> Contextual Metadata
            </label>
            <textarea 
              name="description" 
              placeholder="Detailed description of the neural quota..." 
              value={formData.description} 
              onChange={handleChange} 
              rows={3}
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[100px]"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Calendar size={12} /> Expiration Node
            </label>
            <input 
              type="date" 
              name="dueDate" 
              value={formData.dueDate} 
              onChange={handleChange} 
              required 
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
            />
          </div>

          <footer className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-50 active:scale-95 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {task ? 'Commit Changes' : 'Deploy Objective'}
            </button>
            <p className="text-[8px] font-black text-center text-slate-700 uppercase tracking-[0.3em]">Neural Ledger Sync Enabled</p>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
