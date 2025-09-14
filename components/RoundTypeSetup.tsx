import React, { useState } from 'react';
import type { GolfCourse, RoundType } from '../types';
import { ChevronLeftIcon } from './icons';

interface RoundTypeSetupProps {
  course: GolfCourse;
  onContinue: (roundType: RoundType) => void;
  onBack: () => void;
}

const RoundButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-lg text-left font-semibold transition-all duration-200 border-2 ${
      isActive
        ? 'bg-green-500/20 border-green-400 text-gray-800 dark:text-white'
        : 'bg-gray-200/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500'
    }`}
  >
    {children}
  </button>
);

const RoundTypeSetup: React.FC<RoundTypeSetupProps> = ({ course, onContinue, onBack }) => {
  const [selectedRoundType, setSelectedRoundType] = useState<RoundType | null>(null);

  return (
    <div className="w-full flex-grow flex flex-col justify-between p-6 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
      <header className="relative text-center mb-8">
         <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">¿Qué hoyos vas a jugar?</p>
      </header>

      <main className="space-y-4 flex-grow">
        <RoundButton onClick={() => setSelectedRoundType('front')} isActive={selectedRoundType === 'front'}>
          Primeros 9 (1-9)
        </RoundButton>
        <RoundButton onClick={() => setSelectedRoundType('back')} isActive={selectedRoundType === 'back'}>
          Segundos 9 (10-18)
        </RoundButton>
        <RoundButton onClick={() => setSelectedRoundType('full')} isActive={selectedRoundType === 'full'}>
          18 Hoyos
        </RoundButton>
      </main>

      <footer className="mt-8">
        <button
          onClick={() => selectedRoundType && onContinue(selectedRoundType)}
          disabled={!selectedRoundType}
          className="w-full p-4 bg-green-500 text-white font-bold rounded-lg transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
        >
          Continuar
        </button>
      </footer>
    </div>
  );
};

export default RoundTypeSetup;