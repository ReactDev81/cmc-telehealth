import api from "@/lib/axios";

export interface SendForgotPasswordOtpPayload {
    login: string;
    country_code?: string;
}

export interface SendForgotPasswordOtpResponse {
    success?: boolean;
    message?: string;
    data?: any;
}

export const sendForgotPasswordOtp = async (
    payload: SendForgotPasswordOtpPayload,
): Promise<SendForgotPasswordOtpResponse> => {
    const { data } = await api.post("/auth/forgot-password/send-otp", payload);
    return data;
};
