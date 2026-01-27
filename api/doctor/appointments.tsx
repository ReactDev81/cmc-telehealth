import api from "@/lib/axios";
import { Appointment, AppointmentListResponse } from "@/types/doctor/appointment";

export const fetchAppointments = async (
  filter: "today" | "upcoming" | "past",
  token: string
): Promise<Appointment[]> => {
  const res = await api.get<AppointmentListResponse>(
    `/appointments/my?filter=${filter}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
};
