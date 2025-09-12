import { collection, query, where } from 'firebase/firestore';
import { useCollection} from 'react-firebase-hooks/firestore';
import { db } from '../firebase/config';
import { useMemo } from 'react';

export const useAssignmentsForProject = (projectId) => {
  const assignmentsRef = useMemo(() => collection(db, 'assignments'), []);
  const q = projectId
    ? query(assignmentsRef, where('projectId', '==', projectId))
    : null;
 
 const [snapshot, loading, error] = useCollection(q);
 const assignments = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) ?? [];

  return { assignments, loading, error };
};