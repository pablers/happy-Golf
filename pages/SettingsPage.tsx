import React, { useCallback } from 'react';
import SettingsView from '../components/SettingsView';
import { useTheme } from '../contexts/ThemeContext';
import { useRounds } from '../contexts/RoundsContext';

/**
 * Página de ajustes. Permite cambiar el tema y limpiar datos locales.
 */
const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { clearRounds } = useRounds();

  const handleClearRounds = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo tu historial de rondas? Esta acción no se puede deshacer.')) {
      clearRounds();
      alert('Historial de rondas borrado.');
    }
  }, [clearRounds]);

  return <SettingsView currentTheme={theme} onSetTheme={setTheme} onClearRounds={handleClearRounds} />;
};

export default SettingsPage;
