import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingGuideView from '../TrainingGuideView';
import { useAuth } from '../../contexts/AuthContext';

const TrainingGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  return <TrainingGuideView userProfile={userProfile} onBack={() => navigate(-1)} />;
};

export default TrainingGuidePage;
