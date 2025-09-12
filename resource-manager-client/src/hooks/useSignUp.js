import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (email, password, name) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create the user in Firebase Authentication
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      if (!res.user) {
        throw new Error('Could not complete signup');
      }

      // 2. Create the user document in our 'users' collection in Firestore
      // This is where we assign the default role
      await setDoc(doc(db, 'users', res.user.uid), {
        name: name,
        email: email,
        role: 'Engineer', // All new signups default to Engineer
        capacity: 40,      // Default capacity
        skills: [],        // Default empty skills array
      });

      // If we get here, success! The onAuthStateChanged listener in App.jsx
      // will automatically log the user in and update the global state.

    } catch (err) {
      console.error(err.message);
      setError('Failed to sign up. This email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
