import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileView from '../components/ProfileView';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../types';

/**
 * Permite editar el perfil del usuario y navegar a la guía de entrenamiento.
 */
const ProfilePage: React.FC = () => {
  const { userProfile, updateProfile, isGuest } = useAuth();
  const navigate = useNavigate();

  if (!userProfile) {
    return null;
  }

  const handleSave = async (profile: UserProfile) => {
    try {
      await updateProfile(profile);
      alert(isGuest ? 'Perfil de invitado actualizado para esta sesión.' : 'Perfil guardado con éxito.');
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Error al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  return (
    <ProfileView
      userProfile={userProfile}
      onSave={handleSave}
      onShowTrainingGuide={() => navigate('/training-guide')}
    />
  );
};

export default ProfilePage;
