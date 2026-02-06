import {
  updatePatientProfile
} from "@/api/patient/updatePatientProfile";
import { useMutation } from "@tanstack/react-query";

export function useUpdatePatientProfile(patientId: string) {
  return useMutation({
    // Accept either JSON payload or FormData
    mutationFn: (payload: any) =>
      updatePatientProfile(patientId, payload),
  });
}
