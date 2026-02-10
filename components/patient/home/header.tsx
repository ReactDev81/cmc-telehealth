import { useAuth } from '@/context/UserContext';
import { usePatientAddress } from '@/queries/patient/usePatientAddress';
import { usePatientProfile } from '@/queries/patient/usePatientProfile';
import { router } from 'expo-router';
import { Bell, ChevronDown, MapPin } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    insets?: { top?: number };
}

const Header = ({ insets }: HeaderProps) => {

    const { user, token } = useAuth();
    const { data: profile } = usePatientProfile(user?.id!, token!);
    const { data: addressData } = usePatientAddress(user?.id);

    return (
        <View
            className="bg-primary px-4"
            style={{
                paddingTop: (insets?.top ?? 0) + 5,
                
            }}
        >

            {/* Top Section */}
            <View className="flex-row items-center justify-between mb-4 pt-2">

                <View className="flex-row items-center gap-2">
                    <View>
                        <Image
                            source={profile?.avatar ? { uri: profile.avatar } : require("../../../assets/images/demo.jpg")}
                            className="w-11 h-11 rounded-full"
                        />
                    </View>
                    <View>
                        <Text className="text-white text-base font-medium">
                            {profile && `${profile.first_name} ${profile.last_name}`}
                        </Text>
                        <TouchableOpacity 
                            className="flex-row items-center gap-1 mt-0.5"
                            onPress={() => router.push('/patient/profile/manage-address')}
                        >
                            <MapPin color="#fff" size={16} />
                            <Text className="text-white text-sm">{addressData?.data?.address}</Text>
                            <ChevronDown size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.push('/common-screens/notifications')} className="relative p-2 rounded-full">
                        <Bell size={24} color="white" />
                        <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full items-center justify-center">
                            <Text className="text-primary text-xs font-bold">2</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

export default Header;