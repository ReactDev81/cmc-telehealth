import { useAuth } from "@/context/UserContext";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const DoctorProfileEdit = () => {
    const { user } = useAuth();
    return (
        <View className="bg-primary-100 p-4 flex-row items-start rounded-xl">
            <View className="flex-1 flex-row items-center gap-x-3">
                <View className="w-14">
                    <Image
                        source={require("../../../assets/images/doctor.jpg")}
                        className="w-full h-14 object-cover rounded-full"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium text-black">
                        Hi, {user?.name || "Doctor"}
                    </Text>
                    <Text className="text-sm text-black-400 mt-0.5">
                        {user?.email || "No email available"}
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
