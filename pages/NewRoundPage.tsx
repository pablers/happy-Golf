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
  HoleScore,
  PostRoundAnswers,
  CreateRoundPayload,
} from '../types';
import { useRounds } from '../contexts/RoundsContext';

type RoundSetupStep = 'course_selection' | 'round_type' | 'conditions' | 'playing';

const NewRoundPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { createRound } = useRounds();
  const navigate = useNavigate();

  const [roundSetupStep, setRoundSetupStep] = useState<RoundSetupStep>('course_selection');

  // New state management
  const [course, setCourse] = useState<GolfCourse | null>(null);
  const [roundType, setRoundType] = useState<RoundType | null>(null);
  const [practiceTime, setPracticeTime] = useState<PracticeTime | null>(null);
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [wind, setWind] = useState<WindCondition | null>(null);

  const handleCourseSelected = (selectedCourse: GolfCourse) => {
    setCourse(selectedCourse);
    setRoundSetupStep('round_type');
  };

  const handleRoundTypeSelected = (selectedRoundType: RoundType) => {
    setRoundType(selectedRoundType);
    setRoundSetupStep('conditions');
  };

  const handleConditionsStart = (
    selectedPracticeTime: PracticeTime,
    selectedWeather: WeatherCondition,
    selectedWind: WindCondition
  ) => {
    setPracticeTime(selectedPracticeTime);
    setWeather(selectedWeather);
    setWind(selectedWind);
    setRoundSetupStep('playing');
  };

  const handleSaveRound = async (data: { scores: HoleScore[]; answers: Partial<PostRoundAnswers> }) => {
    if (!course || !roundType || !practiceTime || !weather || !wind) {
      alert("Error: La configuración de la ronda es incompleta.");
      return;
    }

    const roundPayload: CreateRoundPayload = {
      date: new Date().toISOString(),
      courseId: course.id,
      roundType,
      practiceTime,
      weather,
      wind,
      scores: data.scores,
      answers: data.answers,
    };

    try {
      await createRound(roundPayload);
      alert('Ronda guardada con éxito en tu historial.');
      // Clean up local storage for multiplayer session data after saving
      localStorage.removeItem('golf-multiplayer-session-data');
      navigate('/analysis');
    } catch (error) {
      console.error("Failed to save round:", error);
      alert("Error al guardar la ronda. Por favor, inténtalo de nuevo.");
    }
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
      return <RoundTypeSetup course={course!} onContinue={handleRoundTypeSelected} onBack={handleBackToCourseSelection} />;
    case 'conditions':
      return <ConditionsSetup onStart={handleConditionsStart} onBack={handleBackToRoundType} />;
    case 'playing':
      if (course && roundType && practiceTime && weather && wind) {
        return (
          <Scorecard
            course={course}
            roundType={roundType}
            practiceTime={practiceTime}
            weather={weather}
            wind={wind}
            userProfile={userProfile}
            onSaveRound={handleSaveRound}
          />
        );
      }
      // Fallback to course selection if setup is incomplete
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
    default:
      return <CourseSelectionView userProfile={userProfile} onCourseSelected={handleCourseSelected} />;
  }
};

export default NewRoundPage;