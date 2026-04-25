import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UserProfile } from '../types';

interface AuthContextType {
  token: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  skipLogin: () => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_PROFILE: UserProfile = {
  name: 'Invitado',
  hcpHistory: [{ date: new Date().toISOString(), hcp: 36.0 }],
  favoriteCourseIds: [],
  trainingObjective: 'recommended',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('golf_token'));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await api.getProfile(token);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          localStorage.removeItem('golf_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const { access_token, user } = await api.login(email, pass);
    localStorage.setItem('golf_token', access_token);
    setToken(access_token);
    setUserProfile(user.profile);
  };

  const skipLogin = () => {
    setUserProfile(GUEST_PROFILE);
  };

  const logout = () => {
    localStorage.removeItem('golf_token');
    setToken(null);
    setUserProfile(null);
  };

  const updateProfile = async (profile: UserProfile) => {
    if (token && userProfile?.name !== 'Invitado') {
      const updatedProfile = await api.updateProfile(token, profile);
      setUserProfile(updatedProfile);
    } else {
      setUserProfile(profile); // Update guest profile for the session
    }
  };

  const value = {
    token,
    userProfile,
    isLoading,
    login,
    logout,
    skipLogin,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
