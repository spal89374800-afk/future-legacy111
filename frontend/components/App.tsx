import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Import Types
import type { 
  Page, 
  UserRole, 
  User, 
  Mentor, 
  ChatMessage, 
  Task, 
  AppNotification, 
  SkillClass, 
  AgroClass, 
  AgroProfessional, 
  LiveClass,
  StudyMessage,
  AgriBotAnalysis,
  Group,
  LibraryItem,
  ClassSchedule,
  PlayableMedia,
  GuidanceClass,
  SavedRecording,
  NotificationPreferences,
  LocalizationSettings,
  ForumPost,
  MockTest,
  QuizQuestion,
  WhiteboardElement
} from '../types.ts';

// Core Components
import Layout from './Layout.tsx';
import HomePage from './HomePage.tsx';
import AIPersonalisedStudyAssistantPage from './AIPersonalisedStudyAssistantPage.tsx';
import AgroFuturePage from './AgroFuturePage.tsx';
import LabPage from './LabPage.tsx';
import ChatPage from './ChatPage.tsx';
import TaskPage from './TaskPage.tsx';
import EducationGuidancePage from './EducationGuidancePage.tsx';
import SettingsPage from './SettingsPage.tsx';
import { AdvancedAIHub } from './AdvancedAIHub.tsx';
import { CompleteCoursesPage } from './CompleteCoursesPage.tsx';
import MentorFormModal from './MentorFormModal.tsx';
import EmergencyHelpPage from './EmergencyHelpPage.tsx';
import DiscussionForumPage from './DiscussionForumPage.tsx';
import LoginScreen from './LoginScreen.tsx';
import RoleSelectionScreen from './RoleSelectionScreen.tsx';
import StudentLoginScreen from './StudentLoginScreen.tsx';
import TeacherLoginScreen from './TeacherLoginScreen.tsx';
import FarmerLoginScreen from './FarmerLoginScreen.tsx';
import StudentRegistrationForm from './StudentRegistrationForm.tsx';
import TeacherRegistrationForm from './TeacherRegistrationForm.tsx';
import ELibraryPage from './ELibraryPage.tsx';
import AdminPanel from './AdminPanel.tsx';
import AgroProfessionalFormModal from './AgroProfessionalFormModal.tsx';
import { SkillClassesPage } from './SkillClassesPage.tsx';
import ClassSchedulePage from './ClassSchedulePage.tsx';
import Toast from './Toast.tsx';
import MediaLibraryPage from './MediaLibraryPage.tsx';
import SendNotificationModal from './SendNotificationModal.tsx';
import ScheduleFormModal from './ScheduleFormModal.tsx';
import SkillClassFormModal from './SkillClassFormModal.tsx';
import GuidanceClassFormModal from './GuidanceClassFormModal.tsx';
import LibraryFormModal from './LibraryFormModal.tsx';
import AssignmentModal from './AssignmentModal.tsx';
import Whiteboard from './Whiteboard.tsx';
import FeedbackModal from './FeedbackModal.tsx';
import { LiveClassView } from './LiveClassView.tsx';
import SplashScreen from './SplashScreen.tsx';
import CreateLiveClassModal from './CreateLiveClassModal.tsx';
import AllIndiaMockTestPage from './AllIndiaMockTestPage.tsx';
import MockTestView from './MockTestView.tsx';
import RevisionQuizModal from './RevisionQuizModal.tsx';
import LiveClassesPage from './LiveClassesPage.tsx';
import PaymentModal from './PaymentModal.tsx';
import { PodcastLearningPage } from './PodcastLearningPage.tsx';
import { BatchManager } from './BatchManager.tsx';
import { StudyMaterialPage } from './studymaterial/StudyMaterialPage.tsx';
import SafePageBoundary from './SafePageBoundary.tsx';

// Services
import { initDB, addRecording, getAllRecordings, deleteRecording } from './db.ts';
import * as api from '../services/api.ts';
import { mockData } from '../mockData.ts';
import { AlertCircle, Sparkles } from 'lucide-react';

type AuthStep = 'splash' | 'login' | 'role-selection' | 'student-login' | 'teacher-login' | 'farmer-login' | 'registration' | 'app';

