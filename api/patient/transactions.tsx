import api from "@/lib/axios";
import { TransactionsResponse } from "@/types/live/patient/transactions";

export const fetchMyTransactions = async (): Promise<TransactionsResponse> => {
  const { data } = await api.get("/patient/my-transactions");
  return data;
};