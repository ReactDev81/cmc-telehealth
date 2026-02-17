import { Calendar, Clock, Hospital, Video } from "lucide-react-native"
import { Text, View } from "react-native"

interface props {
    time: string,
    date: string,
    mode: string,
    call_now?: boolean
}

const UpcomingAppointment = ({ time, date, mode, call_now }: props) => {
    return (
        <View className="border border-black-300 rounded-xl p-4 mt-5">
            <View className="flex-row justify-between">
                <Text className="text-lg font-medium text-black">
                    {call_now === true ? 'Today Appointment' : 'Upcoming Appointment'}
                </Text>
                <Text className={`text-xs text-info bg-info-400 capitalize font-medium w-fit p-2 rounded-md ${call_now === true ? 'text-success bg-success-400' : 'text-info bg-info-400'}`}>
                    {call_now === true ? 'Join Now' : 'Scheduled'}
                </Text>
            </View>
            <View className="flex-row items-center gap-x-3 mt-1">
                <View className="flex-row items-center gap-x-2">
                    <Calendar size={14} className="text-black-400" />
                    <Text className="text-sm text-black-400">{date}</Text>
                </View>
                <View className="flex-row items-center gap-x-2">
                    <Clock size={14} className="text-black-400" />
                    <Text className="text-sm text-black-400">{time}</Text>
                </View>
            </View>
            <View className="flex-row items-center gap-x-1 mt-2.5">
                <View className="flex items-center justify-center w-6 h-6">
                    {
                        mode === 'video' ?
                            <Video size={14} className="text-black-400" />
                            :
                            <Hospital size={14} className="text-black-400" />
                    }
                </View>
                <Text className="text-sm text-black-400">
                    {mode === 'video' ? 'Video consultation' : 'Clinic Visit'}
                </Text>
            </View>
        </View>
    )
}

export default UpcomingAppointment