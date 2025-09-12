import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createProject = async (projectData) => {
    setIsLoading(true);
    setError(null);
    
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      setError('You must be logged in to create a project.');
      setIsLoading(false);
      return false;
    }

    try {
      const token = await currentUser.getIdToken();
      
      await axios.post('http://localhost:5000/api/projects', projectData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIsLoading(false);
      return true;
      
    } catch (err) {
      console.error('Error creating project:', err);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'An unexpected error occurred.';
      
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return { createProject, isLoading, error };
};