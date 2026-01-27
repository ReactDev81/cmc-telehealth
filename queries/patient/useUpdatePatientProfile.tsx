import {
    updatePatientProfile,
    UpdatePatientProfilePayload,
} from "@/api/patient/updatePatientProfile";
import { useMutation } from "@tanstack/react-query";

export function useUpdatePatientProfile(patientId: string) {
  return useMutation({
    mutationFn: (payload: UpdatePatientProfilePayload) =>
      updatePatientProfile(patientId, payload),
  });
}
