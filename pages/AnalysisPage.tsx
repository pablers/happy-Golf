import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisView from '../components/AnalysisView';
import { useRounds } from '../contexts/RoundsContext';
import { SavedRoundAnalysis } from '../types';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedRounds, isLoading } = useRounds();

  const handleSelectRound = (roundId: string) => {
    navigate(`/analysis/${roundId}`);
  };

  const handleSelectCourse = (courseAnalysis: SavedRoundAnalysis) => {
    // In a real scenario, you might navigate to a URL like `/analysis/course/${courseAnalysis.courseId}`
    console.log('Navigating to course analysis for:', courseAnalysis.courseName);
  };

  if (isLoading) {
    return <div>Cargando rondas...</div>;
  }

  return (
    <AnalysisView
      savedRounds={savedRounds}
      onSelectRound={handleSelectRound}
      onSelectCourse={handleSelectCourse}
    />
  );
};

export default AnalysisPage;