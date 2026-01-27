import { fetchAppointments } from "@/api/doctor/appointments";
import { useQuery } from "@tanstack/react-query";

export const useAppointments = (
  filter: "today" | "upcoming" | "past",
  token: string
) => {
  return useQuery({
    queryKey: ["appointments", filter],
    queryFn: () => fetchAppointments(filter, token),
    enabled: !!token,            // only fetch if token exists
    staleTime: 1000 * 60 * 2,    // cache for 2 min
  });
};
