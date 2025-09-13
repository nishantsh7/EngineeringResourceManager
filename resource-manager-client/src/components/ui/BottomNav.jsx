import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import useAuthStore from '../../store/authStore';
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const BottomNavbar = () => {
  const { profile } = useAuthStore();
  const handleLogout = async () => { await signOut(auth); };
  const getLinkClass = ({ isActive }) => {
    return isActive 
      ? "flex flex-col items-center gap-1 text-[#e4ddbc] transition-colors" // Active style
      : "flex flex-col items-center gap-1 text-[#84858c] hover:text-[#e4ddbc] transition-colors"; // Inactive style
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-lg border-t border-[#2D2D2D] md:hidden">
      <div className="flex justify-around items-center h-16">
        <NavLink to="/dashboard" className={({ isActive }) => getLinkClass({ isActive })} end>
          <Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3v-1.5A2.25 2.25 0 016 0h12A2.25 2.25 0 0120.25 1.5V3M3.75 3H1.5m19.5 0H22.5" />
          {profile?.role==="Engineer"? <span className="text-xs">Assignments</span>:<span className="text-xs">Projects</span>}
        </NavLink>
        {profile?.role === 'Manager' && (
          <NavLink to="/team" className={({ isActive }) => getLinkClass({ isActive })}>
            <Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493m0 0v-.003c0-1.113-.285-2.16-.786-3.07m0 0v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12A3 3 0 1012 6a3 3 0 000 6z" />
            <span className="text-xs">Team</span>
          </NavLink>
        )}
        {profile?.role === 'Engineer' && (
          <NavLink to="/profile" className={({ isActive }) => getLinkClass({ isActive })}>
            <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            <span className="text-xs">Profile</span>
          </NavLink>
        )}

        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-[#84858c] hover:text-[#e4ddbc] transition-colors">
          <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" />
          <span className="text-xs">Log Out</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavbar;
