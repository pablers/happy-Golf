import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from '../components/LoginView';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';

const LoginPage: React.FC = () => {
  const { login, skipLogin, userProfile } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userProfile) {
      navigate('/');
    }
  }, [userProfile, navigate]);

  const handleLoginSuccess = (token: string, profile: UserProfile) => {
    login(token, profile);
    navigate('/');
  };

  const handleSkip = () => {
    skipLogin();
    navigate('/');
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} onSkip={handleSkip} />;
};

export default LoginPage;