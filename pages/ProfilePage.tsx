import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileView from '../components/ProfileView';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../types';

const ProfilePage: React.FC = () => {
  const { user, saveProfile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  // Guarda los cambios del perfil y vuelve a la página principal para cerrar el flujo.
  const handleSave = async (profile: UserProfile) => {
    await saveProfile(profile);
    alert('Perfil guardado con éxito.');
    navigate('/');
  };

  const handleShowTrainingGuide = () => {
    navigate('/training-guide');
  };

  return (
    <ProfileView userProfile={user} onSave={handleSave} onShowTrainingGuide={handleShowTrainingGuide} />
  );
};

export default ProfilePage;
