import {
    resetForgotPassword,
    ResetForgotPasswordPayload,
    ResetForgotPasswordResponse,
} from "@/api/authentication/resetForgotPassword";
import { useMutation } from "@tanstack/react-query";

export const useResetForgotPassword = () => {
    return useMutation<
        ResetForgotPasswordResponse,
        unknown,
        ResetForgotPasswordPayload
    >({
        mutationFn: resetForgotPassword,
    });
};
