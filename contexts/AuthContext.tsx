import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextValue {
  token: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  skipLogin: () => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const hydrateSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Validamos el token contra la API (o Supabase cuando esté disponible).
        const profile = await api.getProfile(token);
        setUserProfile(profile);
      } catch (error) {
        console.error('Session expired or invalid.', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token, profile } = await api.login(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
    setUserProfile(profile);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const { access_token, profile } = await api.register(email, password, name);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
    setUserProfile(profile);
  }, []);

  const skipLogin = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUserProfile(GUEST_PROFILE);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUserProfile(null);
  }, []);

  const updateProfile = useCallback(async (profile: UserProfile) => {
    if (token && userProfile?.name !== 'Invitado') {
      const updatedProfile = await api.updateProfile(token, profile);
      setUserProfile(updatedProfile);
      return;
    }

    // Usuarios invitados solo actualizan el estado local.
    setUserProfile(profile);
  }, [token, userProfile?.name]);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    userProfile,
    isLoading,
    isGuest: userProfile?.name === 'Invitado',
    login,
    register,
    skipLogin,
    logout,
    updateProfile,
  }), [token, userProfile, isLoading, login, register, skipLogin, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
