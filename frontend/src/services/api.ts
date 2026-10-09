import axios from 'axios';
import { 
  City, Facility, Doctor, Pharmacy, Medicine, 
  AmbulanceProvider, TriageTicket, EmergencyPassport 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Health & Integrations Check
  getHealth: async () => {
    const res = await apiClient.get('/health/');
    return res.data;
  },

  // Cities
  getCities: async (): Promise<City[]> => {
    const res = await apiClient.get('/cities/');
    return res.data;
  },

  // Facilities (Hospitals, Diagnostic, Blood Banks)
  getFacilities: async (params?: { 
    city?: string; 
    category?: string; 
    emergency_only?: boolean; 
    search?: string; 
    lat?: number; 
    lng?: number 
  }): Promise<Facility[]> => {
    const res = await apiClient.get('/facilities/', { params });
    return res.data;
  },

  // Doctors
  getDoctors: async (params?: { city?: string; specialty?: string; search?: string }): Promise<Doctor[]> => {
    const res = await apiClient.get('/doctors/', { params });
    return res.data;
  },

  // Pharmacies
  getPharmacies: async (params?: { city?: string; type?: string; lat?: number; lng?: number }): Promise<Pharmacy[]> => {
    const res = await apiClient.get('/pharmacies/', { params });
    return res.data;
  },

  // Medicines (Affordable Comparison)
  getMedicines: async (search?: string): Promise<Medicine[]> => {
    const res = await apiClient.get('/medicines/', { params: { search } });
    return res.data;
  },

  // Ambulances
  getAmbulances: async (city?: string): Promise<AmbulanceProvider[]> => {
    const res = await apiClient.get('/ambulances/', { params: { city } });
    return res.data;
  },

  // OTP Authentication
  requestOtp: async (mobile: string) => {
    const res = await apiClient.post('/auth/otp/request/', { mobile });
    return res.data;
  },

  verifyOtp: async (mobile: string, otp: string) => {
    const res = await apiClient.post('/auth/otp/verify/', { mobile, otp });
    return res.data;
  },

  // Multilingual AI Triage Chatbot
  sendChatQuery: async (message: string, language: string, city: string) => {
    const res = await apiClient.post('/chatbot/triage/', { message, language, city });
    return res.data;
  },

  // Triage Queue (Hospital Flow Demo)
  getTriageQueue: async (): Promise<TriageTicket[]> => {
    const res = await apiClient.get('/triage-queue/');
    return res.data;
  },

  createTriageTicket: async (ticket: Partial<TriageTicket>): Promise<TriageTicket> => {
    const res = await apiClient.post('/triage-queue/', ticket);
    return res.data;
  },

  updateTriageTicket: async (id: number, data: Partial<TriageTicket>): Promise<TriageTicket> => {
    const res = await apiClient.patch(`/triage-queue/${id}/`, data);
    return res.data;
  },

  // Emergency Medical Passport
  getPassport: async (mobile: string): Promise<EmergencyPassport> => {
    const res = await apiClient.get('/passport/', { params: { mobile } });
    return res.data;
  },

  savePassport: async (passport: Partial<EmergencyPassport>): Promise<EmergencyPassport> => {
    const res = await apiClient.post('/passport/', passport);
    return res.data;
  },
};
