import { useEffect } from 'react';
import useProjectStore from '../store/projectStore';

export const useProjects = () => {
  // Select each piece of state individually to avoid creating new objects
  const projects = useProjectStore((state) => state.projects);
  const loading = useProjectStore((state) => state.loading);
  const error = useProjectStore((state) => state.error);
  
  // Select the actions separately
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const clearProjects = useProjectStore((state) => state.clearProjects);

  useEffect(() => {
    fetchProjects();

    // Return the cleanup function
    return () => {
      clearProjects();
    };
  }, [fetchProjects, clearProjects]);

  return { projects, loading, error };
};