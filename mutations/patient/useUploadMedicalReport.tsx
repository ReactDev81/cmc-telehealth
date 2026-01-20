import { uploadMedicalReport } from "@/api/patient/medicalReports";
import { useMutation } from "@tanstack/react-query";

export function useUploadMedicalReport() {
  return useMutation({
    mutationFn: uploadMedicalReport,
  });
}