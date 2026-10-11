

import React, { useState } from 'react';
import type { AgroProfessional } from '../types.ts';
import PaymentModal from './PaymentModal.tsx';
import { X, Calendar, Clock, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

// Removed unused declare global for renderMathInElement and katex

interface AgroBookingModalProps {
  professional: AgroProfessional;
  onClose: () => void;
  onConfirm: () => void;
}

const AgroBookingModal: React.FC<AgroBookingModalProps> = ({ professional, onClose, onConfirm }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'
  ];

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    onConfirm();
    onClose();
  };
  
  const price = professional.fees_individual;
  const itemName = `Expert Sync: ${professional.name}`;

  return (
    <>
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Consultation Hub</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Direct Node Uplink</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
              <X size={20} />
            </button>
        </header>

        <div className="p-10 space-y-10">
            <div className="flex items-center gap-5 p-6 bg-slate-800/30 border border-white/5 rounded-[2rem] shadow-inner">
                <div className="relative">
                   <img src={professional.imageUrl} className="w-16 h-16 rounded-[1.25rem] object-cover ring-2 ring-emerald-500/30" alt={professional.name} />
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900"></div>
                </div>
                <div className="min-w-0">
                   <h4 className="font-black text-white text-base truncate uppercase tracking-tight">{professional.name}</h4>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">{professional.specialization}</p>
                </div>
            </div>

            <div className="space-y-5">
                <div className="flex items-center justify-between px-2">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-blue-400" /> Synchronization Window
                   </p>
                   <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{professional.availability.days}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {timeSlots.map(time => (
                      <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-4 px-2 rounded-xl text-[10px] font-black border transition-all ${selectedTime === time ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-900/20' : 'bg-slate-800/50 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'}`}
                      >
                         {time}
                      </button>
                   ))}
                </div>
            </div>

            <div className="flex items-center justify-between p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 shadow-inner ring-1 ring-white/5">
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Access Protocol Fee</p>
                   <p className="text-3xl font-black text-white">₹{price}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Temporal Duration</p>
                   <p className="text-xs font-black text-slate-300 uppercase tracking-widest">45 Min Neural Link</p>
                </div>
            </div>
        </div>

        <footer className="p-8 bg-slate-900 border-t border-white/5">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={!selectedTime}
              className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 active:scale-95 transition-all shadow-xl shadow-emerald-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
            >
              {selectedTime ? <Zap size={20} className="group-hover:animate-pulse" /> : <ShieldCheck size={20} />}
              {selectedTime ? `Authorize Payment Link` : 'Select Sync Node'}
            </button>
            <p className="text-[8px] font-black text-slate-700 uppercase text-center mt-6 tracking-[0.4em]">E2E Encrypted Consultation</p>
        </footer>
      </div>
    </div>
    {isPaymentModalOpen && (
        <PaymentModal 
            itemName={itemName}
            amount={price}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
        />
    )}
    </>
  );
};

export default AgroBookingModal;