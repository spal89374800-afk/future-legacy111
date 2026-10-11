import React, { useState, useEffect, useRef } from 'react';
import type { GuidanceClass, ClassResource, ClassTest, User } from '../types.ts';
import { generateImageFromPrompt } from '../services/api.ts';
import { 
  X, Save, Upload, Sparkles, BookOpen, 
  Clock, Loader2, Award, Zap, Trash2, Plus,
  FileText, ShieldCheck, Camera, Layers
} from 'lucide-react';

interface GuidanceClassFormModalProps {
  guidanceClass: GuidanceClass | null;
  onClose: () => void;
  onSave: (data: Omit<GuidanceClass, 'id' | 'isEnrolled' | 'studentsEnrolled'>, id?: number) => void;
  currentUser: User;
}

const PREDEFINED_CATEGORIES: string[] = ['Class 10', 'Class 11', 'Class 12', 'NEET', 'JEE', 'Medical', 'Law', 'Engineering', 'Chemistry', 'UPSC'];

const GuidanceClassFormModal: React.FC<GuidanceClassFormModalProps> = ({ guidanceClass, onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState({
    title: guidanceClass?.title || '',
    instructor: guidanceClass?.instructor || currentUser.name,
    description: guidanceClass?.description || '',
    imageUrl: guidanceClass?.imageUrl || '',
    price: guidanceClass?.price || 0,
    courseDuration: guidanceClass?.courseDuration || '',
    category: guidanceClass?.category || 'Class 10',
    type: (guidanceClass?.type as any) || 'Course',
    difficulty: guidanceClass?.difficulty || 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    maxStudents: guidanceClass?.maxStudents || 100,
    notes: guidanceClass?.notes || [] as Partial<ClassResource>[],
    dpps: guidanceClass?.dpps || [] as Partial<ClassResource>[],
    tests: guidanceClass?.tests || [] as Partial<ClassTest>[],
  });
  
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'ai'>('url');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (guidanceClass?.category && !PREDEFINED_CATEGORIES.includes(guidanceClass.category)) {
        setIsCustomCategory(true);
    }
  }, [guidanceClass]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['price', 'maxStudents'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleResourceChange = (type: 'notes' | 'dpps' | 'tests', index: number, field: string, value: string) => {
    setFormData(prev => {
        const newItems = [...(prev[type] as any[])];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, [type]: newItems };
    });
  };

  const handleAddResource = (type: 'notes' | 'dpps' | 'tests') => {
      const newItem = type === 'tests' ? { id: Date.now() + Math.random(), title: '', fileUrl: '', type: 'Part Test' as const } : { id: Date.now() + Math.random(), title: '', fileUrl: '' };
      setFormData(prev => ({ ...prev, [type]: [...(prev[type] as any[]), newItem] }));
  };
  
  const handleRemoveResource = (type: 'notes' | 'dpps' | 'tests', index: number) => {
      setFormData(prev => ({ ...prev, [type]: (prev[type] as any[]).filter((_, i) => i !== index) }));
  };
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
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
        setFormData(prev => ({ ...prev, imageUrl: generatedImageUrl }));
    } catch (err: any) {
        setGenerationError('Neural synthesis link failure. Check projection parameters.');
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        setGenerationError('Visual asset required for node initialization.');
        return;
    }
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 800));
    onSave({ ...formData, notes: formData.notes as ClassResource[], dpps: formData.dpps as ClassResource[], tests: formData.tests as ClassTest[], rating: guidanceClass?.rating || 5.0 }, guidanceClass?.id);
    setIsSubmitting(false);
  };
  
  const typeOptions: GuidanceClass['type'][] = ['Course', 'Webinar', 'Workshop', '1-on-1', 'Batch'];
  
  const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; }> = ({ title, icon }) => (
    <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-violet-500/10 text-violet-400 rounded-2xl">
            {icon}
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">{title}</h3>
    </div>
  );
  
  const ResourceGroup: React.FC<{
    title: string;
    type: 'notes' | 'dpps' | 'tests';
    items: Partial<ClassResource>[] | Partial<ClassTest>[];
  }> = ({ title, type, items }) => (
    <div className="space-y-4 p-6 bg-slate-800/40 rounded-[2rem] border border-white/5">
        <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
                <FileText size={16} className="text-slate-500" />
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">{title} Nodes</h5>
            </div>
            <button type="button" onClick={() => handleAddResource(type)} className="text-[10px] font-black text-violet-400 hover:text-violet-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                <Plus size={14} />
                Inject Asset
            </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
              <div key={item.id || index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-slate-900 p-4 rounded-2xl border border-white/5 group">
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={(e) => handleResourceChange(type, index, 'title', e.target.value)} 
                    placeholder={`${title.slice(0,-1)} Identifier`} 
                    className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                  />
                  <div className="flex gap-2 items-center">
                    <input 
                      type="url" 
                      value={(item as any).fileUrl || ''} 
                      onChange={(e) => handleResourceChange(type, index, 'fileUrl', e.target.value)} 
                      placeholder="Downlink URL" 
                      className="flex-grow bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none" 
                    />
                    {type === 'tests' && (
                      <select 
                        value={(item as any).type || 'Part Test'} 
                        onChange={(e) => handleResourceChange(type, index, 'type', e.target.value)} 
                        className="bg-slate-800 border border-white/5 rounded-xl px-3 py-2.5 text-[10px] font-bold text-slate-300 outline-none"
                      >
                        <option value="Part Test">Part</option>
                        <option value="Full Test">Full</option>
                      </select>
                    )}
                    <button type="button" onClick={() => handleRemoveResource(type, index)} className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
              </div>
          ))}
          {items.length === 0 && (
            <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No pedagogical nodes defined</p>
            </div>
          )}
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-4xl flex flex-col h-[90vh] overflow-hidden">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">{guidanceClass ? 'Modify Strategy Node' : 'Initialize Strategy Module'}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Pedagogical Trajectory Protocol</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-12 custom-scrollbar">
          {/* Core Blueprint */}
          <section>
            <SectionHeader title="Module Blueprint" icon={<BookOpen size={24} />} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Module Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" 
                    placeholder="e.g., UPSC Ethics & Strategy" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Architect Node</label>
                  <input 
                    name="instructor" 
                    value={formData.instructor} 
                    onChange={handleChange} 
                    required 
                    readOnly 
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-5 text-sm text-slate-500 cursor-not-allowed" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Trajectory Narrative</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={4} 
                    required 
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[120px]" 
                    placeholder="Articulate the academic roadmap and expert mentorship outcomes..."
                  />
                </div>
            </div>
          </section>

          {/* Visual Projection */}
          <section>
            <SectionHeader title="Visual Projection" icon={<Camera size={24} />} />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                 <div className="space-y-6">
                    <div className="flex border-b border-white/5 mb-4 p-1 bg-slate-950/30 rounded-xl">
                        <button type="button" onClick={() => setImageInputMode('url')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${imageInputMode === 'url' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>Manual Asset</button>
                        <button type="button" onClick={() => setImageInputMode('ai')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${imageInputMode === 'ai' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}><Sparkles size={12} /> AI Synthesis</button>
                    </div>
                    <div className="space-y-4">
                        {imageInputMode === 'url' ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Archive URL</label>
                                <input 
                                  type="url" 
                                  name="imageUrl" 
                                  placeholder="Paste high-fidelity media downlink" 
                                  value={formData.imageUrl} 
                                  onChange={handleChange} 
                                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none"
                                />
                              </div>
                              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full p-5 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-violet-500/30 hover:text-violet-400 transition-all flex items-center justify-center gap-3">
                                <Upload size={18} /> Inject Local Visual
                              </button>
                              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Neural Prompt</label>
                              <textarea 
                                value={imagePrompt} 
                                onChange={(e) => setImagePrompt(e.target.value)} 
                                placeholder="e.g., A panoramic view of an ancient library merging with holographic circuits..." 
                                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                rows={3} 
                              />
                              <button 
                                type="button" 
                                onClick={handleGenerateImage} 
                                disabled={isGeneratingImage || !imagePrompt.trim()} 
                                className="w-full py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-500 active:scale-95 transition-all shadow-xl shadow-violet-900/20 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
                              >
                                {isGeneratingImage ? <><Loader2 className="animate-spin" size={18} /> Synthesizing...</> : <><Zap size={18} /> Authorize Neural Sync</>}
                              </button>
                            </div>
                        )}
                    </div>
                 </div>
                 <div className="w-full">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Projection Preview</p>
                     <div className="relative aspect-video rounded-[2.5rem] bg-slate-950 border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden group shadow-2xl">
                        {formData.imageUrl ? (
                          <>
                            <img src={formData.imageUrl} alt="Class preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                            <div className="absolute bottom-4 right-4">
                               <ShieldCheck className="text-emerald-500 drop-shadow-lg" size={24} />
                            </div>
                          </>
                        ) : (
                          <div className="text-center space-y-3 opacity-20">
                            <Camera size={48} className="mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Visual Stream Offline</p>
                          </div>
                        )}
                     </div>
                      {generationError && <p className="text-[10px] font-black text-rose-500 text-center mt-3 uppercase tracking-widest">{generationError}</p>}
                 </div>
             </div>
          </section>

          {/* Operational Setup */}
          <section>
            <SectionHeader title="Operational Configuration" icon={<Award size={24} />} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Uplink Fee (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Temporal Duration</label>
                  <input type="text" name="courseDuration" placeholder="e.g., 90 Days" value={formData.courseDuration} onChange={handleChange} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Neural Capacity</label>
                  <input type="number" name="maxStudents" value={formData.maxStudents} onChange={handleChange} required className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Strategy Category</label>
                  <div className="relative">
                    <select 
                        value={isCustomCategory ? 'Other' : formData.category} 
                        onChange={(e) => { 
                            if (e.target.value === 'Other') { 
                                setIsCustomCategory(true); 
                                setFormData(prev => ({ ...prev, category: '' })); 
                            } else { 
                                setIsCustomCategory(false); 
                                setFormData(prev => ({ ...prev, category: e.target.value })); 
                            } 
                        }}
                        className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                    >
                        {PREDEFINED_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                        <option value="Other" className="bg-slate-900">Custom Category...</option>
                    </select>
                    <Layers className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Deployment Format</label>
                  <div className="relative">
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                        {typeOptions.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                    </select>
                    <Zap className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={18} />
                  </div>
                </div>
            </div>
            {isCustomCategory && (
                <div className="animate-in slide-in-from-top-2 duration-300 mt-6 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Custom Category Identifier</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Vedic Mathematics" required className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/20" />
                </div>
            )}
          </section>

          {/* Academic Resources */}
          <section>
            <SectionHeader title="Academic Assets" icon={<FileText size={24} />} />
             <div className="space-y-8">
                <ResourceGroup title="Archive Notes" type="notes" items={formData.notes} />
                <ResourceGroup title="Execution Quotas (DPP)" type="dpps" items={formData.dpps} />
                <ResourceGroup title="Neural Benchmarks (Tests)" type="tests" items={formData.tests} />
             </div>
          </section>
        </form>

        <footer className="p-8 bg-slate-900 border-t border-white/5 flex justify-end gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
          <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Abort Process</button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/20 uppercase text-[10px] tracking-widest flex items-center gap-3"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Authorize Strategy Deployment
          </button>
        </footer>
      </div>
    </div>
  );
};

export default GuidanceClassFormModal;