import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface CompleteProfilePayload {
    date_of_birth: string; // YYYY-MM-DD
    first_name: string;
    last_name: string;
    gender: "male" | "female" | "other";
    mobile_no: string;
}

interface CompleteProfileVariables {
  payload: CompleteProfilePayload;
  token: string;
}

interface CompleteProfileResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        patient_id: string | null;
        doctor_id: string | null;
        name: string;
        email: string;
        role: string | null;
        gender: string;
        phone: string;
        date_of_birth: string;
    };
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
  return useMutation<
    CompleteProfileResponse,
    any,
    CompleteProfileVariables
  >({
    mutationFn: async ({ payload, token }) => {
      const { data } = await api.post(
        "/complete-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
  });
}