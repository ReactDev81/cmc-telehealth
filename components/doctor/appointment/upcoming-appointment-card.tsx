import { appointmentProps } from "@/types/doctor/appointment";
import { Calendar, Clock, Hospital, Video } from "lucide-react-native";
import { Image, Text, View } from "react-native";

const UpcomingAppointmentCard = ({
    image,
    name,
    time,
    date,
    mode,
    status,
}: appointmentProps) => {
    return (
        <View className="border border-black-300 rounded-xl p-4 flex-row items-center gap-x-4">
            <View className="w-24">
                <Image source={image} className="w-full h-24 rounded-xl" />
            </View>
            <View className="flex-1">
                <Text
                    className={`text-xs capitalize font-medium w-fit p-2 rounded-md absolute right-0
                    ${status === "Cancelled" ? "text-danger bg-danger-400" : "text-info bg-info-400"}
                    `}
                >
                    {status}
                </Text>
                <Text className="text-sm font-medium text-black mt-3">{name}</Text>
                <View className="flex-row items-center gap-x-3 mt-1">
                    <View className="flex-row items-center gap-x-2">
                        <Calendar size={12} className="text-black-400" />
                        <Text className="text-sm text-black-400">{date}</Text>
                    </View>
                    <View className="flex-row items-center gap-x-2">
                        <Clock size={12} className="text-black-400" />
                        <Text className="text-sm text-black-400">{time}</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-x-1 mt-2">
                    <View className="flex items-center justify-center w-8 h-8 bg-primary-200 rounded-full">
                        {mode === "Video" ? (
                            <Video size={14} className="text-black-400" />
                        ) : (
                            <Hospital size={14} className="text-black-400" />
                        )}
                    </View>
                    <Text className="text-sm text-black-400">{mode}</Text>
                </View>
            </View>
        </View>
    );
};

export default UpcomingAppointmentCard;
