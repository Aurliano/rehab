import apiClient from './client';
import type { Session, StartSessionRequest, AddMetricRequest, SessionReport } from '../types/api';

export const sessionsApi = {
  // GET api/sessions
  getAll: async (): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>('/sessions');
    return response.data;
  },

  // GET api/sessions/{id}
  getById: async (id: number): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${id}`);
    return response.data;
  },

  // POST api/sessions/start
  start: async (request: StartSessionRequest): Promise<Session> => {
    const response = await apiClient.post<Session>('/sessions/start', request);
    return response.data;
  },

  // POST api/sessions/{id}/metrics
  addMetric: async (sessionId: number, metric: AddMetricRequest): Promise<void> => {
    await apiClient.post(`/sessions/${sessionId}/metrics`, metric);
  },

  // POST api/sessions/{id}/end
  end: async (sessionId: number): Promise<Session> => {
    const response = await apiClient.post<Session>(`/sessions/${sessionId}/end`);
    return response.data;
  },

  // GET api/sessions/{id}/report
  report: async (sessionId: number): Promise<SessionReport> => {
    const response = await apiClient.get<SessionReport>(`/sessions/${sessionId}/report`);
    return response.data;
  },
};