import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const RewardsPage = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 max-w-7xl w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-white">Rewards Store</h1>
            <p className="text-textSoft">Redeem your contest points for exclusive merchandise and perks.</p>
          </div>
          <div className="mt-6 md:mt-0 p-4 bg-surface border border-primary/20 rounded-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="text-accent w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-textSoft">Your Balance</p>
              <p className="text-2xl font-bold text-white">1,250 PTS</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Placeholder for Rewards */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-surface border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 transition flex flex-col shadow-lg shadow-primary/5">
              <div className="h-48 bg-gradient-to-br from-background to-surface flex flex-col items-center justify-center border-b border-primary/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Zap className="w-10 h-10 text-primary/40 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-textMuted text-sm font-medium">Reward Image</span>
              </div>
              <div className="p-6 flex flex-col flex-grow gap-3">
                <h3 className="text-xl font-bold text-white mb-1">Nexus T-Shirt</h3>
                <p className="text-textSoft text-sm mb-6 flex-grow leading-relaxed">Exclusive premium cotton t-shirt with Nexus branding.</p>
                <button className="w-full py-3 mt-auto bg-background border border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition font-bold text-sm tracking-wide">
                  Redeem (500 PTS)
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RewardsPage;
