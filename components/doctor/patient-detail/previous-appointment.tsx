import Badge from "@/components/ui/Badge";
import { PreviousAppointmentProps } from "@/types/doctor/previous-appointment";
import { Calendar, Clock, Hospital, Video } from "lucide-react-native";
import { Text, View } from "react-native";

const PreviousAppointment = ({
  subject,
  status,
  time,
  date,
  mode,
}: PreviousAppointmentProps) => {
  return (
    <View className="border border-black-300 rounded-xl p-4 mt-5 w-full">
      <View className="flex-row items-center justify-between gap-x-2">
        <Text
          className="text-base font-medium text-black flex-1"
          numberOfLines={1}
        >
          {subject}
        </Text>
        <Badge
          text={status}
          variant={
            status.toLowerCase() === "completed"
              ? "success"
              : status.toLowerCase() === "cancelled"
                ? "danger"
                : "info"
          }
          className="flex-shrink-0"
        />
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
      <View className="flex-row items-center gap-x-2 mt-2.5">
        {mode === "video" ? <Video size={14} /> : <Hospital size={14} />}
        <Text className="text-sm text-black-400 font-medium">
          {mode === "video" ? "Video consultation" : "Clinic Visit"}
        </Text>
      </View>
    </View>
  );
};

export default PreviousAppointment;
