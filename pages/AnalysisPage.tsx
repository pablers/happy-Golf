import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisView from '../components/AnalysisView';
import { useRounds } from '../contexts/RoundsContext';
import type { SavedRoundAnalysis } from '../types';

const AnalysisPage: React.FC = () => {
  const { savedRounds } = useRounds();
  const navigate = useNavigate();

  // Usa la navegación declarativa para aislar la vista de detalle de ronda.
  const handleSelectRound = (roundId: string) => {
    navigate(`/analysis/round/${roundId}`);
  };

  const handleSelectCourse = (courseAnalysis: SavedRoundAnalysis) => {
    navigate(`/analysis/course/${courseAnalysis.courseId}`);
  };

  return (
    <AnalysisView savedRounds={savedRounds} onSelectRound={handleSelectRound} onSelectCourse={handleSelectCourse} />
  );
};

export default AnalysisPage;
