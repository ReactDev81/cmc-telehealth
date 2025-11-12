export type Transaction = {
    id: number;
    name: string;
    paymentMethod: string;
    cardType: string;
    amount: string;
    date: string;
    status: "success" | "failed";
    icon: any;
};