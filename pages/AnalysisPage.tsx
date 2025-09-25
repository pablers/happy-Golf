import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisView from '../components/AnalysisView';
import { SpinnerIcon } from '../components/icons';
import { useRounds } from '../contexts/RoundsContext';

/**
 * Vista principal de análisis. Lista rondas y campos disponibles.
 */
const AnalysisPage: React.FC = () => {
  const { savedRounds, isLoading } = useRounds();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <AnalysisView
      savedRounds={savedRounds}
      onSelectRound={(roundId) => navigate(`/analysis/round/${roundId}`)}
      onSelectCourse={(analysis) => navigate(`/analysis/course/${analysis.courseId}`)}
    />
  );
};

export default AnalysisPage;
