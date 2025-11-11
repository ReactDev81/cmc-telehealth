import { View, Pressable, Text } from "react-native";

type Option = "Day" | "Week" | "Month";

const Segmented = ({ value, onChange }: { value: Option; onChange: (v: Option) => void }) => {

    const options: Option[] = ["Day", "Week", "Month"];
  
    return (
        <View className="flex-row p-2.5 bg-primary-100 rounded-lg">
            {options.map(opt => {
                const active = value === opt;
                return (
                    <Pressable
                        key={opt}
                        onPress={() => onChange(opt)}
                        className={`flex-1 py-3 rounded-lg items-center justify-center 
                            ${active ? 'bg-primary' : 'bg-transparent'}
                        `}
                    >
                        <Text className={`${active ? 'text-white' : 'text-primary'}`}>
                            {opt}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default Segmented