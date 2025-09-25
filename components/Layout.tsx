import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import { SpinnerIcon } from './icons';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const Layout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
        <Header onNavigate={() => {}} onLogout={logout} />
        <div className="flex-grow flex flex-col overflow-y-hidden">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;