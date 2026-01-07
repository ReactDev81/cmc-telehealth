import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";

// Speciality
export interface SpecialityProps {
    id?: number;
    speciality : string,
    link: Href,
    image: ImageSourcePropType | string
}

// Doctors
export interface AvailableDoctorsProps {
    id?: number;
    avatar: ImageSourcePropType;
    consultation_type: string,
    consultation_fee: string,
    name: string,
    speciality?: { name: string; role?: string; order?: number }[],
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
    city?: string;
    title: string;
    description: string;
    review_count: string;
    patient_age: number;
    doctor_name: string;
}

// Consultation Type Card
export interface ConsultationTypeCardProps {
    link: Href;
    image: ImageSourcePropType;
    text: string;
}