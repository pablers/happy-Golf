import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

/**
 * Layout general para las páginas protegidas. Incluye cabecera y gestiona el área de contenido.
 */
const AppLayout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Header onLogout={logout} />
      <div className="flex-grow flex flex-col overflow-y-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
