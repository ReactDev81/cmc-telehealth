import { fetchDepartmentsAndSymptoms } from "@/api/patient/findDoctor";
import { DepartmentSymptomResponse } from "@/types/live/patient/find-doctor";
import { useQuery } from "@tanstack/react-query";

export function useFindDoctorData() {
  return useQuery<DepartmentSymptomResponse>({
    queryKey: ["departments-and-symptoms"],
    queryFn: fetchDepartmentsAndSymptoms,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}