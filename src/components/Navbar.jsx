import { Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contests', path: '/contests' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Rewards', path: '/rewards' },
  ];

  return (
    <nav className="w-full bg-surface/80 border-b border-primary/20 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-white tracking-wide">Nexus</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`font-medium transition-colors hover:text-primaryLight ${location.pathname === link.path ? 'text-primary' : 'text-textSoft'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="px-5 py-2.5 rounded-lg font-medium text-textSoft hover:text-white hover:bg-background transition">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-primary hover:bg-primaryLight text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(168,85,247,0.5)] transition">
              Register
            </Link>
          </div>

          <button 
            className="md:hidden text-textSoft hover:text-white transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-primary/20 absolute w-full left-0 top-20 shadow-2xl">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium p-3 rounded-lg ${location.pathname === link.path ? 'bg-primary/10 text-primary' : 'text-textSoft hover:bg-background hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-primary/10 pt-4 mt-2 flex flex-col space-y-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="px-5 py-3 text-center rounded-lg font-medium text-textSoft bg-background hover:text-white transition">
                Log in
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="px-5 py-3 text-center bg-primary text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(168,85,247,0.5)] transition">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
