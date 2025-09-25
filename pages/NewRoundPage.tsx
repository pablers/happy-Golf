import React, { useMemo, useState } from 'react';
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

const steps = ['course_selection', 'round_type', 'conditions', 'playing'] as const;
type RoundSetupStep = (typeof steps)[number];

const NewRoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { saveRound } = useRounds();

  const [activeStep, setActiveStep] = useState<RoundSetupStep>('course_selection');
  const [sessionSetup, setSessionSetup] = useState<Partial<ScorecardSessionSetup>>({});

  // Controla la máquina de estados de configuración y evita re-renderizados innecesarios.
  const canStartRound = useMemo(
    () =>
      Boolean(
        sessionSetup.course &&
          sessionSetup.roundType &&
          sessionSetup.practiceTime &&
          sessionSetup.weather &&
          sessionSetup.wind,
      ),
    [sessionSetup],
  );

  const handleCourseSelected = (course: GolfCourse) => {
    setSessionSetup({ course });
    setActiveStep('round_type');
  };

  const handleRoundTypeSelected = (roundType: RoundType) => {
    setSessionSetup(prev => ({ ...prev, roundType }));
    setActiveStep('conditions');
  };

  const handleConditionsStart = (practiceTime: PracticeTime, weather: WeatherCondition, wind: WindCondition) => {
    setSessionSetup(prev => ({ ...prev, practiceTime, weather, wind }));
    setActiveStep('playing');
  };

  const handleBackToCourseSelection = () => {
    setSessionSetup({});
    setActiveStep('course_selection');
  };

  const handleBackToRoundType = () => {
    setActiveStep('round_type');
  };

  const handleSaveRound = (round: SavedRound) => {
    saveRound(round);
    navigate('/analysis');
  };

  if (!userProfile) {
    return null;
  }

  switch (activeStep) {
    case 'course_selection':
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
    case 'round_type':
      return (
        <RoundTypeSetup
          course={sessionSetup.course!}
          onContinue={handleRoundTypeSelected}
          onBack={handleBackToCourseSelection}
        />
      );
    case 'conditions':
      return <ConditionsSetup onStart={handleConditionsStart} onBack={handleBackToRoundType} />;
    case 'playing':
      return canStartRound && sessionSetup.course ? (
        <Scorecard
          setup={sessionSetup as ScorecardSessionSetup}
          userProfile={userProfile}
          onSaveRound={handleSaveRound}
        />
      ) : (
        <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />
      );
    default:
      return null;
  }
};

export default NewRoundPage;
