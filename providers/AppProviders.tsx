import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { RoundsProvider } from '../contexts/RoundsContext';
import { ThemeProvider } from '../contexts/ThemeContext';

/**
 * Agrupa todos los providers globales para mantener limpio el punto de entrada.
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <RoundsProvider>{children}</RoundsProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
