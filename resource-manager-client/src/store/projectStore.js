// src/store/projectStore.js
import { create } from 'zustand';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

// This will hold the unsubscribe function for our Firestore listener
let unsubscribe = () => {};

const useProjectStore = create((set) => ({
  // State
  projects: [],
  loading: true,
  error: null,

  // Action to fetch projects and set up the real-time listener
  fetchProjects: () => {
    set({ loading: true, error: null });
    
    const projectsCollection = collection(db, 'projects');
    
    // onSnapshot creates a real-time listener
    unsubscribe = onSnapshot(
      projectsCollection, 
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