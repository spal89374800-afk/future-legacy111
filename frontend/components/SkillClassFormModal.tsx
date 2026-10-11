import React, { useState, useEffect, useRef } from 'react';
import type { SkillClass, PriceTier, ClassResource, ClassTest, User } from '../types.ts';
import { generateImageFromPrompt } from '../services/api.ts';
import { 
  Camera, X, Upload, Save, Sparkles, BookOpen, 
  Clock, Loader2, Award, Zap, Trash2, Plus,
  FileText, ShieldCheck
} from 'lucide-react';

// Removed unused declare global for renderMathInElement and katex

interface SkillClassFormModalProps {
  skillClass: SkillClass | null;
  onClose: () => void;
  onSave: (data: Omit<SkillClass, 'id' | 'isEnrolled' | 'studentsEnrolled'>, id?: number) => void;
  currentUser: User;
}

const SkillClassFormModal: React.FC<SkillClassFormModalProps> = ({ skillClass, onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState({
    title: skillClass?.title || '',
    instructor: skillClass?.instructor || currentUser.name,
    description: skillClass?.description || '',
    imageUrl: skillClass?.imageUrl || '',
    category: skillClass?.category || 'General',
    pricingTiers: skillClass?.pricingTiers?.length ? skillClass.pricingTiers : [{ duration: 1, price: 499 }] as PriceTier[],
    type: (skillClass?.type as any) || 'Course',
    difficulty: skillClass?.difficulty || 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    maxStudents: skillClass?.maxStudents || 50,
    notes: skillClass?.notes || [] as Partial<ClassResource>[],
    dpps: skillClass?.dpps || [] as Partial<ClassResource>[],
    tests: skillClass?.tests || [] as Partial<ClassTest>[],
  });

  const [imageInputMode, setImageInputMode] = useState<'url' | 'ai'>('url');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = ['maxStudents'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };
  
  const handleTierChange = (index: number, field: 'duration' | 'price', value: string | number) => {
    const newTiers = [...formData.pricingTiers];
    newTiers[index] = { ...newTiers[index], [field]: Number(value) };
    setFormData(prev => ({ ...prev, pricingTiers: newTiers }));
  };

  const addTier = () => {
    setFormData(prev => ({ ...prev, pricingTiers: [...prev.pricingTiers, { duration: 1, price: 0 }] }));
  };

  const removeTier = (index: number) => {
    if (formData.pricingTiers.length <= 1) return;
    setFormData(prev => ({ ...prev, pricingTiers: prev.pricingTiers.filter((_, i) => i !== index) }));
  };
  
  const handleResourceChange = (type: 'notes' | 'dpps' | 'tests', index: number, field: string, value: string) => {
    setFormData(prev => {
        const newItems = [...(prev[type] as any[])];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, [type]: newItems };
    });
  };

  const handleAddResource = (type: 'notes' | 'dpps' | 'tests') => {
      const newItem = type === 'tests' ? { id: Date.now(), title: '', fileUrl: '', type: 'Part Test' as const } : { id: Date.now(), title: '', fileUrl: '' };
      setFormData(prev => ({ ...prev, [type]: [...(prev[type] as any[]), newItem] }));
  };
  
  const handleRemoveResource = (type: 'notes' | 'dpps' | 'tests', index: number) => {
      setFormData(prev => ({...prev, [type]: (prev[type] as any[]).filter((_, i) => i !== index)}));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        setGenerationError('Visual cover required for node initialization.');
        return;
    }
    onSave({ ...formData, notes: formData.notes as ClassResource[], dpps: formData.dpps as ClassResource[], tests: formData.tests as ClassTest[], rating: skillClass?.rating || 5.0 }, skillClass?.id);
    onClose();
  };
  
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGenerationError('');
    try {
        const generatedImageUrl = await generateImageFromPrompt(imagePrompt);
        setFormData(prev => ({ ...prev, imageUrl: generatedImageUrl }));
    } catch (err: any) {
        setGenerationError('Synthesis link failed. Check prompts.');
    } finally {
        setIsGeneratingImage(false);
    }
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

  const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; }> = ({ title, icon }) => (
    <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-2xl">
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
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">{title} Data Nodes</h5>
            </div>
            <button type="button" onClick={() => handleAddResource(type)} className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                <Plus size={14} />
                Inject Item
            </button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
              <div key={item.id || index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-slate-900 p-4 rounded-2xl border border-white/5 group">
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={(e) => handleResourceChange(type, index, 'title', e.target.value)} 
                    placeholder={`${title.slice(0,-1)} Title`} 
                    className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                  />
                  <div className="flex gap-2 items-center">
                    <input 
                      type="url" 
                      value={(item as any).fileUrl || ''} 
                      onChange={(e) => handleResourceChange(type, index, 'fileUrl', e.target.value)} 
                      placeholder="Remote URL" 
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
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No pedagogical assets detected</p>
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
            <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">{skillClass ? 'Refine Academic Node' : 'Initialize Skill Module'}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Syllabus Architecture Protocol</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-12 custom-scrollbar">
          {/* Section 1: Core Blueprint */}
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
                    placeholder="e.g., Quantum Computing Fundamentals" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mentor-in-Chief</label>
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
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Pedagogical Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={4} 
                    required 
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[120px]" 
                    placeholder="Elaborate on the learning trajectory and expert outcomes..."
                  />
                </div>
            </div>
          </section>
          
          {/* Section 2: Visual Projection */}
          <section>
            <SectionHeader title="Visual Projection" icon={<Camera size={24} />} />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                 <div className="space-y-6">
                    <div className="flex border-b border-white/5 mb-4 p-1 bg-slate-950/30 rounded-xl">
                        <button type="button" onClick={() => setImageInputMode('url')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${imageInputMode === 'url' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>Manual Asset</button>
                        <button type="button" onClick={() => setImageInputMode('ai')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${imageInputMode === 'ai' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}><Sparkles size={12} /> AI Synthesis</button>
                    </div>
                    <div className="space-y-4">
                        {imageInputMode === 'url' ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Archive URL</label>
                                <input 
                                  type="url" 
                                  name="imageUrl" 
                                  placeholder="Paste high-fidelity media link" 
                                  value={formData.imageUrl} 
                                  onChange={handleChange} 
                                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none"
                                />
                              </div>
                              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full p-5 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/30 hover:text-blue-400 transition-all flex items-center justify-center gap-3">
                                <Upload size={18} /> Inject Local Media
                              </button>
                              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Neural Prompt</label>
                              <textarea 
                                value={imagePrompt} 
                                onChange={(e) => setImagePrompt(e.target.value)} 
                                placeholder="e.g., A minimalist geometric visualization of quantum entanglement in deep violet..." 
                                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                rows={3} 
                              />
                              <button 
                                type="button" 
                                onClick={handleGenerateImage} 
                                disabled={isGeneratingImage || !imagePrompt.trim()} 
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
                              >
                                {isGeneratingImage ? <><Loader2 className="animate-spin" size={18} /> Synthesizing...</> : <><Zap size={18} /> Synchronize Neural Image</>}
                              </button>
                            </div>
                        )}
                    </div>
                 </div>
                 <div className="w-full">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Asset Preview</p>
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
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Projection Offline</p>
                          </div>
                        )}
                     </div>
                      {generationError && <p className="text-[10px] font-black text-rose-500 text-center mt-3 uppercase tracking-widest">{generationError}</p>}
                 </div>
             </div>
          </section>

          {/* Section 3: Operational Configuration */}
          <section>
            <SectionHeader title="Operational Setup" icon={<Award size={24} />} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Difficulty Tier</label>
                  <select 
                    name="difficulty" 
                    value={formData.difficulty} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none appearance-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Deployment Format</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none appearance-none"
                  >
                    <option>Course</option>
                    <option>Workshop</option>
                    <option>Webinar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Neural Capacity</label>
                  <input 
                    type="number" 
                    name="maxStudents" 
                    value={formData.maxStudents} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none"
                  />
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6 px-1">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Zap size={16} className="text-blue-400" />
                    Subscription Matrix
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {formData.pricingTiers.map((tier, index) => (
                    <div key={index} className="flex items-center justify-between gap-6 p-6 bg-slate-800/30 rounded-[1.5rem] border border-white/5 hover:bg-slate-800/50 transition-all group">
                        <div className="flex flex-1 items-center gap-6">
                            <div className="space-y-1 flex-1">
                              <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">Duration Node</label>
                              <select 
                                value={tier.duration} 
                                onChange={(e) => handleTierChange(index, 'duration', e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 outline-none"
                              >
                                <option value="1">1 Month Sync</option>
                                <option value="6">6 Month Pass</option>
                                <option value="0">Sovereign Lifetime</option>
                              </select>
                            </div>
                            <div className="space-y-1 flex-1">
                              <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">Linkage Fee (₹)</label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  placeholder="0" 
                                  value={tier.price} 
                                  onChange={(e) => handleTierChange(index, 'price', e.target.value)} 
                                  required 
                                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30" 
                                />
                              </div>
                            </div>
                        </div>
                        <button type="button" onClick={() => removeTier(index)} disabled={formData.pricingTiers.length <= 1} className="p-3 text-slate-600 hover:text-rose-500 bg-slate-900/50 hover:bg-rose-500/10 rounded-xl disabled:opacity-0 transition-all">
                          <X size={18} />
                        </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addTier} className="mt-6 w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-500/20 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Expand Pricing Node
                </button>
            </div>
          </section>
          
          {/* Section 4: Academic Resources */}
          <section>
            <SectionHeader title="Academic Assets" icon={<FileText size={24} />} />
             <div className="space-y-8">
                <ResourceGroup title="Notes" type="notes" items={formData.notes} />
                <ResourceGroup title="DPPs" type="dpps" items={formData.dpps} />
                <ResourceGroup title="Examinations" type="tests" items={formData.tests} />
             </div>
          </section>
        </form>

        <footer className="p-8 bg-slate-900 border-t border-white/5 flex justify-end gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
          <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Abort Process</button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 uppercase text-[10px] tracking-widest flex items-center gap-3"
          >
            <Save size={18} />
            Authorize Deployment
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SkillClassFormModal;