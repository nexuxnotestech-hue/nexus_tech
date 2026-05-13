import API from "../lib/axios";

export const getWalletBalance = async () => {
  return API.get("/api/wallet/balance");
};

export const getTransactions = async () => {
  return API.get("/api/wallet/transactions");
};
