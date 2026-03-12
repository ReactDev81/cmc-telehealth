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
        staleTime: 3 * 60 * 1000,  // cache for 3 min
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,    // cache for 2 min
    });
};