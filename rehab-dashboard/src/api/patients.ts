// src/api/patients.ts

import apiClient from './client';
import type { Patient, PatientWithNextSession } from "../types/api";

export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>("/patients");
    return response.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  searchByNationalId: async (nationalCode: string): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>("/patients", {
      params: { nationalCode }, 
    });
    return response.data;
  },


  getAllWithNextSession: async (): Promise<PatientWithNextSession[]> => {
    const response = await apiClient.get<PatientWithNextSession[]>('/patients/with-next-session');
    return response.data;
  },



  create: async (data: Omit<Patient, "id" | "createdAt">): Promise<Patient> => {
    const response = await apiClient.post<Patient>("/patients", data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Patient>) => {
    await apiClient.put(`/patients/${id}`, data);
  },

    remove: async (id: number) => {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  },
};

