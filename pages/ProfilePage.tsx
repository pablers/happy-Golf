import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileView from '../components/ProfileView';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, saveProfile } = useAuth();

  if (!userProfile) {
    return null;
  }

  const handleSave = async (profile: UserProfile) => {
    try {
      const result = await saveProfile(profile);
      alert(result.persistedRemotely ? 'Perfil guardado con éxito.' : 'Perfil de invitado actualizado para esta sesión.');
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Error al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  // Redirige a la guía de entrenamiento manteniendo la navegación declarativa.
  const handleShowTrainingGuide = () => navigate('/training-guide');

  return <ProfileView userProfile={userProfile} onSave={handleSave} onShowTrainingGuide={handleShowTrainingGuide} />;
};

export default ProfilePage;
