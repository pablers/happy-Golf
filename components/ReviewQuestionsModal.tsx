import React, { useState, useMemo, useEffect } from 'react';
import { CloseIcon } from './icons';
import { QUESTION_GROUPS } from '../data/questionnaireData';
import type { PostRoundAnswers, Question, RoundState, HoleScore, QuestionGroup } from '../types';

interface ReviewQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAnswers: Partial<PostRoundAnswers>;
  onSave: (answers: Partial<PostRoundAnswers>) => void;
  scores: HoleScore[];
  roundState: RoundState;
}

const QuestionItem: React.FC<{
  question: Question;
  currentAnswer?: string;
  onSelect: (key: keyof PostRoundAnswers, value: string) => void;
}> = ({ question, currentAnswer, onSelect }) => (
  <div className="py-3">
    <p className="text-gray-800 dark:text-gray-200 mb-2">{question.text}</p>
    <div className="flex flex-wrap gap-2">
      {question.options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onSelect(question.key, opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            currentAnswer === opt.value
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const ReviewQuestionsModal: React.FC<ReviewQuestionsModalProps> = ({ isOpen, onClose, initialAnswers, onSave, scores, roundState }) => {
  const [currentAnswers, setCurrentAnswers] = useState<Partial<PostRoundAnswers>>(initialAnswers);

  useEffect(() => {
    if (isOpen) {
      setCurrentAnswers(initialAnswers);
    }
  }, [isOpen, initialAnswers]);

  const handleSelect = (key: keyof PostRoundAnswers, value: string) => {
    setCurrentAnswers(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    onSave(currentAnswers);
    onClose();
  };

  const visibleGroups = useMemo(() => {
    const completedHoles = scores.filter(s => s.strokes !== null).length;
    
    return QUESTION_GROUPS.map((group: QuestionGroup) => {
      const questions = group.questions.filter(q => {
        // Initial questions are always shown
        if (group.title === "Inicio de Ronda") return true;
        
        // H7 questions only show after hole 7 is completed
        if (String(q.key).includes('_h7_') && completedHoles < 7) return false;
        if (q.key === 'weather_h7_new' && currentAnswers.weather_h7_confirm !== 'no') return false;
        if (q.key === 'wind_h7_change' && currentAnswers.weather_h7_confirm !== 'no') return false;

        // H15 questions only show after hole 15 is completed
        if (String(q.key).includes('_h15_') && completedHoles < 15) return false;
        if (q.key === 'weather_h15_new' && currentAnswers.weather_h15_confirm !== 'no') return false;
        if (q.key === 'wind_h15_change' && currentAnswers.weather_h15_confirm !== 'no') return false;

        if (group.title === "Análisis Final") {
            // Greens question is only relevant if a 3-putt pattern was ever met
            if (q.category === 'greens' && !roundState.patternsMetThisRound.includes('greens')) {
                return false;
            }
            // Turf question is only relevant if a good streak pattern was ever met
            if (q.category === 'turf' && !roundState.patternsMetThisRound.includes('turf')) {
                return false;
            }
        }
        
        return true;
      });

      return { ...group, questions };
    }).filter(group => group.questions.length > 0);

  }, [scores, currentAnswers, roundState.patternsMetThisRound]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-300 dark:border-gray-700 flex flex-col h-[90vh] max-h-[700px]">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revisar Preguntas</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label="Cerrar">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6 flex-grow overflow-y-auto">
          <div className="space-y-6">
            {visibleGroups.map(group => (
              <div key={group.title}>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-600 pb-2 mb-2">{group.title}</h3>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {group.questions.map(q => (
                    <QuestionItem
                      key={String(q.key)}
                      question={q}
                      currentAnswer={currentAnswers[q.key] as string | undefined}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
        
        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
                onClick={handleSave}
                className="w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
                Guardar y Cerrar
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ReviewQuestionsModal;