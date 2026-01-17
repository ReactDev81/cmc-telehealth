import api from "@/lib/axios";
import { DepartmentSymptomResponse } from "@/types/live/patient/find-doctor";

export const fetchDepartmentsAndSymptoms =
  async (): Promise<DepartmentSymptomResponse> => {
    const { data } = await api.get(
      "/patient/departments-and-symptoms-list"
    );
    return data;
};