import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export const useManageProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore.getState().user;

  const getToken = async () => {
    if (!user) throw new Error('User not authenticated');
    return await user.getIdToken();
  };

  // Function to UPDATE an existing project's details
  const updateProject = async (projectId, updateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await axios.put(`https://projex-backend-897243952721.us-central1.run.app/api/projects/${projectId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true; // Indicate success
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.response?.data?.error || 'Failed to update project.');
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  // Function to DELETE a project
  const deleteProject = async (projectId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await axios.delete(`https://projex-backend-897243952721.us-central1.run.app/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true; // Indicate success
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.response?.data?.error || 'Failed to delete project.');
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProject, deleteProject, isLoading, error };
};
