/**
 * Eden API Client
 * Extensible handler for interfacing with the Eden API
 */

export interface EdenApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface AgentCreation {
  _id: string;
  name?: string;
  thumbnail?: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface AgentCreationsResponse {
  docs: AgentCreation[];
  nextCursor?: string;
  totalDocs: number;
}

export interface EdenApiError {
  message: string;
}

export class EdenApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: EdenApiConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.eden.art';
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json() as EdenApiError;
      throw new Error(error.message || `API request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get creations for a specific agent
   * @param agentId - The agent's ID
   * @param limit - Number of creations to fetch (optional)
   * @param cursor - Pagination cursor (optional)
   */
  async getAgentCreations(
    agentId: string,
    limit?: number,
    cursor?: string
  ): Promise<AgentCreationsResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);

    const endpoint = `/v2/agents/${agentId}/creations${params.toString() ? `?${params.toString()}` : ''}`;

    return this.request<AgentCreationsResponse>(endpoint);
  }

  // Add more Eden API methods here as needed
  // Example:
  // async getAgentDetails(agentId: string): Promise<AgentDetails> {
  //   return this.request<AgentDetails>(`/v2/agents/${agentId}`);
  // }
}

/**
 * Get a configured Eden API client instance (server-side only)
 */
export function getEdenClient(): EdenApiClient {
  const apiKey = process.env.EDEN_API_KEY;

  if (!apiKey) {
    throw new Error('EDEN_API_KEY environment variable is not set');
  }

  return new EdenApiClient({ apiKey });
}
