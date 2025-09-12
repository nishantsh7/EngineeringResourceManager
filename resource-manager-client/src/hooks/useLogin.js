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
      
      // If successful, the onAuthStateChanged listener in App.jsx
      // will handle everything else (updating global state, redirecting).
      // So we don't need to do anything else here.

    } catch (err) {
      console.error(err.message);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Return the things our component will need
  return { login, isLoading, error };
};