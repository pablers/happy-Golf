import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, History, Trophy, Clock, Wind, Sun, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import type { ScorecardSessionSetup, HoleScore } from '../types';
import ClubSelector from './ClubSelector';
import { CLUB_TEMPOS } from '../data/clubset';
import TempoSlider from './TempoSlider';
import { useRounds } from '../contexts/RoundsContext';

interface ScorecardProps {
  setup: ScorecardSessionSetup;
  onComplete: (scores: HoleScore[], answers: any) => void;
  onCancel: () => void;
}

const Scorecard: React.FC<ScorecardProps> = ({ setup, onComplete, onCancel }) => {
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [scores, setScores] = useState<HoleScore[]>(() => {
      // Initialize scores based on roundType
      const holeCount = setup.roundType === 'full' ? 18 : 9;
      const startHole = setup.roundType === 'back' ? 10 : 1;
      
      const defaultPars = [4, 5, 4, 3, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 5, 4, 3, 4];
      const strokeIndexes = [9, 1, 13, 17, 5, 3, 11, 15, 7, 8, 2, 12, 16, 4, 6, 10, 14, 18];

      return Array.from({ length: holeCount }, (_, i) => ({
          hole: startHole + i,
          par: defaultPars[startHole + i - 1],
          strokeIndex: strokeIndexes[startHole + i - 1],
          strokes: null,
          putts: null,
          comment: null,
          fairwayHit: null,
      }));
  });

  const [activeClubId, setActiveClubId] = useState(CLUB_TEMPOS[0].id);
  const currentHole = scores[currentHoleIndex];
  const isLastHole = currentHoleIndex === scores.length - 1;

  const updateCurrentScore = (updates: Partial<HoleScore>) => {
    setScores(prev => {
      const newScores = [...prev];
      newScores[currentHoleIndex] = { ...newScores[currentHoleIndex], ...updates };
      return newScores;
    });
  };

  const calculateTotal = (field: 'strokes' | 'putts') => {
    return scores.reduce((sum, s) => sum + (s[field] || 0), 0);
  };

  const handleFinish = () => {
      onComplete(scores, {});
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top Progress & Stats */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-green-500" />
              Hoyo {currentHole.hole}
              <span className="text-sm font-normal text-gray-500 ml-2">Par {currentHole.par} - Ind {currentHole.strokeIndex}</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Golpes</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{calculateTotal('strokes')}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Putts</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{calculateTotal('putts')}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentHoleIndex + 1) / scores.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pb-32">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Main Controls Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Strokes Control */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-500 mb-3 text-center">Golpes</label>
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => updateCurrentScore({ strokes: Math.max(1, (currentHole.strokes || currentHole.par) - 1) })}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-3xl font-black text-gray-900 dark:text-white">{currentHole.strokes || currentHole.par}</span>
                <button 
                   onClick={() => updateCurrentScore({ strokes: (currentHole.strokes || currentHole.par) + 1 })}
                   className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Putts Control */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-500 mb-3 text-center">Putts</label>
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => updateCurrentScore({ putts: Math.max(0, (currentHole.putts || 2) - 1) })}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-3xl font-black text-gray-900 dark:text-white">{currentHole.putts ?? 2}</span>
                <button 
                  onClick={() => updateCurrentScore({ putts: (currentHole.putts ?? 2) + 1 })}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Fairway Hit Section */}
          {currentHole.par > 3 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-500 mb-4 text-center">Calle cogida</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => updateCurrentScore({ fairwayHit: true })}
                  className={clsx(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    currentHole.fairwayHit === true 
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  )}
                >
                  S
                </button>
                <button 
                  onClick={() => updateCurrentScore({ fairwayHit: false })}
                  className={clsx(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    currentHole.fairwayHit === false 
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  )}
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* Tempo Integration Tool */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Ritmo de Juego
              </h3>
              <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                Asistente de Tempo
              </div>
            </div>

            <div className="space-y-6">
              <ClubSelector 
                activeClubId={activeClubId}
                onClubSelect={setActiveClubId}
              />
              <TempoSlider 
                selectedClub={CLUB_TEMPOS.find(c => c.id === activeClubId)!}
              />
            </div>
          </div>
          
          {/* Optional Comment */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <label className="block text-sm font-semibold text-gray-500 mb-2">Comentario del hoyo (opcional)</label>
             <textarea 
               value={currentHole.comment || ''}
               onChange={(e) => updateCurrentScore({ comment: e.target.value })}
               placeholder="ej. Mal drive a la derecha, gran recuperación..."
               className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 min-h-[80px]"
             />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30">
        <div className="max-w-md mx-auto flex gap-4">
          <button 
            onClick={() => setCurrentHoleIndex(Math.max(0, currentHoleIndex - 1))}
            disabled={currentHoleIndex === 0}
            className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          
          {isLastHole ? (
            <button 
              onClick={handleFinish}
              className="flex-[2] py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-bold text-white shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Finalizar Ronda
            </button>
          ) : (
            <button 
              onClick={() => setCurrentHoleIndex(Math.min(scores.length - 1, currentHoleIndex + 1))}
              className="flex-[2] py-4 bg-green-500 hover:bg-green-600 rounded-2xl font-bold text-white shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
            >
              Siguiente Hoyo
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
