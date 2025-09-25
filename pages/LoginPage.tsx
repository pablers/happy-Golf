import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginView from '../components/LoginView';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, login, register, skipLogin } = useAuth();

  // Navega al flujo principal tras autenticar correctamente al usuario.
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    navigate('/');
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    await register(email, password, name);
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
  };

  const handleSkip = () => {
    skipLogin();
    navigate('/');
  };

  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <LoginView onLogin={handleLogin} onRegister={handleRegister} onSkip={handleSkip} />
  );
};

export default LoginPage;
