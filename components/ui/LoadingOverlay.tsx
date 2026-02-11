import { ActivityIndicator, Modal, Text, View } from 'react-native';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

const LoadingOverlay = ({ visible, message = "Processing..." }: LoadingOverlayProps) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            statusBarTranslucent
        >
            <View className="flex-1 items-center justify-center bg-black/50">
                <View className="bg-white p-6 rounded-2xl items-center shadow-lg">
                    <ActivityIndicator size="large" color="#013220" />
                    {message && (
                        <Text className="mt-4 text-black font-medium text-base">
                            {message}
                        </Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default LoadingOverlay;
