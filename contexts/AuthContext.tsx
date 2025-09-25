import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types';
import { api } from '../services/api';

const AUTH_STORAGE_KEY = 'golf_token';

const GUEST_PROFILE: UserProfile = {
  name: 'Invitado',
  hcpHistory: [
    { date: new Date('2025-09-11').toISOString(), hcp: 23.2 },
    { date: new Date('2025-06-25').toISOString(), hcp: 26.7 },
    { date: new Date('2025-04-27').toISOString(), hcp: 30.8 },
    { date: new Date('2025-04-12').toISOString(), hcp: 29.7 },
    { date: new Date('2025-02-05').toISOString(), hcp: 32.3 },
    { date: new Date('2025-01-01').toISOString(), hcp: 36.0 },
  ],
  favoriteCourseIds: [],
  trainingObjective: 'recommended',
};

interface AuthContextValue {
  /** Token JWT almacenado tras el login; `null` si no hay sesión. */
  token: string | null;
  /** Perfil del usuario autenticado o del invitado. */
  userProfile: UserProfile | null;
  /** Indica si se está cargando o validando la sesión. */
  isLoading: boolean;
  /** Inicia sesión persistiendo token y perfil. */
  login: (token: string, profile: UserProfile) => void;
  /** Limpia cualquier sesión almacenada. */
  logout: () => void;
  /** Crea una sesión temporal como invitado. */
  skipLogin: () => void;
  /** Actualiza el perfil tanto en memoria como en el backend cuando procede. */
  updateProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_STORAGE_KEY));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.getProfile(token);
        setUserProfile(profile);
      } catch (error) {
        console.error('Session expired or invalid.', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken(null);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [token]);

  const login = useCallback((newToken: string, profile: UserProfile) => {
    localStorage.setItem(AUTH_STORAGE_KEY, newToken);
    setToken(newToken);
    setUserProfile(profile);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    setUserProfile(null);
  }, []);

  const skipLogin = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUserProfile(GUEST_PROFILE);
    setToken(null);
    setIsLoading(false);
  }, []);

  const updateProfile = useCallback(async (profile: UserProfile) => {
    if (token) {
      const updatedProfile = await api.updateProfile(token, profile);
      setUserProfile(updatedProfile);
    } else {
      setUserProfile(profile);
    }
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({ token, userProfile, isLoading, login, logout, skipLogin, updateProfile }),
    [token, userProfile, isLoading, login, logout, skipLogin, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
