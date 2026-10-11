import React, { useState } from 'react';
import type { AgroClass, AgroProfessional, AgriBotAnalysis, User } from '../types.ts';
import AgriBotAIPage from './AgriBotAIPage.tsx';
import { 
  Sprout, Bot, Users, Video, ShieldCheck, 
  ArrowRight, Play, Zap
} from 'lucide-react';
import AgroBookingModal from './AgroBookingModal.tsx';
import AgroEnrollmentModal from './AgroEnrollmentModal.tsx';

interface AgroFuturePageProps {
  agroClasses: AgroClass[];
  agroProfessionals: AgroProfessional[];
  userRole: string;
  currentUser: User;
  onGetAgriBotAnalysis: (media: any, question: string, location: string, language: string) => void;
  agriBotAnalysis: AgriBotAnalysis | null;
  isAgriBotLoading: boolean;
  onGenerateAgriBotVideo: (findings: string, language: string) => void;
}

const AgroFuturePage: React.FC<AgroFuturePageProps> = ({
  agroClasses,
  agroProfessionals,
  userRole,
  currentUser,
  onGetAgriBotAnalysis,
  agriBotAnalysis,
  isAgriBotLoading,
  onGenerateAgriBotVideo
}) => {
  const [activeTab, setActiveTab] = useState<'bot' | 'experts' | 'classes'>('bot');
  const [selectedExpert, setSelectedExpert] = useState<AgroProfessional | null>(null);
  const [selectedClass, setSelectedClass] = useState<AgroClass | null>(null);
  
  const tabs = [
    { id: 'bot', label: 'AgriBot Intelligence', icon: <Bot size={18}/> },
    { id: 'experts', label: 'Expert Uplinks', icon: <Users size={18}/> },
    { id: 'classes', label: 'Agro Masterclasses', icon: <Video size={18}/> }
  ];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="space-y-8 border-b border-white/5 pb-12">
        <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <Sprout size={12} />
                Precision Agro-Node
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase font-montserrat leading-none">Agro Future</h2>
        </div>

        <div className="flex flex-wrap gap-4">
            {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-10 py-5 rounded-[2rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab.id ? 'bg-white text-black border-white shadow-2xl' : 'bg-[#0c0c0e] text-zinc-500 border-white/5 hover:border-emerald-500/20'}`}
            >
                {tab.icon}
                {tab.label}
            </button>
            ))}
        </div>
      </header>

      <main>
        {activeTab === 'bot' && (
          <AgriBotAIPage
            onGetAgriBotAnalysis={onGetAgriBotAnalysis}
            agriBotAnalysis={agriBotAnalysis}
            isAgriBotLoading={isAgriBotLoading}
            onGenerateAgriBotVideo={onGenerateAgriBotVideo}
          />
        )}

        {activeTab === 'experts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-6 duration-500">
            {agroProfessionals.map(prof => (
              <div key={prof.id} className="bg-[#0c0c0e] border border-white/5 rounded-[3.5rem] overflow-hidden group hover:border-emerald-500/40 transition-all shadow-2xl flex flex-col">
                <div className="aspect-[4/3] overflow-hidden relative">
                   <img src={prof.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute top-8 left-8">
                      <div className="px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-400" />
                         Verified Expert
                      </div>
                   </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                   <h4 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors leading-tight mb-2 uppercase font-montserrat">{prof.name}</h4>
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">{prof.specialization}</p>
                   <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-10 flex-1 line-clamp-3 italic">"{prof.bio}"</p>
                   <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Authorization Fee</p>
                         <p className="text-2xl font-black text-white">₹{prof.fees_individual}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedExpert(prof)}
                        className="px-8 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                      >
                        Initialize Sync
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-6 duration-500">
             {agroClasses.map(cls => (
               <div key={cls.id} className="bg-[#0c0c0e] border border-white/5 rounded-[3.5rem] overflow-hidden group shadow-2xl flex flex-col">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={cls.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] to-transparent opacity-80" />
                    <div className="absolute bottom-8 left-8">
                       <span className="px-4 py-1.5 bg-emerald-600/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/30">Masterclass Protocol</span>
                    </div>
                  </div>
                  <div className="p-10 space-y-6 flex-1 flex flex-col">
                    <h4 className="text-2xl font-black text-white leading-tight uppercase font-montserrat tracking-tighter">{cls.title}</h4>
                    <p className="text-xs text-zinc-500 font-medium">Directed by <span className="text-zinc-200">{cls.instructor}</span></p>
                    <div className="flex items-center gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest flex-1">
                       <div className="flex items-center gap-2"><Users size={16} /> {cls.studentsEnrolled} Assets Enrolled</div>
                    </div>
                    <button 
                        onClick={() => setSelectedClass(cls)}
                        className="w-full py-5 bg-zinc-800 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all uppercase text-[10px] tracking-widest mt-6 shadow-xl"
                    >
                        Begin Enrollment
                    </button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </main>

      {selectedExpert && (
        <AgroBookingModal 
            professional={selectedExpert} 
            onClose={() => setSelectedExpert(null)} 
            onConfirm={() => {}} 
        />
      )}

      {selectedClass && (
        <AgroEnrollmentModal 
            agroClass={selectedClass} 
            onClose={() => setSelectedClass(null)} 
            onConfirm={() => {}} 
        />
      )}
    </div>
  );
};

export default AgroFuturePage;