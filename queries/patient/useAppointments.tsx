import api from "@/lib/axios";
import { AppointmentListResponse } from "@/types/patient/appointment";
import { useQuery } from "@tanstack/react-query";

export const useAppointments = (
  filter: "upcoming" | "past",
  token: string
) => {
  return useQuery({
    queryKey: ["appointments", filter],
    queryFn: async () => {
      const res = await api.get<AppointmentListResponse>(
        `/appointments/my?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    },
    enabled: !!token,
  });
};
