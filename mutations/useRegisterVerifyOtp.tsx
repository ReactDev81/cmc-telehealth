import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface RegisterVerifyOtpPayload {
  email: string;
  otp: string;
  context: "register" | "login";
}

interface RegisterVerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    avatar: string | null;
    roles: any[];
    patient: any | null;
    doctor: any | null;
  };
}

export function useRegisterVerifyOtp() {
  return useMutation<RegisterVerifyOtpResponse, any, RegisterVerifyOtpPayload>({
    mutationFn: async (payload) => {
      // const { data } = await api.post("/verify-otp", payload);
      const { data } = await api.post("/auth/verify-email", payload);
      return data;
    },
  });
}
