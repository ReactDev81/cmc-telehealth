export interface Transaction {
    id: string;
    amount: number;
    // API can return paid/pending/failed/refunded; allow "success" for backward compatibility
    status: "paid" | "pending" | "failed" | "refunded";
    payment_method: string;
    transaction_id: string;
    created_at: string;
    patient_name: string;
    upi_id: string;
    date: string;
}
  
export interface TransactionsResponse {
    success: boolean;
    data: Transaction[];
}  