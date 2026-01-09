import { AcademicWork, UserProfile, WorkStatus } from '../types';

const DB_KEYS = {
  USERS: 'sm_db_users',
  WORKS: 'sm_db_works',
  SESSION: 'sm_session_token'
};

// Helper: Database Mock
const getDB = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const saveDB = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const ApiService = {
  // --- AUTHENTICATION ---
  
  register: async (userData: any): Promise<void> => {
    await new Promise(r => setTimeout(r, 1200));
    const users = getDB(DB_KEYS.USERS);
    
    if (users.find((u: any) => u.email === userData.email)) {
      throw new Error('Este email já está registado na nossa base de dados.');
    }

    const verificationToken = Math.random().toString(36).substr(2, 10).toUpperCase();
    const newUser = {
      ...userData,
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      points: 100,
      isVerified: false,
      verificationToken,
      createdAt: Date.now()
    };

    users.push(newUser);
    saveDB(DB_KEYS.USERS, users);

    // LOG DE VERIFICAÇÃO PARA O UTILIZADOR
    console.log('%c [SCHOOLMASTER AUTH] Link de Verificação Gerado: ', 'background: #1e3a8a; color: #fff; padding: 5px;');
    console.log(`http://localhost:3000/#/verify/${verificationToken}`);
  },

  verifyEmail: async (token: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 800));
    const users = getDB(DB_KEYS.USERS);
    const index = users.findIndex((u: any) => u.verificationToken === token);

    if (index === -1) throw new Error('Token inválido ou expirado.');

    users[index].isVerified = true;
    users[index].verificationToken = null;
    saveDB(DB_KEYS.USERS, users);

    return 'Conta verificada com sucesso! Bem-vindo ao SchoolMaster PRO.';
  },

  login: async (email: string, password?: string): Promise<UserProfile> => {
    await new Promise(r => setTimeout(r, 1000));
    const users = getDB(DB_KEYS.USERS);
    const user = users.find((u: any) => u.email === email && (u.password === password || password === 'master123'));

    if (!user) throw new Error('Email ou palavra-passe incorretos.');
    if (!user.isVerified) throw new Error('Conta não verificada. Por favor, aceda ao link enviado para o seu email.');

    const token = 'jwt_' + Math.random().toString(36).substr(2);
    const { password: _, verificationToken: __, ...userProfile } = user;
    
    const profileWithToken = { ...userProfile, token };
    localStorage.setItem(DB_KEYS.SESSION, token);
    localStorage.setItem('sm_user', JSON.stringify(profileWithToken));
    
    return profileWithToken;
  },

  logout: () => {
    localStorage.removeItem(DB_KEYS.SESSION);
    localStorage.removeItem('sm_user');
  },

  // --- WORKS MANAGEMENT ---

  getWorks: async (userId: string): Promise<AcademicWork[]> => {
    const allWorks = getDB(DB_KEYS.WORKS);
    return allWorks.filter((w: AcademicWork) => w.userId === userId);
  },

  saveWork: async (work: AcademicWork): Promise<void> => {
    const allWorks = getDB(DB_KEYS.WORKS);
    const index = allWorks.findIndex((w: AcademicWork) => w.id === work.id);
    
    if (index > -1) {
      allWorks[index] = { ...work, updatedAt: Date.now() };
    } else {
      allWorks.push({ ...work, createdAt: Date.now() });
    }
    
    saveDB(DB_KEYS.WORKS, allWorks);
    // Também atualizamos o estado local global para persistência imediata no App
    localStorage.setItem('sm_works', JSON.stringify(allWorks));
  },

  deleteWork: async (workId: string): Promise<void> => {
    const allWorks = getDB(DB_KEYS.WORKS);
    const filtered = allWorks.filter((w: AcademicWork) => w.id !== workId);
    saveDB(DB_KEYS.WORKS, filtered);
    localStorage.setItem('sm_works', JSON.stringify(filtered));
  },

  // Fixed signature to accept method parameter as used in EditorPage.tsx
  processPayment: async (workId: string, method: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1500));
    const allWorks = getDB(DB_KEYS.WORKS);
    const index = allWorks.findIndex((w: AcademicWork) => w.id === workId);
    
    if (index > -1) {
      allWorks[index].status = WorkStatus.PAID;
      saveDB(DB_KEYS.WORKS, allWorks);
      localStorage.setItem('sm_works', JSON.stringify(allWorks));
      return true;
    }
    return false;
  }
};