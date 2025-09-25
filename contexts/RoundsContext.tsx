import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SavedRound } from '../types';
import { fetchAndParseRounds } from '../services/roundImporter';

const SAVED_ROUNDS_STORAGE_KEY = 'golf-saved-rounds';

interface RoundsContextValue {
  /** Rondas combinadas desde CSV y almacenamiento local. */
  savedRounds: SavedRound[];
  /** Indica si las rondas se están cargando. */
  isLoading: boolean;
  /** Guarda una ronda nueva y mantiene el orden cronológico. */
  saveRound: (round: SavedRound) => void;
  /** Elimina todas las rondas almacenadas. */
  clearRounds: () => void;
  /** Fuerza la recarga desde las fuentes originales. */
  reloadRounds: () => Promise<void>;
}

const RoundsContext = createContext<RoundsContextValue | undefined>(undefined);

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadRoundData = useCallback(async () => {
    setIsLoading(true);
    try {
      const roundsFromCSV = await fetchAndParseRounds();
      const localRoundsData = localStorage.getItem(SAVED_ROUNDS_STORAGE_KEY);

      if (localRoundsData) {
        const localRounds: SavedRound[] = JSON.parse(localRoundsData);
        const localRoundIds = new Set(localRounds.map(r => r.id));
        const filteredCsvRounds = roundsFromCSV.filter(r => !localRoundIds.has(r.id));
        setSavedRounds([...localRounds, ...filteredCsvRounds].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ));
      } else {
        setSavedRounds([...roundsFromCSV].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ));
      }
    } catch (error) {
      console.error('Failed to load round data:', error);
      setSavedRounds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoundData();
  }, [loadRoundData]);

  const saveRound = useCallback((round: SavedRound) => {
    setSavedRounds(prevRounds => {
      const nextRounds = [round, ...prevRounds].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      localStorage.setItem(SAVED_ROUNDS_STORAGE_KEY, JSON.stringify(nextRounds));
      return nextRounds;
    });
  }, []);

  const clearRounds = useCallback(() => {
    localStorage.removeItem(SAVED_ROUNDS_STORAGE_KEY);
    setSavedRounds([]);
  }, []);

  const reloadRounds = useCallback(async () => {
    await loadRoundData();
  }, [loadRoundData]);

  const value = useMemo(
    () => ({ savedRounds, isLoading, saveRound, clearRounds, reloadRounds }),
    [savedRounds, isLoading, saveRound, clearRounds, reloadRounds],
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
