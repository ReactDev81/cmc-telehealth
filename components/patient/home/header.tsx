import { useAuth } from '@/context/UserContext';
import { useUnreadNotificationCount } from '@/queries/common/useUnreadNotificationCount';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { Bell, ChevronDown, MapPin } from 'lucide-react-native';
import { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    insets?: { top?: number };
}

const Header = ({ insets }: HeaderProps) => {

    const { user } = useAuth();
    const { data, refetch } = useUnreadNotificationCount();
    const unreadCount = data?.data.unread_count ?? 0;

    const profileImageSource = user?.avatar
        ? { uri: user.avatar }
        : require("../../../assets/images/user.png");

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
          refetch();
        }
    }, [isFocused, refetch]);

    return (
        <View
            className="bg-primary px-4"
            style={{
                paddingTop: (insets?.top ?? 0) + 5,
                
            }}
        >

            {/* Top Section */}
            <View className="flex-row items-center justify-between mb-4 pt-2">

                <View className="flex-row items-center gap-x-2">
                    <View>
                        <Image
                            source={profileImageSource}
                            className="w-11 h-11 object-cover rounded-full"
                        />
                    </View>
                    <View>
                        <Text className="text-white text-base font-medium">
                            {`${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || ' '}
                        </Text>
                        <TouchableOpacity 
                            className="flex-row items-center gap-1 mt-0.5"
                            onPress={() => router.push('/patient/profile/manage-address')}
                        >
                            <MapPin color="#fff" size={16} />
                            <Text className="text-white text-sm">
                                {user?.address?.address ? user?.address?.address : 'Add your Address'}
                            </Text>
                            <ChevronDown size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.push('/common-screens/notifications')} className="relative p-2 rounded-full">
                        <Bell size={24} color="white" />
                        <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full items-center justify-center">
                            <Text className="text-primary text-xs font-bold">{unreadCount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

export default Header;