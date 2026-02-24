import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface CompleteProfilePayload {
  date_of_birth: string; // YYYY-MM-DD
  first_name: string;
  last_name: string;
  gender: "male" | "female" | "other";
  mobile_no: string;
  email: string;
  password: string;
}

interface CompleteProfileVariables {
  payload: CompleteProfilePayload;
}

interface Address {
  address: string | null;
  area: string | null;
  city: string | null;
  landmark: string | null;
  pincode: string | null;
  state: string | null;
}

interface CompleteProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string; // API returns full name, not split
    patient_id: string | null;
    avatar: string;
    email: string;
    gender: string;
    phone: string;
    date_of_birth: string;
    status: string;
    address: Address;
  };
  token: string;
}

// export function useCompleteProfile() {
//   return useMutation<CompleteProfileResponse, any, CompleteProfilePayload>({
//     mutationFn: async (payload) => {
//       const { data } = await api.post("/complete-profile", payload);
//       return data;
//     },
//   });
// }

export function useCompleteProfile() {
  return useMutation<CompleteProfileResponse, any, CompleteProfileVariables>({
    mutationFn: async ({ payload }) => {
      const { data } = await api.post("/auth/complete-profile", payload);

      return data;
    },
  });
}
