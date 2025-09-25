import React, { useState } from 'react';
import AnalysisView from '../components/AnalysisView';
import RoundAnalysis from '../components/RoundAnalysis';
import CourseAnalysisView from '../components/CourseAnalysisView';
import type { SavedRound, SavedRoundAnalysis } from '../types';
import { useRounds } from '../contexts/RoundsContext';
import { SpinnerIcon } from '../components/icons';

/**
 * Presenta el historial y análisis por campo reutilizando el contexto de rondas.
 */
const AnalysisPage: React.FC = () => {
  const { savedRounds, isLoading } = useRounds();
  const [analyzingRound, setAnalyzingRound] = useState<SavedRound | null>(null);
  const [analyzingCourse, setAnalyzingCourse] = useState<SavedRoundAnalysis | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  if (analyzingCourse) {
    return <CourseAnalysisView courseAnalysis={analyzingCourse} onBack={() => setAnalyzingCourse(null)} />;
  }

  if (analyzingRound) {
    return <RoundAnalysis round={analyzingRound} onBack={() => setAnalyzingRound(null)} />;
  }

  return (
    <AnalysisView
      savedRounds={savedRounds}
      onSelectRound={(roundId) => {
        const round = savedRounds.find(r => r.id === roundId);
        if (round) {
          setAnalyzingCourse(null);
          setAnalyzingRound(round);
        }
      }}
      onSelectCourse={(analysis) => {
        setAnalyzingRound(null);
        setAnalyzingCourse(analysis);
      }}
    />
  );
};

export default AnalysisPage;
