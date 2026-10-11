export type UserRole = 'student' | 'teacher' | 'farmer' | 'admin' | null;

export type Page = 
  | 'Home' 
  | 'My Tasks' 
  | 'Chat' 
  | 'Class Schedule' 
  | 'Media Library' 
  | 'Agro Future' 
  | 'Skill Classes' 
  | 'Education & Guidance' 
  | 'Discussion Forum' 
  | 'E-Library' 
  | 'Settings' 
  | 'AI Personalised Study Assistant' 
  | 'Science and Concept Visualizer' 
  | 'All Live Classes' 
  | 'All India Mock Test'
  | 'Emergency Help'
  | 'Complete Courses'
  | 'Batch Manager'
  | 'Study Material'
  | 'Advanced AI Studio'
  | 'Learn with Podcast';

export interface User {
  id: string;
  name: string;
  imageUrl: string;
  mobileNumber: string;
  email?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  role?: UserRole;
  studentClass?: string;
  courseName?: string;
  qualifications?: string;
  teachingSubject?: string;
  experience?: string;
  collegeOrUniversity?: string;
  bio?: string;
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  examCategory: 'NEET' | 'JEE' | 'UPSC' | 'BOARDS';
  totalQuestions: number;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  participantsCount: number;
  status: 'live' | 'upcoming' | 'completed';
  description: string;
}

export interface BenchmarkQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Conceptual' | 'Application' | 'PYQ-Based' | 'Advanced';
  tags: string[];
  year?: string;
  weightage?: string;
  isSummaryQuestion?: boolean;
  section?: 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';
  examinerMindset?: string;
  examinerTrapType?: string;
}

export interface MockTestResult {
  testId: string;
  userId: string;
  score: number;
  rank: number;
  totalParticipants: number;
  percentile: number;
  accuracy: number;
  timestamp: string;
}

export interface PriceTier {
  duration: number;
  price: number;
}

export interface ClassResource {
  id: number;
  title: string;
  fileUrl: string;
}

export interface ClassTest extends ClassResource {
  type: 'Part Test' | 'Full Test';
}

export interface SkillClass {
  id: number;
  title: string;
  instructor: string;
  category: string;
  rating: number;
  imageUrl: string;
  description?: string;
  pricingTiers?: PriceTier[];
  recorded_price?: number;
  type?: 'Batch' | '1-on-1' | 'Live' | 'Course' | 'Webinar' | 'Workshop';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  maxStudents?: number;
  studentsEnrolled?: number; 
  isEnrolled?: boolean;
  notes?: ClassResource[];
  dpps?: ClassResource[];
  tests?: ClassTest[];
  reviews?: ClassReview[];
}

export interface GuidanceClass extends SkillClass {
  price?: number;
  courseDuration?: string;
}

export interface AgroClass extends SkillClass {}

export interface AgroDocument {
  id: number;
  name: string;
  file?: File;
  status: 'Pending' | 'Verified' | 'Rejected';
}

export interface AgroProfessional {
  id: number;
  name: string;
  qualifications: string;
  bio: string;
  imageUrl: string;
  documents: AgroDocument[];
  fees_individual: number;
  fees_batch: number;
  specialization: string;
  availability: {
    days: string;
    time: string;
  };
  mobileNumber: string;
  status: 'Available' | 'Unavailable';
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorImageUrl: string;
  timestamp: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: number;
  author: string;
  authorImageUrl: string;
  content: string;
  timestamp: string;
}

export interface LibraryItem {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  type: 'Book' | 'Article' | 'Research Paper' | 'PDF Notes' | 'PPT' | 'Agriculture Magazine';
  fileUrl: string;
  coverImageUrl: string;
  isProtected?: boolean;
  price?: number;
  isPurchased?: boolean;
  classId?: number;
  classType?: 'skill' | 'agro';
}

export interface Group {
  id: string;
  name: string;
  memberIds: string[];
  imageUrl: string;
}

export interface ChatMessage {
  id: number;
  conversationId: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
  isDeleted?: boolean;
  deletedFor?: string[];
  content: {
    type: 'text' | 'image' | 'system' | 'audio' | 'video' | 'file';
    text?: string;
    url?: string;
    fileName?: string;
    fileSize?: number;
  };
}

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: string;
}

export interface AppNotification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video';
}

export interface PlayableMedia {
  type: 'image' | 'audio' | 'video';
  url: string;
  name?: string;
}

export interface ClassSchedule {
  id: number;
  title: string;
  author: string;
  authorImageUrl: string;
  timestamp: string;
  className: string;
  scheduleTime: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  classId?: number;
  classType?: 'skill' | 'agro' | 'guidance';
}

