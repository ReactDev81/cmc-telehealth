import api from "@/lib/axios";

export interface ResetForgotPasswordPayload {
    login: string;
    country_code?: string;
    reset_token: string;
    password: string;
    password_confirmation: string;
}

export interface ResetForgotPasswordResponse {
    success?: boolean;
    message?: string;
    token?: string;
    data?: any;
}

export const resetForgotPassword = async (
    payload: ResetForgotPasswordPayload,
): Promise<ResetForgotPasswordResponse> => {
    const { data } = await api.post("/auth/forgot-password/reset", payload);
    return data;
};
