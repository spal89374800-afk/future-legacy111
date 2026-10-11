

import React, { useState } from 'react';
import type { AgroClass } from '../types.ts';
import PaymentModal from './PaymentModal.tsx';
import { X, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

// Removed unused declare global for renderMathInElement and katex

interface AgroEnrollmentModalProps {
  agroClass: AgroClass;
  onClose: () => void;
  onConfirm: (classId: number) => void;
}

const AgroEnrollmentModal: React.FC<AgroEnrollmentModalProps> = ({ agroClass, onClose, onConfirm }) => {
  const pricingTiers = [
    { duration: 1, price: 499, label: 'Standard Module' },
    { duration: 6, price: 1999, label: 'Semester Pass' },
    { duration: 0, price: 4999, label: 'Lifetime Protocol' }
  ];

  const [selectedTier, setSelectedTier] = useState<any>(pricingTiers[0]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleProceedToPayment = () => {
    if (selectedTier) {
        if (selectedTier.price > 0) {
            setIsPaymentModalOpen(true);
        } else {
            handlePaymentSuccess();
        }
    }
  };

  const handlePaymentSuccess = () => {
    onConfirm(agroClass.id);
    setIsPaymentModalOpen(false);
    onClose();
  };
  
  const itemName = `${agroClass.title} (${selectedTier?.duration === 0 ? 'Lifetime' : `${selectedTier?.duration} Month`} Access)`;

  return (
    <>
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden relative">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Access Protocol</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Enrollment Authorization</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={20} /></button>
        </header>
        
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-800/30 border border-white/5 rounded-2xl">
                <img src={agroClass.imageUrl} className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10" />
                <div>
                   <h4 className="font-bold text-white text-sm leading-tight">{agroClass.title}</h4>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Mentor: {agroClass.instructor}</p>
                </div>
            </div>

            <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subscription Matrix</p>
                 {pricingTiers.map((tier) => (
                    <button 
                        key={tier.duration} 
                        onClick={() => setSelectedTier(tier)} 
                        className={`w-full flex items-center justify-between p-5 border-2 rounded-2xl transition-all ${selectedTier?.duration === tier.duration ? 'border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-900/10' : 'border-white/5 bg-slate-800/20 hover:border-white/10'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTier?.duration === tier.duration ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                               <Calendar size={18} />
                            </div>
                            <div className="text-left">
                                <span className="block font-black text-white text-[10px] uppercase tracking-widest mb-1">{tier.label}</span>
                                <span className="text-xs font-bold text-slate-400">{tier.duration === 0 ? 'Unlimited Access' : `${tier.duration} Month Duration`}</span>
                            </div>
                        </div>
                        <span className="font-black text-blue-400">₹{tier.price}</span>
                    </button>
                ))}
            </div>
        </div>

        <footer className="p-8 bg-slate-900/50 border-t border-white/5">
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedTier}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <ShieldCheck size={20} />
              {selectedTier ? `Initialize Payment (₹${selectedTier.price})` : 'Select Tier'}
            </button>
        </footer>
      </div>
    </div>
    {isPaymentModalOpen && selectedTier && (
        <PaymentModal 
            itemName={itemName}
            amount={selectedTier.price}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
        />
    )}
    </>
  );
};

export default AgroEnrollmentModal;