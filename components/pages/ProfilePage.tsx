import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileView from '../ProfileView';
import { useAuth } from '../../contexts/AuthContext';
import type { UserProfile } from '../../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  const handleProfileSave = async (profile: UserProfile) => {
    try {
      await updateProfile(profile);
      alert('Perfil guardado con éxito.');
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Error al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  return (
    <ProfileView
      userProfile={userProfile}
      onSave={handleProfileSave}
      onShowTrainingGuide={() => navigate('/training-guide')}
    />
  );
};

export default ProfilePage;
