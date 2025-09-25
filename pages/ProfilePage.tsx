import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types';
import ProfileView from '../components/ProfileView';
import { useAuth } from '../contexts/AuthContext';

/**
 * Contenedor para la vista de perfil. Gestiona la persistencia y las redirecciones.
 */
const ProfilePage: React.FC = () => {
  const { user, saveProfile } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSave = async (profile: UserProfile) => {
    try {
      await saveProfile(profile);
      alert('Perfil guardado con éxito.');
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Error al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  return (
    <ProfileView
      userProfile={user}
      onSave={handleSave}
      onShowTrainingGuide={() => navigate('/training-guide')}
    />
  );
};

export default ProfilePage;
