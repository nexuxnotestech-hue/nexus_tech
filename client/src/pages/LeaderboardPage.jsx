import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const LeaderboardPage = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-white text-center">Global Leaderboard</h1>
        <p className="text-textSoft mb-12 text-center">See where you stand among the best developers in the world.</p>
        
        <div className="flex flex-col gap-4 mt-8">
          <div className="grid grid-cols-12 px-5 py-4 bg-surface/50 border border-primary/20 rounded-xl text-xs font-black text-primaryLight items-center uppercase tracking-widest shadow-md shadow-primary/5 mb-2 backdrop-blur-sm">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-7 text-left pl-4">User</div>
            <div className="col-span-3 text-right pr-2">Rating</div>
          </div>
          
          {/* Placeholder Rows */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="grid grid-cols-12 bg-surface p-5 rounded-2xl border border-primary/10 hover:border-primary/30 hover:bg-surface/80 transition items-center shadow-md shadow-primary/5">
              <div className="col-span-2 text-center font-bold text-xl text-white flex justify-center">
                {item === 1 ? <Trophy className="text-yellow-400 w-6 h-6" /> : `#${item}`}
              </div>
              <div className="col-span-7 font-medium text-white flex items-center space-x-4 text-left overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-sm border border-primary/30">U{item}</div>
                <span className="truncate text-lg">coder_hero_{item}</span>
              </div>
              <div className="col-span-3 text-right text-accent font-black text-xl">{2500 - (item * 120)}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
