import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, GolfBallIcon, ArrowRight, X, Search, MapPin, Wind, Sun, Clock } from '../components/icons';
import { GOLF_COURSES } from '../data/courses';
import type { ScorecardSessionSetup, GolfCourse, RoundType, PracticeTime, WeatherCondition, WindCondition } from '../types';
import Scorecard from '../components/Scorecard';
import QuestionGroup from '../components/QuestionnaireModal'; // Reusing for post-round if needed

const NewRoundPage: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'scorecard'>('setup');
  const [searchQuery, setSearchQuery] = useState('');
  const [setup, setSetup] = useState<Partial<ScorecardSessionSetup>>({
    roundType: 'full',
    practiceTime: 'none',
    weather: 'sunny',
    wind: 'none'
  });

  const navigate = useNavigate();

  const filteredCourses = GOLF_COURSES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.municipality?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const isSetupComplete = setup.course && setup.roundType && setup.practiceTime && setup.weather && setup.wind;

  const startRound = () => {
    if (isSetupComplete) {
      setStep('scorecard');
    }
  };

  const handleRoundComplete = (scores: any, answers: any) => {
      // Here we would call the API to save the round
      // For now, redirect to analysis
      navigate('/analysis');
  };

  if (step === 'scorecard') {
    return (
      <Scorecard 
        setup={setup as ScorecardSessionSetup} 
        onComplete={handleRoundComplete}
        onCancel={() => setStep('setup')}
      />
    );
  }

  return (
    <div className="flex-grow bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-md mx-auto p-4 space-y-8 pb-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Nueva Ronda</h1>
          <p className="text-gray-500 dark:text-gray-400">Configura tu partida antes de salir al campo.</p>
        </header>

        <section className="space-y-6">
          {/* Course Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Campo de Golf</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Busca tu club..."
                value={setup.course?.name || searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSetup(prev => ({ ...prev, course: undefined }));
                }}
                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              {searchQuery && !setup.course && filteredCourses.map(course => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSetup(prev => ({ ...prev, course }));
                    setSearchQuery(course.name);
                  }}
                  className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between text-left group hover:border-green-500 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{course.name}</h4>
                    <p className="text-xs text-gray-500">{course.municipality}, {course.region}</p>
                  </div>
                  <Plus className="w-5 h-5 text-gray-300 group-hover:text-green-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Round Type */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Tipo de Vuelta</label>
            <div className="flex gap-2">
              {(['front', 'back', 'full'] as RoundType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSetup(prev => ({ ...prev, roundType: type }))}
                  className={clsx(
                    "flex-1 py-3 px-2 rounded-xl font-bold text-sm transition-all",
                    setup.roundType === type 
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30" 
                      : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                  )}
                >
                  {type === 'front' ? 'Ida' : type === 'back' ? 'Vuelta' : '18 Hoyos'}
                </button>
              ))}
            </div>
          </div>

          {/* Conditions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Calentamiento
              </label>
              <select 
                value={setup.practiceTime}
                onChange={(e) => setSetup(prev => ({ ...prev, practiceTime: e.target.value as PracticeTime }))}
                className="w-full bg-white dark:bg-gray-800 border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-green-500 text-sm text-gray-700 dark:text-gray-300"
              >
                <option value="none">Ninguno</option>
                <option value="5min">5 minutos</option>
                <option value="5-15min">5-15 minutos</option>
                <option value="15+min">+15 minutos</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
                <Sun className="w-3 h-3" /> Clima
              </label>
              <select 
                value={setup.weather}
                onChange={(e) => setSetup(prev => ({ ...prev, weather: e.target.value as WeatherCondition }))}
                className="w-full bg-white dark:bg-gray-800 border-none rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-green-500 text-sm text-gray-700 dark:text-gray-300"
              >
                <option value="sunny">Soleado</option>
                <option value="cloudy">Nublado</option>
                <option value="rainy">Lluvia</option>
                <option value="variable">Variable</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1">
              <Wind className="w-3 h-3" /> Viento
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['none', 'light', 'moderate', 'strong'] as WindCondition[]).map(w => (
                <button
                  key={w}
                  onClick={() => setSetup(prev => ({ ...prev, wind: w }))}
                  className={clsx(
                    "py-2 rounded-xl text-xs font-bold transition-all",
                    setup.wind === w
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                      : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  )}
                >
                  {w === 'none' ? 'Calma' : w === 'light' ? 'Suave' : w === 'moderate' ? 'Mod.' : 'Fuerte'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button 
          onClick={startRound}
          disabled={!isSetupComplete}
          className={clsx(
            "w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3",
            isSetupComplete 
              ? "bg-green-600 text-white shadow-xl shadow-green-600/30 hover:scale-[1.02] active:scale-[0.98]" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          {isSetupComplete ? '¡Empezar a Jugar!' : 'Completa la configuración'}
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default NewRoundPage;
