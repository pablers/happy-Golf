import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoundAnalysis from '../RoundAnalysis';
import { useRounds } from '../../contexts/RoundsContext';

const RoundAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { roundId } = useParams<{ roundId: string }>();
  const { savedRounds } = useRounds();

  const round = useMemo(() => savedRounds.find(r => r.id === roundId), [savedRounds, roundId]);

  if (!round) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-gray-600 dark:text-gray-400">No encontramos la ronda solicitada.</p>
        <button
          onClick={() => navigate('/analysis')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Volver al análisis
        </button>
      </div>
    );
  }

  return <RoundAnalysis round={round} onBack={() => navigate(-1)} />;
};

export default RoundAnalysisPage;
