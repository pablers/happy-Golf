import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import type { SavedRound, SavedRoundAnalysis } from '../types';
import { GOLF_COURSES } from '../constants';

interface RoundsContextValue {
  savedRounds: SavedRound[];
  isLoading: boolean;
  isSaving: boolean;
  refreshRounds: () => Promise<void>;
  saveRound: (round: SavedRound) => Promise<void>;
  getRoundById: (id: string) => SavedRound | undefined;
  getCourseAnalysis: (courseId: string) => SavedRoundAnalysis | null;
}

const RoundsContext = createContext<RoundsContextValue | undefined>(undefined);

const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
  if (playerHCP <= 0) return 0;
  const baseStrokes = Math.floor(playerHCP / 18);
  const extraStrokes = playerHCP % 18;
  return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
};

const getRoundHcp = (round: SavedRound): number => {
  const history = round.userProfile.hcpHistory ?? [];
  if (history.length === 0) return 18;
  const relevantHistory = history
    .filter((record) => new Date(record.date) <= new Date(round.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return relevantHistory.length > 0 ? relevantHistory[0].hcp : 18;
};

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sincroniza las rondas con el backend cuando el token cambia.
  useEffect(() => {
    const loadRounds = async () => {
      if (!token) {
        setSavedRounds([]);
        return;
      }

      setIsLoading(true);
      try {
        const rounds = await api.getRounds(token);
        setSavedRounds(rounds);
      } catch (error) {
        console.error('Failed to load rounds.', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRounds();
  }, [token]);

  const refreshRounds = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const rounds = await api.getRounds(token);
      setSavedRounds(rounds);
    } catch (error) {
      console.error('Failed to refresh rounds.', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const saveRound = useCallback(async (round: SavedRound) => {
    if (!token) {
      throw new Error('AUTH_REQUIRED');
    }

    setIsSaving(true);
    try {
      const { id: _ignoredId, userProfile: _ignoredProfile, ...payload } = round;
      const createdRound = await api.createRound(token, payload);
      setSavedRounds((prev) =>
        [createdRound, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
    } catch (error) {
      console.error('Failed to save round.', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [token]);

  const getRoundById = useCallback((id: string) => savedRounds.find((round) => round.id === id), [savedRounds]);

  const getCourseAnalysis = useCallback(
    (courseId: string): SavedRoundAnalysis | null => {
      const roundsForCourse = savedRounds.filter((round) => round.setup.course.id === courseId);
      if (roundsForCourse.length === 0) return null;

      const course = GOLF_COURSES.find((c) => c.id === courseId);
      if (!course) return null;

      const totalNetScore = roundsForCourse.reduce((acc, round) => {
        const roundHcp = getRoundHcp(round);
        const netScore = round.scores.reduce((total, hole) => {
          if (hole.strokes === null) return total;
          const hcpStrokes = calculateHandicapStrokes(hole.strokeIndex, roundHcp);
          return total + (hole.strokes - hole.par - hcpStrokes);
        }, 0);
        return acc + netScore;
      }, 0);

      return {
        courseId,
        courseName: course.name,
        rounds: roundsForCourse,
        roundCount: roundsForCourse.length,
        avgNetScore: totalNetScore / roundsForCourse.length,
      };
    },
    [savedRounds],
  );

  const value = useMemo<RoundsContextValue>(
    () => ({
      savedRounds,
      isLoading,
      isSaving,
      refreshRounds,
      saveRound,
      getRoundById,
      getCourseAnalysis,
    }),
    [savedRounds, isLoading, isSaving, refreshRounds, saveRound, getRoundById, getCourseAnalysis],
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
