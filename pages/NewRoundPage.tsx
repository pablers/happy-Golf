import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseSelectionView from '../components/CourseSelectionView';
import RoundTypeSetup from '../components/RoundTypeSetup';
import ConditionsSetup from '../components/ConditionsSetup';
import Scorecard from '../components/Scorecard';
import type {
  GolfCourse,
  PracticeTime,
  SavedRound,
  ScorecardSessionSetup,
  WeatherCondition,
  WindCondition,
  RoundType,
} from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useRounds } from '../contexts/RoundsContext';

type RoundSetupStep = 'course_selection' | 'round_type' | 'conditions' | 'playing';

/**
 * Orquesta el flujo paso a paso para configurar y registrar una nueva ronda.
 */
const NewRoundPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { saveRound } = useRounds();
  const navigate = useNavigate();

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

  const handleConditionsStart = (practiceTime: PracticeTime, weather: WeatherCondition, wind: WindCondition) => {
    setSessionSetup(prev => ({ ...prev, practiceTime, weather, wind }));
    setRoundSetupStep('playing');
  };

  const handleSaveRound = async (round: SavedRound) => {
    await saveRound(round);
    alert('Ronda guardada con éxito en tu historial.');
    navigate('/analysis');
  };

  switch (roundSetupStep) {
    case 'course_selection':
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
    case 'round_type':
      return (
        <RoundTypeSetup
          course={sessionSetup.course!}
          onContinue={handleRoundTypeSelected}
          onBack={() => setRoundSetupStep('course_selection')}
        />
      );
    case 'conditions':
      return <ConditionsSetup onStart={handleConditionsStart} onBack={() => setRoundSetupStep('round_type')} />;
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
