
import type {
  Mentor,
  User,
  Group,
  ChatMessage,
  Task,
  AppNotification,
  SkillClass,
  GuidanceClass,
  AgroClass,
  AgroProfessional,
  ClassSchedule,
  ForumPost,
  LibraryItem,
  LiveClass
} from './types';


const MOCK_MENTORS: Mentor[] = [
    {
        id: 1,
        name: 'Dr. APJ Abdul Kalam',
        role: 'Aerospace Scientist & Visionary',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/1200px-A._P._J._Abdul_Kalam.jpg',
        about: 'Former President of India and the pioneer behind India\'s missile and space technology. A beloved educator who believed in the power of youth to change the world.',
        followers: 12500000,
        isFollowed: true,
        mobileNumber: '+91 9000000001',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
        id: 2,
        name: 'Sudha Murthy',
        role: 'Technologist & Philanthropist',
        imageUrl: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2015/09/01/Photos/sudha-k3UD--621x414@LiveMint.jpg',
        about: 'Chairperson of Infosys Foundation and a legendary storyteller. She has empowered thousands through her social work and educational initiatives.',
        followers: 8900000,
        isFollowed: false,
        mobileNumber: '+91 9000000002'
    }
];

const MOCK_USERS: User[] = [
    { id: 'u_elite_1', name: 'Alex Sterling', imageUrl: 'https://i.pravatar.cc/150?u=u_elite_1', mobileNumber: '+91 9000000001', role: 'teacher' },
    { id: 'u_elite_2', name: 'Sienna Vance', imageUrl: 'https://i.pravatar.cc/150?u=u_elite_2', mobileNumber: '+91 9000000002', role: 'student' },
];