export interface AgriBotAnalysis {
  status: string;
  findings: string;
  recommendations: string[];
  confidence: number;
  problem?: string;
  solutionText?: string;
  solutionVideoScript?: string;
  groundingSources?: { uri: string; title: string }[];
  weather: {
    location: string;
    forecast: string;
    details: { day: string; temp: string; condition: string; precipitation: string }[];
  };
  productionTips: string[];
}

export interface StudyMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  sources?: any[];
}

export interface LiveClass {
  id: number;
  title: string;
  instructor: string;
  startTime: string;
  viewerCount: number;
  subject?: string;
  description?: string;
  syllabus?: CourseChapter[];
  teacherProfile?: TeacherEducationProfile;
  totalLectures?: number;
  courseDuration?: string;
  price?: number;
  isEnrolled?: boolean;
  enrolledStudents?: string[];
}

export interface DegreeDetail {
  degreeName: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  scoreOrHonors?: string;
  isVerified?: boolean;
}

export interface CourseChapter {
  id: number;
  title: string;
  duration: string;
  topics: string[];
  hasNotes?: boolean;
  hasDPP?: boolean;
}

export interface TeacherEducationProfile {
  fullName: string;
  avatarUrl: string;
  designation: string;
  highestDegree: string;
  totalHigherEducationYears: string;
  degrees: DegreeDetail[];
  institutions: string[];
  competitiveExamsCracked: string[];
  totalTeachingExperience: string;
  institutesTaughtAt: string[];
  specializations: string[];
  researchPublications?: string[];
  awardsAndHonors?: string[];
  studentsMentoredCount: string;
  selectionCount: string;
  rating: number;
  totalReviews: number;
  bio: string;
  languages: string[];
  verificationBadge: string;
  certificateNumber?: string;
}

