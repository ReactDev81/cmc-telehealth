import { Info } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface NotificationCardProps {
    title: string;
    description: string;
    time: string;
    read: boolean;
    onPress?: () => void;
}

export function NotificationCard({ title, description, time, read, onPress }: NotificationCardProps) {
    const Content = (
        <View className={`flex-row gap-x-4 items-start ${read ? 'bg-white' : 'bg-primary-200'} border-b border-black-200 p-5`}>

            {/* Icon Circle */}
            <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                <Info size={24} color='#1F1E1E' />
            </View>

            {/* Content */}
            <View className="flex-1 pr-2">
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