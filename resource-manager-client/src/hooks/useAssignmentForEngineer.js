import { collection, query, where } from 'firebase/firestore';
import { useCollection} from 'react-firebase-hooks/firestore';
import { db } from '../firebase/config';
import { useMemo } from 'react';

export const useAssignmentsForEngineer = (engineerId) => {
  const assignmentsRef = useMemo(() => collection(db, 'assignments'), []);
  const q = engineerId
    ? query(assignmentsRef, where('userId', '==', engineerId))
    : null;
    const [snapshot, loading, error] = useCollection(q);
    const assignments = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) ?? [];

  return [assignments, loading, error]
};

// export const useAssignments = () => {
//   const assignmentsRef = useMemo(() => collection(db, 'assignments'), []);
//   const [snapshot, loading, error] = useCollection(assignmentsRef);

//   const assignments = snapshot?.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   })) ?? [];

//   return { assignments, loading, error };
// };