const App: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('splash');

  const [hasEverLoggedIn, setHasEverLoggedIn] = useState<boolean>(() => {
    try {
      const flag = localStorage.getItem('future_legacy_has_logged_in_once');
      if (flag === 'true') return true;
      const saved = localStorage.getItem('future_legacy_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.id && u.name) return true;
      }
      const last = localStorage.getItem('future_legacy_last_user');
      if (last) {
        const lu = JSON.parse(last);
        if (lu && lu.id && lu.name) return true;
      }
    } catch {}
    return false;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.id && u.name) return true;
      }
    } catch {}
    return false;
  });

  const [pendingAuthData, setPendingAuthData] = useState<{
    mobileNumber?: string;
    email?: string;
    name?: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
  }>({
    mobileNumber: '+91 98765 43210',
    email: 'spal89374800@gmail.com',
    name: 'Shourya Patel',
    isPhoneVerified: true,
    isEmailVerified: true,
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && (u.role === 'student' || u.role === 'teacher' || u.role === 'farmer' || u.role === 'admin')) {
          return u.role;
        }
      }
    } catch {}
    return 'student';
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.id && u.name) {
          return {
            id: u.id,
            name: u.name,
            email: u.email || 'spal89374800@gmail.com',
            mobileNumber: u.mobileNumber || '+91 98765 43210',
            isPhoneVerified: u.isPhoneVerified ?? true,
            isEmailVerified: u.isEmailVerified ?? true,
            imageUrl: u.imageUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=Shourya&backgroundColor=3b82f6,6366f1',
            role: u.role || 'student'
          };
        }
      }
    } catch {}
    return {
      id: 'u_student_1',
      name: 'Shourya Patel',
      email: 'spal89374800@gmail.com',
      mobileNumber: '+91 98765 43210',
      isPhoneVerified: true,
      isEmailVerified: true,
      imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Shourya&backgroundColor=3b82f6,6366f1',
      role: 'student'
    };
  });
  const [navigationHistory, setNavigationHistory] = useState<Page[]>(['Home']);
  const currentPage = useMemo(() => navigationHistory[navigationHistory.length - 1], [navigationHistory]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const [activeLiveClass, setActiveLiveClass] = useState<LiveClass | null>(null);
  const [isCreateLiveModalOpen, setIsCreateLiveModalOpen] = useState(false);
  const [activeMockTest, setActiveMockTest] = useState<MockTest | null>(null);

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    newClasses: true,
    mentorMessages: true,
    scheduleChanges: true,
    taskReminders: true
  });

  const [localizationSettings, setLocalizationSettings] = useState<LocalizationSettings>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_localization');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      language: 'en',
      strictEnglishEnforced: true,
      zeroHindiMode: true
    };
  });

  const [mentors, setMentors] = useState<Mentor[]>(() => mockData.mentors || []);
  const [users, setUsers] = useState<User[]>(() => mockData.users || []);
  const [groups, setGroups] = useState<Group[]>(() => mockData.groups || []);
  const [messages, setMessages] = useState<ChatMessage[]>(() => mockData.messages || []);
  const [tasks, setTasks] = useState<Task[]>(() => mockData.tasks || []);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => mockData.notifications || []);
  const [recordings, setRecordings] = useState<SavedRecording[]>([]);
  const [skillClasses, setSkillClasses] = useState<SkillClass[]>(() => mockData.skillClasses || []);
  const [guidanceClasses, setGuidanceClasses] = useState<GuidanceClass[]>(() => mockData.guidanceClasses || []);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(() => mockData.libraryItems || []);
  const [agroClasses, setAgroClasses] = useState<AgroClass[]>(() => mockData.agroClasses || []);
  const [agroProfessionals, setAgroProfessionals] = useState<AgroProfessional[]>(() => mockData.agroProfessionals || []);
  const [enrolledLiveClassIds, setEnrolledLiveClassIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('future_legacy_enrolled_live_classes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [classForPayment, setClassForPayment] = useState<LiveClass | null>(null);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(() => {
    const baseClasses: LiveClass[] = mockData.liveClasses || [];
    try {
      const saved = localStorage.getItem('future_legacy_enrolled_live_classes');
      const enrolledIds: number[] = saved ? JSON.parse(saved) : [];
      return baseClasses.map(c => ({
        ...c,
        isEnrolled: enrolledIds.includes(c.id) || Boolean(c.isEnrolled)
      }));
    } catch {
      return baseClasses;
    }
  });
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => mockData.forumPosts || []);
  const [typingIndicators, setTypingIndicators] = useState<Record<string, { userId: string, name: string } | null>>({});
  const [schedules, setSchedules] = useState<ClassSchedule[]>(() => mockData.schedules || []);

  const [studyAssistantMessages, setStudyAssistantMessages] = useState<StudyMessage[]>([
    { role: 'model', parts: [{ text: "Hello! I am your AI Study Assistant. Ask me any doubt in Physics, Chemistry, Biology, or Mathematics, or specify a Class and Chapter for smart revision notes." }] }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [agriBotAnalysis, setAgriBotAnalysis] = useState<AgriBotAnalysis | null>(null);
  const [isAgriBotLoading, setIsAgriBotLoading] = useState(false);
  const [isReviseModeEnabled, setIsReviseModeEnabled] = useState(false);
  const [isGeneratingRevision, setIsGeneratingRevision] = useState(false);
  const [revisionSuggestion, setRevisionSuggestion] = useState<string | null>(null);

  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [isAgroProfModalOpen, setIsAgroProfModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isWhiteboardModalOpen, setIsWhiteboardModalOpen] = useState(false);
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  // Universal In-App Toast Handler: captures dispatched alerts safely
  useEffect(() => {
    const handleAppToast = (e: any) => {
      if (e?.detail) {
        showToast(String(e.detail));
      }
    };
    window.addEventListener('app-toast', handleAppToast);
    return () => window.removeEventListener('app-toast', handleAppToast);
  }, [showToast]);

  const navigateAuth = useCallback((nextStep: AuthStep) => {
    setAuthStep(nextStep);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        await initDB();
        const data = await api.fetchAllData();
        if (!isMounted) return;
        setMentors(data[0] || []);
        setUsers(data[1] || []);
        setSkillClasses(data[6] || []);
        setGuidanceClasses(data[7] || []);
        setAgroClasses(data[8] || []);
        setAgroProfessionals(data[9] || []);
        setLibraryItems(data[12] || []);
        setLiveClasses(data[13] || []);
      } catch (error) {
        if (isMounted) showToast("Failed to load initial data. Retrying...", "error");
      }
    };
    loadInitialData();
    return () => { isMounted = false; };
  }, [showToast]);

  const lastNavTimeRef = useRef(0);

  const handleNavigate = useCallback((page: Page) => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 350) {
      return;
    }
    lastNavTimeRef.current = now;
    setNavigationHistory(prev => {
      const newHistory = prev[prev.length - 1] === page ? prev : [...prev, page];
      window.history.pushState({ page }, '', '');
      return newHistory;
    });
    setIsSidebarOpen(false);
  }, []);

  const handleBack = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 350) {
      return;
    }
    lastNavTimeRef.current = now;

    if (activeLiveClass) { setActiveLiveClass(null); return; }
    if (activeMockTest) { setActiveMockTest(null); return; }
    if (isCreateLiveModalOpen) { setIsCreateLiveModalOpen(false); return; }
    if (isMentorModalOpen) { setIsMentorModalOpen(false); return; }
    if (isAgroProfModalOpen) { setIsAgroProfModalOpen(false); return; }
    if (isNotificationModalOpen) { setIsNotificationModalOpen(false); return; }
    if (isScheduleModalOpen) { setIsScheduleModalOpen(false); return; }
    if (isFeedbackModalOpen) { setIsFeedbackModalOpen(false); return; }
    if (isSkillModalOpen) { setIsSkillModalOpen(false); return; }
    if (isGuidanceModalOpen) { setIsGuidanceModalOpen(false); return; }
    if (isLibraryModalOpen) { setIsLibraryModalOpen(false); return; }
    if (isAssignmentModalOpen) { setIsAssignmentModalOpen(false); return; }
    if (isWhiteboardModalOpen) { setIsWhiteboardModalOpen(false); return; }

    setNavigationHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      } else {
        // Already on home base: navigate back to role selection
        navigateAuth('role-selection');
        return prev;
      }
    });
  }, [activeLiveClass, activeMockTest, isCreateLiveModalOpen, isMentorModalOpen, isAgroProfModalOpen, isNotificationModalOpen, isScheduleModalOpen, isFeedbackModalOpen, isSkillModalOpen, isGuidanceModalOpen, isLibraryModalOpen, isAssignmentModalOpen, isWhiteboardModalOpen, navigateAuth]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      // hardware back button pressed
      handleBack();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [handleBack]);

  const handleSendStudyMessage = useCallback(async (message: string) => {
    const newHistory: StudyMessage[] = [...studyAssistantMessages, { role: 'user', parts: [{ text: message }] }];
    setStudyAssistantMessages(newHistory);
    setIsAiThinking(true);
    try {
      const response = await api.getAIStudyResponse(newHistory);
      setStudyAssistantMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: response.text }], 
        sources: response.sources 
      }]);
    } catch (error) {
      showToast("Assistant could not respond. Please try again.", "error");
    } finally {
      setIsAiThinking(false);
    }
  }, [studyAssistantMessages, showToast]);

  const handleEnrollSkill = (id: number) => {
    setSkillClasses(prev => prev.map(c => c.id === id ? { ...c, isEnrolled: true, studentsEnrolled: (c.studentsEnrolled || 0) + 1 } : c));
    showToast("Enrolled in Skill Class successfully!");
  };

  const handleEnrollGuidance = (id: number) => {
    setGuidanceClasses(prev => prev.map(c => c.id === id ? { ...c, isEnrolled: true, studentsEnrolled: (c.studentsEnrolled || 0) + 1 } : c));
    showToast("Enrolled in Guidance Session successfully!");
  };

  const handleJoinLiveClass = useCallback((cls: LiveClass) => {
    // If teacher or admin, enter directly
    if (userRole === 'teacher' || userRole === 'admin') {
      setActiveLiveClass(cls);
      return;
    }

    // Check if enrolled
    const isEnrolled = Boolean(cls.isEnrolled || enrolledLiveClassIds.includes(cls.id));
    if (isEnrolled) {
      setActiveLiveClass({ ...cls, isEnrolled: true });
    } else {
      // Must enroll and pay before entering
      setClassForPayment(cls);
    }
  }, [userRole, enrolledLiveClassIds]);

  const handleLiveClassPaymentSuccess = useCallback((receipt?: any) => {
    if (!classForPayment) return;
    const target = classForPayment;
    const updatedIds = Array.from(new Set([...enrolledLiveClassIds, target.id]));
    setEnrolledLiveClassIds(updatedIds);
    try {
      localStorage.setItem('future_legacy_enrolled_live_classes', JSON.stringify(updatedIds));
    } catch {}

    setLiveClasses(prev => prev.map(c => c.id === target.id ? {
      ...c,
      isEnrolled: true,
      viewerCount: (c.viewerCount || 0) + 1,
      enrolledStudents: [...(c.enrolledStudents || []), currentUser?.id || 'student']
    } : c));

    const activatedClass: LiveClass = {
      ...target,
      isEnrolled: true,
      viewerCount: (target.viewerCount || 0) + 1
    };

    setClassForPayment(null);
    showToast(`🎉 Payment Verified! Enrolled in "${target.title}". Entering live room...`, 'success');
    setActiveLiveClass(activatedClass);
  }, [classForPayment, enrolledLiveClassIds, currentUser, showToast]);

  const handleSaveMentorProfile = (data: any) => {
    setMentors(prev => [...prev, { ...data, id: Date.now(), followers: 0, isFollowed: false }]);
    setIsMentorModalOpen(false);
  };

  const handleSaveAgroProf = (data: any, id?: number) => {
    setAgroProfessionals(prev => id ? prev.map(p => p.id === id ? { ...p, ...data } : p) : [...prev, { ...data, id: Date.now(), documents: [] }]);
    setIsAgroProfModalOpen(false);
  };

  const handleSendNotification = (msg: string, media?: any, scheduled?: any) => {
    setNotifications(prev => [{ id: Date.now(), message: msg, timestamp: scheduled || new Date().toISOString(), read: false, mediaUrl: media?.url, mediaType: media?.type }, ...prev]);
    setIsNotificationModalOpen(false);
  };

  const handleSaveSchedule = (data: any) => {
    setSchedules(prev => [...prev, { ...data, id: Date.now() }]);
    setIsScheduleModalOpen(false);
  };

  const handleSaveGuidanceClass = (data: any, id?: number) => {
    setGuidanceClasses(prev => id 
      ? prev.map(c => c.id === id ? { ...c, ...data } : c) 
      : [...prev, { ...data, id: Date.now(), isEnrolled: false, studentsEnrolled: 0 }]
    );
    setIsGuidanceModalOpen(false);
    showToast("Guidance Session scheduled!");
  };

  const handleSaveAssignment = (data: any) => {
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: data.title || 'New Assignment',
      description: data.instructions || data.objective || 'Complete assigned exercises',
      isCompleted: false,
      dueDate: data.dueDate || 'Next Week'
    }]);
    setIsAssignmentModalOpen(false);
    showToast("Assignment published to students!");
  };

  const handleSwitchUserRole = (newRole: any) => {
    if (newRole === 'role-selection') {
      navigateAuth('role-selection');
      return;
    }
    setUserRole(newRole as UserRole);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole as UserRole };
      setCurrentUser(updated);
      try {
        localStorage.setItem('future_legacy_user', JSON.stringify(updated));
      } catch {}
    }
    showToast(`Role switched to ${(newRole as string).toUpperCase()}`);
  };

  const renderPage = () => {
    // Strict Role Isolation for Farmer: Only farmer-specific modules accessible
    if (userRole === 'farmer' && !['Home', 'Agro Future', 'Chat', 'Settings', 'Emergency Help'].includes(currentPage)) {
      return (
        <AgroFuturePage 
          agroClasses={agroClasses} 
          agroProfessionals={agroProfessionals} 
          userRole="farmer" 
          currentUser={currentUser!} 
          onGetAgriBotAnalysis={handleGetAgriBotAnalysis} 
          agriBotAnalysis={agriBotAnalysis} 
          isAgriBotLoading={isAgriBotLoading} 
          onGenerateAgriBotVideo={handleGenerateAgriBotVideo}
        />
      );
    }

    switch (currentPage) {
      case 'Home': return (
        <HomePage 
          onNavigate={handleNavigate} 
          mentors={mentors} 
          liveClasses={liveClasses} 
          tasks={tasks}
          userRole={userRole}
          onSwitchRole={handleSwitchUserRole}
          currentUser={currentUser!}
          onJoinLiveClass={handleJoinLiveClass}
          onStartMockTest={(t) => {
            setActiveMockTest(t);
          }}
          agroClasses={agroClasses}
          agroProfessionals={agroProfessionals}
          onOpenCreateLiveModal={() => setIsCreateLiveModalOpen(true)}
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
          onOpenSkillModal={() => setIsSkillModalOpen(true)}
          onOpenGuidanceModal={() => setIsGuidanceModalOpen(true)}
          onOpenLibraryModal={() => setIsLibraryModalOpen(true)}
          onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
          onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)}
          onOpenWhiteboardModal={() => setIsWhiteboardModalOpen(true)}
          onOpenMentorModal={() => setIsMentorModalOpen(true)}
        />
      );
      case 'AI Personalised Study Assistant': return <AIPersonalisedStudyAssistantPage 
        currentUser={currentUser!} messages={studyAssistantMessages} isAiThinking={isAiThinking} onSendMessage={handleSendStudyMessage} showToast={showToast} isReviseModeEnabled={isReviseModeEnabled} onToggleReviseMode={() => setIsReviseModeEnabled(!isReviseModeEnabled)} isGeneratingRevision={isGeneratingRevision} onGenerateRevisionSuggestion={() => {}} revisionSuggestion={revisionSuggestion} onStartRevisionQuiz={() => {}} onDeclineRevisionQuiz={() => {}}
      />;
      case 'Education & Guidance': return <EducationGuidancePage 
        guidanceClasses={guidanceClasses} skillClasses={skillClasses} userRole={userRole} currentUser={currentUser!} onEnrollGuidance={handleEnrollGuidance} onEnrollSkill={handleEnrollSkill} onSaveGuidance={() => {}} onSaveSkill={() => {}} onAddReview={() => {}}
      />;
      case 'Agro Future': return <AgroFuturePage 
        agroClasses={agroClasses} agroProfessionals={agroProfessionals} userRole={userRole || 'student'} currentUser={currentUser!} onGetAgriBotAnalysis={handleGetAgriBotAnalysis} agriBotAnalysis={agriBotAnalysis} isAgriBotLoading={isAgriBotLoading} onGenerateAgriBotVideo={handleGenerateAgriBotVideo}
      />;
      case 'Skill Classes': return (
        <div className="space-y-12">
            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl text-blue-400 text-[10px] font-black uppercase text-center tracking-widest">
                Redirect Node: Skill Classes are now optimized within the Education & Guidance Hub.
            </div>
            <SkillClassesPage skillClasses={skillClasses} userRole={userRole} currentUser={currentUser!} onSaveClass={handleSaveSkillClass} onEnroll={handleEnrollSkill} />
        </div>
      );
      case 'Science and Concept Visualizer': return <LabPage showToast={showToast} />;
      case 'Chat': return <ChatPage mentors={mentors} groups={groups} messages={messages} allUsers={users} currentUserId={currentUser?.id || ''} activeConversationId={activeConversationId} onSelectChat={setActiveConversationId} onSendMessage={() => {}} onBack={() => setActiveConversationId(null)} typingIndicators={typingIndicators} onDeleteConversation={() => {}} onCreateConversation={() => {}} onDeleteMessage={() => {}} userRole={userRole} />;
      case 'My Tasks': return <TaskPage tasks={tasks} userRole={userRole} onToggle={() => {}} onDelete={() => {}} onSave={handleSaveTask} currentUser={currentUser!} />;
      case 'Class Schedule': return <ClassSchedulePage schedules={schedules} userRole={userRole} onSave={() => setIsScheduleModalOpen(true)} onPlayMedia={(m) => showToast(`Playing ${m.type}`)} skillClasses={skillClasses} agroClasses={agroClasses} guidanceClasses={guidanceClasses} />;
      case 'Media Library': return <MediaLibraryPage recordings={recordings} onDelete={handleDeleteRecording} userRole={userRole} />;
      case 'Settings': return <SettingsPage 
        currentUser={currentUser!} 
        userRole={userRole} 
        onRoleChange={setUserRole} 
        mentors={mentors} 
        onEditProfile={() => setIsMentorModalOpen(true)} 
        onUpdateProfile={handleUpdateProfile} 
        notificationPreferences={notificationPreferences} 
        onUpdatePreferences={setNotificationPreferences} 
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)} 
        showToast={showToast}
        localizationSettings={localizationSettings}
        onUpdateLocalization={setLocalizationSettings}
        onLogout={() => {
          try {
            localStorage.removeItem('future_legacy_user');
          } catch {}
          setIsLoggedIn(false);
          navigateAuth('role-selection');
          showToast("Logged out successfully. 1-Click Instant Enter is now enabled for quick return.");
        }}
      />;
      case 'Emergency Help': return <EmergencyHelpPage />;
      case 'Discussion Forum': return <DiscussionForumPage posts={forumPosts} onAddPost={() => {}} onAddReply={() => {}} />;
      case 'E-Library': return <ELibraryPage items={libraryItems} onSave={handleSaveLibraryItem} userRole={userRole} skillClasses={skillClasses} agroClasses={agroClasses} />;
      case 'All Live Classes': return <LiveClassesPage liveClasses={liveClasses} onJoinClass={handleJoinLiveClass} onCreateClass={() => setIsCreateLiveModalOpen(true)} userRole={userRole} />;
      case 'Learn with Podcast': return <PodcastLearningPage />;
      case 'All India Mock Test': return <AllIndiaMockTestPage currentUser={currentUser!} onStartTest={setActiveMockTest} />;
      case 'Advanced AI Studio': return <AdvancedAIHub />;
      case 'Complete Courses': return <CompleteCoursesPage currentUser={currentUser} />;
      case 'Study Material': return <StudyMaterialPage userRole={userRole} currentUser={currentUser!} onNavigate={handleNavigate} />;
      case 'Batch Manager': return <BatchManager currentUser={currentUser!} showToast={showToast} onBack={() => handleNavigate('Home')} />;
      default: return (
        <HomePage 
          onNavigate={handleNavigate} 
          mentors={mentors} 
          liveClasses={liveClasses} 
          tasks={tasks} 
          userRole={userRole}
          onSwitchRole={handleSwitchUserRole}
          currentUser={currentUser}
          onJoinLiveClass={handleJoinLiveClass}
          onStartMockTest={setActiveMockTest}
          agroClasses={agroClasses}
          agroProfessionals={agroProfessionals}
          onOpenCreateLiveModal={() => setIsCreateLiveModalOpen(true)}
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
          onOpenSkillModal={() => setIsSkillModalOpen(true)}
          onOpenGuidanceModal={() => setIsGuidanceModalOpen(true)}
          onOpenLibraryModal={() => setIsLibraryModalOpen(true)}
          onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
          onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)}
          onOpenWhiteboardModal={() => setIsWhiteboardModalOpen(true)}
          onOpenMentorModal={() => setIsMentorModalOpen(true)}
        />
      );
    }
  };

  const handleSaveTask = useCallback((data: any, id?: number) => {
    setTasks(prev => id ? prev.map(t => t.id === id ? { ...t, ...data } : t) : [...prev, { ...data, id: Date.now(), isCompleted: false }]);
    showToast("Task authorized.");
  }, [showToast]);

  const handleGetAgriBotAnalysis = useCallback(async (media: any, q: string, loc: string, lang: string) => {
    setIsAgriBotLoading(true);
    try {
      const res = await api.getAgriBotAnalysis(media, q, loc, lang);
      setAgriBotAnalysis(res);
      showToast("Diagnostic analysis complete.");
    } catch (e) {
      showToast("Diagnostic failure.", "error");
    } finally {
      setIsAgriBotLoading(false);
    }
  }, [showToast]);

  const handleGenerateAgriBotVideo = useCallback(async (findings: string, lang: string) => {
    if (!window.aistudio) return;
    showToast("Synthesizing instructional asset...");
  }, [showToast]);

  const handleSaveLibraryItem = (data: any, id?: number) => {
    setLibraryItems(prev => id ? prev.map(i => i.id === id ? { ...i, ...data } : i) : [...prev, { ...data, id: Date.now() }]);
  };

  const handleUpdateProfile = (user: User) => {
    setCurrentUser(user);
    showToast("Identity Matrix synchronized.");
  };

  const handleDeleteRecording = (id: number) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    showToast("Asset purged.");
  };

  const handleSaveSkillClass = (data: any, id?: number) => {
    setSkillClasses(prev => id ? prev.map(c => c.id === id ? { ...c, ...data } : c) : [...prev, { ...data, id: Date.now(), isEnrolled: false, studentsEnrolled: 0 }]);
    setIsSkillModalOpen(false);
    showToast("Skill Class published successfully!");
  };

  const handleSaveRecording = (blob: Blob, type: any) => {
    if (!currentUser) return;
    const newRec: SavedRecording = { id: Date.now(), userId: currentUser.id, title: "Archive Item", url: URL.createObjectURL(blob), type, timestamp: new Date().toISOString(), blob };
    setRecordings(prev => [newRec, ...prev]);
  };

  const handleDirectEnter = (role: UserRole = 'student') => {
    if (!hasEverLoggedIn) {
      showToast("🔒 Pehle ek baar login karna zaroori hai! Kripya Role select karke Login karein.");
      navigateAuth('role-selection');
      return;
    }

    let existingUser: User | null = null;
    try {
      const lastUserStr = localStorage.getItem('future_legacy_last_user');
      if (lastUserStr) existingUser = JSON.parse(lastUserStr);
    } catch {}

    const defaultUser: User = {
      id: existingUser?.id || ('u_' + role + '_' + Date.now()),
      name: existingUser?.name || (role === 'teacher' ? 'Prof. Shourya Patel' : role === 'farmer' ? 'Kisan Mitr (Shourya)' : 'Shourya Patel'),
      mobileNumber: existingUser?.mobileNumber || '+91 98765 43210',
      email: existingUser?.email || 'spal89374800@gmail.com',
      imageUrl: existingUser?.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=3b82f6,6366f1`,
      role: role,
      studentClass: existingUser?.studentClass || (role === 'student' ? 'Class 12th (Board & Entrance)' : undefined),
      courseName: existingUser?.courseName || (role === 'student' ? 'NEET UG' : undefined),
      isPhoneVerified: true,
      isEmailVerified: true
    };
    setUserRole(role);
    setCurrentUser(defaultUser);
    setIsLoggedIn(true);
    setHasEverLoggedIn(true);
    try {
      localStorage.setItem('future_legacy_user', JSON.stringify(defaultUser));
      localStorage.setItem('future_legacy_last_user', JSON.stringify(defaultUser));
      localStorage.setItem('future_legacy_has_logged_in_once', 'true');
    } catch {}
    navigateAuth('app');
    showToast(`⚡ Instant 1-Click Enter! Welcome back, ${defaultUser.name}.`);
  };

  const handleSelectRoleAndEnter = (role: UserRole) => {
    if (!hasEverLoggedIn) {
      showToast("🔒 Pehle ek baar login karna zaroori hai! Kripya pehle Login complete karein.");
      if (role === 'student') navigateAuth('student-login');
      else if (role === 'teacher') navigateAuth('teacher-login');
      else if (role === 'farmer') navigateAuth('farmer-login');
      else navigateAuth('role-selection');
      return;
    }
    handleDirectEnter(role);
  };

  const handleCreateLiveClass = (data: any) => {
    setLiveClasses(prev => [{ ...data, id: Date.now(), viewerCount: 0, startTime: new Date().toISOString() }, ...prev]);
    setIsCreateLiveModalOpen(false);
  };

  if (authStep !== 'app') {
    return (
      <div 
        className="w-full min-h-screen min-h-[100dvh] bg-[#050713] flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto custom-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="w-full flex-1 flex flex-col justify-start items-center">
          {authStep === 'splash' && (
            <SplashScreen 
              onGetStarted={() => {
                navigateAuth('role-selection');
              }} 
              onDirectEnter={(role) => handleDirectEnter(role || 'student')}
            />
          )}
          {authStep === 'login' && (
            <LoginScreen 
              initialUserEmail="spal89374800@gmail.com"
              hasEverLoggedIn={hasEverLoggedIn}
              onLogin={(creds) => {
                if (creds) {
                  setPendingAuthData(prev => ({
                    ...prev,
                    mobileNumber: creds.mobileNumber || prev.mobileNumber,
                    email: creds.email || prev.email,
                    name: creds.name || prev.name,
                    isPhoneVerified: creds.isPhoneVerified ?? prev.isPhoneVerified,
                    isEmailVerified: creds.isEmailVerified ?? prev.isEmailVerified,
                  }));
                }
                setHasEverLoggedIn(true);
                try {
                  localStorage.setItem('future_legacy_has_logged_in_once', 'true');
                } catch {}
                navigateAuth('role-selection');
              }} 
              onDirectEnter={hasEverLoggedIn ? () => handleSelectRoleAndEnter('student') : undefined}
              onBack={() => navigateAuth('splash')}
            />
          )}
          {authStep === 'role-selection' && (
            <RoleSelectionScreen 
              onSelectRole={(r) => {
                if (r === 'student') navigateAuth('student-login');
                else if (r === 'teacher') navigateAuth('teacher-login');
                else if (r === 'farmer') navigateAuth('farmer-login');
                else navigateAuth('student-login');
              }} 
              onBack={() => navigateAuth('splash')}
              onBackToSplash={() => navigateAuth('splash')}
              onReturnToApp={isLoggedIn ? () => navigateAuth('app') : undefined}
              hasExistingSession={isLoggedIn}
              hasEverLoggedIn={true}
              lastUser={currentUser}
              onDirectEnter={(role) => {
                handleDirectEnter(role || 'student');
              }}
              onLockedDirectEnterClick={() => {
                handleDirectEnter('student');
              }}
            />
          )}
          {authStep === 'student-login' && (
            <StudentLoginScreen
              defaultName={pendingAuthData.name || currentUser?.name || 'Shourya Patel'}
              defaultPhone={pendingAuthData.mobileNumber?.replace(/\D/g, '').slice(-10) || currentUser?.mobileNumber?.replace(/\D/g, '').slice(-10) || '9876543210'}
              onBack={() => navigateAuth('role-selection')}
              onDirectEnter={() => handleDirectEnter('student')}
              onLoginSuccess={(studentData) => {
                const newStudent: User = {
                  id: 'u_student_' + Date.now(),
                  name: studentData.name,
                  mobileNumber: studentData.mobileNumber,
                  email: pendingAuthData.email || 'spal89374800@gmail.com',
                  isPhoneVerified: true,
                  isEmailVerified: true,
                  studentClass: studentData.studentClass,
                  courseName: studentData.courseName,
                  imageUrl: studentData.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${studentData.name}&backgroundColor=0d9488,3b82f6`,
                  role: 'student'
                };
                setUserRole('student');
                setCurrentUser(newStudent);
                setIsLoggedIn(true);
                setHasEverLoggedIn(true);
                try {
                  localStorage.setItem('future_legacy_user', JSON.stringify(newStudent));
                  localStorage.setItem('future_legacy_last_user', JSON.stringify(newStudent));
                  localStorage.setItem('future_legacy_has_logged_in_once', 'true');
                } catch {}
                navigateAuth('app');
                showToast(`Welcome ${studentData.name}! Student Dashboard active for ${studentData.studentClass}`);
              }}
            />
          )}
          {authStep === 'teacher-login' && (
            <TeacherLoginScreen
              defaultName={pendingAuthData.name?.includes('Prof') ? pendingAuthData.name : (currentUser?.name?.includes('Prof') ? currentUser.name : 'Prof. Shourya Patel')}
              defaultPhone={pendingAuthData.mobileNumber?.replace(/\D/g, '').slice(-10) || currentUser?.mobileNumber?.replace(/\D/g, '').slice(-10) || '9876543210'}
              hasEverLoggedIn={true}
              onBack={() => navigateAuth('role-selection')}
              onDirectEnter={() => handleDirectEnter('teacher')}
              onLoginSuccess={(teacherData) => {
                const newTeacher: User = {
                  id: 'u_teacher_' + Date.now(),
                  name: teacherData.name,
                  mobileNumber: teacherData.mobileNumber,
                  email: pendingAuthData.email || 'spal89374800@gmail.com',
                  isPhoneVerified: true,
                  isEmailVerified: true,
                  qualifications: teacherData.qualifications,
                  collegeOrUniversity: teacherData.collegeOrUniversity,
                  teachingSubject: teacherData.teachingSubject,
                  experience: teacherData.experience,
                  bio: teacherData.bio,
                  imageUrl: teacherData.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${teacherData.name}&backgroundColor=7c3aed,4f46e5`,
                  role: 'teacher'
                };
                setUserRole('teacher');
                setCurrentUser(newTeacher);
                setIsLoggedIn(true);
                setHasEverLoggedIn(true);
                setMentors(prev => [{
                  id: Date.now(),
                  name: teacherData.name,
                  role: `${teacherData.teachingSubject} Faculty (${teacherData.qualifications})`,
                  experience: teacherData.experience,
                  about: teacherData.bio || `Certified faculty from ${teacherData.collegeOrUniversity}.`,
                  imageUrl: newTeacher.imageUrl,
                  isFeatured: true,
                  followers: 182,
                  isFollowed: false,
                  socials: { linkedin: '', twitter: '', website: '' }
                }, ...prev]);
                try {
                  localStorage.setItem('future_legacy_user', JSON.stringify(newTeacher));
                  localStorage.setItem('future_legacy_last_user', JSON.stringify(newTeacher));
                  localStorage.setItem('future_legacy_has_logged_in_once', 'true');
                } catch {}
                navigateAuth('app');
                showToast(`Welcome ${teacherData.name}! Teacher Studio & Class Broadcast Deck active.`);
              }}
            />
          )}
          {authStep === 'farmer-login' && (
            <FarmerLoginScreen
              defaultName={pendingAuthData.name || currentUser?.name || 'Kisan Mitr (Shourya)'}
              defaultPhone={pendingAuthData.mobileNumber?.replace(/\D/g, '').slice(-10) || currentUser?.mobileNumber?.replace(/\D/g, '').slice(-10) || '9876543210'}
              onBack={() => navigateAuth('role-selection')}
              onDirectEnter={() => handleDirectEnter('farmer')}
              onLoginSuccess={(farmerData) => {
                const newFarmer: User = {
                  id: 'u_farmer_' + Date.now(),
                  name: farmerData.name,
                  mobileNumber: farmerData.mobileNumber,
                  email: pendingAuthData.email || 'spal89374800@gmail.com',
                  isPhoneVerified: true,
                  isEmailVerified: true,
                  imageUrl: farmerData.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${farmerData.name}&backgroundColor=059669,10b981`,
                  role: 'farmer'
                };
                setUserRole('farmer');
                setCurrentUser(newFarmer);
                setIsLoggedIn(true);
                setHasEverLoggedIn(true);
                try {
                  localStorage.setItem('future_legacy_user', JSON.stringify(newFarmer));
                  localStorage.setItem('future_legacy_last_user', JSON.stringify(newFarmer));
                  localStorage.setItem('future_legacy_has_logged_in_once', 'true');
                } catch {}
                navigateAuth('app');
                showToast(`Welcome ${farmerData.name}! Kisan Agro Innovation Hub active.`);
              }}
            />
          )}
          {authStep === 'registration' && (
            userRole === 'teacher' ? (
              <TeacherRegistrationForm 
                initialData={pendingAuthData}
                onComplete={(data) => {
                  const newUser: User = { 
                    id: 'u_teacher_' + Date.now(), 
                    name: data.name, 
                    mobileNumber: data.mobileNumber, 
                    email: pendingAuthData.email,
                    isPhoneVerified: pendingAuthData.isPhoneVerified,
                    isEmailVerified: pendingAuthData.isEmailVerified,
                    imageUrl: data.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${data.name || 'Educator'}&backgroundColor=6366f1,3b82f6`, 
                    role: 'teacher' 
                  };
                  setCurrentUser(newUser);
                  setHasEverLoggedIn(true);
                  try {
                    localStorage.setItem('future_legacy_user', JSON.stringify(newUser));
                    localStorage.setItem('future_legacy_last_user', JSON.stringify(newUser));
                    localStorage.setItem('future_legacy_has_logged_in_once', 'true');
                  } catch {}
                  setMentors(prev => [{
                    id: Date.now(),
                    name: data.name,
                    role: data.role || 'Educator & Pedagogical Architect',
                    experience: data.experience || '5+ Years',
                    about: data.about || 'Certified educator guiding students with supreme pedagogical mastery.',
                    imageUrl: newUser.imageUrl,
                    isFeatured: data.isFeatured || true,
                    followers: 142,
                    isFollowed: false,
                    socials: data.socials
                  }, ...prev]);
                  setIsLoggedIn(true);
                  navigateAuth('app');
                }}
                onBack={() => navigateAuth('role-selection')}
              />
            ) : (
              <StudentRegistrationForm 
                userRole={userRole === 'farmer' ? 'farmer' : 'student'}
                initialData={pendingAuthData}
                onComplete={(data) => { 
                  const newUser: User = { 
                    id: 'u_' + Date.now(), 
                    name: data.fullName, 
                    mobileNumber: data.mobileNumber, 
                    email: data.email || pendingAuthData.email,
                    isPhoneVerified: data.isPhoneVerified ?? pendingAuthData.isPhoneVerified,
                    isEmailVerified: data.isEmailVerified ?? pendingAuthData.isEmailVerified,
                    imageUrl: data.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${data.fullName || (userRole === 'farmer' ? 'Kisan' : 'User')}&backgroundColor=0d9488,3b82f6`, 
                    role: userRole 
                  };
                  setCurrentUser(newUser); 
                  setHasEverLoggedIn(true);
                  try {
                    localStorage.setItem('future_legacy_user', JSON.stringify(newUser));
                    localStorage.setItem('future_legacy_last_user', JSON.stringify(newUser));
                    localStorage.setItem('future_legacy_has_logged_in_once', 'true');
                  } catch {}
                  setIsLoggedIn(true);
                  navigateAuth('app');
                }} 
                onBack={() => navigateAuth('role-selection')} 
              />
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <>
        <Layout 
          currentPage={currentPage} 
          userRole={userRole} 
          currentUser={currentUser} 
          navigationHistory={navigationHistory} 
          notifications={notifications} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          onNavigate={handleNavigate} 
          onBack={handleBack} 
          globalSearchQuery={globalSearchQuery} 
          setGlobalSearchQuery={setGlobalSearchQuery} 
          onOpenBroadcast={() => setIsNotificationModalOpen(true)}
          onSwitchRole={() => navigateAuth('role-selection')}
          onOpenLogin={() => navigateAuth('login')}
        >
            <SafePageBoundary pageName={currentPage} onHome={() => handleNavigate('Home')}>
              {renderPage()}
            </SafePageBoundary>
            {isMentorModalOpen && <MentorFormModal mentor={null} onClose={() => setIsMentorModalOpen(false)} onSave={handleSaveMentorProfile} />}
            {isAgroProfModalOpen && <AgroProfessionalFormModal professional={null} onClose={() => setIsAgroProfModalOpen(false)} onSave={handleSaveAgroProf} />}
            {isNotificationModalOpen && <SendNotificationModal onClose={() => setIsNotificationModalOpen(false)} onSend={handleSendNotification} onSaveRecording={handleSaveRecording} />}
            {isScheduleModalOpen && <ScheduleFormModal onClose={() => setIsScheduleModalOpen(false)} onSave={handleSaveSchedule} onSaveRecording={handleSaveRecording} skillClasses={skillClasses} agroClasses={agroClasses} guidanceClasses={guidanceClasses} />}
            {isSkillModalOpen && <SkillClassFormModal skillClass={null} onClose={() => setIsSkillModalOpen(false)} onSave={handleSaveSkillClass} currentUser={currentUser!} />}
            {isGuidanceModalOpen && <GuidanceClassFormModal guidanceClass={null} onClose={() => setIsGuidanceModalOpen(false)} onSave={handleSaveGuidanceClass} currentUser={currentUser!} />}
            {isLibraryModalOpen && <LibraryFormModal item={null} onClose={() => setIsLibraryModalOpen(false)} onSave={handleSaveLibraryItem} skillClasses={skillClasses} agroClasses={agroClasses} />}
            {isAssignmentModalOpen && <AssignmentModal onClose={() => setIsAssignmentModalOpen(false)} onSave={handleSaveAssignment} />}
            {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} onSubmit={() => setIsFeedbackModalOpen(false)} />}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </Layout>
        {isWhiteboardModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Teacher Interactive Whiteboard</h3>
                  <p className="text-xs text-slate-400">Live pedagogical drawing canvas for derivations & formulas</p>
                </div>
              </div>
              <button 
                onClick={() => setIsWhiteboardModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase cursor-pointer transition-colors"
              >
                ✕ Close Whiteboard
              </button>
            </div>
            <div className="flex-1 mt-4 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex flex-col">
              <Whiteboard 
                elements={whiteboardElements} 
                onElementsUpdate={setWhiteboardElements} 
                activeTool="pen" 
                strokeColor="#38bdf8" 
                strokeWidth={3} 
                isTeacher={true} 
              />
            </div>
          </div>
        )}
        {activeLiveClass && (
          <LiveClassView 
            classData={{
              ...activeLiveClass,
              isEnrolled: userRole === 'teacher' || userRole === 'admin' || Boolean(activeLiveClass.isEnrolled || enrolledLiveClassIds.includes(activeLiveClass.id))
            }} 
            currentUser={currentUser!} 
            userClassRole={userRole === 'teacher' ? 'teacher' : 'student'} 
            participants={users} 
            onExit={() => setActiveLiveClass(null)} 
            showToast={showToast} 
            onEnrollAndPay={(cls) => setClassForPayment(cls)}
          />
        )}
        {classForPayment && (
          <PaymentModal
            itemName={`Live Class Pass: ${classForPayment.title}`}
            amount={classForPayment.price || 499}
            category="Live Class Enrollment Pass"
            onClose={() => setClassForPayment(null)}
            onPaymentSuccess={handleLiveClassPaymentSuccess}
          />
        )}
        {activeMockTest && <MockTestView test={activeMockTest} currentUser={currentUser!} onComplete={() => setActiveMockTest(null)} onExit={() => setActiveMockTest(null)} />}
        {isCreateLiveModalOpen && <CreateLiveClassModal onClose={() => setIsCreateLiveModalOpen(false)} onSave={handleCreateLiveClass} currentUser={currentUser!} />}
    </>
  );
};

export default App;