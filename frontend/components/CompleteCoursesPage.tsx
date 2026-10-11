import React, { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, Trophy, CheckCircle2, Play, FileText, Award, 
  Star, Clock, Users, ShieldCheck, Check, Search, Filter, Plus, Upload, 
  Video, DollarSign, X, Trash2, Edit3, Paperclip, Calendar, CheckSquare, 
  PlusCircle, AlertCircle, Sparkles, Layers, ListPlus, Film
} from 'lucide-react';
import { User } from '../types.ts';
import { ContentSecurityWall } from './ContentSecurityWall.tsx';
import PaymentModal from './PaymentModal.tsx';
import type { CourseChapter, ChapterLecture, ChapterPdfNote, ChapterAssignment } from '../types/courseContent.ts';
import { AddVideoModal, AddPdfModal, AddAssignmentModal } from './CourseChapterModals.tsx';
import { createDefaultChapters } from '../services/courseDefaults.ts';

export interface Course {
  id: string;
  title: string;
  category: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  teacherId?: string;
  rating: number;
  studentsCount: number;
  lessonsCount: number;
  testsCount: number;
  assignmentsCount: number;
  description: string;
  image: string;
  price: string;
  chapters?: CourseChapter[];
}

const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Complete NEET/JEE Physics Masterclass 2026',
    category: 'Entrance Exams',
    subject: 'Physics',
    difficulty: 'Advanced',
    instructor: 'Dr. R. K. Sharma & AI Team',
    rating: 4.9,
    studentsCount: 14250,
    lessonsCount: 8,
    testsCount: 25,
    assignmentsCount: 3,
    description: 'Master mechanics, electrodynamics, optics, and modern physics with recorded video lectures, full-length tests, and graded assignments.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    price: 'Free Enrolment',
    chapters: createDefaultChapters('Physics')
  },
  {
    id: 'course-2',
    title: 'Advanced Organic & Inorganic Chemistry Pro',
    category: 'Chemistry',
    subject: 'Chemistry',
    difficulty: 'Intermediate',
    instructor: 'Prof. Anjali Verma',
    rating: 4.8,
    studentsCount: 11800,
    lessonsCount: 8,
    testsCount: 20,
    assignmentsCount: 3,
    description: 'Comprehensive chemistry course covering reaction mechanisms, periodic trends, coordination compounds, and previous years question papers.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
    price: 'Free Enrolment',
    chapters: createDefaultChapters('Chemistry')
  },
  {
    id: 'course-3',
    title: 'Full-Stack Software Engineering & System Design',
    category: 'Computer Science',
    subject: 'Computer Science',
    difficulty: 'Advanced',
    instructor: 'Vikram Malhotra',
    rating: 4.95,
    studentsCount: 22100,
    lessonsCount: 8,
    testsCount: 30,
    assignmentsCount: 3,
    description: 'Learn React, Node.js, TypeScript, PostgreSQL, system architecture, and scalable microservices from scratch to production.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    price: 'Free Enrolment',
    chapters: createDefaultChapters('Computer Science')
  },
  {
    id: 'course-4',
    title: 'NEET Biology Complete NCERT Mastery',
    category: 'Biology',
    subject: 'Biology',
    difficulty: 'Beginner',
    instructor: 'Dr. Meenakshi Iyer',
    rating: 4.9,
    studentsCount: 19400,
    lessonsCount: 8,
    testsCount: 35,
    assignmentsCount: 3,
    description: 'Line-by-line NCERT botany and zoology coverage with flashcards, diagram analysis, and AI-powered practice quiz modules.',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800&auto=format&fit=crop',
    price: 'Free Enrolment',
    chapters: createDefaultChapters('Biology')
  }
];

interface CompleteCoursesPageProps {
  currentUser?: User;
}

