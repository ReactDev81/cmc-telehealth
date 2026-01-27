import api from "@/lib/axios";
import { TransactionDetailsResponse } from "@/types/live/patient/transaction-details";

export const fetchTransactionDetails = async (
  transactionId: string
): Promise<TransactionDetailsResponse> => {
  const { data } = await api.get(
    `/patient/transactions/${transactionId}`
  );
  return data;
};