import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoundsProvider } from './contexts/RoundsContext';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import LoginPage from './pages/LoginPage';
import NewRoundPage from './pages/NewRoundPage';
import MetronomePage from './pages/MetronomePage';
import ProfilePage from './pages/ProfilePage';
import AnalysisPage from './pages/AnalysisPage';
import CourseAnalysisPage from './pages/CourseAnalysisPage';
import RoundAnalysisPage from './pages/RoundAnalysisPage';
import SettingsPage from './pages/SettingsPage';
import TrainingGuidePage from './pages/TrainingGuidePage';
import ClubhousePage from './pages/ClubhousePage';

// Orquesta los proveedores globales y define las rutas principales de la aplicación.
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <RoundsProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<AuthenticatedLayout />}>
                <Route index element={<NewRoundPage />} />
                <Route path="metronome" element={<MetronomePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="analysis" element={<AnalysisPage />} />
                <Route path="analysis/course/:courseId" element={<CourseAnalysisPage />} />
                <Route path="analysis/round/:roundId" element={<RoundAnalysisPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="training-guide" element={<TrainingGuidePage />} />
                <Route path="clubhouse" element={<ClubhousePage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RoundsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
