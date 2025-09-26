import type { UserProfile } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // The backend will run on port 3001

const handleResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  }
  const errorData = await response.json();
  throw new Error(errorData.message || 'An API error occurred');
};

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
};
