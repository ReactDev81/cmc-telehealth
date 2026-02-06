import * as DocumentPicker from "expo-document-picker";
import { useRef } from "react";
import { useController } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

const FileUploadField = ({ name, control, label, className }: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const isPickingRef = useRef(false); // 🔒 lock

  const handlePickFile = async () => {
    if (isPickingRef.current) return; // 🚫 block duplicate calls
    isPickingRef.current = true;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length) {
        const asset = result.assets[0];

        onChange({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
          size: asset.size,
        });
      }
    } catch (err) {
      // console.error("File picking error:", err);
    } finally {
      isPickingRef.current = false; // 🔓 unlock
    }
  };

  return (
    <View className={className}>
      {label && <Text className="text-sm text-black mb-1.5">{label}</Text>}

      <TouchableOpacity
        onPress={handlePickFile}
        disabled={isPickingRef.current} // 🔒 disable UI
        className={`border rounded-lg py-3 px-4 ${error ? "border-red-500" : "border-gray-300"
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