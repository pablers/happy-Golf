import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisView from '../AnalysisView';
import { SpinnerIcon } from '../icons';
import { useRounds } from '../../contexts/RoundsContext';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedRounds, isLoading } = useRounds();

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
      onSelectCourse={(courseAnalysis) => navigate(`/analysis/course/${courseAnalysis.courseId}`)}
    />
  );
};

export default AnalysisPage;
