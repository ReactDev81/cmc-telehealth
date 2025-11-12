import { ImageSourcePropType } from "react-native";
import { Href } from "expo-router";

// Speciality
export interface SpecialityByDoctorProps {
    id?: number;
    speciality : string,
    link: Href,
    image: ImageSourcePropType
}

// Symptoms
export interface SymptomsByDoctorProps {
    id?: number;
    symptoms : string,
    link: Href,
    image: ImageSourcePropType
}