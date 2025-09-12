import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar'; 

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#101010] text-white overflow-hidden">
      <Navbar />
      <main className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Manage Your Engineering Team
            <br />
            with Effortless Clarity
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            Projex is the ultimate resource management system designed to track team assignments, capacity, and availability, ensuring your projects are always on track.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/auth" 
              className="px-6 py-3 text-lg font-semibold text-black bg-[#e4ddbc] rounded-lg hover:bg-[#e4ddbc]/80 transition-colors"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e4ddbc]/10 rounded-full blur-3xl" />
      </main>
    </div>
  );
};

export default HomePage;
