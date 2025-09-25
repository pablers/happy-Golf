import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileView from '../components/ProfileView';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';

const ProfilePage: React.FC = () => {
  const { userProfile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (profile: UserProfile) => {
    try {
      await updateProfile(profile);
      alert('Perfil guardado con éxito.');
      navigate('/');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Error al guardar el perfil. Inténtalo de nuevo.');
    }
  };

  const handleShowTrainingGuide = () => {
    navigate('/training-guide');
  };

  if (!userProfile) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <ProfileView
      userProfile={userProfile}
      onSave={handleSave}
      onShowTrainingGuide={handleShowTrainingGuide}
    />
  );
};

export default ProfilePage;