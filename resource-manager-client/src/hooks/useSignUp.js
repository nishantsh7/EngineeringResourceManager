import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. The function now accepts all the new fields from the form
  const signup = async (email, password, name, skills, duration, role, seniority) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create the user in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res.user) {
        throw new Error('Could not complete signup');
      }

      // 2. Convert the comma-separated skills string into a clean array
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
      
      // 3. Set the capacity based on the selected duration
      const capacity = duration === 'full-time' ? 100 : 50;

      // 4. Create the detailed user document in Firestore with all the new fields
      await setDoc(doc(db, 'users', res.user.uid), {
        name,
        email,
        role,
        seniority,
        duration,
        capacity,
        skills: skillsArray,
      });

    } catch (err) {
      console.error(err.message);
      setError('Failed to sign up. This email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
