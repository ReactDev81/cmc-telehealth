import {
    sendForgotPasswordOtp,
    SendForgotPasswordOtpPayload,
    SendForgotPasswordOtpResponse,
} from "@/api/authentication/sendForgotPasswordOtp";
import { useMutation } from "@tanstack/react-query";

export const useSendForgotPasswordOtp = () => {
    return useMutation<
        SendForgotPasswordOtpResponse,
        unknown,
        SendForgotPasswordOtpPayload
    >({
        mutationFn: sendForgotPasswordOtp,
    });
};
