import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ApplyLeavePayload {
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
}

export interface ApplyLeaveResponse {
    success: boolean;
    message: string;
    data?: any;
}

export function useApplyLeave() {
    const queryClient = useQueryClient();

    return useMutation<ApplyLeaveResponse, Error, ApplyLeavePayload>({
        mutationFn: async (payload: ApplyLeavePayload) => {
            const { data } = await api.post("/leave", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-leave"] });
        },
    });
}
