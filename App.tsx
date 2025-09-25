import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginView from './components/LoginView';
import MetronomePage from './pages/MetronomePage';
import NewRoundPage from './pages/NewRoundPage';
import ProfilePage from './pages/ProfilePage';
import AnalysisPage from './pages/AnalysisPage';
import RoundAnalysisPage from './pages/RoundAnalysisPage';
import CourseAnalysisPage from './pages/CourseAnalysisPage';
import SettingsPage from './pages/SettingsPage';
import TrainingGuidePage from './pages/TrainingGuidePage';
import ClubhousePage from './pages/ClubhousePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoundsProvider } from './contexts/RoundsContext';
import { SpinnerIcon } from './components/icons';

const AppContent: React.FC = () => {
  const { userProfile, isLoading, login, enterAsGuest } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return <LoginView onLoginSuccess={login} onSkip={enterAsGuest} />;
  }

  // Una vez autenticado, renderizamos el layout principal con el router interno.
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Header />
      <div className="flex-grow flex flex-col overflow-y-hidden">
        <Routes>
          <Route path="/" element={<NewRoundPage />} />
          <Route path="/metronome" element={<MetronomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/analysis/round/:roundId" element={<RoundAnalysisPage />} />
          <Route path="/analysis/course/:courseId" element={<CourseAnalysisPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/training-guide" element={<TrainingGuidePage />} />
          <Route path="/clubhouse" element={<ClubhousePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <RoundsProvider>
          <AppContent />
        </RoundsProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
