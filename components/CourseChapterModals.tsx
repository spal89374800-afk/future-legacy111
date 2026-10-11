import React, { useState } from 'react';
import { Video, FileText, CheckSquare, Plus, X, Upload, ListPlus, Film } from 'lucide-react';
import type { ChapterLecture, ChapterPdfNote, ChapterAssignment } from '../types/courseContent.ts';

interface AddVideoModalProps {
  chapterTitle: string;
  onClose: () => void;
  onAddSingle: (lecture: ChapterLecture) => void;
  onAddBulk: (lectures: ChapterLecture[]) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  chapterTitle,
  onClose,
  onAddSingle,
  onAddBulk
}) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  
  // Single mode state
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('45 Mins');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  // Bulk mode state
  const [bulkText, setBulkText] = useState(
    'Lecture 1: Core Fundamentals & Overview | 40 Mins\nLecture 2: Derivations & Theorems | 50 Mins\nLecture 3: Advanced Numerical Problems | 45 Mins'
  );

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleBulkFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const generated: ChapterLecture[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      generated.push({
        id: `lec-${Date.now()}-${i}`,
        title: f.name.replace(/\.[^/.]+$/, ''),
        duration: '45 Mins',
        videoUrl: URL.createObjectURL(f),
        fileName: f.name,
        description: `Uploaded video lecture file: ${f.name}`
      });
    }
    onAddBulk(generated);
    onClose();
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddSingle({
      id: `lec-${Date.now()}`,
      title: title.trim(),
      duration: duration.trim() || '45 Mins',
      videoUrl: videoUrl.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4',
      fileName: fileName || undefined,
      description: description.trim() || undefined
    });
    onClose();
  };

  const handleSubmitBulkText = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const lectures: ChapterLecture[] = lines.map((line, idx) => {
      const parts = line.split('|');
      const lecTitle = parts[0]?.trim() || `Lecture ${idx + 1}`;
      const lecDur = parts[1]?.trim() || '45 Mins';
      const lecUrl = parts[2]?.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4';
      return {
        id: `lec-${Date.now()}-${idx}`,
        title: lecTitle,
        duration: lecDur,
        videoUrl: lecUrl,
        description: `Lecture module for ${chapterTitle}`
      };
    });
    onAddBulk(lectures);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Video size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Add Video Lectures</h3>
              <p className="text-xs text-slate-400">{chapterTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              mode === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film size={14} />
            <span>Single Video (Ek Ek Karke)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('bulk')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
              mode === 'bulk' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListPlus size={14} />
            <span>⚡ Bulk Upload (Ek Saath Saare)</span>
          </button>
        </div>

        {mode === 'single' ? (
          <form onSubmit={handleSubmitSingle} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Lecture Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Lecture 1: Motion in a Straight Line"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 45 Mins"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Video File (MP4/WebM)</label>
                <label className="flex items-center gap-2 bg-slate-950 border border-dashed border-white/20 rounded-xl px-3 py-2 text-xs text-slate-300 cursor-pointer hover:border-blue-500">
                  <Upload size={14} className="text-blue-400" />
                  <span className="truncate">{fileName || 'Choose File...'}</span>
                  <input type="file" accept="video/*" onChange={handleSingleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Or Direct Video URL (Optional)</label>
              <input
                type="text"
                placeholder="https://... (mp4, webm, youtube embed)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Short Description (Optional)</label>
              <textarea
                rows={2}
                placeholder="Topics covered in this video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg">
                Add Video Lecture
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitBulkText} className="space-y-4">
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 text-xs space-y-2">
              <p className="font-bold text-indigo-300">⚡ Method 1: Upload Multiple Video Files at Once</p>
              <label className="flex items-center justify-center gap-2 bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-400/40 py-2.5 px-4 rounded-xl cursor-pointer text-white font-bold transition-all">
                <Upload size={16} />
                <span>Select Multiple Video Files from Computer</span>
                <input type="file" accept="video/*" multiple onChange={handleBulkFilesChange} className="hidden" />
              </label>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-300 uppercase mb-1">⚡ Method 2: Paste List of All Videos (Title | Duration)</p>
              <textarea
                rows={5}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Lecture 1: Introduction | 35 Mins&#10;Lecture 2: Core Concepts | 45 Mins&#10;Lecture 3: Formula Sheet & PYQ | 60 Mins"
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">One video per line format: Title | Duration (e.g. 45 Mins)</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg">
                Add All Videos to Chapter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface AddPdfModalProps {
  chapterTitle: string;
  onClose: () => void;
  onAddPdf: (pdf: ChapterPdfNote) => void;
}

export const AddPdfModal: React.FC<AddPdfModalProps> = ({ chapterTitle, onClose, onAddPdf }) => {
  const [title, setTitle] = useState('');
  const [fileSize, setFileSize] = useState('2.5 MB');
  const [fileName, setFileName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddPdf({
      id: `pdf-${Date.now()}`,
      title: title.trim(),
      fileSize: fileSize.trim() || '2.4 MB',
      fileName: fileName || `${title.trim()}.pdf`,
      pdfUrl: pdfUrl || '#',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Upload Chapter Notes (PDF)</h3>
              <p className="text-xs text-slate-400">{chapterTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Notes / PDF Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Complete Lecture Notes & Formula Handout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Select PDF File</label>
            <label className="flex items-center gap-2 bg-slate-950 border border-dashed border-white/20 rounded-xl px-4 py-3 text-xs text-slate-300 cursor-pointer hover:border-purple-500">
              <Upload size={16} className="text-purple-400" />
              <span className="truncate">{fileName || 'Choose PDF / Document file...'}</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">File Size Tag</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Online Link (Optional)</label>
              <input
                type="text"
                placeholder="https://drive.google.com/..."
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg">
              Upload PDF Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddAssignmentModalProps {
  chapterTitle: string;
  onClose: () => void;
  onAddAssignment: (assignment: ChapterAssignment) => void;
}

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ chapterTitle, onClose, onAddAssignment }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('7 Days from Enrollment');
  const [totalMarks, setTotalMarks] = useState(50);
  const [fileName, setFileName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPdfUrl(URL.createObjectURL(file));
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddAssignment({
      id: `assign-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Solve all subjective and objective problems. Submit solution in PDF format.',
      dueDate: dueDate.trim() || '7 Days',
      totalMarks: Number(totalMarks) || 50,
      fileName: fileName || `${title.trim()}-QuestionSheet.pdf`,
      pdfUrl: pdfUrl || '#'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <CheckSquare size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Create Chapter Assignment</h3>
              <p className="text-xs text-slate-400">{chapterTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Assignment Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Assignment 1: Kinematics Practice Sheet (25 Questions)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Total Marks</label>
              <input
                type="number"
                min="5"
                max="500"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Submission Deadline</label>
              <input
                type="text"
                placeholder="e.g. 7 Days or 2026-10-15"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Instructions & Problem Description</label>
            <textarea
              rows={3}
              placeholder="Solve all numericals step-by-step. Show all intermediate formulas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Attach Question Paper / PDF (Optional)</label>
            <label className="flex items-center gap-2 bg-slate-950 border border-dashed border-white/20 rounded-xl px-4 py-3 text-xs text-slate-300 cursor-pointer hover:border-amber-500">
              <Upload size={16} className="text-amber-400" />
              <span className="truncate">{fileName || 'Upload Question Sheet PDF...'}</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg">
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
