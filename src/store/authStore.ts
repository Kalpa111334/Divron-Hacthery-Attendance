import { create } from 'zustand';
import { db } from '../lib/db';

interface AuthState {
  user: { id: number; username: string; isAdmin: boolean; employeeId?: number } | null;
  login: (username: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (username, password, isAdmin) => {
    const user = await db.getUser(username, password, isAdmin);
    if (user) {
      set({ 
        user: { 
          id: user.id, 
          username: user.username, 
          isAdmin: user.isAdmin,
          employeeId: user.employeeId 
        } 
      });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
}));