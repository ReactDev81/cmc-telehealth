import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export interface LoginPayload {
  login: string;
  password: string;
  country_code?: string;
  email?: string;
  phone?: string;
  remember?: boolean;
  expo_push_token?: string | null;
  device_type?: string | null;
  device_name?: string | null;
  app_version?: string | null;
}

interface Address {
  address: string | null;
  area: string | null;
  city: string | null;
  landmark: string | null;
  pincode: string | null;
  state: string | null;
}

interface LoginResponse {
  token: string;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    role: "patient" | "doctor";
    gender: string;
    date_of_birth: string;
    phone: string;
    status: string;
    patient_id?: string;
    doctor_id?: string;
    address: Address;
    existing_patient_id?: string;
    is_existing_patient?: boolean;
  };
}

export function useLogin() {
  return useMutation<LoginResponse, any, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/login", payload);
      return data;
    },
  });
}
