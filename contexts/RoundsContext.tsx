import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { SavedRound } from '../types';
import { fetchAndParseRounds } from '../services/roundImporter';
import { useAuth } from './AuthContext';
import { api, CourseSnapshot, CreateRoundPayload, RoundResponse } from '../services/api';
import { GOLF_COURSES } from '../constants';

const SAVED_ROUNDS_STORAGE_KEY = 'golf-saved-rounds';

interface RoundsContextType {
  savedRounds: SavedRound[];
  isLoading: boolean;
  saveRound: (round: SavedRound) => Promise<void>;
  clearRounds: () => void;
  getRoundById: (roundId: string) => SavedRound | undefined;
}

const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

export const RoundsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token, userProfile, isLoading: isAuthLoading } = useAuth();

  // Reconstruye la información completa del campo a partir del catálogo local.
  const enrichCourse = React.useCallback((courseSnapshot: CourseSnapshot): SavedRound['setup']['course'] => {
    const fullCourse = GOLF_COURSES.find(course => course.id === courseSnapshot.id);
    if (fullCourse) {
      return fullCourse;
    }
    // Crea un objeto compatible si el campo no existe en el catálogo.
    return {
      id: courseSnapshot.id,
      name: courseSnapshot.name,
      address: null,
      municipality: courseSnapshot.municipality ?? null,
      province: null,
      region: courseSnapshot.region ?? null,
      phone: null,
      email: null,
      url: null,
      latitude: null,
      longitude: null,
    };
  }, []);

  const isGuest = userProfile?.name === 'Invitado';

  useEffect(() => {
    const loadRoundData = async () => {
      if (isAuthLoading) {
        return;
      }
      setIsLoading(true);
      try {
        if (token && userProfile && !isGuest) {
          // Recupera las rondas del usuario autenticado desde la API.
          const rounds = await api.listRounds(token);
          const normalizedRounds: SavedRound[] = rounds.map((round: RoundResponse) => ({
            ...round,
            setup: { ...round.setup, course: enrichCourse(round.setup.course) },
            answers: round.answers,
            userProfile,
          }));
          normalizedRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setSavedRounds(normalizedRounds);
        } else {
          // Modo invitado: combina el CSV con los datos guardados en localStorage.
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
        }
      } catch (error) {
        console.error('Failed to load round data:', error);
        setSavedRounds([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoundData();
  }, [token, userProfile, isGuest, isAuthLoading, enrichCourse]);

  const saveRound = async (round: SavedRound) => {
    if (token && userProfile && !isGuest) {
      // Construye la carga útil comprimida que espera el backend.
      const payload: CreateRoundPayload = {
        date: round.date,
        setup: {
          ...round.setup,
          course: {
            id: round.setup.course.id,
            name: round.setup.course.name,
            municipality: round.setup.course.municipality ?? null,
            region: round.setup.course.region ?? null,
          },
        },
        scores: round.scores,
        answers: round.answers,
      };

      try {
        const createdRound = await api.createRound(token, payload);
        const normalizedRound: SavedRound = {
          ...createdRound,
          setup: { ...createdRound.setup, course: enrichCourse(createdRound.setup.course) },
          answers: createdRound.answers,
          userProfile,
        };
        setSavedRounds(prev => {
          const nextRounds = [normalizedRound, ...prev.filter(r => r.id !== normalizedRound.id)];
          nextRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          return nextRounds;
        });
      } catch (error) {
        console.error('Failed to save round:', error);
        throw error;
      }
      return;
    }

    const newSavedRounds = [round, ...savedRounds];
    newSavedRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedRounds(newSavedRounds);
    localStorage.setItem(SAVED_ROUNDS_STORAGE_KEY, JSON.stringify(newSavedRounds));
  };

  const clearRounds = () => {
    if (token && userProfile && !isGuest) {
      alert('La limpieza masiva de rondas aún no está disponible para cuentas registradas.');
      return;
    }
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