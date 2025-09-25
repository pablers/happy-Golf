import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SavedRound } from '../types';
import { fetchAndParseRounds } from '../services/roundImporter';

interface RoundsContextValue {
  savedRounds: SavedRound[];
  isLoading: boolean;
  saveRound: (round: SavedRound) => void;
  clearRounds: () => void;
  reloadRounds: () => Promise<void>;
}

const STORAGE_KEY = 'golf-saved-rounds';

const RoundsContext = createContext<RoundsContextValue | undefined>(undefined);

/**
 * Gestiona la carga, persistencia y limpieza del historial de rondas.
 * Así los componentes pueden concentrarse en la presentación en vez de duplicar efectos.
 */
export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mergeRounds = useCallback((localRounds: SavedRound[], importedRounds: SavedRound[]) => {
    const localIds = new Set(localRounds.map(round => round.id));
    const filteredImports = importedRounds.filter(round => !localIds.has(round.id));
    const combined = [...localRounds, ...filteredImports];
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return combined;
  }, []);

  const loadRounds = useCallback(async () => {
    setIsLoading(true);
    try {
      const [importedRounds, localData] = await Promise.all([
        fetchAndParseRounds(),
        Promise.resolve(localStorage.getItem(STORAGE_KEY)),
      ]);

      const localRounds = localData ? (JSON.parse(localData) as SavedRound[]) : [];
      const combined = mergeRounds(localRounds, importedRounds);
      setSavedRounds(combined);
    } catch (error) {
      console.error('Failed to load round data:', error);
      setSavedRounds([]);
    } finally {
      setIsLoading(false);
    }
  }, [mergeRounds]);

  useEffect(() => {
    void loadRounds();
  }, [loadRounds]);

  const saveRound = useCallback((round: SavedRound) => {
    setSavedRounds(prev => {
      const updated = [round, ...prev];
      updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRounds = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedRounds([]);
  }, []);

  const reloadRounds = useCallback(async () => {
    await loadRounds();
  }, [loadRounds]);

  const value = useMemo<RoundsContextValue>(() => ({
    savedRounds,
    isLoading,
    saveRound,
    clearRounds,
    reloadRounds,
  }), [clearRounds, isLoading, reloadRounds, saveRound, savedRounds]);

  return <RoundsContext.Provider value={value}>{children}</RoundsContext.Provider>;
};

export const useRounds = (): RoundsContextValue => {
  const context = useContext(RoundsContext);
  if (!context) {
    throw new Error('useRounds must be used within a RoundsProvider');
  }
  return context;
};
