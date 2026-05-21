import { create } from 'zustand';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  balance: string;
  setAuth: (user: any, token: string) => void;
  setBalance: (balance: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  balance: '0.00',
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setBalance: (balance) => set({ balance }),
  logout: () => set({ user: null, accessToken: null, balance: '0.00' }),
}));
