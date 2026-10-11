
import React from 'react';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  MessageSquare, 
  Calendar, 
  Library, 
  Sprout, 
  Cpu, 
  Settings, 
  Award, 
  Users, 
  HelpCircle,
  FlaskConical,
  Video,
  Trophy,
  Radio
} from 'lucide-react';
import { Page } from './types.ts';

interface NavLink {
  name: Page;
  icon: React.ReactNode;
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', icon: <Home /> },
  { name: 'AI Personalised Study Assistant', icon: <Cpu /> },
  { name: 'Agro Future', icon: <Sprout /> },
  { name: 'Skill Classes', icon: <Award /> },
  { name: 'Education & Guidance', icon: <BookOpen /> },
  { name: 'My Tasks', icon: <CheckSquare /> },
  { name: 'Chat', icon: <MessageSquare /> },
  { name: 'All India Mock Test', icon: <Trophy /> },
  { name: 'Class Schedule', icon: <Calendar /> },
  { name: 'Discussion Forum', icon: <Users /> },
  { name: 'E-Library', icon: <Library /> },
  { name: 'Science and Concept Visualizer', icon: <FlaskConical /> },
  { name: 'All Live Classes', icon: <Video /> },
  { name: 'Learn with Podcast', icon: <Radio /> },
  { name: 'Media Library', icon: <Video /> },
  { name: 'Settings', icon: <Settings /> },
  { name: 'Emergency Help', icon: <HelpCircle /> },
];