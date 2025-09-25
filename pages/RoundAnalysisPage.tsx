import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoundAnalysis from '../components/RoundAnalysis';
import { useRounds } from '../contexts/RoundsContext';

const RoundAnalysisPage: React.FC = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const { getRoundById, isLoading } = useRounds();

  const round = getRoundById(roundId!);

  const handleBack = () => {
    navigate('/analysis');
  };

  if (isLoading) {
    return <div>Cargando datos de la ronda...</div>;
  }

  if (!round) {
    return (
      <div className="p-4 text-center">
        <p>Ronda no encontrada.</p>
        <button onClick={handleBack} className="mt-4 text-green-500 hover:underline">
          Volver al análisis
        </button>
      </div>
    );
  }

  return <RoundAnalysis round={round} onBack={handleBack} />;
};

export default RoundAnalysisPage;