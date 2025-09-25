import type { UserProfile, SavedRound } from '../types';

const API_BASE_URL = 'http://localhost:3001'; // The backend will run on port 3001

const handleResponse = async (response: Response) => {
  if (response.ok) {
    if (response.status === 204) {
      return;
    }
    return response.json();
  }
  const errorData = await response.json();
  throw new Error(errorData.message || 'An API error occurred');
};

const getAuthHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
});

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
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  updateProfile: async (token: string, profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(profile),
    });
    return handleResponse(response);
  },

  // Rounds API
  getRounds: async (token: string): Promise<SavedRound[]> => {
    const response = await fetch(`${API_BASE_URL}/rounds`, {
        headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  getRound: async (token: string, id: string): Promise<SavedRound> => {
      const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
          headers: getAuthHeaders(token),
      });
      return handleResponse(response);
  },

  createRound: async (token: string, roundData: Omit<SavedRound, 'id' | 'userProfile'>): Promise<SavedRound> => {
      const { scores, ...rest } = roundData;
      const payload = { ...rest, holeScores: scores };
      const response = await fetch(`${API_BASE_URL}/rounds`, {
          method: 'POST',
          headers: getAuthHeaders(token),
          body: JSON.stringify(payload),
      });
      return handleResponse(response);
  },

  updateRound: async (token: string, id: string, roundData: Partial<SavedRound>): Promise<SavedRound> => {
      const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(token),
          body: JSON.stringify(roundData),
      });
      return handleResponse(response);
  },

  deleteRound: async (token: string, id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(token),
      });
      return handleResponse(response);
  },
};
