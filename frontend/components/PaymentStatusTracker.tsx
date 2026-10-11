import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Clock, AlertCircle, RefreshCw, ShieldCheck, CreditCard, QrCode } from 'lucide-react';
import { TransactionRecord } from './TransactionHistory.tsx';

interface PaymentStatusTrackerProps {
  userId: string;
}

export const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({ userId }) => {
  const [pendingTransactions, setPendingTransactions] = useState<TransactionRecord[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const loadTransactions = () => {
    try {
      const storageKey = `future_legacy_transactions_${userId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: TransactionRecord[] = JSON.parse(saved);
        const pending = parsed.filter(t => t.status === 'PENDING');
        setPendingTransactions(pending);
        
        // Initialize progress for any new pending transactions
        const newProgress = { ...progressMap };
        pending.forEach(p => {
          if (newProgress[p.id] === undefined) {
            newProgress[p.id] = 35; // Start at 35%
          }
        });
        setProgressMap(newProgress);
      }
    } catch (err) {
      console.warn('Failed to load pending transactions for tracking:', err);
    }
  };

  useEffect(() => {
    loadTransactions();
    const interval = setInterval(() => {
      loadTransactions();
      // Simulate progress increment for pending transactions
      setProgressMap(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (updated[id] < 90) {
            updated[id] = Math.min(90, updated[id] + 15);
          }
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleSimulateCompletion = (id: string) => {
    try {
      const storageKey = `future_legacy_transactions_${userId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: TransactionRecord[] = JSON.parse(saved);
        const updated = parsed.map(t => t.id === id ? { ...t, status: 'SUCCESS' as const } : t);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        loadTransactions();
      }
    } catch (err) {
      console.error('Failed to complete transaction:', err);
    }
  };

  if (pendingTransactions.length === 0) {
    return (
      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 shadow-xl flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Live Payment Queue</h5>
            <p className="text-[10px] text-slate-500">No pending UPI or Credit Card transactions currently awaiting verification.</p>
          </div>
        </div>
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">All Cleared</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-amber-500/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 animate-pulse">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight font-montserrat">Live Transaction Status Tracker</h4>
            <p className="text-[10px] text-amber-400 font-medium">Real-time gateway handshake & verification progress for UPI / Cards</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-wider">
          {pendingTransactions.length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {pendingTransactions.map(txn => {
          const currentProgress = progressMap[txn.id] || 40;
          return (
            <div key={txn.id} className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center">
                    {txn.gateway?.includes('UPI') ? <QrCode size={18} /> : <CreditCard size={18} />}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">{txn.courseName}</h5>
                    <p className="text-[10px] font-mono text-slate-500">Ref: {txn.id} • {txn.gateway}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-white font-mono">₹{txn.amount.toLocaleString('en-IN')}</span>
                  <button 
                    onClick={() => handleSimulateCompletion(txn.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Simulate Success
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Loader2 size={12} className="animate-spin" />
                    Awaiting Bank Confirmation ({currentProgress}%)
                  </span>
                  <span>Secure Gateway Handshake</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
