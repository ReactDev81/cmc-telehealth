import api from "@/lib/axios";

export interface ResetForgotPasswordPayload {
    email: string;
    reset_token: string;
    password: string;
    password_confirmation: string;
}

export interface ResetForgotPasswordResponse {
    token: string;
}

export const resetForgotPassword = async (
    payload: ResetForgotPasswordPayload,
): Promise<ResetForgotPasswordResponse> => {
    const { data } = await api.post("/auth/forgot-password/reset", payload);

    return data;
};
