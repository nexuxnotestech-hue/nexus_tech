import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex-grow flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center min-h-[80vh] bg-surface relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center p-8 max-w-4xl z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-background/50 border border-primary/30 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
          >
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primaryLight">The #1 Platform for Coding Contests</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
            Code, Compete, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondaryLight">Conquer</span>
          </h1>
          <p className="text-xl md:text-2xl text-textSoft mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Join the ultimate competitive programming arena. Solve complex algorithmic challenges and climb the global leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center items-center">
            <Link to="/register" className="group relative px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition duration-300 w-full sm:w-auto text-center flex items-center justify-center">
              <span>Start Competing</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contests" className="px-8 py-4 bg-background border border-primary/30 text-white font-bold rounded-lg hover:bg-surface hover:border-primary/50 transition duration-300 w-full sm:w-auto text-center">
              View Contests
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-secondaryLight" />}
              title="Real-Time Contests"
              description="Compete in lightning-fast, highly concurrent programming contests with live leaderboards and instant evaluation."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-primaryLight" />}
              title="Global Community"
              description="Join a thriving community of developers. Discuss problems, share solutions, and form competitive teams."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Trophy className="w-8 h-8 text-accent" />}
              title="Earn Rewards"
              description="Climb the ranks and earn exclusive rewards, badges, and recognition on your professional profile."
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-surface border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-primary/5"
    >
      <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center mb-6 border border-primary/20">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-textSoft leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default HomePage;
