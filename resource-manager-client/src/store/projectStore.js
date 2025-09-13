import { create } from 'zustand';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import useAuthStore from './authStore';

// This will hold the unsubscribe function for our Firestore listener
let unsubscribe = () => {};

const useProjectStore = create((set) => ({
  // State
  projects: [],
  loading: true,
  error: null,

  // Action to fetch projects and set up the real-time listener
  fetchProjects: () => {
    // Get current auth state
    const { user } = useAuthStore.getState();
    
    // Don't fetch if no user
    if (!user) {
      set({ projects: [], loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    
    // Clean up any existing listener
    unsubscribe();
    
    // Create query filtered by the current user
    const projectsQuery = query(
      collection(db, 'projects'),
      where('createdBy', '==', user.uid) // Adjust this field name based on your data structure
    );
    
    // onSnapshot creates a real-time listener
    unsubscribe = onSnapshot(
      projectsQuery, 
      (snapshot) => {
        // This function runs every time the collection changes
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        set({ projects: projectsData, loading: false });
      },
      (err) => {
        // This function runs if there's an error
        console.error("Error fetching projects:", err);
        set({ error: err.message, loading: false });
      }
    );
  },
  
  // Action to clean up the listener when it's no longer needed
  clearProjects: () => {
    unsubscribe();
    set({ projects: [], loading: true });
  }
}));

export default useProjectStore;