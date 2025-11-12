import { View, Text, TouchableOpacity } from 'react-native';
import { Info } from 'lucide-react-native';

interface NotificationCardProps {
    title: string;
    description: string;
    time: string;
    onPress?: () => void;
}

export function NotificationCard({ title, description, time, onPress }: NotificationCardProps) {
    const Content = (
        <View className="flex-row gap-x-4 items-start bg-white border-b border-[#EDEDED] pb-6 mt-5">

            {/* Icon Circle */}
            <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                <Info size={24} color='#1F1E1E' />
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="text-base font-medium text-black mb-0.5">
                    {title}
                </Text>
                <Text className="text-sm text-black-400" numberOfLines={2}>
                    {description}
                </Text>
            </View>

            {/* Time */}
            <Text className="text-xs text-gray">
                {time}
            </Text>
        </View>
    );

    if (onPress) {
        return(
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {Content}
            </TouchableOpacity>
        );
    }

    return Content;
}