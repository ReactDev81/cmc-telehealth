import api from "@/lib/axios";

export interface BookAppointmentPayload {
  doctor_id: string;
  availability_id: string;
  appointment_date: string;
  appointment_time: string;
  consultation_type: "video" | "in-person";
  opd_type: "general" | "private" | null;
  consultation_fee: string;
}

export const bookAppointment = async (
  payload: BookAppointmentPayload
) => {
  const { data } = await api.post("/book-appointment", payload);
  return data;
};
