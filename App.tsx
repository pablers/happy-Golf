import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import NewRoundPage from './pages/NewRoundPage';
import AnalysisPage from './pages/AnalysisPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import TrainingGuidePage from './pages/TrainingGuidePage';
import ClubhousePage from './pages/ClubhousePage';
import MetronomePage from './pages/MetronomePage';

/**
 * Define la jerarquía de rutas de la aplicación.
 * Las rutas protegidas comparten la misma distribución (AppLayout) y dependen de RequireAuth.
 */
const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route index element={<NewRoundPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="training-guide" element={<TrainingGuidePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="clubhouse" element={<ClubhousePage />} />
        <Route path="metronome" element={<MetronomePage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
