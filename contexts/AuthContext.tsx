import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { GUEST_PROFILE } from '../constants';

interface AuthContextType {
  token: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (token: string, profile: UserProfile) => void;
  logout: () => void;
  skipLogin: () => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('golf_token'));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const profile = await api.getProfile(token);
          setUserProfile(profile);
        } catch (error) {
          console.error("Session expired or invalid.", error);
          localStorage.removeItem('golf_token');
          setToken(null);
          setUserProfile(null);
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, [token]);

  const login = (newToken: string, profile: UserProfile) => {
    localStorage.setItem('golf_token', newToken);
    setToken(newToken);
    setUserProfile(profile);
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