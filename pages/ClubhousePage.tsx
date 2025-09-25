import React from 'react';
import ClubhouseView from '../components/ClubhouseView';
import { useAuth } from '../contexts/AuthContext';

const ClubhousePage: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <div>Cargando...</div>;
  }

  return <ClubhouseView userProfile={userProfile} />;
};

export default ClubhousePage;