import { fetchAllMyReviews } from "@/api/common/my-reviews";
import { useQuery } from "@tanstack/react-query";

export const useMyReviews = (page: number, perPage: number = 5) => {
    return useQuery({
        queryKey: ["my-reviews", page, perPage],
        queryFn: () => fetchAllMyReviews(page, perPage),
        placeholderData: (previousData) => previousData,
    });
};