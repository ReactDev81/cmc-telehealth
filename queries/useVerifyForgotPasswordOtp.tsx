import {
    verifyForgotPasswordOtp,
    VerifyForgotPasswordOtpPayload,
    VerifyForgotPasswordOtpResponse,
} from "@/api/authentication/verifyForgotPasswordOtp";
import { useMutation } from "@tanstack/react-query";

export const useVerifyForgotPasswordOtp = () => {
    return useMutation<
        VerifyForgotPasswordOtpResponse,
        unknown,
        VerifyForgotPasswordOtpPayload
    >({
        mutationFn: verifyForgotPasswordOtp,
    });
};
