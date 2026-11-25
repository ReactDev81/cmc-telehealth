import { fetchPatientHome } from "@/api/patient/home";
import { getAuthToken } from "@/lib/authToken";
import { useQuery } from "@tanstack/react-query";

export function usePatientHome(enabled: boolean = true) {

  const token = getAuthToken();

  return useQuery({
    queryKey: ["patient-home"],
    queryFn: fetchPatientHome,
    enabled: !!token && enabled,
    retry: 0,                 // ✅ mobile-safe
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });  
}