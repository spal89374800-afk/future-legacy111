import React from 'react';
import { Award, Trophy, Star, Medal, CheckCircle2, Zap, Target, BookOpen } from 'lucide-react';
import { User } from '../types';

interface StudentAchievementProps {
  currentUser: User;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'course' | 'quiz' | 'assignment' | 'streak';
  icon: any;
  unlocked: boolean;
  progress?: { current: number; total: number };
  rewardXP: number;
}

export const StudentAchievement: React.FC<StudentAchievementProps> = ({ currentUser }) => {
  // Define badges earned by completing courses, quizzes, and assignments
  const badges: Badge[] = [
    {
      id: 'badge-1',
      title: 'Course Pioneer',
      description: 'Successfully completed your first complete recorded course',
      category: 'course',
      icon: BookOpen,
      unlocked: true,
      rewardXP: 500
    },
    {
      id: 'badge-2',
      title: 'Quiz Master',
      description: 'Achieved 90%+ score across 3 chapter test assessments',
      category: 'quiz',
      icon: Trophy,
      unlocked: true,
      rewardXP: 350
    },
    {
      id: 'badge-3',
      title: 'Assignment Ace',
      description: 'Submitted 5 graded homework assignments with AI evaluation',
      category: 'assignment',
      icon: Award,
      unlocked: true,
      rewardXP: 400
    },
    {
      id: 'badge-4',
      title: 'Curriculum Champion',
      description: 'Completed all modules in Advanced Physics & Mathematics',
      category: 'course',
      icon: Medal,
      unlocked: true,
      rewardXP: 750
    },
    {
      id: 'badge-5',
      title: 'Streak Legend',
      description: 'Maintain a 7-day active learning and quiz streak',
      category: 'streak',
      icon: Zap,
      unlocked: false,
      progress: { current: 5, total: 7 },
      rewardXP: 600
    },
    {
      id: 'badge-6',
      title: 'Elite Scholar',
      description: 'Enroll in 3+ complete courses and score top 5% in tests',
      category: 'course',
      icon: Star,
      unlocked: false,
      progress: { current: 2, total: 3 },
      rewardXP: 1000
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalXP = badges.filter(b => b.unlocked).reduce((acc, b) => acc + b.rewardXP, 0);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">Student Badges & Trophies</span>
              <span className="text-xs text-slate-400 font-bold">{unlockedCount} / {badges.length} Unlocked</span>
            </div>
            <h3 className="text-lg font-black font-montserrat text-white mt-1">Achievements & Milestone Badges</h3>
          </div>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <Star size={20} className="text-amber-400 fill-amber-400" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Earned XP</p>
            <p className="text-base font-black text-white font-montserrat">{totalXP.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <div 
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${badge.unlocked ? 'bg-slate-950/80 border-amber-500/30 shadow-lg shadow-amber-500/5' : 'bg-slate-950/30 border-white/5 opacity-70'}`}
            >
              {badge.unlocked && (
                <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${badge.unlocked ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    <Icon size={22} className="stroke-[2.5]" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${badge.unlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {badge.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white font-montserrat">{badge.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{badge.description}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs relative z-10">
                <span className="text-amber-400 font-bold">+{badge.rewardXP} XP</span>
                {badge.progress && !badge.unlocked ? (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{badge.progress.current}/{badge.progress.total}</span>
                  </div>
                ) : badge.unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Claimed
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
