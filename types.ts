

export interface ClubTempoConfig {
  id: string;
  name: string;
  range: { min: number; max: number };
  optimalRange: { start: number; end: number };
  default: number;
}

export interface TempoOption {
  bpm: number;
  label: string;
  description: string;
}

export interface GolfCourse {
  id: string;
  name: string;
  address: string | null;
  municipality: string | null;
  province: string | null;
  region: string | null;
  phone: string | null;
  email: string | null;
  url: string | null;
  latitude: string | null;
  longitude: string | null;
}

export type RoundType = 'front' | 'back' | 'full';
export type PracticeTime = 'none' | '5min' | '5-15min' | '15+min';
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'variable';
export type WindCondition = 'none' | 'light' | 'moderate' | 'strong';

export interface ScorecardSessionSetup {
  course: GolfCourse;
  roundType: RoundType;
  practiceTime: PracticeTime;
  weather: WeatherCondition;
  wind: WindCondition;
}

export interface HoleScore {
  hole: number;
  par: number;
  strokeIndex: number;
  strokes: number | null;
  putts: number | null;
  comment: string | null;
  fairwayHit: boolean | null;
}

export type PostRoundAnswerValue = string;

export interface PostRoundAnswers {
    practice_time?: PracticeTime;
    initial_weather?: WeatherCondition;
    initial_wind?: WindCondition;
    weather_h7_confirm?: 'yes' | 'no';
    weather_h7_new?: WeatherCondition;
    wind_h7_change?: 'same' | 'higher' | 'lower';
    weather_h15_confirm?: 'yes' | 'no';
    weather_h15_new?: WeatherCondition;
    wind_h15_change?: 'same' | 'higher' | 'lower';
    turf_condition?: 'very_short' | 'correct' | 'longish' | 'long' | 'irregular';
    green_speed?: 'fast' | 'medium' | 'slow' | 'irregular';
    physical_state?: 'good' | 'bit_tired' | 'tired' | 'discomfort';
    mental_state?: 'focused' | 'neutral' | 'distracted' | 'frustrated';
    [key: string]: PostRoundAnswerValue | undefined;
}


export type QuestionCategory = 'climate' | 'turf' | 'greens' | 'physical' | 'mental';

export interface QuestionOption {
    value: string;
    label: string;
}

export interface Question {
    key: keyof PostRoundAnswers;
    text: string;
    category: QuestionCategory;
    options: QuestionOption[];
}

export interface QuestionGroup {
    title: string;
    questions: Question[];
}

export interface RoundState {
    cooldown: number;
    pendingQuestions: QuestionCategory[];
    askedThisHalf: Partial<Record<QuestionCategory, boolean>>;
    questionBudget: number;
    patternsMetThisRound: QuestionCategory[];
}

export interface HcpRecord {
  date: string;
  hcp: number;
}

export interface UserProfile {
  name: string;
  hcpHistory: HcpRecord[];
  favoriteCourseIds: string[];
  trainingObjective: string;
}

export interface SavedRound {
    id: string;
    date: string;
    setup: ScorecardSessionSetup;
    scores: HoleScore[];
    answers: Partial<PostRoundAnswers>;
    userProfile: UserProfile;
}

export interface SavedRoundAnalysis {
    courseName: string;
    courseId: string;
    rounds: SavedRound[];
    roundCount: number;
    avgNetScore: number;
}


export type Theme = 'light' | 'dark';
export type View = 'metronome' | 'newRound' | 'profile' | 'analysis' | 'settings' | 'trainingGuide' | 'clubhouse';

export type SkillLevel = 'principiante' | 'intermedio' | 'avanzado';

export interface TrainingStep {
    title: string;
    details: string;
}

export interface TrainingLevelContent {
    description: string;
    steps: TrainingStep[];
    rationale: string;
}

export interface TrainingObjective {
    id: string;
    title: string;
    levels: {
        principiante: TrainingLevelContent;
        intermedio: TrainingLevelContent;
        avanzado: TrainingLevelContent;
    };
}

export interface ClubSpecs {
    brand?: string;
    model?: string;
    type?: string;
    loft?: string;
    lie?: string;
    construction?: string;
    player_level?: string;
}

export interface ClubInBag {
    id: string;
    name: string;
    stats: {
        distance: { value: number; unit: string };
        accuracy: { value: number; unit: string };
        consistency: { value: number; unit: string };
    };
    skills: {
        power: number;
        control: number;
        confidence: number;
    };
    userDistance: number | null;
    specs?: ClubSpecs;
}

export interface ScorecardPlayer {
  id: number;
  name: string;
  hcp: number;
  scores: HoleScore[];
}