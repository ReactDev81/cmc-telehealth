import api from "@/lib/axios";

export interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

export const changePassword = async (
    payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> => {
    const response = await api.post("/change-password", payload);

    // 🔥 MUST return response.data
    return response.data;
};
