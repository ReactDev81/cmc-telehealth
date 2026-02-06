import { fetchAllTestimonials } from "@/api/patient/testimonials";
import { useQuery } from "@tanstack/react-query";

export const useTestimonials = (page: number, perPage: number = 5) => {
    return useQuery({
        queryKey: ["all-testimonials", page, perPage],
        queryFn: () => fetchAllTestimonials(page, perPage),
        placeholderData: (previousData) => previousData,
    });
};
