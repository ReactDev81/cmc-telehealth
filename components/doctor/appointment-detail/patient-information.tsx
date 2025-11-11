import { View, Text } from "react-native"

interface props {
    patient_age: string,
    gender: string,
    allergies: string,
    problem: string
}

const PatientInformation = ({ patient_age, gender, allergies, problem } : props ) => {
    return(
        <View className="pt-5 mt-7 border-t border-black-300">
            <Text className="text-lg text-black font-medium">Patient Information</Text>
            <View className="mt-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-black-400">Patient Age</Text>
                    <Text className="text-sm font-medium text-black-400">{patient_age}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Gender</Text>
                    <Text className="text-sm font-medium text-black-400">{gender}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Allergies</Text>
                    <Text className="text-sm font-medium text-black-400">{allergies}</Text>
                </View>
                <View className="flex-row justify-between mt-3">
                    <View className="basis-2/5">
                        <Text className="text-sm text-black-400">Problem</Text>
                    </View>
                    <View className="basis-3/5">
                        <Text className="text-sm text-right text-nowrap font-medium text-black-400">
                            {problem}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PatientInformation