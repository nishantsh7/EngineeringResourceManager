import { collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/config';
import useAuthStore from '../store/authStore';

export const useMyProjects = () => {
  // 1. Get the current logged-in user's information from our Zustand store.
  const { user } = useAuthStore.getState();
  const projectsRef = collection(db, 'projects');
  const q = user 
    ? query(projectsRef, where('assigneeIds', 'array-contains', user.uid))
    : null;

  // 4. Use the hook to fetch the data. If the query is null, it won't fetch anything.
  const [projects, loading, error] = useCollectionData(q, { idField: 'id' });

  // 5. Return the personalized list of projects.
  return { myProjects: projects, loading, error };
};