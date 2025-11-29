import type { UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'; // Permite apuntar al backend desplegado o usar la ruta relativa por defecto.

const handleResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  }
  const errorData = await response.json();
  throw new Error(errorData.message || 'An API error occurred');
};

// Representa la forma compacta de un campo `course` que sirve el backend.
export interface CourseSnapshot {
  id: string;
  name: string;
  municipality?: string | null;
  region?: string | null;
}

// Configuración de una ronda tal como viaja entre frontend y backend.
export interface RoundSetupPayload {
  course: CourseSnapshot;
  roundType: 'front' | 'back' | 'full';
  practiceTime: 'none' | '5min' | '5-15min' | '15+min';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'variable';
  wind: 'none' | 'light' | 'moderate' | 'strong';
}

// Respuesta básica que expone el backend para una ronda guardada.
export interface RoundResponse {
  id: string;
  date: string;
  setup: RoundSetupPayload;
  scores: Array<{
    hole: number;
    par: number;
    strokeIndex: number;
    strokes: number | null;
    putts: number | null;
    comment: string | null;
    fairwayHit: boolean | null;
  }>;
  answers: Record<string, string | undefined>;
  createdAt: string;
  updatedAt: string;
}

// Datos mínimos necesarios para registrar una nueva ronda en la API.
export type CreateRoundPayload = Pick<RoundResponse, 'date' | 'setup' | 'scores' | 'answers'>;

export const api = {
  login: async (email: string, password: string): Promise<{ access_token: string; profile: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (email: string, password: string, name: string): Promise<{ access_token: string; profile: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return handleResponse(response);
  },

  getProfile: async (token: string): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (token: string, profile: UserProfile): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    return handleResponse(response);
  },

  // Recupera las rondas asociadas al usuario autenticado.
  listRounds: async (token: string): Promise<RoundResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/rounds`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Registra una nueva ronda vinculada al usuario autenticado.
  createRound: async (token: string, payload: CreateRoundPayload): Promise<RoundResponse> => {
    const response = await fetch(`${API_BASE_URL}/rounds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },
};
