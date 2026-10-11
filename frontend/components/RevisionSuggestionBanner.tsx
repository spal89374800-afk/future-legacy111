
import React from 'react';

interface RevisionSuggestionBannerProps {
  topic: string;
  onStart: () => void;
  onDecline: () => void;
}

const RevisionSuggestionBanner: React.FC<RevisionSuggestionBannerProps> = ({ topic, onStart, onDecline }) => {
  return (
    <div className="bg-gradient-to-r from-secondary to-teal-600 rounded-2xl shadow-lg p-6 my-8 border border-white/20 text-white animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="text-4xl">🔄</div>
            <div>
                <h3 className="text-xl font-bold font-montserrat">Ready for a Quick Revision?</h3>
                <p className="opacity-90 mt-1">
                    We noticed you've studied <strong className="font-bold">"{topic}"</strong>. How about a quick quiz to refresh your memory?
                </p>
            </div>
        </div>
        <div className="flex gap-3 flex-shrink-0 mt-4 md:mt-0">
            <button
              onClick={onDecline}
              className="bg-white/20 hover:bg-white/30 font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
            >
              Maybe Later
            </button>
            <button
              onClick={onStart}
              className="bg-white text-secondary font-bold py-2 px-5 rounded-lg hover:bg-slate-100 transition-transform transform hover:scale-105"
            >
              Start Quiz
            </button>
        </div>
      </div>
    </div>
  );
};

export default RevisionSuggestionBanner;
