import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import NewRoundPage from '../pages/NewRoundPage';
import MetronomePage from '../pages/MetronomePage';
import ProfilePage from '../pages/ProfilePage';
import AnalysisPage from '../pages/AnalysisPage';
import RoundAnalysisPage from '../pages/RoundAnalysisPage';
import SettingsPage from '../pages/SettingsPage';
import TrainingGuidePage from '../pages/TrainingGuidePage';
import ClubhousePage from '../pages/ClubhousePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <NewRoundPage /> },
      { path: 'metronome', element: <MetronomePage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'analysis', element: <AnalysisPage /> },
      { path: 'analysis/:roundId', element: <RoundAnalysisPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'training-guide', element: <TrainingGuidePage /> },
      { path: 'clubhouse', element: <ClubhousePage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;