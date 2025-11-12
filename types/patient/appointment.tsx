import { ImageSourcePropType } from "react-native";

export interface appointmentProps {
    id?: number
    status?: string
    image: ImageSourcePropType
    consultation_type: string
    consultation_fee: string
    name: string
    speciality: string
    rating: number
    expercience: string
    date: string
    time: string
}