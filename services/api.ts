
import { AcademicWork, UserProfile, WorkStatus } from '../types';
import { StorageService } from './storage';

const BASE_URL = 'http://localhost:3001/api';

/**
 * PRO Version API Service
 * Integrates with a real Express backend.
 */
export const ApiService = {
  // Authentication
  login: async (email: string, password?: string): Promise<UserProfile> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha no login');
    }

    const data = await response.json();
    const userWithToken = { ...data.user, token: data.token };
    StorageService.setUser(userWithToken);
    return userWithToken;
  },

  register: async (userData: any): Promise<UserProfile> => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha no registo');
    }

    const data = await response.json();
    const userWithToken = { ...data.user, token: data.token };
    StorageService.setUser(userWithToken);
    return userWithToken;
  },

  // Perfil
  getProfile: async (token: string): Promise<UserProfile> => {
    const response = await fetch(`${BASE_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Sessão expirada');
    return response.json();
  },

  // Works Management (Mantido Local por agora, mas preparado para Sync)
  getWorks: async (userId: string): Promise<AcademicWork[]> => {
    return StorageService.getWorks(userId);
  },

  saveWork: async (work: AcademicWork): Promise<void> => {
    StorageService.saveWork(work);
  },

  processPayment: async (workId: string, method: string): Promise<boolean> => {
    // Simulação de endpoint de pagamento
    await new Promise(r => setTimeout(r, 2000));
    const works = JSON.parse(localStorage.getItem('sm_works') || '[]');
    const idx = works.findIndex((w: any) => w.id === workId);
    if (idx !== -1) {
      works[idx].status = WorkStatus.PAID;
      works[idx].paymentId = 'PAY-' + Math.random().toString(36).toUpperCase().substr(2, 8);
      localStorage.setItem('sm_works', JSON.stringify(works));
      return true;
    }
    return false;
  }
};
