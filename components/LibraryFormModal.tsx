import React, { useState, useEffect, useRef } from 'react';
import type { LibraryItem, SkillClass, AgroClass } from '../types.ts';
import { generateImageFromPrompt } from '../services/api.ts';
import { 
    X, Save, Upload, Sparkles, Image as ImageIcon, 
    Lock, Layers, BookOpen, Loader2, Trash2 
} from 'lucide-react';

interface LibraryFormModalProps {
  item: LibraryItem | null;
  onClose: () => void;
  onSave: (data: Omit<LibraryItem, 'id'>, id?: number) => void;
  skillClasses: SkillClass[];
  agroClasses: AgroClass[];
}

const LibraryFormModal: React.FC<LibraryFormModalProps> = ({ item, onClose, onSave, skillClasses, agroClasses }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'General',
    description: '',
    fileUrl: '',
    coverImageUrl: '',
    type: 'Book' as LibraryItem['type'],
    price: 199,
    isProtected: false,
    classId: undefined as number | undefined,
    classType: undefined as 'skill' | 'agro' | undefined,
  });

  const [imageInputMode, setImageInputMode] = useState<'url' | 'ai'>('url');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        author: item.author,
        category: item.category,
        description: item.description,
        fileUrl: item.fileUrl,
        coverImageUrl: item.coverImageUrl,
        type: item.type,
        price: item.price || 199,
        isProtected: !!item.isProtected,
        classId: item.classId,
        classType: item.classType,
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            isProtected: checked,
            ...(!checked && { classId: undefined, classType: undefined })
        }));
        return;
    }
    
    if (name === "classType") {
        setFormData(prev => ({
            ...prev,
            classType: value as 'skill' | 'agro',
            classId: undefined
        }));
        return;
    }

    setFormData(prev => ({
        ...prev,
        [name]: name === 'classId' ? Number(value) : value,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'coverImageUrl' | 'fileUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGenerationError('');
    try {
        const generatedImageUrl = await generateImageFromPrompt(imagePrompt);
        setFormData(prev => ({ ...prev, coverImageUrl: generatedImageUrl }));
    } catch (err: any) {
        setGenerationError('Neural synthesis link failed. Check projection.');
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!formData.coverImageUrl) {
        alert('Visual asset required for node initialization.');
        return;
    }
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 800));
    onSave(formData, item?.id);
    setIsSubmitting(false);
  };
  
  const typeOptions: LibraryItem['type'][] = ['Book', 'Article', 'Research Paper', 'PDF Notes', 'PPT', 'Agriculture Magazine'];

  const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6 px-1">
      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">{icon}</div>
      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{title}</h4>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-2xl flex flex-col h-[90vh] overflow-hidden relative animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">{item ? 'Modify Archive Node' : 'Initialize Asset Ingestion'}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Repository Management Protocol</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-12 custom-scrollbar">
          <section className="space-y-6">
            <SectionHeader icon={<BookOpen size={18} />} title="Archive Metadata" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Asset Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g., Deep Tech Agriculture V4" />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Lead Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g., Dr. Sterling" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Pedagogical Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none" placeholder="Synthesize the asset's utility..."></textarea>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeader icon={<ImageIcon size={18} />} title="Visual Projection" />
            <div className="flex border-b border-white/5 mb-4 p-1 bg-slate-950/30 rounded-xl">
                <button type="button" onClick={() => setImageInputMode('url')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${imageInputMode === 'url' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>Manual Uplink</button>
                <button type="button" onClick={() => setImageInputMode('ai')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${imageInputMode === 'ai' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}><Sparkles size={12} /> AI Synthesis</button>
            </div>
            <div className="p-8 bg-slate-950/50 rounded-[2rem] border border-white/5 space-y-6">
                {imageInputMode === 'url' ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <input type="url" name="coverImageUrl" placeholder="High-fidelity asset URL" value={formData.coverImageUrl} onChange={handleChange} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none" />
                        </div>
                        <input type="file" accept="image/*" ref={coverImageInputRef} onChange={(e) => handleFileChange(e, 'coverImageUrl')} className="hidden" />
                        <button type="button" onClick={() => coverImageInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/30 hover:text-blue-400 transition-all flex items-center justify-center gap-3">
                            <Upload size={18} /> Inject Local Media
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="Define visual parameters (e.g., A minimalist geometric visualization of soil health in neon green)..." rows={3} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none" />
                        <button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full bg-blue-600 text-white font-black py-4 px-6 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest">
                            {isGeneratingImage ? <><Loader2 className="animate-spin" size={18} /> Synthesizing...</> : <><Sparkles size={18} /> Authorize Synthesis</>}
                        </button>
                        {generationError && <p className="text-[9px] font-black text-rose-500 text-center uppercase tracking-widest">{generationError}</p>}
                    </div>
                )}
                {formData.coverImageUrl && (
                    <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95">
                        <img src={formData.coverImageUrl} alt="Cover preview" className="w-full max-h-56 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                        <button onClick={() => setFormData(p => ({...p, coverImageUrl: ''}))} className="absolute top-4 right-4 p-2 bg-rose-600/80 text-white rounded-xl hover:bg-rose-500 transition-all shadow-lg"><Trash2 size={16} /></button>
                    </div>
                )}
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeader icon={<Layers size={18} />} title="Node Properties" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Classification Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none appearance-none">
                        {typeOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Price (₹ INR)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} min={0} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none" placeholder="199" />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Uplink URL (Digital Asset)</label>
                    <div className="flex gap-2">
                        <input type="url" name="fileUrl" placeholder="Direct data link" value={formData.fileUrl} onChange={handleChange} required className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none" />
                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e, 'fileUrl')} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-800 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><Upload size={18} /></button>
                    </div>
                </div>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeader icon={<Lock size={18} />} title="Sovereign Access Control" />
            <div className="p-8 bg-slate-950/50 rounded-[2rem] border border-white/5 space-y-8">
                <label className="flex items-center justify-between p-5 bg-slate-800/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all group">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Authorization Shield</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight">Restrict access to specific curriculum nodes</p>
                    </div>
                    <input type="checkbox" name="isProtected" checked={formData.isProtected} onChange={handleChange} className="w-6 h-6 rounded-lg bg-slate-900 border-white/10 text-blue-600 focus:ring-0 cursor-pointer" />
                </label>

                {formData.isProtected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Class Type</label>
                            <select name="classType" value={formData.classType || ''} onChange={handleChange} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none appearance-none">
                                <option value="" disabled className="bg-slate-900">Select type...</option>
                                <option value="skill" className="bg-slate-900">Skill Module</option>
                                <option value="agro" className="bg-slate-900">Agro Protocol</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Destination Node</label>
                            <select name="classId" value={formData.classId || ''} onChange={handleChange} disabled={!formData.classType} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none appearance-none disabled:opacity-30">
                                <option value="" disabled className="bg-slate-900">Select class...</option>
                                {(formData.classType === 'skill' ? skillClasses : agroClasses).map(c => (
                                    <option key={c.id} value={c.id} className="bg-slate-900">{c.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
          </section>
        </form>

        <footer className="p-8 bg-slate-900 border-t border-white/5 flex justify-end gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
            <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Abort Process</button>
            <button 
                type="submit" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 uppercase text-[10px] tracking-widest flex items-center gap-3"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Authorize Ingestion
            </button>
        </footer>
      </div>
    </div>
  );
};

export default LibraryFormModal;