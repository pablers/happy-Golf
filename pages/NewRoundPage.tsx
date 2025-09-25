import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  GolfCourse,
  PracticeTime,
  RoundType,
  SavedRound,
  ScorecardSessionSetup,
  WeatherCondition,
  WindCondition,
} from '../types';
import CourseSelectionView from '../components/CourseSelectionView';
import RoundTypeSetup from '../components/RoundTypeSetup';
import ConditionsSetup from '../components/ConditionsSetup';
import Scorecard from '../components/Scorecard';
import { useAuth } from '../contexts/AuthContext';
import { useRounds } from '../contexts/RoundsContext';

type RoundSetupStep = 'course_selection' | 'round_type' | 'conditions' | 'playing';

/**
 * Contiene el flujo de configuración y registro de una nueva ronda.
 * Al aislarlo en una página reducimos la complejidad del componente raíz.
 */
const NewRoundPage: React.FC = () => {
  const { user } = useAuth();
  const { saveRound } = useRounds();
  const navigate = useNavigate();

  const [roundSetupStep, setRoundSetupStep] = useState<RoundSetupStep>('course_selection');
  const [sessionSetup, setSessionSetup] = useState<Partial<ScorecardSessionSetup>>({});

  const isSetupComplete = useMemo(() => {
    return Boolean(
      sessionSetup.course &&
      sessionSetup.roundType &&
      sessionSetup.practiceTime &&
      sessionSetup.weather &&
      sessionSetup.wind
    );
  }, [sessionSetup]);

  const resetSetup = useCallback(() => {
    setSessionSetup({});
    setRoundSetupStep('course_selection');
  }, []);

  const handleCourseSelected = useCallback((course: GolfCourse) => {
    setSessionSetup({ course });
    setRoundSetupStep('round_type');
  }, []);

  const handleRoundTypeSelected = useCallback((roundType: RoundType) => {
    setSessionSetup(prev => ({ ...prev, roundType }));
    setRoundSetupStep('conditions');
  }, []);

  const handleConditionsStart = useCallback((practiceTime: PracticeTime, weather: WeatherCondition, wind: WindCondition) => {
    setSessionSetup(prev => ({ ...prev, practiceTime, weather, wind }));
    setRoundSetupStep('playing');
  }, []);

  const handleSaveRound = useCallback((round: SavedRound) => {
    saveRound(round);
    alert('Ronda guardada con éxito en tu historial.');
    resetSetup();
    navigate('/analysis');
  }, [navigate, resetSetup, saveRound]);

  if (!user) return null;

  if (roundSetupStep === 'course_selection') {
    return <CourseSelectionView userProfile={user} onCourseSelected={handleCourseSelected} />;
  }

  if (roundSetupStep === 'round_type' && sessionSetup.course) {
    return (
      <RoundTypeSetup
        course={sessionSetup.course}
        onContinue={handleRoundTypeSelected}
        onBack={() => setRoundSetupStep('course_selection')}
      />
    );
  }

  if (roundSetupStep === 'conditions') {
    return (
      <ConditionsSetup
        onStart={handleConditionsStart}
        onBack={() => setRoundSetupStep('round_type')}
      />
    );
  }

  if (roundSetupStep === 'playing' && isSetupComplete) {
    return (
      <Scorecard
        setup={sessionSetup as ScorecardSessionSetup}
        userProfile={user}
        onSaveRound={handleSaveRound}
      />
    );
  }

  return <CourseSelectionView userProfile={user} onCourseSelected={handleCourseSelected} />;
};

export default NewRoundPage;
