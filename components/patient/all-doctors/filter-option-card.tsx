import { Image, Pressable, Text, View } from "react-native";

interface FilterOptionCardProps {
  id: string;
  label: string;
  icon: string;
  selected?: boolean;
  onPress: (id: string) => void;
}

const FilterOptionCard = ({
  id,
  label,
  icon,
  selected = false,
  onPress,
}: FilterOptionCardProps) => {
  return (
    <Pressable onPress={() => onPress(id)} className="items-center">
      <View
        className={`w-16 h-16 p-4 rounded-full border flex items-center justify-center
          ${selected ? "border-primary bg-primary-100" : "border-[#EDEDED]"}
        `}
      >
        <Image source={{ uri: icon }} className="w-full h-full" />
      </View>

      <Text
        className={`text-sm text-center mt-2 ${
          selected ? "text-primary font-medium" : "text-black"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default FilterOptionCard;
