import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { UserProfile } from '../types';
import { GUEST_PROFILE } from '../data/guestProfile';

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, profile: UserProfile) => void;
  skipLogin: () => void;
  logout: () => void;
  saveProfile: (profile: UserProfile) => Promise<void>;
}

const TOKEN_STORAGE_KEY = 'golf_token';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provider responsable de la autenticación básica (token + perfil).
 * Centraliza la interacción con la API y la persistencia en localStorage
 * para poder reutilizarla desde cualquier vista.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.getProfile(token);
        setUser(profile);
      } catch (error) {
        console.error('Session expired or invalid.', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, [token]);

  const login = useCallback((newToken: string, profile: UserProfile) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(profile);
  }, []);

  const skipLogin = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser({
      ...GUEST_PROFILE,
      hcpHistory: [...GUEST_PROFILE.hcpHistory],
      favoriteCourseIds: [...GUEST_PROFILE.favoriteCourseIds],
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const saveProfile = useCallback(async (profile: UserProfile) => {
    if (token) {
      const updatedProfile = await api.updateProfile(token, profile);
      setUser(updatedProfile);
      return;
    }

    setUser(profile);
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isLoading,
    login,
    skipLogin,
    logout,
    saveProfile,
  }), [isLoading, login, logout, saveProfile, skipLogin, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
