import Button from "@/components/ui/Button";
import { appointmentProps } from "@/types/doctor/appointment";
import { router } from "expo-router";
import { Calendar, Hospital, Video } from "lucide-react-native";
import { Image, Text, View } from "react-native";

const TodayAppointmentCard = ({
    image,
    name,
    time,
    mode,
    appointmentId,
}: appointmentProps) => {
    return (
        <View className="border border-black-300 rounded-xl p-4 flex-row items-center gap-x-4">
            <View className="w-24">
                <Image
                    source={typeof image === 'string' ? { uri: image } : image}
                    className="w-full h-24 rounded-xl"
                />
            </View>
            <View className="flex-1">
                {/* <Text className={`text-xs text-success bg-success-400 capitalize font-medium w-fit p-2 rounded-md absolute right-0`}>
                    Join Now
                </Text> */}
                <Text className="text-sm font-medium text-black mt-3">{name}</Text>
                <View className="flex-row items-center gap-x-3 mt-1">
                    <View className="flex-row items-center gap-x-2">
                        <Calendar size={12} className="text-black-400" />
                        <Text className="text-sm text-black-400">{time}</Text>
                    </View>
                    <View className="flex-row items-center gap-x-2">
                        {mode === "video" ? (
                            <Video size={14} className="text-black-400" />
                        ) : (
                            <Hospital size={14} className="text-black-400" />
                        )}
                        <Text className="text-sm text-black-400">{mode}</Text>
                    </View>
                </View>
                <Button
                    onPress={() => router.push(`/doctor/patient-details/${appointmentId}`)}
                    className="[&]:py-2 max-w-32 mt-2"
                >
                    View Details
                </Button>
            </View>
        </View>
    );
};

export default TodayAppointmentCard;
