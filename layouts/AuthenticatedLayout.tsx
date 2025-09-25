import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { SpinnerIcon } from '../components/icons';

// Layout principal que asegura autenticación antes de mostrar las rutas internas.
const AuthenticatedLayout: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Header onLogout={logout} />
      <div className="flex-grow flex flex-col overflow-y-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
