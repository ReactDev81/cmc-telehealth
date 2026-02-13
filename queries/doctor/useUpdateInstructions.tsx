import { updateInstructions } from "@/api/doctor/updateInstructions";
import { UpdateInstructionsRequest, UpdateInstructionsResponse } from "@/types/doctor/instructions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateInstructions = () => {
    const queryClient = useQueryClient();

    return useMutation<
        UpdateInstructionsResponse,
        Error,
        { appointmentId: string; data: UpdateInstructionsRequest; token: string }
    >({
        mutationFn: ({ appointmentId, data, token }) =>
            updateInstructions(appointmentId, data, token),
        onSuccess: (_, { appointmentId }) => {
            // Invalidate relevant queries to refresh the UI
            queryClient.invalidateQueries({ queryKey: ["patient-detail", appointmentId] });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
    });
};
