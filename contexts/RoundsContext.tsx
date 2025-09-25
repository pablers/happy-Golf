import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SavedRound } from '../types';
import { fetchAndParseRounds } from '../services/roundImporter';

interface RoundsContextValue {
  savedRounds: SavedRound[];
  isLoading: boolean;
  refreshRounds: () => Promise<void>;
  saveRound: (round: SavedRound) => void;
  clearRounds: () => void;
}

const SAVED_ROUNDS_STORAGE_KEY = 'golf-saved-rounds';

const RoundsContext = createContext<RoundsContextValue | undefined>(undefined);

const sortRounds = (rounds: SavedRound[]) =>
  [...rounds].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Combina la información descargada desde CSV con las rondas almacenadas en localStorage.
  const refreshRounds = useCallback(async () => {
    setIsLoading(true);
    try {
      const roundsFromCSV = await fetchAndParseRounds();
      const localRoundsData = localStorage.getItem(SAVED_ROUNDS_STORAGE_KEY);

      if (!localRoundsData) {
        setSavedRounds(sortRounds(roundsFromCSV));
        return;
      }

      const localRounds: SavedRound[] = JSON.parse(localRoundsData);
      const localRoundIds = new Set(localRounds.map(r => r.id));
      const filteredCsvRounds = roundsFromCSV.filter(r => !localRoundIds.has(r.id));
      setSavedRounds(sortRounds([...localRounds, ...filteredCsvRounds]));
    } catch (error) {
      console.error('Failed to load round data:', error);
      setSavedRounds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshRounds();
  }, [refreshRounds]);

  const saveRound = useCallback((round: SavedRound) => {
    setSavedRounds(prevRounds => {
      const newSavedRounds = sortRounds([round, ...prevRounds]);
      localStorage.setItem(SAVED_ROUNDS_STORAGE_KEY, JSON.stringify(newSavedRounds));
      return newSavedRounds;
    });
  }, []);

  const clearRounds = useCallback(() => {
    localStorage.removeItem(SAVED_ROUNDS_STORAGE_KEY);
    setSavedRounds([]);
  }, []);

  const value = useMemo<RoundsContextValue>(
    () => ({ savedRounds, isLoading, refreshRounds, saveRound, clearRounds }),
    [savedRounds, isLoading, refreshRounds, saveRound, clearRounds],
  );

  return <RoundsContext.Provider value={value}>{children}</RoundsContext.Provider>;
};

export const useRounds = (): RoundsContextValue => {
  const context = useContext(RoundsContext);
  if (!context) {
    throw new Error('useRounds must be used within a RoundsProvider');
  }
  return context;
};
