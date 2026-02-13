import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface DoctorProps {
    id: string;
    profile?: {
      name: string;
      department: string;
      years_experience: string;
      avatar?: string;
    };
    about?: {
      bio: string;
      description?: string;
    };
    education?: {
      degree: string;
      institution: string;
      start_date?: string;
      end_date?: string;
    }[];
    languages?: string | string[];
    review_summary?: {
      average_rating: number;
      total_reviews: number;
    };
    appointment_types?: {
      video?: boolean;
      in_person?: boolean;
    };
}
  

export function useBrowseDoctorById(id?: string) {
  return useQuery<DoctorProps>({
    queryKey: ["browse-doctor", id],
    enabled: !!id, // prevents running without id
    queryFn: async () => {
      const { data } = await api.get(`/patient/browse-doctor/${id}`);
      return data;
    },
  });
}