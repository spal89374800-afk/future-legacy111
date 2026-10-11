import React, { useState } from 'react';
import { Video, FileText, CheckSquare, X, ArrowRight } from 'lucide-react';
import type { Course } from './CompleteCoursesPage.tsx';
import type { CourseChapter } from '../types/courseContent.ts';

interface QuickUploadTargetModalProps {
  uploadType: 'video' | 'pdf' | 'assignment';
  courses: Course[];
  onClose: () => void;
  onSelectTarget: (course: Course, chapter: CourseChapter) => void;
}

export const QuickUploadTargetModal: React.FC<QuickUploadTargetModalProps> = ({
  uploadType,
  courses,
  onClose,
  onSelectTarget
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const chapters = selectedCourse?.chapters || [];
  const [selectedChapterId, setSelectedChapterId] = useState(chapters[0]?.id || '');

  const currentChapter = chapters.find(ch => ch.id === selectedChapterId) || chapters[0];

  const getTitle = () => {
    if (uploadType === 'video') return 'Upload Video Lecture';
    if (uploadType === 'pdf') return 'Upload Chapter Notes (PDF)';
    return 'Create Chapter Assignment';
  };

  const getIcon = () => {
    if (uploadType === 'video') return <Video size={20} className="text-blue-400" />;
    if (uploadType === 'pdf') return <FileText size={20} className="text-purple-400" />;
    return <CheckSquare size={20} className="text-amber-400" />;
  };

  const handleContinue = () => {
    if (!selectedCourse || !currentChapter) {
      alert('Please select a course and chapter.');
      return;
    }
    onSelectTarget(selectedCourse, currentChapter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{getTitle()}</h3>
              <p className="text-xs text-slate-400">Step 1: Choose target course & chapter</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                const cId = e.target.value;
                setSelectedCourseId(cId);
                const targetC = courses.find(c => c.id === cId);
                if (targetC?.chapters?.[0]) {
                  setSelectedChapterId(targetC.chapters[0].id);
                }
              }}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">Select Chapter</label>
            {chapters.length === 0 ? (
              <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                No chapters found in this course yet. Please open the course to add Chapter 1 first.
              </p>
            ) : (
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {chapters.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!currentChapter}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Upload Content</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
