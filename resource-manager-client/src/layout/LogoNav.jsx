import { Link } from 'react-router-dom';

const LogoNav = () => {
  return (
    //  Position the header on the top-left
    <header className="fixed top-4 left-4 z-50">
      <nav className="px-3 py-2 bg-gray-900/50 backdrop-blur-lg rounded-full border border-white/10 shadow-lg">
        <Link to="/" className="text-xl font-bold text-white px-3">
          Projex
        </Link>
      </nav>
    </header>
  );
};

export default LogoNav;