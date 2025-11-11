import { View, Text } from "react-native";
import { format } from "date-fns";
import { Slot } from "@/types/doctor/schedule";

const SlotCard = ({ slot }: { slot: Slot }) => {

    const start = new Date(slot.start);
    const end = new Date(slot.end);
  
    return (
        <View className="border border-black-300 rounded-lg p-4">
            <View className="flex-row justify-between">
                <View>
                    <Text className="text-sm text-black">
                        {format(start, "hh:mm a")} – {format(end, "hh:mm a")}
                    </Text>
                    <Text className="text-sm text-black mt-1.5">Slot Capacity: {slot.capacity}</Text>
                </View>
                <View>
                    <View className={`px-2 py-1 rounded-md ${slot.label === "In Person" ? "bg-success-400" : "bg-warning-400"}`}>
                        <Text className={`text-xs ${slot.label === "In Person" ? "text-success" : "text-warning"}`}>
                            {slot.label}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default SlotCard