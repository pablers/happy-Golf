




import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CLUB_TEMPO_CONFIGS } from './constants';
import type { ScorecardSessionSetup, GolfCourse, RoundType, WeatherCondition, WindCondition, PracticeTime, UserProfile, SavedRound, Theme, View, SavedRoundAnalysis } from './types';
import { useMetronome } from './hooks/useMetronome';
import { generateWavBlob } from './services/audioService';
import ClubSelector from './components/ClubSelector';
import TempoSlider from './components/TempoSlider';
import Controls from './components/Controls';
import Scorecard from './components/Scorecard';
import ConditionsSetup from './components/ConditionsSetup';
import ProfileView from './components/ProfileView';
import Header from './components/Header';
import CourseSelectionView from './components/CourseSelectionView';
import RoundTypeSetup from './components/RoundTypeSetup';
import AnalysisView from './components/AnalysisView';
import RoundAnalysis from './components/RoundAnalysis';
import LoginView from './components/LoginView';
import { api } from './services/api';
import { SpinnerIcon } from './components/icons';
import SettingsView from './components/SettingsView';
import TrainingGuideView from './components/TrainingGuideView';
import ClubhouseView from './components/ClubhouseView';
import CourseAnalysisView from './components/CourseAnalysisView';
import { fetchAndParseRounds } from './services/roundImporter';

type RoundSetupStep = 'course_selection' | 'round_type' | 'conditions' | 'playing';

const SAVED_ROUNDS_STORAGE_KEY = 'golf-saved-rounds';
const THEME_STORAGE_KEY = 'golf-theme';

const GUEST_PROFILE: UserProfile = {
  name: 'Invitado',
  hcpHistory: [
    { date: new Date('2025-09-11').toISOString(), hcp: 23.2 },
    { date: new Date('2025-06-25').toISOString(), hcp: 26.7 },
    { date: new Date('2025-04-27').toISOString(), hcp: 30.8 },
    { date: new Date('2025-04-12').toISOString(), hcp: 29.7 },
    { date: new Date('2025-02-05').toISOString(), hcp: 32.3 },
    { date: new Date('2025-01-01').toISOString(), hcp: 36.0 },
  ],
  favoriteCourseIds: [],
  trainingObjective: 'recommended',
};

const MetronomeView: React.FC = () => {
    const [selectedClubId, setSelectedClubId] = useState<string>(CLUB_TEMPO_CONFIGS[2].id);
  
    const selectedClubConfig = useMemo(
      () => CLUB_TEMPO_CONFIGS.find(club => club.id === selectedClubId)!,
      [selectedClubId]
    );
  
    const [bpm, setBpm] = useState<number>(selectedClubConfig.default);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
  
    useMetronome(bpm, isPlaying);
    
    const handleClubChange = useCallback((clubId: string) => {
      const newClubConfig = CLUB_TEMPO_CONFIGS.find(club => club.id === clubId)!;
      setSelectedClubId(clubId);
      setBpm(newClubConfig.default);
      if (isPlaying) setIsPlaying(false);
    }, [isPlaying]);
  
    const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => setBpm(Number(event.target.value));
    const handlePlayPause = () => setIsPlaying(prev => !prev);
  
    const handleDownload = useCallback(async () => {
      setIsDownloading(true);
      try {
        const blob = await generateWavBlob(bpm, 15);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `golf_metronome_${selectedClubConfig.name.replace(/\s/g, '_')}_${bpm}bpm.wav`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
      } catch (error) {
        console.error("Failed to download audio:", error);
      } finally {
        setIsDownloading(false);
      }
    }, [bpm, selectedClubConfig.name]);

    return (
      <div className="w-full flex-grow flex flex-col justify-center overflow-y-auto">
        <header className="p-4 text-center border-b border-gray-200 dark:border-gray-700/50">
          <p className="text-gray-600 dark:text-gray-400">Seleccione un palo y ajuste el tempo de su swing.</p>
        </header>
        <main className="p-6 md:p-8 space-y-8">
          <ClubSelector clubs={CLUB_TEMPO_CONFIGS} selectedClubId={selectedClubId} onSelectClub={handleClubChange} />
          <div className="text-center space-y-4">
            <div className="text-7xl lg:text-8xl font-bold text-green-500 dark:text-green-400 tabular-nums">{bpm}</div>
            <TempoSlider min={selectedClubConfig.range.min} max={selectedClubConfig.range.max} value={bpm} optimalStart={selectedClubConfig.optimalRange.start} optimalEnd={selectedClubConfig.optimalRange.end} onChange={handleBpmChange} />
          </div>
          <div>
            <Controls isPlaying={isPlaying} isDownloading={isDownloading} onPlayPause={handlePlayPause} onDownload={handleDownload} />
          </div>
        </main>
      </div>
    );
}

