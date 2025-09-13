import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import useAuthStore from './store/authStore';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import TeamPage from './pages/TeamPage';
import EngineerProfilePage from './pages/EngineerProfilePage';

function App() {
  const { user, setUser, setProfile, setLoading, setAuthReady } = useAuthStore();
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const unsubscribeProfile = onSnapshot(userRef, (doc) => {
          setProfile(doc.exists() ? { id: doc.id, ...doc.data() } : null);
          setLoading(false);
          setAuthReady(true); // Set auth as ready when profile is loaded
        }, (error) => {
          console.error("Error fetching user profile:", error);
          setLoading(false);
          setAuthReady(true); // Still set as ready even if profile fetch fails
        });
        
        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
        setAuthReady(true); // Set auth as ready when no user
      }
    });
    
    return () => unsubscribeAuth();
  }, [setUser, setProfile, setLoading, setAuthReady]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#161616]">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      
      <Route element={user ? <DashboardLayout /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/:engineerId" element={<EngineerProfilePage />} />
        <Route path="/profile" element={<EngineerProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;