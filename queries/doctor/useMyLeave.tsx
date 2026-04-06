import { fetchMyLeave } from "@/api/doctor/myLeave";
import { useQuery } from "@tanstack/react-query";

export const useMyLeave = (page: number = 1, perPage: number = 5) => {
    return useQuery({
        queryKey: ["my-leave", page, perPage],
        queryFn: () => fetchMyLeave(page, perPage),
        staleTime: 1000 * 60 * 3,
        placeholderData: (previousData) => previousData,
    });
};