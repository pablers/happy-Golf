import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from '../components/LoginView';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página de acceso inicial. Aprovecha el provider de autenticación para persistir sesión.
 */
const LoginPage: React.FC = () => {
  const { login, skipLogin } = useAuth();
  const navigate = useNavigate();

  return (
    <LoginView
      onLoginSuccess={(token, profile) => {
        login(token, profile);
        navigate('/');
      }}
      onSkip={() => {
        skipLogin();
        navigate('/');
      }}
    />
  );
};

export default LoginPage;
