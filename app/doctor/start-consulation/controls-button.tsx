import type { LucideIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface props {
    action: () => void,
    isActive: boolean,
    label: string,
    icon: LucideIcon
}

const ControlsButton = ({ action, isActive, label, icon: Icon } : props) => {
    return(
        <TouchableOpacity
            className="items-center basis-3/12"
            activeOpacity={1}
            onPress={action}
        >
            <View className={`w-12 h-12 rounded-xl items-center justify-center mb-2 ${
                isActive ? "bg-white" : "bg-white/60"
            }`}>
                <Icon
                    size={22}
                    color={isActive ? "#013220" : "#fff"}
                />
            </View>
            <Text className={`text-xs ${isActive ? "text-white" : "text-white/80"}`}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default ControlsButton