import { useState, useEffect } from 'react';

// This hook behaves like useState, but syncs its value with localStorage.
function usePersistentState(key, initialValue) {
  // 1. Get the initial state. We try to get it from localStorage first.
  // If it's not there, we use the provided initialValue.
  const [state, setState] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      // Parse the stored JSON, or return initialValue if nothing is stored.
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  // 2. This useEffect hook runs whenever the 'state' changes.
  // Its job is to save the new state back into localStorage.
  useEffect(() => {
    try {
      // Convert the state to a JSON string and save it.
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, state]);

  // 3. Return the state and the setter function, just like useState.
  return [state, setState];
}

export default usePersistentState;
