import { PatientAddressPayload, savePatientAddress } from "@/api/patient/address";
import { useMutation } from "@tanstack/react-query";

export function useSavePatientAddress(patientId: string) {
  return useMutation({
    mutationFn: (payload: PatientAddressPayload) =>
      savePatientAddress(patientId, payload),
  });
}