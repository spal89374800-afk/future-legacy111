import React from 'react';
import { 
  X, Download, Award, Users, CheckCircle2, 
  Clock, AlertTriangle, FileSpreadsheet, BarChart2 
} from 'lucide-react';
import type { AssignmentItem, AssignmentSubmission } from '../../types.ts';

interface AssignmentReportModalProps {
  assignment: AssignmentItem;
  submissions: AssignmentSubmission[];
  allStudents?: { id: string; name: string; roll?: string; batch?: string }[];
  onClose: () => void;
}

export const AssignmentReportModal: React.FC<AssignmentReportModalProps> = ({
  assignment,
  submissions,
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
  const totalTargeted = allStudents.length;
  const submittedCount = submissions.filter(s => s.status === 'submitted' || s.status === 'checked' || s.status === 'notebook_done').length;
  const checkedCount = submissions.filter(s => s.status === 'checked').length;
  const submissionRate = totalTargeted > 0 ? Math.round((submittedCount / totalTargeted) * 100) : 0;

  const checkedMarks = submissions
    .filter(s => s.status === 'checked' && s.marks !== undefined)
    .map(s => s.marks as number);

  const avgMarks = checkedMarks.length > 0 
    ? (checkedMarks.reduce((a, b) => a + b, 0) / checkedMarks.length).toFixed(1) 
    : '0';

  const highestMarks = checkedMarks.length > 0 ? Math.max(...checkedMarks) : 0;
  const lowestMarks = checkedMarks.length > 0 ? Math.min(...checkedMarks) : 0;

  // Export CSV
  const handleExportCSV = () => {
    const csvHeader = 'Student Name,Roll,Batch,Status,Marks Obtained,Total Marks,Submitted At,Feedback\n';
    const csvRows = allStudents.map(student => {
      const sub = submissions.find(s => s.studentId === student.id);
      return `"${student.name}","${student.roll || ''}","${student.batch || ''}","${sub?.status || 'NOT_SUBMITTED'}","${sub?.marks ?? ''}","${assignment.totalMarks}","${sub?.submittedAt || ''}","${(sub?.feedbackText || '').replace(/"/g, '""')}"`;
    }).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${assignment.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-[2.5rem] w-full max-w-4xl my-6 shadow-2xl flex flex-col overflow-hidden max-h-[90vh] text-slate-100">
        
        {/* Header */}
        <header className="p-6 border-b border-white/10 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BarChart2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Academic Performance Analytics
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-montserrat mt-1">
                {assignment.title} — Analytics Report
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
            >
              <FileSpreadsheet size={15} />
              <span>Export CSV / Excel</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Analytics Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Submission Rate</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{submissionRate}%</p>
              <p className="text-[10px] text-slate-500">{submittedCount} of {totalTargeted} students</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Average Marks</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">{avgMarks}</p>
              <p className="text-[10px] text-slate-500">Out of {assignment.totalMarks}</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Highest Score</p>
              <p className="text-2xl font-black text-purple-400 font-mono">{highestMarks}</p>
              <p className="text-[10px] text-slate-500">Top Performer</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Checked / Graded</p>
              <p className="text-2xl font-black text-amber-400 font-mono">{checkedCount}</p>
              <p className="text-[10px] text-slate-500">{submittedCount - checkedCount} pending evaluation</p>
            </div>
          </div>

          {/* Students Performance Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
              Student-by-Student Marks & Status Breakdown
            </h4>

            <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Evaluation Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allStudents.map(student => {
                    const sub = submissions.find(s => s.studentId === student.id);
                    return (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {student.name} {student.roll && <span className="text-[10px] text-slate-500">(Roll: {student.roll})</span>}
                        </td>
                        <td className="p-3 text-slate-400">{student.batch}</td>
                        <td className="p-3">
                          {sub?.status === 'checked' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              ✓ Checked
                            </span>
                          ) : sub?.status === 'notebook_done' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                              Notebook Done
                            </span>
                          ) : sub ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                              Submitted
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">
                              ● Pending / Missing
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          {sub?.marks !== undefined ? `${sub.marks} / ${assignment.totalMarks}` : '-'}
                        </td>
                        <td className="p-3 text-slate-400 truncate max-w-xs">
                          {sub?.feedbackText || '-'}
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
    </div>
  );
};
