import api from "@/lib/axios";

export interface ResetForgotPasswordPayload {
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ResetForgotPasswordResponse {
    token: string;
}

export const resetForgotPassword = async (
    payload: ResetForgotPasswordPayload,
): Promise<ResetForgotPasswordResponse> => {
    const { data } = await api.post("/forgot-password/reset-password", payload);

    return data;
};
