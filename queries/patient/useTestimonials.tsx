import { fetchDoctorReviews } from "@/api/patient/testimonials";
import { useQuery } from "@tanstack/react-query";

// export const useTestimonials = (page: number, perPage: number = 5) => {
//   return useQuery({
//     queryKey: ["all-testimonials", page, perPage],
//     queryFn: () => fetchAllTestimonials(page, perPage),
//     placeholderData: (previousData) => previousData,
//   });
// };

export const useDoctorReviews = (
  doctorId: string | undefined,
  page: number = 1,
  perPage: number = 10,
) => {
  return useQuery({
    queryKey: ["doctor-reviews", doctorId, page, perPage],
    queryFn: () => fetchDoctorReviews(doctorId as string, page, perPage),
    enabled: !!doctorId,
    placeholderData: (previousData) => previousData,
  });
};
