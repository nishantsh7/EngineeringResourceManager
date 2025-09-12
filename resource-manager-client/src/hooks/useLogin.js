// src/hooks/useLogin.js
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Attempt to sign in the user
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err.message);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};