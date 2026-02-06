import { AlertCircle, Chrome, Eye } from 'lucide-react-native';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface ViewOptionsModalProps {
    visible: boolean;
    fileName: string;
    onViewInApp: () => void;
    onViewInBrowser: () => void;
    onClose: () => void;
}

export default function ViewOptionsModal({
    visible,
    fileName,
    onViewInApp,
    onViewInBrowser,
    onClose,
}: ViewOptionsModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center">
                <View className="bg-white rounded-2xl w-4/5 p-6 shadow-lg">
                    {/* Header */}
                    <View className="flex-row items-center mb-4">
                        <AlertCircle size={24} color="#3B82F6" />
                        <Text className="text-xl font-bold text-gray-900 ml-3">
                            View Report
                        </Text>
                    </View>

                    {/* File name */}
                    <Text className="text-gray-600 text-sm mb-6 bg-gray-50 p-3 rounded">
                        {fileName}
                    </Text>

                    {/* Options */}
                    <Text className="text-gray-700 font-semibold mb-4">
                        How would you like to view this file?
                    </Text>

                    {/* View in App Button */}
                    <TouchableOpacity
                        onPress={onViewInApp}
                        className="flex-row items-center bg-blue-600 rounded-lg p-4 mb-3"
                    >
                        <Eye size={20} color="white" />
                        <Text className="text-white font-semibold ml-3 flex-1">
                            View in App
                        </Text>
                    </TouchableOpacity>

                    {/* View in Browser Button */}
                    <TouchableOpacity
                        onPress={onViewInBrowser}
                        className="flex-row items-center bg-gray-600 rounded-lg p-4 mb-4"
                    >
                        <Chrome size={20} color="white" />
                        <Text className="text-white font-semibold ml-3 flex-1">
                            View in Browser
                        </Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-gray-200 rounded-lg p-3"
                    >
                        <Text className="text-gray-800 font-semibold text-center">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
