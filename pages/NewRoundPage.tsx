import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseSelectionView from '../components/CourseSelectionView';
import RoundTypeSetup from '../components/RoundTypeSetup';
import ConditionsSetup from '../components/ConditionsSetup';
import Scorecard from '../components/Scorecard';
import type { PracticeTime, ScorecardSessionSetup, WeatherCondition, WindCondition, RoundType, GolfCourse, SavedRound } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useRounds } from '../contexts/RoundsContext';

type RoundSetupStep = 'course_selection' | 'round_type' | 'conditions' | 'playing';

// Gestiona el asistente completo para crear y guardar una nueva ronda.
const NewRoundPage: React.FC = () => {
  const { user } = useAuth();
  const { saveRound } = useRounds();
  const navigate = useNavigate();

  const [step, setStep] = useState<RoundSetupStep>('course_selection');
  const [sessionSetup, setSessionSetup] = useState<Partial<ScorecardSessionSetup>>({});

  if (!user) {
    return null;
  }

  const handleCourseSelected = (course: GolfCourse) => {
    setSessionSetup({ course });
    setStep('round_type');
  };

  const handleRoundTypeSelected = (roundType: RoundType) => {
    setSessionSetup((prev) => ({ ...prev, roundType }));
    setStep('conditions');
  };

  const handleConditionsStart = (practiceTime: PracticeTime, weather: WeatherCondition, wind: WindCondition) => {
    setSessionSetup((prev) => ({ ...prev, practiceTime, weather, wind }));
    setStep('playing');
  };

  // Persiste la ronda y reinicia el flujo tras un guardado exitoso.
  const handleSaveRound = async (round: SavedRound) => {
    try {
      await saveRound(round);
      alert('Ronda guardada con éxito en tu historial.');
      navigate('/analysis');
      setSessionSetup({});
      setStep('course_selection');
    } catch (error: any) {
      if (error?.message === 'AUTH_REQUIRED') {
        alert('Debes iniciar sesión para guardar rondas.');
      } else {
        alert('Error al guardar la ronda. Inténtalo de nuevo.');
      }
    }
  };

  switch (step) {
    case 'course_selection':
      return <CourseSelectionView userProfile={user} onCourseSelected={handleCourseSelected} />;
    case 'round_type':
      return (
        <RoundTypeSetup
          course={sessionSetup.course!}
          onContinue={handleRoundTypeSelected}
          onBack={() => setStep('course_selection')}
        />
      );
    case 'conditions':
      return <ConditionsSetup onStart={handleConditionsStart} onBack={() => setStep('round_type')} />;
    case 'playing':
      if (!(sessionSetup.course && sessionSetup.roundType && sessionSetup.practiceTime && sessionSetup.weather && sessionSetup.wind)) {
        return <CourseSelectionView userProfile={user} onCourseSelected={handleCourseSelected} />;
      }
      return (
        <Scorecard
          setup={sessionSetup as ScorecardSessionSetup}
          userProfile={user}
          onSaveRound={handleSaveRound}
        />
      );
    default:
      return null;
  }
};

export default NewRoundPage;
