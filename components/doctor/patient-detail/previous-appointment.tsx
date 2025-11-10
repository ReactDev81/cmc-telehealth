import { View, Text } from "react-native"
import { Calendar, Clock, Hospital, Video } from "lucide-react-native"
import { PreviousAppointmentProps } from "@/types/doctor/previous-appointment"


const PreviousAppointment = ({ subject, status, time, date, mode } : PreviousAppointmentProps ) => {
    return(
        <View className="border border-black-300 rounded-xl p-4 mt-5">
            <View className="flex-row justify-between">
                <Text className="text-lg font-medium text-black">{subject}</Text>
                <Text 
                    className={`text-xs capitalize font-medium w-fit p-2 rounded-md absolute right-0
                        ${status === 'completed' ? 'text-success bg-success-400' : 'text-danger bg-danger-400'}
                        `}
                >
                    {status}
                </Text>
            </View>
            <View className="flex-row items-center gap-x-3 mt-1">
                <View className="flex-row items-center gap-x-2">
                    <Calendar size={12} className="text-black-400" />
                    <Text className="text-sm text-black-400">{date}</Text>
                </View> 
                <View className="flex-row items-center gap-x-2">
                    <Clock size={14} className="text-black-400" />
                    <Text className="text-sm text-black-400">{time}</Text>
                </View>
            </View>
            <View className="flex-row items-center gap-x-1 mt-2.5">
                <View className="flex items-center justify-center w-6 h-6 bg-primary-200 rounded-full">
                    {   
                        mode === 'video' ? 
                            <Video size={12} color="#013220" fill="#013220" /> 
                        : 
                            <Hospital size={12} color="#013220" />
                    }
                </View>
                <Text className="text-sm text-black-400 font-medium">
                    {mode === 'video' ? 'Video consultation' : 'Clinic Visit'}
                </Text>
            </View>
        </View>
    )
}

export default PreviousAppointment