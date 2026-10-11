export interface ChapterLecture {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  fileName?: string;
  description?: string;
}

export interface ChapterPdfNote {
  id: string;
  title: string;
  fileSize: string;
  pdfUrl?: string;
  fileName?: string;
  uploadedAt: string;
}

export interface ChapterAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  pdfUrl?: string;
  fileName?: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  description?: string;
  lectures: ChapterLecture[];
  pdfNotes: ChapterPdfNote[];
  assignments: ChapterAssignment[];
}
