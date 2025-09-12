import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-4 px-3 py-2 bg-gray-900/50 backdrop-blur-lg rounded-full border border-white/10 shadow-lg">
        <Link to="/" className="text-xl font-bold text-white px-3">
          Projex
        </Link>
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/auth" 
            className="px-4 py-1.5 text-sm text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            Log In
          </Link>
          <Link 
            to="/auth" 
            className="px-4 py-1.5 text-sm text-black bg-[#e4ddbc] rounded-full hover:bg-[#e4ddbc]/80 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
