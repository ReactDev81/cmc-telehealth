import Button from "@/components/ui/Button";
import { AvailableDoctorsProps } from "@/types/patient/home";
import { router } from "expo-router";
import { ChevronRight, Hospital, Star, Video } from "lucide-react-native";
import { Image, Text, View } from "react-native";

const AvailableDoctors = ({
  avatar,
  name,
  id,
  speciality,
  rating,
  consultation_type,
  consultation_fee,
  years_experience,
}: AvailableDoctorsProps) => {

  const experience = years_experience ? `(${years_experience} Years Exp)` : "";
  const default_avatar = "https://cdn-icons-png.flaticon.com/512/387/387561.png";

  const doctor_speciality = Array.isArray(speciality)
  ? speciality
      .map((item) =>
        typeof item === "string" ? item : item?.name
      )
      .filter(Boolean)
      .join(", ")
  : "";

  const imageSource =
    typeof avatar === "string"
      ? { uri: avatar }
      : (avatar ?? { uri: default_avatar });

  return (
    <View className="border border-black-300 rounded-xl p-4 mt-4">
      <View className="flex-row items-center gap-x-3">
        <View>
          <Image source={imageSource} className="w-14 h-14 rounded-full" />
        </View>
        <View className="flex-1">
          <Text className="text-sm text-black font-medium">{name}</Text>
          <Text className="text-xs text-black mt-1.5">
            {doctor_speciality ? doctor_speciality : 'no department'}
            {experience}
          </Text>
          <View className="py-1 px-2 bg-primary-100 rounded-lg flex-row items-center gap-x-1 absolute top-0 right-0">
            <Star size={12} fill="#013220" />
            <Text className="text-primary text-sm font-medium">{rating}</Text>
          </View>
        </View>
      </View>

      <View className="p-4 bg-primary-100 rounded-lg mt-3">
        <View className="flex-row items-center justify-between gap-x-5">
          <View>
            <Text className="text-sm text-black font-medium">
              Consultation Type
            </Text>
            <View className="flex-row items-center gap-x-1.5 mt-1">
              {consultation_type === "video" ? (
                <>
                  <Video color="#1ABE17" fill="#1ABE17" size={14} />
                  <Text className="text-success text-sm">{consultation_type}</Text>
                </>
                
              ) :
                consultation_type === "both" ? (
                  <>
                    <Video color="#1ABE17" fill="#1ABE17" size={14} />
                    <Text className="text-success text-sm">Video</Text>
                    <Hospital color="#1ABE17" size={14} />
                    <Text className="text-success text-sm">In person</Text>
                  </>
                  
                )
               : (
                <>
                  <Hospital color="#1ABE17" size={14} />
                  <Text className="text-success text-sm">{consultation_type}</Text>
                </>
              )}
              
            </View>
          </View>
          <View className="w-px h-full bg-primary-200"></View>
          <View>
            <Text className="text-right text-sm text-black font-medium">
              ₹{consultation_fee}
            </Text>
            <Text className="text-right text-sm text-black-400 mt-1">
              Consultation Fee
            </Text>
          </View>
        </View>
        <Button
          className="mt-3 flex-row-reverse"
          icon={<ChevronRight color="#fff" size={16} strokeWidth={3} />}
          onPress={() => router.push({
            pathname: `/patient/doctor/${id}` as any,
            params: {
              booking_type: "new appointment"
            },
          })}
        >
          Book Appointment
        </Button>
      </View>
    </View>
  );
};

export default AvailableDoctors;
