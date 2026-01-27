import { fetchDoctorDashboard } from "@/api/doctor/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDoctorDashboard = (token: string) => {
  return useQuery({
    queryKey: ["doctor_dashboard", token],
    queryFn: () => fetchDoctorDashboard(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 3,
  });
};
