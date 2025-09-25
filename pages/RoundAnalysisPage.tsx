import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoundAnalysis from '../components/RoundAnalysis';
import { useRounds } from '../contexts/RoundsContext';

// Página de detalle para revisar una ronda concreta.
const RoundAnalysisPage: React.FC = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { getRoundById } = useRounds();

  const round = roundId ? getRoundById(roundId) : null;

  if (!round) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <p className="text-lg text-gray-600 dark:text-gray-300">No se encontró la ronda solicitada.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">Volver</button>
      </div>
    );
  }

  return <RoundAnalysis round={round} onBack={() => navigate(-1)} />;
};

export default RoundAnalysisPage;