export default function App(): React.ReactNode {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('golf_token'));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'light';
  });
  
  const [activeView, setActiveView] = useState<View>('newRound');
  const [roundSetupStep, setRoundSetupStep] = useState<RoundSetupStep>('course_selection');
  const [sessionSetup, setSessionSetup] = useState<Partial<ScorecardSessionSetup>>({});

  const [savedRounds, setSavedRounds] = useState<SavedRound[]>([]);
  const [analyzingRound, setAnalyzingRound] = useState<SavedRound | null>(null);
  const [analyzingCourse, setAnalyzingCourse] = useState<SavedRoundAnalysis | null>(null);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const profile = await api.getProfile(token);
          setUserProfile(profile);
        } catch (error) {
          console.error("Session expired or invalid.", error);
          localStorage.removeItem('golf_token');
          setToken(null);
          setUserProfile(null);
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, [token]);

  useEffect(() => {
    const loadRoundData = async () => {
        try {
            const roundsFromCSV = await fetchAndParseRounds();
            const localRoundsData = localStorage.getItem(SAVED_ROUNDS_STORAGE_KEY);
            
            if (localRoundsData) {
                const localRounds: SavedRound[] = JSON.parse(localRoundsData);
                const localRoundIds = new Set(localRounds.map(r => r.id));
                const filteredCsvRounds = roundsFromCSV.filter(r => !localRoundIds.has(r.id));
                const allRounds = [...localRounds, ...filteredCsvRounds];
                allRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setSavedRounds(allRounds);
            } else {
                 const sortedRounds = roundsFromCSV.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                 setSavedRounds(sortedRounds);
            }
        } catch (error) {
            console.error("Failed to load round data:", error);
            setSavedRounds([]);
        }
    };
    
    loadRoundData();
  }, []);

  const handleLoginSuccess = (newToken: string, profile: UserProfile) => {
    localStorage.setItem('golf_token', newToken);
    setToken(newToken);
    setUserProfile(profile);
  };
  
  const handleSkipLogin = () => {
    setUserProfile(GUEST_PROFILE);
  };

  const handleLogout = () => {
    localStorage.removeItem('golf_token');
    setToken(null);
    setUserProfile(null);
    setActiveView('newRound');
  };

  const handleProfileSave = async (profile: UserProfile) => {
    if (token && userProfile?.name !== 'Invitado') { // User is logged in
      try {
        const updatedProfile = await api.updateProfile(token, profile);
        setUserProfile(updatedProfile);
        alert("Perfil guardado con éxito.");
        setActiveView('newRound');
      } catch (error) {
        console.error("Failed to save profile:", error);
        alert("Error al guardar el perfil. Inténtalo de nuevo.");
      }
    } else { // Guest user
        setUserProfile(profile);
        alert("Perfil de invitado actualizado para esta sesión.");
        setActiveView('newRound');
    }
  };
  
  const handleClearRounds = () => {
      if (window.confirm("¿Estás seguro de que quieres borrar todo tu historial de rondas? Esta acción no se puede deshacer.")) {
          setSavedRounds([]);
          localStorage.removeItem(SAVED_ROUNDS_STORAGE_KEY);
          alert("Historial de rondas borrado.");
      }
  };

  const handleNavigate = (view: View) => {
    if (view === 'newRound') {
      setSessionSetup({});
      setRoundSetupStep('course_selection');
    }
    if (view === 'profile' && activeView === 'trainingGuide') {
        // Special case: going back from guide to profile
        setActiveView('profile');
        return;
    }
    setAnalyzingRound(null);
    setAnalyzingCourse(null);
    setActiveView(view);
  };
  
  const handleShowTrainingGuide = () => {
      setActiveView('trainingGuide');
  };

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
    const newSavedRounds = [round, ...savedRounds];
    newSavedRounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSavedRounds(newSavedRounds);
    localStorage.setItem(SAVED_ROUNDS_STORAGE_KEY, JSON.stringify(newSavedRounds));
    alert("Ronda guardada con éxito en tu historial.");
    handleNavigate('analysis');
  };
  
  const handleSelectRoundForAnalysis = (roundId: string) => {
      const round = savedRounds.find(r => r.id === roundId);
      if (round) {
        setAnalyzingCourse(null);
        setAnalyzingRound(round);
      }
  };

  const handleSelectCourseForAnalysis = (courseAnalysis: SavedRoundAnalysis) => {
    setAnalyzingRound(null);
    setAnalyzingCourse(courseAnalysis);
  }
  
  const handleBackToCourseSelection = () => setRoundSetupStep('course_selection');
  const handleBackToRoundType = () => setRoundSetupStep('round_type');

  const renderActiveView = () => {
    if (!userProfile) return null;

    switch (activeView) {
      case 'metronome':
        return <MetronomeView />;
      case 'profile':
        return <ProfileView userProfile={userProfile} onSave={handleProfileSave} onShowTrainingGuide={handleShowTrainingGuide} />;
      case 'analysis':
          if (analyzingCourse) {
              return <CourseAnalysisView courseAnalysis={analyzingCourse} onBack={() => setAnalyzingCourse(null)} />;
          }
          if (analyzingRound) {
              return <RoundAnalysis round={analyzingRound} onBack={() => setAnalyzingRound(null)} />;
          }
          return <AnalysisView savedRounds={savedRounds} onSelectRound={handleSelectRoundForAnalysis} onSelectCourse={handleSelectCourseForAnalysis} />;
      case 'settings':
        return <SettingsView currentTheme={theme} onSetTheme={setTheme} onClearRounds={handleClearRounds} />;
      case 'trainingGuide':
        return <TrainingGuideView userProfile={userProfile} onBack={() => handleNavigate('profile')} />;
      case 'clubhouse':
        return <ClubhouseView userProfile={userProfile} />;
      case 'newRound':
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
        }
    }
  };
  
  // FIX: The component must return a value. The rendering logic for loading and authentication states was missing.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <SpinnerIcon className="w-12 h-12 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return <LoginView onLoginSuccess={handleLoginSuccess} onSkip={handleSkipLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Header onNavigate={handleNavigate} onLogout={handleLogout} />
      <div className="flex-grow flex flex-col overflow-y-hidden">
        {renderActiveView()}
      </div>
    </div>
  );
}