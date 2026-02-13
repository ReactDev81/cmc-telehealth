import { markAppointmentAsCompleted } from "@/api/doctor/appointments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMarkAsCompleted = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ appointmentId, token }: { appointmentId: string; token: string }) =>
            markAppointmentAsCompleted(appointmentId, token),
        onSuccess: (_, { appointmentId }) => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["patient-detail", appointmentId] });
            queryClient.invalidateQueries({ queryKey: ["doctor-instructions", appointmentId] });
        },
    });
};
