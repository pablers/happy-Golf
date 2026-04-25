
export interface ClubTempoConfig {
  id: string;
  name: string;
  range: { min: number; max: number };
  optimalRange: { start: number; end: number };
  default: number;
}

export const CLUB_TEMPOS: ClubTempoConfig[] = [
  {
    id: 'driver',
    name: 'Driver',
    range: { min: 45, max: 80 },
    optimalRange: { start: 54, end: 66 },
    default: 60,
  },
  {
    id: 'wood',
    name: 'Maderas/Híbridos',
    range: { min: 45, max: 80 },
    optimalRange: { start: 54, end: 66 },
    default: 60,
  },
  {
    id: 'iron',
    name: 'Hierros',
    range: { min: 50, max: 85 },
    optimalRange: { start: 60, end: 72 },
    default: 66,
  },
  {
    id: 'wedge',
    name: 'Wedges',
    range: { min: 55, max: 90 },
    optimalRange: { start: 66, end: 78 },
    default: 72,
  },
  {
    id: 'putter',
    name: 'Putter',
    range: { min: 60, max: 100 },
    optimalRange: { start: 72, end: 84 },
    default: 78,
  },
];

export const TEMPO_OPTIONS = [
  { bpm: 54, label: 'Lento (Tour Pro)', description: '3.0:1 Ratio - Ritmo pausado y controlado' },
  { bpm: 60, label: 'Estándar', description: '3.0:1 Ratio - El ritmo más común en el tour' },
  { bpm: 66, label: 'Rápido', description: '3.0:1 Ratio - Para jugadores con swing corto' },
  { bpm: 72, label: 'Muy Rápido', description: '3.0:1 Ratio - Estilo Nick Price' },
];
