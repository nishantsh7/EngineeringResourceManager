import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export const useManageAssignments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore.getState().user; // Get user from Zustand

  // Helper to get the auth token
  const getToken = async () => {
    if (!user) {
      setError('You must be logged in to manage assignments.');
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  };

  // Function to ADD one or more new assignments
  const addAssignments = async (projectId, newAssignments) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      // We use Promise.all to send all requests concurrently for efficiency
      await Promise.all(
        newAssignments.map(assignment =>
          axios.post(
            'https://projex-backend-897243952721.us-central1.run.app/api/assignments',
            {
              projectId,
              userId: assignment.userId,
              allocatedHours: assignment.allocatedHours,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
    } catch (err) {
      console.error('Error adding assignments:', err);
      setError(err.response?.data?.error || 'Failed to add assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to UPDATE the hours of an existing assignment
  const updateAssignmentHours = async (assignmentId, allocatedHours) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await axios.put(
        `https://projex-backend-897243952721.us-central1.run.app/api/assignments/${assignmentId}`,
        { allocatedHours },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(err.response?.data?.error || 'Failed to update hours.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to REMOVE an assignment
  const removeAssignment = async (assignmentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await axios.delete(`https://projex-backend-897243952721.us-central1.run.app/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Error removing assignment:', err);
      setError(err.response?.data?.error || 'Failed to remove assignment.');
    } finally {
      setIsLoading(false);
    }
  };

  return { addAssignments, updateAssignmentHours, removeAssignment, isLoading, error };
};
