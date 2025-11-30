export type RoundType = 'front' | 'back' | 'full';
export type PracticeTime = 'none' | '5min' | '5-15min' | '15+min';
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'variable';
export type WindCondition = 'none' | 'light' | 'moderate' | 'strong';

type YesNo = 'yes' | 'no';
type WindChange = 'same' | 'higher' | 'lower';

type TurfCondition = 'very_short' | 'correct' | 'longish' | 'long' | 'irregular';
type GreenSpeed = 'fast' | 'medium' | 'slow' | 'irregular';
type PhysicalState = 'good' | 'bit_tired' | 'tired' | 'discomfort';
type MentalState = 'focused' | 'neutral' | 'distracted' | 'frustrated';

export interface GolfCourseSnapshot {
  id: string;
  name: string;
  municipality?: string | null;
  region?: string | null;
}

export interface RoundSetup {
  course: GolfCourseSnapshot;
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

export interface PostRoundAnswers {
  practice_time?: PracticeTime;
  initial_weather?: WeatherCondition;
  initial_wind?: WindCondition;
  weather_h7_confirm?: YesNo;
  weather_h7_new?: WeatherCondition;
  wind_h7_change?: WindChange;
  weather_h15_confirm?: YesNo;
  weather_h15_new?: WeatherCondition;
  wind_h15_change?: WindChange;
  turf_condition?: TurfCondition;
  green_speed?: GreenSpeed;
  physical_state?: PhysicalState;
  mental_state?: MentalState;
  [key: string]: string | undefined;
}

export interface Round {
  id: string;
  userId: string;
  date: string;
  setup: RoundSetup;
  scores: HoleScore[];
  answers: PostRoundAnswers;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoundInput {
  userId: string;
  date: string;
  setup: RoundSetup;
  scores: HoleScore[];
  answers: PostRoundAnswers;
}

export type UpdateRoundInput = Partial<Omit<CreateRoundInput, 'userId'>>;
