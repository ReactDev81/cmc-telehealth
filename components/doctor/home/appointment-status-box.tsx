import { AppointmentStatusBoxProps } from "@/types/doctor/home"
import { Text, View } from "react-native"


const AppointmentStatusBox = ({ status, status_count }: AppointmentStatusBoxProps) => {
    return (
        <View
            className={`px-3 py-4 rounded-xl flex-1 items-center
            ${status === "completed" ? 'bg-success-400' : status === "cancelled" ? 'bg-danger-400' : 'bg-info-400'} `}
        >
            <Text
                className={`text-lg font-medium
                    ${status === "completed" ? 'text-success' : status === "cancelled" ? 'text-danger' : 'text-info'} `}
            >
                {status_count}
            </Text>
            <Text className="text-xs text-black-400 text-center capitalize mt-1">
                {status} Appointments
            </Text>
        </View>
    )
}

export default AppointmentStatusBox
