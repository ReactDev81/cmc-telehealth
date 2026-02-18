import Badge from "@/components/ui/Badge";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface Props {
  image: ImageSourcePropType;
  name: string;
  age: number;
  gender: string;
  mode: string;
}

const PatientInfoHeader = ({ image, name, age, gender, mode }: Props) => {
  return (
    <View className="flex-row gap-x-4">
      <View>
        <Image source={image} className="w-20 h-20 rounded-full" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-medium text-black">{name}</Text>
        <View className="flex-row items-center gap-x-2 mt-0.5">
          <Text className="text-sm text-black">{age} Years</Text>
          <View className="w-1 h-1 rounded-full bg-gray mt-0.5"></View>
          <Text className="text-sm text-black">{gender}</Text>
        </View>
        <View className="self-start mt-1.5">
          <Badge text={mode} />
        </View>
      </View>
    </View>
  );
};

export default PatientInfoHeader;
