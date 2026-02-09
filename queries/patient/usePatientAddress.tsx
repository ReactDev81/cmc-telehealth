import { fetchPatientAddress } from "@/api/patient/profile";
import { useQuery } from "@tanstack/react-query";

export const usePatientAddress = (patientId?: string) => {
  return useQuery({
    queryKey: ["patient-address", patientId],
    queryFn: () => fetchPatientAddress(patientId!),
    enabled: !!patientId,        // ✅ prevents calling without id
    staleTime: 5 * 60 * 1000,    // 5 minutes
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};