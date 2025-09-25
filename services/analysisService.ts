import { GOLF_COURSES } from '../constants';
import type { SavedRound, SavedRoundAnalysis } from '../types';

const calculateHandicapStrokes = (holeSI: number, playerHCP: number): number => {
  if (playerHCP <= 0) return 0;
  const baseStrokes = Math.floor(playerHCP / 18);
  const extraStrokes = playerHCP % 18;
  return baseStrokes + (holeSI <= extraStrokes ? 1 : 0);
};

const getRoundHcp = (round: SavedRound): number => {
  if (!round.userProfile.hcpHistory || round.userProfile.hcpHistory.length === 0) return 18;
  const relevantHistory = round.userProfile.hcpHistory
    .filter(h => new Date(h.date) <= new Date(round.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return relevantHistory.length > 0 ? relevantHistory[0].hcp : 18;
};

export const buildCourseAnalysis = (savedRounds: SavedRound[]): SavedRoundAnalysis[] => {
  const analysisMap = new Map<string, { rounds: SavedRound[]; totalNetScore: number }>();

  savedRounds.forEach(round => {
    if (!analysisMap.has(round.setup.course.id)) {
      analysisMap.set(round.setup.course.id, { rounds: [], totalNetScore: 0 });
    }
    const courseData = analysisMap.get(round.setup.course.id)!;
    courseData.rounds.push(round);

    const roundHcp = getRoundHcp(round);

    const netScore = round.scores.reduce((total, hole) => {
      if (hole.strokes === null) return total;
      const hcpStrokes = calculateHandicapStrokes(hole.strokeIndex, roundHcp);
      return total + (hole.strokes - hole.par - hcpStrokes);
    }, 0);

    courseData.totalNetScore += netScore;
  });

  return Array.from(analysisMap.entries())
    .map(([courseId, data]) => {
      const course = GOLF_COURSES.find(c => c.id === courseId);
      return {
        courseId,
        courseName: course?.name ?? 'Campo desconocido',
        rounds: data.rounds,
        roundCount: data.rounds.length,
        avgNetScore: data.totalNetScore / data.rounds.length,
      } satisfies SavedRoundAnalysis;
    })
    .sort((a, b) => b.roundCount - a.roundCount);
};

export const findCourseAnalysis = (
  courseId: string,
  savedRounds: SavedRound[],
): SavedRoundAnalysis | null => {
  const analysis = buildCourseAnalysis(savedRounds).find(item => item.courseId === courseId);
  return analysis ?? null;
};
