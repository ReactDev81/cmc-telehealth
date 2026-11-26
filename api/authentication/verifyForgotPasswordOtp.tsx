import api from "@/lib/axios";

export interface VerifyForgotPasswordOtpPayload {
    login: string;
    country_code?: string;
    otp: string;
}

export interface VerifyForgotPasswordOtpResponse {
    success?: boolean;
    message?: string;
    data: {
        login: string;
        reset_token: string;
    };
}

export const verifyForgotPasswordOtp = async (
    payload: VerifyForgotPasswordOtpPayload,
): Promise<VerifyForgotPasswordOtpResponse> => {
    const { data } = await api.post("/auth/forgot-password/verify-otp", payload);
    return data;
};
