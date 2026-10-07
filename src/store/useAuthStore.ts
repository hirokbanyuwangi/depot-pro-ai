import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'admin' | 'staff' | null;

interface AuthState {
  user: { name: string; role: Role } | null;
  login: (name: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (name, role) => set({ user: { name, role } }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
