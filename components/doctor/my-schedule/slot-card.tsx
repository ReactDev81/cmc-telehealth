import { Slot } from "@/types/doctor/schedule";
import { Text, View } from "react-native";

const SlotCard = ({ slot }: { slot: Slot }) => {
    return (
        <View className="border border-black-300 rounded-lg p-4">
            <View className="flex-row justify-between">
                <View>
                    <Text className="text-sm text-black">
                        {slot.time_range}
                    </Text>
                    <Text className="text-sm text-black mt-1.5">Available Slots: {slot.available_slots} / {slot.slot_capacity}</Text>
                </View>
                <View>
                    <View className={`px-2 py-1 rounded-md ${slot.consultation_type === "in-person" ? "bg-success-400" : "bg-warning-400"}`}>
                        <Text className={`text-xs ${slot.consultation_type === "in-person" ? "text-success" : "text-warning"}`}>
                            {slot.consultation_type_label}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default SlotCard