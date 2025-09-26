import React, { useState } from 'react';
import type { WeatherCondition, WindCondition, PracticeTime } from '../types';
import { ChevronLeftIcon } from './icons';

interface ConditionsSetupProps {
  onStart: (practiceTime: PracticeTime, weather: WeatherCondition, wind: WindCondition) => void;
  onBack: () => void;
}

const practiceTimes: { id: PracticeTime; label: string }[] = [
    { id: 'NONE', label: 'No' },
    { id: 'MIN_5', label: '< 5 min' },
    { id: 'MIN_5_15', label: '5-15 min' },
    { id: 'MIN_15_PLUS', label: '+15 min' },
];

const weatherConditions: {id: WeatherCondition, label: string}[] = [
    { id: 'SUNNY', label: 'Soleado' },
    { id: 'CLOUDY', label: 'Nublado' },
    { id: 'RAINY', label: 'Lluvioso' },
    { id: 'VARIABLE', label: 'Variable' },
];

const windConditions: {id: WindCondition, label: string}[] = [
    { id: 'NONE', label: 'Sin' },
    { id: 'LIGHT', label: 'Suave' },
    { id: 'MODERATE', label: 'Moderado' },
    { id: 'STRONG', label: 'Fuerte' },
];

const ConditionButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`w-full py-2 px-3 rounded-lg font-semibold transition-all duration-200 border-2 text-sm ${
      isActive
        ? 'bg-green-500/20 border-green-400 text-gray-800 dark:text-white'
        : 'bg-gray-200/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500'
    }`}
  >
    {children}
  </button>
);

const ConditionsSetup: React.FC<ConditionsSetupProps> = ({ onStart, onBack }) => {
  const [selectedPractice, setSelectedPractice] = useState<PracticeTime | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition | null>(null);
  const [selectedWind, setSelectedWind] = useState<WindCondition | null>(null);

  const handleStart = () => {
    if (selectedPractice && selectedWeather && selectedWind) {
      onStart(selectedPractice, selectedWeather, selectedWind);
    }
  };

  const isStartDisabled = !selectedPractice || !selectedWeather || !selectedWind;

  return (
    <div className="w-full flex-grow flex flex-col justify-between p-6 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
      <header className="relative text-center">
        <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Preparación</h1>
        <p className="text-gray-600 dark:text-gray-400">Define las condiciones de la ronda.</p>
      </header>

      <main className="space-y-6 flex-grow mt-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">1. ¿Has practicado antes?</h2>
          <div className="grid grid-cols-2 gap-3">
            {practiceTimes.map(condition => (
              <ConditionButton
                key={condition.id}
                onClick={() => setSelectedPractice(condition.id)}
                isActive={selectedPractice === condition.id}
              >
                {condition.label}
              </ConditionButton>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">2. ¿Cómo está el día?</h2>
          <div className="grid grid-cols-2 gap-3">
            {weatherConditions.map(condition => (
              <ConditionButton
                key={condition.id}
                onClick={() => setSelectedWeather(condition.id)}
                isActive={selectedWeather === condition.id}
              >
                {condition.label}
              </ConditionButton>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">3. ¿Hace viento?</h2>
          <div className="grid grid-cols-2 gap-3">
            {windConditions.map(condition => (
              <ConditionButton
                key={condition.id}
                onClick={() => setSelectedWind(condition.id)}
                isActive={selectedWind === condition.id}
              >
                {condition.label}
              </ConditionButton>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-6">
        <button
          onClick={handleStart}
          disabled={isStartDisabled}
          className="w-full p-4 bg-green-500 text-white font-bold rounded-lg transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
        >
          Empezar Ronda
        </button>
      </footer>
    </div>
  );
};

export default ConditionsSetup;