import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingGuideView from '../components/TrainingGuideView';
import { useAuth } from '../contexts/AuthContext';

/**
 * Muestra recomendaciones personalizadas de entrenamiento.
 */
const TrainingGuidePage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  if (!userProfile) {
    return null;
  }

  return <TrainingGuideView userProfile={userProfile} onBack={() => navigate('/profile')} />;
};

export default TrainingGuidePage;
