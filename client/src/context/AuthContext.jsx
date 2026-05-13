import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getProfile, firebaseLogin } from '../api/auth.api';
import { signInWithGoogle } from '../lib/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getProfile();
          setUser(res.data.data);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await loginApi(credentials);
      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await registerApi(userData);
      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { idToken } = await signInWithGoogle();
      const res = await firebaseLogin({ idToken });
      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      console.error("Google Login Context Error:", err);
      setError(err.response?.data?.message || 'Google login failed');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
