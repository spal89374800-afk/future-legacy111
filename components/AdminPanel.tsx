
import React from 'react';
import type { AgroProfessional } from '../types.ts';
import { ShieldCheck, UserCheck, XCircle } from 'lucide-react';
import { AdminFinancialDashboard } from './AdminFinancialDashboard.tsx';

declare global {
  interface Window {
    // renderMathInElement and katex are no longer used
  }
}

interface AdminPanelProps {
  professionals: AgroProfessional[];
  onVerify: (profId: number, docId: number, status: 'Verified' | 'Rejected') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ professionals, onVerify }) => {
  const pendingProfessionals = professionals.filter(prof =>
    prof.documents.some(doc => doc.status === 'Pending')
  );

  return (
    <div className="space-y-8">
      {/* Financial Analytics Dashboard with Recharts */}
      <AdminFinancialDashboard />

      {/* Verification Hub */}
      {pendingProfessionals.length === 0 ? (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 text-center animate-in fade-in">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mx-auto mb-4">
               <ShieldCheck size={24} />
            </div>
            <h2 className="text-lg font-black text-emerald-400 uppercase tracking-widest mb-1">Admin Verification Hub</h2>
            <p className="text-slate-500 text-xs font-medium">All professional documents are currently in sync. No pending verifications detected.</p>
        </div>
      ) : (
        <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-8 animate-in slide-in-from-top-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
               <ShieldCheck size={28} />
            </div>
            <div>
               <h2 className="text-xl font-black text-white tracking-tight uppercase">Verification Protocol</h2>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Administrator Control Panel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingProfessionals.map(prof => (
              <div key={prof.id} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-5 mb-6">
                  <img src={prof.imageUrl} alt={prof.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10" />
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{prof.name}</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{prof.qualifications}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Pending Credentials</p>
                  {prof.documents
                    .filter(doc => doc.status === 'Pending')
                    .map(doc => (
                      <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-white/5 group/doc hover:bg-slate-800 transition-all">
                        <span className="text-xs font-medium text-slate-300 truncate max-w-[150px]">{doc.name}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onVerify(prof.id, doc.id, 'Verified')} 
                            className="px-3 py-1.5 bg-emerald-600/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5"
                          >
                             <UserCheck size={12} />
                             Approve
                          </button>
                          <button 
                            onClick={() => onVerify(prof.id, doc.id, 'Rejected')} 
                            className="px-3 py-1.5 bg-rose-600/10 text-rose-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5"
                          >
                             <XCircle size={12} />
                             Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;