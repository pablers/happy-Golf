import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CourseAnalysisView from '../components/CourseAnalysisView';
import { useRounds } from '../contexts/RoundsContext';
import type { SavedRound, SavedRoundAnalysis } from '../types';
import { GOLF_COURSES } from '../constants';

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

const buildCourseAnalysis = (rounds: SavedRound[], courseId: string): SavedRoundAnalysis | undefined => {
  const courseRounds = rounds.filter(round => round.setup.course.id === courseId);
  if (courseRounds.length === 0) {
    return undefined;
  }

  const course = GOLF_COURSES.find(c => c.id === courseId);
  if (!course) {
    return undefined;
  }

  const totalNetScore = courseRounds.reduce((acc, round) => {
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
    rounds: courseRounds,
    roundCount: courseRounds.length,
    avgNetScore: totalNetScore / courseRounds.length,
  };
};

const CourseAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams<{ courseId: string }>();
  const { savedRounds } = useRounds();

  const stateAnalysis = location.state as SavedRoundAnalysis | undefined;

  const courseAnalysis = useMemo(() => {
    if (stateAnalysis) {
      return stateAnalysis;
    }
    if (!courseId) {
      return undefined;
    }
    return buildCourseAnalysis(savedRounds, courseId);
  }, [stateAnalysis, savedRounds, courseId]);

  if (!courseAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">No encontramos información para este campo.</p>
        <button
          onClick={() => navigate('/analysis')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Volver al análisis
        </button>
      </div>
    );
  }

  return <CourseAnalysisView courseAnalysis={courseAnalysis} onBack={() => navigate('/analysis')} />;
};

export default CourseAnalysisPage;
