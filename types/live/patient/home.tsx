import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";

// Testimonials
export interface TestimonialProps {
  patient_id: string;
  doctor_id: string;
  patient_name: string;
  title: string;
  content: string;
  rating: number;
  is_active: boolean;
  is_featured: boolean;
  slug: string;
  patient_image: ImageSourcePropType;
}

// advertisements
export interface AdvertisementProps {
  id: string;
  image: ImageSourcePropType;
  link: Href;
}

// SpecialityData
export interface SpecialityProps {
  id: string;
  department: {
    name: string;
    icon: string;
  };
}
