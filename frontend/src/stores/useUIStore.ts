import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: localStorage.getItem('sidebar-collapsed') === 'true',
  toggleSidebar: () => set((state) => {
    const newState = !state.sidebarCollapsed;
    localStorage.setItem('sidebar-collapsed', String(newState));
    return { sidebarCollapsed: newState };
  }),
  setSidebarCollapsed: (collapsed: boolean) => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
    set({ sidebarCollapsed: collapsed });
  },
}));
