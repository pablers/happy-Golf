import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisView from '../components/AnalysisView';
import { useRounds } from '../contexts/RoundsContext';
import { SpinnerIcon } from '../components/icons';
import type { SavedRoundAnalysis } from '../types';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedRounds, isLoading } = useRounds();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  const handleSelectRound = (roundId: string) => {
    navigate(`/analysis/round/${roundId}`);
  };

  const handleSelectCourse = (courseAnalysis: SavedRoundAnalysis) => {
    navigate(`/analysis/course/${courseAnalysis.courseId}`, { state: courseAnalysis });
  };

  return <AnalysisView savedRounds={savedRounds} onSelectRound={handleSelectRound} onSelectCourse={handleSelectCourse} />;
};

export default AnalysisPage;
