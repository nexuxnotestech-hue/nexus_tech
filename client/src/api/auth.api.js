import API from "../lib/axios";

export const login = async (credentials) => {
  return API.post("/api/auth/login", credentials);
};

export const register = async (userData) => {
  return API.post("/api/auth/register", userData);
};

export const getProfile = async () => {
  return API.get("/api/auth/profile");
};
