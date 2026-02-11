import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface RegisterPayload {
    email: string;
    password: string;
    agreedToTerms: boolean;
}
  
interface RegisterResponse {
    success: boolean;
    message: string;
    user_id: string;
}


export function useRegister() {
  return useMutation<RegisterResponse, any, RegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post("/register", payload);
      return data;
    },
  });
}