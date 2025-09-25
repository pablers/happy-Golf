import React from 'react';
import SettingsView from '../components/SettingsView';
import { Theme } from '../types';
import { useRounds } from '../contexts/RoundsContext';

const SettingsPage: React.FC = () => {
  const { clearRounds } = useRounds();
  // Placeholder logic, to be replaced by context hooks
  const [theme, setTheme] = React.useState<Theme>(() => {
      const storedTheme = localStorage.getItem('golf-theme');
      return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'light';
  });

  const handleSetTheme = (newTheme: Theme) => {
      // This logic will be moved to a ThemeContext
      const root = window.document.documentElement;
      if (newTheme === 'light') {
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
      }
      localStorage.setItem('golf-theme', newTheme);
      setTheme(newTheme);
  };

  return (
    <SettingsView
      currentTheme={theme}
      onSetTheme={handleSetTheme}
      onClearRounds={clearRounds}
    />
  );
};

export default SettingsPage;