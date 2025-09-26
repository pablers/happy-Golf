import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { SavedRound, CreateRoundPayload } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface RoundsContextType {
  savedRounds: SavedRound[];
  isLoading: boolean;
  createRound: (roundData: CreateRoundPayload) => Promise<void>;
  updateRound: (roundId: string, roundData: Partial<SavedRound>) => Promise<void>;
  deleteRound: (roundId: string) => Promise<void>;
  getRoundById: (roundId: string) => SavedRound | undefined;
}

const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

export const RoundsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRounds = useCallback(async () => {
    if (!token) {
      setSavedRounds([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const rounds = await api.getRounds(token);
      rounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSavedRounds(rounds);
    } catch (error) {
      console.error("Failed to load round data:", error);
      setSavedRounds([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  const createRound = async (roundData: CreateRoundPayload) => {
    if (!token) throw new Error("Authentication required");
    const newRound = await api.createRound(token, roundData);
    setSavedRounds(prevRounds => [newRound, ...prevRounds].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateRound = async (roundId: string, roundData: Partial<SavedRound>) => {
    if (!token) throw new Error("Authentication required");
    const updatedRound = await api.updateRound(token, roundId, roundData);
    setSavedRounds(prevRounds => prevRounds.map(r => r.id === roundId ? updatedRound : r));
  };

  const deleteRound = async (roundId: string) => {
    if (!token) throw new Error("Authentication required");
    await api.deleteRound(token, roundId);
    setSavedRounds(prevRounds => prevRounds.filter(r => r.id !== roundId));
  };

  const getRoundById = (roundId: string) => {
    return savedRounds.find(r => r.id === roundId);
  };

  const value = {
    savedRounds,
    isLoading,
    createRound,
    updateRound,
    deleteRound,
    getRoundById,
  };

  return <RoundsContext.Provider value={value}>{children}</RoundsContext.Provider>;
};

export const useRounds = (): RoundsContextType => {
  const context = useContext(RoundsContext);
  if (context === undefined) {
    throw new Error('useRounds must be used within a RoundsProvider');
  }
  return context;
};