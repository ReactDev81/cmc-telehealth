import { fetchTransactionDetails } from "@/api/patient/transaction-details";
import { TransactionDetailsResponse } from "@/types/live/patient/transaction-details";
import { useQuery } from "@tanstack/react-query";

export function useTransactionDetails(transactionId?: string) {
  return useQuery<TransactionDetailsResponse>({
    queryKey: ["transaction-details", transactionId],
    queryFn: () => fetchTransactionDetails(transactionId!),
    enabled: !!transactionId, // 🔥 prevents early call
  });
}