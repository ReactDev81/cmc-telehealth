import * as DocumentPicker from "expo-document-picker";
import { useRef } from "react";
import { useController } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

interface FileData {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

const FileUploadField = ({ name, control, label, className, multiple = false }: any) => {
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
        multiple: multiple,
      });

      if (!result.canceled && result.assets?.length) {
        const assets = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
          size: asset.size,
        }));

        if (multiple) {
          // If multiple is enabled, we Append to existing list or just replace?
          // Usually better to replace with the new selection or append.
          // Let's replace for simplicity unless user wants to add more.
          // Actually, let's allow appending if there's already some value.
          const newValue = Array.isArray(value) ? [...value, ...assets] : assets;
          onChange(newValue);
        } else {
          onChange(assets[0]);
        }
      }
    } catch (err) {
      // console.error("File picking error:", err);
    } finally {
      isPickingRef.current = false; // 🔓 unlock
    }
  };

  const displayValue = () => {
    if (!value) return "Choose File";
    if (Array.isArray(value)) {
      return value.length > 0
        ? `${value.length} file(s) selected: ${value.map((f: any) => f.name).join(", ")}`
        : "Choose File";
    }
    return value.name || "Choose File";
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
        <Text numberOfLines={1}>{displayValue()}</Text>
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