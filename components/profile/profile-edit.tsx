import { View, Text, Image, TouchableOpacity } from "react-native"
import { router } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

const ProfileEdit = () => {
    return(
        <View className="bg-primary-100 p-4 flex-row items-start rounded-xl">
            <View className="flex-1 flex-row items-center gap-x-3">
                <View className="w-14">
                    <Image source={require('../../assets/images/profile.png')} className="w-full h-14 object-cover" />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium text-black">Hi, Alex Morgan</Text>
                    <Text className="text-sm text-black-400">alex.morgan@example.com</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile/edit-personal-information')} className="flex-row items-center gap-x-1.5">
                <Text className="text-sm text-black-400 font-medium">Edit</Text>
                <Feather name="edit" size={11} className="text-black-400" />
            </TouchableOpacity>
        </View>
    )
}

export default ProfileEdit