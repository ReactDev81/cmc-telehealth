import { ImageSourcePropType } from "react-native";
import { Href } from "expo-router";

export interface appointmentProps {
    id?: number;
    status?: string,
    link: Href,
    image: ImageSourcePropType
    name: string,
    speciality : string,
    date: string,
    time: string
}