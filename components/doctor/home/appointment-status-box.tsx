import { AppointmentStatusBoxProps } from "@/types/doctor/home";
import { Text, View } from "react-native";


const AppointmentStatusBox = ({ status, status_count }: AppointmentStatusBoxProps) => {
    const getBackgroundColor = () => {
        if (status === "today" || status === "completed") return 'bg-success-400';
        if (status === "cancelled") return 'bg-danger-400';
        return 'bg-info-400';
    };

    const getTextColor = () => {
        if (status === "today" || status === "completed") return 'text-success';
        if (status === "cancelled") return 'text-danger';
        return 'text-info';
    };

    const getLabel = () => {
        if (status === "today") return "Today's Appointments";
        return `${status.charAt(0).toUpperCase() + status.slice(1)} Appointments`;
    };

    return (
        <View className={`px-3 py-4 rounded-xl flex-1 items-center ${getBackgroundColor()}`}>
            <Text className={`text-lg font-medium ${getTextColor()}`}>
                {status_count}
            </Text>
            <Text className="text-xs text-black-400 text-center mt-1">
                {getLabel()}
            </Text>
        </View>
    )
}

export default AppointmentStatusBox
