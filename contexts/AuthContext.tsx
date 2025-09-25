import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextValue {
  token: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (token: string, profile: UserProfile) => void;
  enterAsGuest: () => void;
  logout: () => void;
  saveProfile: (profile: UserProfile) => Promise<{ profile: UserProfile; persistedRemotely: boolean }>;
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

const cloneGuestProfile = (): UserProfile => ({
  ...GUEST_PROFILE,
  hcpHistory: [...GUEST_PROFILE.hcpHistory],
  favoriteCourseIds: [...GUEST_PROFILE.favoriteCourseIds],
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifica si el token guardado sigue siendo válido y precarga el perfil remoto.
  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.getProfile(token);
        if (isMounted) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Session expired or invalid.', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        if (isMounted) {
          setToken(null);
          setUserProfile(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = useCallback((newToken: string, profile: UserProfile) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUserProfile(profile);
    setIsLoading(false);
  }, []);

  const enterAsGuest = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUserProfile(cloneGuestProfile());
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUserProfile(null);
    setIsLoading(false);
  }, []);

  const saveProfile = useCallback(
    async (profile: UserProfile) => {
      if (token && userProfile && userProfile.name !== 'Invitado') {
        const updatedProfile = await api.updateProfile(token, profile);
        setUserProfile(updatedProfile);
        return { profile: updatedProfile, persistedRemotely: true } as const;
      }

      setUserProfile(profile);
      return { profile, persistedRemotely: false } as const;
    },
    [token, userProfile],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userProfile,
      isLoading,
      isGuest: userProfile?.name === 'Invitado',
      login,
      enterAsGuest,
      logout,
      saveProfile,
    }),
    [token, userProfile, isLoading, login, enterAsGuest, logout, saveProfile],
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

export { GUEST_PROFILE };
