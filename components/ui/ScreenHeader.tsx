import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'

interface ScreenHeaderProps {
    title: string
    onBack?: () => void
    showBorder?: boolean
}

export const ScreenHeader = ({ title, onBack, showBorder = true }: ScreenHeaderProps) => {
    const router = useRouter()

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            router.back()
        }
    }

    return (
        <View className={`bg-white ${showBorder ? 'border-b border-gray-200' : ''}`}>
            {/* Status Bar Space - adjust height based on your needs */}
            <View className="h-12" />
            
            {/* Header Content */}
            <View className="flex-row items-center px-5 py-4">
                <TouchableOpacity 
                    onPress={handleBack}
                    className="mr-3"
                    activeOpacity={0.7}
                >
                    <ChevronLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-black flex-1">
                    {title}
                </Text>
            </View>
        </View>
    )
}

export default ScreenHeader