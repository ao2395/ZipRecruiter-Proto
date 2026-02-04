import type {
  ParticipantCreate,
  CreateParticipantResponse,
  JobComparison,
  ComparisonResponse,
  ComparisonRecord,
  Stats,
} from './types';

const API_BASE_URL = '/api'; // Proxied to FastAPI backend

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: response.statusText,
    }));
    throw new APIError(response.status, error.detail || 'An error occurred');
  }

  return response.json();
}

export const api = {
  // Health check
  async healthCheck() {
    return fetchAPI<{ message: string; status: string; version: string }>('/');
  },

  // Create a new participant
  async createParticipant(
    data: ParticipantCreate
  ): Promise<CreateParticipantResponse> {
    return fetchAPI<CreateParticipantResponse>('/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get job comparisons for a participant
  async getComparisons(
    participantId: string,
    count: number = 5
  ): Promise<JobComparison[]> {
    return fetchAPI<JobComparison[]>(
      `/comparisons/${participantId}?count=${count}`
    );
  },

  // Submit a comparison response
  async submitResponse(data: ComparisonResponse): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>('/responses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all responses for a participant
  async getParticipantResponses(
    participantId: string
  ): Promise<ComparisonRecord[]> {
    return fetchAPI<ComparisonRecord[]>(
      `/participants/${participantId}/responses`
    );
  },

  // Get experiment statistics
  async getStats(): Promise<Stats> {
    return fetchAPI<Stats>('/stats');
  },
};

export { APIError };
