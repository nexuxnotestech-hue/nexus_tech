import API from "../lib/axios";

// POST /api/auth/register
export const registerUser = async ({ name, email, password }) => {
  const res = await API.post("/api/auth/register", { name, email, password });
  return res.data;
};

// POST /api/auth/login
export const loginUser = async ({ email, password }) => {
  const res = await API.post("/api/auth/login", { email, password });
  return res.data;
};

// POST /api/auth/firebase-login  (Google OAuth)
export const firebaseLoginAPI = async ({ idToken }) => {
  const res = await API.post("/api/auth/firebase-login", { idToken });
  return res.data;
};

// GET /api/auth/me
export const getMe = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};
