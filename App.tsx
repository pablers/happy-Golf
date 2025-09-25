import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoundsProvider } from './contexts/RoundsContext';
import AppLayout from './layouts/AppLayout';
import MetronomePage from './pages/MetronomePage';
import NewRoundPage from './pages/NewRoundPage';
import ProfilePage from './pages/ProfilePage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';
import TrainingGuidePage from './pages/TrainingGuidePage';
import ClubhousePage from './pages/ClubhousePage';
import RoundAnalysisPage from './pages/RoundAnalysisPage';
import CourseAnalysisPage from './pages/CourseAnalysisPage';
import LoginPage from './pages/LoginPage';
import { SpinnerIcon } from './components/icons';

/**
 * Componente que bloquea el acceso a rutas privadas cuando no hay usuario.
 */
const RequireAuth: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

/**
 * Encapsula la definición de rutas para separar la inicialización de providers.
 */
const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<NewRoundPage />} />
          <Route path="metronome" element={<MetronomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="training-guide" element={<TrainingGuidePage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="analysis/round/:roundId" element={<RoundAnalysisPage />} />
          <Route path="analysis/course/:courseId" element={<CourseAnalysisPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="clubhouse" element={<ClubhousePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
};

/**
 * Punto de entrada de la aplicación. Envuelve las rutas con los providers necesarios.
 */
export default function App(): React.ReactNode {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoundsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </RoundsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
