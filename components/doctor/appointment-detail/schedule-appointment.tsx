import { View, Text } from "react-native"

interface props {
    date: string,
    time: string,
    booking_type: string,
    booking_for: string
}

const ScheduleAppointment = ({ date, time, booking_type, booking_for } : props ) => {
    return(
        <View className="mt-7">
            <Text className="text-lg text-black font-medium">Schedule Appointment</Text>
            <View className="mt-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-black-400">Date</Text>
                    <Text className="text-sm font-medium text-black-400">{date}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Time</Text>
                    <Text className="text-sm font-medium text-black-400">{time}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Booking Type</Text>
                    <Text className="text-sm font-medium text-black-400">{booking_type}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-sm text-black-400">Booking For</Text>
                    <Text className="text-sm font-medium text-black-400">{booking_for}</Text>
                </View>
            </View>
        </View>
    )
}

export default ScheduleAppointment