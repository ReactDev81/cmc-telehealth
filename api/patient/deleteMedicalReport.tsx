import api from "@/lib/axios";

export type DeleteMedicalReportVariables = {
  appointmentId: string;
  reportId: string;
};

export const deleteMedicalReport = async ({
  appointmentId,
  reportId,
}: DeleteMedicalReportVariables) => {
  const { data } = await api.delete(
    `/patient/medical-reports/${appointmentId}/${reportId}`,
  );
  return data;
};