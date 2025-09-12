import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      
      {/* The Outlet is where our different pages (Projects, Team) will be rendered by the router */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;