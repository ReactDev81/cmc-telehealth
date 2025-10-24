import { View, Text, Image } from "react-native"
import { Link } from "expo-router"
import { Star } from "lucide-react-native"
import { AvailableDoctorsProps } from "../../types/home"

interface DoctorProps extends AvailableDoctorsProps {
    imageClass?: string
}

const AvailableDoctors = ({ image, name, speciality, rating, reviews_count, imageClass = '' } : DoctorProps) => {
    return (
        <View>
            <View className="rounded-xl border border-black-300 bg-white w-full">
                <Image source={image} className={`w-full h-28 rounded-t-xl ${imageClass}`} />
                <View className="p-3">
                    <Text className="text-black text-xs font-medium">{name}</Text>
                    <Text className="text-black text-xs font-normal mt-0.5">{speciality}</Text>
                    <View className="flex-row items-center mt-2">
                        <Star size={16} color="#FFC107" fill="#FFC107" strokeWidth={0} />
                        <Text className="text-grey text-xs font-normal ml-1">{rating}</Text>
                        <View className="w-1 h-1 rounded-full bg-grey mx-2"></View>
                        <Text className="text-grey text-xs font-normal">{reviews_count}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AvailableDoctors