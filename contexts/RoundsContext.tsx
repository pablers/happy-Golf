import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SavedRound } from '../types';
import { fetchAndParseRounds } from '../services/roundImporter';

interface RoundsContextValue {
  savedRounds: SavedRound[];
  isLoading: boolean;
  saveRound: (round: SavedRound) => Promise<void>;
  clearRounds: () => void;
  refreshRounds: () => Promise<void>;
}

const SAVED_ROUNDS_STORAGE_KEY = 'golf-saved-rounds';

const RoundsContext = createContext<RoundsContextValue | undefined>(undefined);

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadRounds = useCallback(async () => {
    setIsLoading(true);
    try {
      const roundsFromCSV = await fetchAndParseRounds();
      const localRoundsData = localStorage.getItem(SAVED_ROUNDS_STORAGE_KEY);

      if (localRoundsData) {
        const localRounds: SavedRound[] = JSON.parse(localRoundsData);
        const localRoundIds = new Set(localRounds.map(r => r.id));
        const filteredCsvRounds = roundsFromCSV.filter(r => !localRoundIds.has(r.id));
        const allRounds = [...localRounds, ...filteredCsvRounds];
        allRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSavedRounds(allRounds);
      } else {
        const sortedRounds = roundsFromCSV.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSavedRounds(sortedRounds);
      }
    } catch (error) {
      console.error('Failed to load round data:', error);
      setSavedRounds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cargamos rondas iniciales desde CSV y almacenamiento local.
    loadRounds();
  }, [loadRounds]);

  const saveRound = useCallback(async (round: SavedRound) => {
    setSavedRounds(prev => {
      const nextRounds = [round, ...prev];
      nextRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(SAVED_ROUNDS_STORAGE_KEY, JSON.stringify(nextRounds));
      return nextRounds;
    });

    // TODO: Enviar la ronda a Supabase cuando el backend esté disponible.
  }, []);

  const clearRounds = useCallback(() => {
    localStorage.removeItem(SAVED_ROUNDS_STORAGE_KEY);
    setSavedRounds([]);
  }, []);

  const value = useMemo<RoundsContextValue>(() => ({
    savedRounds,
    isLoading,
    saveRound,
    clearRounds,
    refreshRounds: loadRounds,
  }), [savedRounds, isLoading, saveRound, clearRounds, loadRounds]);

  return <RoundsContext.Provider value={value}>{children}</RoundsContext.Provider>;
};

export const useRounds = (): RoundsContextValue => {
  const context = useContext(RoundsContext);
  if (!context) {
    throw new Error('useRounds must be used within a RoundsProvider');
  }
  return context;
};
