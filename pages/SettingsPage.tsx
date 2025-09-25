import React from 'react';
import SettingsView from '../components/SettingsView';
import { useTheme } from '../contexts/ThemeContext';
import { useRounds } from '../contexts/RoundsContext';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { clearRounds } = useRounds();

  const handleClearRounds = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo tu historial de rondas? Esta acción no se puede deshacer.')) {
      clearRounds();
      alert('Historial de rondas borrado.');
    }
  };

  // Centraliza el cambio de tema y el reseteo de rondas en un único punto de entrada.
  return <SettingsView currentTheme={theme} onSetTheme={setTheme} onClearRounds={handleClearRounds} />;
};

export default SettingsPage;
