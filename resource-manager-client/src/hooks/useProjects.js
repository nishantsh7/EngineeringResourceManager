// import { useEffect } from 'react';
// import useProjectStore from '../store/projectStore';

// export const useProjects = () => {
//   // Select each piece of state individually to avoid creating new objects
//   const projects = useProjectStore((state) => state.projects);
//   const loading = useProjectStore((state) => state.loading);
//   const error = useProjectStore((state) => state.error);
  
//   // Select the actions separately
//   const fetchProjects = useProjectStore((state) => state.fetchProjects);
//   const clearProjects = useProjectStore((state) => state.clearProjects);

//   useEffect(() => {
//     fetchProjects();

//     // Return the cleanup function
//     return () => {
//       clearProjects();
//     };
//   }, [fetchProjects, clearProjects]);

//   return { projects, loading, error };
// };

import { useEffect } from 'react';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';

export const useProjects = () => {
  const projects = useProjectStore((state) => state.projects);
  const loading = useProjectStore((state) => state.loading);
  const error = useProjectStore((state) => state.error);
  
  // Get auth state to check if user is ready
  const { user, isAuthReady } = useAuthStore();
  
  useEffect(() => {
    // Only fetch if auth is ready and user exists
    if (!isAuthReady || !user) return;
    
    // Get the actions inside useEffect to avoid dependency issues
    const { fetchProjects, clearProjects } = useProjectStore.getState();
    
    fetchProjects();

    // Return cleanup function
    return () => {
      clearProjects();
    };
  }, [user, isAuthReady]); // Only depend on auth state

  return { projects, loading, error };
};