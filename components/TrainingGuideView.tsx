

import React, { useState, useMemo } from 'react';
import { TRAINING_OBJECTIVES } from '../data/trainingData';
import type { SkillLevel, UserProfile, HcpRecord } from '../types';
import { ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon } from './icons';

interface TrainingGuideViewProps {
  userProfile: UserProfile;
  onBack: () => void;
}

const getLatestHcp = (history: HcpRecord[]): number => {
    if (!history || history.length === 0) return 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedHistory[0].hcp;
};

const getRecommendedLevel = (hcp: number): SkillLevel => {
    if (hcp >= 26) return 'principiante';
    if (hcp >= 12 && hcp < 26) return 'intermedio';
    return 'avanzado';
};

const LevelButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center p-2 rounded-full text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow'
        : 'text-gray-600 dark:text-gray-300'
    }`}
  >
    {children}
  </button>
);

const TrainingGuideView: React.FC<TrainingGuideViewProps> = ({ userProfile, onBack }) => {
  const currentHcp = useMemo(() => getLatestHcp(userProfile.hcpHistory), [userProfile.hcpHistory]);
  const [openSection, setOpenSection] = useState<string | null>(TRAINING_OBJECTIVES[0]?.id || null);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(() => getRecommendedLevel(currentHcp));

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="w-full flex-grow flex flex-col p-6 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
      <header className="relative text-center mb-6 flex-shrink-0">
        <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Guía de Entrenamiento</h1>
        <p className="text-gray-600 dark:text-gray-400">Ejercicios adaptados a tu nivel de juego.</p>
      </header>
      
      {/* Level Selector */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-center p-1 rounded-full bg-gray-200 dark:bg-gray-700">
            <LevelButton onClick={() => setSelectedLevel('principiante')} isActive={selectedLevel === 'principiante'}>Principiante</LevelButton>
            <LevelButton onClick={() => setSelectedLevel('intermedio')} isActive={selectedLevel === 'intermedio'}>Intermedio</LevelButton>
            <LevelButton onClick={() => setSelectedLevel('avanzado')} isActive={selectedLevel === 'avanzado'}>Avanzado</LevelButton>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            Nivel recomendado para tu HCP ({currentHcp.toFixed(1)}): <span className="font-semibold capitalize">{getRecommendedLevel(currentHcp)}</span>
        </p>
      </div>
      
      <main className="space-y-4 overflow-y-auto flex-grow">
        {TRAINING_OBJECTIVES.map((objective) => {
            const content = objective.levels[selectedLevel];
            return (
                <div key={`${objective.id}-${selectedLevel}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                    onClick={() => toggleSection(objective.id)}
                    className="w-full flex justify-between items-center p-4 text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                    <h2 className="text-lg font-bold text-green-600 dark:text-green-400">{objective.title}</h2>
                    {openSection === objective.id ? (
                        <ChevronDownIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    )}
                    </button>
                    {openSection === objective.id && (
                    <div className="p-4 bg-white dark:bg-gray-800/50 space-y-6 animate-fade-in">
                        <p className="text-gray-700 dark:text-gray-300">{content.description}</p>
                        
                        <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Ejercicios Clave:</h3>
                        {content.steps.map((step, index) => (
                            <div key={index} className="pl-4 border-l-2 border-green-500">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{step.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{step.details}</p>
                            </div>
                        ))}
                        </div>

                        <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">¿Por qué funciona?</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{content.rationale}</p>
                        </div>
                    </div>
                    )}
                </div>
            );
        })}
      </main>
    </div>
  );
};

export default TrainingGuideView;