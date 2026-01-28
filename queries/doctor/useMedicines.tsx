import { getMedicines } from "@/api/doctor/getMedicines";
import { useQuery } from "@tanstack/react-query";

export const useMedicines = (token: string | null | undefined, searchQuery: string = "") => {
    return useQuery({
        queryKey: ["medicines", searchQuery, token],
        queryFn: () => getMedicines(token || "", searchQuery),
        enabled: !!token && token.length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1, // Retry once on failure
        retryDelay: 1000, // Wait 1 second before retry
    });
};