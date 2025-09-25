import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { UserProfile } from '../types';

interface AuthContextValue {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  skipLogin: () => void;
  saveProfile: (profile: UserProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'golf_token';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Valida el token persistido y recupera el perfil al montar el proveedor.
  useEffect(() => {
    const bootstrapAuth = async () => {
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

    bootstrapAuth();
  }, [token]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await api.getProfile(token);
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh profile.', error);
      throw error;
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token, profile } = await api.login(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
    setUser(profile);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    await api.register(email, password, name);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const skipLogin = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(GUEST_PROFILE);
    setIsLoading(false);
  }, []);

  const saveProfile = useCallback(async (profile: UserProfile) => {
    if (!token || user?.name === 'Invitado') {
      setUser(profile);
      return;
    }

    const updatedProfile = await api.updateProfile(token, profile);
    setUser(updatedProfile);
  }, [token, user]);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user,
    isLoading,
    login,
    register,
    logout,
    skipLogin,
    saveProfile,
    refreshProfile,
  }), [token, user, isLoading, login, register, logout, skipLogin, saveProfile, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
