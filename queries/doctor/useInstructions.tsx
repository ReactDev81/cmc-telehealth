import { fetchInstructions } from "@/api/doctor/updateInstructions";
import { UpdateInstructionsResponse } from "@/types/doctor/instructions";
import { useQuery } from "@tanstack/react-query";

export const useInstructions = (appointmentId: string, token: string) => {
    return useQuery<UpdateInstructionsResponse>({
        queryKey: ["doctor-instructions", appointmentId],
        queryFn: () => fetchInstructions(appointmentId, token),
        enabled: !!appointmentId && !!token,
    });
};
