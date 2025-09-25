import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { SavedRound } from '../types';
import { fetchAndParseRounds } from '../services/roundImporter';

const SAVED_ROUNDS_STORAGE_KEY = 'golf-saved-rounds';

interface RoundsContextType {
  savedRounds: SavedRound[];
  isLoading: boolean;
  saveRound: (round: SavedRound) => void;
  clearRounds: () => void;
  getRoundById: (roundId: string) => SavedRound | undefined;
}

const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

export const RoundsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRoundData = async () => {
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
        console.error("Failed to load round data:", error);
        setSavedRounds([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoundData();
  }, []);

  const saveRound = (round: SavedRound) => {
    const newSavedRounds = [round, ...savedRounds];
    newSavedRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedRounds(newSavedRounds);
    localStorage.setItem(SAVED_ROUNDS_STORAGE_KEY, JSON.stringify(newSavedRounds));
  };

  const clearRounds = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todo tu historial de rondas? Esta acción no se puede deshacer.")) {
      setSavedRounds([]);
      localStorage.removeItem(SAVED_ROUNDS_STORAGE_KEY);
      alert("Historial de rondas borrado.");
    }
  };

  const getRoundById = (roundId: string) => {
    return savedRounds.find(r => r.id === roundId);
  };

  const value = {
    savedRounds,
    isLoading,
    saveRound,
    clearRounds,
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