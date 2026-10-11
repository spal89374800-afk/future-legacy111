import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, UserCheck } from 'lucide-react';
import { User } from '../types';

interface ContentSecurityWallProps {
  currentUser: User | null;
  requiredRole?: 'student' | 'teacher' | 'admin';
  courseId?: string;
  courseTeacherId?: string;
  isEnrolled?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

export const ContentSecurityWall: React.FC<ContentSecurityWallProps> = ({
  currentUser,
  requiredRole,
  courseTeacherId,
  isEnrolled,
  onBack,
  children
}) => {
  // 1. Check if user is logged in
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-red-500/30 rounded-[2.5rem] p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black font-montserrat text-white">Authentication Required</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Please sign in with your verified account to access this secure educational curriculum and course materials.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Return to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Check role restriction if specified
  if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-amber-500/30 rounded-[2.5rem] p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-600/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black font-montserrat text-white">Access Restricted by Security Wall</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This module requires <span className="text-amber-400 font-bold uppercase">{requiredRole}</span> role privileges. Your current profile role ({currentUser.role || 'Standard'}) does not match the required security policy.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Return to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Check course creator / instructor isolation mismatch
  if (courseTeacherId && currentUser.role === 'teacher' && courseTeacherId !== currentUser.id) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-red-500/30 rounded-[2.5rem] p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black font-montserrat text-white">Creator Ownership Mismatch</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Security policy violation: Instructors can only manage and edit courses created under their own teacher credentials.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Return to Courses
            </button>
          )}
        </div>
      </div>
    );
  }

  // All checks passed
  return <>{children}</>;
};

// Higher-Order Component (HOC) wrapper
export function withContentSecurityWall<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: 'student' | 'teacher' | 'admin'
) {
  return function ProtectedComponent(props: P & { currentUser: User | null; courseTeacherId?: string; onBack?: () => void }) {
    const { currentUser, courseTeacherId, onBack, ...rest } = props;
    return (
      <ContentSecurityWall
        currentUser={currentUser}
        requiredRole={requiredRole}
        courseTeacherId={courseTeacherId}
        onBack={onBack}
      >
        <WrappedComponent {...(rest as P)} />
      </ContentSecurityWall>
    );
  };
}
