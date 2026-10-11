import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Eye, Download, Users, Bell, FileSpreadsheet, 
  BarChart2, CheckCircle2, AlertTriangle, Clock, ThumbsUp, ArrowLeft 
} from 'lucide-react';
import type { StudyMaterialItem } from '../../types.ts';

interface TeacherMaterialDashboardModalProps {
  material: StudyMaterialItem;
  allStudents?: { id: string; name: string; roll?: string; batch?: string }[];
  onClose: () => void;
}

export const TeacherMaterialDashboardModal: React.FC<TeacherMaterialDashboardModalProps> = ({
  material,
  allStudents = [
    { id: 's1', name: 'Shourya Patel', roll: '1201', batch: 'Class 12th - Target NEET 2026' },
    { id: 's2', name: 'Aarav Sharma', roll: '1202', batch: 'Class 12th - Target NEET 2026' },
    { id: 's3', name: 'Priya Joshi', roll: '1203', batch: 'Class 12th - JEE Advanced Super 30' },
    { id: 's4', name: 'Rohan Mehra', roll: '1204', batch: 'Class 12th - JEE Advanced Super 30' },
    { id: 's5', name: 'Ananya Verma', roll: '1205', batch: 'Class 11th - Foundation Batch' },
    { id: 's6', name: 'Vikram Singh', roll: '1206', batch: 'Class 10th - Board Mastery' }
  ],
  onClose
}) => {
  // Mock viewing data
  const viewedStudentIds = ['s1', 's2', 's3'];
  const viewedStudents = allStudents.filter(s => viewedStudentIds.includes(s.id));
  const unopenedStudents = allStudents.filter(s => !viewedStudentIds.includes(s.id));

  const viewRate = Math.round((viewedStudents.length / allStudents.length) * 100);

  const handleSendReminder = () => {
    alert(`🔔 Push notification reminder sent to ${unopenedStudents.length} students who have not yet read "${material.title}"!`);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Student Name,Roll,Batch,Status,Time Spent,Downloaded\n';
    const csvRows = allStudents.map(s => {
      const isViewed = viewedStudentIds.includes(s.id);
      return `"${s.name}","${s.roll || ''}","${s.batch || ''}","${isViewed ? 'VIEWED' : 'UNOPENED'}","${isViewed ? '18 mins' : '0 mins'}","${isViewed ? 'YES' : 'NO'}"`;
    }).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Analytics_${material.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] !m-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-white/15 rounded-3xl sm:rounded-[2.5rem] w-full max-w-4xl h-full max-h-[92vh] sm:max-h-[88vh] shadow-2xl flex flex-col overflow-hidden shrink-0">
        
        {/* Header */}
        <header className="p-5 sm:p-6 border-b border-white/10 bg-slate-950 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BarChart2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Material Analytics & Engagement Dashboard
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-montserrat truncate mt-1">
                {material.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/10 cursor-pointer active:scale-95 transition-all"
              title="Back"
            >
              <ArrowLeft size={14} className="text-emerald-400" />
              <span>Back</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow cursor-pointer"
            >
              <FileSpreadsheet size={15} />
              <span>Export CSV</span>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Analytics Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Total Views</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">{material.viewsCount + 142}</p>
              <p className="text-[10px] text-slate-500">Across enrolled batches</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Open / Read Rate</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{viewRate}%</p>
              <p className="text-[10px] text-slate-500">{viewedStudents.length} of {allStudents.length} students</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Offline Downloads</p>
              <p className="text-2xl font-black text-purple-400 font-mono">{material.downloadsCount + 89}</p>
              <p className="text-[10px] text-slate-500">Saved for revision</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Helpful Rating</p>
              <p className="text-2xl font-black text-amber-400 font-mono">98%</p>
              <p className="text-[10px] text-slate-500">{material.helpfulVotes + 42} Upvotes</p>
            </div>
          </div>

          {/* Unopened Students & Reminder Banner */}
          {unopenedStudents.length > 0 && (
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                <span className="text-xs text-amber-200">
                  <strong>{unopenedStudents.length} students</strong> haven't opened this study material yet.
                </span>
              </div>

              <button
                onClick={handleSendReminder}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                <Bell size={13} />
                <span>Send Push Reminder</span>
              </button>
            </div>
          )}

          {/* Student-by-Student View List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
              Student Engagement Log
            </h4>

            <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Avg Reading Time</th>
                    <th className="p-3">Offline Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allStudents.map(student => {
                    const isViewed = viewedStudentIds.includes(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {student.name} {student.roll && <span className="text-[10px] text-slate-500">(Roll: {student.roll})</span>}
                        </td>
                        <td className="p-3 text-slate-400">{student.batch}</td>
                        <td className="p-3">
                          {isViewed ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1 w-max">
                              <CheckCircle2 size={11} /> Viewed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 w-max block">
                              ● Unopened
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-300 font-mono">
                          {isViewed ? '18 mins' : '-'}
                        </td>
                        <td className="p-3 text-slate-400">
                          {isViewed ? 'Downloaded ✓' : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
