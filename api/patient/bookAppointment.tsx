import api from "@/lib/axios";

export interface BookAppointmentPayload {
  doctor_id: string;
  availability_id: string;
  appointment_date: string;
  appointment_time: string;
  consultation_type: "video" | "in-person";
  opd_type: "general" | "private" | null;
  consultation_fee: string;
  booking_type?: "new" | "reschedule";
  appointment_id?: string;
}

export const bookAppointment = async (
  payload: BookAppointmentPayload
) => {
  const endpoint = payload.booking_type === "reschedule" && payload.appointment_id
    ? `/appointments/${payload.appointment_id}/reschedule`
    : "/book-appointment";

  const { data } = await api.post(endpoint, payload);
  return data;
};
