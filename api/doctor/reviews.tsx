import api from "@/lib/axios";
import { Review, ReviewPagination } from "@/types/doctor/review";

export const fetchReviews = async (token: string) => {
  const res = await api.get(`/reviews/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const raw = res.data;

  const reviews: Review[] = Object.keys(raw)
    .filter(key => !isNaN(Number(key))) // filter 0,1,2...
    .map(key => raw[key]);

  const pagination: ReviewPagination = raw.pagination;

  return { reviews, pagination };
};
