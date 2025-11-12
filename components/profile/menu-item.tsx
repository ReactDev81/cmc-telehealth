import { View, Text, TouchableOpacity } from "react-native"
import { ChevronRight } from 'lucide-react-native'

interface MenuItemProps {
    icon: React.ReactNode
    title: string
    description: string
    onPress: () => void
    showBorder?: boolean
    iconBgColor?: string
}

const MenuItem = ({ icon, title, description, onPress, showBorder = true, iconBgColor = 'bg-primary-100' }: MenuItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center bg-white px-4 py-4 ${showBorder ? 'border-b border-black-200' : ''}`}
            activeOpacity={0.7}
        >
            {/* Icon Container */}
            <View className={`w-12 h-12 rounded-full ${iconBgColor} items-center justify-center`}>
                {icon}
            </View>
            
            {/* Text Content */}
            <View className="flex-1 ml-4">
                <Text className="text-sm font-medium text-black">
                    {title}
                </Text>
                <Text className="text-sm text-black-400 mt-1">
                    {description}
                </Text>
            </View>

            {/* Chevron Arrow */}
            <ChevronRight size={20} className="text-black" />
        </TouchableOpacity>
    )
}

export default MenuItem