import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ username, email, password });
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 bg-surface rounded-2xl border border-primary/20 shadow-2xl shadow-primary/5 mx-auto"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Create an Account</h2>
        <p className="text-textSoft text-center mb-8">Join the ultimate competitive programming platform</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-center text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textSoft">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-background border border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all"
              placeholder="coder123"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textSoft">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-background border border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-textSoft">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-background border border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-primary hover:bg-primaryLight text-white font-bold rounded-xl transition shadow-lg shadow-primary/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
