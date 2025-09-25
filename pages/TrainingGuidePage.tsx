import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingGuideView from '../components/TrainingGuideView';
import { useAuth } from '../contexts/AuthContext';

// Desacopla la guía de entrenamiento del perfil para reutilizar el enrutador.
const TrainingGuidePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return <TrainingGuideView userProfile={user} onBack={() => navigate('/profile')} />;
};

export default TrainingGuidePage;
