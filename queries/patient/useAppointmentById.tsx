import { fetchAppointmentById } from "@/api/patient/appointment";
import { useQuery } from "@tanstack/react-query";

export const useAppointmentById = (
  appointmentId?: string
) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => fetchAppointmentById(appointmentId!),
    enabled: !!appointmentId,          // 🚨 important
    staleTime: 5 * 60 * 1000,           // cache 5 min
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
