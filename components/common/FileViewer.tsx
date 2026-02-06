import { ExternalLink, X } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FileViewerProps {
    visible: boolean;
    fileUri: string;
    fileName: string;
    mimeType?: string;
    onClose: () => void;
}

export default function FileViewer({
    visible,
    fileUri,
    fileName,
    mimeType = 'application/octet-stream',
    onClose,
}: FileViewerProps) {
    const [loading, setLoading] = useState(false);

    const isPDF = mimeType === 'application/pdf' || fileName.endsWith('.pdf');
    const isImage = mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(fileName);

    const handleOpenInBrowser = async () => {
        try {
            // For local URIs, we may need to convert to a URL the browser can access
            // For now, we'll attempt to open the URI directly
            const canOpen = await Linking.canOpenURL(fileUri);
            if (canOpen) {
                await Linking.openURL(fileUri);
            } else {
                Alert.alert('Error', 'Cannot open this file in browser');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open file in browser');
            // console.error('Error opening in browser:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row justify-between items-center bg-blue-600 px-4 py-3">
                    <Text className="flex-1 text-white font-semibold text-base truncate">
                        {fileName}
                    </Text>
                    <TouchableOpacity
                        onPress={handleOpenInBrowser}
                        className="mr-3"
                    >
                        <ExternalLink size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView className="flex-1 bg-gray-100">
                    {isImage ? (
                        <View className="flex-1 justify-center items-center">
                            <Image
                                source={{ uri: fileUri }}
                                style={{ width: '100%', height: 400, resizeMode: 'contain' }}
                                onLoadStart={() => setLoading(true)}
                                onLoadEnd={() => setLoading(false)}
                            />
                            {loading && (
                                <ActivityIndicator
                                    size="large"
                                    color="blue"
                                    style={{ position: 'absolute' }}
                                />
                            )}
                        </View>
                    ) : isPDF ? (
                        <View className="flex-1 justify-center items-center p-4">
                            <Text className="text-lg text-gray-700 font-semibold mb-4">
                                PDF File
                            </Text>
                            <Text className="text-gray-600 text-center mb-6">
                                {fileName}
                            </Text>
                            <TouchableOpacity
                                onPress={handleOpenInBrowser}
                                className="bg-blue-600 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-white font-semibold text-center">
                                    Open in Browser
                                </Text>
                            </TouchableOpacity>
                            <Text className="text-gray-500 text-sm text-center mt-4 px-4">
                                PDF preview requires opening in browser or a dedicated PDF viewer app.
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-1 justify-center items-center p-4">
                            <Text className="text-lg text-gray-700 font-semibold mb-4">
                                File Viewer
                            </Text>
                            <Text className="text-gray-600 text-center mb-6">
                                {fileName}
                            </Text>
                            <Text className="text-gray-500 text-sm text-center mb-6">
                                File type: {mimeType}
                            </Text>
                            <TouchableOpacity
                                onPress={handleOpenInBrowser}
                                className="bg-blue-600 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-white font-semibold text-center">
                                    Open File
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {/* Footer with options */}
                <View className="bg-gray-50 border-t border-gray-200 px-4 py-3">
                    <TouchableOpacity
                        onPress={handleOpenInBrowser}
                        className="bg-blue-600 py-3 rounded-lg mb-2"
                    >
                        <Text className="text-white font-semibold text-center">
                            Open in Browser
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-gray-300 py-3 rounded-lg"
                    >
                        <Text className="text-gray-800 font-semibold text-center">
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
