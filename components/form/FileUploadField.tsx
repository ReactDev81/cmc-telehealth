import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";

interface FileUploadFieldProps {
    label?: string;
    onFileSelect?: (file: DocumentPicker.DocumentPickerAsset | null) => void;
    className?: string
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, onFileSelect, className = "" }) => {

    const [selectedFile, setSelectedFile] = useState<string>("No file chosen");

    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setSelectedFile(file.name);
                onFileSelect?.(file);
            } else {
                onFileSelect?.(null);
            }
        } catch (error) {
            console.error("File pick error:", error);
        }
    };

    return (
        <View className={`mb-4 ${className}`}>
            {label && <Text className="text-gray-700 mb-2">{label}</Text>}

            <TouchableOpacity
                onPress={handleFilePick}
                activeOpacity={1}
                className="flex-row items-center border border-gray rounded-md overflow-hidden"
            >

                <View className="bg-gray-100 px-4 py-3">
                    <Text className="text-black-400 text-sm">Choose File</Text>
                </View>

                < View className="flex-1 px-3 py-3">
                    <Text
                        className="text-black-400 text-sm"
                        numberOfLines={1}
                    >
                        {selectedFile}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default FileUploadField;