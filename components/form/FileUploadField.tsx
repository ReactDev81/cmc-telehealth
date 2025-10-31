import { Controller } from "react-hook-form";
import { View, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";

type FileUploadFieldProps = {
    name: string;
    control: any;
    label?: string;
    error?: string;
    className?: string;
};

const FileUploadField = ({
    name,
    control,
    label,
    error,
    className,
}: FileUploadFieldProps) => {

    // Function to handle picking a file
    const handlePickFile = async (onChange: (file: any) => void) => {
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
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange } }) => (
                <View className={className}>

                    {label && <Text className="mb-1 text-gray-700">{label}</Text>}

                    <TouchableOpacity
                        onPress={() => handlePickFile(onChange)}
                        className="border border-gray-300 rounded-lg py-3 px-4"
                    >
                        <Text>{value?.name || "Choose File"}</Text>
                    </TouchableOpacity>

                    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
                </View>
            )}
        />
    );
};

export default FileUploadField;
