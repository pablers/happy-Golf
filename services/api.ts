import type { UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseBackend = SUPABASE_URL && API_BASE_URL.startsWith(SUPABASE_URL);

/**
 * Añade los encabezados necesarios para llamar a Supabase REST o al backend tradicional.
 */
const buildHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isSupabaseBackend) {
    const authToken = token ?? SUPABASE_ANON_KEY;
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    if (SUPABASE_ANON_KEY) {
      headers.apikey = SUPABASE_ANON_KEY;
    }
  } else if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.ok) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
  let errorMessage = 'An API error occurred';
  try {
    const errorData = await response.json();
    if (errorData?.message) {
      errorMessage = errorData.message;
    }
  } catch (error) {
    console.error('Unable to parse error response', error);
  }
  throw new Error(errorMessage);
};

export const api = {
  /**
   * Login tradicional. Para Supabase Auth, ajusta VITE_API_BASE_URL a `${SUPABASE_URL}/auth/v1` y controla el token desde la respuesta.
   */
  login: async (email: string, password: string): Promise<{ access_token: string; profile: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  /**
   * Registro de usuarios. Compatible con Supabase Auth (endpoint `auth/v1/signup`).
   */
  register: async (email: string, password: string, name: string): Promise<{ access_token: string; profile: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    return handleResponse(response);
  },

  /**
   * Recupera el perfil del usuario. Preparado para un view o rpc en Supabase (usar `rest/v1/perfiles?select=*`).
   */
  getProfile: async (token: string): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: buildHeaders(token),
    });
    return handleResponse(response);
  },

  /**
   * Actualiza el perfil. Con Supabase se puede apuntar a una RPC o a `rest/v1/perfiles` con método PATCH.
   */
  updateProfile: async (token: string, profile: UserProfile): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: buildHeaders(token),
      body: JSON.stringify(profile),
    });
    return handleResponse(response);
  },
};
