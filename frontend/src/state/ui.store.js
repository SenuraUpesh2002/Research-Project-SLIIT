import { create } from 'zustand';

const useUiStore = create((set) => ({
  isSidebarOpen: false,
  isLoading: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useUiStore;
