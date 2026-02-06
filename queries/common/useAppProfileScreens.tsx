import { getAppProfileScreens } from "@/api/common/appProfileScreens";
import { useQuery } from "@tanstack/react-query";

export const useAppProfileScreens = () => {
    return useQuery({
        queryKey: ["app-profile-screens"],
        queryFn: getAppProfileScreens,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};
