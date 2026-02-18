import Badge from "@/components/ui/Badge";
import { Calendar, Clock, Hospital, Video } from "lucide-react-native";
import { Text, View } from "react-native";

interface props {
  time: string;
  date: string;
  mode: string;
  call_now?: boolean;
}

const UpcomingAppointment = ({ time, date, mode, call_now }: props) => {
  return (
    <View className="border border-black-300 rounded-xl p-4 mt-5">
      {/* Title + status badge */}
      <View className="flex-row items-center justify-between gap-x-2">
        <Text
          className="text-base font-medium text-black flex-1"
          numberOfLines={1}
        >
          {call_now ? "Today's Appointment" : "Upcoming Appointment"}
        </Text>
        <Badge
          text={call_now ? "Join Now" : "Scheduled"}
          variant={call_now ? "success" : "info"}
          className="flex-shrink-0"
        />
      </View>

      {/* Date & time */}
      <View className="flex-row items-center gap-x-3 mt-2">
        <View className="flex-row items-center gap-x-2">
          <Calendar size={14} />
          <Text className="text-sm text-black-400">{date}</Text>
        </View>
        <View className="flex-row items-center gap-x-2">
          <Clock size={14} />
          <Text className="text-sm text-black-400">{time}</Text>
        </View>
      </View>

      {/* Consultation mode */}
      <View className="flex-row items-center gap-x-2 mt-2.5">
        {mode === "video" ? <Video size={14} /> : <Hospital size={14} />}
        <Text className="text-sm text-black-400">
          {mode === "video" ? "Video consultation" : "Clinic Visit"}
        </Text>
      </View>
    </View>
  );
};

export default UpcomingAppointment;
