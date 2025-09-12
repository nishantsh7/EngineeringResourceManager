import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore.getState().user;

  const getToken = async () => {
    if (!user) throw new Error('User not authenticated');
    return await user.getIdToken();
  };

  const updateProfile = async (userId, updateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await axios.put(`http://localhost:5000/api/users/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true; // Indicate success
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile.');
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
};
