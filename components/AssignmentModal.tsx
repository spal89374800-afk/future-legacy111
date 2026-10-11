import React from 'react';
import { CreateAssignmentModal } from './assignments/CreateAssignmentModal.tsx';
import type { AssignmentItem } from '../types.ts';

interface AssignmentModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  currentUser?: any;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ onClose, onSave, currentUser }) => {
  const teacherUser = currentUser || {
    id: 't_faculty',
    name: 'Prof. Shourya Patel',
    role: 'teacher'
  };

  const handleSave = (assignment: AssignmentItem) => {
    try {
      const existing = localStorage.getItem('future_legacy_assignments_v1');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('future_legacy_assignments_v1', JSON.stringify([assignment, ...list]));
    } catch {}

    onSave({
      title: assignment.title,
      description: assignment.message,
      dueDate: assignment.deadline
    });
    onClose();
  };

  return (
    <CreateAssignmentModal
      currentUser={teacherUser}
      onClose={onClose}
      onSave={handleSave}
    />
  );
};

export default AssignmentModal;
