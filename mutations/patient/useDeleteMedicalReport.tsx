import { deleteMedicalReport } from "@/api/patient/deleteMedicalReport";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMedicalReport = () => {
  return useMutation({
    mutationFn: deleteMedicalReport,
  });
};