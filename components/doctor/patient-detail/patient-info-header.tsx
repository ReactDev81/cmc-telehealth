import { View, Text, Image } from "react-native"
import { ImageSourcePropType } from "react-native"

interface Props {
    image: ImageSourcePropType,
    name: string,
    age: number,
    gender: string,
    problem: string,
}

const PatientInfoHeader = ({ image, name, age, gender, problem } : Props ) => {
    return(
        <View className="flex-row gap-x-4">
            <View>
                <Image 
                    source={image}
                    className="w-20 h-20 rounded-full" 
                />
            </View>
            <View className="flex-1">
                <Text className="text-lg font-medium text-black">{name}</Text>
                <View className="flex-row items-center gap-x-2 mt-0.5">
                    <Text className="text-sm text-black">{age} Years</Text>
                    <View className="w-1 h-1 rounded-full bg-gray mt-0.5"></View>
                    <Text className="text-sm text-black">{gender}</Text>
                </View>
                <View className="mt-1.5">
                    <Text className="text-sm font-medium text-black">Problem:
                        <Text className="font-normal"> {problem}</Text>
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default PatientInfoHeader