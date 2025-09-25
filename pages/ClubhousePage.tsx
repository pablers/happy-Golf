import React from 'react';
import ClubhouseView from '../components/ClubhouseView';
import { useAuth } from '../contexts/AuthContext';

/**
 * Integra la vista del juego de palos con el perfil actual.
 */
const ClubhousePage: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  return <ClubhouseView userProfile={userProfile} />;
};

export default ClubhousePage;
