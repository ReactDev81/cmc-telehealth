import { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, ChevronDown } from 'lucide-react-native';
import SearchBar from '@/components/form/search';

const Header = () => {

    const [location, setLocation] = useState('Ludhiana 141001');

    return (
        <View className="bg-primary px-4 py-4">

            {/* Top Section */}
            <View className="flex-row items-center justify-between mb-4">
                <View className=" items-center gap-2">
                    <Text className="text-white text-base font-medium">
                        Find Doctors near
                    </Text>
                    <TouchableOpacity className="flex-row items-center gap-1">
                        <Text className="text-white text-sm">{location}</Text>
                        <ChevronDown size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.push('/common-screens/notifications')} className="relative p-2 rounded-full">
                        <Bell size={24} color="white" />
                        <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full items-center justify-center">
                            <Text className="text-blue-600 text-xs font-bold">2</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <SearchBar 
                variant="primary"
                placeholder="Search for Doctors / Specialist"
            />

        </View>
    );
};

export default Header;