import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  defaultPet?: {
    id: string;
    name: string;
    displayName: string;
    avatar?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoggingIn: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true, // Start true while we check auth
  isLoggingIn: false,
  error: null,
  login: async (email, password) => {
    set({ isLoggingIn: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      set({ 
        user: data.user, 
        isAuthenticated: true,
        isLoggingIn: false 
      });
    } catch (error: unknown) {
      set({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoggingIn: false 
      });
      throw error;
    }
  },
  logout: async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      set({ user: null, isAuthenticated: false, error: null });
    }
  },
  checkAuth: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`);
      
      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const data = await response.json();
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isCheckingAuth: false 
      });
    } catch {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isCheckingAuth: false 
      });
    }
  }
}));
