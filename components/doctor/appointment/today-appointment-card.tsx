import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { appointmentProps } from "@/types/doctor/appointment";
import { router } from "expo-router";
import { Calendar, Clock, Hospital, Video } from "lucide-react-native";
import { Text, View } from "react-native";

interface Props extends appointmentProps {
  callNow?: boolean;
  status?: string;
}

const TodayAppointmentCard = ({
  image,
  name,
  time,
  mode,
  appointmentId,
  callNow,
  date,
  status,
}: Props) => {
  // console.log("TodayAppointmentCard - image:", image, "name:", name);

  return (
    <View className="border border-black-300 rounded-xl p-4 flex-row items-center gap-x-4">
      <Avatar
        source={image || undefined}
        name={name}
        size={96}
        rounded={false}
        className="rounded-xl"
      />
      <View className="flex-1">
        {callNow ? (
          <Badge
            text="Join Now"
            variant="success"
            className="absolute right-0"
          />
        ) : (
          <Badge
            text={status || "Scheduled"}
            variant={status === "Cancelled" ? "danger" : "info"}
            className="absolute right-0"
          />
        )}
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
          <View className="flex items-center justify-center">
            {mode?.toLowerCase() === "video" ? (
              <Video size={14} className="text-black-400" />
            ) : (
              <Hospital size={14} className="text-black-400" />
            )}
          </View>
          <Text className="text-sm text-black-400">{mode}</Text>
        </View>
        <Button
          onPress={() =>
            router.push(`/doctor/patient-details/${appointmentId}`)
          }
          className="[&]:py-2 max-w-32 mt-2"
        >
          View Details
        </Button>
      </View>
    </View>
  );
};

export default TodayAppointmentCard;
