import {
  deleteMedicalReport,
  DeleteMedicalReportVariables,
} from "@/api/patient/deleteMedicalReport";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMedicalReport = () => {
  return useMutation<any, unknown, DeleteMedicalReportVariables>({
    mutationFn: deleteMedicalReport,
  });
};