export interface ClassReview {
  id: number;
  userName: string;
  userImageUrl: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Mentor {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  about: string;
  followers: number;
  isFollowed: boolean;
  mobileNumber: string;
  videoUrl?: string;
  experience?: string;
  isFeatured?: boolean;
  audioUrl?: string;
  allowMessages?: boolean;
  socials?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface FlashCard {
  term: string;
  definition: string;
  points?: string[];
  imageUrl?: string;
  imagePrompt?: string; 
  color?: 'sky' | 'amber' | 'emerald' | 'indigo' | 'rose';
}

export interface SavedRecording {
  id: number;
  userId: string;
  title: string;
  url: string;
  type: 'audio' | 'video';
  timestamp: string;
  duration?: number;
  blob?: Blob;
}

export interface NotificationPreferences {
  newClasses: boolean;
  mentorMessages: boolean;
  scheduleChanges: boolean;
  taskReminders: boolean;
}

export interface LocalizationSettings {
  language: 'en';
  strictEnglishEnforced: boolean;
  zeroHindiMode: boolean;
}

export interface DailyForecast {
  day: string;
  temp: string;
  condition: string;
  icon: string;
}

export interface WeatherInfo {
  location: string;
  current: {
    temp: string;
    condition: string;
    icon: string;
  };
  forecast: DailyForecast[];
}

export interface SimulationStep {
  title: string;
  description: string;
  action: string;
  visualEffect?: string;
}

export interface SimulationData {
  title: string;
  theory: string;
  equation: string;
  safety: string[];
  steps: SimulationStep[];
  resultColor: string;
}

export interface LessonPlanSuggestions {
  subTopics: string[];
  exercises: string[];
  teachingIdeas: string[];
}

export interface FullSyllabusOutline {
  learningObjectives: string;
  dailyPlans: {
    topic: string;
    subTopics: string;
    assignment: string;
  }[];
}

export interface AssignmentSuggestions {
  suggestedQuestions: string[];
  answerKeyHints: string[];
  creativeVariations: string[];
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'video' | 'audio' | 'link';
  url: string;
  size?: string;
}

export interface AssignmentMCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  explanation?: string;
  imageUrl?: string;
}

export interface AssignmentItem {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  message: string;
  voiceInstructionUrl?: string;
  subject: string;
  targetType: 'all' | 'class' | 'batch' | 'selected';
  targetClassOrBatch?: string;
  targetStudentIds?: string[];
  submissionType: 'in_app' | 'notebook' | 'notice_only';
  totalMarks: number;
  deadline: string;
  allowLate: boolean;
  lateUntil?: string;
  latePenaltyPerDay?: number;
  maxAttempts: number;
  publishAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'closed';
  attachments: AssignmentAttachment[];
  questions?: AssignmentMCQQuestion[];
  solutionAttachment?: AssignmentAttachment;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentRollOrPhone?: string;
  status: 'pending' | 'submitted' | 'late' | 'checked' | 'redo' | 'notebook_done';
  attemptNo: number;
  submittedAt: string;
  textAnswer?: string;
  linkAnswer?: string;
  audioAnswerUrl?: string;
  photos: string[];
  files: { name: string; url: string; size?: string }[];
  marks?: number;
  feedbackText?: string;
  feedbackVoiceUrl?: string;
  annotatedPhotoUrl?: string;
  checkedAt?: string;
  checkedBy?: string;
}

export interface AssignmentStep {
  title: string;
  description: string;
  suggestedDeadline: string;
}

export interface StudyMaterialItem {
  id: string;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: 'teacher' | 'admin' | 'student';
  title: string;
  description?: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'link' | 'note';
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize?: string;
  batch: string;
  subject: string;
  chapter: string;
  tags: string[];
  isImportant?: boolean;
  isPinned?: boolean;
  isPremium?: boolean;
  allowDownload?: boolean;
  visibility: 'all_batch' | 'selected' | 'paid_only';
  status: 'published' | 'draft' | 'scheduled' | 'archived' | 'pending_approval';
  version: number;
  viewsCount: number;
  downloadsCount: number;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyFolder {
  id: string;
  batch: string;
  subject: string;
  name: string;
  order: number;
}

export interface StudentMaterialActivity {
  studentId: string;
  materialId: string;
  lastPageOrPosition?: number;
  timeSpentSeconds: number;
  isCompleted: boolean;
  isBookmarked: boolean;
  isDownloaded: boolean;
  helpfulVote?: 'up' | 'down';
  personalNotes?: string;
}

export interface MaterialDoubtThread {
  id: string;
  materialId: string;
  studentId: string;
  studentName: string;
  questionText: string;
  createdAt: string;
  replies: {
    senderName: string;
    role: string;
    text: string;
    timestamp: string;
  }[];
}

export type Subject = 'Chemistry' | 'Physics' | 'Biology';

export interface VisualLabelItem {
  part: string;
  functionOrMeaning: string;
}

export interface ScienceVisual {
  scientific: string;
  scientificExplanation?: string;
  scientificLabels?: VisualLabelItem[];
  scientificFormula?: string;
  realWorld: string;
  realWorldExplanation?: string;
  realWorldAnalogy?: string;
  bookish: string;
  bookishExplanation?: string;
  bookishKeyPoints?: string[];
  summary?: string;
  ncertReference?: string;
}


// NEW LIVE CLASS & WHITEBOARD TYPES
export type WhiteboardTool = 'select' | 'pen' | 'highlighter' | 'eraser' | 'text';

export interface WhiteboardElementBase {
  id: string;
  type: 'path' | 'text' | 'image' | 'slide';
  color: string;
}

export interface WhiteboardPath extends WhiteboardElementBase {
  type: 'path';
  points: { x: number; y: number }[];
  strokeWidth: number;
  mode: 'pen' | 'highlighter' | 'eraser';
}

export interface WhiteboardTextElement extends WhiteboardElementBase {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  width: number;
}

export type WhiteboardElement = WhiteboardPath | WhiteboardTextElement;

export interface WhiteboardPage {
  id: string;
  elements: WhiteboardElement[];
}

export interface LiveClassParticipant extends User {
  isMuted: boolean;
  isCameraOn: boolean;
  handRaised: boolean;
  role: 'teacher' | 'student';
  joinedAt?: string;
}

export interface LiveChatMessage {
  id: string;
  senderName: string;
  senderRole?: 'teacher' | 'student';
  text: string;
  timestamp: string;
  isDoubt?: boolean;
  isSolved?: boolean;
}

export interface LivePollOption {
  text: string;
  votes: number;
}

export interface LivePoll {
  id: string;
  question: string;
  options: LivePollOption[];
  totalVotes: number;
  active: boolean;
  correctOptionIndex?: number;
  userVoteIndex?: number;
  createdAt: string;
}

export interface SharedNote {
  id: string;
  title: string;
  fileSize: string;
  fileName: string;
  uploadedBy: string;
  timestamp: string;
  url?: string;
}

export interface LiveClassRecordingItem {
  id: string;
  classId: number;
  title: string;
  instructor: string;
  subject: string;
  date: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  chatHistory: LiveChatMessage[];
  notes: SharedNote[];
  attendanceCount: number;
}

export interface OneToOneDoubtCallBooking {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone?: string;
  teacherName: string;
  subject: string;
  topic: string;
  date: string;
  timeSlot: string; // e.g. "04:30 PM - 04:45 PM"
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  mode: 'video' | 'audio';
  rating?: number;
  feedback?: string;
}
