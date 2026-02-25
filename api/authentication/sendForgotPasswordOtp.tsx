import api from "@/lib/axios";

export interface SendForgotPasswordOtpPayload {
    email: string;
}

export interface SendForgotPasswordOtpResponse {
    message?: string;
    email: string;
}

export const sendForgotPasswordOtp = async (
    payload: SendForgotPasswordOtpPayload,
): Promise<SendForgotPasswordOtpResponse> => {
    const { data } = await api.post("/auth/forgot-password/send-otp", payload);

    return data;
};
