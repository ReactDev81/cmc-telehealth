import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FiltersModal = () => {

    const insets = useSafeAreaInsets();

    return (
        <View className="absolute top-0 left-0 w-full h-full justify-between bg-white"
            style={{
                paddingTop: insets?.top,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            }}
        >

            {/* header */}
            <View className="flex-row item-center justify-between p-5">
                <View>
                    <Text>Filters</Text>
                </View>
                <View>
                     <Pressable
                        onPress={() => {}}
                    >
                        <Text className="text-danger font-medium tracking-wider">Clear All</Text>
                    </Pressable>
                </View>
            </View>

            <View></View>

            {/* footer */}
            <View className="flex-row item-center px-5"
                style={{
                    paddingBottom: insets?.bottom
                }}
            >
                <View className="w-3/6 flex-row justify-center">
                    <Pressable
                        onPress={() => {}}
                    >
                        <Text>Close</Text>
                    </Pressable>
                </View>
                <View className="w-3/6 flex-row justify-center">
                    <Pressable
                        onPress={() => {}}
                    >
                        <Text className="text-success font-bold tracking-wider">Apply</Text>
                    </Pressable>
                </View>
            </View>

        </View>
    );
};

export default FiltersModal;