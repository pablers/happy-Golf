import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseSelectionView from '../components/CourseSelectionView';
import RoundTypeSetup from '../components/RoundTypeSetup';
import ConditionsSetup from '../components/ConditionsSetup';
import Scorecard from '../components/Scorecard';
import { useAuth } from '../contexts/AuthContext';
import {
  GolfCourse,
  RoundType,
  PracticeTime,
  WeatherCondition,
  WindCondition,
  ScorecardSessionSetup,
  SavedRound,
} from '../types';
import { useRounds } from '../contexts/RoundsContext';

type RoundSetupStep = 'course_selection' | 'round_type' | 'conditions' | 'playing';

const NewRoundPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { saveRound } = useRounds();
  const navigate = useNavigate();

  const [roundSetupStep, setRoundSetupStep] = useState<RoundSetupStep>('course_selection');
  const [sessionSetup, setSessionSetup] = useState<Partial<ScorecardSessionSetup>>({});

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

  const handleSaveRound = (round: SavedRound) => {
    saveRound(round);
    alert('Ronda guardada con éxito en tu historial.');
    navigate('/analysis');
  };

  const handleBackToCourseSelection = () => setRoundSetupStep('course_selection');
  const handleBackToRoundType = () => setRoundSetupStep('round_type');

  if (!userProfile) {
    return <div>Cargando...</div>;
  }

  switch (roundSetupStep) {
    case 'course_selection':
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
    case 'round_type':
      return <RoundTypeSetup course={sessionSetup.course!} onContinue={handleRoundTypeSelected} onBack={handleBackToCourseSelection} />;
    case 'conditions':
      return <ConditionsSetup onStart={handleConditionsStart} onBack={handleBackToRoundType} />;
    case 'playing':
      if (sessionSetup.course && sessionSetup.roundType && sessionSetup.practiceTime && sessionSetup.weather && sessionSetup.wind) {
        return <Scorecard setup={sessionSetup as ScorecardSessionSetup} userProfile={userProfile} onSaveRound={handleSaveRound} />;
      }
      // Fallback to course selection if setup is incomplete
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
    default:
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
  }
};

export default NewRoundPage;