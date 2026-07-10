import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  notifications: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  addNotification: (notification) => set((s) => ({
    notifications: [...s.notifications, { id: Date.now(), ...notification }],
  })),
  removeNotification: (id) => set((s) => ({
    notifications: s.notifications.filter(n => n.id !== id),
  })),
}));

export const useResumeStore = create((set) => ({
  resumes: [],
  currentResume: null,
  analysis: null,
  improvements: null,
  isAnalyzing: false,
  isImproving: false,

  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  addResume: (resume) => set((s) => ({ resumes: [resume, ...s.resumes] })),
  removeResume: (id) => set((s) => ({ resumes: s.resumes.filter(r => r._id !== id) })),
  setAnalysis: (analysis) => set({ analysis }),
  setImprovements: (improvements) => set({ improvements }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setImproving: (isImproving) => set({ isImproving }),
}));
