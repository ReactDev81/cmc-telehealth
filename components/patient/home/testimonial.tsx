import { TestimonialProps } from "@/types/live/patient/home";
import { Image, Text, View } from "react-native";

interface testimonial extends TestimonialProps {
  className?: string;
}

const Testimonial = ({
  patient_image,
  patient_name,
  patient_age,
  // city,
  title,
  content,
  total_reviews,
  doctor_name,
  className = "",
}: testimonial) => {
  const avatarSource =
    typeof patient_image === "string"
      ? { uri: patient_image }
      : patient_image;

  return (
    <View
      className={`bg-white rounded-xl border border-black-300 max-w-80 w-full justify-between ${className}`}
    >
      <View className="p-4">
        {/* Header Section */}
        <View className="flex-row items-center mb-4">
          <Image
            source={avatarSource}
            className="w-11 h-11 rounded-full mr-2.5"
          />
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-black">{patient_name}</Text>
              <Text className="text-xs text-black/80">1d ago</Text>
            </View>
            <Text className="text-sm text-gray-600 mt-0.5">
              {patient_age}, 
              {/* {city} */}
            </Text>
          </View>
        </View>

        {/* Issue Title */}
        <Text className="text-sm font-semibold text-black mb-1.5">{title}</Text>

        {/* Description */}
        <Text className="text-xs leading-6 text-black">{content}</Text>
      </View>

      {/* Footer Section */}
      <View className="flex-row items-center justify-between rounded-b-xl border-t border-[#EDEDED] bg-primary-100 px-3 py-2">
        <Text className="text-[10px] font-bold text-black">
          {total_reviews} Reviews for {doctor_name}
        </Text>
        <Image source={avatarSource} className="w-6 h-6 rounded-full" />
      </View>
    </View>
  );
};

export default Testimonial;
