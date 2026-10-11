
import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface RevisionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  questions: QuizQuestion[];
}

const RevisionQuizModal: React.FC<RevisionQuizModalProps> = ({ isOpen, onClose, topic, questions }) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerSelect = (qIndex: number, option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[qIndex] = option;
    setUserAnswers(newAnswers);
  };

  const score = userAnswers.reduce((correct, answer, i) => (questions[i] && answer === questions[i].correctAnswer ? correct + 1 : correct), 0);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col">
        {/* Header */}
        <header className="p-4 border-b bg-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
                <h2 className="text-lg font-bold text-slate-800">Revision Quiz</h2>
                <p className="text-sm text-slate-500">Topic: {topic}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        {/* Quiz Content */}
        <main className="flex-grow p-4 overflow-y-auto">
           <div className="space-y-6">
              {isSubmitted && (
                <div className="p-4 bg-blue-100 border border-blue-200 text-blue-800 font-bold text-lg text-center rounded-lg sticky top-0 z-10">
                    Your Score: {score} / {questions.length}
                </div>
              )}
              {questions.map((q, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
                      <p className="font-semibold">{i + 1}. {q.question}</p>
                      <div className="mt-2 space-y-2">
                          {q.options.map(opt => {
                              const isSelected = userAnswers[i] === opt;
                              const isCorrect = q.correctAnswer === opt;
                              let styles = 'border-slate-300 hover:bg-slate-100';
                              if (isSubmitted) {
                                  if (isCorrect) styles = 'bg-green-100 border-green-400 text-green-800 font-semibold ring-2 ring-green-300';
                                  else if (isSelected) styles = 'bg-red-100 border-red-400 text-red-800';
                              } else if (isSelected) {
                                  styles = 'bg-blue-100 border-blue-400 ring-2 ring-blue-300';
                              }
                              return <button key={opt} onClick={() => !isSubmitted && handleAnswerSelect(i, opt)} className={`w-full text-left p-2 border rounded-md text-sm transition ${styles}`} disabled={isSubmitted}>{opt}</button>
                          })}
                      </div>
                  </div>
              ))}
          </div>
        </main>
        
        <footer className="p-4 bg-white border-t rounded-b-2xl flex justify-end gap-3 flex-shrink-0">
            {isSubmitted ? (
                <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-6 rounded-lg">Done</button>
            ) : (
                <button onClick={() => setIsSubmitted(true)} className="bg-accent text-white font-bold py-2 px-6 rounded-lg">Submit Quiz</button>
            )}
        </footer>
      </div>
    </div>
  );
};

export default RevisionQuizModal;
