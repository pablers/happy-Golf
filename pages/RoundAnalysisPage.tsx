import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoundAnalysis from '../components/RoundAnalysis';
import { useRounds } from '../contexts/RoundsContext';

const RoundAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { roundId } = useParams<{ roundId: string }>();
  const { savedRounds } = useRounds();

  const round = useMemo(() => savedRounds.find(r => r.id === roundId), [savedRounds, roundId]);

  if (!round) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">No encontramos la ronda solicitada.</p>
        <button
          onClick={() => navigate('/analysis')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Volver al análisis
        </button>
      </div>
    );
  }

  // Reutiliza el componente original añadiendo navegación basada en rutas.
  return <RoundAnalysis round={round} onBack={() => navigate('/analysis')} />;
};

export default RoundAnalysisPage;
