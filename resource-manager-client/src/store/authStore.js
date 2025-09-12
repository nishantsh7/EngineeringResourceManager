// src/store/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // State
  user: null,         // Will hold Firebase Auth user object
  profile: null,       // Will hold user profile from our 'users' collection (with role)
  isLoading: true,     // To know when we are checking for the initial auth state

  // Actions
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;