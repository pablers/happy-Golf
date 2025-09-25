import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { SpinnerIcon } from './components/icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoundsProvider } from './contexts/RoundsContext';
import LoginPage from './components/pages/LoginPage';
import NewRoundPage from './components/pages/NewRoundPage';
import MetronomePage from './components/pages/MetronomePage';
import ProfilePage from './components/pages/ProfilePage';
import AnalysisPage from './components/pages/AnalysisPage';
import RoundAnalysisPage from './components/pages/RoundAnalysisPage';
import CourseAnalysisPage from './components/pages/CourseAnalysisPage';
import SettingsPage from './components/pages/SettingsPage';
import TrainingGuidePage from './components/pages/TrainingGuidePage';
import ClubhousePage from './components/pages/ClubhousePage';

const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
  </div>
);

const ProtectedLayout: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Header />
      <div className="flex-grow flex flex-col overflow-y-hidden">
        <Outlet />
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<NewRoundPage />} />
        <Route path="metronome" element={<MetronomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="analysis/round/:roundId" element={<RoundAnalysisPage />} />
        <Route path="analysis/course/:courseId" element={<CourseAnalysisPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="training-guide" element={<TrainingGuidePage />} />
        <Route path="clubhouse" element={<ClubhousePage />} />
      </Route>
      <Route path="*" element={<Navigate to={userProfile ? '/' : '/login'} replace />} />
    </Routes>
  );
};

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
