import { View, Text, Image, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ConsultationTypeCardProps } from "../../types/home";

const ConsultationTypeCard = ({ link, image, text }: ConsultationTypeCardProps) => {
    return(
        <View>
            <TouchableOpacity
                onPress={() => link && router.push(link)}
                disabled={!link}
                className="p-2.5 rounded-2xl bg-white border border-black-300 shadow-custom"
                activeOpacity={0.8}
            >
                <Image source={image} className="w-full h-32 rounded-xl" resizeMode="cover" />
                <View className="flex flex-row items-center justify-between pt-2.5">
                    <Text className="font-semibold text-sm flex-1 pr-2 text-[#1F1E1E]" numberOfLines={2}>
                        {text}
                    </Text>
                    <View className="w-8 h-8 rounded-full bg-gray-800 items-center justify-center">
                        <MaterialIcons 
                            name="keyboard-arrow-right" 
                            size={20} 
                            color="#fff"
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default ConsultationTypeCard
