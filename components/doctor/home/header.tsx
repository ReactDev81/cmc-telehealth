import { router } from "expo-router";
import { Bell, ChevronDown, MapPin } from "lucide-react-native";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const DoctorHomeHeader = () => {

    const [location, setLocation] = useState('Sec 39, Ldh, Punjab');

    return (
        <View className="bg-primary px-4 py-5">

            {/* Top Section */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <View>
                        <Image 
                            source={require("../../../assets/images/doctor.jpg")}   
                            className="w-11 h-11 rounded-full"
                        /> 
                    </View>
                    <View>
                        <Text className="text-white text-base font-medium">
                            Dr. M Joseph John
                        </Text>
                        <TouchableOpacity className="flex-row items-center gap-1 mt-1">
                            <MapPin color="#fff" size={16} />
                            <Text className="text-white text-sm">{location}</Text>
                            <ChevronDown size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.push('/notifications')} className="relative p-2 rounded-full">
                        <Bell size={24} color="#fff" />
                        <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full items-center justify-center">
                            <Text className="text-primary text-xs font-bold">2</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

export default DoctorHomeHeader;