import { Trophy, Globe, Mail, MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-surface border-t border-primary/20 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Trophy className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">Nexus</span>
            </Link>
            <p className="text-textMuted mb-6 leading-relaxed">
              The premier platform for competitive programming, algorithmic challenges, and technical skill development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-textMuted hover:text-primary transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-textMuted hover:text-secondaryLight transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-textMuted hover:text-secondary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/contests" className="text-textMuted hover:text-primary transition-colors">All Contests</Link></li>
              <li><Link to="/leaderboard" className="text-textMuted hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link to="/rewards" className="text-textMuted hover:text-primary transition-colors">Rewards Store</Link></li>
              <li><Link to="/discuss" className="text-textMuted hover:text-primary transition-colors">Discussions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-textMuted hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-textMuted hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="text-textMuted hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-textMuted hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-textMuted hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-textMuted hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-textMuted hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-textMuted text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Nexus Tech. All rights reserved.
          </p>
          <p className="text-textMuted text-sm flex items-center">
            Built with <Heart className="w-4 h-4 text-accent mx-1" /> by developers for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
