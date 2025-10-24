import { ImageSourcePropType } from "react-native";
import { Href } from "expo-router";

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
    image: ImageSourcePropType;
    // link: Href;
    name: string;
    speciality: string;
    rating: number;
    reviews_count: string;
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