import { AcademicWork, UserProfile } from '../types';

const KEYS = {
  USER: 'sm_user',
  WORKS: 'sm_works',
};

export const StorageService = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: UserProfile | null) => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  },
  getWorks: (userId: string): AcademicWork[] => {
    const data = localStorage.getItem(KEYS.WORKS);
    const allWorks: AcademicWork[] = data ? JSON.parse(data) : [];
    return allWorks.filter(w => w.userId === userId);
  },
  saveWork: (work: AcademicWork) => {
    const data = localStorage.getItem(KEYS.WORKS);
    let allWorks: AcademicWork[] = data ? JSON.parse(data) : [];
    const index = allWorks.findIndex(w => w.id === work.id);
    
    // Ensure versions is always an array
    const workToSave = {
      ...work,
      versions: work.versions || []
    };

    if (index > -1) {
      allWorks[index] = { ...workToSave, updatedAt: Date.now() };
    } else {
      allWorks.push({ ...workToSave, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    localStorage.setItem(KEYS.WORKS, JSON.stringify(allWorks));
  }
};