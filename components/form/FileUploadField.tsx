import { View, Text, TouchableOpacity } from "react-native";
import { useController } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";

type FileUploadFieldProps = {
    name: string;
    control: any;
    label?: string;
    className?: string;
};

const FileUploadField = ({
    name,
    control,
    label,
    className,
}: FileUploadFieldProps) => {

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                onChange(result.assets[0]); 
            }
        } catch (err) {
            console.error("File picking error:", err);
        }
    };

    return (
        <View className={className}>
            {label && (
                <Text className="text-sm text-black mb-1.5">{label}</Text>
            )}

            <TouchableOpacity
                onPress={handlePickFile}
                className={`border rounded-lg py-3 px-4 ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            >
                <Text>{value?.name || "Choose File"}</Text>
            </TouchableOpacity>

            {error && (
                <Text className="text-xs text-red-600 mt-1">
                    {error.message}
                </Text>
            )}
        </View>
    );
};

export default FileUploadField;