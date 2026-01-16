import { bookAppointment, BookAppointmentPayload } from "@/api/patient/bookAppointment";
import { useMutation } from "@tanstack/react-query";

export function useBookAppointment() {
  return useMutation({
    mutationFn: (payload: BookAppointmentPayload) =>
      bookAppointment(payload),
  });
}
