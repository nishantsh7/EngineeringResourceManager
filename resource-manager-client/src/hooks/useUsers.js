import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/config';

export const useUsers = () => {
  const usersRef = useMemo(() => collection(db, 'users'), []);
  const [snapshot, loading, error] = useCollection(usersRef);
  const users = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];


return  { users, loading, error };

};
