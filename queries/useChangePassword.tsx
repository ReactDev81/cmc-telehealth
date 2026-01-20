import {
    changePassword,
    ChangePasswordPayload,
    ChangePasswordResponse,
} from "@/api/authentication/changePassword";
import { useMutation } from "@tanstack/react-query";

export const useChangePassword = () => {
    return useMutation<ChangePasswordResponse, any, ChangePasswordPayload>({
        mutationFn: changePassword,
    });
};
