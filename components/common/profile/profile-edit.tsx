// import { View, Text, Image, TouchableOpacity } from "react-native"
// import { router } from "expo-router";
// import Feather from '@expo/vector-icons/Feather';

// const ProfileEdit = () => {
//     return(
//         <View className="bg-primary-100 p-4 flex-row items-start rounded-xl">
//             <View className="flex-1 flex-row items-center gap-x-3">
//                 <View className="w-14">
//                     <Image source={require('../../../assets/images/profile.png')} className="w-full h-14 object-cover rounded-full" />
//                 </View>
//                 <View className="flex-1">
//                     <Text className="text-base font-medium text-black">Hi, Alex Morgan</Text>
//                     <Text className="text-sm text-black-400">alex.morgan@example.com</Text>
//                 </View>
//             </View>
//             <TouchableOpacity onPress={() => router.push('/patient/profile/edit-personal-information')} className="flex-row items-center gap-x-1.5">
//                 <Text className="text-sm text-black-400 font-medium">Edit</Text>
//                 <Feather name="edit" size={11} className="text-black-400" />
//             </TouchableOpacity>
//         </View>
//     )
// }

// export default ProfileEdit

import { User } from "@/types/common/user-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProfileEditProps {
    user: User | null;
}

const ProfileEdit = ({ user }: ProfileEditProps) => {
    const profileImageSource = user?.avatar
        ? { uri: user.avatar }
        : require("../../../assets/images/profile.png");

    return (
        <View className="bg-primary-100 p-4 flex-row items-start rounded-xl">
            <View className="flex-1 flex-row items-center gap-x-3">
                <View className="w-14">
                    <Image
                        source={profileImageSource}
                        className="w-full h-14 object-cover rounded-full"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium text-black">
                        Hi, {user?.name || "User"}
                    </Text>
                    <Text className="text-sm text-black-400">
                        {user?.email || "email@example.com"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() =>
                    router.push("/patient/profile/edit-personal-information")
                }
                className="flex-row items-center gap-x-1.5"
            >
                <Text className="text-sm text-black-400 font-medium">Edit</Text>
                <Feather name="edit" size={11} className="text-black-400" />
            </TouchableOpacity>
        </View>
    );
};

export default ProfileEdit;
