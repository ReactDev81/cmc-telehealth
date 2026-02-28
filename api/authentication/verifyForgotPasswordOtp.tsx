import api from "@/lib/axios";

export interface VerifyForgotPasswordOtpPayload {
    email: string;
    otp: string;
    context: "forgot_password";
}

export interface VerifyForgotPasswordOtpResponse {
    data: {
        email: string;
        reset_token: string;
    }
}

export const verifyForgotPasswordOtp = async (
    payload: VerifyForgotPasswordOtpPayload,
): Promise<VerifyForgotPasswordOtpResponse> => {
    const { data } = await api.post("/auth/forgot-password/verify-otp", payload);
    return data;
};
