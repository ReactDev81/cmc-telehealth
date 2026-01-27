import { getMedicines } from "@/api/doctor/getMedicines";
import { useQuery } from "@tanstack/react-query";

export const useMedicines = (token: string, searchQuery?: string) => {
    return useQuery({
        queryKey: ["medicines", searchQuery],
        queryFn: () => getMedicines(token, searchQuery),
        enabled: !!token && (searchQuery ? searchQuery.length > 0 : true),
    });
};
