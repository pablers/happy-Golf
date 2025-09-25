import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingGuideView from '../components/TrainingGuideView';
import { useAuth } from '../contexts/AuthContext';

const TrainingGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  // Reutiliza la vista manteniendo la navegación declarativa del router.
  return <TrainingGuideView userProfile={userProfile} onBack={() => navigate('/profile')} />;
};

export default TrainingGuidePage;
