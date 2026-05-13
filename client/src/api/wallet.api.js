import API from "../lib/axios";

export const getWalletBalance = async () => {
  return API.get("/api/wallet");
};

export const getTransactions = async () => {
  return API.get("/api/wallet/transactions");
};
