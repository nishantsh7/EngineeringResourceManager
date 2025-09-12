import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import useAuthStore from './store/authStore'
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layout/DashboardLayout'; 
import DashboardPage from './pages/DashboardPage';   
import TeamPage from './pages/TeamPage';    
import EngineerProfilePage from './pages/EngineerProfilePage';        

function App() {
  const { user, setUser, setProfile, setLoading } = useAuthStore();
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const unsubscribeProfile = onSnapshot(userRef, (doc) => {
          setProfile(doc.exists() ? { id: doc.id, ...doc.data() } : null);
          setLoading(false);
        });
        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, [setUser, setProfile, setLoading]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#161616]">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
      
      <Route element={user ? <DashboardLayout /> : <Navigate to="/auth" />}>
        <Route path="/" element={<DashboardPage />} />

        {/* --- THIS IS THE KEY CHANGE --- */}
        {/* The more specific route now comes BEFORE the more general one. */}
        <Route path="/team/:engineerId" element={<EngineerProfilePage />} />
        <Route path="/team" element={<TeamPage />} />

      </Route>

      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
    </Routes>
  );
}

export default App;
