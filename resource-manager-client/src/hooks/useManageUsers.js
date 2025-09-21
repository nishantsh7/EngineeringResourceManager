import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export const useManageUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore.getState().user;

  const getToken = async () => {
    if (!user) throw new Error('User not authenticated');
    return await user.getIdToken();
  };

  const updateUserAsAdmin = async (userIdToUpdate, updateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await axios.put(
        `https://projex-backend-897243952721.us-central1.run.app/api/users/admin/${userIdToUpdate}`, 
        updateData, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return true; 
    } catch (err) {
      console.error('Error updating user as admin:', err);
      setError(err.response?.data?.error || 'Failed to update user.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserAsAdmin, isLoading, error };
};
