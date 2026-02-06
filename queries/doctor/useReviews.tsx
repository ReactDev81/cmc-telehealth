import { fetchReviews } from "@/api/doctor/reviews";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (token: string, page: number = 1, perPage: number = 5) => {
  return useQuery({
    queryKey: ["reviews", token, page, perPage],
    queryFn: () => fetchReviews(token, page, perPage),
    enabled: !!token,
    staleTime: 1000 * 60 * 3,
    placeholderData: (previousData) => previousData,
  });
};
