import { ImageSourcePropType } from "react-native";

export interface Review {
    id: string;
    slug: string;
    patient_name: string;
    patient_image: string;
    patient_age: number;
    patient_location: string;
    title: string;
    content: string;
    rating: number;
    total_reviews: number;
    doctor_name: string;
    doctor_avatar: ImageSourcePropType;
    rating_stars: number;
    created_at: string;
  }
  
  export interface ReviewPagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }
  