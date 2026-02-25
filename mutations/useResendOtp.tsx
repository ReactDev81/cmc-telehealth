import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface ResendOtpPayload {
  email: string;
  context: "registration" | "forgot_password";
}

interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export function useResendOtp() {
  return useMutation<ResendOtpResponse, any, ResendOtpPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/resend-otp", payload);
      return data;
    },
  });
}
