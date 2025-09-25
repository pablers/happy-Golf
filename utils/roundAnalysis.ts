import type { SavedRound, SavedRoundAnalysis } from '../types';
import { GOLF_COURSES } from '../constants';

const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
  if (playerHCP <= 0) return 0;
  const baseStrokes = Math.floor(playerHCP / 18);
  const extraStrokes = playerHCP % 18;
  return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
};

const getRoundHandicap = (round: SavedRound): number => {
  if (!round.userProfile.hcpHistory || round.userProfile.hcpHistory.length === 0) return 18;
  const relevantHistory = round.userProfile.hcpHistory
    .filter(record => new Date(record.date) <= new Date(round.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return relevantHistory.length > 0 ? relevantHistory[0].hcp : 18;
};

/**
 * Calcula el resultado neto de una ronda concreta.
 */
export const calculateRoundNetScore = (round: SavedRound): number => {
  const roundHcp = getRoundHandicap(round);
  return round.scores.reduce((total, hole) => {
    if (hole.strokes === null) return total;
    const hcpStrokes = calculateHandicapStrokes(hole.strokeIndex, roundHcp);
    return total + (hole.strokes - hole.par - hcpStrokes);
  }, 0);
};

/**
 * Genera estadísticas agregadas por campo a partir del listado completo de rondas guardadas.
 */
export const buildCoursesAnalysis = (rounds: SavedRound[]): SavedRoundAnalysis[] => {
  const analysisMap = new Map<string, { rounds: SavedRound[]; totalNetScore: number }>();

  rounds.forEach(round => {
    if (!analysisMap.has(round.setup.course.id)) {
      analysisMap.set(round.setup.course.id, { rounds: [], totalNetScore: 0 });
    }
    const entry = analysisMap.get(round.setup.course.id)!;
    entry.rounds.push(round);
    entry.totalNetScore += calculateRoundNetScore(round);
  });

  return Array.from(analysisMap.entries()).map(([courseId, data]) => {
    const course = GOLF_COURSES.find(item => item.id === courseId);
    if (!course) {
      throw new Error(`Unknown course with id ${courseId}`);
    }
    return {
      courseId,
      courseName: course.name,
      rounds: data.rounds,
      roundCount: data.rounds.length,
      avgNetScore: data.totalNetScore / data.rounds.length,
    } satisfies SavedRoundAnalysis;
  });
};

/**
 * Busca el análisis de un campo concreto. Devuelve null si no hay datos suficientes.
 */
export const findCourseAnalysis = (rounds: SavedRound[], courseId: string): SavedRoundAnalysis | null => {
  const analyses = buildCoursesAnalysis(rounds);
  const analysis = analyses.find(item => item.courseId === courseId);
  return analysis ?? null;
};
