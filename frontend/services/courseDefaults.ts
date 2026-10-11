import type { CourseChapter } from '../types/courseContent.ts';

export const createDefaultChapters = (subject: string): CourseChapter[] => {
  return [
    {
      id: 'ch-1',
      title: 'Chapter 1: Foundations & Core Principles',
      description: 'Fundamental laws, basic definitions, and core derivations.',
      lectures: [
        {
          id: 'lec-1-1',
          title: 'Lecture 1.1: Basic Concepts & Terminology',
          duration: '42 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: 'Detailed overview of core definitions and fundamental physical quantities.'
        },
        {
          id: 'lec-1-2',
          title: 'Lecture 1.2: Fundamental Derivations & Axioms',
          duration: '48 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: 'Step-by-step mathematical proofs and equation setups.'
        },
        {
          id: 'lec-1-3',
          title: 'Lecture 1.3: Foundation Numerical Problem Solving',
          duration: '55 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: '20 standard numerical problems solved on digital chalkboard.'
        }
      ],
      pdfNotes: [
        {
          id: 'pdf-1-1',
          title: 'Chapter 1 Complete Handwritten Notes (PDF)',
          fileSize: '3.8 MB',
          uploadedAt: 'Sep 2026',
          fileName: 'Chapter-1-Comprehensive-Notes.pdf'
        },
        {
          id: 'pdf-1-2',
          title: 'Formula Cheat Sheet & Quick Derivation Chart',
          fileSize: '1.2 MB',
          uploadedAt: 'Sep 2026',
          fileName: 'Chapter-1-Formula-Sheet.pdf'
        }
      ],
      assignments: [
        {
          id: 'assign-1-1',
          title: 'Assignment 1: Fundamentals Problem Set (25 Questions)',
          description: 'Solve all MCQs and detailed derivations. Submit scanned handwritten solutions.',
          dueDate: '7 Days from Enrolment',
          totalMarks: 50,
          fileName: 'Assignment-1-ProblemSet.pdf'
        }
      ]
    },
    {
      id: 'ch-2',
      title: 'Chapter 2: Advanced Problem Solving & Derivations',
      description: 'Advanced numerical tricks, shortcut techniques, and PYQ analysis.',
      lectures: [
        {
          id: 'lec-2-1',
          title: 'Lecture 2.1: Advanced Theorems & Multivariable Setups',
          duration: '50 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: 'High-difficulty theoretical applications and shortcut rules.'
        },
        {
          id: 'lec-2-2',
          title: 'Lecture 2.2: Complex Numerical Tricks & Shortcuts',
          duration: '52 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: 'Time-saving methods for entrance competitive examinations.'
        },
        {
          id: 'lec-2-3',
          title: 'Lecture 2.3: 10-Year Previous Years Questions (PYQ) Walkthrough',
          duration: '60 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: 'Solving all questions asked between 2015 and 2025.'
        }
      ],
      pdfNotes: [
        {
          id: 'pdf-2-1',
          title: 'Advanced PYQ Question Bank with Solutions',
          fileSize: '5.4 MB',
          uploadedAt: 'Sep 2026',
          fileName: 'Chapter-2-PYQ-Bank.pdf'
        }
      ],
      assignments: [
        {
          id: 'assign-2-1',
          title: 'Assignment 2: Advanced Level Mock Assignment (30 Marks)',
          description: 'Comprehensive challenging test set. Graded with faculty review.',
          dueDate: '10 Days from Enrolment',
          totalMarks: 30,
          fileName: 'Assignment-2-ChallengingSet.pdf'
        }
      ]
    },
    {
      id: 'ch-3',
      title: 'Chapter 3: Mock Tests & Final Mastery Review',
      description: 'Full syllabus synthesis, examiner traps, and revision booster.',
      lectures: [
        {
          id: 'lec-3-1',
          title: 'Lecture 3.1: Full Chapter Revision in 60 Mins',
          duration: '58 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: 'Rapid lightning review of every formula, graph, and theorem.'
        },
        {
          id: 'lec-3-2',
          title: 'Lecture 3.2: Examiner Mindset & Common Traps',
          duration: '40 Mins',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          description: 'Common negative-marking errors made by 90% of students and how to avoid them.'
        }
      ],
      pdfNotes: [
        {
          id: 'pdf-3-1',
          title: 'Mindmap & One-Page High Yield Revision Diagram',
          fileSize: '2.1 MB',
          uploadedAt: 'Sep 2026',
          fileName: 'Chapter-3-Mindmap.pdf'
        }
      ],
      assignments: [
        {
          id: 'assign-3-1',
          title: 'Final Capstone Chapter Test & Self-Assessment',
          description: 'Simulated 1-hour test with timed grading guidelines.',
          dueDate: '14 Days from Enrolment',
          totalMarks: 100,
          fileName: 'Capstone-Chapter-Test.pdf'
        }
      ]
    }
  ];
};
