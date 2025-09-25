import React from 'react';
import ClubhouseView from '../components/ClubhouseView';
import { useAuth } from '../contexts/AuthContext';

// Expone la vista del set de palos como página independiente.
const ClubhousePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <ClubhouseView userProfile={user} />;
};

export default ClubhousePage;
