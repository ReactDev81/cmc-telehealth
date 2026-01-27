import { fetchReviews } from "@/api/doctor/reviews";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (token: string) => {
  return useQuery({
    queryKey: ["reviews", token],
    queryFn: () => fetchReviews(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 3,
  });
};
