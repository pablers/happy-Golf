import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  GolfCourse,
  PracticeTime,
  RoundType,
  ScorecardSessionSetup,
  WeatherCondition,
  WindCondition,
  SavedRound,
} from '../../types';
import CourseSelectionView from '../CourseSelectionView';
import RoundTypeSetup from '../RoundTypeSetup';
import ConditionsSetup from '../ConditionsSetup';
import Scorecard from '../Scorecard';
import { useAuth } from '../../contexts/AuthContext';
import { useRounds } from '../../contexts/RoundsContext';

const setupSteps = ['course_selection', 'round_type', 'conditions', 'playing'] as const;
type RoundSetupStep = typeof setupSteps[number];

const NewRoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { saveRound } = useRounds();

  const [roundSetupStep, setRoundSetupStep] = useState<RoundSetupStep>('course_selection');
  const [sessionSetup, setSessionSetup] = useState<Partial<ScorecardSessionSetup>>({});

  if (!userProfile) {
    return null;
  }

  const handleCourseSelected = (course: GolfCourse) => {
    setSessionSetup({ course });
    setRoundSetupStep('round_type');
  };

  const handleRoundTypeSelected = (roundType: RoundType) => {
    setSessionSetup(prev => ({ ...prev, roundType }));
    setRoundSetupStep('conditions');
  };

  const handleConditionsStart = (
    practiceTime: PracticeTime,
    weather: WeatherCondition,
    wind: WindCondition,
  ) => {
    setSessionSetup(prev => ({ ...prev, practiceTime, weather, wind }));
    setRoundSetupStep('playing');
  };

  const handleSaveRound = (round: SavedRound) => {
    saveRound(round);
    alert('Ronda guardada con éxito en tu historial.');
    navigate('/analysis');
  };

  const handleBackToCourseSelection = () => {
    setSessionSetup({});
    setRoundSetupStep('course_selection');
  };

  const handleBackToRoundType = () => {
    setRoundSetupStep('round_type');
  };

  switch (roundSetupStep) {
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
      if (sessionSetup.course && sessionSetup.roundType && sessionSetup.practiceTime && sessionSetup.weather && sessionSetup.wind) {
        return (
          <Scorecard
            setup={sessionSetup as ScorecardSessionSetup}
            userProfile={userProfile}
            onSaveRound={handleSaveRound}
          />
        );
      }
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
    default:
      return null;
  }
};

export default NewRoundPage;
