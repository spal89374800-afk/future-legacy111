# Future Legacy - Frontend Architecture & Directory Guide

## 🎨 Overview
The frontend is a production-grade React 19 + TypeScript Single Page Application (SPA) styled with Tailwind CSS and animated with Motion/Lucide.

## 📂 Frontend Directory Structure

```
├── index.html                   # HTML Entry point with SEO metadata & KaTeX math rendering
├── index.tsx                    # React Root mount with global ErrorBoundary & Safe Alert Polyfills
├── components/                  # UI Components and Screen Views
│   ├── App.tsx                  # Main App State, Navigation, and Auth Routing
│   ├── Layout.tsx               # Responsive App Shell with Topbar, Sidebar, SOS, Fullscreen
│   ├── HomePage.tsx             # Interactive Role-based Dashboards (Student, Teacher, Farmer)
│   ├── SafePageBoundary.tsx     # Self-healing Module Wrapper to prevent crashes
│   ├── BatchManager.tsx         # Faculty Batch Management & Student Timetables
│   ├── CompleteCoursesPage.tsx  # Video Lectures, Chapters, PDFs, and Course Purchases
│   ├── studymaterial/           # Study Material & Notes Engine with In-App Fullscreen Reader
│   ├── AllIndiaMockTestPage.tsx # NTA NEET & UPSC Mock Test Simulator with Auto-grading
│   ├── LiveClassesPage.tsx      # Live Classroom Hub, 1-to-1 Doubt Calls, and Recording Vault
│   ├── MediaLibraryPage.tsx     # Archived Video/Audio Lectures Vault
│   ├── AIPersonalisedStudyAssistantPage.tsx # AI Pedagogical Engine
│   ├── ELibraryPage.tsx         # Digital Library with Fullscreen Document Reader
│   ├── ClassSchedulePage.tsx    # Academic Timetable and Temporal Dispatches
│   ├── TaskPage.tsx             # Daily Study Tasks and Assignment Submissions
│   ├── DiscussionForumPage.tsx  # Student Doubts and Discussion Board
│   ├── SettingsPage.tsx         # User Profile, Notifications, and Language Settings
│   └── ...                      # Modals, Video Players, and Form Components
├── services/                    # Frontend API & Integration Layer
│   ├── api.ts                   # REST API client for backend communication
│   ├── geminiService.ts         # Google Gemini AI integration
│   ├── mockQuestionFactory.ts   # NEET/UPSC question generator
│   └── courseDefaults.ts        # Default curriculum data
├── src/                         # Core App Libs
│   └── lib/firebaseClient.ts    # Firebase Firestore & Auth client instance
├── hooks/                       # Custom React Hooks
│   └── useVoiceAssistant.ts     # Bilingual Voice Assistant Hook
├── utils/                       # Frontend Utilities
│   ├── security.ts              # Client-side input sanitization & validation
│   └── storage.ts               # LocalStorage helpers with type safety
├── types.ts                     # TypeScript Type Definitions
├── constants.tsx                # App constants, navigation links, and presets
└── mockData.ts                  # Mock data fallbacks for offline operation
```

## 🚀 Key Frontend Features
1. **Zero-Crash Resilience**: Every module is shielded with `SafePageBoundary` and native modal polyfills.
2. **Role-Based Views**: Instant seamless role switching between Student, Teacher, and Farmer.
3. **In-App Fullscreen Reader**: Native PDF, Image, and Text document reader with Night/Sepia themes and zoom.
4. **Real-Time Data Persistence**: Synchronized across `future_legacy_batches_v1`, `future_legacy_study_materials_v1`, and `future_legacy_all_courses`.
