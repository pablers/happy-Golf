import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingGuideView from '../components/TrainingGuideView';
import { useAuth } from '../contexts/AuthContext';

const TrainingGuidePage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/profile');
  };

  if (!userProfile) {
    return <div>Cargando...</div>;
  }

  return <TrainingGuideView userProfile={userProfile} onBack={handleBack} />;
};

export default TrainingGuidePage;