import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/config';

export const useAssignments = () => {
  const assignmentsRef = useMemo(() => collection(db, 'assignments'), []);
  const [snapshot, loading, error] = useCollection(assignmentsRef);

  const assignments = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) ?? [];

  return { assignments, loading, error };
};


  
//   const [assignments, loading, error] = useCollectionData(assignmentsRef, { idField: 'id' });

//   return { assignments, loading, error };
// };


// import { useCollection } from 'react-firebase-hooks/firestore';
// import { db } from '../firebase/config';

// export const useEngineers = () => {
//   const usersRef = collection(db, 'users');
//   const q = query(usersRef, where('role', '==', 'Engineer'));

//   // ✅ Hook always runs at top level
//   const [snapshot, loading, error] = useCollection(q);

//   // Map snapshot docs to objects with id
//   const engineers = snapshot?.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return { engineers, loading, error };
// };
