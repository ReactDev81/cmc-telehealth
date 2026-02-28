import Avatar from "@/components/ui/Avatar";
import { TestimonialProps } from "@/types/live/patient/home";
import { Star } from "lucide-react-native";
import { Text, View } from "react-native";

interface testimonial extends TestimonialProps {
  className?: string;
}

const Testimonial = ({
  patient_image,
  patient_name,
  patient_age,
  title,
  content,
  total_reviews,
  doctor_name,
  rating,
  className = "",
}: testimonial) => {

  return (
    <View
      className={`bg-white rounded-xl border border-black-300 max-w-80 w-full justify-between ${className}`}
    >
      <View className="p-4">
        {/* Header Section */}
        <View className="flex-row items-center mb-4">
          <Avatar
            source={patient_image}
            name={patient_name}
            size={44}
            className="mr-2.5"
          />
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-black">
                {patient_name}
              </Text>
              <View className="py-1 px-2 bg-primary-100 rounded-lg flex-row items-center gap-x-1 absolute top-0 right-0">
                <Star size={12} fill="#013220" />
                <Text className="text-primary text-sm font-medium">
                  {rating}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-0.5">
              <Text className="text-sm text-gray-600">
                {patient_age}
              </Text>
            </View>
          </View>
        </View>

        {/* Issue Title */}
        <Text className="text-sm font-semibold text-black mb-1.5">{title}</Text>

        {/* Description */}
        <Text className="text-xs leading-5 text-black">{content}</Text>
      </View>

      {/* Footer Section */}
      <View className="flex-row items-center justify-between rounded-b-xl border-t border-[#EDEDED] bg-primary-100 px-3 py-2">
        <Text className="text-[10px] font-bold text-black">
          {total_reviews} Reviews for {doctor_name}
        </Text>
        <Avatar source={patient_image} name={patient_name} size={24} />
      </View>
    </View>
  );
};

export default Testimonial;
