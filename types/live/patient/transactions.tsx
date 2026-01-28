export interface Transaction {
    id: string;
    amount: number;
    status: "paid" | "pending" | "failed" | "refunded";
    payment_method: string;
    payment_type: "Card" | "UPI";
    card_last4: string;
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