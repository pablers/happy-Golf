import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SpinnerIcon } from './icons';

/**
 * Protege rutas que requieren sesión activa (incluye invitados).
 */
const RequireAuth: React.FC = () => {
  const { userProfile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
