import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "patient" | "doctor";
  };
}

export function useLogin() {
  return useMutation<LoginResponse, any, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post("/login", payload);
      return data;
    },
  });
}
