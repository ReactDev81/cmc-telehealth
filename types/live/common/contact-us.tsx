export interface ContactUsPayload {
    first_name: string;
    last_name: string;
    email?: string;
    subject: string;
    message: string;
    user_id?: string;
}

export interface ContactUsResponse {
    success: boolean;
    message: string;
    path: string;
    timestamp: string;
    data: {
        id: number;
        user_id: string | null;
        first_name: string;
        last_name: string;
        email: string;
        message: string;
        created_at: string;
        updated_at: string;
    };
}
