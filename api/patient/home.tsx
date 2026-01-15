import api from "@/lib/axios";
import { PatientHomeResponse } from "@/types/live/patient/home";

export const fetchPatientHome = async ({ signal }: any): Promise<PatientHomeResponse> => {
  const { data } = await api.get("/patient/home", { signal });
  return data;
};