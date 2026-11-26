import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export interface RegisterPayload {
  country_code: string;
  login: string;
  email?: string;
  password?: string;
  agreedToTerms?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  code?: string;
  path?: string;
  timestamp?: string;
  data?: {
    email?: string;
    login?: string;
    channel?: string;
    sent_to?: string;
  };
  user_id?: string;
}

export function useRegister() {
  return useMutation<RegisterResponse, any, RegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/register", payload);
      return data;
    },
  });
}
