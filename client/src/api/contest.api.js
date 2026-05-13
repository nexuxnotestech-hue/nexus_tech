import API from "../lib/axios";

// Get live contests
export const getLiveContests = async () => {
  return API.get("/api/contests"); // Backend route is /api/contests
};

// Get contest by ID
export const getContestById = async (id) => {
  return API.get(`/api/contests/${id}`);
};
