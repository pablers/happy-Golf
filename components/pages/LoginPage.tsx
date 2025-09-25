import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginView from '../LoginView';
import { useAuth } from '../../contexts/AuthContext';
import type { UserProfile } from '../../types';

const LoginPage: React.FC = () => {
  const { userProfile, login, skipLogin } = useAuth();

  if (userProfile) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSuccess = (token: string, profile: UserProfile) => {
    login(token, profile);
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} onSkip={skipLogin} />;
};

export default LoginPage;
