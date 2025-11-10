import { View, Text } from "react-native"
import { router } from "expo-router";
import { Calendar } from 'lucide-react-native';
import { MedicineCardProps } from "@/types/my-medicines";
import Button from "../ui/Button"

const MedicineCard = ({ patient_symptoms, doctor_name, consulated_date } : MedicineCardProps) => {
    return(
        <View className="border border-[#EDEDED] rounded-xl p-4">
            <View className="flex-row items-center">
                <Text className="text-base font-medium">Symptoms: </Text>
                <Text className="text-black text-sm">{patient_symptoms}</Text>
            </View>
            <View className="flex-row items-end justify-between">
                <View>
                    <Text className="text-black text-sm mt-2">{doctor_name}</Text>
                    <View className="flex-row items-center gap-x-1.5 mt-2">
                        <Calendar size={16} color="#4D4D4D" />
                        <Text className="text-black-400 text-sm">{consulated_date}</Text>
                    </View>
                </View>
                <View>
                    <Button onPress={() => router.push('/patient/my-medicines/1')} className="[&]:py-3">View Detail</Button>
                </View>
            </View>
        </View>
    )
}

export default MedicineCard