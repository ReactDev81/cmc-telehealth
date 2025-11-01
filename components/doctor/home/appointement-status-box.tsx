import { View, Text } from "react-native"
import { AppointementStatusBoxProps } from "@/types/doctor/home"


const AppointementStatusBox = ({ status, status_count } : AppointementStatusBoxProps) => {
    return(
        <View 
            className={`px-3 py-4 rounded-xl flex-1 items-center
            ${status === "completed" ? 'bg-success-400' : status === "cancelled" ? 'bg-danger-400' : 'bg-warning-400'} `}
        >
            <Text 
                className={`text-lg font-medium
                    ${status === "completed" ? 'text-success' : status === "cancelled" ? 'text-danger' : 'text-warning'} `}
            >
                {status_count}
            </Text>
            <Text className="text-xs text-black-400 text-center capitalize mt-1">
                {status} Appointements
            </Text>
        </View>
    )
}

export default AppointementStatusBox