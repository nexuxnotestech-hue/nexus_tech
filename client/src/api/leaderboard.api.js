import API from "../lib/axios";

export const getLeaderboard = async (contestId) => {
  return API.get(`/api/leaderboard/${contestId}`);
};

export const getGlobalLeaderboard = async () => {
  return API.get("/api/leaderboard/global");
};
