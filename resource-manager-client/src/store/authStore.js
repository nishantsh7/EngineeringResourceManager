// src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // State
  user: null,         
  profile: null,       
  isLoading: true,     
  isAuthReady: false,  // Add this - tracks when auth state is determined

  // Actions
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setAuthReady: (isAuthReady) => set({ isAuthReady }), // Add this action
}));

export default useAuthStore;