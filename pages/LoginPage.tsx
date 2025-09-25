import React from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginView from '../components/LoginView';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página pública que permite iniciar sesión, registrarse o continuar como invitado.
 */
const LoginPage: React.FC = () => {
  const { login, register, skipLogin, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const targetPath = (location.state as { from?: { pathname: string } } | undefined)?.from?.pathname ?? '/';

  if (userProfile) {
    const redirectTo = targetPath;
    return <Navigate to={redirectTo} replace />;
  }

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    navigate(targetPath);
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    await register(email, password, name);
  };

  const handleSkip = () => {
    skipLogin();
    navigate(targetPath);
  };

  return <LoginView onLogin={handleLogin} onRegister={handleRegister} onSkip={handleSkip} />;
};

export default LoginPage;
