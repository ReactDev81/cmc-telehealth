import api from "@/lib/axios";

export interface AppointmentResponse {
  data: {
    id: string;
    consultation_type: "video" | "clinic";
    appointment_date: string;
    start_time: string;
    end_time: string;
    doctor: {
      name: string;
      specialization: string;
      profile_image?: string;
    };
  };
}

export const fetchAppointmentById = async (
  id: string
): Promise<AppointmentResponse> => {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
};
