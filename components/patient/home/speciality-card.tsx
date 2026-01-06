import { SpecialityProps } from "@/types/patient/home";
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

interface Speciality extends SpecialityProps {
  className?: string;
}

const SpecialityCard = ({
  speciality,
  link,
  image,
  className = "",
}: Speciality) => {
  return (
    <Link href={link} className="mx-auto">
      <View className="flex justify-center items-center gap-y-2">
        <View
          className={`w-16 h-16 p-4 flex items-center justify-center rounded-full border border-[#EDEDED] bg-primary-100 ${className}`}
        >
          <Image source={{ uri: image }} />
        </View>
        <Text className="text-sm text-black text-center">{speciality}</Text>
      </View>
    </Link>
  );
};

export default SpecialityCard;
