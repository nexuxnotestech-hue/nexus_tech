import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, try to restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem("nexus_token");
    if (token) {
      getMe()
        .then((data) => setUser(data.data.user))
        .catch(() => localStorage.removeItem("nexus_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("nexus_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("nexus_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