export const CompleteCoursesPage: React.FC<CompleteCoursesPageProps> = ({ currentUser }) => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'tests' | 'assignments'>('overview');
  
  // Selected lecture for two-column video player & download view
  const [selectedLecture, setSelectedLecture] = useState<{ chapterTitle: string; lectureTitle: string; duration: string } | null>(null);

  // Teacher upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [courseForPayment, setCourseForPayment] = useState<Course | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Course Reviews state
  const [reviews, setReviews] = useState<Array<{ id: string; courseId: string; courseTitle: string; userName: string; rating: number; comment: string; date: string }>>([
    { id: '1', courseId: '1', courseTitle: 'Advanced Physics Masterclass (JEE/NEET)', userName: 'Aarav Sharma', rating: 5, comment: 'Incredible lectures and numerical problem solving techniques! Highly recommended.', date: '2026-09-20' },
    { id: '2', courseId: '2', courseTitle: 'Organic Chemistry Reaction Mechanisms', userName: 'Priya Patel', rating: 5, comment: 'The reaction mechanisms chapter tests and assignments helped me score 99 percentile.', date: '2026-09-18' },
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [analyticsTab, setAnalyticsTab] = useState<'metrics' | 'reviews'>('metrics');
  const [newSubject, setNewSubject] = useState('Physics');
  const [courseSubjectsList, setCourseSubjectsList] = useState<string[]>(() => {
    const base = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Entrance Exams'];
    try {
      const saved = localStorage.getItem('future_legacy_custom_subjects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => {
            if (p && !base.includes(p)) base.push(p);
          });
        }
      }
    } catch {}
    return base;
  });
  const [showCustomCourseSubjectInput, setShowCustomCourseSubjectInput] = useState(false);
  const [customCourseSubjectName, setCustomCourseSubjectName] = useState('');

  const handleAddNewCourseSubject = () => {
    const trimmed = customCourseSubjectName.trim();
    if (!trimmed) return;
    if (!courseSubjectsList.includes(trimmed)) {
      const updated = [...courseSubjectsList, trimmed];
      setCourseSubjectsList(updated);
      try {
        localStorage.setItem('future_legacy_custom_subjects', JSON.stringify(updated));
      } catch {}
    }
    setNewSubject(trimmed);
    setCustomCourseSubjectName('');
    setShowCustomCourseSubjectInput(false);
  };
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('₹999 / Full Access');
  const [newLessons, setNewLessons] = useState(25);
  const [newTests, setNewTests] = useState(5);
  const [newAssignments, setNewAssignments] = useState(10);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedInstructor, setSelectedInstructor] = useState('All');

  // Teacher modal targets for dynamic chapter content additions
  const [activeChapterForVideo, setActiveChapterForVideo] = useState<CourseChapter | null>(null);
  const [activeChapterForPdf, setActiveChapterForPdf] = useState<CourseChapter | null>(null);
  const [activeChapterForAssignment, setActiveChapterForAssignment] = useState<CourseChapter | null>(null);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDesc, setNewChapterDesc] = useState('');

  // Tab inside selected course: 'curriculum' | 'notes' | 'assignments' | 'reviews'
  const [courseContentTab, setCourseContentTab] = useState<'curriculum' | 'notes' | 'assignments' | 'reviews'>('curriculum');

  useEffect(() => {
    try {
      const savedEnrolled = localStorage.getItem(`future_legacy_enrolled_${currentUser?.id || 'guest'}`);
      if (savedEnrolled) setEnrolledCourses(JSON.parse(savedEnrolled));

      const savedCourses = localStorage.getItem('future_legacy_all_courses');
      if (savedCourses) {
        const parsed = JSON.parse(savedCourses);
        const hydrated = parsed.map((c: Course) => ({
          ...c,
          chapters: (c.chapters && c.chapters.length > 0) ? c.chapters : createDefaultChapters(c.subject || 'General')
        }));
        setCourses(hydrated);
      } else {
        localStorage.setItem('future_legacy_all_courses', JSON.stringify(DEFAULT_COURSES));
      }

      const savedReviews = localStorage.getItem('future_legacy_course_reviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      }
    } catch (err) {
      console.warn('Failed to load courses from storage:', err);
    }
  }, [currentUser]);

  // Helper to persist course changes
  const persistCourses = (updatedCourses: Course[], updatedSelected?: Course) => {
    setCourses(updatedCourses);
    if (updatedSelected) {
      setSelectedCourse(updatedSelected);
    }
    try {
      localStorage.setItem('future_legacy_all_courses', JSON.stringify(updatedCourses));
    } catch (err) {
      console.error('Failed to save courses:', err);
    }
  };

  // Add Chapter to Selected Course
  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newChapterTitle.trim()) return;
    const newChapter: CourseChapter = {
      id: `ch-${Date.now()}`,
      title: newChapterTitle.trim(),
      description: newChapterDesc.trim() || undefined,
      lectures: [],
      pdfNotes: [],
      assignments: []
    };
    const currentChapters = selectedCourse.chapters || [];
    const updatedChapters = [...currentChapters, newChapter];
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
    setShowAddChapterModal(false);
    setNewChapterTitle('');
    setNewChapterDesc('');
    alert(`Chapter "${newChapter.title}" added successfully! You can now add videos, PDFs, and assignments to it.`);
  };

  // Delete Chapter
  const handleDeleteChapter = (chapterId: string) => {
    if (!selectedCourse || !window.confirm('Are you sure you want to delete this chapter and all its lectures?')) return;
    const updatedChapters = (selectedCourse.chapters || []).filter(ch => ch.id !== chapterId);
    const totalLectures = updatedChapters.reduce((acc, ch) => acc + (ch.lectures?.length || 0), 0);
    const totalAssignments = updatedChapters.reduce((acc, ch) => acc + (ch.assignments?.length || 0), 0);
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters,
      lessonsCount: Math.max(1, totalLectures),
      assignmentsCount: totalAssignments
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
  };

  // Add Single Video to Chapter
  const handleAddSingleVideo = (chapterId: string, lecture: ChapterLecture) => {
    if (!selectedCourse) return;
    const updatedChapters = (selectedCourse.chapters || []).map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lectures: [...(ch.lectures || []), lecture]
        };
      }
      return ch;
    });
    const totalLectures = updatedChapters.reduce((acc, ch) => acc + (ch.lectures?.length || 0), 0);
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters,
      lessonsCount: totalLectures
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
    alert(`Video "${lecture.title}" added to chapter successfully!`);
  };

  // Add Bulk Videos to Chapter (All at once!)
  const handleAddBulkVideos = (chapterId: string, newLectures: ChapterLecture[]) => {
    if (!selectedCourse || newLectures.length === 0) return;
    const updatedChapters = (selectedCourse.chapters || []).map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lectures: [...(ch.lectures || []), ...newLectures]
        };
      }
      return ch;
    });
    const totalLectures = updatedChapters.reduce((acc, ch) => acc + (ch.lectures?.length || 0), 0);
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters,
      lessonsCount: totalLectures
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
    alert(`Success! ${newLectures.length} video lectures added to chapter in bulk.`);
  };

  // Delete Video from Chapter
  const handleDeleteVideo = (chapterId: string, lectureId: string) => {
    if (!selectedCourse || !window.confirm('Delete this video lecture?')) return;
    const updatedChapters = (selectedCourse.chapters || []).map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lectures: (ch.lectures || []).filter(l => l.id !== lectureId)
        };
      }
      return ch;
    });
    const totalLectures = updatedChapters.reduce((acc, ch) => acc + (ch.lectures?.length || 0), 0);
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters,
      lessonsCount: Math.max(1, totalLectures)
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
    if (selectedLecture?.lectureTitle.includes(lectureId)) {
      setSelectedLecture(null);
    }
  };

  // Add PDF Note to Chapter
  const handleAddPdf = (chapterId: string, pdf: ChapterPdfNote) => {
    if (!selectedCourse) return;
    const updatedChapters = (selectedCourse.chapters || []).map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          pdfNotes: [...(ch.pdfNotes || []), pdf]
        };
      }
      return ch;
    });
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
    alert(`PDF note "${pdf.title}" uploaded to chapter successfully!`);
  };

  // Delete PDF Note
  const handleDeletePdf = (chapterId: string, pdfId: string) => {
    if (!selectedCourse || !window.confirm('Delete this PDF note?')) return;
    const updatedChapters = (selectedCourse.chapters || []).map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          pdfNotes: (ch.pdfNotes || []).filter(p => p.id !== pdfId)
        };
      }
      return ch;
    });
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
  };

  // Add Assignment to Chapter
  const handleAddAssignment = (chapterId: string, assignment: ChapterAssignment) => {
    if (!selectedCourse) return;
    const updatedChapters = (selectedCourse.chapters || []).map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          assignments: [...(ch.assignments || []), assignment]
        };
      }
      return ch;
    });
    const totalAssignments = updatedChapters.reduce((acc, ch) => acc + (ch.assignments?.length || 0), 0);
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters,
      assignmentsCount: totalAssignments
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
    alert(`Assignment "${assignment.title}" added to chapter successfully!`);
  };

  // Delete Assignment
  const handleDeleteAssignment = (chapterId: string, assignmentId: string) => {
    if (!selectedCourse || !window.confirm('Delete this assignment?')) return;
    const updatedChapters = (selectedCourse.chapters || []).map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          assignments: (ch.assignments || []).filter(a => a.id !== assignmentId)
        };
      }
      return ch;
    });
    const totalAssignments = updatedChapters.reduce((acc, ch) => acc + (ch.assignments?.length || 0), 0);
    const updatedCourse: Course = {
      ...selectedCourse,
      chapters: updatedChapters,
      assignmentsCount: totalAssignments
    };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    persistCourses(updatedCourses, updatedCourse);
  };

  const handleAddReview = (e: React.FormEvent, course: Course) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const review = {
      id: `rev-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      userName: currentUser?.name || 'Enrolled Student',
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('future_legacy_course_reviews', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save review:', err);
    }
    setNewComment('');
    alert('Thank you! Your course quality review has been submitted successfully.');
  };

  const parseCoursePrice = (priceStr?: string) => {
    if (!priceStr) return 999;
    const digits = priceStr.replace(/\D/g, '');
    const num = parseInt(digits, 10);
    return isNaN(num) || num <= 0 ? 999 : num;
  };

  const handleEnrollOrBuy = (course: Course) => {
    if (enrolledCourses.includes(course.id)) return;
    setCourseForPayment(course);
  };

  const handleCoursePaymentSuccess = () => {
    if (!courseForPayment) return;
    const target = courseForPayment;
    const updated = [...enrolledCourses, target.id];
    setEnrolledCourses(updated);
    try {
      localStorage.setItem(`future_legacy_enrolled_${currentUser?.id || 'guest'}`, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save enrolment:', err);
    }
    setCourseForPayment(null);
  };

  const handleUploadCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const createdCourse: Course = {
      id: `custom-course-${Date.now()}`,
      title: newTitle,
      category: newSubject,
      subject: newSubject,
      difficulty: newDifficulty,
      instructor: currentUser?.name || 'Faculty Mentor',
      teacherId: currentUser?.id,
      rating: 5.0,
      studentsCount: 1,
      lessonsCount: Number(newLessons),
      testsCount: Number(newTests),
      assignmentsCount: Number(newAssignments),
      description: newDescription,
      image: newImageUrl,
      price: newPrice,
      chapters: createDefaultChapters(newSubject)
    };

    const updatedCourses = [createdCourse, ...courses];
    setCourses(updatedCourses);
    try {
      localStorage.setItem('future_legacy_all_courses', JSON.stringify(updatedCourses));
    } catch (err) {
      console.error('Failed to save uploaded course:', err);
    }

    setShowUploadModal(false);
    setSelectedCourse(createdCourse);
    setNewTitle('');
    setNewDescription('');
    alert('🎉 Course created and published! You can now add more video lectures (single or bulk), upload PDFs, and create assignments.');
  };

  // Filter logic
  const filteredCourses = courses.filter(course => {
    if (!course) return false;
    const titleStr = (course.title || '').toLowerCase();
    const descStr = (course.description || '').toLowerCase();
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || titleStr.includes(searchStr) || descStr.includes(searchStr);
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    const matchesInstructor = selectedInstructor === 'All' || (course.instructor || '').includes(selectedInstructor);
    return matchesSearch && matchesSubject && matchesDifficulty && matchesInstructor;
  });

  const subjects = ['All', ...Array.from(new Set(courses.map(c => c?.subject).filter(Boolean)))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const instructors = ['All', ...Array.from(new Set(courses.map(c => c?.instructor).filter(Boolean)))];

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const handleDownloadItem = (itemName: string) => {
    alert(`📥 Downloading "${itemName}" for offline study...\nFile successfully saved to your downloads / offline storage!`);
  };


  return (
    <div className="space-y-8 animate-fade-in text-slate-100 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider">
            <GraduationCap size={16} />
            <span>Recorded Complete Courses Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-montserrat tracking-tight text-white">
            Comprehensive Curriculum with Video Lectures, Tests & Assignments
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Teachers can upload recorded complete courses with tests and assignments, and students can instantly buy or enroll to unlock full access.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => setShowAnalyticsModal(true)}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Trophy size={16} className="text-amber-400" />
              <span>Teacher Analytics</span>
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Upload size={16} />
              <span>Upload Recorded Course</span>
            </button>
          </div>
        )}
      </div>

      {/* Teacher Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Teacher Analytics Dashboard</h3>
                  <p className="text-xs text-slate-400">Real-time engagement, student enrollments, and quiz performance metrics</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Analytics Modal Tabs */}
            <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setAnalyticsTab('metrics')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${analyticsTab === 'metrics' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Performance Metrics & Breakdown
              </button>
              <button
                onClick={() => setAnalyticsTab('reviews')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${analyticsTab === 'reviews' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Student Reviews & Quality Feedback ({reviews.length})
              </button>
            </div>

            {analyticsTab === 'metrics' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</span>
                    <p className="text-3xl font-black text-white font-montserrat">
                      {courses.reduce((acc, c) => acc + c.studentsCount, 0).toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-bold">+18.4% this month</span>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Viewers Now</span>
                    <p className="text-3xl font-black text-blue-400 font-montserrat">1,428</p>
                    <span className="text-[10px] text-blue-400 font-bold">Currently streaming lectures</span>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Quiz Score</span>
                    <p className="text-3xl font-black text-amber-400 font-montserrat">87.6%</p>
                    <span className="text-[10px] text-amber-400 font-bold">Across all chapter tests</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Course Performance Breakdown</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {courses.map(course => (
                      <div key={course.id} className="bg-slate-950 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-bold text-xs text-white">{course.title}</p>
                          <p className="text-[10px] text-slate-400">Instructor: {course.instructor} • {course.lessonsCount} Modules</p>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <p className="text-xs font-black text-white">{course.studentsCount.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400">Students</p>
                          </div>
                          <div>
                            <p className="text-xs font-black text-emerald-400">{(85 + (course.rating * 2.5)).toFixed(1)}%</p>
                            <p className="text-[10px] text-slate-400">Quiz Avg</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Student Quality Feedback & Star Ratings</h4>
                  <span className="text-xs text-slate-400">Total Reviews: {reviews.length}</span>
                </div>
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-white">{rev.userName}</p>
                          <p className="text-[10px] text-indigo-300 font-medium">{rev.courseTitle}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-0.5 text-amber-400 text-xs justify-end">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-white/5 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <ContentSecurityWall currentUser={currentUser} requiredRole="teacher" onBack={() => setShowUploadModal(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Video size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Upload Recorded Complete Course</h3>
                  <p className="text-xs text-slate-400">Publish your recorded video lectures, tests, and assignments for students</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadCourse} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Course Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Complete Advanced Mathematics Masterclass 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Subject Category</label>
                    <button
                      type="button"
                      onClick={() => setShowCustomCourseSubjectInput(!showCustomCourseSubjectInput)}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>{showCustomCourseSubjectInput ? 'View List' : '+ Add Custom Subject'}</span>
                    </button>
                  </div>

                  {showCustomCourseSubjectInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type custom subject (e.g. Botany, History, Sanskrit)..."
                        value={customCourseSubjectName}
                        onChange={(e) => setCustomCourseSubjectName(e.target.value)}
                        className="flex-1 bg-slate-950 border border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none placeholder-slate-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewCourseSubject();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCourseSubject}
                        disabled={!customCourseSubjectName.trim()}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomCourseSubjectInput(false)}
                        className="p-2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={newSubject}
                      onChange={(e) => {
                        if (e.target.value === '__CUSTOM_COURSE_SUB_NEW__') {
                          setShowCustomCourseSubjectInput(true);
                        } else {
                          setNewSubject(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {courseSubjectsList.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      <option value="__CUSTOM_COURSE_SUB_NEW__" className="text-blue-400 font-bold bg-slate-900">
                        + Type Custom Subject...
                      </option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Difficulty Level</label>
                  <select 
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Course Description & Syllabus Summary</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Describe what topics are covered in the recorded video modules, tests, and assignments..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Video Lessons</label>
                  <input 
                    type="number"
                    min="1"
                    value={newLessons}
                    onChange={(e) => setNewLessons(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mock Tests</label>
                  <input 
                    type="number"
                    min="0"
                    value={newTests}
                    onChange={(e) => setNewTests(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assignments</label>
                  <input 
                    type="number"
                    min="0"
                    value={newAssignments}
                    onChange={(e) => setNewAssignments(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Pricing / Enrolment Tag</label>
                  <input 
                    type="text"
                    placeholder="e.g., ₹1,499 or Free Enrolment"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                  <input 
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  Publish Recorded Course
                </button>
              </div>
            </form>
            </div>
          </ContentSecurityWall>
        </div>
      )}

      {/* Course Detail Two-Column Layout */}
      {selectedCourse ? (
        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <button 
              onClick={() => { setSelectedCourse(null); setSelectedLecture(null); }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <span>← Back to All Courses</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
                {enrolledCourses.includes(selectedCourse.id) ? 'Enrolled & Active' : selectedCourse.price}
              </span>
              {!enrolledCourses.includes(selectedCourse.id) && (
                <button 
                  onClick={() => handleEnrollOrBuy(selectedCourse)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Buy & Enroll ({selectedCourse.price})
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Structured Course Hierarchy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-950/70 p-5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={selectedCourse.image} alt={selectedCourse.title} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">{selectedCourse.category}</span>
                    <h3 className="text-sm font-bold font-montserrat text-white mt-1">{selectedCourse.title}</h3>
                    <p className="text-[11px] text-slate-400">Instructor: {selectedCourse.instructor}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedCourse.description}</p>
              </div>

              <div className="bg-slate-950/70 p-6 rounded-3xl border border-white/15 space-y-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <BookOpen size={15} className="text-blue-400" />
                    <span>Curriculum Chapters & Content</span>
                  </h4>
                  {isTeacherOrAdmin && (
                    <button
                      onClick={() => setShowAddChapterModal(true)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 transition-all"
                    >
                      <Plus size={13} />
                      <span>+ New Chapter</span>
                    </button>
                  )}
                </div>

                {/* Content Type Filter: All vs Lectures vs Notes vs Assignments */}
                <div className="flex gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCourseContentTab('curriculum')}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      courseContentTab === 'curriculum' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📹 Videos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseContentTab('notes')}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      courseContentTab === 'notes' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📄 Notes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseContentTab('assignments')}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      courseContentTab === 'assignments' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📝 Assignments</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                  {(selectedCourse.chapters && selectedCourse.chapters.length > 0
                    ? selectedCourse.chapters
                    : createDefaultChapters(selectedCourse.subject)
                  ).map((ch) => (
                    <div key={ch.id} className="bg-slate-900 border border-white/5 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2 pb-1 border-b border-white/5">
                        <div>
                          <h5 className="font-bold text-xs text-indigo-300">{ch.title}</h5>
                          {ch.description && (
                            <p className="text-[10px] text-slate-400">{ch.description}</p>
                          )}
                        </div>
                        {isTeacherOrAdmin && (
                          <button
                            title="Delete Chapter"
                            onClick={() => handleDeleteChapter(ch.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors rounded-lg cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {/* Teacher Quick-Add Action Bar on each Chapter */}
                      {isTeacherOrAdmin && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1">
                          <button
                            onClick={() => setActiveChapterForVideo(ch)}
                            className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Plus size={11} />
                            <span>Add Video (Single/Bulk)</span>
                          </button>

                          <button
                            onClick={() => setActiveChapterForPdf(ch)}
                            className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Plus size={11} />
                            <span>Upload PDF</span>
                          </button>

                          <button
                            onClick={() => setActiveChapterForAssignment(ch)}
                            className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Plus size={11} />
                            <span>Add Assignment</span>
                          </button>
                        </div>
                      )}

                      {/* 1. LECTURES LIST */}
                      {(courseContentTab === 'curriculum') && (
                        <div className="space-y-1.5 pt-1">
                          {(!ch.lectures || ch.lectures.length === 0) ? (
                            <p className="text-[11px] text-slate-500 italic py-2 text-center">No video lectures yet. Teacher can click "+ Add Video" above.</p>
                          ) : (
                            ch.lectures.map((lec) => {
                              const isSelected = selectedLecture?.lectureTitle === lec.title;
                              return (
                                <div
                                  key={lec.id}
                                  className={`w-full p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                                    isSelected
                                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                                      : 'bg-slate-950/50 border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <button
                                    onClick={() =>
                                      setSelectedLecture({
                                        chapterTitle: ch.title,
                                        lectureTitle: lec.title,
                                        duration: lec.duration
                                      })
                                    }
                                    className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
                                  >
                                    <Play size={12} className={isSelected ? 'text-blue-400 fill-blue-400' : 'text-slate-400'} />
                                    <div>
                                      <p className="text-xs font-medium leading-tight">{lec.title}</p>
                                      {lec.description && (
                                        <p className="text-[10px] text-slate-400 line-clamp-1">{lec.description}</p>
                                      )}
                                    </div>
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap bg-slate-900 px-2 py-0.5 rounded-md border border-white/5">
                                      {lec.duration}
                                    </span>
                                    {isTeacherOrAdmin && (
                                      <button
                                        title="Delete Video"
                                        onClick={() => handleDeleteVideo(ch.id, lec.id)}
                                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* 2. PDF NOTES LIST */}
                      {(courseContentTab === 'notes') && (
                        <div className="space-y-1.5 pt-1">
                          {(!ch.pdfNotes || ch.pdfNotes.length === 0) ? (
                            <p className="text-[11px] text-slate-500 italic py-2 text-center">No PDF notes uploaded for this chapter yet.</p>
                          ) : (
                            ch.pdfNotes.map((pdf) => (
                              <div
                                key={pdf.id}
                                className="p-2.5 rounded-xl border border-white/5 bg-slate-950/60 flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText size={14} className="text-purple-400 shrink-0" />
                                  <div>
                                    <p className="text-xs font-medium text-white">{pdf.title}</p>
                                    <p className="text-[10px] text-slate-400">{pdf.fileSize} • {pdf.uploadedAt}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleDownloadItem(pdf.fileName || `${pdf.title}.pdf`)}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-lg uppercase cursor-pointer flex items-center gap-1 shadow"
                                  >
                                    <Upload size={10} className="rotate-180" />
                                    <span>Download</span>
                                  </button>
                                  {isTeacherOrAdmin && (
                                    <button
                                      title="Delete PDF"
                                      onClick={() => handleDeletePdf(ch.id, pdf.id)}
                                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {/* 3. ASSIGNMENTS LIST */}
                      {(courseContentTab === 'assignments') && (
                        <div className="space-y-2 pt-1">
                          {(!ch.assignments || ch.assignments.length === 0) ? (
                            <p className="text-[11px] text-slate-500 italic py-2 text-center">No assignments added for this chapter yet.</p>
                          ) : (
                            ch.assignments.map((assign) => (
                              <div
                                key={assign.id}
                                className="p-3 rounded-xl border border-amber-500/20 bg-amber-950/20 space-y-2"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2">
                                    <CheckSquare size={15} className="text-amber-400 mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-xs font-bold text-white">{assign.title}</p>
                                      <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">{assign.description}</p>
                                    </div>
                                  </div>
                                  {isTeacherOrAdmin && (
                                    <button
                                      title="Delete Assignment"
                                      onClick={() => handleDeleteAssignment(ch.id, assign.id)}
                                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer shrink-0"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[10px]">
                                  <div className="flex items-center gap-3 text-slate-400">
                                    <span className="font-bold text-amber-300">Marks: {assign.totalMarks}</span>
                                    <span>Due: {assign.dueDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleDownloadItem(assign.fileName || `${assign.title}-QuestionSheet.pdf`)}
                                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg uppercase cursor-pointer flex items-center gap-1 border border-white/10"
                                    >
                                      <Upload size={10} className="rotate-180" />
                                      <span>Question Paper</span>
                                    </button>
                                    <button
                                      onClick={() => alert(`Assignment "${assign.title}" solution upload window:\nSelect your handwritten answer sheet (PDF or Images) to submit for evaluation.`)}
                                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-lg uppercase cursor-pointer shadow"
                                    >
                                      Submit Solution
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Reviews & Student Feedback Card */}
              <div className="bg-slate-950/70 p-5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <Trophy size={14} className="text-amber-400" />
                    <span>Student Reviews & Quality Rating</span>
                  </h4>
                  <span className="text-xs font-bold text-amber-400">★ {selectedCourse.rating} / 5.0</span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {reviews.filter(r => r.courseId === selectedCourse.id || r.courseTitle === selectedCourse.title).length > 0 ? (
                    reviews.filter(r => r.courseId === selectedCourse.id || r.courseTitle === selectedCourse.title).map(rev => (
                      <div key={rev.id} className="bg-slate-900 p-3.5 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{rev.userName}</span>
                          <div className="flex items-center gap-1 text-amber-400 text-xs">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                        <span className="text-[10px] text-slate-500">{rev.date}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2 text-center">No reviews yet. Be the first enrolled student to leave feedback!</p>
                  )}
                </div>

                {enrolledCourses.includes(selectedCourse.id) ? (
                  <form onSubmit={(e) => handleAddReview(e, selectedCourse)} className="bg-slate-900 p-4 rounded-2xl border border-white/10 space-y-3 pt-3">
                    <h5 className="font-bold text-xs text-white uppercase tracking-wider">Leave Your Review</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setNewRating(num)}
                            className={`w-7 h-7 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${newRating >= num ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400'}`}
                          >
                            {num}★
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      required
                      rows={2}
                      placeholder="Write your feedback on course quality, lectures, tests & assignments..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
                    >
                      Submit Review & Rating
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-center">
                    <p className="text-[11px] text-slate-400">Enroll in this course to submit your star rating and text review.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Video Player & Associated Downloadable Assets */}
            <div className="lg:col-span-7 space-y-6">
              {selectedLecture ? (
                <div className="bg-slate-950/80 p-6 rounded-3xl border border-blue-500/30 shadow-xl space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{selectedLecture.chapterTitle}</span>
                    <h3 className="text-lg font-black font-montserrat text-white">{selectedLecture.lectureTitle}</h3>
                    <p className="text-xs text-slate-300">Duration: {selectedLecture.duration} • HD 1080p Recorded Lecture</p>
                  </div>

                  {/* Video Player Box */}
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group">
                    <img src={selectedCourse.image} alt="Video Poster" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <button 
                      onClick={() => alert(`Playing video lecture: "${selectedLecture.lectureTitle}"... Enjoy your learning!`)}
                      className="relative z-10 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 transition-all cursor-pointer hover:scale-110"
                    >
                      <Play size={28} className="fill-white ml-1" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                      <span className="font-bold flex items-center gap-1.5"><Play size={14} className="text-emerald-400 fill-emerald-400" /> Now Playing</span>
                      <span className="bg-black/60 px-3 py-1 rounded-full text-[10px] backdrop-blur">{selectedLecture.duration}</span>
                    </div>
                  </div>

                  {/* Downloadable Assets Section - Appears ONLY when a lecture is selected */}
                  <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                      <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider">Associated Downloadable Assets</h4>
                        <p className="text-[11px] text-slate-400">Download study notes, lecture slides, and practice sheets for offline study.</p>
                      </div>
                      <button 
                        onClick={() => handleDownloadItem(`${selectedLecture.chapterTitle} - Complete Chapter Bundle (Notes, Assignments & PDFs).zip`)}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-[10px] rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Upload size={12} className="rotate-180" />
                        <span>Download All (Chapter ZIP)</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileText size={16} className="text-blue-400" />
                          <div>
                            <p className="font-bold text-xs text-white">Lecture Notes (PDF)</p>
                            <p className="text-[10px] text-slate-400">2.4 MB • Complete Summary</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownloadItem(`${selectedLecture.lectureTitle} - Notes.pdf`)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg uppercase cursor-pointer shadow-md shadow-blue-500/20 flex items-center gap-1 transition-all"
                        >
                          <Upload size={12} className="rotate-180" />
                          <span>Download</span>
                        </button>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Video size={16} className="text-purple-400" />
                          <div>
                            <p className="font-bold text-xs text-white">Offline Video File</p>
                            <p className="text-[10px] text-slate-400">145 MB • HD MP4</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownloadItem(`${selectedLecture.lectureTitle} - Video.mp4`)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-lg uppercase cursor-pointer shadow-md shadow-purple-500/20 flex items-center gap-1 transition-all"
                        >
                          <Upload size={12} className="rotate-180" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Play size={28} />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="font-bold text-white text-base">Select a Lecture from the Course Hierarchy</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Choose any lecture from the chapters list on the left to launch the HD video player and unlock its associated downloadable notes and offline assets.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filtering & Sorting Toolbar */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search courses or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-blue-400" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Filters:</span>
                </div>

                {/* Subject Filter */}
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Subjects</option>
                  {subjects.filter(s => s !== 'All').map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Difficulties</option>
                  {difficulties.filter(d => d !== 'All').map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>

                {/* Teacher Filter */}
                <select 
                  value={selectedInstructor} 
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                  className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">All Teachers</option>
                  {instructors.filter(i => i !== 'All').map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-12 text-center space-y-3">
              <BookOpen size={36} className="mx-auto text-slate-500" />
              <h4 className="font-bold text-white text-base">No Matching Courses Found</h4>
              <p className="text-xs text-slate-400">Try adjusting your search query, subject, difficulty level, or teacher filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedSubject('All'); setSelectedDifficulty('All'); setSelectedInstructor('All'); }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map(course => {
                const isEnrolled = enrolledCourses.includes(course.id);
                return (
                  <div key={course.id} className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transform hover:scale-105 transition-all duration-500" />
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-400 border border-white/10">
                          {course.subject} • {course.difficulty}
                        </div>
                        {isEnrolled && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                            Enrolled
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-amber-400 font-bold"><Star size={14} className="fill-amber-400" /> {course.rating}</span>
                          <span className="text-emerald-400 font-black">{course.price}</span>
                        </div>
                        <h3 className="font-bold text-base font-montserrat text-white">{course.title}</h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{course.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Instructor: <strong className="text-white">{course.instructor}</strong></span>
                          <span>{course.studentsCount.toLocaleString()} Students</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-blue-400">{course.lessonsCount} Lessons</span>
                          <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-purple-400">{course.testsCount} Tests</span>
                          <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-[10px] font-bold text-amber-400">{course.assignmentsCount} Assignments</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <BookOpen size={16} />
                        <span>{isEnrolled ? 'Open Course Curriculum' : `Buy / Enroll • ${course.price}`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals for Dynamic Chapter & Content Management (Baad me add karne ke liye) */}
      {activeChapterForVideo && (
        <AddVideoModal
          chapterTitle={activeChapterForVideo.title}
          onClose={() => setActiveChapterForVideo(null)}
          onAddSingle={(lecture) => handleAddSingleVideo(activeChapterForVideo.id, lecture)}
          onAddBulk={(lectures) => handleAddBulkVideos(activeChapterForVideo.id, lectures)}
        />
      )}

      {activeChapterForPdf && (
        <AddPdfModal
          chapterTitle={activeChapterForPdf.title}
          onClose={() => setActiveChapterForPdf(null)}
          onAddPdf={(pdf) => handleAddPdf(activeChapterForPdf.id, pdf)}
        />
      )}

      {activeChapterForAssignment && (
        <AddAssignmentModal
          chapterTitle={activeChapterForAssignment.title}
          onClose={() => setActiveChapterForAssignment(null)}
          onAddAssignment={(assignment) => handleAddAssignment(activeChapterForAssignment.id, assignment)}
        />
      )}

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Add New Chapter</h3>
                  <p className="text-xs text-slate-400">{selectedCourse?.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddChapterModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddChapter} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Chapter Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Wave Optics & Interference"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Chapter Summary / Description</label>
                <textarea
                  rows={3}
                  placeholder="What topics, derivations, and formulas are covered in this chapter..."
                  value={newChapterDesc}
                  onChange={(e) => setNewChapterDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {courseForPayment && (
        <PaymentModal
          itemName={`Complete Course: ${courseForPayment.title}`}
          amount={parseCoursePrice(courseForPayment.price)}
          category="Complete Course Enrollment"
          onClose={() => setCourseForPayment(null)}
          onPaymentSuccess={handleCoursePaymentSuccess}
        />
      )}
    </div>
  );
};
