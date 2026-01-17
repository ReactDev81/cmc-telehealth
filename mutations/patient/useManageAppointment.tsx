import { manageAppointment } from "@/api/patient/manageAppointment";
import { useMutation } from "@tanstack/react-query";

export function useManageAppointment(appointmentId: string) {
  return useMutation({
    mutationFn: (payload: FormData) =>
      manageAppointment(appointmentId, payload),
  });
}
