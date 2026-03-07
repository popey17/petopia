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
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start true while we check auth
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/v1/auth/login', {
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
        isLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false 
      });
      throw error;
    }
  },
  logout: async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      set({ user: null, isAuthenticated: false, error: null });
    }
  },
  checkAuth: async () => {
    try {
      const response = await fetch('/api/v1/auth/me');
      
      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const data = await response.json();
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  }
}));
