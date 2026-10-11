import React, { useState, useEffect, useRef } from 'react';
import type { AgroProfessional, AgroDocument } from '../types.ts';
import CameraModal from './CameraModal.tsx';
import { Camera, X, Upload, User, Briefcase, Clock, Phone, Save, FileText, Loader2 } from 'lucide-react';

// Removed unused declare global for renderMathInElement and katex

interface AgroProfessionalFormModalProps {
  professional: AgroProfessional | null;
  onClose: () => void;
  onSave: (data: Omit<AgroProfessional, 'id'>, id?: number) => void;
}

const AgroProfessionalFormModal: React.FC<AgroProfessionalFormModalProps> = ({ professional, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    qualifications: '',
    bio: '',
    imageUrl: '',
    documents: [] as AgroDocument[],
    fees_individual: 0,
    fees_batch: 0,
    specialization: '',
    availabilityDays: 'Mon - Fri',
    availabilityTime: '9 AM - 5 PM',
    mobileNumber: '',
    status: 'Available' as 'Available' | 'Unavailable',
  });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (professional) {
      setFormData({
        ...professional,
        availabilityDays: professional.availability.days,
        availabilityTime: professional.availability.time,
      });
    }
  }, [professional]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocs: AgroDocument[] = Array.from(e.target.files).map((file: File) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        file: file,
        status: 'Pending',
      }));
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
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

  const handlePhotoCapture = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl: imageDataUrl }));
    setIsCameraOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { availabilityDays, availabilityTime, ...rest } = formData;
    const saveData = {
        ...rest,
        availability: {
            days: availabilityDays,
            time: availabilityTime,
        }
    };
    
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(saveData, professional?.id);
    onClose();
  };

  const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">{icon}</div>
      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{title}</h4>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col h-[90vh] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">{professional ? 'Refine Agro Profile' : 'Initialize Agro Profile'}</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Professional Identity Protocol</p>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0 relative group">
                        <img 
                          src={formData.imageUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=AgroPro'} 
                          alt="Preview" 
                          className="w-32 h-32 rounded-[2rem] object-cover bg-slate-800 border-2 border-slate-700 shadow-xl" 
                        />
                        <div className="absolute -bottom-3 -right-3 flex gap-2">
                           <button type="button" onClick={() => setIsCameraOpen(true)} className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-500 transition-all">
                              <Camera size={16} />
                           </button>
                           <button type="button" onClick={() => imageFileInputRef.current?.click()} className="p-2 bg-slate-700 text-white rounded-xl shadow-lg hover:bg-slate-600 transition-all">
                              <Upload size={16} />
                           </button>
                        </div>
                        <input type="file" accept="image/*" ref={imageFileInputRef} onChange={handleImageFileChange} className="hidden" />
                    </div>
                    
                    <div className="flex-grow w-full space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Legal Name</label>
                                <input 
                                  type="text" 
                                  name="name" 
                                  value={formData.name} 
                                  onChange={handleChange} 
                                  required 
                                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Qualifications</label>
                                <input 
                                  type="text" 
                                  name="qualifications" 
                                  value={formData.qualifications} 
                                  onChange={handleChange} 
                                  required 
                                  className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mobile Uplink</label>
                            <input 
                              type="tel" 
                              name="mobileNumber" 
                              placeholder="e.g., +91 9876543210" 
                              value={formData.mobileNumber} 
                              onChange={handleChange} 
                              required 
                              pattern="\+?\d{10,15}"
                              title="Please enter a valid mobile number (10-15 digits, optional +)"
                              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                {/* Narrative Section */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Professional Bio</label>
                    <textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange} 
                      rows={4} 
                      placeholder="Synthesize your agricultural expertise and mission..." 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all min-h-[120px]"
                    />
                </div>

                {/* Specialization & Fees */}
                <SectionHeader icon={<Briefcase size={18} />} title="Operational Parameters" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Core Specialization</label>
                        <input 
                          type="text" 
                          name="specialization" 
                          value={formData.specialization} 
                          onChange={handleChange} 
                          placeholder="e.g., Crop Yield Optimization" 
                          required 
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Individual Consultation Fee (₹)</label>
                        <input 
                          type="number" 
                          name="fees_individual" 
                          value={formData.fees_individual} 
                          onChange={handleChange} 
                          required 
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Batch Consultation Fee (₹)</label>
                        <input 
                          type="number" 
                          name="fees_batch" 
                          value={formData.fees_batch} 
                          onChange={handleChange} 
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Availability Status</label>
                        <select 
                          name="status" 
                          value={formData.status} 
                          onChange={handleChange} 
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none appearance-none" 
                        >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                    </div>
                </div>

                {/* Availability */}
                <SectionHeader icon={<Clock size={18} />} title="Temporal Sync Window" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Operational Days</label>
                        <input 
                          type="text" 
                          name="availabilityDays" 
                          value={formData.availabilityDays} 
                          onChange={handleChange} 
                          placeholder="e.g., Mon - Fri" 
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Operational Hours</label>
                        <input 
                          type="text" 
                          name="availabilityTime" 
                          value={formData.availabilityTime} 
                          onChange={handleChange} 
                          placeholder="e.g., 9 AM - 5 PM" 
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                        />
                    </div>
                </div>

                {/* Documents */}
                <SectionHeader icon={<FileText size={18} />} title="Credential Matrix" />
                <div className="space-y-4 p-6 bg-slate-800/40 rounded-[2rem] border border-white/5">
                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-500" />
                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Supporting Documents</h5>
                        </div>
                        <button type="button" onClick={() => documentFileInputRef.current?.click()} className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                            <Upload size={14} />
                            Inject File
                        </button>
                        <input type="file" ref={documentFileInputRef} multiple onChange={handleDocumentFileChange} className="hidden" />
                    </div>
                    <div className="space-y-3">
                        {formData.documents.length > 0 ? formData.documents.map((doc, index) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <FileText size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{doc.name}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${doc.status === 'Verified' ? 'text-emerald-500' : doc.status === 'Rejected' ? 'text-rose-500' : 'text-amber-500'}`}>
                                    {doc.status}
                                </span>
                            </div>
                        )) : (
                            <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No credential assets detected</p>
                            </div>
                        )}
                    </div>
                </div>

            </form>

            <div className="p-8 bg-slate-900 border-t border-white/5 flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Abort Process</button>
                <button 
                  type="submit" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 uppercase text-[10px] tracking-widest flex items-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Authorize Profile
                </button>
            </div>
        </div>
      </div>
      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} onCapture={handlePhotoCapture} />}
    </>
  );
};

export default AgroProfessionalFormModal;