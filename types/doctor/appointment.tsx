import { ImageSourcePropType } from "react-native";

export interface appointmentProps {
    id?: number;
    status?: string,
    image: ImageSourcePropType
    name: string,
    mode : string,
    date?: string,
    time: string
}