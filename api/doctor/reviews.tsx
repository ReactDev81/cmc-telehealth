import api from "@/lib/axios";
import { ReviewsResponse } from "@/types/live/doctor/feedback";

export const fetchReviews = async (token: string, page: number = 1, per_page: number = 5) => {
  const res = await api.get(`/reviews/my`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, per_page }
  });

  return res.data as ReviewsResponse;
};
