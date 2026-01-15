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
    experience: string
    date: string
    time: string,
    call_now?: boolean
}