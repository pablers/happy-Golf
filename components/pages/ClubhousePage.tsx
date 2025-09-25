import React from 'react';
import ClubhouseView from '../ClubhouseView';
import { useAuth } from '../../contexts/AuthContext';

const ClubhousePage: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  return <ClubhouseView userProfile={userProfile} />;
};

export default ClubhousePage;
