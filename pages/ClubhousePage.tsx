import React from 'react';
import ClubhouseView from '../components/ClubhouseView';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página envoltorio para la sección "Mi juego de palos".
 */
const ClubhousePage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;
  return <ClubhouseView userProfile={user} />;
};

export default ClubhousePage;
