import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import BottomNavbar from '../components/ui/BottomNav'; 

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto pb-20 md:pb-8">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default DashboardLayout;

