import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const DoctorProfileEdit = ({ user }: { user: any }) => {
    return (
        <View className="bg-primary-100 p-4 flex-row items-start rounded-xl">
            <View className="flex-1 flex-row items-center gap-x-3">
                <View className="w-14">
                    <Image
                        source={{
                            uri: user?.avatar || "https://stagetelehealth.cmcludhiana.in/storage/user_avatar/a6749486-6599-499f-81bf-a208a6e6e0be.jpeg"
                        }}
                        className="w-full h-14 object-cover rounded-full"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium text-black">
                        Hi, {user?.name || "Doctor"}
                    </Text>
                    <Text className="text-sm text-black-400 mt-0.5">
                        {user?.email}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => router.push("/doctor/profile/edit-personal-information")}
                className="flex-row items-center gap-x-1.5"
            >
                <Text className="text-sm text-black-400 font-medium">Edit</Text>
                <Feather name="edit" size={11} className="text-black-400" />
            </TouchableOpacity>
        </View>
    );
};

export default DoctorProfileEdit;
