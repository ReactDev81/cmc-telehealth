import { fetchMyTransactions } from "@/api/patient/transactions";
import { TransactionsResponse } from "@/types/live/patient/transactions";
import { useQuery } from "@tanstack/react-query";

export function useMyTransactions() {
  return useQuery<TransactionsResponse>({
    queryKey: ["my-transactions"],
    queryFn: fetchMyTransactions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}