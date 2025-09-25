import React from 'react';
import SettingsView from '../components/SettingsView';
import { useRounds } from '../contexts/RoundsContext';
import { useThemeContext } from '../contexts/ThemeContext';

/**
 * Gestiona ajustes de apariencia y datos del usuario.
 */
const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useThemeContext();
  const { clearRounds } = useRounds();

  const handleClearRounds = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo tu historial de rondas? Esta acción no se puede deshacer.')) {
      clearRounds();
      alert('Historial de rondas borrado.');
    }
  };

  return <SettingsView currentTheme={theme} onSetTheme={setTheme} onClearRounds={handleClearRounds} />;
};

export default SettingsPage;
