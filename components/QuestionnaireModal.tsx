import React from 'react';
import { CloseIcon } from './icons';
import type { Question } from '../types';

interface QuestionnaireModalProps {
  question: Question;
  onAnswer: (key: any, value: string) => void;
  onClose: () => void;
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({ question, onAnswer, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm border border-gray-300 dark:border-gray-700">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pregunta Rápida</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label="Cerrar">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 text-center">
          <p className="text-gray-900 dark:text-white text-lg mb-6">{question.text}</p>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map(option => (
              <button
                key={option.value}
                onClick={() => onAnswer(question.key, option.value)}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {option.label}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuestionnaireModal;