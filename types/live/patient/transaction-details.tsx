export interface TransactionDetails {
    id: string;
    amount: string;
    currency: string;
    status: "paid" | "failed" | "pending";
    status_label: string;
    date: string;
    transaction_id: string;
    order_id: string;
    payment_method: string;
    paid_to: string;
    account_details: string;
    receipt_url: string;
}
  
export interface TransactionDetailsResponse {
    status: boolean;
    message: string;
    data: TransactionDetails;
}  