const MOCK_GROUPS: Group[] = [
    { id: 'group-1', name: 'Quantum Physics Study Group', memberIds: ['u_elite_1', 'u_elite_2'], imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Quantum&backgroundColor=4f46e5' }
];

const MOCK_MESSAGES: ChatMessage[] = [
    { id: 1, conversationId: 'group-1', senderId: 'u_elite_1', timestamp: new Date(Date.now() - 60000).toISOString(), isRead: false, content: { type: 'text', text: 'Hey everyone, let\'s discuss chapter 3.' } },
    { id: 2, conversationId: 'group-1', senderId: 'u_elite_2', timestamp: new Date().toISOString(), isRead: false, content: { type: 'text', text: 'Sounds good! I had a few questions.' } },
];

const MOCK_TASKS: Task[] = [
    { id: 1, title: 'Complete Physics Chapter 3', description: 'Read and summarize the key concepts of thermodynamics.', isCompleted: false, dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
    { id: 2, title: 'Review last lecture notes', description: 'Go over the notes from Dr. Sterling\'s lecture on quantum mechanics.', isCompleted: true, dueDate: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
    { id: 1, message: 'New live class "Intro to Quantum Computing" has started!', timestamp: new Date().toISOString(), read: false },
    { id: 2, message: 'Your assignment for Physics is due tomorrow.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
];

const MOCK_SKILL_CLASSES: SkillClass[] = [
    { 
        id: 1, 
        title: 'Algorithmic Financial Markets', 
        instructor: 'Sudha Murthy', 
        category: 'Finance', 
        rating: 4.9, 
        imageUrl: 'https://images.unsplash.com/photo-1611974714851-48206139d733?q=80&w=2070&auto=format&fit=crop',
        description: 'Master the high-stakes world of algorithmic trading and automated financial systems.',
        type: 'Course',
        studentsEnrolled: 1240, // Corrected to number
        maxStudents: 5000,
        isEnrolled: false, 
    }
];

const MOCK_GUIDANCE_CLASSES: GuidanceClass[] = [
    {
      id: 1,
      title: "UPSC Ethics & Case Studies",
      instructor: "Dr. APJ Abdul Kalam",
      category: "IAS",
      rating: 5.0,
      imageUrl: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=600",
      description: "Master the nuances of civil service ethics with visionary insights and real-world case analysis.",
      maxStudents: 100,
      studentsEnrolled: 45, // Corrected to number
      isEnrolled: false, 
    }
];

const MOCK_AGRO_CLASSES: AgroClass[] = [
    {
        id: 1,
        title: "Modern Hydroponics",
        instructor: "Rajesh Kumar",
        category: "Agriculture",
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600",
        studentsEnrolled: 78, // Corrected to number
        maxStudents: 150,
        isEnrolled: false, 
    }
];

const MOCK_AGRO_PROFESSIONALS: AgroProfessional[] = [
    {
        id: 1,
        name: "Dr. Meena Singh",
        qualifications: "PhD in Soil Science",
        bio: "Expert in sustainable farming and crop rotation techniques with over 15 years of field experience.",
        imageUrl: "https://i.pravatar.cc/150?u=agro1",
        documents: [],
        fees_individual: 2000,
        fees_batch: 10000,
        specialization: "Soil Health",
        availability: { days: "Mon - Fri", time: "10am - 4pm" },
        mobileNumber: "+91 9000000011",
        status: "Available",
    }
];

const MOCK_SCHEDULES: ClassSchedule[] = [
    {
      id: 1,
      title: "Quantum Lab Sync",
      author: "Dr. APJ Abdul Kalam",
      authorImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/1200px-A._P._J._Abdul_Kalam.jpg",
      timestamp: new Date().toISOString(),
      className: "Neural Architecture 101",
      scheduleTime: new Date(Date.now() + 86400000).toISOString(),
      text: "Global elite students, prepare your modules for a synchronized quantum simulation tomorrow. Ensure your bio-metric IDs are linked to the hub.",
      classType: 'skill',
      classId: 1
    }
];

const MOCK_FORUM_POSTS: ForumPost[] = [
    {
      id: 1,
      title: "Optimal Sowing Timeline for Sector 4",
      content: "Atmospheric benchmarks suggest shift in precipitation. Should we advance the wheat cycle by 14 days?",
      author: "Rajesh Kumar",
      authorImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=RK",
      timestamp: new Date().toISOString(),
      replies: []
    }
];

const MOCK_LIBRARY_ITEMS: LibraryItem[] = [
    {
        id: 1,
        title: "Quantum Neural Architecture",
        author: "Chief Architect Node",
        category: "Deep Tech",
        description: "Comprehensive blueprint for modular AI cognitive networks.",
        type: "Research Paper",
        fileUrl: "https://example.com/vault/node_alpha.pdf",
        coverImageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400",
        isProtected: false
    }
];

const MOCK_LIVE_CLASSES: LiveClass[] = [
    { 
      id: 1, 
      title: "Neural Synthesis & Brain-Computer Interfacing", 
      instructor: "Dr. Alex Sterling", 
      startTime: new Date().toISOString(), 
      viewerCount: 1240,
      price: 499,
      isEnrolled: false
    },
    { 
      id: 2, 
      title: "Target NEET 2026: Human Physiology & High-Yield NCERT Graphs", 
      instructor: "Dr. R. K. Sharma", 
      startTime: new Date(Date.now() + 3600000).toISOString(), 
      viewerCount: 1820,
      price: 599,
      isEnrolled: false
    },
    { 
      id: 3, 
      title: "Rotational Dynamics & Quantum Mechanics Topper Derivations", 
      instructor: "Prof. Priya Verma", 
      startTime: new Date(Date.now() + 7200000).toISOString(), 
      viewerCount: 940,
      price: 399,
      isEnrolled: false
    }
];

export const mockData = {
  mentors: MOCK_MENTORS,
  users: MOCK_USERS,
  groups: MOCK_GROUPS,
  messages: MOCK_MESSAGES,
  tasks: MOCK_TASKS,
  notifications: MOCK_NOTIFICATIONS,
  skillClasses: MOCK_SKILL_CLASSES,
  guidanceClasses: MOCK_GUIDANCE_CLASSES,
  agroClasses: MOCK_AGRO_CLASSES,
  agroProfessionals: MOCK_AGRO_PROFESSIONALS,
  schedules: MOCK_SCHEDULES,
  forumPosts: MOCK_FORUM_POSTS,
  libraryItems: MOCK_LIBRARY_ITEMS,
  liveClasses: MOCK_LIVE_CLASSES,
};