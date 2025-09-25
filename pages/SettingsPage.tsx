import React from 'react';
import SettingsView from '../components/SettingsView';
import { useTheme } from '../contexts/ThemeContext';

// Permite ajustar el tema reutilizando el contexto global.
const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsView
      currentTheme={theme}
      onSetTheme={setTheme}
      onClearRounds={() => alert('Esta función está deshabilitada temporalmente.')}
    />
  );
};

export default SettingsPage;
