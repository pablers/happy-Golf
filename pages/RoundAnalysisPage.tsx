import React, { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import RoundAnalysis from '../components/RoundAnalysis';
import { useRounds } from '../contexts/RoundsContext';

/**
 * Página que muestra el detalle de una ronda guardada.
 */
const RoundAnalysisPage: React.FC = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { savedRounds } = useRounds();

  const round = useMemo(() => savedRounds.find(item => item.id === roundId), [roundId, savedRounds]);

  if (!roundId) {
    return <Navigate to="/analysis" replace />;
  }

  if (!round) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">No se encontró la ronda solicitada.</p>
        <button className="mt-4 text-green-500 hover:underline" onClick={() => navigate('/analysis')}>
          Volver al análisis
        </button>
      </div>
    );
  }

  return <RoundAnalysis round={round} onBack={() => navigate('/analysis')} />;
};

export default RoundAnalysisPage;
