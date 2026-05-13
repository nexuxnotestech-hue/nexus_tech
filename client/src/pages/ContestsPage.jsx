import { useState } from 'react';
import { motion } from 'framer-motion';

const ContestCard = ({ item }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (isRegistered) return;
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsRegistered(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-surface border border-primary/20 rounded-2xl p-8 hover:border-primary/50 transition flex flex-col justify-between shadow-lg shadow-primary/5">
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Weekly Challenge #{100 + item}</h3>
        <p className="text-textSoft text-sm mb-6">Starts in 2 days</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-1 bg-secondary/10 text-secondaryLight rounded">Algorithms</span>
        <button 
          onClick={handleRegister}
          disabled={isLoading || isRegistered}
          className={`text-sm px-4 py-2 border rounded transition font-bold ${
            isRegistered 
              ? 'bg-primary/20 border-primary/50 text-primaryLight cursor-not-allowed' 
              : 'bg-background border-primary text-primary hover:bg-primary hover:text-white'
          }`}
        >
          {isLoading ? 'Processing...' : isRegistered ? 'Registered ✓' : 'Register'}
        </button>
      </div>
    </div>
  );
};

const ContestsPage = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-12 max-w-7xl w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-white">Active Contests</h1>
        <p className="text-textSoft mb-12">Participate in live programming contests and improve your rating.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {[1, 2, 3].map((item) => (
            <ContestCard key={item} item={item} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContestsPage;
