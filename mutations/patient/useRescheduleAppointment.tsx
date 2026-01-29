import {
    rescheduleAppointment,
    RescheduleAppointmentPayload
} from "@/api/patient/rescheduleAppointment";
import { useMutation } from "@tanstack/react-query";

export function useRescheduleAppointment() {
    return useMutation({
        mutationFn: ({
            appointmentId,
            payload,
        }: {
            appointmentId: string;
            payload: RescheduleAppointmentPayload;
        }) => rescheduleAppointment(appointmentId, payload),
    });
}
