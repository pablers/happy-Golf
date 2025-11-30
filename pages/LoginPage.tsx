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
      // Check if this is a new user (default handicap of 36 and no favorite courses)
      const isNewUser = userProfile.hcpHistory.length === 1 &&
        userProfile.hcpHistory[0].hcp === 36 &&
        userProfile.favoriteCourseIds.length === 0;

      if (isNewUser) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    }
  }, [userProfile, navigate]);

  const handleLoginSuccess = (token: string, profile: UserProfile) => {
    login(token, profile);
  };

  const handleSkip = () => {
    skipLogin();
    navigate('/');
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} onSkip={handleSkip} />;
};

export default LoginPage;