import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './contexts/AuthContext';
import { RoundsProvider } from './contexts/RoundsContext';
import { Theme } from './types';

const THEME_STORAGE_KEY = 'golf-theme';

export default function App(): React.ReactNode {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <AuthProvider>
      <RoundsProvider>
        <RouterProvider router={router} />
      </RoundsProvider>
    </AuthProvider>
  );
}