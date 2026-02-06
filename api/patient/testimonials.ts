import api from "@/lib/axios";
import { AllTestimonialsResponse } from "@/types/patient/testimonials";

export const fetchAllTestimonials = async (page: number, perPage: number = 5): Promise<AllTestimonialsResponse> => {
    const { data } = await api.get(`/reviews/all-reviews?page=${page}&per_page=${perPage}`);
    return data;
};
