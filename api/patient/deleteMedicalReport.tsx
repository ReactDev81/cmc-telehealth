import api from "@/lib/axios";

export const deleteMedicalReport = async (reportId: string) => {
  const { data } = await api.delete(
    `/patient/medical-reports/${reportId}`
  );
  return data;
};