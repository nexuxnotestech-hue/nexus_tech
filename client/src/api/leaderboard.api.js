import API from "../lib/axios";

export const getLeaderboard = async (contestId) => {
  return API.get(`/api/contests/${contestId}/leaderboard`);
};

export const getGlobalLeaderboard = async () => {
  return API.get("/api/leaderboard");
};
