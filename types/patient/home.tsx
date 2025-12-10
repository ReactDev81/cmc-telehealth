import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";

// Speciality
export interface SpecialityProps {
    id?: number;
    speciality : string,
    link: Href,
    image: ImageSourcePropType
}

// Doctors
export interface AvailableDoctorsProps {
    id?: number;
    avatar_url: ImageSourcePropType;
    consultation_type: string,
    consultation_fee: string,
    first_name: string,
    last_name: string,
    speciality?: string,
    departments?: { name: string; role?: string; order?: number }[],
    rating: number,
    years_experience: number,
}

// Articles
export interface ArticleProps {
    id?: number;
    name: string;
    first_point: string;
    second_point: string;
}

// Testimonials
export interface TestimonialProps {
    id?: number;
    image: ImageSourcePropType;
    name: string;
    age: string;
    city: string;
    title: string;
    description: string;
    review_count: string;
}

// Consultation Type Card
export interface ConsultationTypeCardProps {
    link: Href;
    image: ImageSourcePropType;
    text: string;
}