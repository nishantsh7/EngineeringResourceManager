import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { NavLink } from 'react-router-dom';
// We no longer need to import useAuthStore here since it's not being used yet.

// A helper component for SVG icons
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const Sidebar = () => {
  // This is the function that will handle logging the user out.
  const handleLogout = async () => {
    await signOut(auth);
  };
  const getLinkClass = ({ isActive }) => {
    return isActive
      ? "flex items-center gap-3 p-2 rounded-lg bg-[#007AFF] text-white transition-colors" // Style for the active link
      : "flex items-center gap-3 p-2 rounded-lg text-[#A9A9A9] hover:bg-[#2D2D2D] transition-colors"; // Style for inactive links
  };

  return (
    <aside className="hidden md:flex w-52 flex-shrink-0 bg-[#101010] p-6 flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white mb-12">TK.VP</h1>
        <nav className="space-y-4">
          <NavLink to="/" className={getLinkClass} end>
            <Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3v-1.5A2.25 2.25 0 016 0h12A2.25 2.25 0 0120.25 1.5V3M3.75 3H1.5m19.5 0H22.5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/team" className={getLinkClass}>
            <Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12A3 3 0 1012 6a3 3 0 000 6z" />
            <span>Team</span>
          </NavLink>
          {/* Add more nav links as needed */}
        </nav>
      </div>
      <nav>
         <a href="#" onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-lg text-[#edeef4] hover:bg-[--color-dark-border]">
          <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" />
          <span>Log Out</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;

